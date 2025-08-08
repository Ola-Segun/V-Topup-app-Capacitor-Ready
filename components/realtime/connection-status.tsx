"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRealtime } from "./realtime-provider"
import { Wifi, WifiOff, AlertCircle, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ConnectionStatus() {
  const { connectionStatus, refresh } = useRealtime()

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          icon: Wifi,
          label: "Connected",
          color: "bg-green-500/10 text-green-600 border-green-500/20",
          iconColor: "text-green-500",
        }
      case "connecting":
        return {
          icon: RefreshCw,
          label: "Connecting...",
          color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
          iconColor: "text-yellow-500 animate-spin",
        }
      case "disconnected":
        return {
          icon: WifiOff,
          label: "Disconnected",
          color: "bg-red-500/10 text-red-600 border-red-500/20",
          iconColor: "text-red-500",
        }
      case "error":
        return {
          icon: AlertCircle,
          label: "Connection Error",
          color: "bg-red-500/10 text-red-600 border-red-500/20",
          iconColor: "text-red-500",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-0 right-4 z-50"
      >
        <Card className="shadow-lg border-0 opacity-70">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
                <Badge className={`text-xs ${config.color}`}>{config.label}</Badge>
              </div>
              {connectionStatus === "disconnected" || connectionStatus === "error" ? (
                <Button variant="ghost" size="sm" onClick={refresh} className="h-6 px-2 text-xs">
                  Retry
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
