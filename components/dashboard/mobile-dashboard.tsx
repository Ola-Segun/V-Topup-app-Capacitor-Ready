"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Smartphone, Wifi, Tv, Zap, CreditCard, TrendingUp, Eye, EyeOff, Plus, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle, Gift, Target, Bell, Settings, History, Star } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { useAuth } from "@/components/auth-provider"
import { toast } from "sonner"
import Link from "next/link"

interface QuickAction {
  id: string
  title: string
  icon: any
  color: string
  bgColor: string
  route: string
  amount?: number
}

interface RecentTransaction {
  id: string
  type: string
  description: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
  icon: any
}

interface Budget {
  id: string
  name: string
  category: string
  spent: number
  limit: number
  percentage: number
  color: string
}

const quickActions: QuickAction[] = [
  {
    id: 'airtime_100',
    title: '₦100 Airtime',
    icon: Smartphone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    route: '/dashboard/airtime',
    amount: 100
  },
  {
    id: 'airtime_200',
    title: '₦200 Airtime',
    icon: Smartphone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
    route: '/dashboard/airtime',
    amount: 200
  },
  {
    id: 'data_1gb',
    title: '1GB Data',
    icon: Wifi,
    color: 'text-green-600',
    bgColor: 'bg-green-500',
    route: '/dashboard/data'
  },
  {
    id: 'fund_wallet',
    title: 'Fund Wallet',
    icon: CreditCard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
    route: '/dashboard/wallet'
  }
]

export function MobileDashboard() {
  const { user } = useAuth()
  const [walletBalance, setWalletBalance] = useState(25750)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock recent transactions
      setRecentTransactions([
        {
          id: '1',
          type: 'airtime',
          description: 'MTN Airtime - 08012345678',
          amount: -1000,
          status: 'completed',
          timestamp: '2 mins ago',
          icon: Smartphone
        },
        {
          id: '2',
          type: 'data',
          description: 'Airtel 5GB Data - 08087654321',
          amount: -2500,
          status: 'completed',
          timestamp: '1 hour ago',
          icon: Wifi
        },
        {
          id: '3',
          type: 'wallet_funding',
          description: 'Wallet Funding via Paystack',
          amount: 10000,
          status: 'completed',
          timestamp: '3 hours ago',
          icon: CreditCard
        },
        {
          id: '4',
          type: 'electricity',
          description: 'EKEDC Payment - 12345678901',
          amount: -5000,
          status: 'pending',
          timestamp: '5 hours ago',
          icon: Zap
        }
      ])

      // Mock budgets
      setBudgets([
        {
          id: '1',
          name: 'Airtime',
          category: 'mobile',
          spent: 8500,
          limit: 10000,
          percentage: 85,
          color: 'bg-blue-500'
        },
        {
          id: '2',
          name: 'Data',
          category: 'mobile',
          spent: 12000,
          limit: 15000,
          percentage: 80,
          color: 'bg-green-500'
        },
        {
          id: '3',
          name: 'Utilities',
          category: 'bills',
          spent: 18000,
          limit: 25000,
          percentage: 72,
          color: 'bg-orange-500'
        }
      ])

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'pending':
        return Clock
      case 'failed':
        return AlertCircle
      default:
        return Clock
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pb-20">
        <PremiumMobileNav />
        <div className="mobile-container py-6 space-y-6">
          {/* Loading skeleton */}
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            </div>
            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <PremiumMobileNav />

      <div className="mobile-container py-6 space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary/90 to-purple-600 text-white shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm font-medium">Wallet Balance</p>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-3xl font-bold">
                      {isBalanceVisible ? `₦${walletBalance.toLocaleString()}` : '₦••••••'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleBalanceVisibility}
                      className="text-white hover:bg-white/10 h-8 w-8"
                    >
                      {isBalanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <Link href="/dashboard/wallet">
                    <Button 
                      size="sm" 
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Fund
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.5% this month</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>VIP Status</span>
                </div>
              </div>
            </CardContent>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => {
                  const ActionIcon = action.icon
                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={action.route}>
                        <Card className="border-2 border-border/50 hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-md bg-background/50">
                          <CardContent className="p-4 text-center">
                            <div className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                              <ActionIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-sm">{action.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">Tap to buy</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Budget Overview */}
        {budgets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Budget Overview
                  </CardTitle>
                  <Link href="/dashboard/budget">
                    <Button variant="ghost" size="sm" className="text-primary">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgets.slice(0, 3).map((budget, index) => (
                    <motion.div
                      key={budget.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${budget.color} rounded-full`}></div>
                          <span className="font-medium text-sm">{budget.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            ₦{budget.spent.toLocaleString()} / ₦{budget.limit.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{budget.percentage}% used</p>
                        </div>
                      </div>
                      <Progress 
                        value={budget.percentage} 
                        className="h-2"
                        style={{
                          background: `linear-gradient(to right, ${budget.color.replace('bg-', 'rgb(var(--')} ${budget.percentage}%, rgb(var(--muted)) ${budget.percentage}%)`
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Recent Transactions
                </CardTitle>
                <Link href="/dashboard/history">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {recentTransactions.slice(0, 4).map((transaction, index) => {
                    const TransactionIcon = transaction.icon
                    const StatusIcon = getStatusIcon(transaction.status)
                    
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center border border-border/30">
                            <TransactionIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{transaction.description}</p>
                            <div className="flex items-center space-x-2">
                              <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                              <Badge className={`text-xs ${getStatusColor(transaction.status)} border-0`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          {transaction.amount > 0 ? (
                            <ArrowDownRight className="w-4 h-4 text-green-600 ml-auto" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-600 ml-auto" />
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Weekend Special!</h3>
                    <p className="text-xs text-white/80">Get 5% bonus on all data purchases</p>
                  </div>
                </div>
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  Claim Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="grid grid-cols-2 gap-4">
            <Card className="glass-card border-0">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-bold">₦45,200</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-0">
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-2xl font-bold">127</p>
                <p className="text-xs text-muted-foreground">Transactions</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
