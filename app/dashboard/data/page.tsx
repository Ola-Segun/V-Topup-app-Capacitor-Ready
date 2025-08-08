'use client'

import { PremiumDataTopup } from '@/components/services/premium-data-topup'

export default function DataPage() {
  // In a real app, get userId from auth context
  const userId = 'user_123'

  return (
    <div className="min-h-screen">
      <PremiumDataTopup userId={userId} />
    </div>
  )
}
