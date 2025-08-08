"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, isSupabaseConfigured, mockUser } from "@/lib/supabase/client"
import { toast } from "@/lib/toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, phone: string, fullName: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const isDemo = !isSupabaseConfigured

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo mode - show notification and set mock user
      toast.info("Running in demo mode. Please configure Supabase for full functionality.", {
        duration: 5000,
      })
      setUser(mockUser as User)
      setLoading(false)
      return
    }

    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (isDemo) {
      // Demo mode - simulate successful login
      setUser(mockUser as User)
      toast.success("Signed in successfully (Demo Mode)")
      return {}
    }

    if (!supabase) {
      return { error: "Supabase not configured" }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    return {}
  }

  const signUp = async (email: string, password: string, phone: string, fullName: string) => {
    if (isDemo) {
      // Demo mode - simulate successful signup
      setUser(mockUser as User)
      toast.success("Account created successfully (Demo Mode)")
      return {}
    }

    if (!supabase) {
      return { error: "Supabase not configured" }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return {}
  }

  const signOut = async () => {
    if (isDemo) {
      setUser(null)
      toast.success("Signed out successfully (Demo Mode)")
      return
    }

    if (!supabase) return

    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
