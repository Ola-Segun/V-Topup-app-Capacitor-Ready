"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Fingerprint, Shield, AlertTriangle, Loader2 } from 'lucide-react'
import { useBiometric } from '@/lib/hooks/use-biometric'
import { toast } from 'sonner'

interface BiometricAuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  onFallback: () => void
  userId: string
  title?: string
  description?: string
}

export function BiometricAuthDialog({
  open,
  onOpenChange,
  onSuccess,
  onFallback,
  userId,
  title = "Biometric Authentication",
  description = "Use your fingerprint or face to authenticate this transaction"
}: BiometricAuthDialogProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { isSupported, isRegistered, authenticate } = useBiometric(userId)

  const handleAuthenticate = async () => {
    setIsAuthenticating(true)

    try {
      const result = await authenticate()
      
      if (result.success) {
        toast.success("Authentication successful!")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error('Authentication failed')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleFallback = () => {
    onOpenChange(false)
    onFallback()
  }

  if (!isSupported || !isRegistered) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Biometric Not Available
            </DialogTitle>
            <DialogDescription>
              Biometric authentication is not available on this device or not set up.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please use PIN authentication instead.
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={handleFallback} className="flex-1">
                Use PIN Instead
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="relative">
            <div className={`p-6 rounded-full ${isAuthenticating ? 'bg-blue-100 animate-pulse' : 'bg-gray-100'}`}>
              <Fingerprint className={`h-12 w-12 ${isAuthenticating ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            {isAuthenticating && (
              <div className="absolute -top-1 -right-1">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isAuthenticating ? 'Authenticating...' : 'Touch the sensor or look at your device'}
            </p>
          </div>

        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleAuthenticate} 
            disabled={isAuthenticating}
            className="w-full"
          >
            {isAuthenticating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Fingerprint className="mr-2 h-4 w-4" />
                Authenticate
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={handleFallback} disabled={isAuthenticating}>
            Use PIN Instead
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
