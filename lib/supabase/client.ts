import { createBrowserClient } from "@supabase/ssr"

// Fallback values for development/demo purposes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

// Check if we have valid Supabase credentials
const hasValidCredentials =
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseAnonKey !== "your-anon-key" &&
  supabaseUrl.includes("supabase.co")

export const supabase = hasValidCredentials ? createBrowserClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseConfigured = hasValidCredentials

// Mock user for demo purposes when Supabase is not configured
export const mockUser = {
  id: "demo-user-123",
  email: "demo@example.com",
  phone: "+1234567890",
  user_metadata: {
    full_name: "Demo User",
  },
}
