"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRealtime } from "./realtime-provider"
import { AlertTriangle, Info, CheckCircle, XCircle, X, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function SystemAlerts() {
  const { systemAlerts, clearAlerts, dismissAlert } = useRealtime()

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return XCircle
      case "warning":
        return AlertTriangle
      case "success":
        return CheckCircle
      case "info":
      default:
        return Info
    }
  }

  const getAlertColor = (type: string, severity: string) => {
    if (severity === "critical") {
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200"
    }

    switch (type) {
      case "error":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
      case "success":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200"
      case "info":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">System Alerts</CardTitle>
            {systemAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {systemAlerts.length}
              </Badge>
            )}
          </div>
          {systemAlerts.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAlerts}
              className="text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <AnimatePresence initial={false}>
            {systemAlerts.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50 text-green-500" />
                  <p className="text-sm">All systems operational</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {systemAlerts.map((alert, index) => {
                  const AlertIcon = getAlertIcon(alert.type)

                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`p-3 border rounded-lg ${getAlertColor(alert.type, alert.severity)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <AlertIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium text-sm">{alert.component}</p>
                              <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm opacity-90">{alert.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(alert.timestamp || Date.now()).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                          className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
