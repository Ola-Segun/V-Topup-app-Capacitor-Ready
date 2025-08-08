'use client'

import { BudgetManager } from '@/components/budget/budget-manager'

export default function BudgetPage() {
  // In a real app, get userId from auth context
  const userId = 'user_123'

  return (
    <div className="min-h-screen">
      <BudgetManager userId={userId} />
    </div>
  )
}
