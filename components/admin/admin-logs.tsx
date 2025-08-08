"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  RefreshCw,
  Download,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Server,
  Shield,
  Activity,
} from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

const logLevels = [
  { value: "all", label: "All Levels", color: "bg-gray-500" },
  { value: "info", label: "Info", color: "bg-blue-500" },
  { value: "warning", label: "Warning", color: "bg-yellow-500" },
  { value: "error", label: "Error", color: "bg-red-500" },
  { value: "success", label: "Success", color: "bg-green-500" },
]

const logCategories = [
  { value: "all", label: "All Categories", icon: Activity },
  { value: "auth", label: "Authentication", icon: Shield },
  { value: "database", label: "Database", icon: Database },
  { value: "api", label: "API", icon: Server },
  { value: "system", label: "System", icon: Activity },
]

const mockLogs = [
  {
    id: 1,
    timestamp: "2024-01-15T14:30:25Z",
    level: "info",
    category: "auth",
    message: "User login successful",
    details: "User admin@vtopup.com logged in from IP 192.168.1.100",
    source: "AuthService",
  },
  {
    id: 2,
    timestamp: "2024-01-15T14:28:15Z",
    level: "warning",
    category: "database",
    message: "Database connection pool near capacity",
    details: "Connection pool at 85% capacity (17/20 connections active)",
    source: "DatabaseManager",
  },
  {
    id: 3,
    timestamp: "2024-01-15T14:25:10Z",
    level: "error",
    category: "api",
    message: "Payment gateway timeout",
    details: "Request to payment gateway timed out after 30 seconds",
    source: "PaymentService",
  },
  {
    id: 4,
    timestamp: "2024-01-15T14:22:45Z",
    level: "success",
    category: "system",
    message: "Backup completed successfully",
    details: "Daily database backup completed in 2m 34s",
    source: "BackupService",
  },
  {
    id: 5,
    timestamp: "2024-01-15T14:20:30Z",
    level: "info",
    category: "api",
    message: "API request processed",
    details: "GET /api/users processed in 145ms",
    source: "APIGateway",
  },
]

export function AdminLogs() {
  const [logs, setLogs] = useState(mockLogs)
  const [filteredLogs, setFilteredLogs] = useState(mockLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAutoRefresh, setIsAutoRefresh] = useState(false)

  useEffect(() => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.source.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter((log) => log.level === selectedLevel)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((log) => log.category === selectedCategory)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, selectedLevel, selectedCategory])

  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        // Simulate new log entries
        const newLog = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          level: ["info", "warning", "error", "success"][Math.floor(Math.random() * 4)],
          category: ["auth", "database", "api", "system"][Math.floor(Math.random() * 4)],
          message: "New system event",
          details: "Auto-generated log entry for demonstration",
          source: "SystemMonitor",
        }
        setLogs((prev) => [newLog, ...prev.slice(0, 49)]) // Keep only 50 logs
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isAutoRefresh])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = logCategories.find((cat) => cat.value === category)
    if (categoryData) {
      const Icon = categoryData.icon
      return <Icon className="w-4 h-4" />
    }
    return <Activity className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">Monitor system events and activities</p>
        </div>
        <div className="flex items-center flex-wrap space-x-2">
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isAutoRefresh ? "animate-spin" : ""}`} />
            {isAutoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by level, category, or search term</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {logLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${level.color}`} />
                        <span>{level.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {logCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Results</label>
              <div className="flex items-center space-x-2 h-10 px-3 py-2 border rounded-md bg-muted">
                <span className="text-sm text-muted-foreground">
                  {filteredLogs.length} of {logs.length} logs
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Display */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
          <CardDescription>Real-time system logs and events</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-2">
              <AnimatePresence>
                {filteredLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex items-center space-x-2 mt-1">
                          {getLevelIcon(log.level)}
                          {getCategoryIcon(log.category)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-sm">{log.message}</h3>
                            <Badge className={`text-xs ${getLevelColor(log.level)}`}>{log.level}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {log.category}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">{log.details}</p>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}</span>
                            <span>•</span>
                            <span>{log.source}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredLogs.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No logs found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
