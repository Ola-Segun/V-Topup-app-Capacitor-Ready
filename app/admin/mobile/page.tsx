import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { EnhancedAdminDashboard } from "@/components/admin/enhanced-admin-dashboard"
import { MobileAdminNav } from "@/components/admin/mobile-admin-nav"
import { ConfigNotice } from "@/components/config-notice"

export default async function MobileAdminPage() {
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
    <div className="min-h-screen bg-background">
      <MobileAdminNav />
    {/* <ConfigNotice /> */}
      <div className="mobile-container py-6">
        <EnhancedAdminDashboard />
      </div>
    </div>
  )
}
