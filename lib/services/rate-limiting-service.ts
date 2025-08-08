import { createClient } from '@/lib/supabase/client'

interface RateLimit {
  key: string
  limit: number
  window: number // in seconds
  current: number
  resetTime: number
}

interface RateLimitRule {
  id: string
  name: string
  pattern: string // API endpoint pattern
  limit: number
  window: number
  scope: 'ip' | 'user' | 'global'
  isActive: boolean
}

class RateLimitingService {
  private supabase = createClient()
  private cache = new Map<string, RateLimit>()
  private rules: RateLimitRule[] = []

  constructor() {
    this.loadRules()
    this.startCleanupInterval()
  }

  private async loadRules() {
    try {
      const { data: rules } = await this.supabase
        .from('rate_limit_rules')
        .select('*')
        .eq('is_active', true)

      this.rules = rules || [
        // Default rules
        {
          id: 'auth_login',
          name: 'Login attempts',
          pattern: '/api/auth/login',
          limit: 5,
          window: 900, // 15 minutes
          scope: 'ip',
          isActive: true
        },
        {
          id: 'auth_register',
          name: 'Registration attempts',
          pattern: '/api/auth/register',
          limit: 3,
          window: 3600, // 1 hour
          scope: 'ip',
          isActive: true
        },
        {
          id: 'transaction_create',
          name: 'Transaction creation',
          pattern: '/api/services/*',
          limit: 10,
          window: 60, // 1 minute
          scope: 'user',
          isActive: true
        },
        {
          id: 'wallet_fund',
          name: 'Wallet funding',
          pattern: '/api/wallet/fund',
          limit: 5,
          window: 300, // 5 minutes
          scope: 'user',
          isActive: true
        },
        {
          id: 'password_reset',
          name: 'Password reset requests',
          pattern: '/api/auth/forgot-password',
          limit: 3,
          window: 3600, // 1 hour
          scope: 'ip',
          isActive: true
        },
        {
          id: 'otp_request',
          name: 'OTP requests',
          pattern: '/api/auth/send-otp',
          limit: 5,
          window: 300, // 5 minutes
          scope: 'user',
          isActive: true
        }
      ]
    } catch (error) {
      console.error('Failed to load rate limit rules:', error)
    }
  }

