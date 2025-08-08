"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Smartphone,
  Wifi,
  Tv,
  Zap,
  Download,
  Filter,
  BarChart3,
  PieChartIcon,
  Activity,
  DollarSign,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

const revenueData = [
  { month: "Jan", revenue: 45000, transactions: 120, users: 1200 },
  { month: "Feb", revenue: 52000, transactions: 145, users: 1350 },
  { month: "Mar", revenue: 48000, transactions: 132, users: 1480 },
  { month: "Apr", revenue: 61000, transactions: 168, users: 1620 },
  { month: "May", revenue: 55000, transactions: 152, users: 1750 },
  { month: "Jun", revenue: 67000, transactions: 189, users: 1890 },
]

const serviceData = [
  { name: "Airtime", value: 35, color: "#3B82F6", amount: 125000 },
  { name: "Data", value: 28, color: "#10B981", amount: 98000 },
  { name: "Cable TV", value: 20, color: "#8B5CF6", amount: 70000 },
  { name: "Electricity", value: 17, color: "#F59E0B", amount: 59500 },
]

const userGrowthData = [
  { month: "Jan", users: 1200, active: 980 },
  { month: "Feb", users: 1350, active: 1120 },
  { month: "Mar", users: 1480, active: 1250 },
  { month: "Apr", users: 1620, active: 1380 },
  { month: "May", users: 1750, active: 1490 },
  { month: "Jun", users: 1890, active: 1620 },
]

const dailyTransactions = [
  { day: "Mon", transactions: 45, revenue: 12500 },
  { day: "Tue", transactions: 52, revenue: 14200 },
  { day: "Wed", transactions: 38, revenue: 10800 },
  { day: "Thu", transactions: 61, revenue: 16900 },
  { day: "Fri", transactions: 55, revenue: 15200 },
  { day: "Sat", transactions: 67, revenue: 18500 },
  { day: "Sun", transactions: 43, revenue: 11900 },
]

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("6months")
  const [activeTab, setActiveTab] = useState("overview")
  const [dateFrom, setDateFrom] = useState("2024-01-01")
  const [dateTo, setDateTo] = useState("2024-06-30")
  const [serviceFilter, setServiceFilter] = useState("all")

  const stats = [
    {
      title: "Total Revenue",
      value: "₦328,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Users",
      value: "1,890",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Transactions",
      value: "906",
      change: "+15.3%",
      trend: "up",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ]

  const topServices = [
    { name: "MTN Airtime", transactions: 245, revenue: 89000, icon: Smartphone, color: "text-yellow-600" },
    { name: "Airtel Data", transactions: 189, revenue: 67000, icon: Wifi, color: "text-red-600" },
    { name: "DSTV Subscription", transactions: 156, revenue: 45000, icon: Tv, color: "text-blue-600" },
    { name: "EKEDC Bills", transactions: 134, revenue: 38000, icon: Zap, color: "text-green-600" },
  ]

  const handleExportData = () => {
    toast.success("Analytics data exported successfully!")
  }

  const handleApplyFilters = () => {
    toast.success("Filters applied successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExportData} className="bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Advanced Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="material-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Advanced Filters</span>
            </CardTitle>
            <CardDescription>Customize your analytics view with detailed filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom">From Date</Label>
                <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo">To Date</Label>
                <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="airtime">Airtime</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="cable">Cable TV</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleApplyFilters} className="w-full material-button">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="material-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground truncate">{stat.title}</p>
                      <p className="text-xl lg:text-2xl font-bold">{stat.value}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {stat.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Analytics Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1">
            <TabsTrigger value="overview" className="flex items-center space-x-2 py-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center space-x-2 py-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2 py-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2 py-2">
              <PieChartIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="material-card">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue and transaction trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="h-64 lg:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                        />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="material-card">
                <CardHeader>
                  <CardTitle>Daily Transactions</CardTitle>
                  <CardDescription>This week's transaction activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="h-64 lg:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyTransactions}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="transactions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="material-card">
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Detailed revenue breakdown and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="h-80 lg:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                      />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="material-card">
              <CardHeader>
                <CardTitle>User Growth Analytics</CardTitle>
                <CardDescription>User registration and activity trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="h-80 lg:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="active"
                        stackId="2"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.8}
                      />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="material-card">
                <CardHeader>
                  <CardTitle>Service Distribution</CardTitle>
                  <CardDescription>Transaction breakdown by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="h-64 lg:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {serviceData.map((service) => (
                      <div key={service.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                        <span className="text-sm truncate">{service.name}</span>
                        <span className="text-sm text-muted-foreground">{service.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="material-card">
                <CardHeader>
                  <CardTitle>Top Performing Services</CardTitle>
                  <CardDescription>Most popular services by transaction volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topServices.map((service, index) => {
                      const Icon = service.icon
                      return (
                        <div
                          key={service.name}
                          className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-border/50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-background/50 rounded-xl flex items-center justify-center border border-border/30">
                              <Icon className={`w-5 h-5 ${service.color}`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-sm truncate">{service.name}</p>
                              <p className="text-xs text-muted-foreground">{service.transactions} transactions</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">₦{service.revenue.toLocaleString()}</p>
                            <Badge variant="secondary" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
