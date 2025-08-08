/**
 * VTopup API Endpoints Documentation
 * Complete list of all API endpoints required for the application
 */

export const API_ENDPOINTS = {
  // Authentication Endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
    SETUP_2FA: '/api/auth/setup-2fa',
    VERIFY_2FA: '/api/auth/verify-2fa',
    DISABLE_2FA: '/api/auth/disable-2fa'
  },

  // User Management Endpoints
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/change-password',
    DELETE_ACCOUNT: '/api/user/delete-account',
    UPLOAD_AVATAR: '/api/user/upload-avatar',
    GET_PREFERENCES: '/api/user/preferences',
    UPDATE_PREFERENCES: '/api/user/preferences',
    DEVICES: '/api/user/devices',
    REVOKE_DEVICE: '/api/user/devices/:id/revoke',
    TRUST_DEVICE: '/api/user/devices/:id/trust'
  },

  // Wallet Endpoints
  WALLET: {
    BALANCE: '/api/wallet/balance',
    FUND: '/api/wallet/fund',
    TRANSFER: '/api/wallet/transfer',
    HISTORY: '/api/wallet/history',
    SCHEDULED_TRANSACTIONS: '/api/wallet/scheduled',
    CREATE_SCHEDULE: '/api/wallet/schedule',
    UPDATE_SCHEDULE: '/api/wallet/schedule/:id',
    DELETE_SCHEDULE: '/api/wallet/schedule/:id',
    BANK_TRANSFER: '/api/wallet/bank-transfer',
    VERIFY_BANK: '/api/wallet/verify-bank'
  },

  // Service Endpoints
  SERVICES: {
    AIRTIME: '/api/services/airtime',
    DATA: '/api/services/data',
    DATA_PLANS: '/api/services/data/plans',
    CABLE: '/api/services/cable',
    CABLE_PLANS: '/api/services/cable/plans',
    CABLE_VERIFY: '/api/services/cable/verify',
    ELECTRICITY: '/api/services/electricity',
    ELECTRICITY_PROVIDERS: '/api/services/electricity/providers',
    ELECTRICITY_VERIFY: '/api/services/electricity/verify',
    NETWORKS: '/api/services/networks',
    SERVICE_STATUS: '/api/services/status'
  },

  // Transaction Endpoints
  TRANSACTIONS: {
    LIST: '/api/transactions',
    DETAILS: '/api/transactions/:id',
    RETRY: '/api/transactions/:id/retry',
    CANCEL: '/api/transactions/:id/cancel',
    RECEIPT: '/api/transactions/:id/receipt',
    EXPORT: '/api/transactions/export',
    STATS: '/api/transactions/stats'
  },

  // Budget Endpoints
  BUDGET: {
    LIST: '/api/budget',
    CREATE: '/api/budget',
    UPDATE: '/api/budget/:id',
    DELETE: '/api/budget/:id',
    INSIGHTS: '/api/budget/insights',
    ALERTS: '/api/budget/alerts',
    RESET: '/api/budget/:id/reset'
  },

  // Notification Endpoints
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: '/api/notifications/:id/read',
    MARK_ALL_READ: '/api/notifications/read-all',
    DELETE: '/api/notifications/:id',
    SETTINGS: '/api/notifications/settings',
    SEND: '/api/notifications/send',
    SUBSCRIBE_PUSH: '/api/notifications/push/subscribe',
    UNSUBSCRIBE_PUSH: '/api/notifications/push/unsubscribe',
    TEST: '/api/notifications/test'
  },

  // Security Endpoints
  SECURITY: {
    SETUP_PIN: '/api/security/pin/setup',
    CHANGE_PIN: '/api/security/pin/change',
    VERIFY_PIN: '/api/security/pin/verify',
    BIOMETRIC_REGISTER: '/api/security/biometric/register',
    BIOMETRIC_VERIFY: '/api/security/biometric/verify',
    BIOMETRIC_DELETE: '/api/security/biometric/delete',
    BACKUP_CODES: '/api/security/backup-codes',
    GENERATE_BACKUP_CODES: '/api/security/backup-codes/generate',
    SECURITY_LOG: '/api/security/log',
    SUSPICIOUS_ACTIVITY: '/api/security/suspicious-activity'
  },

  // KYC Endpoints
  KYC: {
    STATUS: '/api/kyc/status',
    UPLOAD_DOCUMENT: '/api/kyc/upload',
    SUBMIT: '/api/kyc/submit',
    VERIFY: '/api/kyc/verify',
    DOCUMENTS: '/api/kyc/documents',
    DELETE_DOCUMENT: '/api/kyc/documents/:id'
  },

  // Contact Management
  CONTACTS: {
    LIST: '/api/contacts',
    CREATE: '/api/contacts',
    UPDATE: '/api/contacts/:id',
    DELETE: '/api/contacts/:id',
    IMPORT: '/api/contacts/import',
    EXPORT: '/api/contacts/export',
    FAVORITES: '/api/contacts/favorites'
  },

  // Support Endpoints
  SUPPORT: {
    TICKETS: '/api/support/tickets',
    CREATE_TICKET: '/api/support/tickets',
    UPDATE_TICKET: '/api/support/tickets/:id',
    CLOSE_TICKET: '/api/support/tickets/:id/close',
    FAQ: '/api/support/faq',
    CHAT: '/api/support/chat',
    FEEDBACK: '/api/support/feedback'
  },

  // Admin Endpoints
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    METRICS: '/api/admin/metrics',
    USERS: '/api/admin/users',
    USER_DETAILS: '/api/admin/users/:id',
    SUSPEND_USER: '/api/admin/users/:id/suspend',
    ACTIVATE_USER: '/api/admin/users/:id/activate',
    DELETE_USER: '/api/admin/users/:id',
    RESET_USER_PASSWORD: '/api/admin/users/:id/reset-password',
    TRANSACTIONS: '/api/admin/transactions',
    TRANSACTION_DETAILS: '/api/admin/transactions/:id',
    RETRY_TRANSACTION: '/api/admin/transactions/:id/retry',
    CANCEL_TRANSACTION: '/api/admin/transactions/:id/cancel',
    REFUND_TRANSACTION: '/api/admin/transactions/:id/refund',
    ANALYTICS: '/api/admin/analytics',
    REPORTS: '/api/admin/reports',
    EXPORT_REPORT: '/api/admin/reports/export',
    SETTINGS: '/api/admin/settings',
    LOGS: '/api/admin/logs',
    ALERTS: '/api/admin/alerts',
    RESOLVE_ALERT: '/api/admin/alerts/:id/resolve',
    SYSTEM_STATUS: '/api/admin/system/status',
    SYSTEM_HEALTH: '/api/admin/system/health',
    MAINTENANCE_MODE: '/api/admin/system/maintenance',
    KYC_DOCUMENTS: '/api/admin/kyc/documents',
    APPROVE_KYC: '/api/admin/kyc/:id/approve',
    REJECT_KYC: '/api/admin/kyc/:id/reject',
    FRAUD_ALERTS: '/api/admin/fraud/alerts',
    INVESTIGATE_FRAUD: '/api/admin/fraud/:id/investigate',
    RESOLVE_FRAUD: '/api/admin/fraud/:id/resolve',
    RATE_LIMITS: '/api/admin/rate-limits',
    UPDATE_RATE_LIMIT: '/api/admin/rate-limits/:id',
    WEBHOOK_LOGS: '/api/admin/webhooks/logs',
    AUDIT_LOGS: '/api/admin/audit/logs',
    BACKUP_DATABASE: '/api/admin/backup/database',
    RESTORE_DATABASE: '/api/admin/restore/database'
  },

  // Payment Gateway Webhooks
  WEBHOOKS: {
    PAYSTACK: '/api/webhooks/paystack',
    FLUTTERWAVE: '/api/webhooks/flutterwave',
    VTU_PROVIDERS: '/api/webhooks/vtu-providers',
    VTPASS: '/api/webhooks/vtu-providers?provider=vtpass',
    BAXI: '/api/webhooks/vtu-providers?provider=baxi',
    CLUBKONNECT: '/api/webhooks/vtu-providers?provider=clubkonnect'
  },

  // Real-time Endpoints
  REALTIME: {
    METRICS: '/api/realtime/metrics',
    TRANSACTIONS: '/api/realtime/transactions',
    ALERTS: '/api/realtime/alerts',
    WEBSOCKET: '/ws',
    HEALTH_CHECK: '/api/realtime/health'
  },

  // File Upload Endpoints
  UPLOAD: {
    DOCUMENT: '/api/upload/document',
    AVATAR: '/api/upload/avatar',
    RECEIPT: '/api/upload/receipt',
    BULK_CONTACTS: '/api/upload/contacts'
  },

  // External Integration Endpoints
  EXTERNAL: {
    BANK_LIST: '/api/external/banks',
    VERIFY_ACCOUNT: '/api/external/verify-account',
    NIN_LOOKUP: '/api/external/nin-lookup',
    BVN_LOOKUP: '/api/external/bvn-lookup',
    NETWORK_CHECK: '/api/external/network-check'
  }
} as const

