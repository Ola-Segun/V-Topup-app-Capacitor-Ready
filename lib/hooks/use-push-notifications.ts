import { useState, useEffect } from 'react'
import { pushNotificationService } from '@/lib/services/push-notification-service'

export function usePushNotifications(userId?: string) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window
      setIsSupported(supported)
      
      if (supported) {
        setPermission(Notification.permission)
        await pushNotificationService.initialize()
      }
    }

    checkSupport()
  }, [])

  const subscribe = async () => {
    if (!userId) return false

    try {
      await pushNotificationService.subscribeToPush(userId)
      setIsSubscribed(true)
      return true
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return false
    }
  }

  const unsubscribe = async () => {
    if (!userId) return

    try {
      await pushNotificationService.unsubscribeFromPush(userId)
      setIsSubscribed(false)
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
    }
  }

  const sendNotification = async (title: string, message: string, data?: any) => {
    if (!userId) return

    await pushNotificationService.sendNotification(userId, title, message, data)
  }

  return {
    isSupported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
    sendNotification
  }
}
