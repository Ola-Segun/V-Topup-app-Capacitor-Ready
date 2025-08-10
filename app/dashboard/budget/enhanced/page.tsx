import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { EnhancedBudgetManager } from "@/components/budget/enhanced-budget-manager"

export default async function EnhancedBudgetPage() {
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

  return  (
      <div className="min-h-screen">
        <EnhancedBudgetManager />
      </div>
    )
}