/**
 * API Request/Response Types
 */

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
  deviceId?: string
}

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
  requiresTwoFactor?: boolean
  backupCodes?: string[]
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  referralCode?: string
  acceptTerms: boolean
}

export interface RegisterResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
  emailVerificationRequired: boolean
}

// User Types
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  walletBalance: number
  status: 'active' | 'suspended' | 'frozen' | 'pending'
  kycStatus: 'verified' | 'pending' | 'rejected'
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  biometricEnabled: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  city?: string
  state?: string
}

// Wallet Types
export interface WalletFundRequest {
  amount: number
  paymentMethod: 'paystack' | 'flutterwave' | 'bank_transfer'
  reference?: string
  callbackUrl?: string
}

export interface WalletFundResponse {
  reference: string
  authorizationUrl?: string
  accessCode?: string
  paymentLink?: string
}

export interface WalletTransferRequest {
  recipient: string
  amount: number
  note?: string
  pin: string
  saveContact?: boolean
}

export interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  balance: number
  description: string
  reference: string
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
  category: 'funding' | 'transfer' | 'service' | 'refund'
  metadata?: Record<string, any>
}

// Service Types
export interface AirtimeRequest {
  network: string
  phoneNumber: string
  amount: number
  saveContact?: boolean
  pin?: string
}

