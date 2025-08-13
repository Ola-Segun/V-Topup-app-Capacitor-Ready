import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { WelcomeScreen } from "@/components/welcome-screen"
import { ConfigNotice } from "@/components/config-notice"
import { ThemeToggle } from "@/components/theme-toggle"
import { OnboardingScreen } from "@/components/onboarding/onboarding-screen"

export default async function HomePage() {
  // Only check auth if Supabase is configured
  if (isSupabaseConfigured) {
    const supabase = await createClient()
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        redirect("/dashboard")
      }
    }
  }

  return (
    <div>
      {/* <ConfigNotice /> */}
      {/* <WelcomeScreen /> */}
      <OnboardingScreen />
    </div>
  )
}
