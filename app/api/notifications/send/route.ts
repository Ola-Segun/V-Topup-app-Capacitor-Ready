import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import webpush from 'web-push'

// Configure web-push (you'll need to set these environment variables)
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, title, message, data } = body

    // Get user's push subscription
    const { data: userData } = await supabase
      .from('users')
      .select('push_token')
      .eq('id', userId)
      .single()

    if (!userData?.push_token) {
      return NextResponse.json({ error: 'No push subscription found' }, { status: 400 })
    }

    const subscription = JSON.parse(userData.push_token)
    
    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      data: data || {}
    })

    try {
      await webpush.sendNotification(subscription, payload)
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Failed to send push notification:', error)
      
      // If subscription is invalid, remove it
      if (error.statusCode === 410) {
        await supabase
          .from('users')
          .update({ push_token: null })
          .eq('id', userId)
      }
      
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
