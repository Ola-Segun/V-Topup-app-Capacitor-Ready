export interface WebSocketMessage {
  type: "transaction" | "user_activity" | "system_alert" | "revenue_update" | "user_registration"
  data: any
  timestamp: string
}

export interface TransactionUpdate {
  id: string
  userId: string
  userName: string
  type: "airtime" | "data" | "wallet_funding" | "cable" | "electricity"
  amount: number
  status: "completed" | "pending" | "failed"
  network?: string
  phone?: string
}

export interface UserActivity {
  userId: string
  userName: string
  action: "login" | "logout" | "transaction" | "profile_update"
  timestamp: string
  details?: any
}

export interface SystemAlert {
  id: string
  type: "error" | "warning" | "info" | "success"
  message: string
  component: string
  severity: "low" | "medium" | "high" | "critical"
}

export interface RevenueUpdate {
  totalRevenue: number
  dailyRevenue: number
  monthlyRevenue: number
  transactionCount: number
  averageTransaction: number
}

export class WebSocketManager {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  constructor(private url: string) {
    this.connect()
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.reconnectAttempts = 0
        this.emit("connection", { status: "connected" })
      }

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          this.emit(message.type, message.data)
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error)
        }
      }

      this.ws.onclose = () => {
        console.log("WebSocket disconnected")
        this.emit("connection", { status: "disconnected" })
        this.handleReconnect()
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.emit("connection", { status: "error", error })
      }
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      this.handleReconnect()
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  public off(event: string, callback: (data: any) => void) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(callback)
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data))
    }
  }

  public send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  public getConnectionStatus(): "connecting" | "connected" | "disconnected" | "error" {
    if (!this.ws) return "disconnected"

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting"
      case WebSocket.OPEN:
        return "connected"
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return "disconnected"
      default:
        return "error"
    }
  }
}

// Mock WebSocket server simulation for demo purposes
export class MockWebSocketServer {
  private clients: Set<(message: WebSocketMessage) => void> = new Set()
  private intervals: NodeJS.Timeout[] = []

  constructor() {
    this.startMockDataGeneration()
  }

  public addClient(callback: (message: WebSocketMessage) => void) {
    this.clients.add(callback)
  }

  public removeClient(callback: (message: WebSocketMessage) => void) {
    this.clients.delete(callback)
  }

  private broadcast(message: WebSocketMessage) {
    this.clients.forEach((client) => client(message))
  }

  private startMockDataGeneration() {
    // Generate random transactions
    const transactionInterval = setInterval(
      () => {
        const transaction: TransactionUpdate = {
          id: `TXN${Date.now()}`,
          userId: `USR${Math.floor(Math.random() * 1000)}`,
          userName: this.generateRandomName(),
          type: this.getRandomTransactionType(),
          amount: Math.floor(Math.random() * 50000) + 1000,
          status: this.getRandomStatus(),
          network: this.getRandomNetwork(),
          phone: this.generateRandomPhone(),
        }

        this.broadcast({
          type: "transaction",
          data: transaction,
          timestamp: new Date().toISOString(),
        })
      },
      3000 + Math.random() * 7000,
    ) // Random interval between 3-10 seconds

    // Generate user activity
    const activityInterval = setInterval(
      () => {
        const activity: UserActivity = {
          userId: `USR${Math.floor(Math.random() * 1000)}`,
          userName: this.generateRandomName(),
          action: this.getRandomUserAction(),
          timestamp: new Date().toISOString(),
        }

        this.broadcast({
          type: "user_activity",
          data: activity,
          timestamp: new Date().toISOString(),
        })
      },
      5000 + Math.random() * 10000,
    ) // Random interval between 5-15 seconds

    // Generate revenue updates
    const revenueInterval = setInterval(() => {
      const revenue: RevenueUpdate = {
        totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
        dailyRevenue: Math.floor(Math.random() * 50000) + 10000,
        monthlyRevenue: Math.floor(Math.random() * 500000) + 200000,
        transactionCount: Math.floor(Math.random() * 1000) + 500,
        averageTransaction: Math.floor(Math.random() * 5000) + 2000,
      }

      this.broadcast({
        type: "revenue_update",
        data: revenue,
        timestamp: new Date().toISOString(),
      })
    }, 15000) // Every 15 seconds

    // Generate system alerts occasionally
    const alertInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance
        const alert: SystemAlert = {
          id: `ALERT${Date.now()}`,
          type: this.getRandomAlertType(),
          message: this.getRandomAlertMessage(),
          component: this.getRandomComponent(),
          severity: this.getRandomSeverity(),
        }

        this.broadcast({
          type: "system_alert",
          data: alert,
          timestamp: new Date().toISOString(),
        })
      }
    }, 20000) // Every 20 seconds

    this.intervals = [transactionInterval, activityInterval, revenueInterval, alertInterval]
  }

  private generateRandomName(): string {
    const firstNames = ["John", "Jane", "Mike", "Sarah", "David", "Emma", "Chris", "Lisa", "Tom", "Anna"]
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
    ]
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
  }

  private generateRandomPhone(): string {
    return `+234${Math.floor(Math.random() * 900000000) + 100000000}`
  }

  private getRandomTransactionType(): TransactionUpdate["type"] {
    const types: TransactionUpdate["type"][] = ["airtime", "data", "wallet_funding", "cable", "electricity"]
    return types[Math.floor(Math.random() * types.length)]
  }

  private getRandomStatus(): TransactionUpdate["status"] {
    const statuses: TransactionUpdate["status"][] = ["completed", "pending", "failed"]
    const weights = [0.8, 0.15, 0.05] // 80% completed, 15% pending, 5% failed
    const random = Math.random()
    let sum = 0
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i]
      if (random <= sum) return statuses[i]
    }
    return "completed"
  }

  private getRandomNetwork(): string {
    const networks = ["MTN", "Airtel", "Glo", "9mobile"]
    return networks[Math.floor(Math.random() * networks.length)]
  }

  private getRandomUserAction(): UserActivity["action"] {
    const actions: UserActivity["action"][] = ["login", "logout", "transaction", "profile_update"]
    return actions[Math.floor(Math.random() * actions.length)]
  }

  private getRandomAlertType(): SystemAlert["type"] {
    const types: SystemAlert["type"][] = ["error", "warning", "info", "success"]
    return types[Math.floor(Math.random() * types.length)]
  }

  private getRandomSeverity(): SystemAlert["severity"] {
    const severities: SystemAlert["severity"][] = ["low", "medium", "high", "critical"]
    const weights = [0.5, 0.3, 0.15, 0.05] // Most alerts are low severity
    const random = Math.random()
    let sum = 0
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i]
      if (random <= sum) return severities[i]
    }
    return "low"
  }

  private getRandomComponent(): string {
    const components = [
      "Database",
      "API Gateway",
      "Payment Service",
      "Notification Service",
      "File Storage",
      "Cache Layer",
    ]
    return components[Math.floor(Math.random() * components.length)]
  }

  private getRandomAlertMessage(): string {
    const messages = [
      "High CPU usage detected",
      "Database connection pool exhausted",
      "Payment gateway response time increased",
      "Disk space running low",
      "Memory usage above threshold",
      "API rate limit exceeded",
      "Cache hit ratio decreased",
      "Network latency spike detected",
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  public destroy() {
    this.intervals.forEach((interval) => clearInterval(interval))
    this.clients.clear()
  }
}