export interface DataRequest {
  network: string
  phoneNumber: string
  planCode: string
  amount: number
  saveContact?: boolean
  pin?: string
}

export interface CableRequest {
  provider: string
  smartCardNumber: string
  package: string
  amount: number
  customerName?: string
  pin?: string
}

export interface ElectricityRequest {
  provider: string
  meterNumber: string
  amount: number
  meterType: 'prepaid' | 'postpaid'
  customerName?: string
  customerAddress?: string
  pin?: string
}

export interface ServiceResponse {
  success: boolean
  reference: string
  transactionId: string
  message: string
  data?: any
}

// Transaction Types
export interface Transaction {
  id: string
  userId: string
  reference: string
  type: 'airtime' | 'data' | 'cable' | 'electricity' | 'wallet_funding' | 'wallet_transfer'
  amount: number
  fee: number
  totalAmount: number
  recipient: string
  network?: string
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  provider?: string
  providerTransactionId?: string
  failureReason?: string
  timestamp: string
  completedAt?: string
  metadata: Record<string, any>
}

export interface TransactionStats {
  totalTransactions: number
  totalAmount: number
  successfulTransactions: number
  failedTransactions: number
  successRate: number
  averageAmount: number
  byType: Record<string, number>
  byStatus: Record<string, number>
}

// Budget Types
export interface Budget {
  id: string
  userId: string
  name: string
  category: string
  amount: number
  spent: number
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  alertThreshold: number
  isActive: boolean
  autoReset: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateBudgetRequest {
  name: string
  category: string
  amount: number
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  alertThreshold: number
  autoReset?: boolean
}

export interface BudgetInsights {
  totalBudgets: number
  activeBudgets: number
  totalAllocated: number
  totalSpent: number
  averageUtilization: number
  topCategories: Array<{
    category: string
    spent: number
    allocated: number
    utilization: number
  }>
  alerts: Array<{
    budgetId: string
    budgetName: string
    threshold: number
    currentUtilization: number
  }>
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category?: string
  isRead: boolean
  timestamp: string
  expiresAt?: string
  metadata?: Record<string, any>
}

export interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  transactionAlerts: boolean
  budgetAlerts: boolean
  securityAlerts: boolean
  promotionalEmails: boolean
  lowBalanceAlerts: boolean
  weeklyReports: boolean
}

