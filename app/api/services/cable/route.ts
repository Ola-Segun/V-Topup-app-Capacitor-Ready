import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TransactionService } from '@/lib/services/transaction-service'
import { paymentService } from '@/lib/services/payment-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { provider, smartCardNumber, package: packageName, amount } = await request.json()

    if (!provider || !smartCardNumber || !packageName || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    const transactionService = new TransactionService()
    const reference = transactionService.generateReference()

    // Check wallet balance and debit
    const { success: debitSuccess, error: debitError } = await transactionService.debitWallet(
      user.id,
      amount,
      `Cable subscription: ${packageName} for ${smartCardNumber}`,
      reference
    )

    if (!debitSuccess) {
      return NextResponse.json({ error: debitError }, { status: 400 })
    }

    // Create transaction record
    const { data: transaction, error: txError } = await transactionService.createTransaction({
      user_id: user.id,
      transaction_type: 'cable',
      amount,
      status: 'pending',
      reference,
      metadata: { 
        provider, 
        smartCardNumber, 
        package: packageName 
      }
    })

    if (txError || !transaction) {
      // Refund wallet if transaction creation fails
      await transactionService.creditWallet(
        user.id,
        amount,
        `Refund for failed cable subscription`,
        reference
      )
      return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
    }

    // Process payment with provider
    try {
      const paymentResult = await paymentService.processCableSubscription({
        provider,
        smartCardNumber,
        package: packageName,
        amount,
        reference
      })

      if (paymentResult.success) {
        await transactionService.updateTransactionStatus(
          transaction.id, 
          'completed',
          paymentResult.data
        )
        
        return NextResponse.json({
          success: true,
          message: paymentResult.message,
          reference,
          transactionId: transaction.id
        })
      } else {
        // Refund wallet on payment failure
        await transactionService.creditWallet(
          user.id,
          amount,
          `Refund for failed cable subscription`,
          reference
        )
        
        await transactionService.updateTransactionStatus(
          transaction.id, 
          'failed',
          { error: paymentResult.message }
        )
        
        return NextResponse.json({ error: paymentResult.message }, { status: 400 })
      }
    } catch (error) {
      // Refund wallet on error
      await transactionService.creditWallet(
        user.id,
        amount,
        `Refund for failed cable subscription`,
        reference
      )
      
      await transactionService.updateTransactionStatus(
        transaction.id, 
        'failed',
        { error: 'Payment processing failed' }
      )
      
      return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
