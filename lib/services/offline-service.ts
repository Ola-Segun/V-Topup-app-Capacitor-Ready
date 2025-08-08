import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'

type OfflineAction = Database['public']['Tables']['offline_queue']['Row']

export class OfflineService {
  private supabase = createClient()
  private isOnline = true
  private syncInProgress = false

  constructor() {
    this.setupNetworkListeners()
    this.startPeriodicSync()
  }

  private setupNetworkListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.syncOfflineActions()
      })

      window.addEventListener('offline', () => {
        this.isOnline = false
      })

      this.isOnline = navigator.onLine
    }
  }

  private startPeriodicSync(): void {
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncOfflineActions()
      }
    }, 30000) // Sync every 30 seconds
  }

  async queueAction(userId: string, actionType: string, payload: any): Promise<void> {
    const action = {
      user_id: userId,
      action_type: actionType,
      payload,
      retry_count: 0
    }

    if (this.isOnline) {
      // Try to execute immediately if online
      try {
        await this.executeAction(action)
        return
      } catch (error) {
        // If immediate execution fails, queue it
        console.warn('Immediate execution failed, queuing action:', error)
      }
    }

    // Store in offline queue
    await this.storeOfflineAction(action)
  }

  private async storeOfflineAction(action: Omit<OfflineAction, 'id' | 'created_at' | 'last_retry'>): Promise<void> {
    // Store in IndexedDB for offline persistence
    if ('indexedDB' in window) {
      const db = await this.openIndexedDB()
      const transaction = db.transaction(['offline_queue'], 'readwrite')
      const store = transaction.objectStore('offline_queue')
      
      await store.add({
        ...action,
        id: `offline_${Date.now()}_${Math.random()}`,
        created_at: new Date().toISOString(),
        last_retry: null
      })
    }

    // Also try to store in Supabase if online
    if (this.isOnline) {
      try {
        await this.supabase
          .from('offline_queue')
          .insert(action)
      } catch (error) {
        console.warn('Failed to store in Supabase queue:', error)
      }
    }
  }

  async syncOfflineActions(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) return

    this.syncInProgress = true

    try {
      // Get actions from IndexedDB
      const offlineActions = await this.getOfflineActions()
      
      for (const action of offlineActions) {
        try {
          await this.executeAction(action)
          await this.removeOfflineAction(action.id)
        } catch (error) {
          console.error('Failed to sync action:', error)
          await this.incrementRetryCount(action.id)
        }
      }

      // Sync with Supabase queue
      await this.syncSupabaseQueue()
    } finally {
      this.syncInProgress = false
    }
  }

  private async executeAction(action: any): Promise<void> {
    switch (action.action_type) {
      case 'airtime_topup':
        await this.executeAirtimeTopup(action.payload)
        break
      case 'data_topup':
        await this.executeDataTopup(action.payload)
        break
      case 'wallet_funding':
        await this.executeWalletFunding(action.payload)
        break
      default:
        throw new Error(`Unknown action type: ${action.action_type}`)
    }
  }

  private async executeAirtimeTopup(payload: any): Promise<void> {
    const response = await fetch('/api/services/airtime', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Airtime topup failed')
    }
  }

  private async executeDataTopup(payload: any): Promise<void> {
    const response = await fetch('/api/services/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Data topup failed')
    }
  }

  private async executeWalletFunding(payload: any): Promise<void> {
    const response = await fetch('/api/wallet/fund', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Wallet funding failed')
    }
  }

  private async openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('VTopupDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains('offline_queue')) {
          const store = db.createObjectStore('offline_queue', { keyPath: 'id' })
          store.createIndex('user_id', 'user_id', { unique: false })
          store.createIndex('created_at', 'created_at', { unique: false })
        }

        if (!db.objectStoreNames.contains('cached_data')) {
          const cacheStore = db.createObjectStore('cached_data', { keyPath: 'key' })
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false })
        }
      }
    })
  }

  private async getOfflineActions(): Promise<OfflineAction[]> {
    if (!('indexedDB' in window)) return []

    const db = await this.openIndexedDB()
    const transaction = db.transaction(['offline_queue'], 'readonly')
    const store = transaction.objectStore('offline_queue')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  private async removeOfflineAction(id: string): Promise<void> {
    if (!('indexedDB' in window)) return

    const db = await this.openIndexedDB()
    const transaction = db.transaction(['offline_queue'], 'readwrite')
    const store = transaction.objectStore('offline_queue')
    
    await store.delete(id)
  }

  private async incrementRetryCount(id: string): Promise<void> {
    if (!('indexedDB' in window)) return

    const db = await this.openIndexedDB()
    const transaction = db.transaction(['offline_queue'], 'readwrite')
    const store = transaction.objectStore('offline_queue')
    
    const action = await store.get(id)
    if (action) {
      action.retry_count += 1
      action.last_retry = new Date().toISOString()
      
      // Remove action if retry count exceeds limit
      if (action.retry_count > 5) {
        await store.delete(id)
      } else {
        await store.put(action)
      }
    }
  }

  private async syncSupabaseQueue(): Promise<void> {
    try {
      const { data: queuedActions } = await this.supabase
        .from('offline_queue')
        .select('*')
        .order('created_at', { ascending: true })

      if (queuedActions) {
        for (const action of queuedActions) {
          try {
            await this.executeAction(action)
            await this.supabase
              .from('offline_queue')
              .delete()
              .eq('id', action.id)
          } catch (error) {
            console.error('Failed to sync Supabase queue action:', error)
          }
        }
      }
    } catch (error) {
      console.error('Failed to sync Supabase queue:', error)
    }
  }

  // Cache management methods
  async cacheData(key: string, data: any, ttl = 3600000): Promise<void> { // 1 hour default TTL
    if (!('indexedDB' in window)) return

    const db = await this.openIndexedDB()
    const transaction = db.transaction(['cached_data'], 'readwrite')
    const store = transaction.objectStore('cached_data')
    
    await store.put({
      key,
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  async getCachedData(key: string): Promise<any> {
    if (!('indexedDB' in window)) return null

    const db = await this.openIndexedDB()
    const transaction = db.transaction(['cached_data'], 'readonly')
    const store = transaction.objectStore('cached_data')
    
    const cached = await store.get(key)
    
    if (!cached) return null
    
    // Check if cache is expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      await this.removeCachedData(key)
      return null
    }
    
    return cached.data
  }

  private async removeCachedData(key: string): Promise<void> {
    if (!('indexedDB' in window)) return

    const db = await this.openIndexedDB()
    const transaction = db.transaction(['cached_data'], 'readwrite')
    const store = transaction.objectStore('cached_data')
    
    await store.delete(key)
  }

  getNetworkStatus(): boolean {
    return this.isOnline
  }
}

// Export singleton instance
export const offlineService = new OfflineService()
