"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Fingerprint, Smartphone, Shield, CheckCircle, AlertTriangle, Settings, Lock, Unlock } from 'lucide-react'
import { biometricAuth, type BiometricCapabilities } from "@/lib/biometric"
import { authPreferencesManager, type AuthPreferences, type AuthMethod } from "@/lib/auth-preferences"
import { toast } from "sonner"

export function BiometricSettings() {
  const [capabilities, setCapabilities] = useState<BiometricCapabilities>({
    isSupported: false,
    availableAuthenticators: [],
    biometryType: 'Biometric'
  })
  const [preferences, setPreferences] = useState<AuthPreferences>({
    preferredMethod: 'pin',
    biometricEnabled: false,
    pinEnabled: true,
    fallbackToPin: true
  })
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      // Load biometric capabilities
      const caps = await biometricAuth.getCapabilities()
      setCapabilities(caps)

      // Load user preferences
      const prefs = authPreferencesManager.getPreferences()
      setPreferences(prefs)

      // Check enrollment status
      const enrolled = await biometricAuth.isEnrolled()
      setIsEnrolled(enrolled)
    } catch (error) {
      console.error('Error loading biometric settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnrollBiometric = async () => {
    setIsEnrolling(true)
    try {
      const result = await biometricAuth.enroll()
      if (result.success) {
        setIsEnrolled(true)
        authPreferencesManager.setBiometricEnabled(true)
        setPreferences(prev => ({ ...prev, biometricEnabled: true }))
        toast.success("Biometric authentication enrolled successfully!")
      } else {
        toast.error(result.error || "Failed to enroll biometric authentication.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred during enrollment.")
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleRemoveBiometric = async () => {
    try {
      await biometricAuth.removeCredentials()
      setIsEnrolled(false)
      authPreferencesManager.setBiometricEnabled(false)
      authPreferencesManager.setPreferredMethod('pin')
      setPreferences(prev => ({ 
        ...prev, 
        biometricEnabled: false, 
        preferredMethod: 'pin' 
      }))
      toast.success("Biometric authentication removed successfully.")
    } catch (error) {
      toast.error("Failed to remove biometric authentication.")
    }
  }

  const handlePreferredMethodChange = (method: AuthMethod) => {
    authPreferencesManager.setPreferredMethod(method)
    setPreferences(prev => ({ ...prev, preferredMethod: method }))
    toast.success(`Authentication method changed to ${method === 'pin' ? 'PIN' : 'Biometric'}.`)
  }

  const handleBiometricToggle = (enabled: boolean) => {
    if (!enabled) {
      // If disabling biometric, switch to PIN
      authPreferencesManager.setBiometricEnabled(false)
      authPreferencesManager.setPreferredMethod('pin')
      setPreferences(prev => ({ 
        ...prev, 
        biometricEnabled: false, 
        preferredMethod: 'pin' 
      }))
    } else if (isEnrolled) {
      authPreferencesManager.setBiometricEnabled(true)
      setPreferences(prev => ({ ...prev, biometricEnabled: enabled }))
    }
    toast.success(`Biometric authentication ${enabled ? 'enabled' : 'disabled'}.`)
  }

  const handleFallbackToggle = (enabled: boolean) => {
    authPreferencesManager.setFallbackToPin(enabled)
    setPreferences(prev => ({ ...prev, fallbackToPin: enabled }))
    toast.success(`PIN fallback ${enabled ? 'enabled' : 'disabled'}.`)
  }

  const getBiometricIcon = () => {
    if (capabilities.biometryType.includes('Touch ID') || capabilities.biometryType.includes('Face ID')) {
      return <Smartphone className="w-6 h-6" />
    }
    return <Fingerprint className="w-6 h-6" />
  }

  const getStatusBadge = () => {
    if (!capabilities.isSupported) {
      return <Badge variant="secondary">Not Supported</Badge>
    }
    if (isEnrolled && preferences.biometricEnabled) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
    }
    if (isEnrolled) {
      return <Badge variant="outline">Enrolled</Badge>
    }
    return <Badge variant="secondary">Not Enrolled</Badge>
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Biometric Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Biometric Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getBiometricIcon()}
              <div>
                <CardTitle>Biometric Authentication</CardTitle>
                <CardDescription>
                  Secure your transactions with {capabilities.biometryType}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!capabilities.isSupported ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Biometric authentication is not supported on this device or browser.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Biometric Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Use {capabilities.biometryType} for transaction authentication
                  </p>
                </div>
                <Switch
                  checked={preferences.biometricEnabled && isEnrolled}
                  onCheckedChange={handleBiometricToggle}
                  disabled={!isEnrolled}
                />
              </div>

              <Separator />

              {!isEnrolled ? (
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Set up biometric authentication to secure your transactions with {capabilities.biometryType}.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={handleEnrollBiometric}
                    disabled={isEnrolling}
                    className="w-full"
                  >
                    {isEnrolling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Setting up...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4 mr-2" />
                        Set up {capabilities.biometryType}
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      {capabilities.biometryType} is set up and ready to use.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    variant="outline" 
                    onClick={handleRemoveBiometric}
                    className="w-full"
                  >
                    Remove {capabilities.biometryType}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Authentication Preferences */}
      {capabilities.isSupported && isEnrolled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Authentication Preferences
            </CardTitle>
            <CardDescription>
              Choose your preferred authentication method for transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Preferred Authentication Method</Label>
              <RadioGroup
                value={preferences.preferredMethod}
                onValueChange={(value: AuthMethod) => handlePreferredMethodChange(value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pin" id="pin" />
                  <Label htmlFor="pin" className="flex items-center gap-2 cursor-pointer">
                    <Lock className="w-4 h-4" />
                    PIN Authentication
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="biometric" 
                    id="biometric"
                    disabled={!preferences.biometricEnabled}
                  />
                  <Label 
                    htmlFor="biometric" 
                    className={`flex items-center gap-2 cursor-pointer ${
                      !preferences.biometricEnabled ? 'opacity-50' : ''
                    }`}
                  >
                    <Fingerprint className="w-4 h-4" />
                    {capabilities.biometryType}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Fallback to PIN</Label>
                <p className="text-sm text-muted-foreground">
                  Allow PIN authentication if biometric fails
                </p>
              </div>
              <Switch
                checked={preferences.fallbackToPin}
                onCheckedChange={handleFallbackToggle}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Secure Authentication</p>
              <p className="text-sm text-muted-foreground">
                Biometric data never leaves your device and is encrypted locally
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Privacy Protected</p>
              <p className="text-sm text-muted-foreground">
                Your biometric information is not stored on our servers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Industry Standard</p>
              <p className="text-sm text-muted-foreground">
                Uses WebAuthn standard for secure authentication
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
