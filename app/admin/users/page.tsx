import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { AdminUsersManager } from "@/components/admin/admin-users-manager"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminUsersPage() {
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
      <AdminUsersManager />
    </AdminLayout>
  )
}
