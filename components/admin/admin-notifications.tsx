"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  Send,
  Users,
  Mail,
  Smartphone,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Eye,
  Plus,
} from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

const notificationTypes = [
  { id: "system", label: "System Alerts", icon: Settings, color: "bg-blue-500" },
  { id: "security", label: "Security", icon: AlertTriangle, color: "bg-red-500" },
  { id: "user", label: "User Activity", icon: Users, color: "bg-green-500" },
  { id: "transaction", label: "Transactions", icon: CheckCircle, color: "bg-purple-500" },
]

const mockNotifications = [
  {
    id: 1,
    type: "security",
    title: "Multiple failed login attempts",
    message: "User attempted to login 5 times with incorrect credentials",
    timestamp: "2024-01-15T14:30:00Z",
    read: false,
    priority: "high",
  },
  {
    id: 2,
    type: "system",
    title: "Database backup completed",
    message: "Daily backup completed successfully in 2m 34s",
    timestamp: "2024-01-15T14:25:00Z",
    read: true,
    priority: "low",
  },
  {
    id: 3,
    type: "transaction",
    title: "Large transaction detected",
    message: "Transaction of ₦50,000 processed for user ID: 12345",
    timestamp: "2024-01-15T14:20:00Z",
    read: false,
    priority: "medium",
  },
  {
    id: 4,
    type: "user",
    title: "New user registration",
    message: "New user registered: john.doe@example.com",
    timestamp: "2024-01-15T14:15:00Z",
    read: true,
    priority: "low",
  },
]

export function AdminNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [broadcastType, setBroadcastType] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    const notificationType = notificationTypes.find((t) => t.id === type)
    if (notificationType) {
      const Icon = notificationType.icon
      return <Icon className="w-4 h-4" />
    }
    return <Bell className="w-4 h-4" />
  }

  const sendBroadcast = () => {
    if (!broadcastMessage.trim()) return

    // Simulate sending broadcast
    console.log("Sending broadcast:", { message: broadcastMessage, type: broadcastType })
    setBroadcastMessage("")

    // Add success notification
    const newNotification = {
      id: Date.now(),
      type: "system",
      title: "Broadcast sent successfully",
      message: `Message sent to ${broadcastType === "all" ? "all users" : broadcastType}`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: "low",
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Manage system notifications and alerts</p>
        </div>
        <div className="flex items-center flex-wrap space-x-2">
          <Badge variant="secondary" className="px-3 py-1">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notifications List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Notifications</span>
                    <Badge variant="outline">{notifications.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-1 p-4">
                      <AnimatePresence>
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                              selectedNotification?.id === notification.id
                                ? "bg-primary/10 border border-primary/20"
                                : notification.read
                                  ? "opacity-60"
                                  : "bg-muted/30"
                            }`}
                            onClick={() => setSelectedNotification(notification)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-2 flex-1">
                                <div className="mt-1">{getTypeIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-medium text-sm truncate">{notification.title}</h3>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                      {notification.priority}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(notification.timestamp), "MMM dd, HH:mm")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Notification Detail */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedNotification ? "Notification Details" : "Select a Notification"}</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedNotification ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-muted rounded-lg">{getTypeIcon(selectedNotification.type)}</div>
                          <div>
                            <h2 className="text-lg font-semibold">{selectedNotification.title}</h2>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`text-xs ${getPriorityColor(selectedNotification.priority)}`}>
                                {selectedNotification.priority} priority
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {selectedNotification.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!selectedNotification.read && (
                            <Button variant="outline" size="sm" onClick={() => markAsRead(selectedNotification.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Mark as Read
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNotification(selectedNotification.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Message</Label>
                          <p className="text-sm text-muted-foreground mt-1">{selectedNotification.message}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Timestamp</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(selectedNotification.timestamp), "EEEE, MMMM dd, yyyy 'at' HH:mm:ss")}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Status</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            {selectedNotification.read ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className="text-sm text-muted-foreground">
                              {selectedNotification.read ? "Read" : "Unread"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No notification selected</h3>
                      <p className="text-muted-foreground">Select a notification from the list to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Broadcast Message</CardTitle>
              <CardDescription>Send notifications to users or administrators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="broadcast-type">Recipient Type</Label>
                <Select value={broadcastType} onValueChange={setBroadcastType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admins">Administrators Only</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                    <SelectItem value="premium">Premium Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="broadcast-message">Message</Label>
                <Textarea
                  id="broadcast-message"
                  placeholder="Enter your broadcast message..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button onClick={sendBroadcast} disabled={!broadcastMessage.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Broadcast
                </Button>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Broadcast History */}
          <Card>
            <CardHeader>
              <CardTitle>Broadcast History</CardTitle>
              <CardDescription>Recent broadcast messages sent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    message: "System maintenance scheduled for tonight",
                    recipients: "All Users",
                    sent: "2024-01-15T10:00:00Z",
                    delivered: 1250,
                  },
                  {
                    id: 2,
                    message: "New features available in the admin panel",
                    recipients: "Administrators Only",
                    sent: "2024-01-14T15:30:00Z",
                    delivered: 5,
                  },
                ].map((broadcast) => (
                  <div key={broadcast.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{broadcast.message}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>To: {broadcast.recipients}</span>
                        <span>•</span>
                        <span>{format(new Date(broadcast.sent), "MMM dd, yyyy HH:mm")}</span>
                        <span>•</span>
                        <span>{broadcast.delivered} delivered</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: "security-email",
                      label: "Security alerts",
                      description: "Get notified about security events",
                    },
                    {
                      id: "system-email",
                      label: "System updates",
                      description: "Receive system maintenance notifications",
                    },
                    {
                      id: "user-email",
                      label: "User activity",
                      description: "Get updates about user registrations and activity",
                    },
                    {
                      id: "transaction-email",
                      label: "Transaction alerts",
                      description: "Receive notifications about large transactions",
                    },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={setting.id}>{setting.label}</Label>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch id={setting.id} defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push Notifications</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: "security-push",
                      label: "Security alerts",
                      description: "Immediate alerts for security events",
                    },
                    {
                      id: "critical-push",
                      label: "Critical system events",
                      description: "High priority system notifications",
                    },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={setting.id}>{setting.label}</Label>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch id={setting.id} defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-xs text-muted-foreground">admin@vtopup.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Smartphone className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">SMS</p>
                      <p className="text-xs text-muted-foreground">+234 xxx xxx xxxx</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
