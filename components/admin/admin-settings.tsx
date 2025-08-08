"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Settings,
  CreditCard,
  Shield,
  Bell,
  Database,
  Smartphone,
  Globe,
  Save,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react"
import { motion } from "framer-motion"

export function AdminSettings() {
  const [loading, setLoading] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "VTopup",
    siteDescription: "Your trusted digital services platform",
    supportEmail: "support@vtopup.com",
    supportPhone: "+234 800 123 4567",
    maintenanceMode: false,

    // Payment Settings
    paystackPublicKey: "pk_test_xxxxxxxxxxxxx",
    paystackSecretKey: "sk_test_xxxxxxxxxxxxx",
    flutterwavePublicKey: "FLWPUBK_TEST-xxxxxxxxxxxxx",
    flutterwaveSecretKey: "FLWSECK_TEST-xxxxxxxxxxxxx",
    minimumWalletFunding: 100,
    maximumWalletFunding: 500000,
    transactionFee: 0,

    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    systemAlerts: true,

    // Service Settings
    airtimeEnabled: true,
    dataEnabled: true,
    cableEnabled: true,
    electricityEnabled: true,

    // API Settings
    apiRateLimit: 1000,
    apiTimeout: 30,
  })

  const handleSave = async (section: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success(`${section} settings saved successfully!`)
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setLoading(false)
    }
  }

  const handleBackup = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast.success("Database backup completed successfully!")
    } catch (error) {
      toast.error("Backup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      toast.success("Database restored successfully!")
    } catch (error) {
      toast.error("Restore failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Settings className="w-8 h-8 mr-3" />
              System Settings
            </h1>
            <p className="text-muted-foreground">Configure your platform settings and preferences</p>
          </div>
          <Badge variant="outline" className="w-fit">
            <CheckCircle className="w-4 h-4 mr-2" />
            All Systems Operational
          </Badge>
        </motion.div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto p-1">
            <TabsTrigger value="general" className="flex items-center space-x-2 py-3">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center space-x-2 py-3">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2 py-3">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2 py-3">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2 py-3">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center space-x-2 py-3">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Database</span>
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    General Configuration
                  </CardTitle>
                  <CardDescription>Basic platform settings and information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Textarea
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="supportPhone">Support Phone</Label>
                      <Input
                        id="supportPhone"
                        value={settings.supportPhone}
                        onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Temporarily disable the platform</p>
                      </div>
                      <Switch
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave("General")} disabled={loading} className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save General Settings"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Gateway Configuration
                  </CardTitle>
                  <CardDescription>Configure payment providers and limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Paystack Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Paystack Configuration</h3>
                      <Badge variant="secondary">Primary Gateway</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paystackPublic">Public Key</Label>
                        <div className="relative">
                          <Input
                            id="paystackPublic"
                            type={showApiKeys ? "text" : "password"}
                            value={settings.paystackPublicKey}
                            onChange={(e) => setSettings({ ...settings, paystackPublicKey: e.target.value })}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowApiKeys(!showApiKeys)}
                          >
                            {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paystackSecret">Secret Key</Label>
                        <Input
                          id="paystackSecret"
                          type={showApiKeys ? "text" : "password"}
                          value={settings.paystackSecretKey}
                          onChange={(e) => setSettings({ ...settings, paystackSecretKey: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Flutterwave Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Flutterwave Configuration</h3>
                      <Badge variant="outline">Secondary Gateway</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="flutterwavePublic">Public Key</Label>
                        <Input
                          id="flutterwavePublic"
                          type={showApiKeys ? "text" : "password"}
                          value={settings.flutterwavePublicKey}
                          onChange={(e) => setSettings({ ...settings, flutterwavePublicKey: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="flutterwaveSecret">Secret Key</Label>
                        <Input
                          id="flutterwaveSecret"
                          type={showApiKeys ? "text" : "password"}
                          value={settings.flutterwaveSecretKey}
                          onChange={(e) => setSettings({ ...settings, flutterwaveSecretKey: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Transaction Limits */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Transaction Limits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minFunding">Minimum Wallet Funding (₦)</Label>
                        <Input
                          id="minFunding"
                          type="number"
                          value={settings.minimumWalletFunding}
                          onChange={(e) => setSettings({ ...settings, minimumWalletFunding: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxFunding">Maximum Wallet Funding (₦)</Label>
                        <Input
                          id="maxFunding"
                          type="number"
                          value={settings.maximumWalletFunding}
                          onChange={(e) => setSettings({ ...settings, maximumWalletFunding: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transactionFee">Transaction Fee (%)</Label>
                        <Input
                          id="transactionFee"
                          type="number"
                          step="0.1"
                          value={settings.transactionFee}
                          onChange={(e) => setSettings({ ...settings, transactionFee: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave("Payment")} disabled={loading} className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Payment Settings"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Security Configuration
                  </CardTitle>
                  <CardDescription>Configure security policies and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Strong Password Policy</Label>
                        <p className="text-sm text-muted-foreground">Enforce complex passwords</p>
                      </div>
                      <Switch
                        checked={settings.requireStrongPassword}
                        onCheckedChange={(checked) => setSettings({ ...settings, requireStrongPassword: checked })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => setSettings({ ...settings, maxLoginAttempts: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Min Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        value={settings.passwordMinLength}
                        onChange={(e) => setSettings({ ...settings, passwordMinLength: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave("Security")} disabled={loading} className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Security Settings"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Configure system and user notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Browser push notifications</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify on transactions</p>
                      </div>
                      <Switch
                        checked={settings.transactionAlerts}
                        onCheckedChange={(checked) => setSettings({ ...settings, transactionAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">Critical system notifications</p>
                      </div>
                      <Switch
                        checked={settings.systemAlerts}
                        onCheckedChange={(checked) => setSettings({ ...settings, systemAlerts: checked })}
                      />
                    </div>
                  </div>

                  <Button onClick={() => handleSave("Notifications")} disabled={loading} className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Notification Settings"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Services Settings */}
          <TabsContent value="services" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Service Configuration
                  </CardTitle>
                  <CardDescription>Enable or disable platform services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Airtime Top-up</Label>
                        <p className="text-sm text-muted-foreground">Enable airtime purchases</p>
                      </div>
                      <Switch
                        checked={settings.airtimeEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, airtimeEnabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Bundles</Label>
                        <p className="text-sm text-muted-foreground">Enable data purchases</p>
                      </div>
                      <Switch
                        checked={settings.dataEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, dataEnabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Cable TV</Label>
                        <p className="text-sm text-muted-foreground">Enable cable subscriptions</p>
                      </div>
                      <Switch
                        checked={settings.cableEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, cableEnabled: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Electricity Bills</Label>
                        <p className="text-sm text-muted-foreground">Enable electricity payments</p>
                      </div>
                      <Switch
                        checked={settings.electricityEnabled}
                        onCheckedChange={(checked) => setSettings({ ...settings, electricityEnabled: checked })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">API Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                        <Input
                          id="apiRateLimit"
                          type="number"
                          value={settings.apiRateLimit}
                          onChange={(e) => setSettings({ ...settings, apiRateLimit: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apiTimeout">API Timeout (seconds)</Label>
                        <Input
                          id="apiTimeout"
                          type="number"
                          value={settings.apiTimeout}
                          onChange={(e) => setSettings({ ...settings, apiTimeout: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave("Services")} disabled={loading} className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Service Settings"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Database Settings */}
          <TabsContent value="database" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Database Management
                  </CardTitle>
                  <CardDescription>Backup, restore, and maintain your database</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-2 border-dashed border-border">
                      <CardContent className="p-6 text-center space-y-4">
                        <Download className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">Database Backup</h3>
                          <p className="text-sm text-muted-foreground">Create a backup of your database</p>
                        </div>
                        <Button onClick={handleBackup} disabled={loading} className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          {loading ? "Creating Backup..." : "Create Backup"}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-dashed border-border">
                      <CardContent className="p-6 text-center space-y-4">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">Database Restore</h3>
                          <p className="text-sm text-muted-foreground">Restore from a backup file</p>
                        </div>
                        <Button
                          onClick={handleRestore}
                          disabled={loading}
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {loading ? "Restoring..." : "Restore Database"}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-semibold text-orange-800 dark:text-orange-200">Important Notice</h4>
                          <p className="text-sm text-orange-700 dark:text-orange-300">
                            Database operations can affect system performance. It's recommended to perform these
                            operations during low-traffic periods.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Database Statistics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold">1,234</p>
                          <p className="text-sm text-muted-foreground">Total Users</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold">5,678</p>
                          <p className="text-sm text-muted-foreground">Transactions</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold">45.2MB</p>
                          <p className="text-sm text-muted-foreground">Database Size</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-2xl font-bold">99.9%</p>
                          <p className="text-sm text-muted-foreground">Uptime</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
