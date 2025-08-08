import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (adminError || !adminUser) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Get analytics data
    const [
      totalUsersResult,
      totalTransactionsResult,
      totalRevenueResult,
      todayTransactionsResult,
      transactionsByTypeResult
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('transactions').select('id', { count: 'exact' }),
      supabase.from('transactions').select('amount').eq('status', 'completed'),
      supabase.from('transactions')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', new Date().toISOString().split('T')[0]),
      supabase.from('transactions')
        .select('transaction_type, amount')
        .eq('status', 'completed')
    ])

    const totalUsers = totalUsersResult.count || 0
    const totalTransactions = totalTransactionsResult.count || 0
    
    const totalRevenue = totalRevenueResult.data?.reduce((sum, tx) => sum + tx.amount, 0) || 0
    const todayRevenue = todayTransactionsResult.data?.reduce((sum, tx) => sum + tx.amount, 0) || 0

    // Group transactions by type
    const transactionsByType = transactionsByTypeResult.data?.reduce((acc, tx) => {
      acc[tx.transaction_type] = (acc[tx.transaction_type] || 0) + tx.amount
      return acc
    }, {} as Record<string, number>) || {}

    return NextResponse.json({
      totalUsers,
      totalTransactions,
      totalRevenue,
      todayRevenue,
      transactionsByType
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
