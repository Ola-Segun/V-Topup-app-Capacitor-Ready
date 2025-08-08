import { createClient } from '@/lib/supabase/client'

export class PushNotificationService {
  private supabase = createClient()
  private registration: ServiceWorkerRegistration | null = null

  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported')
      return
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', this.registration)

      // Request notification permission
      await this.requestPermission()
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported')
      return false
    }

    let permission = Notification.permission

    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    return permission === 'granted'
  }

  async subscribeToPush(userId: string): Promise<void> {
    if (!this.registration) {
      throw new Error('Service worker not registered')
    }

    const hasPermission = await this.requestPermission()
    if (!hasPermission) {
      throw new Error('Notification permission denied')
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '')
      })

      // Save subscription to database
      await this.saveSubscription(userId, subscription)
      
      console.log('Push subscription successful:', subscription)
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      throw error
    }
  }

  async unsubscribeFromPush(userId: string): Promise<void> {
    if (!this.registration) return

    try {
      const subscription = await this.registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        await this.removeSubscription(userId)
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
    }
  }

  private async saveSubscription(userId: string, subscription: PushSubscription): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({
        push_token: JSON.stringify(subscription)
      })
      .eq('id', userId)

    if (error) {
      throw error
    }
  }

  private async removeSubscription(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({
        push_token: null
      })
      .eq('id', userId)

    if (error) {
      console.error('Failed to remove subscription from database:', error)
    }
  }

  async sendNotification(userId: string, title: string, message: string, data?: any): Promise<void> {
    try {
      // Store notification in database
      await this.supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type: 'system',
          metadata: data || {}
        })

      // Send push notification via API
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          title,
          message,
          data
        })
      })
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  async showLocalNotification(title: string, message: string, data?: any): Promise<void> {
    if (!('Notification' in window)) return

    const hasPermission = await this.requestPermission()
    if (!hasPermission) return

    const notification = new Notification(title, {
      body: message,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data,
      tag: 'vtopup-notification'
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
      
      // Handle notification click based on data
      if (data?.url) {
        window.location.href = data.url
      }
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService()
