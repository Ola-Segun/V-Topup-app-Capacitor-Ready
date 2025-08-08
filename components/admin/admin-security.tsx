"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Shield,
  Key,
  Lock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Activity,
  Globe,
} from "lucide-react"
import { motion } from "framer-motion"

const securityMetrics = [
  {
    title: "Security Score",
    value: 85,
    status: "good",
    description: "Overall system security rating",
    icon: Shield,
  },
  {
    title: "Failed Login Attempts",
    value: 12,
    status: "warning",
    description: "In the last 24 hours",
    icon: Lock,
  },
  {
    title: "Active Sessions",
    value: 156,
    status: "normal",
    description: "Currently logged in users",
    icon: Activity,
  },
  {
    title: "Blocked IPs",
    value: 8,
    status: "normal",
    description: "Automatically blocked addresses",
    icon: Globe,
  },
]

const recentSecurityEvents = [
  {
    id: 1,
    type: "login_failure",
    severity: "medium",
    message: "Multiple failed login attempts detected",
    details: "IP: 192.168.1.100 attempted 5 failed logins",
    timestamp: "2024-01-15T14:30:00Z",
    status: "blocked",
  },
  {
    id: 2,
    type: "suspicious_activity",
    severity: "high",
    message: "Unusual API access pattern detected",
    details: "Rapid API calls from IP: 10.0.0.50",
    timestamp: "2024-01-15T14:25:00Z",
    status: "investigating",
  },
  {
    id: 3,
    type: "password_change",
    severity: "low",
    message: "Admin password changed",
    details: "Password updated for admin@vtopup.com",
    timestamp: "2024-01-15T14:20:00Z",
    status: "resolved",
  },
]

export function AdminSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "danger":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getEventStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "blocked":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "investigating":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Activity className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Center</h1>
          <p className="text-muted-foreground">Monitor and manage system security</p>
        </div>
        <div className="flex items-center flex-wrap space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                        <p className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                          {typeof metric.value === "number" && metric.title === "Security Score"
                            ? `${metric.value}%`
                            : metric.value}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                  {metric.title === "Security Score" && <Progress value={metric.value} className="mt-3" />}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="flex items-center justify-between flex-wrap h-fit">
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Authentication Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Configure authentication and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number(e.target.value))}
                    min="5"
                    max="480"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                  </div>
                  <Switch checked={ipWhitelistEnabled} onCheckedChange={setIpWhitelistEnabled} />
                </div>
              </CardContent>
            </Card>

            {/* API Security */}
            <Card>
              <CardHeader>
                <CardTitle>API Security</CardTitle>
                <CardDescription>Manage API keys and access tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value="sk_live_1234567890abcdef"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button variant="outline" size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Rate Limiting</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Requests per minute</Label>
                      <Input type="number" defaultValue="100" />
                    </div>
                    <div>
                      <Label className="text-xs">Burst limit</Label>
                      <Input type="number" defaultValue="200" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Configure security notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Failed Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert on multiple failed login attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Suspicious Activity</Label>
                    <p className="text-sm text-muted-foreground">Alert on unusual access patterns</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Device Login</Label>
                    <p className="text-sm text-muted-foreground">Alert when logging in from new devices</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Admin Actions</Label>
                    <p className="text-sm text-muted-foreground">Alert on critical admin actions</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Monitor security incidents and threats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSecurityEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      {getEventStatusIcon(event.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-sm">{event.message}</h3>
                          <Badge className={`text-xs ${getSeverityColor(event.severity)}`}>{event.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{event.details}</p>
                        <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Access Control</AlertTitle>
            <AlertDescription>
              Configure user permissions and access restrictions for enhanced security.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>IP Whitelist</CardTitle>
              <CardDescription>Manage allowed IP addresses for admin access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input placeholder="Enter IP address (e.g., 192.168.1.100)" />
                <Button>Add IP</Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="font-mono text-sm">192.168.1.100</span>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="font-mono text-sm">10.0.0.0/24</span>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Track all administrative actions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Audit logs coming soon</h3>
                <p className="text-muted-foreground">
                  Detailed audit trail functionality will be available in the next update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
