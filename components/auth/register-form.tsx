"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Eye, EyeOff, Smartphone, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const benefits = [
  "Instant airtime and data top-ups",
  "Secure bill payments",
  "Cashback rewards on every transaction",
  "24/7 customer support",
]

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
      })
      toast.success("Account created successfully!", {
        description: "Welcome to TopUp Pro! You can now start using our services.",
      })
      router.push("/dashboard")
    } catch (error) {
      toast.error("Registration failed", {
        description: "Please try again or contact support if the problem persists.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="material-card">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="mobile-container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-2xl rounded-full"></div>
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Join TopUp Pro</h1>
              <p className="text-muted-foreground">Create your account and start saving</p>
            </div>
          </div>

          {/* Benefits */}
          <Card className="material-card border-border/50 bg-card">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">What you'll get:</h3>
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card className="material-card border-border/50 bg-card shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-xl font-bold text-foreground">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground">Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="material-input bg-background border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="material-input bg-background border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="material-input bg-background border-border text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="material-input bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="material-input bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-1 content-center">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="flex text-muted-foreground leading-relaxed " style={{ fontSize: "12px", lineHeight: "1" }}>
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full material-button bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-xl hover:shadow-2xl h-12 text-lg font-semibold"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Your data is protected with bank-level security</span>
              </div>
            </CardContent>
          </Card>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
