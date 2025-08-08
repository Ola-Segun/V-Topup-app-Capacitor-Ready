"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Progress } from "@/components/ui/progress"
import { Shield, Eye, EyeOff, Smartphone, AlertTriangle, CheckCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AdminLoginFormProps {
  onLogin?: (credentials: any) => void
}

export function AdminLoginForm({ onLogin }: AdminLoginFormProps) {
  const [step, setStep] = useState<"credentials" | "2fa" | "verification">("credentials")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [verificationMethod, setVerificationMethod] = useState<"app" | "sms" | "email">("app")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const maxAttempts = 3

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate credential validation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (email === "admin@vtopup.com" && password === "admin123") {
      setStep("2fa")
    } else {
      setAttempts((prev) => prev + 1)
      setError("Invalid credentials. Please try again.")
      if (attempts >= maxAttempts - 1) {
        setError("Too many failed attempts. Account temporarily locked.")
      }
    }
    setIsLoading(false)
  }

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate 2FA validation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (otpCode === "123456") {
      setStep("verification")
      // Simulate final verification
      setTimeout(() => {
        onLogin?.({ email, verified: true })
      }, 1500)
    } else {
      setError("Invalid verification code. Please try again.")
    }
    setIsLoading(false)
  }

  const resendCode = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success message
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl dark:bg-gray-900/80">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
              <CardDescription>
                {step === "credentials" && "Enter your admin credentials"}
                {step === "2fa" && "Two-factor authentication required"}
                {step === "verification" && "Verifying your identity..."}
              </CardDescription>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                {["credentials", "2fa", "verification"].map((s, index) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        step === s
                          ? "bg-blue-600 text-white"
                          : index < ["credentials", "2fa", "verification"].indexOf(step)
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {index < ["credentials", "2fa", "verification"].indexOf(step) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 2 && (
                      <div
                        className={`w-8 h-0.5 mx-2 transition-colors ${
                          index < ["credentials", "2fa", "verification"].indexOf(step)
                            ? "bg-green-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Progress value={step === "credentials" ? 33 : step === "2fa" ? 66 : 100} className="h-1" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {step === "credentials" && (
                <motion.form
                  key="credentials"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleCredentialsSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@vtopup.com"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="h-12 pr-12"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {attempts > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {attempts}/{maxAttempts} attempts used.
                        {attempts >= maxAttempts ? " Account locked." : ""}
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-medium"
                    disabled={isLoading || attempts >= maxAttempts}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </motion.form>
              )}

              {step === "2fa" && (
                <motion.div
                  key="2fa"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Enter the 6-digit code from your authenticator app</p>
                  </div>

                  <form onSubmit={handle2FASubmit} className="space-y-4">
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-3">
                      <Button type="submit" className="w-full h-12" disabled={isLoading || otpCode.length !== 6}>
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Verifying...</span>
                          </div>
                        ) : (
                          "Verify Code"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={resendCode}
                        disabled={isLoading}
                      >
                        Resend Code
                      </Button>
                    </div>
                  </form>

                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("credentials")}
                      className="text-muted-foreground"
                    >
                      ← Back to login
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "verification" && (
                <motion.div
                  key="verification"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </motion.div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Access Granted</h3>
                      <p className="text-sm text-muted-foreground">Welcome back, Admin. Redirecting to dashboard...</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress value={100} className="h-2" />
                    <p className="text-xs text-muted-foreground">Setting up your session...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-xs text-muted-foreground bg-white/50 dark:bg-gray-900/50 px-3 py-2 rounded-full backdrop-blur-sm">
            <Shield className="w-3 h-3" />
            <span>Protected by enterprise-grade security</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
