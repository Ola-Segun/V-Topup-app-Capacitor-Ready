import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PaymentService } from '@/lib/services/payment-service'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const paymentService = new PaymentService()
    const paymentData = await paymentService.initializePayment(
      user.id,
      amount,
      user.email
    )

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error('Error initializing payment:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
