import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network')

    const supabase = createClient()
    
    let query = supabase
      .from('data_plans')
      .select('*')
      .order('amount', { ascending: true })

    if (network) {
      query = query.eq('network', network)
    }

    const { data: plans, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Error fetching data plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
