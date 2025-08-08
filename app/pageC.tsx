"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Smartphone,
  Wifi,
  Shield,
  Zap,
  Star,
  Users,
  CheckCircle,
  ArrowRight,
  Tv,
  Gift,
  TrendingUp,
  Clock,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

const features = [
  {
    icon: Smartphone,
    title: "Instant Airtime",
    description: "Top up any network instantly with zero delays",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Wifi,
    title: "Data Bundles",
    description: "Best data plans at unbeatable prices",
    color: "from-green-500 to-green-700",
  },
  {
    icon: Tv,
    title: "Cable TV",
    description: "Pay for DSTV, GOtv, and other subscriptions",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: Zap,
    title: "Electricity Bills",
    description: "Quick and secure electricity payments",
    color: "from-yellow-500 to-yellow-700",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Bank-level security for all transactions",
    color: "from-red-500 to-red-700",
  },
  {
    icon: Gift,
    title: "Cashback Rewards",
    description: "Earn points and cashback on every transaction",
    color: "from-pink-500 to-pink-700",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Owner",
    content:
      "TopUp Pro has made managing my business expenses so much easier. The instant transactions and cashback rewards are amazing!",
    rating: 5,
    avatar: "👩‍💼",
  },
  {
    name: "Michael Chen",
    role: "Student",
    content:
      "As a student, every naira counts. The affordable data plans and rewards system help me save money while staying connected.",
    rating: 5,
    avatar: "👨‍🎓",
  },
  {
    name: "Fatima Abdul",
    role: "Freelancer",
    content:
      "The reliability and speed of TopUp Pro is unmatched. I never have to worry about failed transactions anymore.",
    rating: 5,
    avatar: "👩‍💻",
  },
]

const stats = [
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Transactions", value: "1M+", icon: TrendingUp },
  { label: "Uptime", value: "99.9%", icon: Clock },
  { label: "Networks", value: "All", icon: Globe },
]

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">TopUp Pro</span>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="ghost" className="material-button">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mobile-container">
        {/* Hero Section */}
        <section className="py-16 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full"></div>
              <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Smartphone className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Your Ultimate
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Digital Wallet
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Instant airtime, data, bill payments, and more. Experience the fastest and most secure way to manage
                your digital transactions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button className="material-button bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-xl hover:shadow-2xl px-8 py-3 text-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="material-button border-border bg-background text-foreground px-8 py-3 text-lg"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-6 pt-8">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Bank-level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">Instant Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-muted-foreground">5-Star Rated</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="material-card bg-card border-border shadow-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-3">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-bold text-foreground">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From airtime to bill payments, we've got all your digital transaction needs covered with unmatched speed
              and security.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Card className="material-card bg-card border-border hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl font-bold text-foreground">What Our Users Say</h2>
            <p className="text-muted-foreground">Join thousands of satisfied customers who trust TopUp Pro</p>
          </motion.div>

          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : index % 2 === 0 ? -20 : 20 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
              >
                <Card className="material-card bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            {testimonial.role}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{testimonial.content}</p>
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="material-card bg-gradient-to-br from-primary/10 to-purple-600/10 border-primary/20 shadow-2xl">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Join thousands of users who have made TopUp Pro their go-to platform for all digital transactions.
                    Sign up now and get bonus points on your first transaction!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/register">
                    <Button className="material-button bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-xl hover:shadow-2xl px-8 py-3 text-lg">
                      Create Free Account
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      className="material-button border-border bg-background text-foreground px-8 py-3 text-lg"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No setup fees • Instant activation • 24/7 support</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="mobile-container py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-600 rounded-md flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">TopUp Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TopUp Pro. All rights reserved. Your trusted digital wallet solution.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Secured by 256-bit SSL encryption</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
