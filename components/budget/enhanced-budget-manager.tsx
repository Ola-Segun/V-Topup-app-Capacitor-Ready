"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, TrendingUp, TrendingDown, AlertTriangle, PlusCircle, Edit, Trash2, Pause, Play, BarChart3, PieChart, Calendar, DollarSign, Smartphone, Wifi, Tv, Zap, CreditCard, Star, Clock, CheckCircle, XCircle, Info, Filter, Download, Settings } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { toast } from "sonner"
import { saveRecentAction } from "@/lib/recent-actions"

interface Budget {
  id: string
  name: string
  category: string
  amount: number
  spent: number
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  alertThreshold: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  transactions: BudgetTransaction[]
}

interface BudgetTransaction {
  id: string
  description: string
  amount: number
  category: string
  timestamp: string
  type: 'airtime' | 'data' | 'cable' | 'electricity' | 'other'
}

interface BudgetInsight {
  category: string
  totalSpent: number
  budgetAmount: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  trendPercentage: number
}

const budgetCategories = [
  { value: 'airtime', label: 'Airtime', icon: Smartphone, color: 'text-blue-600' },
  { value: 'data', label: 'Data', icon: Wifi, color: 'text-green-600' },
  { value: 'cable', label: 'Cable TV', icon: Tv, color: 'text-purple-600' },
  { value: 'electricity', label: 'Electricity', icon: Zap, color: 'text-yellow-600' },
  { value: 'entertainment', label: 'Entertainment', icon: Star, color: 'text-pink-600' },
  { value: 'general', label: 'General', icon: CreditCard, color: 'text-gray-600' }
]

const periodOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

