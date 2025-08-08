"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealtime } from "./realtime-provider"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"

export function LiveCharts() {
  const { chartData } = useRealtime()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hourly Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Hourly Activity</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ChartContainer
                config={{
                  transactions: {
                  label: "Transactions",
                  color: "hsl(var(--chart-1))",
                },
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <AreaChart width={730} height={250} data={chartData.hourlyTransactions}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                    dataKey="hour"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value}:00`}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="transactions"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Users */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Daily Users</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ChartContainer
                config={{
                  active: {
                  label: "Active Users",
                  color: "hsl(var(--chart-1))",
                },
                new: {
                  label: "New Users",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart width={730} height={250} data={chartData.dailyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="active" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="new" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Usage Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Service Usage Trends</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ChartContainer
                config={{
                  usage: {
                  label: "Usage %",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <LineChart width={730} height={250} data={chartData.serviceUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="service" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="usage"
                    stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
