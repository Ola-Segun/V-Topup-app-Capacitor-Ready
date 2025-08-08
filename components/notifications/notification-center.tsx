"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, CheckCircle, AlertTriangle, Info, Gift, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "reward"
  title: string
  message: string
  time: string
  read: boolean
  actionRequired?: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Transaction Successful",
    message: "Your airtime purchase of ₦1,000 to 08012345678 was successful",
    time: "2 mins ago",
    read: false,
  },
  {
    id: "2",
    type: "reward",
    title: "Cashback Earned!",
    message: "You've earned ₦50 cashback on your recent transaction. Keep it up!",
    time: "1 hour ago",
    read: false,
    actionRequired: true,
  },
  {
    id: "3",
    type: "warning",
    title: "Low Wallet Balance",
    message: "Your wallet balance is running low. Fund your wallet to continue enjoying our services.",
    time: "3 hours ago",
    read: true,
    actionRequired: true,
  },
  {
    id: "4",
    type: "info",
    title: "New Data Plans Available",
    message: "Check out our new affordable data plans with better value for money.",
    time: "1 day ago",
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      case "reward":
        return <Gift className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    toast.success("Notification deleted")
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    toast.success("All notifications marked as read")
  }

  return (

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative material-card shadow-lg bg-card text-foreground">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

          <div className="mobile-container">
      <DialogContent className="bg-background border-border w-full p-4">
        <DialogHeader>
          <div className="flex items-center justify-between pt-4">
            <DialogTitle className="text-foreground">Notifications</DialogTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-primary">
                Mark all read
              </Button>
            )}
          </div>
          <DialogDescription className="text-muted-foreground">
            Stay updated with your account activity
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto space-y-3">
          <AnimatePresence>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  layout
                >
                  <Card
                    className={`material-card cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      !notification.read ? "border-primary/50 bg-primary/5" : "border-border bg-card"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-foreground">{notification.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                                {!notification.read && (
                                  <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                                    New
                                  </Badge>
                                )}
                                {notification.actionRequired && (
                                  <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-600">
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </div>
    </Dialog>
  )
}
