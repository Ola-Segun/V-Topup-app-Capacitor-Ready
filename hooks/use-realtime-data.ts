"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  WebSocketManager,
  type WebSocketMessage,
  type TransactionUpdate,
  type UserActivity,
  type SystemAlert,
  type RevenueUpdate,
  MockWebSocketServer,
} from "@/lib/websocket"

interface RealtimeData {
  transactions: TransactionUpdate[]
  userActivities: UserActivity[]
  systemAlerts: SystemAlert[]
  revenueData: RevenueUpdate | null
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
  isLoading: boolean
}

interface UseRealtimeDataOptions {
  maxTransactions?: number
  maxActivities?: number
  maxAlerts?: number
  enableMockData?: boolean
}

export function useRealtimeData(options: UseRealtimeDataOptions = {}) {
  const { maxTransactions = 50, maxActivities = 30, maxAlerts = 20, enableMockData = true } = options

  const [data, setData] = useState<RealtimeData>({
    transactions: [],
    userActivities: [],
    systemAlerts: [],
    revenueData: null,
    connectionStatus: "disconnected",
    isLoading: true,
  })

  const wsManager = useRef<WebSocketManager | null>(null)
  const mockServer = useRef<MockWebSocketServer | null>(null)

  const addTransaction = useCallback(
    (transaction: TransactionUpdate) => {
      setData((prev) => ({
        ...prev,
        transactions: [transaction, ...prev.transactions].slice(0, maxTransactions),
      }))
    },
    [maxTransactions],
  )

  const addUserActivity = useCallback(
    (activity: UserActivity) => {
      setData((prev) => ({
        ...prev,
        userActivities: [activity, ...prev.userActivities].slice(0, maxActivities),
      }))
    },
    [maxActivities],
  )

  const addSystemAlert = useCallback(
    (alert: SystemAlert) => {
      setData((prev) => ({
        ...prev,
        systemAlerts: [alert, ...prev.systemAlerts].slice(0, maxAlerts),
      }))
    },
    [maxAlerts],
  )

  const updateRevenue = useCallback((revenue: RevenueUpdate) => {
    setData((prev) => ({
      ...prev,
      revenueData: revenue,
    }))
  }, [])

  const updateConnectionStatus = useCallback((status: RealtimeData["connectionStatus"]) => {
    setData((prev) => ({
      ...prev,
      connectionStatus: status,
      isLoading: status === "connecting",
    }))
  }, [])

  useEffect(() => {
    if (enableMockData) {
      // Use mock WebSocket server for demo
      mockServer.current = new MockWebSocketServer()

      const handleMockMessage = (message: WebSocketMessage) => {
        switch (message.type) {
          case "transaction":
            addTransaction(message.data)
            break
          case "user_activity":
            addUserActivity(message.data)
            break
          case "system_alert":
            addSystemAlert(message.data)
            break
          case "revenue_update":
            updateRevenue(message.data)
            break
        }
      }

      mockServer.current.addClient(handleMockMessage)
      updateConnectionStatus("connected")

      return () => {
        if (mockServer.current) {
          mockServer.current.removeClient(handleMockMessage)
          mockServer.current.destroy()
        }
      }
    } else {
      // Use real WebSocket connection
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080"
      wsManager.current = new WebSocketManager(wsUrl)

      wsManager.current.on("transaction", addTransaction)
      wsManager.current.on("user_activity", addUserActivity)
      wsManager.current.on("system_alert", addSystemAlert)
      wsManager.current.on("revenue_update", updateRevenue)
      wsManager.current.on("connection", (data) => {
        updateConnectionStatus(data.status)
      })

      return () => {
        if (wsManager.current) {
          wsManager.current.disconnect()
        }
      }
    }
  }, [enableMockData, addTransaction, addUserActivity, addSystemAlert, updateRevenue, updateConnectionStatus])

  const clearAlerts = useCallback(() => {
    setData((prev) => ({
      ...prev,
      systemAlerts: [],
    }))
  }, [])

  const dismissAlert = useCallback((alertId: string) => {
    setData((prev) => ({
      ...prev,
      systemAlerts: prev.systemAlerts.filter((alert) => alert.id !== alertId),
    }))
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (wsManager.current) {
      wsManager.current.send(message)
    }
  }, [])

  return {
    ...data,
    clearAlerts,
    dismissAlert,
    sendMessage,
    refresh: () => {
      setData((prev) => ({ ...prev, isLoading: true }))
      // Trigger data refresh
    },
  }
}

// Hook for real-time metrics
export function useRealtimeMetrics() {
  const [metrics, setMetrics] = useState({
    totalUsers: 1680,
    activeUsers: 1420,
    totalRevenue: 815000,
    totalTransactions: 2100,
    successRate: 98.7,
    avgResponseTime: 145,
    systemUptime: 99.9,
  })

  const [trends, setTrends] = useState({
    userGrowth: 8.2,
    revenueGrowth: 12.5,
    transactionGrowth: 15.3,
    successRateChange: -0.3,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metric updates
      setMetrics((prev) => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 10000),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5),
        successRate: Math.max(95, Math.min(100, prev.successRate + (Math.random() - 0.5) * 0.1)),
        avgResponseTime: Math.max(100, Math.min(300, prev.avgResponseTime + (Math.random() - 0.5) * 10)),
        systemUptime: Math.max(99, Math.min(100, prev.systemUptime + (Math.random() - 0.5) * 0.01)),
      }))

      setTrends((prev) => ({
        userGrowth: prev.userGrowth + (Math.random() - 0.5) * 0.5,
        revenueGrowth: prev.revenueGrowth + (Math.random() - 0.5) * 0.8,
        transactionGrowth: prev.transactionGrowth + (Math.random() - 0.5) * 0.6,
        successRateChange: prev.successRateChange + (Math.random() - 0.5) * 0.2,
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return { metrics, trends }
}

// Hook for real-time chart data
export function useRealtimeChartData() {
  const [chartData, setChartData] = useState({
    hourlyTransactions: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      transactions: Math.floor(Math.random() * 100) + 20,
      revenue: Math.floor(Math.random() * 50000) + 10000,
    })),
    dailyUsers: Array.from({ length: 7 }, (_, i) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      active: Math.floor(Math.random() * 500) + 800,
      new: Math.floor(Math.random() * 50) + 20,
    })),
    serviceUsage: [
      { service: "Airtime", usage: 35, trend: 2.1 },
      { service: "Data", usage: 28, trend: -1.2 },
      { service: "Electricity", usage: 20, trend: 3.5 },
      { service: "Cable TV", usage: 12, trend: 0.8 },
      { service: "Others", usage: 5, trend: -0.5 },
    ],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => ({
        hourlyTransactions: prev.hourlyTransactions.map((item) => ({
          ...item,
          transactions: Math.max(0, item.transactions + Math.floor(Math.random() * 10) - 5),
          revenue: Math.max(0, item.revenue + Math.floor(Math.random() * 5000) - 2500),
        })),
        dailyUsers: prev.dailyUsers.map((item) => ({
          ...item,
          active: Math.max(0, item.active + Math.floor(Math.random() * 20) - 10),
          new: Math.max(0, item.new + Math.floor(Math.random() * 5) - 2),
        })),
        serviceUsage: prev.serviceUsage.map((item) => ({
          ...item,
          usage: Math.max(0, Math.min(100, item.usage + (Math.random() - 0.5) * 2)),
          trend: item.trend + (Math.random() - 0.5) * 0.5,
        })),
      }))
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return chartData
}
