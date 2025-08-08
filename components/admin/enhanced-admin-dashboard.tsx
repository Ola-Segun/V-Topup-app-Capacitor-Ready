"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, CreditCard, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Activity, Smartphone, Wifi, Zap, Tv, RefreshCw, Download, Filter, Search, MoreVertical, Eye, Edit, Trash2, UserCheck, UserX, Bell, Settings, BarChart3, PieChart, LineChart, Calendar, Globe, Shield, Database, Server, Cpu, HardDrive, WifiIcon, ZapIcon } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Area,
  AreaChart
} from 'recharts'
import { toast } from "sonner"

interface DashboardMetrics {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  totalTransactions: number
  successRate: number
  pendingTransactions: number
  failedTransactions: number
  walletBalance: number
  systemHealth: 'healthy' | 'warning' | 'critical'
}

interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  resolved: boolean
}

interface RecentTransaction {
  id: string
  user: string
  type: string
  amount: number
  status: string
  timestamp: string
}

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
  responseTime: number
  uptime: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function EnhancedAdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalTransactions: 0,
    successRate: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    walletBalance: 0,
    systemHealth: 'healthy'
  })
  
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([])
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    responseTime: 0,
    uptime: 0
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Chart data
  const [revenueData, setRevenueData] = useState([])
  const [transactionData, setTransactionData] = useState([])
  const [serviceDistribution, setServiceDistribution] = useState([])
  const [userGrowthData, setUserGrowthData] = useState([])

  useEffect(() => {
    loadDashboardData()
    
    if (autoRefresh) {
      const interval = setInterval(loadDashboardData, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh, selectedTimeRange])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API calls with realistic data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Load metrics
      setMetrics({
        totalUsers: 12847,
        activeUsers: 8934,
        totalRevenue: 45678900,
        monthlyRevenue: 8934500,
        totalTransactions: 156789,
        successRate: 98.7,
        pendingTransactions: 234,
        failedTransactions: 45,
        walletBalance: 23456789,
        systemHealth: 'healthy'
      })

      // Load system alerts
      setSystemAlerts([
        {
          id: '1',
          type: 'warning',
          title: 'High Transaction Volume',
          message: 'Transaction volume is 150% above normal for this time of day',
          timestamp: '5 minutes ago',
          severity: 'medium',
          resolved: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Scheduled Maintenance',
          message: 'System maintenance scheduled for tonight at 2:00 AM',
          timestamp: '1 hour ago',
          severity: 'low',
          resolved: false
        },
        {
          id: '3',
          type: 'error',
          title: 'Payment Gateway Issue',
          message: 'Paystack webhook delays detected',
          timestamp: '2 hours ago',
          severity: 'high',
          resolved: true
        }
      ])

      // Load recent transactions
      setRecentTransactions([
        {
          id: '1',
          user: 'John Doe',
          type: 'Airtime',
          amount: 1000,
          status: 'completed',
          timestamp: '2 mins ago'
        },
        {
          id: '2',
          user: 'Jane Smith',
          type: 'Data',
          amount: 2500,
          status: 'pending',
          timestamp: '5 mins ago'
        },
        {
          id: '3',
          user: 'Mike Johnson',
          type: 'Electricity',
          amount: 5000,
          status: 'completed',
          timestamp: '8 mins ago'
        }
      ])

      // Load system metrics
      setSystemMetrics({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 100,
        responseTime: Math.random() * 1000 + 100,
        uptime: 99.8
      })

      // Load chart data
      setRevenueData([
        { name: 'Jan', revenue: 4000000, transactions: 2400 },
        { name: 'Feb', revenue: 3000000, transactions: 1398 },
        { name: 'Mar', revenue: 2000000, transactions: 9800 },
        { name: 'Apr', revenue: 2780000, transactions: 3908 },
        { name: 'May', revenue: 1890000, transactions: 4800 },
        { name: 'Jun', revenue: 2390000, transactions: 3800 },
        { name: 'Jul', revenue: 3490000, transactions: 4300 }
      ])

      setServiceDistribution([
        { name: 'Airtime', value: 35, count: 5400 },
        { name: 'Data', value: 30, count: 4600 },
        { name: 'Electricity', value: 20, count: 3100 },
        { name: 'Cable TV', value: 10, count: 1500 },
        { name: 'Others', value: 5, count: 800 }
      ])

      setUserGrowthData([
        { name: 'Week 1', users: 1200, active: 980 },
        { name: 'Week 2', users: 1350, active: 1100 },
        { name: 'Week 3', users: 1500, active: 1250 },
        { name: 'Week 4', users: 1680, active: 1400 }
      ])

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = () => {
    loadDashboardData()
    toast.success('Dashboard data refreshed')
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900'
    }
  }

  const getMetricColor = (value: number, threshold: number = 80) => {
    if (value > threshold) return 'text-red-500'
    if (value > threshold * 0.7) return 'text-yellow-500'
    return 'text-green-500'
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your VTopup platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Auto Refresh
          </Button>
        </div>
      </div>

      {/* System Health Alert */}
      {metrics.systemHealth !== 'healthy' && (
        <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            System health is currently <strong>{metrics.systemHealth}</strong>. 
            Please check system metrics and alerts below.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl md:text-3xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl md:text-3xl font-bold">₦{(metrics.monthlyRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8.2% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl md:text-3xl font-bold">{metrics.successRate}%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Excellent performance
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Health</p>
                  <Badge className={`${getHealthColor(metrics.systemHealth)} mt-2`}>
                    {metrics.systemHealth.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    All systems operational
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              System Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(systemMetrics.cpu)}`}>
                    {systemMetrics.cpu.toFixed(1)}%
                  </span>
                </div>
                <Progress value={systemMetrics.cpu} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span className="text-sm font-medium">Memory</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(systemMetrics.memory)}`}>
                    {systemMetrics.memory.toFixed(1)}%
                  </span>
                </div>
                <Progress value={systemMetrics.memory} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4" />
                    <span className="text-sm font-medium">Disk Usage</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(systemMetrics.disk)}`}>
                    {systemMetrics.disk.toFixed(1)}%
                  </span>
                </div>
                <Progress value={systemMetrics.disk} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <WifiIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Network</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(systemMetrics.network, 90)}`}>
                    {systemMetrics.network.toFixed(1)}%
                  </span>
                </div>
                <Progress value={systemMetrics.network} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Response Time</span>
                </div>
                <span className="text-sm font-bold">
                  {systemMetrics.responseTime.toFixed(0)}ms
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ZapIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Uptime</span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {systemMetrics.uptime}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [`₦${(value / 1000000).toFixed(1)}M`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Service Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  System Alerts
                </CardTitle>
                <Badge variant="secondary">
                  {systemAlerts.filter(alert => !alert.resolved).length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {systemAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      alert.resolved 
                        ? 'bg-muted/50 border-muted' 
                        : alert.severity === 'high' 
                          ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                          : alert.severity === 'medium'
                            ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                            : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <Badge 
                            variant={alert.resolved ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Transactions
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        {transaction.type === 'Airtime' && <Smartphone className="w-4 h-4 text-primary" />}
                        {transaction.type === 'Data' && <Wifi className="w-4 h-4 text-primary" />}
                        {transaction.type === 'Electricity' && <Zap className="w-4 h-4 text-primary" />}
                        {transaction.type === 'Cable TV' && <Tv className="w-4 h-4 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.type} • {transaction.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        ₦{transaction.amount.toLocaleString()}
                      </p>
                      <Badge 
                        variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              User Growth & Transaction Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8884d8" name="Total Users" />
                  <Bar dataKey="active" fill="#82ca9d" name="Active Users" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
