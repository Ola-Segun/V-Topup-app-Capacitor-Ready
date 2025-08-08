"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, DollarSign, TrendingUp, Activity, Smartphone, Wifi, AlertTriangle, CheckCircle, Settings, BarChart3, Shield, Clock } from 'lucide-react'
import { MobileNav } from "@/components/mobile-nav"
import { RealtimeProvider } from "@/components/realtime/realtime-provider"
import { LiveTransactions } from "@/components/realtime/live-transactions"
import { LiveMetrics } from "@/components/realtime/live-metrics"
import { SystemAlerts } from "@/components/realtime/system-alerts"
import { motion } from "framer-motion"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 15420,
    totalRevenue: 2450000,
    totalTransactions: 8934,
    successRate: 98.5,
    airtimeTransactions: 5234,
    dataTransactions: 3700,
    pendingTransactions: 12,
    failedTransactions: 45,
    activeProviders: 3,
    totalProviders: 4,
    avgResponseTime: 1.2,
    systemUptime: 99.8
  })

  const [timeRange, setTimeRange] = useState("24h")

  const serviceProviders = [
    {
      id: "vtpass",
      name: "VTPass",
      status: "active",
      uptime: 99.9,
      responseTime: 1.1,
      successRate: 98.7,
      services: ["airtime", "data", "cable", "electricity"],
      priority: 1
    },
    {
      id: "baxi",
      name: "Baxi",
      status: "active",
      uptime: 99.5,
      responseTime: 1.3,
      successRate: 97.8,
      services: ["airtime", "data", "cable"],
      priority: 2
    },
    {
      id: "clubkonnect",
      name: "ClubKonnect",
      status: "active",
      uptime: 98.9,
      responseTime: 1.8,
      successRate: 96.5,
      services: ["airtime", "data"],
      priority: 3
    },
    {
      id: "irecharge",
      name: "iRecharge",
      status: "maintenance",
      uptime: 0,
      responseTime: 0,
      successRate: 0,
      services: ["airtime"],
      priority: 4
    }
  ]

  const recentTransactions = [
    {
      id: "TXN001",
      user: "John Doe",
      type: "airtime",
      network: "MTN",
      amount: 1000,
      status: "completed",
      date: "2024-01-15 14:30",
      provider: "vtpass",
      responseTime: 1.2
    },
    {
      id: "TXN002",
      user: "Jane Smith",
      type: "data",
      network: "Airtel",
      amount: 2000,
      status: "pending",
      date: "2024-01-15 14:25",
      provider: "baxi",
      responseTime: 2.1
    },
    {
      id: "TXN003",
      user: "Mike Johnson",
      type: "airtime",
      network: "Glo",
      amount: 500,
      status: "failed",
      date: "2024-01-15 14:20",
      provider: "clubkonnect",
      responseTime: 5.2
    }
  ]

  const commissionRates = {
    airtime: { rate: 2.0, revenue: 104680 },
    data: { rate: 1.5, revenue: 55500 },
    cable: { rate: 3.0, revenue: 27000 },
    electricity: { rate: 2.5, revenue: 12500 }
  }

  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      case "maintenance":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      case "inactive":
        return "bg-red-500/20 text-red-600 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  return (
    <RealtimeProvider enableMockData={true}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <MobileNav />

        <div className="mobile-container py-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">Real-time platform monitoring and management</p>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-1 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Live</span>
                </div>
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
              <TabsTrigger value="overview" className="text-xs">
                <BarChart3 className="w-4 h-4 mr-1" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs">
                <Activity className="w-4 h-4 mr-1" />
                Live Transactions
              </TabsTrigger>
              <TabsTrigger value="providers" className="text-xs">
                <Settings className="w-4 h-4 mr-1" />
                Providers
              </TabsTrigger>
              <TabsTrigger value="commission" className="text-xs">
                <DollarSign className="w-4 h-4 mr-1" />
                Commission
              </TabsTrigger>
              <TabsTrigger value="alerts" className="text-xs">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Alerts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Users</p>
                          <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                          <p className="text-xs text-green-600">+12% from last month</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="text-2xl font-bold">₦{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-green-600">+8% from last month</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Success Rate</p>
                          <p className="text-2xl font-bold">{stats.successRate}%</p>
                          <p className="text-xs text-green-600">+0.3% from yesterday</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Response</p>
                          <p className="text-2xl font-bold">{stats.avgResponseTime}s</p>
                          <p className="text-xs text-green-600">-0.2s from yesterday</p>
                        </div>
                        <Clock className="w-8 h-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Live Metrics */}
              <LiveMetrics />

              {/* Service Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Service Performance</CardTitle>
                    <CardDescription>Transaction volume by service type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">Airtime</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{stats.airtimeTransactions.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">58.6% of total</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Wifi className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Data</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{stats.dataTransactions.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">41.4% of total</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Platform performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Uptime</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="font-medium">{stats.systemUptime}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Providers</span>
                        <span className="font-medium">{stats.activeProviders}/{stats.totalProviders}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending Transactions</span>
                        <Badge variant="secondary">{stats.pendingTransactions}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Failed Transactions</span>
                        <Badge variant="destructive">{stats.failedTransactions}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <LiveTransactions />
            </TabsContent>

            <TabsContent value="providers" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Service Provider Management</CardTitle>
                  <CardDescription>Monitor and manage external service providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceProviders.map((provider, index) => (
                      <motion.div
                        key={provider.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                            <Settings className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold">{provider.name}</h3>
                              <Badge className={`text-xs ${getProviderStatusColor(provider.status)}`}>
                                {provider.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Priority {provider.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Services: {provider.services.join(", ")}
                            </p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                              <span>Uptime: {provider.uptime}%</span>
                              <span>Response: {provider.responseTime}s</span>
                              <span>Success: {provider.successRate}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                          <Button 
                            variant={provider.status === "active" ? "destructive" : "default"} 
                            size="sm"
                          >
                            {provider.status === "active" ? "Disable" : "Enable"}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commission" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Commission & Fee Management</CardTitle>
                  <CardDescription>Configure rates and monitor revenue streams</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Commission Rates</h3>
                      {Object.entries(commissionRates).map(([service, data]) => (
                        <div key={service} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                          <div>
                            <p className="font-medium capitalize">{service}</p>
                            <p className="text-sm text-muted-foreground">
                              Revenue: ₦{data.revenue.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{data.rate}%</p>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold">Revenue Breakdown</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Commission</span>
                          <span className="font-bold">₦{Object.values(commissionRates).reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Platform Fees</span>
                          <span className="font-bold">₦45,230</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Transaction Fees</span>
                          <span className="font-bold">₦23,150</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between items-center">
                          <span className="font-medium">Total Revenue</span>
                          <span className="font-bold text-green-600">₦{(Object.values(commissionRates).reduce((sum, data) => sum + data.revenue, 0) + 45230 + 23150).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <SystemAlerts />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RealtimeProvider>
  )
}
