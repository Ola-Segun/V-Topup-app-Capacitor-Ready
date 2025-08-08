'use client'

import { PremiumCableTopup } from '@/components/services/premium-cable-topup'

export default function CablePage() {
  // In a real app, get userId from auth context
  const userId = 'user_123'

  return (
    <div className="min-h-screen">
      <PremiumCableTopup userId={userId} />
    </div>
  )
}
