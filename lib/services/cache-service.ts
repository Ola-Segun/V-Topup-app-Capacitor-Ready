interface CacheItem {
  value: any
  expiry: number
  tags?: string[]
}

interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[]
}

class CacheService {
  private memoryCache = new Map<string, CacheItem>()
  private defaultTTL = 300 // 5 minutes

  // Set cache item
  set(key: string, value: any, options: CacheOptions = {}) {
    const ttl = options.ttl || this.defaultTTL
    const expiry = Date.now() + (ttl * 1000)
    
    this.memoryCache.set(key, {
      value,
      expiry,
      tags: options.tags
    })

    // Also store in localStorage for persistence (client-side only)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify({
          value,
          expiry,
          tags: options.tags
        }))
      } catch (error) {
        console.warn('Failed to store in localStorage:', error)
      }
    }

    return true
  }

  // Get cache item
  get(key: string) {
    // Check memory cache first
    const memoryItem = this.memoryCache.get(key)
    if (memoryItem) {
      if (Date.now() < memoryItem.expiry) {
        return memoryItem.value
      } else {
        this.memoryCache.delete(key)
      }
    }

    // Check localStorage (client-side only)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`cache_${key}`)
        if (stored) {
          const item: CacheItem = JSON.parse(stored)
          if (Date.now() < item.expiry) {
            // Restore to memory cache
            this.memoryCache.set(key, item)
            return item.value
          } else {
            localStorage.removeItem(`cache_${key}`)
          }
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error)
      }
    }

    return null
  }

  // Delete cache item
  delete(key: string) {
    this.memoryCache.delete(key)
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`cache_${key}`)
    }
    
    return true
  }

  // Clear cache by tags
  clearByTags(tags: string[]) {
    const keysToDelete: string[] = []

    // Clear from memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.tags && item.tags.some(tag => tags.includes(tag))) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach(key => {
      this.memoryCache.delete(key)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`cache_${key}`)
      }
    })

    return keysToDelete.length
  }

  // Clear all cache
  clear() {
    this.memoryCache.clear()
    
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'))
      keys.forEach(key => localStorage.removeItem(key))
    }
    
    return true
  }

  // Get cache statistics
  getStats() {
    const memorySize = this.memoryCache.size
    let localStorageSize = 0

    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'))
      localStorageSize = keys.length
    }

    return {
      memorySize,
      localStorageSize,
      totalSize: memorySize + localStorageSize
    }
  }

  // Cache with automatic refresh
  async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    const cached = this.get(key)
    if (cached !== null) {
      return cached
    }

    try {
      const value = await fetcher()
      this.set(key, value, options)
      return value
    } catch (error) {
      console.error(`Cache fetcher failed for key ${key}:`, error)
      throw error
    }
  }

  // Warm cache with predefined data
  warmCache(data: Record<string, { value: any; options?: CacheOptions }>) {
    Object.entries(data).forEach(([key, { value, options }]) => {
      this.set(key, value, options)
    })
  }

  // Cache user data
  cacheUserData(userId: string, userData: any, ttl = 600) {
    return this.set(`user_${userId}`, userData, { 
      ttl, 
      tags: ['user', `user_${userId}`] 
    })
  }

  // Cache transaction data
  cacheTransactionData(transactionId: string, transactionData: any, ttl = 300) {
    return this.set(`transaction_${transactionId}`, transactionData, { 
      ttl, 
      tags: ['transaction', `transaction_${transactionId}`] 
    })
  }

  // Cache service data (airtime, data plans, etc.)
  cacheServiceData(serviceType: string, data: any, ttl = 1800) {
    return this.set(`service_${serviceType}`, data, { 
      ttl, 
      tags: ['service', serviceType] 
    })
  }

  // Cache wallet balance
  cacheWalletBalance(userId: string, balance: number, ttl = 60) {
    return this.set(`wallet_${userId}`, balance, { 
      ttl, 
      tags: ['wallet', `user_${userId}`] 
    })
  }

  // Invalidate user-related cache
  invalidateUserCache(userId: string) {
    return this.clearByTags([`user_${userId}`])
  }

  // Invalidate service cache
  invalidateServiceCache(serviceType?: string) {
    const tags = serviceType ? [serviceType] : ['service']
    return this.clearByTags(tags)
  }

  // Auto cleanup expired items
  cleanup() {
    const now = Date.now()
    const expiredKeys: string[] = []

    for (const [key, item] of this.memoryCache.entries()) {
      if (now >= item.expiry) {
        expiredKeys.push(key)
      }
    }

    expiredKeys.forEach(key => {
      this.memoryCache.delete(key)
    })

    // Cleanup localStorage
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'))
      keys.forEach(key => {
        try {
          const stored = localStorage.getItem(key)
          if (stored) {
            const item: CacheItem = JSON.parse(stored)
            if (now >= item.expiry) {
              localStorage.removeItem(key)
            }
          }
        } catch (error) {
          localStorage.removeItem(key)
        }
      })
    }

    return expiredKeys.length
  }

  // Start auto cleanup interval
  startAutoCleanup(intervalMs = 60000) { // 1 minute
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.cleanup()
      }, intervalMs)
    }
  }
}

export const cacheService = new CacheService()

// Start auto cleanup on client side
if (typeof window !== 'undefined') {
  cacheService.startAutoCleanup()
}
