"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Mail, Phone, Shield, Bell, Eye, EyeOff, Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { BiometricSetupCard } from '@/components/biometric/biometric-setup-card'
import { toast } from 'sonner'

interface UserSettingsProps {
  userId: string
}

export function UserSettings({ userId }: UserSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPin, setShowCurrentPin] = useState(false)
  const [showNewPin, setShowNewPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  
  // Profile settings
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '08012345678'
  })

  // Security settings
  const [security, setSecurity] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: '',
    twoFactorEnabled: true,
    biometricEnabled: false
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    transactionAlerts: true,
    promotionalEmails: false
  })

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    transactionHistory: 'private',
    dataSharing: false
  })

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinChange = async () => {
    if (security.newPin !== security.confirmPin) {
      toast.error('New PIN and confirmation do not match')
      return
    }

    if (security.newPin.length !== 4) {
      toast.error('PIN must be 4 digits')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Transaction PIN updated successfully!')
      setSecurity(prev => ({
        ...prev,
        currentPin: '',
        newPin: '',
        confirmPin: ''
      }))
    } catch (error) {
      toast.error('Failed to update PIN')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Notification preferences updated!')
    } catch (error) {
      toast.error('Failed to update notifications')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                className="pl-10"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>
          
          <Button onClick={handleProfileUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Profile
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your account security and authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PIN Change */}
          <div className="space-y-4">
            <h4 className="font-medium">Change Transaction PIN</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPin">Current PIN</Label>
                <div className="relative">
                  <Input
                    id="currentPin"
                    type={showCurrentPin ? "text" : "password"}
                    maxLength={4}
                    value={security.currentPin}
                    onChange={(e) => setSecurity(prev => ({ ...prev, currentPin: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showCurrentPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPin">New PIN</Label>
                <div className="relative">
                  <Input
                    id="newPin"
                    type={showNewPin ? "text" : "password"}
                    maxLength={4}
                    value={security.newPin}
                    onChange={(e) => setSecurity(prev => ({ ...prev, newPin: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPin">Confirm PIN</Label>
                <div className="relative">
                  <Input
                    id="confirmPin"
                    type={showConfirmPin ? "text" : "password"}
                    maxLength={4}
                    value={security.confirmPin}
                    onChange={(e) => setSecurity(prev => ({ ...prev, confirmPin: e.target.value }))}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <Button onClick={handlePinChange} disabled={isLoading || !security.currentPin || !security.newPin || !security.confirmPin}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating PIN...
                </>
              ) : (
                'Update PIN'
              )}
            </Button>
          </div>

          <Separator />

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={security.twoFactorEnabled}
                onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))}
              />
              {security.twoFactorEnabled && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biometric Authentication */}
      <BiometricSetupCard userId={userId} />

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">SMS Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via SMS
                </p>
              </div>
              <Switch
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, smsNotifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive push notifications on your device
                </p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Transaction Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified about all transactions
                </p>
              </div>
              <Switch
                checked={notifications.transactionAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, transactionAlerts: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Promotional Emails</h4>
                <p className="text-sm text-muted-foreground">
                  Receive offers and promotional content
                </p>
              </div>
              <Switch
                checked={notifications.promotionalEmails}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, promotionalEmails: checked }))}
              />
            </div>
          </div>
          
          <Button onClick={handleNotificationUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            Your account verification and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Verification</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Phone Verification</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Identity Verification</span>
              <Badge variant="secondary">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium">Transaction Limits</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Daily Limit:</span>
                  <span>₦50,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Limit:</span>
                  <span>₦500,000</span>
                </div>
              </div>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Complete identity verification to increase your transaction limits.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
