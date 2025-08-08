import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TransactionService } from '@/lib/services/transaction-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, recipient, network } = body

    // Validation
    if (!amount || !recipient || !network) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (amount < 50 || amount > 50000) {
      return NextResponse.json({ error: 'Amount must be between ₦50 and ₦50,000' }, { status: 400 })
    }

    // Validate phone number format
    const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/
    if (!phoneRegex.test(recipient)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }

    // Check wallet balance
    const { data: userData } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single()

    if (!userData || userData.wallet_balance < amount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 })
    }

    const transactionService = new TransactionService()
    const transaction = await transactionService.processAirtimeTopup(
      user.id,
      amount,
      recipient,
      network
    )

    return NextResponse.json({ 
      success: true, 
      transaction,
      message: 'Airtime purchase initiated successfully'
    })
  } catch (error) {
    console.error('Error processing airtime topup:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
