'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { biometricService } from '@/lib/services/biometric-service'

export async function signUp(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('fullName') as string,
        phone: formData.get('phone') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    throw new Error(error.message)
  }

  redirect('/auth/login?message=Check your email to confirm your account')
}

export async function signIn(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    throw new Error(error.message)
  }

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function enableBiometric(userId: string, username: string) {
  try {
    const success = await biometricService.registerBiometric(userId, username)
    
    if (success) {
      const supabase = createClient()
      await supabase
        .from('users')
        .update({ biometric_enabled: true })
        .eq('id', userId)
    }
    
    return { success }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function authenticateWithBiometric(userId: string) {
  try {
    const success = await biometricService.authenticateWithBiometric(userId)
    return { success }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
