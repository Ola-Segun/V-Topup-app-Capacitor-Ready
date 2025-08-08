"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Target, Calendar, Smartphone, Wifi, Tv, Zap, Wallet } from 'lucide-react'
import { motion } from "framer-motion"
import type { Budget } from "@/lib/services/budget-service"

interface BudgetInsightsProps {
  budgets: Budget[]
}

const categoryIcons = {
  airtime: Smartphone,
  data: Wifi,
  cable: Tv,
  electricity: Zap,
  wallet_funding: Wallet,
  all: Target
}

const categoryColors = {
  airtime: '#3b82f6',
  data: '#10b981',
  cable: '#8b5cf6',
  electricity: '#f59e0b',
  wallet_funding: '#6366f1',
  all: '#6b7280'
}

export function BudgetInsights({ budgets }: BudgetInsightsProps) {
  // Calculate spending by category
  const categoryData = budgets.reduce((acc, budget) => {
    const existing = acc.find(item => item.category === budget.category)
    if (existing) {
      existing.spent += budget.spent
      existing.budget += budget.amount
    } else {
      acc.push({
        category: budget.category,
        spent: budget.spent,
        budget: budget.amount,
        name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1).replace('_', ' ')
      })
    }
    return acc
  }, [] as Array<{ category: string; spent: number; budget: number; name: string }>)

  // Pie chart data
  const pieData = categoryData.map(item => ({
    name: item.name,
    value: item.spent,
    color: categoryColors[item.category as keyof typeof categoryColors]
  }))

  // Bar chart data
  const barData = categoryData.map(item => ({
    category: item.name,
    spent: item.spent,
    budget: item.budget,
    remaining: Math.max(0, item.budget - item.spent)
  }))

  // Mock trend data (in a real app, this would come from historical data)
  const trendData = [
    { month: 'Jan', spending: 15000 },
    { month: 'Feb', spending: 18000 },
    { month: 'Mar', spending: 22000 },
    { month: 'Apr', spending: 19000 },
    { month: 'May', spending: 25000 },
    { month: 'Jun', spending: 23000 }
  ]

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalBudget - totalSpent
  const averageProgress = budgets.length > 0 ? (totalSpent / totalBudget) * 100 : 0

  const topSpendingCategory = categoryData.reduce((max, item) => 
    item.spent > max.spent ? item : max, categoryData[0] || { spent: 0, name: 'None' }
  )

  const mostEfficientBudget = budgets.reduce((best, budget) => {
    const progress = (budget.spent / budget.amount) * 100
    const bestProgress = (best.spent / best.amount) * 100
    return progress < bestProgress && progress > 0 ? budget : best
  }, budgets[0])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">₦{totalRemaining.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Remaining Budget</div>
            <div className="flex items-center justify-center mt-1">
              {totalRemaining > 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className="text-xs">{averageProgress.toFixed(1)}% used</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{budgets.filter(b => b.is_active).length}</div>
            <div className="text-xs text-muted-foreground">Active Budgets</div>
            <div className="flex items-center justify-center mt-1">
              <Target className="w-3 h-3 text-blue-500 mr-1" />
              <span className="text-xs">of {budgets.length} total</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending by Category - Pie Chart */}
      {pieData.length > 0 && (
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Spent']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categoryData.map((item) => {
                const Icon = categoryIcons[item.category as keyof typeof categoryIcons]
                return (
                  <div key={item.category} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[item.category as keyof typeof categoryColors] }}
                    />
                    <Icon className="w-3 h-3" />
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget vs Spending - Bar Chart */}
      {barData.length > 0 && (
        <Card className="glass-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Budget vs Spending</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                  <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
                  <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spending Trend */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Spending Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Spending']} />
                <Line 
                  type="monotone" 
                  dataKey="spending" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights Cards */}
      <div className="space-y-3">
        {topSpendingCategory && (
          <Card className="glass-card border-0 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Top Spending Category</h4>
                  <p className="text-xs text-muted-foreground">
                    {topSpendingCategory.name} - ₦{topSpendingCategory.spent.toLocaleString()} spent
                  </p>
                </div>
                <Badge variant="secondary">{((topSpendingCategory.spent / totalSpent) * 100).toFixed(0)}%</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {mostEfficientBudget && (
          <Card className="glass-card border-0 bg-green-50/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">Most Efficient Budget</h4>
                  <p className="text-xs text-muted-foreground">
                    {mostEfficientBudget.name} - {((mostEfficientBudget.spent / mostEfficientBudget.amount) * 100).toFixed(0)}% used
                  </p>
                </div>
                <Badge variant="secondary">On Track</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="glass-card border-0 bg-purple-50/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Budget Performance</h4>
                <p className="text-xs text-muted-foreground">
                  {averageProgress < 80 ? 'Great job staying within budget!' : 'Consider reviewing your spending habits'}
                </p>
              </div>
              <Badge variant={averageProgress < 80 ? "secondary" : "destructive"}>
                {averageProgress.toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
