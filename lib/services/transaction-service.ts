import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'
import { pushNotificationService } from './push-notification-service'
import { analyticsService } from './analytics-service'

type Transaction = Database['public']['Tables']['transactions']['Row']
type TransactionInsert = Database['public']['Tables']['transactions']['Insert']

export class TransactionService {
  private supabase = createClient()

  async createTransaction(data: TransactionInsert): Promise<Transaction> {
    const { data: transaction, error } = await this.supabase
      .from('transactions')
      .insert({
        ...data,
        reference: data.reference || this.generateReference(),
        fee: this.calculateFee(data.amount, data.type),
        commission: this.calculateCommission(data.amount, data.type)
      })
      .select()
      .single()

    if (error) throw error

    // Track analytics
    await analyticsService.track('transaction_created', {
      transaction_id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      network: transaction.network
    }, data.user_id)

    return transaction
  }

  async updateTransactionStatus(
    transactionId: string, 
    status: Transaction['status'], 
    metadata?: any
  ): Promise<Transaction> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    if (metadata) {
      updateData.metadata = metadata
    }

    const { data: transaction, error } = await this.supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select()
      .single()

    if (error) throw error

    // Send notification
    await this.sendTransactionNotification(transaction)

    // Track analytics
    await analyticsService.track('transaction_status_updated', {
      transaction_id: transactionId,
      status,
      type: transaction.type
    }, transaction.user_id)

