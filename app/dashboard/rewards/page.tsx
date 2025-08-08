import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { RewardsCenter } from "@/components/rewards/rewards-center"
import { ConfigNotice } from "@/components/config-notice"

export default async function RewardsPage() {
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
      <RewardsCenter />
      
    </div>
  )
}
