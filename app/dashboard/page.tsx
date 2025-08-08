import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { PremiumDashboard } from "@/components/dashboard/premium-dashboard"
import { ConfigNotice } from "@/components/config-notice"

export default async function DashboardPage() {
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
  } else {
    // In demo mode, use mock user
    user = {
      id: "demo-user-123",
      email: "demo@example.com",
      user_metadata: {
        full_name: "Demo User",
      },
    }
  }

  return (
    <div>
      {/* <ConfigNotice /> */}
      <PremiumDashboard user={user} />
      {/* Bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}
