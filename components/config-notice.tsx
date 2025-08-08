"use client"

import { AlertCircle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { isSupabaseConfigured } from "@/lib/supabase/client"

export function ConfigNotice() {
  if (isSupabaseConfigured) return null

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-sm">Demo Mode: Configure Supabase to enable full functionality</span>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 h-7 text-xs bg-transparent"
          onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
        >
          Setup Supabase
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}
