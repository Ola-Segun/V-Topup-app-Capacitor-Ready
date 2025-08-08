'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Fingerprint, Shield, CheckCircle } from 'lucide-react'
import { useBiometric } from '@/lib/hooks/use-biometric'
import { toast } from 'sonner'

interface BiometricSetupProps {
  userId: string
  username: string
  onComplete?: () => void
}

export function BiometricSetup({ userId, username, onComplete }: BiometricSetupProps) {
  const { isAvailable, isEnabled, isLoading, enableBiometric, disableBiometric } = useBiometric(userId)
  const [step, setStep] = useState<'intro' | 'setup' | 'complete'>('intro')

  const handleEnableBiometric = async () => {
    setStep('setup')
    
    try {
      const success = await enableBiometric(username)
      
      if (success) {
        setStep('complete')
        toast.success('Biometric authentication enabled successfully!')
        onComplete?.()
      } else {
        setStep('intro')
        toast.error('Failed to enable biometric authentication')
      }
    } catch (error) {
      setStep('intro')
      toast.error('Biometric setup failed. Please try again.')
    }
  }

  const handleDisableBiometric = async () => {
    try {
      await disableBiometric()
      toast.success('Biometric authentication disabled')
    } catch (error) {
      toast.error('Failed to disable biometric authentication')
    }
  }

  if (!isAvailable) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>
            Biometric authentication is not available on this device
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Biometric Authentication Enabled
          </CardTitle>
          <CardDescription>
            You can now use your fingerprint or face to authenticate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleDisableBiometric}
            disabled={isLoading}
          >
            Disable Biometric Authentication
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          {step === 'intro' && 'Enable Biometric Authentication'}
          {step === 'setup' && 'Setting up Biometric Authentication'}
          {step === 'complete' && 'Biometric Authentication Enabled'}
        </CardTitle>
        <CardDescription>
          {step === 'intro' && 'Secure your account with fingerprint or face recognition'}
          {step === 'setup' && 'Please follow the prompts to set up biometric authentication'}
          {step === 'complete' && 'Biometric authentication has been successfully enabled'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'intro' && (
          <>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-500" />
              <div className="text-sm">
                <p className="font-medium">Enhanced Security</p>
                <p className="text-gray-600">Quick and secure access to your account</p>
              </div>
            </div>
            <Button 
              onClick={handleEnableBiometric}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Setting up...' : 'Enable Biometric Authentication'}
            </Button>
          </>
        )}

        {step === 'setup' && (
          <div className="text-center py-8">
            <Fingerprint className="h-16 w-16 mx-auto mb-4 text-blue-500 animate-pulse" />
            <p className="text-lg font-medium">Follow the prompts</p>
            <p className="text-gray-600">Complete the biometric setup process</p>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium">Setup Complete!</p>
            <p className="text-gray-600">You can now use biometric authentication</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