    return transaction
  }

  async processAirtimeTopup(
    userId: string,
    amount: number,
    recipient: string,
    network: string
  ): Promise<Transaction> {
    // Check wallet balance
    const { data: user } = await this.supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single()

    if (!user || user.wallet_balance < amount) {
      throw new Error('Insufficient wallet balance')
    }

    // Create transaction
    const transaction = await this.createTransaction({
      user_id: userId,
      type: 'airtime',
      amount,
      recipient,
      network,
      reference: this.generateReference(),
      description: `Airtime topup for ${recipient}`,
      status: 'pending'
    })

    // Debit wallet
    await this.debitWallet(userId, amount)

    // Process with external provider (mock for now)
    setTimeout(async () => {
      try {
        const success = await this.processWithProvider('airtime', {
          amount,
          recipient,
          network,
          reference: transaction.reference
        })

        if (success) {
          await this.updateTransactionStatus(transaction.id, 'completed')
        } else {
          await this.updateTransactionStatus(transaction.id, 'failed')
          await this.creditWallet(userId, amount) // Refund
        }
      } catch (error) {
        await this.updateTransactionStatus(transaction.id, 'failed')
        await this.creditWallet(userId, amount) // Refund
      }
    }, 2000)

    return transaction
  }

  async processDataTopup(
    userId: string,
    amount: number,
    recipient: string,
    network: string,
    planCode: string
  ): Promise<Transaction> {
    // Check wallet balance
    const { data: user } = await this.supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single()

    if (!user || user.wallet_balance < amount) {
      throw new Error('Insufficient wallet balance')
    }

    // Get plan details
    const { data: plan } = await this.supabase
      .from('data_plans')
      .select('*')
      .eq('plan_code', planCode)
      .eq('network', network)
      .single()

    if (!plan) {
      throw new Error('Invalid data plan')
    }

    // Create transaction
    const transaction = await this.createTransaction({
      user_id: userId,
      type: 'data',
      amount,
      recipient,
      network,
      reference: this.generateReference(),
      description: `${plan.plan_name} data for ${recipient}`,
      status: 'pending',
      metadata: {
        plan_code: planCode,
        plan_name: plan.plan_name,
        data_amount: plan.data_amount,
        validity: plan.validity
      }
    })

    // Debit wallet
    await this.debitWallet(userId, amount)

    // Process with external provider
    setTimeout(async () => {
      try {
        const success = await this.processWithProvider('data', {
          amount,
          recipient,
          network,
          planCode,
          reference: transaction.reference
        })

        if (success) {
          await this.updateTransactionStatus(transaction.id, 'completed')
        } else {
          await this.updateTransactionStatus(transaction.id, 'failed')
          await this.creditWallet(userId, amount) // Refund
        }
      } catch (error) {
        await this.updateTransactionStatus(transaction.id, 'failed')
        await this.creditWallet(userId, amount) // Refund
      }
    }, 2000)

    return transaction
  }

  async processCableSubscription(
    userId: string,
    amount: number,
    smartCardNumber: string,
    provider: string,
    packageName: string
  ): Promise<Transaction> {
    // Check wallet balance
    const { data: user } = await this.supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single()

    if (!user || user.wallet_balance < amount) {
      throw new Error('Insufficient wallet balance')
    }

    // Create transaction
    const transaction = await this.createTransaction({
      user_id: userId,
      type: 'cable',
      amount,
      recipient: smartCardNumber,
      network: provider,
      reference: this.generateReference(),
      description: `${packageName} subscription for ${smartCardNumber}`,
      status: 'pending',
      metadata: {
        provider,
        smart_card_number: smartCardNumber,
        package: packageName
      }
    })

    // Debit wallet
    await this.debitWallet(userId, amount)

    // Process with external provider
    setTimeout(async () => {
      try {
        const success = await this.processWithProvider('cable', {
          amount,
          smartCardNumber,
          provider,
          packageName,
          reference: transaction.reference
        })

        if (success) {
          await this.updateTransactionStatus(transaction.id, 'completed')
        } else {
          await this.updateTransactionStatus(transaction.id, 'failed')
          await this.creditWallet(userId, amount) // Refund
        }
      } catch (error) {
        await this.updateTransactionStatus(transaction.id, 'failed')
        await this.creditWallet(userId, amount) // Refund
      }
    }, 2000)

    return transaction
  }

  async processElectricityPayment(
    userId: string,
    amount: number,
    meterNumber: string,
    provider: string
  ): Promise<Transaction> {
    // Check wallet balance
    const { data: user } = await this.supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', userId)
      .single()

    if (!user || user.wallet_balance < amount) {
      throw new Error('Insufficient wallet balance')
    }

    // Create transaction
    const transaction = await this.createTransaction({
      user_id: userId,
      type: 'electricity',
      amount,
      recipient: meterNumber,
      network: provider,
      reference: this.generateReference(),
      description: `Electricity payment for meter ${meterNumber}`,
      status: 'pending',
      metadata: {
        provider,
        meter_number: meterNumber
      }
    })

    // Debit wallet
    await this.debitWallet(userId, amount)

    // Process with external provider
    setTimeout(async () => {
      try {
        const success = await this.processWithProvider('electricity', {
          amount,
          meterNumber,
          provider,
          reference: transaction.reference
        })

        if (success) {
          await this.updateTransactionStatus(transaction.id, 'completed', {
            units: Math.floor(amount / 50), // Mock units calculation
            token: this.generateToken()
          })
        } else {
          await this.updateTransactionStatus(transaction.id, 'failed')
          await this.creditWallet(userId, amount) // Refund
        }
      } catch (error) {
        await this.updateTransactionStatus(transaction.id, 'failed')
        await this.creditWallet(userId, amount) // Refund
      }
    }, 2000)

    return transaction
  }

  private async processWithProvider(type: string, data: any): Promise<boolean> {
    // Mock external provider integration
    // In production, integrate with actual providers like VTPass, Baxi, etc.
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Simulate 95% success rate
    return Math.random() > 0.05
  }

  private async debitWallet(userId: string, amount: number): Promise<void> {
    const { error } = await this.supabase.rpc('debit_wallet', {
      user_id: userId,
      amount
    })

    if (error) throw error
  }

  private async creditWallet(userId: string, amount: number): Promise<void> {
    const { error } = await this.supabase.rpc('credit_wallet', {
      user_id: userId,
      amount
    })

    if (error) throw error
  }

  private calculateFee(amount: number, type: string): number {
    // Fee calculation logic
    const feeRates = {
      airtime: 0.01, // 1%
      data: 0.005, // 0.5%
      cable: 0.02, // 2%
      electricity: 0.015, // 1.5%
      wallet_funding: 0.015, // 1.5%
      transfer: 0.01 // 1%
    }

    const rate = feeRates[type as keyof typeof feeRates] || 0.01
    return Math.round(amount * rate)
  }

  private calculateCommission(amount: number, type: string): number {
    // Commission calculation logic
    const commissionRates = {
      airtime: 0.02, // 2%
      data: 0.015, // 1.5%
      cable: 0.03, // 3%
      electricity: 0.025, // 2.5%
      wallet_funding: 0,
      transfer: 0
    }

    const rate = commissionRates[type as keyof typeof commissionRates] || 0
    return Math.round(amount * rate)
  }

  generateReference(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `VT${timestamp}${random}`
  }

  private generateToken(): string {
    return Math.random().toString().substring(2, 22)
  }

  private async sendTransactionNotification(transaction: Transaction): Promise<void> {
    let title = ''
    let message = ''

    switch (transaction.status) {
      case 'completed':
        title = 'Transaction Successful'
        message = `Your ${transaction.type} transaction of ₦${transaction.amount} was successful`
        break
      case 'failed':
        title = 'Transaction Failed'
        message = `Your ${transaction.type} transaction of ₦${transaction.amount} failed`
        break
      case 'pending':
        title = 'Transaction Pending'
        message = `Your ${transaction.type} transaction of ₦${transaction.amount} is being processed`
        break
    }

    await pushNotificationService.sendNotification(
      transaction.user_id,
      title,
      message,
      {
        transaction_id: transaction.id,
        type: transaction.type,
        url: `/dashboard/history/${transaction.id}`
      }
    )
  }

  async getUserTransactions(
    userId: string,
    limit = 50,
    offset = 0,
    filters?: {
      type?: string
      status?: string
      startDate?: string
      endDate?: string
    }
  ): Promise<Transaction[]> {
    let query = this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (filters?.type) {
      query = query.eq('type', filters.type)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate)
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  async getTransactionById(transactionId: string): Promise<Transaction | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single()

    if (error) throw error
    return data
  }

  async getTransactionStats(userId: string): Promise<{
    totalTransactions: number
    totalSpent: number
    successRate: number
    monthlySpending: number
  }> {
    const { data, error } = await this.supabase.rpc('get_user_stats', {
      user_id: userId
    })

    if (error) throw error

    const stats = data[0] || {
      total_transactions: 0,
      total_spent: 0,
      wallet_balance: 0
    }

    // Calculate success rate
    const { data: transactions } = await this.supabase
      .from('transactions')
      .select('status')
      .eq('user_id', userId)

    const successRate = transactions?.length 
      ? (transactions.filter(t => t.status === 'completed').length / transactions.length) * 100
      : 0

    // Calculate monthly spending
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: monthlyTxns } = await this.supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .gte('created_at', startOfMonth.toISOString())

    const monthlySpending = monthlyTxns?.reduce((sum, txn) => sum + txn.amount, 0) || 0

    return {
      totalTransactions: stats.total_transactions,
      totalSpent: stats.total_spent,
      successRate: Math.round(successRate),
      monthlySpending
    }
  }
}

export const transactionService = new TransactionService()
