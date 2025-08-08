import { createClient } from '@/lib/supabase/client'

interface AnalyticsEvent {
  event_name: string
  user_id?: string
  properties?: Record<string, any>
  timestamp?: string
}

interface UserProperties {
  user_id: string
  properties: Record<string, any>
}

class AnalyticsService {
  private supabase = createClient()

  // Track events locally and to external services
  async trackEvent(event: AnalyticsEvent) {
    try {
      // Store in Supabase
      await this.supabase
        .from('analytics_events')
        .insert({
          event_name: event.event_name,
          user_id: event.user_id,
          properties: event.properties || {},
          timestamp: event.timestamp || new Date().toISOString()
        })

      // Send to external analytics services
      await Promise.allSettled([
        this.sendToGoogleAnalytics(event),
        this.sendToMixpanel(event),
        this.sendToDataDog(event)
      ])

      return { success: true }
    } catch (error) {
      console.error('Analytics tracking failed:', error)
      return { success: false, error }
    }
  }

  // Google Analytics 4
  private async sendToGoogleAnalytics(event: AnalyticsEvent) {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return

    try {
      // @ts-ignore
      if (window.gtag) {
        // @ts-ignore
        window.gtag('event', event.event_name, {
          user_id: event.user_id,
          ...event.properties
        })
      }
    } catch (error) {
      console.error('Google Analytics error:', error)
    }
  }

  // Mixpanel
  private async sendToMixpanel(event: AnalyticsEvent) {
    if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) return

    try {
      const response = await fetch('https://api.mixpanel.com/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: event.event_name,
          properties: {
            token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
            distinct_id: event.user_id,
            ...event.properties
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Mixpanel API error: ${response.status}`)
      }
    } catch (error) {
      console.error('Mixpanel error:', error)
    }
  }

  // DataDog
  private async sendToDataDog(event: AnalyticsEvent) {
    if (!process.env.DATADOG_API_KEY) return

    try {
      await fetch('https://api.datadoghq.com/api/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': process.env.DATADOG_API_KEY
        },
        body: JSON.stringify({
          title: event.event_name,
          text: `User ${event.user_id} performed ${event.event_name}`,
          tags: Object.entries(event.properties || {}).map(([k, v]) => `${k}:${v}`)
        })
      })
    } catch (error) {
      console.error('DataDog error:', error)
    }
  }

  // Track user properties
  async identifyUser(userProps: UserProperties) {
    try {
      await this.supabase
        .from('user_analytics')
        .upsert({
          user_id: userProps.user_id,
          properties: userProps.properties,
          updated_at: new Date().toISOString()
        })

      // Send to external services
      if (typeof window !== 'undefined') {
        // @ts-ignore
        if (window.gtag) {
          // @ts-ignore
          window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
            user_id: userProps.user_id,
            custom_map: userProps.properties
          })
        }

        // Mixpanel identify
        if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
          fetch('https://api.mixpanel.com/engage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              $token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
              $distinct_id: userProps.user_id,
              $set: userProps.properties
            })
          }).catch(console.error)
        }
      }

      return { success: true }
    } catch (error) {
      console.error('User identification failed:', error)
      return { success: false, error }
    }
  }

  // Get analytics data
  async getAnalytics(userId?: string, startDate?: string, endDate?: string) {
    try {
      let query = this.supabase
        .from('analytics_events')
        .select('*')
        .order('timestamp', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      if (startDate) {
        query = query.gte('timestamp', startDate)
      }

      if (endDate) {
        query = query.lte('timestamp', endDate)
      }

      const { data, error } = await query.limit(1000)

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Analytics fetch failed:', error)
      return { success: false, error }
    }
  }

  // Track page views
  async trackPageView(path: string, userId?: string) {
    return this.trackEvent({
      event_name: 'page_view',
      user_id: userId,
      properties: {
        path,
        referrer: typeof window !== 'undefined' ? document.referrer : '',
        user_agent: typeof window !== 'undefined' ? navigator.userAgent : ''
      }
    })
  }

  // Track transactions
  async trackTransaction(transactionData: any) {
    return this.trackEvent({
      event_name: 'transaction_completed',
      user_id: transactionData.user_id,
      properties: {
        transaction_id: transactionData.id,
        amount: transactionData.amount,
        service_type: transactionData.service_type,
        status: transactionData.status,
        payment_method: transactionData.payment_method
      }
    })
  }
}

export const analyticsService = new AnalyticsService()
