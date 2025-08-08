import { NextRequest, NextResponse } from 'next/server'
import { budgetService } from '@/lib/services/budget-service'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const budget = await budgetService.updateBudget(params.id, body)
    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await budgetService.deleteBudget(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting budget:', error)
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 })
  }
}
