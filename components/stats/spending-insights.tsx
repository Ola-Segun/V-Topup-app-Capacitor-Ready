"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target, Smartphone, Wifi, Tv, Zap } from "lucide-react"
import Link from "next/link"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

// Dynamic data based on time periods
const dataByPeriod = {
  week: {
    chartData: [
      { period: "Mon", airtime: 1200, data: 800, cable: 0, electricity: 0, total: 2000 },
      { period: "Tue", airtime: 800, data: 1200, cable: 0, electricity: 0, total: 2000 },
      { period: "Wed", airtime: 1500, data: 900, cable: 0, electricity: 0, total: 2400 },
      { period: "Thu", airtime: 900, data: 1100, cable: 0, electricity: 0, total: 2000 },
      { period: "Fri", airtime: 2100, data: 1300, cable: 0, electricity: 0, total: 3400 },
      { period: "Sat", airtime: 1800, data: 1000, cable: 0, electricity: 0, total: 2800 },
      { period: "Sun", airtime: 1100, data: 700, cable: 0, electricity: 0, total: 1800 },
    ],
    totalSpent: 16400,
    categoryData: [
      { name: "Airtime", value: 60, amount: 9400, color: "#3B82F6" },
      { name: "Data", value: 40, amount: 7000, color: "#10B981" },
      { name: "Cable TV", value: 0, amount: 0, color: "#8B5CF6" },
      { name: "Electricity", value: 0, amount: 0, color: "#F59E0B" },
    ],
    topServices: [
      { name: "MTN Airtime", amount: 5200, transactions: 8, icon: Smartphone, color: "text-yellow-500" },
      { name: "Airtel Data", amount: 4100, transactions: 5, icon: Wifi, color: "text-red-500" },
      { name: "Glo Airtime", amount: 2800, transactions: 4, icon: Smartphone, color: "text-green-500" },
      { name: "9Mobile Data", amount: 2300, transactions: 3, icon: Wifi, color: "text-green-600" },
    ],
  },
  month: {
    chartData: [
      { period: "Week 1", airtime: 4000, data: 2400, cable: 1500, electricity: 3000, total: 10900 },
      { period: "Week 2", airtime: 3000, data: 1398, cable: 1500, electricity: 2800, total: 8698 },
      { period: "Week 3", airtime: 2000, data: 9800, cable: 1500, electricity: 3200, total: 16500 },
      { period: "Week 4", airtime: 2780, data: 3908, cable: 1500, electricity: 2900, total: 11088 },
    ],
    totalSpent: 47186,
    categoryData: [
      { name: "Airtime", value: 25, amount: 11780, color: "#3B82F6" },
      { name: "Data", value: 37, amount: 17506, color: "#10B981" },
      { name: "Cable TV", value: 13, amount: 6000, color: "#8B5CF6" },
      { name: "Electricity", value: 25, amount: 11900, color: "#F59E0B" },
    ],
    topServices: [
      { name: "Airtel Data", amount: 12500, transactions: 15, icon: Wifi, color: "text-red-500" },
      { name: "MTN Airtime", amount: 8500, transactions: 12, icon: Smartphone, color: "text-yellow-500" },
      { name: "PHCN Electricity", amount: 7200, transactions: 4, icon: Zap, color: "text-blue-500" },
      { name: "DSTV Premium", amount: 4500, transactions: 1, icon: Tv, color: "text-purple-500" },
    ],
  },
  quarter: {
    chartData: [
      { period: "Jan", airtime: 12000, data: 8400, cable: 4500, electricity: 9000, total: 33900 },
      { period: "Feb", airtime: 9000, data: 11398, cable: 4500, electricity: 8400, total: 33298 },
      { period: "Mar", airtime: 8000, data: 15800, cable: 4500, electricity: 9600, total: 37900 },
    ],
    totalSpent: 105098,
    categoryData: [
      { name: "Airtime", value: 28, amount: 29000, color: "#3B82F6" },
      { name: "Data", value: 34, amount: 35598, color: "#10B981" },
      { name: "Cable TV", value: 13, amount: 13500, color: "#8B5CF6" },
      { name: "Electricity", value: 25, amount: 27000, color: "#F59E0B" },
    ],
    topServices: [
      { name: "Airtel Data", amount: 25500, transactions: 45, icon: Wifi, color: "text-red-500" },
      { name: "MTN Airtime", amount: 18500, transactions: 35, icon: Smartphone, color: "text-yellow-500" },
      { name: "PHCN Electricity", amount: 16200, transactions: 12, icon: Zap, color: "text-blue-500" },
      { name: "DSTV Premium", amount: 13500, transactions: 3, icon: Tv, color: "text-purple-500" },
    ],
  },
  year: {
    chartData: [
      { period: "Q1", airtime: 48000, data: 35400, cable: 18000, electricity: 36000, total: 137400 },
      { period: "Q2", airtime: 36000, data: 45598, cable: 18000, electricity: 33600, total: 133198 },
      { period: "Q3", airtime: 32000, data: 63200, cable: 18000, electricity: 38400, total: 151600 },
      { period: "Q4", airtime: 28000, data: 58800, cable: 18000, electricity: 35200, total: 140000 },
    ],
    totalSpent: 562198,
    categoryData: [
      { name: "Airtime", value: 26, amount: 144000, color: "#3B82F6" },
      { name: "Data", value: 36, amount: 202998, color: "#10B981" },
      { name: "Cable TV", value: 13, amount: 72000, color: "#8B5CF6" },
      { name: "Electricity", value: 25, amount: 143200, color: "#F59E0B" },
    ],
    topServices: [
      { name: "Airtel Data", amount: 145500, transactions: 180, icon: Wifi, color: "text-red-500" },
      { name: "MTN Airtime", amount: 98500, transactions: 140, icon: Smartphone, color: "text-yellow-500" },
      { name: "PHCN Electricity", amount: 86200, transactions: 48, icon: Zap, color: "text-blue-500" },
      { name: "DSTV Premium", amount: 72000, transactions: 12, icon: Tv, color: "text-purple-500" },
    ],
  },
}