  private startCleanupInterval() {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanupExpiredEntries()
    }, 300000)
  }

  private cleanupExpiredEntries() {
    const now = Date.now()
    for (const [key, limit] of this.cache.entries()) {
      if (now > limit.resetTime) {
        this.cache.delete(key)
      }
    }
  }

  async checkRateLimit(
    endpoint: string,
    identifier: string,
    scope: 'ip' | 'user' | 'global'
  ): Promise<{
    allowed: boolean
    limit: number
    remaining: number
    resetTime: number
    retryAfter?: number
  }> {
    // Find matching rule
    const rule = this.findMatchingRule(endpoint, scope)
    if (!rule) {
      // No rate limit rule found, allow request
      return {
        allowed: true,
        limit: Infinity,
        remaining: Infinity,
        resetTime: 0
      }
    }

    const key = `${rule.id}:${identifier}`
    const now = Date.now()
    
    let rateLimit = this.cache.get(key)

    if (!rateLimit || now > rateLimit.resetTime) {
      // Create new rate limit entry
      rateLimit = {
        key,
        limit: rule.limit,
        window: rule.window,
        current: 0,
        resetTime: now + (rule.window * 1000)
      }
    }

    // Check if limit exceeded
    if (rateLimit.current >= rateLimit.limit) {
      const retryAfter = Math.ceil((rateLimit.resetTime - now) / 1000)
      
      // Log rate limit violation
      await this.logRateLimitViolation(rule, identifier, endpoint)
      
      return {
        allowed: false,
        limit: rateLimit.limit,
        remaining: 0,
        resetTime: rateLimit.resetTime,
        retryAfter
      }
    }

    // Increment counter
    rateLimit.current++
    this.cache.set(key, rateLimit)

    // Store in database for persistence
    await this.persistRateLimit(rateLimit)

    return {
      allowed: true,
      limit: rateLimit.limit,
      remaining: rateLimit.limit - rateLimit.current,
      resetTime: rateLimit.resetTime
    }
  }

  private findMatchingRule(endpoint: string, scope: 'ip' | 'user' | 'global'): RateLimitRule | null {
    return this.rules.find(rule => {
      if (rule.scope !== scope) return false
      
      // Simple pattern matching
      if (rule.pattern.includes('*')) {
        const pattern = rule.pattern.replace('*', '.*')
        const regex = new RegExp(`^${pattern}$`)
        return regex.test(endpoint)
      }
      
      return rule.pattern === endpoint
    }) || null
  }

  private async persistRateLimit(rateLimit: RateLimit) {
    try {
      await this.supabase
        .from('rate_limits')
        .upsert({
          key: rateLimit.key,
          current_count: rateLimit.current,
          limit_value: rateLimit.limit,
          window_seconds: rateLimit.window,
          reset_time: new Date(rateLimit.resetTime).toISOString(),
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      // Don't fail the request if we can't persist
      console.error('Failed to persist rate limit:', error)
    }
  }

  private async logRateLimitViolation(rule: RateLimitRule, identifier: string, endpoint: string) {
    try {
      await this.supabase
        .from('rate_limit_violations')
        .insert({
          rule_id: rule.id,
          identifier,
          endpoint,
          limit_value: rule.limit,
          window_seconds: rule.window,
          scope: rule.scope,
          violated_at: new Date().toISOString()
        })

      // Create system alert for repeated violations
      const recentViolations = await this.getRecentViolations(identifier, 3600) // Last hour
      if (recentViolations >= 5) {
        await this.supabase
          .from('system_alerts')
          .insert({
            type: 'warning',
            severity: 'medium',
            title: 'Repeated Rate Limit Violations',
            message: `Identifier ${identifier} has violated rate limits ${recentViolations} times in the last hour`,
            source: 'rate_limiting',
            metadata: {
              identifier,
              violation_count: recentViolations,
              rule_id: rule.id
            }
          })
      }
    } catch (error) {
      console.error('Failed to log rate limit violation:', error)
    }
  }

  private async getRecentViolations(identifier: string, timeWindow: number): Promise<number> {
    try {
      const since = new Date(Date.now() - timeWindow * 1000).toISOString()
      
      const { count } = await this.supabase
        .from('rate_limit_violations')
        .select('*', { count: 'exact', head: true })
        .eq('identifier', identifier)
        .gte('violated_at', since)

      return count || 0
    } catch (error) {
      console.error('Failed to get recent violations:', error)
      return 0
    }
  }

  async createRule(rule: Omit<RateLimitRule, 'id'>): Promise<RateLimitRule> {
    const newRule: RateLimitRule = {
      ...rule,
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    await this.supabase
      .from('rate_limit_rules')
      .insert(newRule)

    this.rules.push(newRule)
    return newRule
  }

  async updateRule(ruleId: string, updates: Partial<RateLimitRule>): Promise<void> {
    await this.supabase
      .from('rate_limit_rules')
      .update(updates)
      .eq('id', ruleId)

    const ruleIndex = this.rules.findIndex(r => r.id === ruleId)
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates }
    }
  }

  async deleteRule(ruleId: string): Promise<void> {
    await this.supabase
      .from('rate_limit_rules')
      .delete()
      .eq('id', ruleId)

    this.rules = this.rules.filter(r => r.id !== ruleId)
  }

  async getRules(): Promise<RateLimitRule[]> {
    return this.rules
  }

  async getViolations(filters: {
    identifier?: string
    ruleId?: string
    since?: string
    limit?: number
  } = {}): Promise<any[]> {
    let query = this.supabase
      .from('rate_limit_violations')
      .select('*, rate_limit_rules(name)')
      .order('violated_at', { ascending: false })

    if (filters.identifier) {
      query = query.eq('identifier', filters.identifier)
    }

    if (filters.ruleId) {
      query = query.eq('rule_id', filters.ruleId)
    }

    if (filters.since) {
      query = query.gte('violated_at', filters.since)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data || []
  }

  async resetRateLimit(key: string): Promise<void> {
    this.cache.delete(key)
    
    await this.supabase
      .from('rate_limits')
      .delete()
      .eq('key', key)
  }

  async resetAllRateLimits(): Promise<void> {
    this.cache.clear()
    
    await this.supabase
      .from('rate_limits')
      .delete()
      .neq('id', 0) // Delete all records
  }

  // Middleware function for Express/Next.js
  middleware() {
    return async (req: any, res: any, next: any) => {
      try {
        const endpoint = req.url || req.path
        const ip = req.ip || req.connection.remoteAddress
        const userId = req.user?.id
        
        // Check IP-based rate limits
        const ipResult = await this.checkRateLimit(endpoint, ip, 'ip')
        if (!ipResult.allowed) {
          return res.status(429).json({
            error: 'Too many requests from this IP',
            retryAfter: ipResult.retryAfter
          })
        }

        // Check user-based rate limits if user is authenticated
        if (userId) {
          const userResult = await this.checkRateLimit(endpoint, userId, 'user')
          if (!userResult.allowed) {
            return res.status(429).json({
              error: 'Too many requests from this user',
              retryAfter: userResult.retryAfter
            })
          }

          // Set user rate limit headers
          res.set({
            'X-RateLimit-Limit-User': userResult.limit.toString(),
            'X-RateLimit-Remaining-User': userResult.remaining.toString(),
            'X-RateLimit-Reset-User': new Date(userResult.resetTime).toISOString()
          })
        }

        // Set IP rate limit headers
        res.set({
          'X-RateLimit-Limit-IP': ipResult.limit.toString(),
          'X-RateLimit-Remaining-IP': ipResult.remaining.toString(),
          'X-RateLimit-Reset-IP': new Date(ipResult.resetTime).toISOString()
        })

        next()
      } catch (error) {
        console.error('Rate limiting middleware error:', error)
        // Don't block requests if rate limiting fails
        next()
      }
    }
  }

  // Get current rate limit status for a key
  async getStatus(key: string): Promise<RateLimit | null> {
    const cached = this.cache.get(key)
    if (cached && Date.now() <= cached.resetTime) {
      return cached
    }

    // Try to get from database
    try {
      const { data } = await this.supabase
        .from('rate_limits')
        .select('*')
        .eq('key', key)
        .single()

      if (data && new Date(data.reset_time).getTime() > Date.now()) {
        const rateLimit: RateLimit = {
          key: data.key,
          limit: data.limit_value,
          window: data.window_seconds,
          current: data.current_count,
          resetTime: new Date(data.reset_time).getTime()
        }

        this.cache.set(key, rateLimit)
        return rateLimit
      }
    } catch (error) {
      console.error('Failed to get rate limit status:', error)
    }

    return null
  }
}

export const rateLimitingService = new RateLimitingService()
