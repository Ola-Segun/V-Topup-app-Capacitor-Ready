"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRealtime } from "./realtime-provider"
import { TrendingUp, TrendingDown, Users, DollarSign, CreditCard, Activity } from "lucide-react"
import { motion } from "framer-motion"

export function LiveMetrics() {
  const { metrics, trends } = useRealtime()

  const metricCards = [
    {
      title: "Total Users",
      value: metrics.totalUsers.toLocaleString(),
      trend: trends.userGrowth,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Revenue",
      value: `₦${(metrics.totalRevenue / 1000).toFixed(0)}K`,
      trend: trends.revenueGrowth,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Transactions",
      value: metrics.totalTransactions.toLocaleString(),
      trend: trends.transactionGrowth,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Success Rate",
      value: `${metrics.successRate.toFixed(1)}%`,
      trend: trends.successRateChange,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon
        const isPositive = metric.trend >= 0
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <motion.div
                    key={metric.value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl font-bold"
                  >
                    {metric.value}
                  </motion.div>
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={`w-3 h-3 ${isPositive ? "text-green-500" : "text-red-500"}`} />
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        isPositive
                          ? "text-green-600 border-green-200 bg-green-50"
                          : "text-red-600 border-red-200 bg-red-50"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {metric.trend.toFixed(1)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last period</span>
                  </div>
                </div>
              </CardContent>

              {/* Live indicator */}
              <div className="absolute top-2 right-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">LIVE</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
