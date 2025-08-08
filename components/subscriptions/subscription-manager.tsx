"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Calendar, Smartphone, Wifi, Tv, Zap, Plus, Settings, Trash2 } from "lucide-react"
import Link from "next/link"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface Subscription {
  id: string
  type: "airtime" | "data" | "cable" | "electricity"
  service: string
  amount: number
  frequency: "daily" | "weekly" | "monthly"
  nextBilling: string
  active: boolean
  autoRenew: boolean
  icon: any
  color: string
}

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    type: "airtime",
    service: "MTN Airtime - 08012345678",
    amount: 1000,
    frequency: "weekly",
    nextBilling: "2024-01-20",
    active: true,
    autoRenew: true,
    icon: Smartphone,
    color: "text-blue-500",
  },
  {
    id: "2",
    type: "data",
    service: "Airtel 5GB Monthly - 08087654321",
    amount: 2000,
    frequency: "monthly",
    nextBilling: "2024-01-25",
    active: true,
    autoRenew: true,
    icon: Wifi,
    color: "text-green-500",
  },
  {
    id: "3",
    type: "cable",
    service: "DSTV Compact - 1234567890",
    amount: 9000,
    frequency: "monthly",
    nextBilling: "2024-01-30",
    active: false,
    autoRenew: false,
    icon: Tv,
    color: "text-purple-500",
  },
  {
    id: "4",
    type: "electricity",
    service: "PHCN Units - 12345678901",
    amount: 5000,
    frequency: "monthly",
    nextBilling: "2024-02-01",
    active: true,
    autoRenew: true,
    icon: Zap,
    color: "text-amber-500",
  },
]

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions)

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, active: !sub.active } : sub)))
    toast.success("Subscription updated successfully")
  }

  const toggleAutoRenew = (id: string) => {
    setSubscriptions((prev) => prev.map((sub) => (sub.id === id ? { ...sub, autoRenew: !sub.autoRenew } : sub)))
    toast.success("Auto-renewal setting updated")
  }

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id))
    toast.success("Subscription deleted successfully")
  }

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      daily: "bg-green-500/20 text-green-500",
      weekly: "bg-blue-500/20 text-blue-500",
      monthly: "bg-purple-500/20 text-purple-500",
    }
    return colors[frequency as keyof typeof colors] || "bg-gray-500/20 text-gray-500"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const totalMonthlySpend = subscriptions
    .filter((sub) => sub.active)
    .reduce((total, sub) => {
      const multiplier = sub.frequency === "daily" ? 30 : sub.frequency === "weekly" ? 4 : 1
      return total + sub.amount * multiplier
    }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <PremiumMobileNav />

      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="material-card shadow-lg">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">My Subscriptions</h1>
            <p className="text-muted-foreground">Manage your recurring payments</p>
          </div>
        </motion.div>

        {/* Overview Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="material-card shadow-xl border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold">{subscriptions.filter((sub) => sub.active).length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Monthly Spend</p>
                  <p className="text-2xl font-bold">₦{totalMonthlySpend.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Add New Subscription */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="material-card shadow-xl border-0 border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Add New Subscription</h3>
              <p className="text-sm text-muted-foreground">Set up recurring payments for your services</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscriptions List */}
        <div className="space-y-4">
          {subscriptions.map((subscription, index) => (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className={`material-card shadow-xl border-0 ${!subscription.active ? "opacity-60" : ""}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                        <subscription.icon className={`w-6 h-6 ${subscription.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{subscription.service}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={`${getFrequencyBadge(subscription.frequency)} border-0 text-xs`}>
                            {subscription.frequency}
                          </Badge>
                          <span className="text-xs text-muted-foreground">₦{subscription.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Switch checked={subscription.active} onCheckedChange={() => toggleSubscription(subscription.id)} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Next billing</span>
                      </div>
                      <span className="text-sm font-medium">{formatDate(subscription.nextBilling)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Auto-renewal</span>
                      </div>
                      <Switch
                        checked={subscription.autoRenew}
                        onCheckedChange={() => toggleAutoRenew(subscription.id)}
                        disabled={!subscription.active}
                      />
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 material-button bg-transparent"
                        disabled={!subscription.active}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 material-button text-red-500 hover:bg-red-500/10 bg-transparent"
                        onClick={() => deleteSubscription(subscription.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {subscriptions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No subscriptions yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
