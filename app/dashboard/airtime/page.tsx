'use client'

import { PremiumAirtimeTopup } from '@/components/services/premium-airtime-topup'

export default function AirtimePage() {
  // In a real app, get userId from auth context
  const userId = 'user_123'

  return (
    <div className="min-h-screen">
      <PremiumAirtimeTopup userId={userId} />
    </div>
  )
}