// Contact Types
export interface Contact {
  id: string
  userId: string
  name: string
  phone: string
  network?: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateContactRequest {
  name: string
  phone: string
  network?: string
  isFavorite?: boolean
}

// KYC Types
export interface KYCDocument {
  id: string
  userId: string
  documentType: 'nin' | 'bvn' | 'passport' | 'drivers_license' | 'voters_card'
  documentNumber: string
  documentUrl: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  verifiedAt?: string
  verifiedBy?: string
  createdAt: string
}

export interface KYCStatus {
  overallStatus: 'verified' | 'pending' | 'rejected'
  documents: KYCDocument[]
  requiredDocuments: string[]
  optionalDocuments: string[]
  completionPercentage: number
}

// Admin Types
export interface AdminDashboardMetrics {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  totalTransactions: number
  successRate: number
  pendingTransactions: number
  failedTransactions: number
  walletBalance: number
  systemHealth: 'healthy' | 'warning' | 'critical'
}

export interface AdminUser extends User {
  totalTransactions: number
  totalSpent: number
  lastActive: string
  joinDate: string
  deviceCount: number
  kycDocuments: number
}

export interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  source: string
  timestamp: string
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
  metadata?: Record<string, any>
}

export interface SystemMetrics {
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  activeConnections: number
  responseTime: number
  errorRate: number
  transactionVolume: number
  successRate: number
}

export interface FraudAlert {
  id: string
  userId: string
  transactionId?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  riskScore: number
  factors: string[]
  status: 'open' | 'investigating' | 'resolved' | 'false_positive'
  timestamp: string
  investigatedBy?: string
  investigationNotes?: string
  metadata?: Record<string, any>
}

/**
 * API Response Wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
    hasNext?: boolean
    hasPrev?: boolean
  }
  timestamp?: string
}

/**
 * Error Response Types
 */
export interface ApiError {
  code: string
  message: string
  details?: any
  timestamp?: string
  path?: string
}

export const API_ERROR_CODES = {
  // Authentication Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TWO_FACTOR_REQUIRED: 'TWO_FACTOR_REQUIRED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',

  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // Business Logic Errors
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_NOT_FOUND: 'TRANSACTION_NOT_FOUND',
  INVALID_PIN: 'INVALID_PIN',
  DAILY_LIMIT_EXCEEDED: 'DAILY_LIMIT_EXCEEDED',
  MONTHLY_LIMIT_EXCEEDED: 'MONTHLY_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  NETWORK_NOT_SUPPORTED: 'NETWORK_NOT_SUPPORTED',
  INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
  INVALID_METER_NUMBER: 'INVALID_METER_NUMBER',
  INVALID_SMARTCARD_NUMBER: 'INVALID_SMARTCARD_NUMBER',

  // System Errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',

  // Resource Errors
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  CONTACT_NOT_FOUND: 'CONTACT_NOT_FOUND',
  BUDGET_NOT_FOUND: 'BUDGET_NOT_FOUND',

  // KYC Errors
  KYC_NOT_VERIFIED: 'KYC_NOT_VERIFIED',
  DOCUMENT_UPLOAD_FAILED: 'DOCUMENT_UPLOAD_FAILED',
  INVALID_DOCUMENT_TYPE: 'INVALID_DOCUMENT_TYPE',
  DOCUMENT_VERIFICATION_FAILED: 'DOCUMENT_VERIFICATION_FAILED',

  // Security Errors
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  FRAUD_DETECTED: 'FRAUD_DETECTED',
  DEVICE_NOT_TRUSTED: 'DEVICE_NOT_TRUSTED',
  BIOMETRIC_VERIFICATION_FAILED: 'BIOMETRIC_VERIFICATION_FAILED'
} as const

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const

/**
 * Request Headers
 */
export const API_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  X_API_KEY: 'X-API-Key',
  X_REQUEST_ID: 'X-Request-ID',
  X_USER_AGENT: 'X-User-Agent',
  X_DEVICE_ID: 'X-Device-ID',
  X_CLIENT_VERSION: 'X-Client-Version',
  X_PLATFORM: 'X-Platform'
} as const

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  }
} as const

/**
 * WebSocket Events
 */
