export interface BiometricAuthResult {
  success: boolean
  error?: string
  credential?: PublicKeyCredential
}

export interface BiometricCapabilities {
  isSupported: boolean
  availableAuthenticators: string[]
  biometryType: string
}

class BiometricService {
  private isInitialized = false
  private credentialStorage = new Map<string, string>()

  async initialize(): Promise<void> {
    if (this.isInitialized) return
    
    try {
      // Check if we're in a Capacitor environment
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        // Capacitor environment - use native biometric plugins
        console.log('Capacitor environment detected')
      }
      
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize biometric service:', error)
    }
  }

  async isSupported(): Promise<boolean> {
    try {
      // Check for Capacitor native biometric support first
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        // In Capacitor, we would check for native biometric availability
        // For now, assume it's supported in Capacitor environment
        return true
      }

      // Web environment - check WebAuthn support
      if (!window.PublicKeyCredential) {
        return false
      }

      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      return available
    } catch (error) {
      console.error('Error checking biometric support:', error)
      return false
    }
  }

  async getCapabilities(): Promise<BiometricCapabilities> {
    const isSupported = await this.isSupported()
    const biometryType = this.getBiometryType()
    
    return {
      isSupported,
      availableAuthenticators: isSupported ? ['platform'] : [],
      biometryType
    }
  }

  private getBiometryType(): string {
    if (typeof window === 'undefined') return 'Unknown'
    
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return 'Touch ID / Face ID'
    } else if (userAgent.includes('android')) {
      return 'Fingerprint / Face Unlock'
    } else if (userAgent.includes('windows')) {
      return 'Windows Hello'
    } else if (userAgent.includes('mac')) {
      return 'Touch ID'
    }
    
    return 'Biometric'
  }

  async register(userId: string): Promise<BiometricAuthResult> {
    if (!await this.isSupported()) {
      return {
        success: false,
        error: 'Biometric authentication is not supported on this device'
      }
    }

    try {
      // Check for Capacitor environment
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        // In Capacitor, we would use native biometric registration
        // For now, simulate successful registration
        this.credentialStorage.set(userId, 'native_credential_id')
        this.saveCredentialToStorage(userId, 'native_credential_id')
        return { success: true }
      }

      // Web environment - use WebAuthn
      const credentialId = this.generateCredentialId()
      const textEncoder = new TextEncoder()
      
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: {
          name: "VTopup",
          id: window.location.hostname,
        },
        user: {
          id: textEncoder.encode(userId),
          name: userId,
          displayName: userId,
        },
        pubKeyCredParams: [
          {
            alg: -7, // ES256
            type: "public-key"
          },
          {
            alg: -257, // RS256
            type: "public-key"
          }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          requireResidentKey: false
        },
        timeout: 60000,
        attestation: "direct"
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential

      if (credential) {
        const credentialIdString = Array.from(new Uint8Array(credential.rawId)).join(',')
        this.credentialStorage.set(userId, credentialIdString)
        this.saveCredentialToStorage(userId, credentialIdString)
        
        return {
          success: true,
          credential
        }
      } else {
        return {
          success: false,
          error: 'Failed to create biometric credential'
        }
      }
    } catch (error: any) {
      console.error('Biometric registration error:', error)
      
      let errorMessage = 'Biometric registration failed'
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Biometric registration was cancelled or not allowed'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Biometric authentication is not supported'
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security error during biometric registration'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async authenticate(userId: string, challenge: string = 'Authenticate transaction'): Promise<BiometricAuthResult> {
    if (!await this.isSupported()) {
      return {
        success: false,
        error: 'Biometric authentication is not supported on this device'
      }
    }

    try {
      // Check for Capacitor environment
      if (typeof window !== 'undefined' && (window as any).Capacitor) {
        // In Capacitor, we would use native biometric authentication
        // For now, simulate successful authentication
        const hasCredential = this.credentialStorage.has(userId) || this.getCredentialFromStorage(userId)
        if (!hasCredential) {
          return {
            success: false,
            error: 'No biometric credentials found. Please register first.'
          }
        }
        
        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { success: true }
      }

      // Web environment - use WebAuthn
      const storedCredentialId = this.credentialStorage.get(userId) || this.getCredentialFromStorage(userId)
      if (!storedCredentialId) {
        return {
          success: false,
          error: 'No biometric credentials found. Please register first.'
        }
      }

      const credentialId = new Uint8Array(storedCredentialId.split(',').map(Number))
      const textEncoder = new TextEncoder()

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: textEncoder.encode(challenge),
        allowCredentials: [{
          id: credentialId,
          type: 'public-key',
          transports: ['internal']
        }],
        userVerification: 'required',
        timeout: 60000
      }

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential

      if (credential) {
        return {
          success: true,
          credential
        }
      } else {
        return {
          success: false,
          error: 'Authentication failed'
        }
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error)
      
      let errorMessage = 'Authentication failed'
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Authentication was cancelled or not allowed'
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'No biometric credentials available'
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security error during authentication'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async hasCredentials(userId: string): Promise<boolean> {
    return this.credentialStorage.has(userId) || !!this.getCredentialFromStorage(userId)
  }

  async removeCredentials(userId: string): Promise<void> {
    this.credentialStorage.delete(userId)
    this.removeCredentialFromStorage(userId)
  }

  private generateCredentialId(): Uint8Array {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return array
  }

  private saveCredentialToStorage(userId: string, credentialId: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`vtopup_biometric_${userId}`, credentialId)
      }
    } catch (error) {
      console.error('Error saving credential to storage:', error)
    }
  }

  private getCredentialFromStorage(userId: string): string | null {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(`vtopup_biometric_${userId}`)
      }
    } catch (error) {
      console.error('Error getting credential from storage:', error)
    }
    return null
  }

  private removeCredentialFromStorage(userId: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`vtopup_biometric_${userId}`)
      }
    } catch (error) {
      console.error('Error removing credential from storage:', error)
    }
  }
}

export const biometricService = new BiometricService()
