"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Phone,
  Calendar,
  Shield,
  Key,
  Camera,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Clock,
  Activity,
  Settings,
} from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

const adminStats = [
  {
    title: "Total Logins",
    value: "1,247",
    description: "Since account creation",
    icon: Activity,
  },
  {
    title: "Last Login",
    value: "2 hours ago",
    description: "From 192.168.1.100",
    icon: Clock,
  },
  {
    title: "Active Sessions",
    value: "3",
    description: "Currently logged in",
    icon: Smartphone,
  },
  {
    title: "Account Age",
    value: "2 years",
    description: "Member since 2022",
    icon: Calendar,
  },
]

const recentActivity = [
  {
    id: 1,
    action: "Updated user permissions",
    details: "Modified permissions for user ID: 12345",
    timestamp: "2024-01-15T14:30:00Z",
    type: "user_management",
  },
  {
    id: 2,
    action: "Generated transaction report",
    details: "Monthly report for December 2024",
    timestamp: "2024-01-15T14:25:00Z",
    type: "report",
  },
  {
    id: 3,
    action: "Updated security settings",
    details: "Enabled two-factor authentication",
    timestamp: "2024-01-15T14:20:00Z",
    type: "security",
  },
  {
    id: 4,
    action: "Processed complaint",
    details: "Resolved complaint ID: 789",
    timestamp: "2024-01-15T14:15:00Z",
    type: "support",
  },
]

export function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@vtopup.com",
    phone: "+234 xxx xxx xxxx",
    location: "Lagos, Nigeria",
    bio: "System Administrator for VTopup platform",
    timezone: "Africa/Lagos",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSaveProfile = () => {
    // Simulate saving profile
    setIsEditing(false)
    console.log("Profile saved:", profileData)
  }

  const handleChangePassword = () => {
    // Simulate password change
    console.log("Password changed")
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
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
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
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
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={profileData.timezone}
                      onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
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
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
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

                <Button onClick={handleChangePassword} className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Authenticator App</p>
                      <p className="text-xs text-muted-foreground">Enabled</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">SMS Authentication</p>
                      <p className="text-xs text-muted-foreground">Not configured</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Setup
                  </Button>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Two-factor authentication is enabled. You'll need your authenticator app to sign in.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    device: "Chrome on Windows",
                    location: "Lagos, Nigeria",
                    ip: "192.168.1.100",
                    lastActive: "2024-01-15T14:30:00Z",
                    current: true,
                  },
                  {
                    id: 2,
                    device: "Safari on iPhone",
                    location: "Lagos, Nigeria",
                    ip: "192.168.1.101",
                    lastActive: "2024-01-15T12:15:00Z",
                    current: false,
                  },
                  {
                    id: 3,
                    device: "Firefox on Ubuntu",
                    location: "Abuja, Nigeria",
                    ip: "10.0.0.50",
                    lastActive: "2024-01-14T18:45:00Z",
                    current: false,
                  },
                ].map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-sm">{session.device}</p>
                          {session.current && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {session.location} • {session.ip}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last active: {format(new Date(session.lastActive), "MMM dd, yyyy HH:mm")}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "email-notifications",
                  label: "Email Notifications",
                  description: "Receive notifications via email",
                },
                {
                  id: "push-notifications",
                  label: "Push Notifications",
                  description: "Receive browser push notifications",
                },
                { id: "security-alerts", label: "Security Alerts", description: "Get notified about security events" },
                {
                  id: "system-updates",
                  label: "System Updates",
                  description: "Receive system maintenance notifications",
                },
              ].map((pref) => (
                <div key={pref.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={pref.id}>{pref.label}</Label>
                    <p className="text-sm text-muted-foreground">{pref.description}</p>
                  </div>
                  <Switch id={pref.id} defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interface Preferences</CardTitle>
              <CardDescription>Customize your admin interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 w-full">
              <div className="space-x-2 flex w-full justify-between">
                <Label>Theme</Label>
                <ThemeToggle />
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select defaultValue="dd/mm/yyyy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="p-2 bg-muted rounded-lg mt-1">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' HH:mm")}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
