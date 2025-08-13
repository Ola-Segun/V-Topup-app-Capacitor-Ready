"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Fingerprint, Shield, CheckCircle, AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { useBiometric } from '@/lib/hooks/use-biometric'
import { toast } from 'sonner'
import { log } from 'console'

interface BiometricSetupCardProps {
  userId: string
}

export function BiometricSetupCard({ userId }: BiometricSetupCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { isSupported, isRegistered, isLoading, register, remove } = useBiometric(userId)

  const handleRegister = async () => {
    setIsProcessing(true)
    try {
      const result = await register()
      
      if (result.success) {
        toast.success('Biometric authentication enabled successfully!')
      } else {
        toast.error('Failed to enable biometric authentication')
        console.log('Biometric registration failed', result.error)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.log('Biometric registration error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemove = async () => {
    setIsProcessing(true)
    try {
      await remove()
      toast.success('Biometric authentication disabled')
    } catch (error) {
      toast.error('Failed to disable biometric authentication')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Biometric Authentication
            <Badge variant="secondary">Not Supported</Badge>
          </CardTitle>
          <CardDescription>
            Your device doesn't support biometric authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Biometric authentication requires a compatible device with fingerprint sensor, Face ID, or Windows Hello.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          Biometric Authentication
          {isRegistered ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Enabled
            </Badge>
          ) : (
            <Badge variant="secondary">Disabled</Badge>
          )}
        </CardTitle>
        <CardDescription>
          {isRegistered 
            ? 'Use your fingerprint or face to secure your transactions'
            : 'Enable biometric authentication for enhanced security'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isRegistered ? (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Biometric authentication is active. You can use your fingerprint or face to authorize transactions.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={handleRemove}
                disabled={isProcessing}
                size="sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Disable
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="p-3 bg-blue-100 rounded-full">
                <Fingerprint className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Quick & Secure Access</h4>
                <p className="text-sm text-muted-foreground">
                  Authorize transactions with just a touch or glance
                </p>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your biometric data is stored securely on your device and never shared with our servers.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleRegister}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Enable Biometric Authentication
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
