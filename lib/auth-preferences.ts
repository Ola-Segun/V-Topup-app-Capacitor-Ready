export type AuthMethod = 'pin' | 'biometric'

export interface AuthPreferences {
  preferredMethod: AuthMethod
  biometricEnabled: boolean
  pinEnabled: boolean
  fallbackToPin: boolean
}

const AUTH_PREFERENCES_KEY = 'vtopup_auth_preferences'

export class AuthPreferencesManager {
  private static instance: AuthPreferencesManager
  private preferences: AuthPreferences

  private constructor() {
    this.preferences = this.loadPreferences()
  }

  static getInstance(): AuthPreferencesManager {
    if (!AuthPreferencesManager.instance) {
      AuthPreferencesManager.instance = new AuthPreferencesManager()
    }
    return AuthPreferencesManager.instance
  }

  private loadPreferences(): AuthPreferences {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(AUTH_PREFERENCES_KEY)
        if (stored) {
          return JSON.parse(stored)
        }
      }
    } catch (error) {
      console.error('Error loading auth preferences:', error)
    }

    // Default preferences
    return {
      preferredMethod: 'pin',
      biometricEnabled: false,
      pinEnabled: true,
      fallbackToPin: true
    }
  }

  private savePreferences(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_PREFERENCES_KEY, JSON.stringify(this.preferences))
      }
    } catch (error) {
      console.error('Error saving auth preferences:', error)
    }
  }

  getPreferences(): AuthPreferences {
    return { ...this.preferences }
  }

  setPreferredMethod(method: AuthMethod): void {
    this.preferences.preferredMethod = method
    this.savePreferences()
  }

  setBiometricEnabled(enabled: boolean): void {
    this.preferences.biometricEnabled = enabled
    this.savePreferences()
  }

  setPinEnabled(enabled: boolean): void {
    this.preferences.pinEnabled = enabled
    this.savePreferences()
  }

  setFallbackToPin(enabled: boolean): void {
    this.preferences.fallbackToPin = enabled
    this.savePreferences()
  }

  updatePreferences(updates: Partial<AuthPreferences>): void {
    this.preferences = { ...this.preferences, ...updates }
    this.savePreferences()
  }

  shouldUseBiometric(): boolean {
    return this.preferences.biometricEnabled && this.preferences.preferredMethod === 'biometric'
  }

  shouldUsePin(): boolean {
    return this.preferences.pinEnabled && this.preferences.preferredMethod === 'pin'
  }

  canFallbackToPin(): boolean {
    return this.preferences.fallbackToPin && this.preferences.pinEnabled
  }
}

export const authPreferencesManager = AuthPreferencesManager.getInstance()
