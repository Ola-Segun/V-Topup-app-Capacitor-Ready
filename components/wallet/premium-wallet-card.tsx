"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Wallet, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface PremiumWalletCardProps {
  balance: number
  cardType: "main" | "airtime" | "data" | "bills"
  holderName: string
}

export function PremiumWalletCard({ balance, cardType, holderName }: PremiumWalletCardProps) {
  const [showBalance, setShowBalance] = useState(true)
  const [isFlipped, setIsFlipped] = useState(false)

  const cardConfigs = {
    main: {
      gradient: "bg-gradient-to-br from-slate-800 via-slate-900 to-black",
      accent: "from-blue-400 to-purple-500",
      title: "Main Wallet",
    },
    airtime: {
      gradient: "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900",
      accent: "from-cyan-400 to-blue-500",
      title: "Airtime Wallet",
    },
    data: {
      gradient: "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900",
      accent: "from-green-400 to-emerald-500",
      title: "Data Wallet",
    },
    bills: {
      gradient: "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900",
      accent: "from-pink-400 to-purple-500",
      title: "Bills Wallet",
    },
  }

  const config = cardConfigs[cardType]

  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full h-56 transform-style-preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of Card */}
        <Card className="absolute py-0 h-fit bg-gray-800 inset-0 backface-hidden material-card-floating border-0 overflow-hidden">
          <CardContent className="p-0 h-fit">
            <div className={`${config.gradient} px-6 py-4 text-white relative overflow-hidden texture-carbon`}>
              {/* Holographic Effect */}
              <div className="absolute right-6 w-8 h-8 bg-gradient-to-r from-white/40 to-white/10 rounded-lg opacity-60"></div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 right-8 w-32 h-32 border border-white/20 rounded-full"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 border border-white/20 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-20 h-20 border border-white/20 rounded-full"></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm flex items-center justify-center">
                      <div className="w-4 h-3 bg-yellow-300 rounded-sm"></div>
                    </div>
                    <span className="text-white/80 text-sm font-medium">{config.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowBalance(!showBalance)
                    }}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Balance */}
                <div className="my-4">
                  <p className="text-white/70 text-sm mb-1">Available Balance</p>
                  <p className="text-3xl font-bold font-mono tracking-wider">
                    {showBalance ? `₦${balance.toLocaleString()}` : "₦••••••"}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/70 text-xs mb-1">CARD HOLDER</p>
                    <p className="font-semibold text-sm tracking-wide">{holderName.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs mb-1">VALID THRU</p>
                    <p className="font-mono text-sm">12/28</p>
                  </div>
                </div>

                {/* Logo */}
                <div className="absolute " style={ { right: "0.5rem", bottom: "4rem" } }>
                  <div
                    className={`w-12 h-8 bg-gradient-to-r ${config.accent} rounded-md flex items-center justify-center opacity-80`}
                  >
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back of Card */}
        <Card className="absolute py-0 h-fit bg-gray-800 bg-gradient-to-br from-gray-800 to-gray-900 inset-0 backface-hidden rotate-y-180 material-card-floating border-0 overflow-hidden">
          <CardContent className="p-0 h-fit">
            <div className={`${config.gradient} h-full px-6 py-4 text-white relative overflow-hidden`}>
              {/* Magnetic Strip */}
              <div className="w-full h-12 bg-black mt-4 mb-6"></div>

              {/* CVV Section */}
              <div className="bg-white/90 rounded-lg px-4 py-2 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-black text-xs mb-1">CVV</p>
                    <p className="text-black font-mono font-bold">***</p>
                  </div>
                  <div className="text-right">
                    <p className="text-black text-xs mb-1">CARD ID</p>
                    <p className="text-black font-mono text-sm">**** 1234</p>
                  </div>
                </div>
              </div>


              {/* Security Info */}
              <div className="absolute bottom-4 left-6 right-6">
                <p className="text-xs text-white/60 text-center">Protected by 256-bit SSL encryption</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
