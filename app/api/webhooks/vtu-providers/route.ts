import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/services/email-service'
import { smsService } from '@/lib/services/sms-service'
import { pushNotificationService } from '@/lib/services/push-notification-service'
import { webSocketService } from '@/lib/services/websocket-service'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const provider = request.nextUrl.searchParams.get('provider')
    
    if (!provider) {
      return NextResponse.json({ error: 'Provider not specified' }, { status: 400 })
    }

    const supabase = await createClient()

    switch (provider) {
      case 'vtpass':
        return await handleVTPassWebhook(body, request, supabase)
      case 'baxi':
        return await handleBaxiWebhook(body, request, supabase)
      case 'clubkonnect':
        return await handleClubKonnectWebhook(body, request, supabase)
      default:
        return NextResponse.json({ error: 'Unknown provider' }, { status: 400 })
    }
  } catch (error) {
    console.error('VTU webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleVTPassWebhook(body: string, request: NextRequest, supabase: any) {
  const signature = request.headers.get('x-vtpass-signature')
  const expectedSignature = crypto
    .createHmac('sha256', process.env.VTPASS_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const data = JSON.parse(body)
  
  try {
    const reference = data.requestId
    const status = data.content.transactions.status
    const transactionId = data.content.transactions.transactionId

    // Find the transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*, users(*)')
      .eq('reference', reference)
      .single()

    if (transactionError || !transaction) {
      console.error('Transaction not found:', reference)
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    let newStatus: string
    let shouldRefund = false

    switch (status) {
      case 'delivered':
      case 'successful':
        newStatus = 'completed'
        break
      case 'failed':
      case 'rejected':
        newStatus = 'failed'
        shouldRefund = true
        break
      case 'pending':
      case 'initiated':
        newStatus = 'pending'
        break
      default:
        newStatus = 'pending'
    }

    // Update transaction status
    await supabase
      .from('transactions')
      .update({
        status: newStatus,
        provider_transaction_id: transactionId,
        provider_response: data,
        [newStatus === 'completed' ? 'completed_at' : newStatus === 'failed' ? 'failed_at' : 'updated_at']: new Date().toISOString()
      })
      .eq('id', transaction.id)

    // Handle refund if transaction failed
    if (shouldRefund) {
      await supabase.rpc('credit_wallet', {
        p_user_id: transaction.user_id,
        p_amount: transaction.amount,
        p_reference: `REFUND-${reference}`,
        p_description: `Refund for failed ${transaction.transaction_type} - ${reference}`
      })

      // Get updated balance
      const { data: user } = await supabase
        .from('users')
        .select('wallet_balance, first_name, phone, email')
        .eq('id', transaction.user_id)
        .single()

      // Send refund notifications
      await Promise.all([
        pushNotificationService.sendNotification(
          transaction.user_id,
          'Transaction Failed - Refund Processed',
          `Your ${transaction.transaction_type} transaction failed. ₦${transaction.amount.toLocaleString()} has been refunded to your wallet.`,
          {
            type: 'transaction_refund',
            amount: transaction.amount,
            reference,
            newBalance: user?.wallet_balance
          }
        ),

        user?.phone && smsService.sendTransactionFailedSMS(
          user.phone,
          transaction.transaction_type,
          transaction.amount,
          reference
        ),

        user?.email && emailService.sendTransactionFailedEmail(user.email, {
          firstName: user.first_name,
          transactionType: transaction.transaction_type,
          amount: transaction.amount,
          reference,
          recipient: transaction.recipient,
          refundAmount: transaction.amount,
          newBalance: user.wallet_balance,
          timestamp: new Date().toISOString()
        })
      ])

      // Send real-time wallet update
      webSocketService.emitWalletUpdate(transaction.user_id, {
        balance: user?.wallet_balance,
        lastTransaction: {
          type: 'refund',
          amount: transaction.amount,
          reference: `REFUND-${reference}`,
          timestamp: new Date().toISOString()
        }
      })
    } else if (newStatus === 'completed') {
      // Send success notifications
      const user = transaction.users

      await Promise.all([
        pushNotificationService.sendNotification(
          transaction.user_id,
          'Transaction Successful',
          `Your ${transaction.transaction_type} transaction of ₦${transaction.amount.toLocaleString()} was successful.`,
          {
            type: 'transaction_success',
            transactionType: transaction.transaction_type,
            amount: transaction.amount,
            reference,
            recipient: transaction.recipient
          }
        ),

        user?.phone && smsService.sendTransactionSuccessSMS(
          user.phone,
          transaction.transaction_type,
          transaction.amount,
          transaction.recipient,
          reference
        ),

        user?.email && emailService.sendTransactionSuccessEmail(user.email, {
          firstName: user.first_name,
          transactionType: transaction.transaction_type,
          amount: transaction.amount,
          reference,
          recipient: transaction.recipient,
          timestamp: new Date().toISOString()
        })
      ])
    }

    // Send real-time transaction update
    webSocketService.emitTransactionUpdate(transaction.user_id, {
      ...transaction,
      status: newStatus,
      provider_transaction_id: transactionId,
      provider_response: data
    })

    // Log webhook processing
    await supabase
      .from('webhook_logs')
      .insert({
        provider: 'vtpass',
        event_type: 'transaction_update',
        reference,
        status: 'processed',
        data: data,
        processed_at: new Date().toISOString()
      })

    return NextResponse.json({ status: 'success' })

  } catch (error) {
    console.error('VTPass webhook processing error:', error)
    
    await supabase
      .from('webhook_logs')
      .insert({
        provider: 'vtpass',
        event_type: 'transaction_update',
        reference: data.requestId,
        status: 'failed',
        error: error.message,
        data: data,
        processed_at: new Date().toISOString()
      })

    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

async function handleBaxiWebhook(body: string, request: NextRequest, supabase: any) {
  const signature = request.headers.get('x-baxi-signature')
  const expectedSignature = crypto
    .createHmac('sha256', process.env.BAXI_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const data = JSON.parse(body)
  
  try {
    const reference = data.agentReference
    const status = data.status
    const transactionId = data.transactionReference

    // Find the transaction
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*, users(*)')
      .eq('reference', reference)
      .single()

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    let newStatus: string
    let shouldRefund = false

    switch (status.toLowerCase()) {
      case 'success':
      case 'successful':
        newStatus = 'completed'
        break
      case 'failed':
      case 'error':
        newStatus = 'failed'
        shouldRefund = true
        break
      case 'pending':
      case 'processing':
        newStatus = 'pending'
        break
      default:
        newStatus = 'pending'
    }

    // Update transaction
    await supabase
      .from('transactions')
      .update({
        status: newStatus,
        provider_transaction_id: transactionId,
        provider_response: data,
        [newStatus === 'completed' ? 'completed_at' : newStatus === 'failed' ? 'failed_at' : 'updated_at']: new Date().toISOString()
      })
      .eq('id', transaction.id)

    // Handle refund if needed
    if (shouldRefund) {
      await supabase.rpc('credit_wallet', {
        p_user_id: transaction.user_id,
        p_amount: transaction.amount,
        p_reference: `REFUND-${reference}`,
        p_description: `Refund for failed ${transaction.transaction_type} - ${reference}`
      })
    }

    // Send notifications and real-time updates (similar to VTPass)
    // ... (notification logic similar to VTPass)

    return NextResponse.json({ status: 'success' })

  } catch (error) {
    console.error('Baxi webhook processing error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

async function handleClubKonnectWebhook(body: string, request: NextRequest, supabase: any) {
  const signature = request.headers.get('x-clubkonnect-signature')
  const expectedSignature = crypto
    .createHmac('sha256', process.env.CLUBKONNECT_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const data = JSON.parse(body)
  
  try {
    const reference = data.reference
    const status = data.status
    const transactionId = data.transaction_id

    // Find the transaction
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*, users(*)')
      .eq('reference', reference)
      .single()

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    let newStatus: string
    let shouldRefund = false

    switch (status) {
      case 'SUCCESS':
      case 'DELIVERED':
        newStatus = 'completed'
        break
      case 'FAILED':
      case 'REJECTED':
        newStatus = 'failed'
        shouldRefund = true
        break
      case 'PENDING':
      case 'PROCESSING':
        newStatus = 'pending'
        break
      default:
        newStatus = 'pending'
    }

    // Update transaction
    await supabase
      .from('transactions')
      .update({
        status: newStatus,
        provider_transaction_id: transactionId,
        provider_response: data,
        [newStatus === 'completed' ? 'completed_at' : newStatus === 'failed' ? 'failed_at' : 'updated_at']: new Date().toISOString()
      })
      .eq('id', transaction.id)

    // Handle refund if needed
    if (shouldRefund) {
      await supabase.rpc('credit_wallet', {
        p_user_id: transaction.user_id,
        p_amount: transaction.amount,
        p_reference: `REFUND-${reference}`,
        p_description: `Refund for failed ${transaction.transaction_type} - ${reference}`
      })
    }

    return NextResponse.json({ status: 'success' })

  } catch (error) {
    console.error('ClubKonnect webhook processing error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