export const WEBSOCKET_EVENTS = {
  // Connection Events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  RECONNECT: 'reconnect',

  // User Events
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  USER_ACTIVITY: 'user_activity',

  // Transaction Events
  TRANSACTION_UPDATE: 'transaction_update',
  TRANSACTION_COMPLETED: 'transaction_completed',
  TRANSACTION_FAILED: 'transaction_failed',

  // Wallet Events
  WALLET_UPDATE: 'wallet_update',
  WALLET_CREDITED: 'wallet_credited',
  WALLET_DEBITED: 'wallet_debited',

  // Notification Events
  NOTIFICATION: 'notification',
  NOTIFICATION_READ: 'notification_read',

  // System Events
  SYSTEM_ALERT: 'system_alert',
  MAINTENANCE_NOTICE: 'maintenance_notice',
  SERVICE_STATUS_UPDATE: 'service_status_update',

  // Admin Events
  ADMIN_ALERT: 'admin_alert',
  ADMIN_METRICS_UPDATE: 'admin_metrics_update',
  ADMIN_USER_ACTIVITY: 'admin_user_activity',
  ADMIN_TRANSACTION_UPDATE: 'admin_transaction_update',

  // Security Events
  FRAUD_ALERT: 'fraud_alert',
  SECURITY_ALERT: 'security_alert',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',

  // Support Events
  SUPPORT_MESSAGE: 'support_message',
  SUPPORT_TICKET_UPDATE: 'support_ticket_update'
} as const

/**
 * Service Networks and Providers
 */
export const NETWORKS = {
  MTN: 'mtn',
  AIRTEL: 'airtel',
  GLO: 'glo',
  ETISALAT: '9mobile'
} as const

export const CABLE_PROVIDERS = {
  DSTV: 'dstv',
  GOTV: 'gotv',
  STARTIMES: 'startimes',
  SHOWMAX: 'showmax'
} as const

export const ELECTRICITY_PROVIDERS = {
  EKEDC: 'ekedc',
  IKEDC: 'ikedc',
  AEDC: 'aedc',
  PHED: 'phed',
  KEDCO: 'kedco',
  EEDC: 'eedc',
  KAEDCO: 'kaedco',
  JEDC: 'jedc'
} as const

/**
 * Transaction Limits
 */
export const TRANSACTION_LIMITS = {
  AIRTIME: {
    MIN: 50,
    MAX: 50000,
    DAILY_LIMIT: 100000
  },
  DATA: {
    MIN: 100,
    MAX: 50000,
    DAILY_LIMIT: 100000
  },
  ELECTRICITY: {
    MIN: 1000,
    MAX: 100000,
    DAILY_LIMIT: 500000
  },
  CABLE: {
    MIN: 500,
    MAX: 50000,
    DAILY_LIMIT: 200000
  },
  WALLET_TRANSFER: {
    MIN: 100,
    MAX: 500000,
    DAILY_LIMIT: 1000000
  }
} as const

/**
 * Utility Functions
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Add country code if not present
  if (cleaned.length === 10) {
    return `234${cleaned.substring(1)}`
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `234${cleaned.substring(1)}`
  } else if (cleaned.length === 13 && cleaned.startsWith('234')) {
    return cleaned
  }
  
  return phone // Return original if format is unclear
}

export const validatePhoneNumber = (phone: string): boolean => {
  const formatted = formatPhoneNumber(phone)
  return /^234[789][01]\d{8}$/.test(formatted)
}

export const generateReference = (prefix: string = 'VTP'): string => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}_${timestamp}_${random}`
}

export const getNetworkFromPhone = (phone: string): string | null => {
  const formatted = formatPhoneNumber(phone)
  const prefix = formatted.substring(3, 6)
  
  // MTN prefixes
  if (['803', '806', '813', '816', '810', '814', '903', '906', '913', '916'].includes(prefix)) {
    return NETWORKS.MTN
  }
  
  // Airtel prefixes
  if (['802', '808', '812', '701', '708', '902', '907', '901', '904', '912'].includes(prefix)) {
    return NETWORKS.AIRTEL
  }
  
  // Glo prefixes
  if (['805', '807', '815', '811', '905', '915'].includes(prefix)) {
    return NETWORKS.GLO
  }
  
  // 9mobile prefixes
  if (['809', '817', '818', '819', '908', '909'].includes(prefix)) {
    return NETWORKS.ETISALAT
  }
  
  return null
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export const maskPhoneNumber = (phone: string): string => {
  if (phone.length < 4) return phone
  return phone.substring(0, 4) + '*'.repeat(phone.length - 8) + phone.substring(phone.length - 4)
}

export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@')
  if (username.length <= 2) return email
  return username.substring(0, 2) + '*'.repeat(username.length - 2) + '@' + domain
}
