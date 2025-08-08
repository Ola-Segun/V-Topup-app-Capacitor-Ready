"use client"

import { useState, useEffect, useCallback } from 'react'
import { biometricService, type BiometricAuthResult } from '@/lib/services/biometric-service'

export interface UseBiometricReturn {
  isSupported: boolean
  isRegistered: boolean
  isLoading: boolean
  register: () => Promise<BiometricAuthResult>
  authenticate: () => Promise<BiometricAuthResult>
  remove: () => Promise<void>
  checkSupport: () => Promise<void>
  checkRegistration: () => Promise<void>
}

export function useBiometric(userId?: string): UseBiometricReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkSupport = useCallback(async () => {
    try {
      const supported = await biometricService.isSupported()
      setIsSupported(supported)
    } catch (error) {
      console.error('Error checking biometric support:', error)
      setIsSupported(false)
    }
  }, [])

  const checkRegistration = useCallback(async () => {
    if (!userId) return
    
    try {
      const registered = await biometricService.hasCredentials(userId)
      setIsRegistered(registered)
    } catch (error) {
      console.error('Error checking biometric registration:', error)
      setIsRegistered(false)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const register = useCallback(async (): Promise<BiometricAuthResult> => {
    if (!userId) {
      return { success: false, error: 'User ID required' }
    }

    setIsLoading(true)
    try {
      const result = await biometricService.register(userId)
      if (result.success) {
        setIsRegistered(true)
      }
      return result
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
    if (!userId) {
      return { success: false, error: 'User ID required' }
    }

    setIsLoading(true)
    try {
      const result = await biometricService.authenticate(userId)
      return result
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const remove = useCallback(async (): Promise<void> => {
    if (!userId) return

    setIsLoading(true)
    try {
      await biometricService.removeCredentials(userId)
      setIsRegistered(false)
    } catch (error) {
      console.error('Error removing biometric credentials:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const initialize = async () => {
      await biometricService.initialize()
      await checkSupport()
      await checkRegistration()
    }
    
    initialize()
  }, [checkSupport, checkRegistration])

  return {
    isSupported,
    isRegistered,
    isLoading,
    register,
    authenticate,
    remove,
    checkSupport,
    checkRegistration,
  }
}
