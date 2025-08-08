"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, Wallet, History, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import { WalletBalance } from "@/components/wallet/wallet-balance"

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [walletBalance] = useState(5000) // Mock balance

  const quickActions = [
    {
      title: "Buy Airtime",
      description: "Instant airtime top-up",
      icon: Smartphone,
      href: "/dashboard/airtime",
      color: "bg-blue-500",
    },
    {
      title: "Buy Data",
      description: "Data bundles for all networks",
      icon: Wifi,
      href: "/dashboard/data",
      color: "bg-green-500",
    },
    {
      title: "Fund Wallet",
      description: "Add money to your wallet",
      icon: Plus,
      href: "/dashboard/wallet",
      color: "bg-purple-500",
    },
    {
      title: "Transaction History",
      description: "View all transactions",
      icon: History,
      href: "/dashboard/history",
      color: "bg-orange-500",
    },
  ]

  const recentTransactions = [
    {
      id: 1,
      type: "Airtime",
      network: "MTN",
      amount: 1000,
      phone: "08012345678",
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: 2,
      type: "Data",
      network: "Airtel",
      amount: 2000,
      phone: "08087654321",
      status: "completed",
      date: "2024-01-14",
    },
    {
      id: 3,
      type: "Wallet Funding",
      network: "Paystack",
      amount: 5000,
      phone: "-",
      status: "completed",
      date: "2024-01-13",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileNav />

      <div className="mobile-container py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user.user_metadata?.full_name || "User"}!</h1>
          <p className="text-muted-foreground">Manage your airtime and data purchases</p>
        </div>

        {/* Wallet Balance */}
        <WalletBalance balance={walletBalance} />

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">₦12,500</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <History className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Your latest activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted/50 dark:bg-muted/30 rounded-lg hover:bg-muted/70 dark:hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                      {transaction.type === "Airtime" ? (
                        <Smartphone className="w-5 h-5 text-primary" />
                      ) : transaction.type === "Data" ? (
                        <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      )}
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
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-500/20 text-green-600 dark:text-green-400 border-0"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/dashboard/history">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Transactions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
