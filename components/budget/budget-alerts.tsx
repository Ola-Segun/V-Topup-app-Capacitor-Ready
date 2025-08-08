"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, TrendingUp, Target } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import type { Budget } from "@/lib/services/budget-service"

interface BudgetAlertsProps {
  budgets: Budget[]
}

export function BudgetAlerts({ budgets }: BudgetAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const getAlerts = () => {
    const alerts: Array<{
      id: string
      budget: Budget
      type: 'warning' | 'danger' | 'exceeded'
      message: string
      progress: number
    }> = []

    budgets.forEach(budget => {
      if (!budget.is_active) return
      
      const progress = Math.min((budget.spent / budget.amount) * 100, 100)
      const alertId = `${budget.id}-${Math.floor(progress / 10)}`
      
      if (dismissedAlerts.includes(alertId)) return

      if (progress >= 100) {
        alerts.push({
          id: alertId,
          budget,
          type: 'exceeded',
          message: `Budget exceeded! You've spent ₦${budget.spent.toLocaleString()} of ₦${budget.amount.toLocaleString()}`,
          progress
        })
      } else if (progress >= budget.alert_threshold) {
        alerts.push({
          id: alertId,
          budget,
          type: progress >= 90 ? 'danger' : 'warning',
          message: `${progress.toFixed(0)}% of budget used. ₦${(budget.amount - budget.spent).toLocaleString()} remaining`,
          progress
        })
      }
    })

    return alerts.sort((a, b) => b.progress - a.progress)
  }

  const alerts = getAlerts()

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId])
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'exceeded':
        return 'border-red-500 bg-red-50 text-red-700'
      case 'danger':
        return 'border-orange-500 bg-orange-50 text-orange-700'
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 text-yellow-700'
      default:
        return 'border-blue-500 bg-blue-50 text-blue-700'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'exceeded':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case 'warning':
        return <TrendingUp className="w-5 h-5 text-yellow-500" />
      default:
        return <Target className="w-5 h-5 text-blue-500" />
    }
  }

  if (alerts.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-2 ${getAlertColor(alert.type)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{alert.budget.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {alert.budget.category.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                      <div className="mt-2">
                        <div className="w-full bg-white/50 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              alert.type === 'exceeded' ? 'bg-red-500' :
                              alert.type === 'danger' ? 'bg-orange-500' : 'bg-yellow-500'
                            }`}
                            style={{ width: `${Math.min(alert.progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-6 w-6 text-current hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
