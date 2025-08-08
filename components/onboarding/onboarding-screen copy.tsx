"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Zap, Shield, Wallet, Gift, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "../theme-toggle"

const onboardingSlides = [
  {
    id: 1,
    title: "Lightning Fast Airtime",
    subtitle: "Instant top-ups in seconds",
    description: "Purchase airtime for any network instantly with our premium service. No delays, no hassles.",
    icon: Zap,
    gradient: "premium-gradient",
    illustration: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    title: "Affordable Data Plans",
    subtitle: "Best rates guaranteed",
    description: "Get the most value for your money with our competitive data bundle prices across all networks.",
    icon: Wallet,
    gradient: "emerald-gradient",
    illustration: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    title: "Secure Digital Wallet",
    subtitle: "Bank-level security",
    description: "Your money is safe with our PCI-DSS compliant wallet system. 100% secure transactions guaranteed.",
    icon: Shield,
    gradient: "premium-gradient",
    illustration: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    title: "Rewards & Cashback",
    subtitle: "Earn while you spend",
    description: "Get rewarded for every transaction. Earn cashback, unlock bonuses, and enjoy exclusive offers.",
    icon: Gift,
    gradient: "gold-gradient",
    illustration: "/placeholder.svg?height=300&width=300",
  },
]

export function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const currentSlideData = onboardingSlides[currentSlide]

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="max-w-md mx-auto px-4">
        {/* Skip button */}
        <div className="flex justify-between p-4">
        <ThemeToggle/>

        <Link href="/auth/login">
          <Button variant="ghost" className="text-muted-foreground">
            Skip
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-8"
          >
            {/* Illustration */}
            <div className="relative">
              <div className={`w-64 h-64 sm:w-80 sm:h-80 rounded-full ${currentSlideData.gradient} p-1 floating-animation`}>
                <div className="w-full h-full bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center">
                  <img
                    src={currentSlideData.illustration || "/placeholder.svg"}
                    alt={currentSlideData.title}
                    className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
                  />
                </div>
              </div>

              {/* Floating icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`absolute -bottom-4 -right-4 w-16 h-16 ${currentSlideData.gradient} rounded-full flex items-center justify-center shadow-2xl`}
              >
                <currentSlideData.icon className="w-8 h-8 text-white" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="space-y-3 px-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground"
              >
                {currentSlideData.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-base sm:text-lg font-medium text-primary"
              >
                {currentSlideData.subtitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[280px] sm:max-w-sm mx-auto"
              >
                {currentSlideData.description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress indicators */}
        <div className="flex space-x-2 mt-12">
          {onboardingSlides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 bg-white rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t border-border/50">
        <div className="w-full max-w-md mx-auto flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="text-muted-foreground disabled:opacity-30"
          >
            Back
          </Button>

          {currentSlide === onboardingSlides.length - 1 ? (
            <Link href="/auth/register">
              <Button className="premium-gradient text-white px-8">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button onClick={nextSlide} className="premium-gradient text-white px-8">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
