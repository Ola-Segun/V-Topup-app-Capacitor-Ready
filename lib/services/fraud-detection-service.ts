import { createClient } from '@/lib/supabase/client'
import { pushNotificationService } from './push-notification-service'

interface FraudRule {
  id: string
  name: string
  description: string
  type: 'velocity' | 'amount' | 'pattern' | 'device' | 'location'
  parameters: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
  action: 'flag' | 'block' | 'review'
  isActive: boolean
}

interface FraudAlert {
  id: string
  userId: string
  transactionId?: string
  ruleId: string
  severity: string
  description: string
  metadata: Record<string, any>
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
  createdAt: string
}

interface RiskScore {
  score: number // 0-100
  level: 'low' | 'medium' | 'high' | 'critical'
  factors: Array<{
    factor: string
    impact: number
    description: string
  }>
}

class FraudDetectionService {
  private supabase = createClient()
  private fraudRules: FraudRule[] = []

  constructor() {
    this.loadFraudRules()
  }

  private async loadFraudRules() {
    try {
      const { data: rules } = await this.supabase
        .from('fraud_rules')
        .select('*')
        .eq('is_active', true)

      this.fraudRules = rules || []
    } catch (error) {
      console.error('Failed to load fraud rules:', error)
    }
  }

  async analyzeTransaction(transaction: any, userContext: any): Promise<RiskScore> {
    const riskFactors: Array<{ factor: string; impact: number; description: string }> = []

    // Velocity checks
    const velocityRisk = await this.checkVelocity(transaction, userContext)
    if (velocityRisk.impact > 0) {
      riskFactors.push(velocityRisk)
    }

    // Amount checks
    const amountRisk = await this.checkAmount(transaction, userContext)
    if (amountRisk.impact > 0) {
      riskFactors.push(amountRisk)
    }

    // Pattern checks
    const patternRisk = await this.checkPatterns(transaction, userContext)
    if (patternRisk.impact > 0) {
      riskFactors.push(patternRisk)
    }

    // Device checks
    const deviceRisk = await this.checkDevice(transaction, userContext)
    if (deviceRisk.impact > 0) {
      riskFactors.push(deviceRisk)
    }

    // Location checks
    const locationRisk = await this.checkLocation(transaction, userContext)
    if (locationRisk.impact > 0) {
      riskFactors.push(locationRisk)
    }

    // User behavior checks
    const behaviorRisk = await this.checkUserBehavior(transaction, userContext)
    if (behaviorRisk.impact > 0) {
      riskFactors.push(behaviorRisk)
    }

    // Calculate overall risk score
    const totalImpact = riskFactors.reduce((sum, factor) => sum + factor.impact, 0)
    const score = Math.min(100, totalImpact)

    let level: 'low' | 'medium' | 'high' | 'critical'
    if (score < 25) level = 'low'
    else if (score < 50) level = 'medium'
    else if (score < 75) level = 'high'
    else level = 'critical'

    return {
      score,
      level,
      factors: riskFactors
    }
  }

  private async checkVelocity(transaction: any, userContext: any) {
    const now = new Date()
    const oneHour = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDay = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Get recent transactions
    const { data: recentTransactions } = await this.supabase
      .from('transactions')
      .select('amount, created_at')
      .eq('user_id', transaction.user_id)
      .gte('created_at', oneDay.toISOString())
      .neq('status', 'failed')

    if (!recentTransactions) return { factor: 'velocity', impact: 0, description: 'No velocity risk' }

    const hourlyTransactions = recentTransactions.filter(t => new Date(t.created_at) >= oneHour)
    const dailyTransactions = recentTransactions

    const hourlyCount = hourlyTransactions.length
    const hourlyAmount = hourlyTransactions.reduce((sum, t) => sum + t.amount, 0)
    const dailyCount = dailyTransactions.length
    const dailyAmount = dailyTransactions.reduce((sum, t) => sum + t.amount, 0)

    let impact = 0
    let description = 'Normal velocity'

    // Check hourly limits
    if (hourlyCount > 10) {
      impact += 20
      description = `High transaction frequency: ${hourlyCount} transactions in 1 hour`
    }

    if (hourlyAmount > 100000) { // ₦100,000 per hour
      impact += 25
      description = `High transaction volume: ₦${hourlyAmount.toLocaleString()} in 1 hour`
    }

    // Check daily limits
    if (dailyCount > 50) {
      impact += 15
      description = `Very high daily transaction count: ${dailyCount} transactions`
    }

    if (dailyAmount > 500000) { // ₦500,000 per day
      impact += 20
      description = `Very high daily transaction volume: ₦${dailyAmount.toLocaleString()}`
    }

    return { factor: 'velocity', impact, description }
  }

