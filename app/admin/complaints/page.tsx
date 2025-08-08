import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { AdminComplaintManager } from "@/components/admin/admin-complaint-manager"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminComplaintsPage() {
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
    <AdminLayout>
      <AdminComplaintManager />
    </AdminLayout>
  )
}