export function EnhancedBudgetManager() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [insights, setInsights] = useState<BudgetInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Form states
  const [budgetName, setBudgetName] = useState("")
  const [budgetCategory, setBudgetCategory] = useState("")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [budgetPeriod, setBudgetPeriod] = useState("monthly")
  const [alertThreshold, setAlertThreshold] = useState("80")

  // Mock data - replace with real API calls
  useEffect(() => {
    loadBudgets()
    loadInsights()
  }, [])

  const loadBudgets = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockBudgets: Budget[] = [
        {
          id: '1',
          name: 'Monthly Airtime',
          category: 'airtime',
          amount: 5000,
          spent: 3200,
          period: 'monthly',
          alertThreshold: 80,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
          transactions: [
            {
              id: '1',
              description: 'MTN Airtime',
              amount: 1000,
              category: 'airtime',
              timestamp: '2024-01-15 10:30:00',
              type: 'airtime'
            },
            {
              id: '2',
              description: 'Airtel Airtime',
              amount: 2200,
              category: 'airtime',
              timestamp: '2024-01-10 14:20:00',
              type: 'airtime'
            }
          ]
        },
        {
          id: '2',
          name: 'Data Bundle Budget',
          category: 'data',
          amount: 8000,
          spent: 6500,
          period: 'monthly',
          alertThreshold: 75,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-12',
          transactions: [
            {
              id: '3',
              description: 'MTN 5GB Data',
              amount: 2500,
              category: 'data',
              timestamp: '2024-01-12 09:15:00',
              type: 'data'
            },
            {
              id: '4',
              description: 'Airtel 10GB Data',
              amount: 4000,
              category: 'data',
              timestamp: '2024-01-08 16:45:00',
              type: 'data'
            }
          ]
        },
        {
          id: '3',
          name: 'Electricity Bills',
          category: 'electricity',
          amount: 15000,
          spent: 18000,
          period: 'monthly',
          alertThreshold: 90,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-20',
          transactions: [
            {
              id: '5',
              description: 'EKEDC Payment',
              amount: 12000,
              category: 'electricity',
              timestamp: '2024-01-20 11:00:00',
              type: 'electricity'
            },
            {
              id: '6',
              description: 'EKEDC Payment',
              amount: 6000,
              category: 'electricity',
              timestamp: '2024-01-05 13:30:00',
              type: 'electricity'
            }
          ]
        }
      ]
      
      setBudgets(mockBudgets)
    } catch (error) {
      toast.error('Failed to load budgets')
    } finally {
      setIsLoading(false)
    }
  }

  const loadInsights = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const mockInsights: BudgetInsight[] = [
        {
          category: 'airtime',
          totalSpent: 3200,
          budgetAmount: 5000,
          percentage: 64,
          trend: 'up',
          trendPercentage: 12.5
        },
        {
          category: 'data',
          totalSpent: 6500,
          budgetAmount: 8000,
          percentage: 81.25,
          trend: 'down',
          trendPercentage: 5.2
        },
        {
          category: 'electricity',
          totalSpent: 18000,
          budgetAmount: 15000,
          percentage: 120,
          trend: 'up',
          trendPercentage: 25.8
        }
      ]
      
      setInsights(mockInsights)
    } catch (error) {
      console.error('Failed to load insights:', error)
    }
  }

  const handleCreateBudget = async () => {
    if (!budgetName || !budgetCategory || !budgetAmount) {
      toast.error("Please fill in all required fields")
      return
    }

    if (Number(budgetAmount) <= 0) {
      toast.error("Budget amount must be greater than 0")
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newBudget: Budget = {
        id: Date.now().toString(),
        name: budgetName,
        category: budgetCategory,
        amount: Number(budgetAmount),
        spent: 0,
        period: budgetPeriod as any,
        alertThreshold: Number(alertThreshold),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transactions: []
      }

      setBudgets(prev => [newBudget, ...prev])
      setShowCreateDialog(false)
      resetForm()

      await saveRecentAction({
        type: 'budget_created',
        description: `Created budget: ${budgetName}`,
        amount: Number(budgetAmount),
        status: 'completed'
      })

      toast.success('Budget created successfully!')
    } catch (error) {
      toast.error('Failed to create budget')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateBudget = async (id: string, updates: Partial<Budget>) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setBudgets(prev => prev.map(budget => 
        budget.id === id 
          ? { ...budget, ...updates, updatedAt: new Date().toISOString() }
          : budget
      ))

      setEditingBudget(null)
      toast.success('Budget updated successfully!')
    } catch (error) {
      toast.error('Failed to update budget')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBudget = async (id: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setBudgets(prev => prev.filter(budget => budget.id !== id))
      toast.success('Budget deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete budget')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleBudgetStatus = async (budget: Budget) => {
    await handleUpdateBudget(budget.id, { isActive: !budget.isActive })
  }

  const resetForm = () => {
    setBudgetName("")
    setBudgetCategory("")
    setBudgetAmount("")
    setBudgetPeriod("monthly")
    setAlertThreshold("80")
  }

  const getBudgetProgress = (budget: Budget) => {
    return Math.min((budget.spent / budget.amount) * 100, 100)
  }

  const getBudgetStatus = (budget: Budget) => {
    const progress = getBudgetProgress(budget)
    if (progress >= 100) return { color: 'text-red-500', bg: 'bg-red-500', label: 'Exceeded', icon: XCircle }
    if (progress >= budget.alertThreshold) return { color: 'text-orange-500', bg: 'bg-orange-500', label: 'Warning', icon: AlertTriangle }
    return { color: 'text-green-500', bg: 'bg-green-500', label: 'On Track', icon: CheckCircle }
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = budgetCategories.find(cat => cat.value === category)
    return categoryData ? categoryData.icon : CreditCard
  }

  const getCategoryColor = (category: string) => {
    const categoryData = budgetCategories.find(cat => cat.value === category)
    return categoryData ? categoryData.color : 'text-gray-600'
  }

  const filteredBudgets = budgets.filter(budget => {
    const categoryMatch = filterCategory === 'all' || budget.category === filterCategory
    const statusMatch = filterStatus === 'all' || 
      (filterStatus === 'active' && budget.isActive) ||
      (filterStatus === 'inactive' && !budget.isActive) ||
      (filterStatus === 'exceeded' && getBudgetProgress(budget) >= 100) ||
      (filterStatus === 'warning' && getBudgetProgress(budget) >= budget.alertThreshold && getBudgetProgress(budget) < 100)
    
    return categoryMatch && statusMatch
  })

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const activeBudgets = budgets.filter(b => b.isActive).length
  const exceededBudgets = budgets.filter(b => getBudgetProgress(b) >= 100).length

  const exportBudgets = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Budget data exported successfully!')
    } catch (error) {
      toast.error('Export failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <PremiumMobileNav />

      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold mb-2">Budget Manager</h1>
            <p className="text-muted-foreground">Track and manage your spending</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Budget
          </Button>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Total Budget",
              value: `₦${totalBudget.toLocaleString()}`,
              icon: Target,
              color: "text-blue-600",
              bgColor: "bg-blue-500/10"
            },
            {
              title: "Total Spent",
              value: `₦${totalSpent.toLocaleString()}`,
              icon: DollarSign,
              color: "text-orange-600",
              bgColor: "bg-orange-500/10"
            },
            {
              title: "Active Budgets",
              value: activeBudgets.toString(),
              icon: CheckCircle,
              color: "text-green-600",
              bgColor: "bg-green-500/10"
            },
            {
              title: "Exceeded",
              value: exceededBudgets.toString(),
              icon: AlertTriangle,
              color: "text-red-600",
              bgColor: "bg-red-500/10"
            }
          ].map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{metric.title}</p>
                        <p className="text-lg font-bold">{metric.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <Icon className={`w-4 h-4 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger value="overview" className="flex items-center space-x-2 py-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center space-x-2 py-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center space-x-2 py-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Transactions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Filters */}
              <Card className="glass-card border-0">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {budgetCategories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="exceeded">Exceeded</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={exportBudgets} disabled={isLoading}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Budget List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredBudgets.map((budget, index) => {
                    const progress = getBudgetProgress(budget)
                    const status = getBudgetStatus(budget)
                    const CategoryIcon = getCategoryIcon(budget.category)
                    const StatusIcon = status.icon
                    
                    return (
                      <motion.div
                        key={budget.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`glass-card border-0 ${!budget.isActive ? 'opacity-60' : ''}`}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`p-3 rounded-xl bg-background/50 border border-border/30`}>
                                  <CategoryIcon className={`w-6 h-6 ${getCategoryColor(budget.category)}`} />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{budget.name}</h3>
                                  <div className="flex items-center flex-wrap gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {budgetCategories.find(cat => cat.value === budget.category)?.label}
                                    </Badge>
                                    <Badge className={`text-xs ${status.color} bg-transparent border-current`}>
                                      <StatusIcon className="w-3 h-3 mr-1" />
                                      {status.label}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {budget.period}
                                    </Badge>
                                    {!budget.isActive && (
                                      <Badge variant="secondary" className="text-xs">
                                        Paused
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleBudgetStatus(budget)}
                                  className="h-8 w-8"
                                >
                                  {budget.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingBudget(budget)}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteBudget(budget.id)}
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span>₦{budget.spent.toLocaleString()} spent</span>
                                <span>₦{budget.amount.toLocaleString()} budget</span>
                              </div>
                              <Progress value={progress} className="h-3" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{progress.toFixed(1)}% used</span>
                                <span>₦{Math.max(0, budget.amount - budget.spent).toLocaleString()} remaining</span>
                              </div>
                              
                              {budget.transactions.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border/30">
                                  <p className="text-sm font-medium mb-2">Recent Transactions</p>
                                  <div className="space-y-2">
                                    {budget.transactions.slice(0, 2).map(transaction => (
                                      <div key={transaction.id} className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">{transaction.description}</span>
                                        <span className="font-medium">₦{transaction.amount.toLocaleString()}</span>
                                      </div>
                                    ))}
                                    {budget.transactions.length > 2 && (
                                      <p className="text-xs text-muted-foreground">
                                        +{budget.transactions.length - 2} more transactions
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                
                {filteredBudgets.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Target className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No budgets found</h3>
                    <p className="text-muted-foreground mb-4">
                      {budgets.length === 0 
                        ? "Create your first budget to start tracking your spending"
                        : "Try adjusting your filters to see more budgets"
                      }
                    </p>
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Budget
                    </Button>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Overview */}
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="w-5 h-5 mr-2" />
                      Spending Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insights.map((insight, index) => {
                        const CategoryIcon = getCategoryIcon(insight.category)
                        const categoryData = budgetCategories.find(cat => cat.value === insight.category)
                        
                        return (
                          <motion.div
                            key={insight.category}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-background/30 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-background/50 rounded-lg">
                                <CategoryIcon className={`w-4 h-4 ${categoryData?.color}`} />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{categoryData?.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  ₦{insight.totalSpent.toLocaleString()} / ₦{insight.budgetAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">{insight.percentage.toFixed(1)}%</p>
                              <div className="flex items-center space-x-1">
                                {insight.trend === 'up' ? (
                                  <TrendingUp className="w-3 h-3 text-red-500" />
                                ) : insight.trend === 'down' ? (
                                  <TrendingDown className="w-3 h-3 text-green-500" />
                                ) : (
                                  <div className="w-3 h-3" />
                                )}
                                <span className={`text-xs ${
                                  insight.trend === 'up' ? 'text-red-500' : 
                                  insight.trend === 'down' ? 'text-green-500' : 
                                  'text-muted-foreground'
                                }`}>
                                  {insight.trendPercentage.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Performance */}
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Budget Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-background/30 rounded-lg">
                        <p className="text-2xl font-bold text-primary">
                          {((totalSpent / totalBudget) * 100).toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground">Overall Budget Usage</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-background/30 rounded-lg">
                          <p className="text-lg font-semibold text-green-600">{activeBudgets}</p>
                          <p className="text-xs text-muted-foreground">Active Budgets</p>
                        </div>
                        <div className="text-center p-3 bg-background/30 rounded-lg">
                          <p className="text-lg font-semibold text-red-600">{exceededBudgets}</p>
                          <p className="text-xs text-muted-foreground">Exceeded</p>
                        </div>
                      </div>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {exceededBudgets > 0 
                            ? `You have ${exceededBudgets} budget${exceededBudgets > 1 ? 's' : ''} that exceeded the limit. Consider reviewing your spending.`
                            : "Great job! All your budgets are within limits."
                          }
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Budget Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgets.flatMap(budget => 
                      budget.transactions.map(transaction => ({
                        ...transaction,
                        budgetName: budget.name,
                        budgetCategory: budget.category
                      }))
                    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 20)
                    .map((transaction, index) => {
                      const CategoryIcon = getCategoryIcon(transaction.budgetCategory)
                      
                      return (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center border border-border/30">
                              <CategoryIcon className={`w-5 h-5 ${getCategoryColor(transaction.budgetCategory)}`} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.budgetName} • {new Date(transaction.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm text-red-600">
                              -₦{transaction.amount.toLocaleString()}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {budgetCategories.find(cat => cat.value === transaction.budgetCategory)?.label}
                            </Badge>
                          </div>
                        </motion.div>
                      )
                    })}
                    
                    {budgets.every(budget => budget.transactions.length === 0) && (
                      <div className="text-center py-12">
                        <CreditCard className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
                        <p className="text-muted-foreground">
                          Transactions will appear here as you make purchases within your budgets
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Create Budget Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              Set up a budget to track your spending in a specific category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budgetName">Budget Name</Label>
              <Input
                id="budgetName"
                placeholder="e.g., Monthly Airtime"
                value={budgetName}
                onChange={(e) => setBudgetName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {budgetCategories.map(category => {
                    const Icon = category.icon
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${category.color}`} />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetAmount">Amount (₦)</Label>
                <Input
                  id="budgetAmount"
                  type="number"
                  placeholder="5000"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label>Period</Label>
                <Select value={budgetPeriod} onValueChange={setBudgetPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periodOptions.map(period => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
              <Input
                id="alertThreshold"
                type="number"
                placeholder="80"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                min="1"
                max="100"
              />
              <p className="text-xs text-muted-foreground">
                Get notified when you reach this percentage of your budget
              </p>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateBudget} 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Budget
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCreateDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
