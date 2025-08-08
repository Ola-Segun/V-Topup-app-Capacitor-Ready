'use client'

import { PremiumElectricityTopup } from '@/components/services/premium-electricity-topup'

export default function ElectricityPage() {
  // In a real app, get userId from auth context
  const userId = 'user_123'

  return (
    <div className="min-h-screen">
      <PremiumElectricityTopup userId={userId} />
    </div>
  )
}
