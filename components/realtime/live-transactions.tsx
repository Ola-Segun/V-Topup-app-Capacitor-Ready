"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRealtime } from "./realtime-provider"
import { CreditCard, Smartphone, Wifi, Zap, Tv } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function LiveTransactions() {
  const { transactions } = useRealtime()

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "airtime":
        return Smartphone
      case "data":
        return Wifi
      case "electricity":
        return Zap
      case "cable":
        return Tv
      default:
        return CreditCard
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Transactions</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Real-time</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence initial={false}>
            {transactions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Waiting for transactions...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction, index) => {
                  const ServiceIcon = getServiceIcon(transaction.type)

                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-muted rounded-lg">
                          <ServiceIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{transaction.userName}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span className="capitalize">{transaction.type.replace("_", " ")}</span>
                            {transaction.network && (
                              <>
                                <span>•</span>
                                <span>{transaction.network}</span>
                              </>
                            )}
                            {transaction.phone && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[100px]">{transaction.phone}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <p className="font-semibold text-sm">₦{transaction.amount.toLocaleString()}</p>
                        <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
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
