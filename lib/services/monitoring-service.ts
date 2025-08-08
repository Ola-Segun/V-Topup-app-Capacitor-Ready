import { createClient } from '@/lib/supabase/client'

interface SystemMetrics {
  timestamp: string
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  active_connections: number
  response_time: number
  error_rate: number
  transaction_volume: number
  success_rate: number
}

interface PerformanceAlert {
  id: string
  metric: string
  threshold: number
  current_value: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  created_at: string
  resolved_at?: string
}

class MonitoringService {
  private supabase = createClient()
  private metrics: SystemMetrics[] = []
  private alerts: PerformanceAlert[] = []
  private isMonitoring = false
  private monitoringInterval?: NodeJS.Timeout

  // Performance thresholds
  private thresholds = {
    cpu_usage: { warning: 70, critical: 90 },
    memory_usage: { warning: 80, critical: 95 },
    disk_usage: { warning: 85, critical: 95 },
    response_time: { warning: 2000, critical: 5000 }, // milliseconds
    error_rate: { warning: 5, critical: 10 }, // percentage
    success_rate: { warning: 95, critical: 90 } // percentage (below threshold is bad)
  }

  async startMonitoring() {
    if (this.isMonitoring) return

    this.isMonitoring = true
    console.log('Starting system monitoring...')

    // Collect metrics every minute
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.collectMetrics()
        await this.checkThresholds()
        await this.cleanupOldMetrics()
      } catch (error) {
        console.error('Monitoring error:', error)
      }
    }, 60000) // Every minute

    // Initial collection
    await this.collectMetrics()
  }

  async stopMonitoring() {
    if (!this.isMonitoring) return

    this.isMonitoring = false
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }
    console.log('System monitoring stopped')
  }

  private async collectMetrics() {
    const timestamp = new Date().toISOString()

    // Collect system metrics
    const systemMetrics = await this.getSystemMetrics()
    
    // Collect application metrics
    const appMetrics = await this.getApplicationMetrics()

    // Combine metrics
    const metrics: SystemMetrics = {
      timestamp,
      ...systemMetrics,
      ...appMetrics
    }

    // Store metrics
    await this.storeMetrics(metrics)
    
    // Keep in memory for quick access
    this.metrics.push(metrics)
    if (this.metrics.length > 1440) { // Keep 24 hours of minute-by-minute data
      this.metrics.shift()
    }
  }

  private async getSystemMetrics() {
    try {
      // In a real implementation, you would collect actual system metrics
      // For now, we'll simulate some metrics
      return {
        cpu_usage: Math.random() * 100,
        memory_usage: Math.random() * 100,
        disk_usage: Math.random() * 100,
        active_connections: Math.floor(Math.random() * 1000) + 100
      }
    } catch (error) {
      console.error('Failed to collect system metrics:', error)
      return {
        cpu_usage: 0,
        memory_usage: 0,
        disk_usage: 0,
        active_connections: 0
      }
    }
  }

  private async getApplicationMetrics() {
    try {
      const now = new Date()
      const oneMinuteAgo = new Date(now.getTime() - 60000)

      // Get transaction metrics from the last minute
      const { data: transactions } = await this.supabase
        .from('transactions')
        .select('status, created_at')
        .gte('created_at', oneMinuteAgo.toISOString())
        .lt('created_at', now.toISOString())

      const totalTransactions = transactions?.length || 0
      const successfulTransactions = transactions?.filter(t => t.status === 'completed').length || 0
      const failedTransactions = transactions?.filter(t => t.status === 'failed').length || 0

      const success_rate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 100
      const error_rate = totalTransactions > 0 ? (failedTransactions / totalTransactions) * 100 : 0

      // Simulate response time (in a real app, you'd measure actual response times)
      const response_time = Math.random() * 3000 + 100

      return {
        response_time,
        error_rate,
        transaction_volume: totalTransactions,
        success_rate
      }
    } catch (error) {
      console.error('Failed to collect application metrics:', error)
      return {
        response_time: 0,
        error_rate: 0,
        transaction_volume: 0,
        success_rate: 100
      }
    }
  }

  private async storeMetrics(metrics: SystemMetrics) {
    try {
      await this.supabase
        .from('system_metrics')
        .insert(metrics)
    } catch (error) {
      console.error('Failed to store metrics:', error)
    }
  }

  private async checkThresholds() {
    if (this.metrics.length === 0) return

    const latestMetrics = this.metrics[this.metrics.length - 1]

    // Check each metric against thresholds
    for (const [metric, value] of Object.entries(latestMetrics)) {
      if (metric === 'timestamp') continue

      const threshold = this.thresholds[metric as keyof typeof this.thresholds]
      if (!threshold) continue

      let severity: 'low' | 'medium' | 'high' | 'critical' | null = null
      let message = ''

      if (metric === 'success_rate') {
        // For success rate, lower values are worse
        if (value < threshold.critical) {
          severity = 'critical'
          message = `Success rate critically low: ${value.toFixed(2)}%`
        } else if (value < threshold.warning) {
          severity = 'high'
          message = `Success rate below warning threshold: ${value.toFixed(2)}%`
        }
      } else {
        // For other metrics, higher values are worse
        if (value > threshold.critical) {
          severity = 'critical'
          message = `${metric.replace('_', ' ')} critically high: ${value.toFixed(2)}${this.getUnit(metric)}`
        } else if (value > threshold.warning) {
          severity = 'high'
          message = `${metric.replace('_', ' ')} above warning threshold: ${value.toFixed(2)}${this.getUnit(metric)}`
        }
      }

      if (severity) {
        await this.createAlert(metric, threshold.critical, value, severity, message)
      }
    }
  }

  private getUnit(metric: string): string {
    switch (metric) {
      case 'cpu_usage':
      case 'memory_usage':
      case 'disk_usage':
      case 'error_rate':
      case 'success_rate':
        return '%'
      case 'response_time':
        return 'ms'
      default:
        return ''
    }
  }

  private async createAlert(
    metric: string,
    threshold: number,
    currentValue: number,
    severity: 'low' | 'medium' | 'high' | 'critical',
    message: string
  ) {
    // Check if we already have an active alert for this metric
    const existingAlert = this.alerts.find(
      alert => alert.metric === metric && !alert.resolved_at
    )

    if (existingAlert) {
      // Update existing alert
      existingAlert.current_value = currentValue
      existingAlert.message = message
      existingAlert.severity = severity
    } else {
      // Create new alert
      const alert: PerformanceAlert = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metric,
        threshold,
        current_value: currentValue,
        severity,
        message,
        created_at: new Date().toISOString()
      }

      this.alerts.push(alert)

      // Store in database
      await this.supabase
        .from('system_alerts')
        .insert({
          type: 'warning',
          severity,
          title: 'Performance Alert',
          message,
          source: 'monitoring_service',
          metadata: {
            metric,
            threshold,
            current_value: currentValue
          }
        })

      // Send notifications for critical alerts
      if (severity === 'critical') {
        await this.sendCriticalAlert(alert)
      }
    }
  }

  private async sendCriticalAlert(alert: PerformanceAlert) {
    // In a real implementation, you would send notifications to administrators
    console.error('CRITICAL ALERT:', alert.message)
    
    // You could integrate with services like:
    // - Slack notifications
    // - Email alerts
    // - SMS alerts
    // - PagerDuty
    // - Discord webhooks
  }

  private async cleanupOldMetrics() {
    // Remove metrics older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    try {
      await this.supabase
        .from('system_metrics')
        .delete()
        .lt('timestamp', sevenDaysAgo.toISOString())
    } catch (error) {
      console.error('Failed to cleanup old metrics:', error)
    }
  }

  async getMetrics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h') {
    const now = new Date()
    let startTime: Date

    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
    }

    const { data: metrics, error } = await this.supabase
      .from('system_metrics')
      .select('*')
      .gte('timestamp', startTime.toISOString())
      .order('timestamp', { ascending: true })

    if (error) {
      throw error
    }

    return metrics || []
  }

  async getAlerts(status: 'active' | 'resolved' | 'all' = 'all') {
    let query = this.supabase
      .from('system_alerts')
      .select('*')
      .eq('source', 'monitoring_service')
      .order('created_at', { ascending: false })

    if (status === 'active') {
      query = query.is('resolved_at', null)
    } else if (status === 'resolved') {
      query = query.not('resolved_at', 'is', null)
    }

    const { data: alerts, error } = await query

    if (error) {
      throw error
    }

    return alerts || []
  }

  async resolveAlert(alertId: string, resolvedBy: string, notes?: string) {
    await this.supabase
      .from('system_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy,
        resolution_notes: notes
      })
      .eq('id', alertId)

    // Also resolve in memory
    const alert = this.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.resolved_at = new Date().toISOString()
    }
  }

  async getSystemHealth() {
    const latestMetrics = this.metrics[this.metrics.length - 1]
    
    if (!latestMetrics) {
      return {
        status: 'unknown',
        message: 'No metrics available',
        metrics: {},
        alerts: this.alerts.filter(a => !a.resolved_at).length
      }
    }

    // Calculate overall health score
    let healthScore = 100
    const issues: string[] = []

    // Check CPU usage
    if (latestMetrics.cpu_usage > this.thresholds.cpu_usage.critical) {
      healthScore -= 30
      issues.push('Critical CPU usage')
    } else if (latestMetrics.cpu_usage > this.thresholds.cpu_usage.warning) {
      healthScore -= 15
      issues.push('High CPU usage')
    }

    // Check memory usage
    if (latestMetrics.memory_usage > this.thresholds.memory_usage.critical) {
      healthScore -= 25
      issues.push('Critical memory usage')
    } else if (latestMetrics.memory_usage > this.thresholds.memory_usage.warning) {
      healthScore -= 10
      issues.push('High memory usage')
    }

    // Check disk usage
    if (latestMetrics.disk_usage > this.thresholds.disk_usage.critical) {
      healthScore -= 20
      issues.push('Critical disk usage')
    } else if (latestMetrics.disk_usage > this.thresholds.disk_usage.warning) {
      healthScore -= 10
      issues.push('High disk usage')
    }

    // Check response time
    if (latestMetrics.response_time > this.thresholds.response_time.critical) {
      healthScore -= 25
      issues.push('Critical response time')
    } else if (latestMetrics.response_time > this.thresholds.response_time.warning) {
      healthScore -= 15
      issues.push('High response time')
    }

    // Check error rate
    if (latestMetrics.error_rate > this.thresholds.error_rate.critical) {
      healthScore -= 30
      issues.push('Critical error rate')
    } else if (latestMetrics.error_rate > this.thresholds.error_rate.warning) {
      healthScore -= 15
      issues.push('High error rate')
    }

    // Check success rate
    if (latestMetrics.success_rate < this.thresholds.success_rate.critical) {
      healthScore -= 35
      issues.push('Critical success rate')
    } else if (latestMetrics.success_rate < this.thresholds.success_rate.warning) {
      healthScore -= 20
      issues.push('Low success rate')
    }

    // Determine overall status
    let status: 'healthy' | 'warning' | 'critical' | 'degraded'
    let message: string

    if (healthScore >= 90) {
      status = 'healthy'
      message = 'All systems operational'
    } else if (healthScore >= 70) {
      status = 'warning'
      message = 'Some performance issues detected'
    } else if (healthScore >= 50) {
      status = 'degraded'
      message = 'System performance degraded'
    } else {
      status = 'critical'
      message = 'Critical system issues detected'
    }

    return {
      status,
      message,
      healthScore,
      issues,
      metrics: {
        cpu_usage: latestMetrics.cpu_usage,
        memory_usage: latestMetrics.memory_usage,
        disk_usage: latestMetrics.disk_usage,
        response_time: latestMetrics.response_time,
        error_rate: latestMetrics.error_rate,
        success_rate: latestMetrics.success_rate,
        active_connections: latestMetrics.active_connections,
        transaction_volume: latestMetrics.transaction_volume
      },
      activeAlerts: this.alerts.filter(a => !a.resolved_at).length,
      timestamp: latestMetrics.timestamp
    }
  }

  async generateReport(timeRange: '24h' | '7d' | '30d' = '24h') {
    const metrics = await this.getMetrics(timeRange)
    
    if (metrics.length === 0) {
      return {
        error: 'No metrics available for the specified time range'
      }
    }

    // Calculate averages
    const avgMetrics = {
      cpu_usage: metrics.reduce((sum, m) => sum + m.cpu_usage, 0) / metrics.length,
      memory_usage: metrics.reduce((sum, m) => sum + m.memory_usage, 0) / metrics.length,
      disk_usage: metrics.reduce((sum, m) => sum + m.disk_usage, 0) / metrics.length,
      response_time: metrics.reduce((sum, m) => sum + m.response_time, 0) / metrics.length,
      error_rate: metrics.reduce((sum, m) => sum + m.error_rate, 0) / metrics.length,
      success_rate: metrics.reduce((sum, m) => sum + m.success_rate, 0) / metrics.length,
      transaction_volume: metrics.reduce((sum, m) => sum + m.transaction_volume, 0)
    }

    // Find peaks
    const peakMetrics = {
      cpu_usage: Math.max(...metrics.map(m => m.cpu_usage)),
      memory_usage: Math.max(...metrics.map(m => m.memory_usage)),
      disk_usage: Math.max(...metrics.map(m => m.disk_usage)),
      response_time: Math.max(...metrics.map(m => m.response_time)),
      error_rate: Math.max(...metrics.map(m => m.error_rate)),
      min_success_rate: Math.min(...metrics.map(m => m.success_rate))
    }

    // Calculate uptime
    const totalDataPoints = metrics.length
    const healthyDataPoints = metrics.filter(m => 
      m.cpu_usage < this.thresholds.cpu_usage.critical &&
      m.memory_usage < this.thresholds.memory_usage.critical &&
      m.response_time < this.thresholds.response_time.critical &&
      m.error_rate < this.thresholds.error_rate.critical &&
      m.success_rate > this.thresholds.success_rate.critical
    ).length

    const uptime = (healthyDataPoints / totalDataPoints) * 100

    return {
      timeRange,
      period: {
        start: metrics[0].timestamp,
        end: metrics[metrics.length - 1].timestamp,
        dataPoints: totalDataPoints
      },
      averages: avgMetrics,
      peaks: peakMetrics,
      uptime: uptime.toFixed(2),
      totalTransactions: avgMetrics.transaction_volume,
      summary: {
        status: uptime > 99 ? 'excellent' : uptime > 95 ? 'good' : uptime > 90 ? 'fair' : 'poor',
        recommendations: this.generateRecommendations(avgMetrics, peakMetrics, uptime)
      }
    }
  }

  private generateRecommendations(avgMetrics: any, peakMetrics: any, uptime: number): string[] {
    const recommendations: string[] = []

    if (avgMetrics.cpu_usage > 70) {
      recommendations.push('Consider scaling up CPU resources or optimizing application performance')
    }

    if (avgMetrics.memory_usage > 80) {
      recommendations.push('Monitor memory usage and consider increasing available RAM')
    }

    if (avgMetrics.disk_usage > 85) {
      recommendations.push('Clean up old files or increase disk storage capacity')
    }

    if (avgMetrics.response_time > 1000) {
      recommendations.push('Optimize database queries and API response times')
    }

    if (avgMetrics.error_rate > 2) {
      recommendations.push('Investigate and fix recurring errors to improve reliability')
    }

    if (avgMetrics.success_rate < 98) {
      recommendations.push('Review failed transactions and improve success rate')
    }

    if (uptime < 99) {
      recommendations.push('Implement redundancy and failover mechanisms to improve uptime')
    }

    if (recommendations.length === 0) {
      recommendations.push('System performance is optimal. Continue monitoring.')
    }

    return recommendations
  }
}

export const monitoringService = new MonitoringService()
