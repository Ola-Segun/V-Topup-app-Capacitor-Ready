"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, Wallet, History, Plus, TrendingUp, Bell, Gift, Zap, Shield, BarChart3, Check } from 'lucide-react'
import Link from "next/link"
import { motion } from "framer-motion"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { PremiumWalletCard } from "@/components/wallet/premium-wallet-card"
import { ServiceCategories } from "@/components/services/service-categories"

interface PremiumDashboardProps {
  user: User
}

export function PremiumDashboard({ user }: PremiumDashboardProps) {
  const [walletBalance] = useState(25750)

  const quickActions = [
    {
      title: "Buy Airtime",
      description: "Instant top-up",
      icon: Smartphone,
      href: "/dashboard/airtime",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
      delay: 0.1,
    },
    {
      title: "Buy Data",
      description: "Best data plans",
      icon: Wifi,
      href: "/dashboard/data",
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      delay: 0.2,
    },
    {
      title: "Fund Wallet",
      description: "Add money",
      icon: Plus,
      href: "/dashboard/wallet",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
      delay: 0.3,
    },
    {
      title: "View Stats",
      description: "Spending insights",
      icon: BarChart3,
      href: "/dashboard/stats",
      gradient: "bg-gradient-to-br from-amber-500 to-amber-700",
      delay: 0.4,
    },
  ]

  const recentTransactions = [
    {
      id: 1,
      type: "Airtime",
      network: "MTN",
      amount: 1000,
      phone: "08012345678",
      status: Check,
      date: "2 mins ago",
      icon: Smartphone,
      color: "text-blue-500",
    },
    {
      id: 2,
      type: "Data",
      network: "Airtel",
      amount: 2000,
      phone: "08087654321",
      status: Check,
      date: "1 hour ago",
      icon: Wifi,
      color: "text-green-500",
    },
    // {
    //   id: 3,
    //   type: "Cable TV",
    //   network: "DSTV",
    //   amount: 4500,
    //   phone: "Premium Package",
    //   status: "completed",
    //   date: "Yesterday",
    //   icon: Wallet,
    //   color: "text-purple-500",
    // },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 ">
      <PremiumMobileNav />

      <div className="mobile-container py-3 space-y-4">

        {/* Premium wallet card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
        >
          <PremiumWalletCard
            balance={walletBalance}
            cardType="main"
            holderName={user.user_metadata?.full_name || "Demo User"}
          />
        </motion.div>

        {/* Quick actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: action.delay }}
              >
                <Link href={action.href}>
                  <Card className="material-card py-0 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden bg-card h-full">
                    <CardContent className="p-0 h-full">
                      <div className={`${action.gradient} p-2 h-full text-white relative grid align-items-center`}>
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-2 right-2 w-16 h-16 border border-white/20 rounded-full"></div>
                          <div className="absolute -bottom-4 -left-4 w-20 h-20 border border-white/20 rounded-full"></div>
                        </div>

                        <div className="relative z-10 flex items-center space-x-3">
                          <motion.div 
                            className="p-2 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
                            whileTap={{ scale: 0.95 }}
                          >
                            <action.icon className="w-6 h-6" />
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-sm">{action.title}</h3>
                            <p className="text-white/80" style={{ fontSize: "0.7rem" }}>{action.description}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.6 }}
          >
            <Card className="material-card py-0 shadow-xl border-0 bg-card h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-xl font-bold text-foreground">₦12,500</p>
                    <p className="text-xs text-green-500 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8.2%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.7 }}
          >
            <Card className="material-card py-0 shadow-xl border-0 bg-card h-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-xl font-bold text-foreground">47</p>
                    <p className="text-xs text-blue-500 flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      All successful
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <History className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.9 }}
        >
          <Card className="material-card shadow-xl border-0 bg-card py-0">
            <CardContent className="p-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Recent Transactions</h3>
                <Link href="/dashboard/history">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center shadow-md">
                        <transaction.icon className={`w-5 h-5 ${transaction.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {transaction.type} - {transaction.network}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.phone} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-foreground">₦{transaction.amount.toLocaleString()}</p>
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-500 border-0">
                        <transaction.status className=" font-extrabold" />
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security badge */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-background/80 border border-border/50 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Protected by 256-bit SSL encryption</span>
          </div>
        </motion.div> */}
      </div>
    </div>
  )
}
