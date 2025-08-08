"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Phone, Shield, Key, Camera, Save, Eye, EyeOff, Trash2, Download, Upload, Settings, Smartphone, Moon, Sun, CheckCircle, AlertTriangle, Bell, Lock, User, Globe, Palette, Volume2, QrCode, Copy, RefreshCw } from 'lucide-react'
import { useAuth } from "@/components/auth-provider"
import { saveRecentAction } from "@/lib/recent-actions"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { ThemeToggle } from "../theme-toggle"
import { BiometricSettings } from "./biometric-settings"
import { BiometricSetupCard } from '@/components/biometric/biometric-setup-card'
import { toast } from "sonner"
import { motion } from "framer-motion"

interface UserSettingsProps {
  userId: string
  userEmail?: string
  userName?: string
}

export function UserSettings({ userId, userEmail, userName }: UserSettingsProps) {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [showPinSetup, setShowPinSetup] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [transactionPin, setTransactionPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")

  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || userName?.split(' ')[0] || "John",
    lastName: user?.user_metadata?.last_name || userName?.split(' ').slice(1).join(' ') || "Doe",
    email: user?.email || userEmail || "john.doe@example.com",
    phone: user?.user_metadata?.phone || "+234 xxx xxx xxxx",
    location: user?.user_metadata?.location || "Lagos, Nigeria",
    bio: user?.user_metadata?.bio || "VTopup user since 2024",
    dateOfBirth: user?.user_metadata?.date_of_birth || "1990-01-01",
    gender: user?.user_metadata?.gender || "male",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    transactionPin: false,
    biometricAuth: false,
    loginNotifications: true,
    deviceManagement: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    promotionalEmails: false,
    securityAlerts: true,
    weeklyReports: true,
    budgetAlerts: true,
    lowBalanceAlerts: true,
    maintenanceNotifications: true,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "private",
    showTransactionHistory: false,
    allowDataCollection: true,
    shareAnalytics: false,
  })

  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    currency: "NGN",
    timezone: "Africa/Lagos",
    soundEffects: true,
    hapticFeedback: true,
    autoLogout: 30,
    defaultPaymentMethod: "wallet",
    quickActionsEnabled: true,
    showBalanceOnHome: true,
  })

  const [connectedDevices, setConnectedDevices] = useState([
    {
      id: 1,
      name: "iPhone 13 Pro",
      type: "mobile",
      location: "Lagos, Nigeria",
      lastActive: "Active now",
      current: true,
      trusted: true
    },
    {
      id: 2,
      name: "Chrome on Windows",
      type: "desktop",
      location: "Lagos, Nigeria",
      lastActive: "2 hours ago",
      current: false,
      trusted: true
    },
    {
      id: 3,
      name: "Samsung Galaxy S21",
      type: "mobile",
      location: "Abuja, Nigeria",
      lastActive: "1 day ago",
      current: false,
      trusted: false
    }
  ])

  // Generate QR code for 2FA setup
  const [qrCodeUrl] = useState("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/VTopup:john.doe@example.com?secret=JBSWY3DPEHPK3PXP&issuer=VTopup")
  const [backupCodes] = useState([
    "1234-5678", "2345-6789", "3456-7890", "4567-8901", "5678-9012"
  ])

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSecurity = localStorage.getItem('vtopup_security_settings')
    const savedNotifications = localStorage.getItem('vtopup_notification_settings')
    const savedPrivacy = localStorage.getItem('vtopup_privacy_settings')
    const savedPreferences = localStorage.getItem('vtopup_preferences')

    if (savedSecurity) {
      try {
        setSecuritySettings(JSON.parse(savedSecurity))
      } catch (error) {
        console.error('Failed to load security settings:', error)
      }
    }

    if (savedNotifications) {
      try {
        setNotificationSettings(JSON.parse(savedNotifications))
      } catch (error) {
        console.error('Failed to load notification settings:', error)
      }
    }

    if (savedPrivacy) {
      try {
        setPrivacySettings(JSON.parse(savedPrivacy))
      } catch (error) {
        console.error('Failed to load privacy settings:', error)
      }
    }

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (error) {
        console.error('Failed to load preferences:', error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('vtopup_security_settings', JSON.stringify(securitySettings))
  }, [securitySettings])

  useEffect(() => {
    localStorage.setItem('vtopup_notification_settings', JSON.stringify(notificationSettings))
  }, [notificationSettings])

  useEffect(() => {
    localStorage.setItem('vtopup_privacy_settings', JSON.stringify(privacySettings))
  }, [privacySettings])

  useEffect(() => {
    localStorage.setItem('vtopup_preferences', JSON.stringify(preferences))
  }, [preferences])

  const handleSaveProfile = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save recent action
      await saveRecentAction({
        type: "profile_update",
        description: "Updated profile information",
        amount: 0,
        status: "completed",
      })

      setIsEditing(false)
      setHasUnsavedChanges(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save recent action
      await saveRecentAction({
        type: "security_update",
        description: "Changed account password",
        amount: 0,
        status: "completed",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast.success("Password changed successfully!")
    } catch (error) {
      toast.error("Failed to change password")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSetup2FA = async () => {
    if (otpCode.length !== 6) {
      toast.error("Please enter the 6-digit code from your authenticator app")
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSecuritySettings(prev => ({ ...prev, twoFactorAuth: true }))
      setShow2FASetup(false)
      setOtpCode("")

      await saveRecentAction({
        type: "security_update",
        description: "Enabled two-factor authentication",
        amount: 0,
        status: "completed",
      })

      toast.success("Two-factor authentication enabled successfully!")
    } catch (error) {
      toast.error("Failed to enable 2FA")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSetupTransactionPin = async () => {
    if (transactionPin.length !== 4) {
      toast.error("PIN must be 4 digits")
      return
    }

    if (transactionPin !== confirmPin) {
      toast.error("PINs do not match")
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSecuritySettings(prev => ({ ...prev, transactionPin: true }))
      setShowPinSetup(false)
      setTransactionPin("")
      setConfirmPin("")

      await saveRecentAction({
        type: "security_update",
        description: "Set up transaction PIN",
        amount: 0,
        status: "completed",
      })

      toast.success("Transaction PIN set up successfully!")
    } catch (error) {
      toast.error("Failed to set up transaction PIN")
    } finally {
      setIsSaving(false)
    }
  }

  const handleRevokeDevice = async (deviceId: number) => {
    setConnectedDevices(prev => prev.filter(device => device.id !== deviceId))
    toast.success("Device access revoked")
  }

  const handleTrustDevice = async (deviceId: number) => {
    setConnectedDevices(prev => 
      prev.map(device => 
        device.id === deviceId ? { ...device, trusted: !device.trusted } : device
      )
    )
    toast.success("Device trust status updated")
  }

  const handleNotificationChange = async (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))

    // Save recent action
    await saveRecentAction({
      type: "settings_update",
      description: `${value ? "Enabled" : "Disabled"} ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`,
      amount: 0,
      status: "completed",
    })

    toast.success(`${key.replace(/([A-Z])/g, " $1")} ${value ? "enabled" : "disabled"}`)
  }

  const handleSecurityChange = async (key: string, value: boolean | string | number) => {
    setSecuritySettings((prev) => ({ ...prev, [key]: value }))

    // Save recent action
    await saveRecentAction({
      type: "security_update",
      description: `Updated ${key.replace(/([A-Z])/g, " $1").toLowerCase()} setting`,
      amount: 0,
      status: "completed",
    })

    toast.success("Security setting updated")
  }

  const handlePrivacyChange = async (key: string, value: boolean | string | number) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))

    // Save recent action
    await saveRecentAction({
      type: "privacy_update",
      description: `Updated ${key.replace(/([A-Z])/g, " $1").toLowerCase()} setting`,
      amount: 0,
      status: "completed",
    })

    toast.success("Privacy setting updated")
  }

  const handlePreferenceChange = async (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))

    // Save recent action
    await saveRecentAction({
      type: "preference_update",
      description: `Updated ${key.replace(/([A-Z])/g, " $1").toLowerCase()} preference`,
      amount: 0,
      status: "completed",
    })

    toast.success("Preference updated")
  }

  const handleDeleteAccount = async () => {
    // Implement account deletion logic
    toast.error("Account deletion is not available in demo mode")
  }

  const handleExportData = async () => {
    try {
      // Simulate data export
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      await saveRecentAction({
        type: "data_export",
        description: "Exported account data",
        amount: 0,
        status: "completed",
      })

      toast.success("Data export completed! Check your downloads.")
    } catch (error) {
      toast.error("Failed to export data")
    }
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      <PremiumMobileNav />
      <div className="mobile-container py-6 space-y-6">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false)
                    setHasUnsavedChanges(false)
                  }} 
                  disabled={isSaving}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving} size="sm">
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </motion.div>

        {/* Unsaved Changes Alert */}
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have unsaved changes. Don't forget to save your profile updates.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="profile" className="text-xs">
              <User className="w-4 h-4 mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs">
              <Shield className="w-4 h-4 mr-1" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs">
              <Bell className="w-4 h-4 mr-1" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs">
              <Lock className="w-4 h-4 mr-1" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs">
              <Palette className="w-4 h-4 mr-1" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="account" className="text-xs">
              <Settings className="w-4 h-4 mr-1" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-base">Profile Picture</CardTitle>
                    <CardDescription>Update your profile photo</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src="/placeholder.svg?height=128&width=128" />
                      <AvatarFallback className="text-2xl">
                        {profileData.firstName[0]}
                        {profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" disabled={!isEditing}>
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                      <Button variant="outline" size="sm" disabled={!isEditing}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-card border-0">
                    <CardHeader>
                      <CardTitle className="text-base">Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => handleProfileChange('firstName', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => handleProfileChange('lastName', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => handleProfileChange('phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => handleProfileChange('location', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={profileData.gender}
                            onValueChange={(value) => handleProfileChange('gender', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Change Password */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-base">Change Password</CardTitle>
                    <CardDescription>Update your account password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                    </div>

                    <Button onClick={handleChangePassword} className="w-full" disabled={isSaving}>
                      {isSaving ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Updating...</span>
                        </div>
                      ) : (
                        <>
                          <Key className="w-4 h-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Two-Factor Authentication */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable 2FA</Label>
                        <p className="text-sm text-muted-foreground">Secure your account with two-factor authentication</p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setShow2FASetup(true)
                          } else {
                            handleSecurityChange("twoFactorAuth", false)
                          }
                        }}
                      />
                    </div>

                    {securitySettings.twoFactorAuth && (
                      <Alert>
                        <Shield className="h-4 w-4" />
                        <AlertDescription>
                          Two-factor authentication is enabled. You'll need your authenticator app to sign in.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full bg-transparent" 
                        disabled={!securitySettings.twoFactorAuth}
                        onClick={() => setShow2FASetup(true)}
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Reconfigure Authenticator
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" disabled={!securitySettings.twoFactorAuth}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate Backup Codes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Transaction PIN */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-base">Transaction PIN</CardTitle>
                    <CardDescription>Set up a PIN for transaction authorization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Transaction PIN</Label>
                        <p className="text-sm text-muted-foreground">Require PIN for all transactions</p>
                      </div>
                      <Switch
                        checked={securitySettings.transactionPin}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setShowPinSetup(true)
                          } else {
                            handleSecurityChange("transactionPin", false)
                          }
                        }}
                      />
                    </div>

                    {securitySettings.transactionPin && (
                      <Alert>
                        <Key className="h-4 w-4" />
                        <AlertDescription>
                          Transaction PIN is active. You'll need to enter your PIN for all transactions.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent" 
                      disabled={!securitySettings.transactionPin}
                      onClick={() => setShowPinSetup(true)}
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Change PIN
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Biometric Authentication */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <BiometricSetupCard userId={userId} />
              </motion.div>
            </div>

            {/* Device Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">Connected Devices</CardTitle>
                  <CardDescription>Manage devices that have access to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {connectedDevices.map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/30">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-sm">{device.name}</p>
                              {device.current && (
                                <Badge variant="secondary" className="text-xs">
                                  Current
                                </Badge>
                              )}
                              {device.trusted && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                                  Trusted
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {device.location} • {device.lastActive}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!device.current && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleTrustDevice(device.id)}
                              >
                                {device.trusted ? "Untrust" : "Trust"}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleRevokeDevice(device.id)}
                              >
                                Revoke
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      General Notifications
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          key: "emailNotifications",
                          label: "Email notifications",
                          description: "Receive notifications via email",
                        },
                        {
                          key: "smsNotifications",
                          label: "SMS notifications",
                          description: "Receive notifications via SMS",
                        },
                        {
                          key: "pushNotifications",
                          label: "Push notifications",
                          description: "Receive push notifications on your device",
                        },
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                          <div className="space-y-0.5">
                            <Label>{setting.label}</Label>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                          <Switch
                            checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                            onCheckedChange={(checked) => handleNotificationChange(setting.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Transaction & Security Alerts
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          key: "transactionAlerts",
                          label: "Transaction alerts",
                          description: "Get notified about your transactions",
                        },
                        {
                          key: "securityAlerts",
                          label: "Security alerts",
                          description: "Important security notifications",
                        },
                        {
                          key: "budgetAlerts",
                          label: "Budget alerts",
                          description: "Notifications when approaching budget limits",
                        },
                        {
                          key: "lowBalanceAlerts",
                          label: "Low balance alerts",
                          description: "Get notified when wallet balance is low",
                        },
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                          <div className="space-y-0.5">
                            <Label>{setting.label}</Label>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                          <Switch
                            checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                            onCheckedChange={(checked) => handleNotificationChange(setting.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Marketing & Updates
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          key: "promotionalEmails",
                          label: "Promotional emails",
                          description: "Offers and promotional content",
                        },
                        {
                          key: "weeklyReports",
                          label: "Weekly reports",
                          description: "Weekly summary of your activity",
                        },
                        {
                          key: "maintenanceNotifications",
                          label: "Maintenance notifications",
                          description: "System maintenance and update notifications",
                        },
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                          <div className="space-y-0.5">
                            <Label>{setting.label}</Label>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                          <Switch
                            checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                            onCheckedChange={(checked) => handleNotificationChange(setting.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">Privacy Settings</CardTitle>
                  <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Profile visibility</Label>
                        <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                      </div>
                      <Select
                        value={privacySettings.profileVisibility}
                        onValueChange={(value) => handlePrivacyChange("profileVisibility", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Show transaction history</Label>
                        <p className="text-sm text-muted-foreground">Allow others to see your transaction history</p>
                      </div>
                      <Switch
                        checked={privacySettings.showTransactionHistory}
                        onCheckedChange={(checked) => handlePrivacyChange("showTransactionHistory", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Data collection</Label>
                        <p className="text-sm text-muted-foreground">Allow us to collect data to improve our services</p>
                      </div>
                      <Switch
                        checked={privacySettings.allowDataCollection}
                        onCheckedChange={(checked) => handlePrivacyChange("allowDataCollection", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Share analytics</Label>
                        <p className="text-sm text-muted-foreground">Share anonymous usage analytics</p>
                      </div>
                      <Switch
                        checked={privacySettings.shareAnalytics}
                        onCheckedChange={(checked) => handlePrivacyChange("shareAnalytics", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">App Preferences</CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 w-full">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Appearance & Display
                    </h3>
                    
                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Theme</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                      </div>
                      <ThemeToggle />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Language</Label>
                        <p className="text-sm text-muted-foreground">Select your preferred language</p>
                      </div>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => handlePreferenceChange("language", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="yo">Yoruba</SelectItem>
                          <SelectItem value="ig">Igbo</SelectItem>
                          <SelectItem value="ha">Hausa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Currency</Label>
                        <p className="text-sm text-muted-foreground">Your preferred currency display</p>
                      </div>
                      <Select
                        value={preferences.currency}
                        onValueChange={(value) => handlePreferenceChange("currency", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NGN">₦ NGN</SelectItem>
                          <SelectItem value="USD">$ USD</SelectItem>
                          <SelectItem value="EUR">€ EUR</SelectItem>
                          <SelectItem value="GBP">£ GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      Interaction & Feedback
                    </h3>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Sound effects</Label>
                        <p className="text-sm text-muted-foreground">Play sounds for notifications and actions</p>
                      </div>
                      <Switch
                        checked={preferences.soundEffects}
                        onCheckedChange={(checked) => handlePreferenceChange("soundEffects", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Haptic feedback</Label>
                        <p className="text-sm text-muted-foreground">Vibration feedback for interactions</p>
                      </div>
                      <Switch
                        checked={preferences.hapticFeedback}
                        onCheckedChange={(checked) => handlePreferenceChange("hapticFeedback", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Quick actions</Label>
                        <p className="text-sm text-muted-foreground">Enable quick action shortcuts</p>
                      </div>
                      <Switch
                        checked={preferences.quickActionsEnabled}
                        onCheckedChange={(checked) => handlePreferenceChange("quickActionsEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Show balance on home</Label>
                        <p className="text-sm text-muted-foreground">Display wallet balance on dashboard</p>
                      </div>
                      <Switch
                        checked={preferences.showBalanceOnHome}
                        onCheckedChange={(checked) => handlePreferenceChange("showBalanceOnHome", checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Default Settings</h3>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Default payment method</Label>
                        <p className="text-sm text-muted-foreground">Your preferred payment method</p>
                      </div>
                      <Select
                        value={preferences.defaultPaymentMethod}
                        onValueChange={(value) => handlePreferenceChange("defaultPaymentMethod", value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wallet">Wallet</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>Auto logout</Label>
                        <p className="text-sm text-muted-foreground">Automatically logout after inactivity</p>
                      </div>
                      <Select
                        value={preferences.autoLogout.toString()}
                        onValueChange={(value) => handlePreferenceChange("autoLogout", Number(value))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="0">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-base">Account Information</CardTitle>
                    <CardDescription>Your account details and status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                        <span className="text-sm font-medium">Account ID</span>
                        <span className="text-sm text-muted-foreground">VT-{user?.id?.slice(0, 8) || "12345678"}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                        <span className="text-sm font-medium">Member since</span>
                        <span className="text-sm text-muted-foreground">January 2024</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                        <span className="text-sm font-medium">Account status</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                        <span className="text-sm font-medium">Verification status</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Data Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="text-base">Data Management</CardTitle>
                    <CardDescription>Export or delete your account data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Account Data
                    </Button>

                    <Button variant="outline" className="w-full bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Data
                    </Button>

                    <Separator />

                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>Deleting your account is permanent and cannot be undone.</AlertDescription>
                    </Alert>

                    <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Account Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="text-base">Recent Account Activity</CardTitle>
                  <CardDescription>Your recent account actions and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        action: "Profile updated",
                        timestamp: "2 hours ago",
                        ip: "192.168.1.100",
                        status: "success",
                      },
                      {
                        action: "Password changed",
                        timestamp: "1 day ago",
                        ip: "192.168.1.100",
                        status: "success",
                      },
                      {
                        action: "Login from new device",
                        timestamp: "3 days ago",
                        ip: "10.0.0.50",
                        status: "warning",
                      },
                      {
                        action: "Two-factor authentication enabled",
                        timestamp: "1 week ago",
                        ip: "192.168.1.100",
                        status: "success",
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background/30">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-muted rounded-lg">
                            {activity.status === "success" ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.timestamp} • {activity.ip}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* 2FA Setup Dialog */}
        <Dialog open={show2FASetup} onOpenChange={setShow2FASetup}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Scan the QR code with your authenticator app and enter the verification code
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={qrCodeUrl || "/placeholder.svg"} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              <div className="space-y-2">
                <Label>Enter verification code</Label>
                <InputOTP value={otpCode} onChange={setOtpCode} maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="space-y-2">
                <Label>Backup Codes</Label>
                <div className="grid grid-cols-1 gap-1 p-3 bg-muted rounded-lg text-sm font-mono">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{code}</span>
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(code)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
                </p>
              </div>
              <Button onClick={handleSetup2FA} className="w-full" disabled={isSaving || otpCode.length !== 6}>
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Enable 2FA"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transaction PIN Setup Dialog */}
        <Dialog open={showPinSetup} onOpenChange={setShowPinSetup}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Set up Transaction PIN</DialogTitle>
              <DialogDescription>
                Create a 4-digit PIN to authorize your transactions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Enter new PIN</Label>
                <InputOTP value={transactionPin} onChange={setTransactionPin} maxLength={4}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="space-y-2">
                <Label>Confirm PIN</Label>
                <InputOTP value={confirmPin} onChange={setConfirmPin} maxLength={4}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button 
                onClick={handleSetupTransactionPin} 
                className="w-full" 
                disabled={isSaving || transactionPin.length !== 4 || confirmPin.length !== 4}
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Setting up...</span>
                  </div>
                ) : (
                  "Set PIN"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
