'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, BellOff, CheckCircle } from 'lucide-react'
import { usePushNotifications } from '@/lib/hooks/use-push-notifications'
import { toast } from 'sonner'

interface PushNotificationSetupProps {
  userId: string
  onComplete?: () => void
}

export function PushNotificationSetup({ userId, onComplete }: PushNotificationSetupProps) {
  const { isSupported, isSubscribed, permission, subscribe, unsubscribe } = usePushNotifications(userId)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    
    try {
      const success = await subscribe()
      
      if (success) {
        toast.success('Push notifications enabled successfully!')
        onComplete?.()
      } else {
        toast.error('Failed to enable push notifications')
      }
    } catch (error) {
      toast.error('Push notification setup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setIsLoading(true)
    
    try {
      await unsubscribe()
      toast.success('Push notifications disabled')
    } catch (error) {
      toast.error('Failed to disable push notifications')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported on this device
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (permission === 'denied') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-red-500" />
            Push Notifications Blocked
          </CardTitle>
          <CardDescription>
            Push notifications have been blocked. Please enable them in your browser settings.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isSubscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Push Notifications Enabled
          </CardTitle>
          <CardDescription>
            You'll receive notifications for transactions and important updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleUnsubscribe}
            disabled={isLoading}
          >
            Disable Push Notifications
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Enable Push Notifications
        </CardTitle>
        <CardDescription>
          Get instant notifications for transactions, security alerts, and important updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Bell className="h-5 w-5 text-blue-500" />
            <div className="text-sm">
              <p className="font-medium">Transaction Alerts</p>
              <p className="text-gray-600">Instant confirmation of payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Bell className="h-5 w-5 text-green-500" />
            <div className="text-sm">
              <p className="font-medium">Security Notifications</p>
              <p className="text-gray-600">Account security and login alerts</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Enabling...' : 'Enable Push Notifications'}
        </Button>
      </CardContent>
    </Card>
  )
}