  private async checkAmount(transaction: any, userContext: any) {
    const amount = transaction.amount
    let impact = 0
    let description = 'Normal amount'

    // Get user's transaction history for baseline
    const { data: historicalTransactions } = await this.supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', transaction.user_id)
      .eq('status', 'completed')
      .limit(100)

    if (historicalTransactions && historicalTransactions.length > 0) {
      const amounts = historicalTransactions.map(t => t.amount)
      const avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length
      const maxAmount = Math.max(...amounts)

      // Check if amount is significantly higher than usual
      if (amount > avgAmount * 5) {
        impact += 30
        description = `Amount significantly higher than average (${(amount / avgAmount).toFixed(1)}x)`
      }

      if (amount > maxAmount * 2) {
        impact += 25
        description = `Amount much higher than previous maximum`
      }
    }

    // Absolute amount checks
    if (amount > 1000000) { // ₦1M
      impact += 40
      description = `Very high transaction amount: ₦${amount.toLocaleString()}`
    } else if (amount > 500000) { // ₦500K
      impact += 25
      description = `High transaction amount: ₦${amount.toLocaleString()}`
    }

    // Round number check (potential money laundering)
    if (amount % 10000 === 0 && amount >= 100000) {
      impact += 10
      description = `Round number transaction: ₦${amount.toLocaleString()}`
    }

    return { factor: 'amount', impact, description }
  }

