"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, Shield, Zap, Star, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export function WelcomeScreen() {
  const features = [
    {
      icon: Zap,
      title: "Instant Top-ups",
      description: "Lightning-fast airtime and data purchases",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Bank-level security for all transactions",
    },
    {
      icon: Smartphone,
      title: "All Networks",
      description: "Support for MTN, Airtel, Glo, and 9mobile",
    },
    {
      icon: Wifi,
      title: "24/7 Service",
      description: "Available anytime, anywhere",
    },
  ]

  const benefits = [
    "No hidden fees",
    "Instant delivery",
    "24/7 customer support",
    "Secure transactions",
    "Multiple payment options",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-4 mobile-container">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">TopUp Pro</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <section className="mobile-container py-12 text-center">
        <Badge variant="secondary" className="mb-4">
          <Star className="w-3 h-3 mr-1" />
          Trusted by 50,000+ users
        </Badge>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Instant Airtime & Data Top-ups
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          The fastest and most secure way to recharge your phone. Support for all major networks with instant delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/auth/register">
            <Button size="lg" className="w-full sm:w-auto gradient-bg">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mobile-container py-12">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Why Choose TopUp Pro?</h2>
              <p className="text-muted-foreground">
                Join thousands of satisfied customers who trust us for their mobile top-ups
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Our Promise</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Ready to Start?</h3>
                <p className="text-muted-foreground mb-4">
                  Create your account in less than 2 minutes and start enjoying instant top-ups.
                </p>
                <Link href="/auth/register">
                  <Button className="w-full">
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="mobile-container py-8 text-center text-muted-foreground">
        <p>&copy; 2024 TopUp Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}
