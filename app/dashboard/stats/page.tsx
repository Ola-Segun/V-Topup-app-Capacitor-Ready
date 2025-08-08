import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { SpendingInsights } from "@/components/stats/spending-insights"
import { ConfigNotice } from "@/components/config-notice"

export default async function StatsPage() {
  // Only check auth if Supabase is configured
  if (isSupabaseConfigured) {
    const supabase = await createClient()
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        redirect("/auth/login")
      }
    }
  }

  return (
    <div>
    {/* <ConfigNotice /> */}
      <SpendingInsights />
            {/* Bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}
