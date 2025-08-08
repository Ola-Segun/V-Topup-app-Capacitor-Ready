import { createClient } from '@/lib/supabase/client'
import crypto from 'crypto'

interface PaymentInitialization {
  amount: number
  email: string
  userId: string
  reference?: string
  callback_url?: string
  metadata?: Record<string, any>
}

interface PaymentVerification {
  reference: string
  gateway: 'paystack' | 'flutterwave'
}

class PaymentGatewayService {
  private supabase = createClient()

  // Initialize Paystack payment
  async initializePaystackPayment(data: PaymentInitialization) {
    try {
      const reference = data.reference || `vtopup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email,
          amount: data.amount * 100, // Convert to kobo
          reference,
          callback_url: data.callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
          metadata: {
            user_id: data.userId,
            ...data.metadata
          }
        })
      })

      const result = await response.json()

      if (!result.status) {
        throw new Error(result.message || 'Payment initialization failed')
      }

      // Store payment record
      await this.supabase
        .from('payments')
        .insert({
          reference,
          user_id: data.userId,
          amount: data.amount,
          gateway: 'paystack',
          status: 'pending',
          gateway_response: result.data
        })

      return {
        success: true,
        data: {
          authorization_url: result.data.authorization_url,
          access_code: result.data.access_code,
          reference
        }
      }
    } catch (error) {
      console.error('Paystack initialization error:', error)
      return { success: false, error: error.message }
    }
  }

  // Initialize Flutterwave payment
  async initializeFlutterwavePayment(data: PaymentInitialization) {
    try {
      const reference = data.reference || `vtopup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tx_ref: reference,
          amount: data.amount,
          currency: 'NGN',
          redirect_url: data.callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
          customer: {
            email: data.email
          },
          meta: {
            user_id: data.userId,
            ...data.metadata
          }
        })
      })

      const result = await response.json()

      if (result.status !== 'success') {
        throw new Error(result.message || 'Payment initialization failed')
      }

      // Store payment record
      await this.supabase
        .from('payments')
        .insert({
          reference,
          user_id: data.userId,
          amount: data.amount,
          gateway: 'flutterwave',
          status: 'pending',
          gateway_response: result.data
        })

      return {
        success: true,
        data: {
          link: result.data.link,
          reference
        }
      }
    } catch (error) {
      console.error('Flutterwave initialization error:', error)
      return { success: false, error: error.message }
    }
  }

  // Verify Paystack payment
  async verifyPaystackPayment(reference: string) {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      })

      const result = await response.json()

      if (!result.status) {
        throw new Error(result.message || 'Payment verification failed')
      }

      const paymentData = result.data
      const status = paymentData.status === 'success' ? 'completed' : 'failed'

      // Update payment record
      const { data: payment } = await this.supabase
        .from('payments')
        .update({
          status,
          gateway_response: paymentData,
          verified_at: new Date().toISOString()
        })
        .eq('reference', reference)
        .select()
        .single()

      // Credit wallet if payment successful
      if (status === 'completed' && payment) {
        await this.creditUserWallet(payment.user_id, payment.amount, reference)
      }

      return {
        success: true,
        data: {
          status,
          amount: paymentData.amount / 100, // Convert from kobo
          reference: paymentData.reference
        }
      }
    } catch (error) {
      console.error('Paystack verification error:', error)
      return { success: false, error: error.message }
    }
  }

  // Verify Flutterwave payment
  async verifyFlutterwavePayment(transactionId: string) {
    try {
      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
        headers: {
          'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`
        }
      })

      const result = await response.json()

      if (result.status !== 'success') {
        throw new Error(result.message || 'Payment verification failed')
      }

      const paymentData = result.data
      const status = paymentData.status === 'successful' ? 'completed' : 'failed'

      // Update payment record
      const { data: payment } = await this.supabase
        .from('payments')
        .update({
          status,
          gateway_response: paymentData,
          verified_at: new Date().toISOString()
        })
        .eq('reference', paymentData.tx_ref)
        .select()
        .single()

      // Credit wallet if payment successful
      if (status === 'completed' && payment) {
        await this.creditUserWallet(payment.user_id, payment.amount, paymentData.tx_ref)
      }

      return {
        success: true,
        data: {
          status,
          amount: paymentData.amount,
          reference: paymentData.tx_ref
        }
      }
    } catch (error) {
      console.error('Flutterwave verification error:', error)
      return { success: false, error: error.message }
    }
  }

  // Credit user wallet
  private async creditUserWallet(userId: string, amount: number, reference: string) {
    try {
      // Call Supabase function to credit wallet
      const { data, error } = await this.supabase
        .rpc('credit_wallet', {
          p_user_id: userId,
          p_amount: amount,
          p_description: `Wallet funding via payment gateway`,
          p_reference: reference
        })

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Wallet credit error:', error)
      throw error
    }
  }

  // Handle webhook verification
  async verifyWebhookSignature(payload: string, signature: string, gateway: 'paystack' | 'flutterwave') {
    try {
      let expectedSignature: string

      if (gateway === 'paystack') {
        expectedSignature = crypto
          .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
          .update(payload)
          .digest('hex')
      } else {
        expectedSignature = crypto
          .createHmac('sha256', process.env.FLUTTERWAVE_WEBHOOK_SECRET!)
          .update(payload)
          .digest('hex')
      }

      return signature === expectedSignature
    } catch (error) {
      console.error('Webhook signature verification error:', error)
      return false
    }
  }

  // Process webhook event
  async processWebhookEvent(event: any, gateway: 'paystack' | 'flutterwave') {
    try {
      let reference: string
      let status: string

      if (gateway === 'paystack') {
        reference = event.data.reference
        status = event.data.status === 'success' ? 'completed' : 'failed'
      } else {
        reference = event.data.tx_ref
        status = event.data.status === 'successful' ? 'completed' : 'failed'
      }

      // Update payment record
      const { data: payment } = await this.supabase
        .from('payments')
        .update({
          status,
          gateway_response: event.data,
          webhook_received_at: new Date().toISOString()
        })
        .eq('reference', reference)
        .select()
        .single()

      // Credit wallet if payment successful and not already credited
      if (status === 'completed' && payment && !payment.verified_at) {
        await this.creditUserWallet(payment.user_id, payment.amount, reference)
      }

      return { success: true }
    } catch (error) {
      console.error('Webhook processing error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get payment history
  async getPaymentHistory(userId: string, limit = 50) {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Payment history fetch error:', error)
      return { success: false, error: error.message }
    }
  }

  // Initiate refund
  async initiateRefund(reference: string, amount?: number) {
    try {
      const { data: payment } = await this.supabase
        .from('payments')
        .select('*')
        .eq('reference', reference)
        .single()

      if (!payment) {
        throw new Error('Payment not found')
      }

      const refundAmount = amount || payment.amount

      let response: any

      if (payment.gateway === 'paystack') {
        response = await fetch('https://api.paystack.co/refund', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            transaction: reference,
            amount: refundAmount * 100 // Convert to kobo
          })
        })
      } else {
        // Flutterwave refund implementation
        response = await fetch('https://api.flutterwave.com/v3/transactions/refund', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: payment.gateway_response.id,
            amount: refundAmount
          })
        })
      }

      const result = await response.json()

      // Store refund record
      await this.supabase
        .from('refunds')
        .insert({
          payment_id: payment.id,
          amount: refundAmount,
          status: 'pending',
          gateway_response: result
        })

      return { success: true, data: result }
    } catch (error) {
      console.error('Refund initiation error:', error)
      return { success: false, error: error.message }
    }
  }
}

export const paymentGatewayService = new PaymentGatewayService()
