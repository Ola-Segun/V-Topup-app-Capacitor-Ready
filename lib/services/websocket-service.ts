import { Server as SocketIOServer } from 'socket.io'
import { createClient } from '@/lib/supabase/server'
import jwt from 'jsonwebtoken'

interface SocketUser {
  id: string
  email: string
  role: string
}

interface RealTimeEvent {
  type: string
  data: any
  userId?: string
  room?: string
  timestamp: string
}

class WebSocketService {
  private io: SocketIOServer | null = null
  private supabase = createClient()
  private connectedUsers = new Map<string, SocketUser>()
  private userSockets = new Map<string, Set<string>>() // userId -> Set of socketIds

  initialize(server: any) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    })

    this.setupEventHandlers()
    console.log('WebSocket service initialized')
  }

  private setupEventHandlers() {
    if (!this.io) return

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        if (!token) {
          return next(new Error('Authentication token required'))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
        const { data: user } = await this.supabase
          .from('users')
          .select('id, email, status')
          .eq('id', decoded.userId)
          .single()

        if (!user || user.status !== 'active') {
          return next(new Error('Invalid or inactive user'))
        }

        socket.userId = user.id
        socket.userEmail = user.email
        next()
      } catch (error) {
        next(new Error('Authentication failed'))
      }
    })

    this.io.on('connection', (socket) => {
      this.handleConnection(socket)
    })
  }

  private handleConnection(socket: any) {
    const userId = socket.userId
    const userEmail = socket.userEmail

    console.log(`User ${userEmail} connected with socket ${socket.id}`)

    // Store user connection
    this.connectedUsers.set(socket.id, {
      id: userId,
      email: userEmail,
      role: 'user' // You can determine role from user data
    })

    // Track user sockets
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set())
    }
    this.userSockets.get(userId)!.add(socket.id)

    // Join user-specific room
    socket.join(`user:${userId}`)

    // Join role-based rooms
    socket.join('users') // All authenticated users
    
    // Admin users join admin room
    if (socket.userRole === 'admin') {
      socket.join('admins')
    }

    // Handle events
    socket.on('subscribe_to_transactions', () => {
      socket.join(`transactions:${userId}`)
    })

    socket.on('subscribe_to_wallet', () => {
      socket.join(`wallet:${userId}`)
    })

    socket.on('subscribe_to_notifications', () => {
      socket.join(`notifications:${userId}`)
    })

    socket.on('admin_subscribe', () => {
      if (socket.userRole === 'admin') {
        socket.join('admin_dashboard')
        socket.join('admin_transactions')
        socket.join('admin_users')
        socket.join('admin_alerts')
      }
    })

    socket.on('ping', (callback) => {
      callback('pong')
    })

    socket.on('disconnect', () => {
      this.handleDisconnection(socket)
    })

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to VTopup real-time service',
      timestamp: new Date().toISOString()
    })
  }

  private handleDisconnection(socket: any) {
    const userId = socket.userId
    console.log(`User ${socket.userEmail} disconnected`)

    // Remove from connected users
    this.connectedUsers.delete(socket.id)

    // Remove from user sockets tracking
    if (this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(socket.id)
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId)
      }
    }
  }

  // Send event to specific user
  emitToUser(userId: string, event: string, data: any) {
    if (!this.io) return

    this.io.to(`user:${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    })
  }

  // Send event to all users
  emitToAllUsers(event: string, data: any) {
    if (!this.io) return

    this.io.to('users').emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    })
  }

  // Send event to admin users
  emitToAdmins(event: string, data: any) {
    if (!this.io) return

    this.io.to('admins').emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    })
  }

  // Send transaction update
  emitTransactionUpdate(userId: string, transaction: any) {
    this.emitToUser(userId, 'transaction_update', {
      type: 'transaction_update',
      transaction
    })

    // Also emit to admin dashboard
    this.emitToAdmins('admin_transaction_update', {
      type: 'admin_transaction_update',
      transaction,
      userId
    })
  }

  // Send wallet update
  emitWalletUpdate(userId: string, walletData: any) {
    this.emitToUser(userId, 'wallet_update', {
      type: 'wallet_update',
      wallet: walletData
    })
  }

  // Send notification
  emitNotification(userId: string, notification: any) {
    this.emitToUser(userId, 'notification', {
      type: 'notification',
      notification
    })
  }

  // Send system alert to admins
  emitSystemAlert(alert: any) {
    this.emitToAdmins('system_alert', {
      type: 'system_alert',
      alert
    })
  }

  // Send real-time metrics to admin dashboard
  emitMetricsUpdate(metrics: any) {
    if (!this.io) return

    this.io.to('admin_dashboard').emit('metrics_update', {
      type: 'metrics_update',
      metrics,
      timestamp: new Date().toISOString()
    })
  }

  // Send user activity update to admins
  emitUserActivity(activity: any) {
    this.emitToAdmins('user_activity', {
      type: 'user_activity',
      activity
    })
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size
  }

  // Get connected users for a specific user ID
  getUserConnectionCount(userId: string): number {
    return this.userSockets.get(userId)?.size || 0
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId)
  }

  // Get all connected users (admin only)
  getConnectedUsers(): Array<{ socketId: string; user: SocketUser }> {
    return Array.from(this.connectedUsers.entries()).map(([socketId, user]) => ({
      socketId,
      user
    }))
  }

  // Broadcast system maintenance message
  broadcastMaintenance(message: string, scheduledTime?: string) {
    this.emitToAllUsers('maintenance_notice', {
      type: 'maintenance_notice',
      message,
      scheduledTime
    })
  }

  // Send typing indicator (for chat/support)
  emitTyping(roomId: string, userId: string, isTyping: boolean) {
    if (!this.io) return

    this.io.to(roomId).emit('typing', {
      userId,
      isTyping,
      timestamp: new Date().toISOString()
    })
  }

  // Create or join a support chat room
  joinSupportRoom(socketId: string, ticketId: string) {
    if (!this.io) return

    const socket = this.io.sockets.sockets.get(socketId)
    if (socket) {
      socket.join(`support:${ticketId}`)
    }
  }

  // Send message to support room
  emitToSupportRoom(ticketId: string, message: any) {
    if (!this.io) return

    this.io.to(`support:${ticketId}`).emit('support_message', {
      type: 'support_message',
      message,
      timestamp: new Date().toISOString()
    })
  }

  // Handle real-time budget updates
  emitBudgetUpdate(userId: string, budget: any) {
    this.emitToUser(userId, 'budget_update', {
      type: 'budget_update',
      budget
    })
  }

  // Handle real-time KYC updates
  emitKYCUpdate(userId: string, kycData: any) {
    this.emitToUser(userId, 'kyc_update', {
      type: 'kyc_update',
      kyc: kycData
    })
  }

  // Send fraud alert
  emitFraudAlert(userId: string, alert: any) {
    this.emitToUser(userId, 'fraud_alert', {
      type: 'fraud_alert',
      alert
    })

    // Also notify admins
    this.emitToAdmins('admin_fraud_alert', {
      type: 'admin_fraud_alert',
      alert,
      userId
    })
  }

  // Send rate limit warning
  emitRateLimitWarning(userId: string, warning: any) {
    this.emitToUser(userId, 'rate_limit_warning', {
      type: 'rate_limit_warning',
      warning
    })
  }

  // Graceful shutdown
  async shutdown() {
    if (!this.io) return

    console.log('Shutting down WebSocket service...')
    
    // Notify all connected users
    this.emitToAllUsers('server_shutdown', {
      type: 'server_shutdown',
      message: 'Server is shutting down. Please reconnect in a moment.'
    })

    // Wait a bit for messages to be sent
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Close all connections
    this.io.close()
    this.connectedUsers.clear()
    this.userSockets.clear()
    
    console.log('WebSocket service shut down')
  }
}

export const webSocketService = new WebSocketService()
