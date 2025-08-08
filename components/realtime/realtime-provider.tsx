"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useRealtimeData, useRealtimeMetrics, useRealtimeChartData } from "@/hooks/use-realtime-data"
import type { TransactionUpdate, UserActivity, SystemAlert, RevenueUpdate } from "@/lib/websocket"

interface RealtimeContextType {
  // Data
  transactions: TransactionUpdate[]
  userActivities: UserActivity[]
  systemAlerts: SystemAlert[]
  revenueData: RevenueUpdate | null

  // Metrics
  metrics: {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    totalTransactions: number
    successRate: number
    avgResponseTime: number
    systemUptime: number
  }

  trends: {
    userGrowth: number
    revenueGrowth: number
    transactionGrowth: number
    successRateChange: number
  }

  // Chart data
  chartData: {
    hourlyTransactions: Array<{ hour: number; transactions: number; revenue: number }>
    dailyUsers: Array<{ day: string; active: number; new: number }>
    serviceUsage: Array<{ service: string; usage: number; trend: number }>
  }

  // Connection status
  connectionStatus: "connecting" | "connected" | "disconnected" | "error"
  isLoading: boolean

  // Actions
  clearAlerts: () => void
  dismissAlert: (alertId: string) => void
  sendMessage: (message: any) => void
  refresh: () => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

interface RealtimeProviderProps {
  children: ReactNode
  enableMockData?: boolean
}

export function RealtimeProvider({ children, enableMockData = true }: RealtimeProviderProps) {
  const realtimeData = useRealtimeData({ enableMockData })
  const { metrics, trends } = useRealtimeMetrics()
  const chartData = useRealtimeChartData()

  const contextValue: RealtimeContextType = {
    ...realtimeData,
    metrics,
    trends,
    chartData,
  }

  return <RealtimeContext.Provider value={contextValue}>{children}</RealtimeContext.Provider>
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}