  private async checkPatterns(transaction: any, userContext: any) {
    let impact = 0
    let description = 'Normal pattern'

    // Get recent transactions for pattern analysis
    const { data: recentTransactions } = await this.supabase
      .from('transactions')
      .select('amount, recipient, transaction_type, created_at')
      .eq('user_id', transaction.user_id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(50)

    if (!recentTransactions) return { factor: 'pattern', impact, description }

    // Check for repeated amounts
    const sameAmountCount = recentTransactions.filter(t => t.amount === transaction.amount).length
    if (sameAmountCount > 5) {
      impact += 20
      description = `Repeated amount pattern: ${sameAmountCount} transactions with same amount`
    }

    // Check for repeated recipients
    const sameRecipientCount = recentTransactions.filter(t => t.recipient === transaction.recipient).length
    if (sameRecipientCount > 10) {
      impact += 15
      description = `High frequency to same recipient: ${sameRecipientCount} transactions`
    }

    // Check for rapid sequential transactions
    const lastTransaction = recentTransactions[0]
    if (lastTransaction) {
      const timeDiff = new Date().getTime() - new Date(lastTransaction.created_at).getTime()
      if (timeDiff < 60000) { // Less than 1 minute
        impact += 25
        description = `Rapid sequential transactions: ${Math.round(timeDiff / 1000)} seconds apart`
      }
    }

    // Check for unusual time patterns
    const hour = new Date().getHours()
    if (hour < 6 || hour > 23) { // Late night/early morning
      impact += 10
      description = `Unusual time pattern: transaction at ${hour}:00`
    }

    return { factor: 'pattern', impact, description }
  }

  private async checkDevice(transaction: any, userContext: any) {
    let impact = 0
    let description = 'Known device'

    const deviceId = userContext.deviceId
    const userAgent = userContext.userAgent
    const ipAddress = userContext.ipAddress

    if (!deviceId) {
      impact += 15
      description = 'Unknown device'
      return { factor: 'device', impact, description }
    }

    // Check if device is trusted
    const { data: device } = await this.supabase
      .from('user_devices')
      .select('is_trusted, last_active_at')
      .eq('user_id', transaction.user_id)
      .eq('device_id', deviceId)
      .single()

    if (!device) {
      impact += 30
      description = 'New/unrecognized device'
    } else if (!device.is_trusted) {
      impact += 20
      description = 'Untrusted device'
    }

    // Check for suspicious user agent
    if (userAgent && (userAgent.includes('bot') || userAgent.includes('crawler'))) {
      impact += 40
      description = 'Suspicious user agent detected'
    }

    return { factor: 'device', impact, description }
  }

  private async checkLocation(transaction: any, userContext: any) {
    let impact = 0
    let description = 'Normal location'

    const currentIP = userContext.ipAddress
    if (!currentIP) return { factor: 'location', impact, description }

    // Get user's recent locations
    const { data: recentDevices } = await this.supabase
      .from('user_devices')
      .select('ip_address, location, last_active_at')
      .eq('user_id', transaction.user_id)
      .order('last_active_at', { ascending: false })
      .limit(10)

    if (!recentDevices || recentDevices.length === 0) {
      return { factor: 'location', impact, description }
    }

    // Check if IP is from a known location
    const knownIPs = recentDevices.map(d => d.ip_address)
    if (!knownIPs.includes(currentIP)) {
      impact += 15
      description = 'New location detected'

      // Additional checks for high-risk locations
      // This would require IP geolocation service
      const locationInfo = await this.getLocationInfo(currentIP)
      if (locationInfo) {
        if (locationInfo.isVPN || locationInfo.isProxy) {
          impact += 25
          description = 'VPN/Proxy detected'
        }

        if (locationInfo.isHighRiskCountry) {
          impact += 20
          description = `Transaction from high-risk country: ${locationInfo.country}`
        }
      }
    }

    return { factor: 'location', impact, description }
  }

  private async checkUserBehavior(transaction: any, userContext: any) {
    let impact = 0
    let description = 'Normal behavior'

    // Check account age
    const { data: user } = await this.supabase
      .from('users')
      .select('created_at, kyc_status, status')
      .eq('id', transaction.user_id)
      .single()

    if (user) {
      const accountAge = Date.now() - new Date(user.created_at).getTime()
      const daysSinceCreation = accountAge / (24 * 60 * 60 * 1000)

      if (daysSinceCreation < 1) {
        impact += 30
        description = 'Very new account (less than 1 day old)'
      } else if (daysSinceCreation < 7) {
        impact += 15
        description = 'New account (less than 1 week old)'
      }

      // Check KYC status
      if (user.kyc_status !== 'verified') {
        impact += 20
        description = 'Unverified account'
      }

      // Check account status
      if (user.status !== 'active') {
        impact += 50
        description = `Account status: ${user.status}`
      }
    }

    return { factor: 'behavior', impact, description }
  }

  private async getLocationInfo(ipAddress: string) {
    try {
      // Use IP geolocation service (e.g., MaxMind, IPinfo)
      const response = await fetch(`https://ipinfo.io/${ipAddress}/json?token=${process.env.IPINFO_TOKEN}`)
      const data = await response.json()

      return {
        country: data.country,
        region: data.region,
        city: data.city,
        isVPN: data.privacy?.vpn || false,
        isProxy: data.privacy?.proxy || false,
        isHighRiskCountry: this.isHighRiskCountry(data.country)
      }
    } catch (error) {
      console.error('Location lookup error:', error)
      return null
    }
  }

  private isHighRiskCountry(countryCode: string): boolean {
    // List of high-risk countries for fraud
    const highRiskCountries = ['CN', 'RU', 'KP', 'IR', 'SY', 'AF']
    return highRiskCountries.includes(countryCode)
  }

  async handleFraudAlert(riskScore: RiskScore, transaction: any, userContext: any) {
    if (riskScore.level === 'low') {
      // Allow transaction to proceed
      return { action: 'allow', message: 'Transaction approved' }
    }

    // Create fraud alert
    const { data: alert } = await this.supabase
      .from('fraud_alerts')
      .insert({
        user_id: transaction.user_id,
        transaction_id: transaction.id,
        severity: riskScore.level,
        description: `Risk score: ${riskScore.score}. Factors: ${riskScore.factors.map(f => f.factor).join(', ')}`,
        metadata: {
          risk_score: riskScore,
          user_context: userContext,
          transaction_data: transaction
        },
        status: 'open'
      })
      .select()
      .single()

    // Take action based on risk level
    switch (riskScore.level) {
      case 'medium':
        // Flag for review but allow transaction
        await this.notifyFraudTeam(alert)
        return { action: 'flag', message: 'Transaction flagged for review' }

      case 'high':
        // Block transaction and require additional verification
        await this.blockTransaction(transaction.id, 'High fraud risk detected')
        await this.notifyFraudTeam(alert)
        await this.notifyUser(transaction.user_id, 'security_alert')
        return { action: 'block', message: 'Transaction blocked due to high fraud risk' }

      case 'critical':
        // Block transaction and freeze account
        await this.blockTransaction(transaction.id, 'Critical fraud risk detected')
        await this.freezeAccount(transaction.user_id, 'Suspected fraudulent activity')
        await this.notifyFraudTeam(alert, true) // Urgent notification
        await this.notifyUser(transaction.user_id, 'account_frozen')
        return { action: 'freeze', message: 'Account frozen due to critical fraud risk' }

      default:
        return { action: 'allow', message: 'Transaction approved' }
    }
  }

  private async blockTransaction(transactionId: string, reason: string) {
    await this.supabase
      .from('transactions')
      .update({
        status: 'blocked',
        failure_reason: reason,
        blocked_at: new Date().toISOString()
      })
      .eq('id', transactionId)
  }

  private async freezeAccount(userId: string, reason: string) {
    await this.supabase
      .from('users')
      .update({
        status: 'frozen',
        frozen_reason: reason,
        frozen_at: new Date().toISOString()
      })
      .eq('id', userId)
  }

  private async notifyFraudTeam(alert: any, urgent: boolean = false) {
    // Send notification to fraud team
    await this.supabase
      .from('system_alerts')
      .insert({
        type: 'warning',
        severity: urgent ? 'critical' : 'high',
        title: urgent ? 'URGENT: Critical Fraud Alert' : 'Fraud Alert',
        message: `Fraud detected for user ${alert.user_id}. Risk level: ${alert.severity}`,
        source: 'fraud_detection',
        metadata: { fraud_alert_id: alert.id }
      })

    // Send email to fraud team
    // await emailService.sendFraudAlert(alert)
  }

  private async notifyUser(userId: string, alertType: string) {
    let title: string
    let message: string

    switch (alertType) {
      case 'security_alert':
        title = 'Security Alert'
        message = 'We detected unusual activity on your account. Your transaction has been flagged for review.'
        break
      case 'account_frozen':
        title = 'Account Temporarily Frozen'
        message = 'Your account has been temporarily frozen due to suspicious activity. Please contact support.'
        break
      default:
        title = 'Security Notification'
        message = 'We detected unusual activity on your account.'
    }

    await pushNotificationService.sendNotification(
      userId,
      title,
      message,
      {
        type: 'fraud_alert',
        alert_type: alertType,
        priority: 'high'
      }
    )
  }

  async investigateFraudAlert(alertId: string, investigatorId: string, notes: string) {
    await this.supabase
      .from('fraud_alerts')
      .update({
        status: 'investigating',
        investigated_by: investigatorId,
        investigation_notes: notes,
        investigated_at: new Date().toISOString()
      })
      .eq('id', alertId)
  }

  async resolveFraudAlert(alertId: string, resolution: 'resolved' | 'false_positive', notes: string) {
    await this.supabase
      .from('fraud_alerts')
      .update({
        status: resolution,
        resolution_notes: notes,
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId)

    // If false positive, unfreeze account if it was frozen
    if (resolution === 'false_positive') {
      const { data: alert } = await this.supabase
        .from('fraud_alerts')
        .select('user_id')
        .eq('id', alertId)
        .single()

      if (alert) {
        await this.supabase
          .from('users')
          .update({
            status: 'active',
            frozen_reason: null,
            frozen_at: null
          })
          .eq('id', alert.user_id)
          .eq('status', 'frozen')
      }
    }
  }

  async getFraudAlerts(filters: {
    status?: string
    severity?: string
    userId?: string
    limit?: number
    offset?: number
  } = {}) {
    let query = this.supabase
      .from('fraud_alerts')
      .select('*, users(first_name, last_name, email)')
      .order('created_at', { ascending: false })

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.severity) {
      query = query.eq('severity', filters.severity)
    }

    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    if (filters.offset) {
      query = query.range(filters.offset, (filters.offset || 0) + (filters.limit || 50) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return data
  }
}

export const fraudDetectionService = new FraudDetectionService()
