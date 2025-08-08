import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { CustomerSupport } from "@/components/support/customer-support"
import { ConfigNotice } from "@/components/config-notice"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"

export default async function SupportPage() {
  let user = null

  // Only check auth if Supabase is configured
  if (isSupabaseConfigured) {
    const supabase = await createClient()
    if (supabase) {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        redirect("/auth/login")
      }
      user = authUser
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PremiumMobileNav />
    {/* <ConfigNotice /> */}
      <div className="mobile-container py-6">
        <CustomerSupport />
      </div>
            {/* Bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}
