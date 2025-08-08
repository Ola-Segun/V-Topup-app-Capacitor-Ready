/**
 * API Client for VTopup Application
 * Handles all HTTP requests with authentication, error handling, and retry logic
 */

import { API_CONFIG, API_HEADERS, ApiResponse, ApiError } from './endpoints'

class ApiClient {
  private baseURL: string
  private timeout: number
  private retryAttempts: number
  private retryDelay: number

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS
    this.retryDelay = API_CONFIG.RETRY_DELAY
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) return null

      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          [API_HEADERS.CONTENT_TYPE]: 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('refresh_token', data.refreshToken)
        return data.token
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
    }
    return null
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken()
      const headers: HeadersInit = {
        [API_HEADERS.CONTENT_TYPE]: 'application/json',
        ...options.headers
      }

      if (token) {
        headers[API_HEADERS.AUTHORIZATION] = `Bearer ${token}`
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && token) {
        const newToken = await this.refreshToken()
        if (newToken) {
          // Retry with new token
          headers[API_HEADERS.AUTHORIZATION] = `Bearer ${newToken}`
          const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers
          })
          return this.handleResponse<T>(retryResponse)
        } else {
          // Redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/auth/login'
          }
        }
      }

      return this.handleResponse<T>(response)
    } catch (error) {
      if (attempt < this.retryAttempts && this.shouldRetry(error)) {
        await this.delay(this.retryDelay * attempt)
        return this.makeRequest<T>(endpoint, options, attempt + 1)
      }
      throw this.handleError(error)
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (response.ok) {
      if (isJson) {
        const data = await response.json()
        return {
          success: true,
          data: data.data || data,
          message: data.message
        }
      } else {
        return {
          success: true,
          data: null as T
        }
      }
    } else {
      let errorData: any = {}
      if (isJson) {
        try {
          errorData = await response.json()
        } catch (e) {
          // Ignore JSON parse errors
        }
      }

      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP ${response.status}`,
        errors: errorData.errors
      }
    }
  }

  private handleError(error: any): ApiError {
    if (error.name === 'AbortError') {
      return {
        code: 'TIMEOUT',
        message: 'Request timeout'
      }
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network error - please check your connection'
      }
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred'
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors and timeouts
    return error.name === 'AbortError' || 
           (error instanceof TypeError && error.message.includes('fetch'))
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return this.makeRequest<T>(url.pathname + url.search, {
      method: 'GET'
    })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE'
    })
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = await this.getAuthToken()
    const headers: HeadersInit = {}

    if (token) {
      headers[API_HEADERS.AUTHORIZATION] = `Bearer ${token}`
    }

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData
    })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Convenience methods for common operations
export const api = {
  // Authentication
  login: (data: any) => apiClient.post('/api/auth/login', data),
  register: (data: any) => apiClient.post('/api/auth/register', data),
  logout: () => apiClient.post('/api/auth/logout'),
  
  // User
  getProfile: () => apiClient.get('/api/user/profile'),
  updateProfile: (data: any) => apiClient.put('/api/user/profile', data),
  changePassword: (data: any) => apiClient.post('/api/user/change-password', data),
  
  // Wallet
  getWalletBalance: () => apiClient.get('/api/wallet/balance'),
  fundWallet: (data: any) => apiClient.post('/api/wallet/fund', data),
  transferMoney: (data: any) => apiClient.post('/api/wallet/transfer', data),
  getWalletHistory: (params?: any) => apiClient.get('/api/wallet/history', params),
  
  // Services
  buyAirtime: (data: any) => apiClient.post('/api/services/airtime', data),
  buyData: (data: any) => apiClient.post('/api/services/data', data),
  payCable: (data: any) => apiClient.post('/api/services/cable', data),
  payElectricity: (data: any) => apiClient.post('/api/services/electricity', data),
  
  // Transactions
  getTransactions: (params?: any) => apiClient.get('/api/transactions', params),
  getTransactionDetails: (id: string) => apiClient.get(`/api/transactions/${id}`),
  retryTransaction: (id: string) => apiClient.post(`/api/transactions/${id}/retry`),
  
  // Budget
  getBudgets: () => apiClient.get('/api/budget'),
  createBudget: (data: any) => apiClient.post('/api/budget', data),
  updateBudget: (id: string, data: any) => apiClient.put(`/api/budget/${id}`, data),
  deleteBudget: (id: string) => apiClient.delete(`/api/budget/${id}`),
  
  // Notifications
  getNotifications: (params?: any) => apiClient.get('/api/notifications', params),
  markNotificationRead: (id: string) => apiClient.patch(`/api/notifications/${id}/read`),
  updateNotificationSettings: (data: any) => apiClient.put('/api/notifications/settings', data),
  
  // Security
  setup2FA: (data: any) => apiClient.post('/api/security/2fa/setup', data),
  verify2FA: (data: any) => apiClient.post('/api/security/2fa/verify', data),
  setupPin: (data: any) => apiClient.post('/api/security/pin/setup', data),
  verifyPin: (data: any) => apiClient.post('/api/security/pin/verify', data),
  
  // Admin
  getAdminDashboard: () => apiClient.get('/api/admin/dashboard'),
  getAdminUsers: (params?: any) => apiClient.get('/api/admin/users', params),
  getAdminTransactions: (params?: any) => apiClient.get('/api/admin/transactions', params),
  suspendUser: (id: string) => apiClient.post(`/api/admin/users/${id}/suspend`),
  activateUser: (id: string) => apiClient.post(`/api/admin/users/${id}/activate`),
  
  // File uploads
  uploadDocument: (formData: FormData) => apiClient.upload('/api/kyc/upload', formData),
  uploadAvatar: (formData: FormData) => apiClient.upload('/api/user/upload-avatar', formData)
}
