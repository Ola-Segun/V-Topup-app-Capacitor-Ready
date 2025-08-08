import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/services/email-service'
import { smsService } from '@/lib/services/sms-service'
import { pushNotificationService } from '@/lib/services/push-notification-service'
import { webSocketService } from '@/lib/services/websocket-service'

const FLUTTERWAVE_SECRET_HASH = process.env.FLUTTERWAVE_SECRET_HASH!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('verif-hash')

    if (!signature || signature !== FLUTTERWAVE_SECRET_HASH) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const supabase = await createClient()

    console.log('Flutterwave webhook received:', event.event)

    switch (event.event) {
      case 'charge.completed':
        await handleChargeCompleted(event.data, supabase)
        break
      
      case 'transfer.completed':
        await handleTransferCompleted(event.data, supabase)
        break
      
      default:
        console.log('Unhandled Flutterwave event:', event.event)
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Flutterwave webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleChargeCompleted(data: any, supabase: any) {
  const reference = data.tx_ref
  const amount = data.amount
  const status = data.status
  const customerEmail = data.customer.email

  try {
    if (status === 'successful') {
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

      // Verify transaction with Flutterwave API
      const verificationResponse = await fetch(
        `https://api.flutterwave.com/v3/transactions/${data.id}/verify`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const verificationData = await verificationResponse.json()

      if (verificationData.status === 'success' && verificationData.data.status === 'successful') {
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
          p_description: `Wallet funding via Flutterwave - ${reference}`
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
          emailService.sendWalletCreditEmail(customerEmail, {
            firstName: user?.first_name || 'User',
            amount,
            reference,
            newBalance: user?.wallet_balance || 0,
            timestamp: new Date().toISOString()
          }),

          user?.phone && smsService.sendWalletCreditSMS(user.phone, amount, user.wallet_balance),

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
      }
    } else {
      // Handle failed transaction
      await supabase
        .from('transactions')
        .update({
          status: 'failed',
          failure_reason: data.processor_response || 'Payment failed',
          gateway_response: data,
          failed_at: new Date().toISOString()
        })
        .eq('reference', reference)
    }

    // Log webhook processing
    await supabase
      .from('webhook_logs')
      .insert({
        provider: 'flutterwave',
        event_type: 'charge.completed',
        reference,
        status: 'processed',
        data: data,
        processed_at: new Date().toISOString()
      })

  } catch (error) {
    console.error('Error processing Flutterwave charge:', error)
    
    await supabase
      .from('webhook_logs')
      .insert({
        provider: 'flutterwave',
        event_type: 'charge.completed',
        reference,
        status: 'failed',
        error: error.message,
        data: data,
        processed_at: new Date().toISOString()
      })
  }
}

async function handleTransferCompleted(data: any, supabase: any) {
  const reference = data.reference
  const status = data.status

  try {
    if (status === 'SUCCESSFUL') {
      await supabase
        .from('transfers')
        .update({
          status: 'completed',
          gateway_response: data,
          completed_at: new Date().toISOString()
        })
        .eq('reference', reference)
    } else {
      // Handle failed transfer and refund
      const { data: transfer } = await supabase
        .from('transfers')
        .update({
          status: 'failed',
          failure_reason: data.complete_message || 'Transfer failed',
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
    }

    await supabase
      .from('webhook_logs')
      .insert({
        provider: 'flutterwave',
        event_type: 'transfer.completed',
        reference,
        status: 'processed',
        data: data,
        processed_at: new Date().toISOString()
      })

  } catch (error) {
    console.error('Error processing Flutterwave transfer:', error)
  }
}
