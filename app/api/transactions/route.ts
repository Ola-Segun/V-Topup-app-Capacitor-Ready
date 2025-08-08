import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TransactionService } from '@/lib/services/transaction-service'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('type', type)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: transactions, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, amount, recipient, network, metadata } = body

    if (!type || !amount || !recipient) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transactionService = new TransactionService()
    let transaction

    switch (type) {
      case 'airtime':
        transaction = await transactionService.processAirtimeTopup(
          user.id,
          amount,
          recipient,
          network
        )
        break
      case 'data':
        transaction = await transactionService.processDataTopup(
          user.id,
          amount,
          recipient,
          network,
          metadata?.planCode
        )
        break
      default:
        return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 })
    }

    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
