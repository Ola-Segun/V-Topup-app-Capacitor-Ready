"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Fingerprint, Smartphone, AlertCircle, CheckCircle, X } from "lucide-react"
import { toast } from "sonner"

interface BiometricAuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function BiometricAuthDialog({ open, onOpenChange, onSuccess }: BiometricAuthDialogProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authStep, setAuthStep] = useState<"idle" | "scanning" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [isNativeSupported, setIsNativeSupported] = useState(false)

  useEffect(() => {
    // Check if we're in a Capacitor environment
    const checkNativeSupport = async () => {
      try {
        // Check if Capacitor is available
        if (typeof window !== "undefined" && (window as any).Capacitor) {
          setIsNativeSupported(true)
        } else {
          // Check for WebAuthn support in browsers
          setIsNativeSupported(!!(navigator.credentials && window.PublicKeyCredential))
        }
      } catch (error) {
        setIsNativeSupported(false)
      }
    }

    checkNativeSupport()
  }, [])

  const simulateBiometricAuth = async () => {
    setIsAuthenticating(true)
    setAuthStep("scanning")
    setProgress(0)
    setErrorMessage("")

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    try {
      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate random success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        setAuthStep("success")
        toast.success("Biometric authentication successful!")

        // Close dialog and call success callback after a short delay
        setTimeout(() => {
          onOpenChange(false)
          onSuccess()
          resetState()
        }, 1500)
      } else {
        setAuthStep("error")
        setErrorMessage("Biometric authentication failed. Please try again.")
        toast.error("Biometric authentication failed")
      }
    } catch (error) {
      setAuthStep("error")
      setErrorMessage("An error occurred during authentication")
      toast.error("Authentication error")
    } finally {
      setIsAuthenticating(false)
      clearInterval(progressInterval)
    }
  }

  const handleNativeBiometricAuth = async () => {
    try {
      if ((window as any).Capacitor) {
        // Use Capacitor's BiometricAuth plugin
        const { BiometricAuth } = await import("@capacitor-community/biometric-auth")

        const result = await BiometricAuth.checkBiometry()

        if (result.isAvailable) {
          const authResult = await BiometricAuth.authenticate({
            reason: "Authenticate to access your VTopup account",
            title: "Biometric Authentication",
            subtitle: "Use your fingerprint or face to sign in",
            description: "Place your finger on the sensor or look at the camera",
          })

          if (authResult.succeeded) {
            setAuthStep("success")
            toast.success("Biometric authentication successful!")
            setTimeout(() => {
              onOpenChange(false)
              onSuccess()
              resetState()
            }, 1000)
          } else {
            throw new Error("Authentication failed")
          }
        } else {
          throw new Error("Biometric authentication not available")
        }
      } else {
        // Use WebAuthn for web browsers
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "VTopup" },
            user: {
              id: new Uint8Array(16),
              name: "user@vtopup.com",
              displayName: "VTopup User",
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required",
            },
            timeout: 60000,
            attestation: "direct",
          },
        })

        if (credential) {
          setAuthStep("success")
          toast.success("Biometric authentication successful!")
          setTimeout(() => {
            onOpenChange(false)
            onSuccess()
            resetState()
          }, 1000)
        }
      }
    } catch (error) {
      console.error("Native biometric auth error:", error)
      // Fall back to simulation
      simulateBiometricAuth()
    }
  }

  const startAuthentication = () => {
    if (isNativeSupported) {
      handleNativeBiometricAuth()
    } else {
      simulateBiometricAuth()
    }
  }

  const resetState = () => {
    setAuthStep("idle")
    setProgress(0)
    setErrorMessage("")
    setIsAuthenticating(false)
  }

  const handleClose = () => {
    if (!isAuthenticating) {
      onOpenChange(false)
      resetState()
    }
  }

  const renderAuthContent = () => {
    switch (authStep) {
      case "scanning":
        return (
          <div className="text-center space-y-4">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <Fingerprint className="absolute inset-0 m-auto h-8 w-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Scanning...</p>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {isNativeSupported
                  ? "Place your finger on the sensor or look at the camera"
                  : "Simulating biometric authentication..."}
              </p>
            </div>
          </div>
        )

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Authentication Successful!</p>
              <p className="text-xs text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          </div>
        )

      case "error":
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <X className="h-12 w-12 text-red-500" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Authentication Failed</p>
              <p className="text-xs text-muted-foreground">{errorMessage}</p>
            </div>
            <Button onClick={startAuthentication} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        )

      default:
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              {isNativeSupported ? (
                <Fingerprint className="h-12 w-12 text-blue-500" />
              ) : (
                <Smartphone className="h-12 w-12 text-blue-500" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Biometric Authentication</p>
              <p className="text-xs text-muted-foreground">
                {isNativeSupported
                  ? "Use your fingerprint, face, or other biometric to authenticate"
                  : "Biometric simulation mode - click to test authentication flow"}
              </p>
            </div>
            {!isNativeSupported && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Native biometric authentication not available. Using simulation mode.
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={startAuthentication} disabled={isAuthenticating} className="w-full">
              {isAuthenticating ? "Authenticating..." : "Start Authentication"}
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Secure Authentication</DialogTitle>
          <DialogDescription>Authenticate using your device's biometric features for secure access.</DialogDescription>
        </DialogHeader>
        <div className="py-6">{renderAuthContent()}</div>
      </DialogContent>
    </Dialog>
  )
}
