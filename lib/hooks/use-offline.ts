import { useState, useEffect } from 'react'
import { offlineService } from '@/lib/services/offline-service'

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [queuedActions, setQueuedActions] = useState(0)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Initial status
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const queueAction = async (actionType: string, payload: any) => {
    await offlineService.queueAction('user-id', actionType, payload)
    setQueuedActions(prev => prev + 1)
  }

  const syncActions = async () => {
    await offlineService.syncOfflineActions()
    setQueuedActions(0)
  }

  return {
    isOnline,
    queuedActions,
    queueAction,
    syncActions
  }
}
