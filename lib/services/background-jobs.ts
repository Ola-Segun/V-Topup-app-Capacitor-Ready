import { createClient } from '@/lib/supabase/client'
import { transactionService } from './transaction-service'
import { emailService } from './email-service'
import { smsService } from './sms-service'
import { pushNotificationService } from './push-notification-service'
import { analyticsService } from './analytics-service'

class BackgroundJobsService {
  private supabase = createClient()
  private isRunning = false
  private intervals: NodeJS.Timeout[] = []

  async start() {
    if (this.isRunning) return
    
    this.isRunning = true
    console.log('Starting background jobs...')

    // Start all background jobs
    this.startScheduledTransactions()
    this.startTransactionCleanup()
    this.startNotificationCleanup()
    this.startBudgetReset()
    this.startAnalyticsAggregation()
    this.startSystemHealthCheck()
    this.startFailedTransactionRetry()
    this.startLowBalanceAlerts()
    this.startWeeklyReports()
  }

  async stop() {
    if (!this.isRunning) return
    
    this.isRunning = false
    console.log('Stopping background jobs...')

    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval))
    this.intervals = []
  }

  // Process scheduled transactions every minute
  private startScheduledTransactions() {
    const interval = setInterval(async () => {
      try {
        await this.processScheduledTransactions()
      } catch (error) {
        console.error('Error processing scheduled transactions:', error)
      }
    }, 60000) // Every minute

    this.intervals.push(interval)
  }

  private async processScheduledTransactions() {
    const { data: scheduledTransactions } = await this.supabase
      .from('scheduled_transactions')
      .select('*')
      .eq('status', 'active')
      .lte('next_run_date', new Date().toISOString().split('T')[0])

    if (!scheduledTransactions) return

    for (const scheduled of scheduledTransactions) {
      try {
        // Execute the scheduled transaction
        await this.executeScheduledTransaction(scheduled)

        // Update next run date
        const nextRunDate = this.calculateNextRunDate(scheduled.frequency, new Date())
        
        await this.supabase
          .from('scheduled_transactions')
          .update({
            last_run_date: new Date().toISOString().split('T')[0],
            next_run_date: nextRunDate,
            run_count: scheduled.run_count + 1,
            status: scheduled.max_runs && scheduled.run_count + 1 >= scheduled.max_runs ? 'completed' : 'active'
          })
          .eq('id', scheduled.id)

      } catch (error) {
        console.error(`Error executing scheduled transaction ${scheduled.id}:`, error)
        
        // Mark as failed if too many failures
        await this.supabase
          .from('scheduled_transactions')
          .update({ status: 'failed' })
          .eq('id', scheduled.id)
      }
    }
  }

  private async executeScheduledTransaction(scheduled: any) {
    switch (scheduled.transaction_type) {
      case 'airtime':
        await transactionService.processAirtimeTopup(
          scheduled.user_id,
          scheduled.amount,
          scheduled.recipient,
          scheduled.metadata.network
        )
        break
      case 'data':
        await transactionService.processDataTopup(
          scheduled.user_id,
          scheduled.amount,
          scheduled.recipient,
          scheduled.metadata.network,
          scheduled.metadata.plan_code
        )
        break
      case 'transfer':
        // Handle wallet transfers
        break
      default:
        throw new Error(`Unsupported scheduled transaction type: ${scheduled.transaction_type}`)
    }
  }

  private calculateNextRunDate(frequency: string, currentDate: Date): string {
    const nextDate = new Date(currentDate)
    
    switch (frequency) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1)
        break
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      case 'quarterly':
        nextDate.setMonth(nextDate.getMonth() + 3)
        break
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1)
        break
      default:
        throw new Error(`Unsupported frequency: ${frequency}`)
    }
    
    return nextDate.toISOString().split('T')[0]
  }

  // Clean up old transactions every hour
  private startTransactionCleanup() {
    const interval = setInterval(async () => {
      try {
        await this.cleanupOldTransactions()
      } catch (error) {
        console.error('Error cleaning up transactions:', error)
      }
    }, 3600000) // Every hour

    this.intervals.push(interval)
  }

  private async cleanupOldTransactions() {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 90) // Keep 90 days

    // Archive old completed transactions
    await this.supabase
      .from('transactions_archive')
      .insert(
        await this.supabase
          .from('transactions')
          .select('*')
          .eq('status', 'completed')
          .lt('created_at', cutoffDate.toISOString())
      )

    // Delete archived transactions from main table
    await this.supabase
      .from('transactions')
      .delete()
      .eq('status', 'completed')
      .lt('created_at', cutoffDate.toISOString())
  }

  // Clean up old notifications every day
  private startNotificationCleanup() {
    const interval = setInterval(async () => {
      try {
        await this.cleanupOldNotifications()
      } catch (error) {
        console.error('Error cleaning up notifications:', error)
      }
    }, 86400000) // Every day

    this.intervals.push(interval)
  }

  private async cleanupOldNotifications() {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 30) // Keep 30 days

    await this.supabase
      .from('notifications')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
  }

  // Reset budgets based on their period
  private startBudgetReset() {
    const interval = setInterval(async () => {
      try {
        await this.resetBudgets()
      } catch (error) {
        console.error('Error resetting budgets:', error)
      }
    }, 3600000) // Every hour

    this.intervals.push(interval)
  }

  private async resetBudgets() {
    const now = new Date()
    
    // Get budgets that need reset
    const { data: budgets } = await this.supabase
      .from('budgets')
      .select('*')
      .eq('is_active', true)
      .eq('auto_reset', true)

    if (!budgets) return

    for (const budget of budgets) {
      const lastReset = budget.last_reset_at ? new Date(budget.last_reset_at) : new Date(budget.created_at)
      let shouldReset = false

      switch (budget.period) {
        case 'daily':
          shouldReset = now.getDate() !== lastReset.getDate()
          break
        case 'weekly':
          const weeksDiff = Math.floor((now.getTime() - lastReset.getTime()) / (7 * 24 * 60 * 60 * 1000))
          shouldReset = weeksDiff >= 1
          break
        case 'monthly':
          shouldReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()
          break
        case 'yearly':
          shouldReset = now.getFullYear() !== lastReset.getFullYear()
          break
      }

      if (shouldReset) {
        await this.supabase
          .from('budgets')
          .update({
            spent: 0,
            last_reset_at: now.toISOString()
          })
          .eq('id', budget.id)
      }
    }
  }

  // Aggregate analytics data every hour
  private startAnalyticsAggregation() {
    const interval = setInterval(async () => {
      try {
        await this.aggregateAnalytics()
      } catch (error) {
        console.error('Error aggregating analytics:', error)
      }
    }, 3600000) // Every hour

    this.intervals.push(interval)
  }

  private async aggregateAnalytics() {
    const now = new Date()
    const hourAgo = new Date(now.getTime() - 3600000)

    // Aggregate transaction data
    const { data: transactions } = await this.supabase
      .from('transactions')
      .select('transaction_type, amount, status, created_at')
      .gte('created_at', hourAgo.toISOString())
      .lt('created_at', now.toISOString())

    if (transactions && transactions.length > 0) {
      // Calculate metrics
      const metrics = {
        total_transactions: transactions.length,
        total_amount: transactions.reduce((sum, t) => sum + t.amount, 0),
        successful_transactions: transactions.filter(t => t.status === 'completed').length,
        failed_transactions: transactions.filter(t => t.status === 'failed').length,
        by_type: transactions.reduce((acc, t) => {
          acc[t.transaction_type] = (acc[t.transaction_type] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }

      // Store aggregated data
      await this.supabase
        .from('analytics_hourly')
        .insert({
          hour: hourAgo.toISOString(),
          metrics
        })
    }
  }

  // System health check every 5 minutes
  private startSystemHealthCheck() {
    const interval = setInterval(async () => {
      try {
        await this.performHealthCheck()
      } catch (error) {
        console.error('Error performing health check:', error)
      }
    }, 300000) // Every 5 minutes

    this.intervals.push(interval)
  }

  private async performHealthCheck() {
    const checks = [
      this.checkDatabaseConnection(),
      this.checkPaymentGateways(),
      this.checkVTUProviders(),
      this.checkNotificationServices()
    ]

    const results = await Promise.allSettled(checks)
    
    // Create system alerts for failed checks
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      if (result.status === 'rejected') {
        await this.createSystemAlert('error', `Health check failed: ${result.reason}`)
      }
    }
  }

  private async checkDatabaseConnection() {
    const { error } = await this.supabase.from('users').select('id').limit(1)
    if (error) throw new Error(`Database connection failed: ${error.message}`)
  }

  private async checkPaymentGateways() {
    // Check Paystack
    try {
      const response = await fetch('https://api.paystack.co/bank', {
        headers: { 'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
      })
      if (!response.ok) throw new Error('Paystack API unreachable')
    } catch (error) {
      throw new Error(`Paystack health check failed: ${error}`)
    }
  }

  private async checkVTUProviders() {
    // Check VTPass
    try {
      const response = await fetch('https://vtpass.com/api/service-variations?serviceID=mtn', {
        headers: {
          'api-key': process.env.VTPASS_API_KEY || '',
          'secret-key': process.env.VTPASS_SECRET_KEY || ''
        }
      })
      if (!response.ok) throw new Error('VTPass API unreachable')
    } catch (error) {
      throw new Error(`VTPass health check failed: ${error}`)
    }
  }

  private async checkNotificationServices() {
    // Check email service
    try {
      await emailService.checkBalance()
    } catch (error) {
      throw new Error(`Email service health check failed: ${error}`)
    }

    // Check SMS service
    try {
      await smsService.checkBalance()
    } catch (error) {
      throw new Error(`SMS service health check failed: ${error}`)
    }
  }

  private async createSystemAlert(type: 'error' | 'warning' | 'info', message: string) {
    await this.supabase
      .from('system_alerts')
      .insert({
        type,
        severity: type === 'error' ? 'high' : 'medium',
        title: 'System Health Check',
        message,
        source: 'background_jobs'
      })
  }

  // Retry failed transactions every 30 minutes
  private startFailedTransactionRetry() {
    const interval = setInterval(async () => {
      try {
        await this.retryFailedTransactions()
      } catch (error) {
        console.error('Error retrying failed transactions:', error)
      }
    }, 1800000) // Every 30 minutes

    this.intervals.push(interval)
  }

  private async retryFailedTransactions() {
    const { data: failedTransactions } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('status', 'failed')
      .lt('retry_count', 3)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

    if (!failedTransactions) return

    for (const transaction of failedTrans  // Last 24 hours

    if (!failedTransactions) return

    for (const transaction of failedTransactions) {
      try {
        // Increment retry count
        await this.supabase
          .from('transactions')
          .update({ retry_count: transaction.retry_count + 1 })
          .eq('id', transaction.id)

        // Retry the transaction based on type
        switch (transaction.transaction_type) {
          case 'airtime':
            await transactionService.processAirtimeTopup(
              transaction.user_id,
              transaction.amount,
              transaction.recipient,
              transaction.network
            )
            break
          case 'data':
            await transactionService.processDataTopup(
              transaction.user_id,
              transaction.amount,
              transaction.recipient,
              transaction.network,
              transaction.metadata.plan_code
            )
            break
          case 'cable':
            await transactionService.processCableSubscription(
              transaction.user_id,
              transaction.amount,
              transaction.recipient,
              transaction.network,
              transaction.metadata.package
            )
            break
          case 'electricity':
            await transactionService.processElectricityPayment(
              transaction.user_id,
              transaction.amount,
              transaction.recipient,
              transaction.network
            )
            break
        }

      } catch (error) {
        console.error(`Failed to retry transaction ${transaction.id}:`, error)
      }
    }
  }

  // Send low balance alerts every hour
  private startLowBalanceAlerts() {
    const interval = setInterval(async () => {
      try {
        await this.sendLowBalanceAlerts()
      } catch (error) {
        console.error('Error sending low balance alerts:', error)
      }
    }, 3600000) // Every hour

    this.intervals.push(interval)
  }

  private async sendLowBalanceAlerts() {
    const lowBalanceThreshold = 1000 // ₦1000

    const { data: users } = await this.supabase
      .from('users')
      .select('id, email, phone, first_name, wallet_balance, notification_settings(*)')
      .lt('wallet_balance', lowBalanceThreshold)
      .eq('status', 'active')

    if (!users) return

    for (const user of users) {
      // Check if user wants low balance alerts
      if (!user.notification_settings?.low_balance_alerts) continue

      // Check if we've already sent an alert recently
      const { data: recentAlert } = await this.supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', 'low_balance')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1)

      if (recentAlert && recentAlert.length > 0) continue

      // Send low balance alert
      await pushNotificationService.sendNotification(
        user.id,
        'Low Wallet Balance',
        `Your wallet balance is ₦${user.wallet_balance.toLocaleString()}. Fund your wallet to continue using our services.`,
        {
          type: 'low_balance',
          balance: user.wallet_balance,
          url: '/dashboard/wallet'
        }
      )

      // Send SMS if enabled
      if (user.notification_settings?.sms_notifications && user.phone) {
        await smsService.sendLowBalanceAlert(user.phone, user.wallet_balance)
      }
    }
  }

  // Send weekly reports every Sunday
  private startWeeklyReports() {
    const interval = setInterval(async () => {
      try {
        const now = new Date()
        if (now.getDay() === 0) { // Sunday
          await this.sendWeeklyReports()
        }
      } catch (error) {
        console.error('Error sending weekly reports:', error)
      }
    }, 86400000) // Every day, but only send on Sunday

    this.intervals.push(interval)
  }

  private async sendWeeklyReports() {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const { data: users } = await this.supabase
      .from('users')
      .select('id, email, first_name, notification_settings(*)')
      .eq('status', 'active')

    if (!users) return

    for (const user of users) {
      // Check if user wants weekly reports
      if (!user.notification_settings?.weekly_reports) continue

      // Get user's weekly stats
      const { data: transactions } = await this.supabase
        .from('transactions')
        .select('transaction_type, amount, status')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString())

      if (!transactions || transactions.length === 0) continue

      const stats = {
        totalTransactions: transactions.length,
        totalSpent: transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
        successRate: (transactions.filter(t => t.status === 'completed').length / transactions.length) * 100,
        byType: transactions.reduce((acc, t) => {
          acc[t.transaction_type] = (acc[t.transaction_type] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }

      // Send weekly report email
      await emailService.sendWeeklyReport(user.email, {
        firstName: user.first_name,
        stats,
        weekStart: weekAgo.toISOString().split('T')[0],
        weekEnd: new Date().toISOString().split('T')[0]
      })
    }
  }
}

// Export singleton instance
export const backgroundJobsService = new BackgroundJobsService()
