import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/services/email-service'
import { smsService } from '@/lib/services/sms-service'
import { pushNotificationService } from '@/lib/services/push-notification-service'
import { webSocketService } from '@/lib/services/websocket-service'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 })
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = await createClient()

    console.log('Paystack webhook received:', event.event)

    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data, supabase)
        break
      
      case 'charge.failed':
        await handleChargeFailed(event.data, supabase)
        break
      
      case 'transfer.success':
        await handleTransferSuccess(event.data, supabase)
        break
      
      case 'transfer.failed':
        await handleTransferFailed(event.data, supabase)
        break
      
      case 'transfer.reversed':
        await handleTransferReversed(event.data, supabase)
        break
      
      default:
        console.log('Unhandled Paystack event:', event.event)
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Paystack webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleChargeSuccess(data: any, supabase: any) {
  const reference = data.reference
  const amount = data.amount / 100 // Paystack amounts are in kobo
  const customerEmail = data.customer.email

  try {
    // Find the pending transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('*, users(*)')
      .eq('reference', reference)
      .eq('status', 'pending')
      .single()

    if (transactionError || !transaction) {
      console.error('Transaction not found:', reference)
      return
    }

    // Update transaction status
    await supabase
      .from('transactions')
      .update({
        status: 'completed',
        gateway_response: data,
        completed_at: new Date().toISOString()
      })
      .eq('id', transaction.id)

    // Credit user wallet
    const { error: walletError } = await supabase.rpc('credit_wallet', {
      p_user_id: transaction.user_id,
      p_amount: amount,
      p_reference: reference,
      p_description: `Wallet funding via Paystack - ${reference}`
    })

    if (walletError) {
      console.error('Wallet credit error:', walletError)
      throw walletError
    }

    // Get updated user data
    const { data: user } = await supabase
      .from('users')
      .select('wallet_balance, first_name, phone')
      .eq('id', transaction.user_id)
      .single()

    // Send notifications
    await Promise.all([
      // Email notification
      emailService.sendWalletCreditEmail(customerEmail, {
        firstName: user?.first_name || 'User',
        amount,
        reference,
        newBalance: user?.wallet_balance || 0,
        timestamp: new Date().toISOString()
      }),

      // SMS notification
      user?.phone && smsService.sendWalletCreditSMS(user.phone, amount, user.wallet_balance),

      // Push notification
      pushNotificationService.sendNotification(
        transaction.user_id,
        'Wallet Funded Successfully',
        `Your wallet has been credited with ₦${amount.toLocaleString()}`,
        {
          type: 'wallet_credit',
          amount,
          reference,
          newBalance: user?.wallet_balance
        }
      )
    ])

    // Send real-time update
    webSocketService.emitWalletUpdate(transaction.user_id, {
      balance: user?.wallet_balance,
      lastTransaction: {
        type: 'credit',
        amount,
        reference,
        timestamp: new Date().toISOString()
      }
    })

    // Log successful processing
    await supabase
      .from('webhook_logs')
      .insert({
        provider: 'paystack',
        event_type: 'charge.success',
        reference,
        status: 'processed',
        data: data,
        processed_at: new Date().toISOString()
      })

  } catch (error) {
    console.error('Error processing charge success:', error)
    
    // Log failed processing
    await supabase
      .from('webhook_logs')
      .insert({
        provider: 'paystack',
        event_type: 'charge.success',
        reference,
        status: 'failed',
        error: error.message,
        data: data,
        processed_at: new Date().toISOString()
      })
  }
}

async function handleChargeFailed(data: any, supabase: any) {
  const reference = data.reference
  const customerEmail = data.customer.email

  try {
    // Update transaction status
    const { data: transaction } = await supabase
      .from('transactions')
      .update({
        status: 'failed',
        failure_reason: data.gateway_response,
        gateway_response: data,
        failed_at: new Date().toISOString()
      })
      .eq('reference', reference)
      .select('*, users(*)')
      .single()

    if (transaction) {
      // Send failure notification
      await Promise.all([
        emailService.sendPaymentFailedEmail(customerEmail, {
          firstName: transaction.users?.first_name || 'User',
          amount: data.amount / 100,
          reference,
          reason: data.gateway_response,
          timestamp: new Date().toISOString()
        }),

        pushNotificationService.sendNotification(
          transaction.user_id,
          'Payment Failed',
          `Your payment of ₦${(data.amount / 100).toLocaleString()} failed. Please try again.`,
          {
            type: 'payment_failed',
            amount: data.amount / 100,
            reference,
            reason: data.gateway_response
          }
        )
      ])
    }

    await supabase
      .from('webhook_logs')
      .insert({
        provider: 'paystack',
        event_type: 'charge.failed',
        reference,
        status: 'processed',
        data: data,
        processed_at: new Date().toISOString()
      })

  } catch (error) {
    console.error('Error processing charge failed:', error)
  }
}

async function handleTransferSuccess(data: any, supabase: any) {
  const reference = data.reference
  
  try {
    // Update transfer status
    await supabase
      .from('transfers')
      .update({
        status: 'completed',
        gateway_response: data,
        completed_at: new Date().toISOString()
      })
      .eq('reference', reference)

    await supabase
      .from('webhook_logs')
      .insert({
        provider: 'paystack',
        event_type: 'transfer.success',
        reference,
        status: 'processed',
        data: data,
        processed_at: new Date().toISOString()
      })

  } catch (error) {
    console.error('Error processing transfer success:', error)
  }
}

async function handleTransferFailed(data: any, supabase: any) {
  const reference = data.reference
  
  try {
    // Update transfer status and refund wallet
    const { data: transfer } = await supabase
      .from('transfers')
      .update({
        status: 'failed',
        failure_reason: data.gateway_response,
        gateway_response: data,
        failed_at: new Date().toISOString()
      })
      .eq('reference', reference)
      .select('*')
      .single()

    if (transfer) {
      // Refund the wallet
      await supabase.rpc('credit_wallet', {
        p_user_id: transfer.user_id,
        p_amount: transfer.amount,
        p_reference: `REFUND-${reference}`,
        p_description: `Transfer refund - ${reference}`
      })
    }

  } catch (error) {
    console.error('Error processing transfer failed:', error)
  }
}

async function handleTransferReversed(data: any, supabase: any) {
  const reference = data.reference
  
  try {
    // Handle transfer reversal
    const { data: transfer } = await supabase
      .from('transfers')
      .update({
        status: 'reversed',
        gateway_response: data,
        reversed_at: new Date().toISOString()
      })
      .eq('reference', reference)
      .select('*')
      .single()

    if (transfer) {
      // Credit back to wallet
      await supabase.rpc('credit_wallet', {
        p_user_id: transfer.user_id,
        p_amount: transfer.amount,
        p_reference: `REVERSAL-${reference}`,
        p_description: `Transfer reversal - ${reference}`
      })
    }

  } catch (error) {
    console.error('Error processing transfer reversal:', error)
  }
}