export function SpendingInsights() {
  const [timeFilter, setTimeFilter] = useState("month")
  const [monthlyBudget] = useState(50000)
  const [growthPercentage, setGrowthPercentage] = useState(11)

  // Get current data based on selected time filter
  const currentData = useMemo(() => dataByPeriod[timeFilter as keyof typeof dataByPeriod], [timeFilter])
  const budgetUsed = useMemo(
    () => Math.round((currentData.totalSpent / monthlyBudget) * 100),
    [currentData.totalSpent, monthlyBudget],
  )

  const getGrowthPercentage = (timeFilter: string) => {
    const growthRates = { week: 8, month: 12, quarter: 15, year: 18 }
    return growthRates[timeFilter as keyof typeof growthRates] || 12
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <PremiumMobileNav />

      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="material-card shadow-lg bg-card hover:bg-card/80">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Spending Insights</h1>
            <p className="text-muted-foreground">Track your usage and expenses</p>
          </div>
        </motion.div>

        {/* Time Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="material-card shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Time Period</span>
                </div>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-32 material-input bg-background/80">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="material-card shadow-xl border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-0">
                    <TrendingUp className="w-3 h-3 mr-1" />+{getGrowthPercentage(timeFilter)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-foreground">₦{currentData.totalSpent.toLocaleString()}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="material-card shadow-xl border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <Badge
                    className={`border-0 ${budgetUsed > 80 ? "bg-red-500/20 text-red-600 dark:text-red-400" : "bg-blue-500/20 text-blue-600 dark:text-blue-400"}`}
                  >
                    {budgetUsed}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Budget Used</p>
                <p className="text-2xl font-bold text-foreground">₦{monthlyBudget.toLocaleString()}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Budget Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="material-card shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Target className="w-5 h-5 mr-2" />
                {timeFilter === "week"
                  ? "Weekly"
                  : timeFilter === "quarter"
                    ? "Quarterly"
                    : timeFilter === "year"
                      ? "Yearly"
                      : "Monthly"}{" "}
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">₦{currentData.totalSpent.toLocaleString()} spent</span>
                  <span className="text-muted-foreground">
                    ₦{(monthlyBudget - currentData.totalSpent).toLocaleString()} remaining
                  </span>
                </div>
                <Progress value={budgetUsed} className="h-3" />
                <p className="text-xs text-muted-foreground text-center">
                  {budgetUsed > 80 ? "⚠️ You're approaching your budget limit" : "✅ You're on track with your spending"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Spending Trend Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="material-card shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">
                Spending Trend - {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
                    <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                        boxShadow: "var(--material-elevation-3)",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    {timeFilter === "week" ? (
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                      />
                    ) : (
                      <>
                        <Line type="monotone" dataKey="airtime" stroke="#3B82F6" strokeWidth={2} name="Airtime" />
                        <Line type="monotone" dataKey="data" stroke="#10B981" strokeWidth={2} name="Data" />
                        <Line type="monotone" dataKey="cable" stroke="#8B5CF6" strokeWidth={2} name="Cable TV" />
                        <Line
                          type="monotone"
                          dataKey="electricity"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          name="Electricity"
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="material-card shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentData.categoryData.filter((item) => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {currentData.categoryData
                          .filter((item) => item.value > 0)
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "var(--material-elevation-3)",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {currentData.categoryData
                    .filter((item) => item.value > 0)
                    .map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/20 rounded-xl hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                          <span className="font-medium text-sm text-foreground">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-foreground">₦{category.amount.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{category.value}%</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Services */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="material-card shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Top Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.topServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-muted/30 dark:bg-muted/20 rounded-xl hover:bg-muted/50 dark:hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-card dark:bg-muted/50 rounded-lg flex items-center justify-center shadow-sm">
                        <service.icon className={`w-5 h-5 ${service.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">₦{service.amount.toLocaleString()}</div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">+{growthPercentage}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
