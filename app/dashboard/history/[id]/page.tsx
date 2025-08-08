import { redirect } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { TransactionDetails } from "@/components/history/transaction-details"
import { ConfigNotice } from "@/components/config-notice"

interface TransactionDetailsPageProps {
  params: {
    id: string
  }
}

export default async function TransactionDetailsPage({ params }: TransactionDetailsPageProps) {
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
      <TransactionDetails transactionId={params.id} />
            {/* Bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  )
}
