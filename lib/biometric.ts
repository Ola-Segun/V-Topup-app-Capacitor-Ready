export interface BiometricResult {
  success: boolean
  error?: string
  credential?: PublicKeyCredential
}

export interface BiometricCapabilities {
  isSupported: boolean
  availableAuthenticators: string[]
  biometryType: string
}

class BiometricAuth {
  private isWebAuthnSupported(): boolean {
    return !!(navigator.credentials && navigator.credentials.create && navigator.credentials.get && window.PublicKeyCredential)
  }

  async isBiometricSupported(): Promise<boolean> {
    if (!this.isWebAuthnSupported()) {
      return false
    }

    try {
      // Check if platform authenticator is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      return available
    } catch (error) {
      console.error('Error checking biometric support:', error)
      return false
    }
  }

  getBiometryType(): string {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return 'Touch ID / Face ID'
    } else if (userAgent.includes('android')) {
      return 'Fingerprint'
    } else if (userAgent.includes('windows')) {
      return 'Windows Hello'
    } else if (userAgent.includes('mac')) {
      return 'Touch ID'
    }
    
    return 'Biometric'
  }

  async getCapabilities(): Promise<BiometricCapabilities> {
    const isSupported = await this.isBiometricSupported()
    const biometryType = this.getBiometryType()
    
    return {
      isSupported,
      availableAuthenticators: isSupported ? ['platform'] : [],
      biometryType
    }
  }

  private generateCredentialId(): Uint8Array {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return array
  }

  private textEncoder = new TextEncoder()

  async enroll(username: string = 'user'): Promise<BiometricResult> {
    if (!await this.isBiometricSupported()) {
      return {
        success: false,
        error: 'Biometric authentication is not supported on this device'
      }
    }

    try {
      const credentialId = this.generateCredentialId()
      
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: {
          name: "VTopup",
          id: window.location.hostname,
        },
        user: {
          id: this.textEncoder.encode(username),
          name: username,
          displayName: username,
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
        // Store credential ID for future authentication
        localStorage.setItem('vtopup_biometric_credential_id', Array.from(new Uint8Array(credential.rawId)).join(','))
        
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
      console.error('Biometric enrollment error:', error)
      
      let errorMessage = 'Biometric enrollment failed'
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Biometric enrollment was cancelled or not allowed'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Biometric authentication is not supported'
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security error during biometric enrollment'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async authenticate(challenge: string = 'Authenticate transaction'): Promise<BiometricResult> {
    if (!await this.isBiometricSupported()) {
      return {
        success: false,
        error: 'Biometric authentication is not supported on this device'
      }
    }

    try {
      const storedCredentialId = localStorage.getItem('vtopup_biometric_credential_id')
      if (!storedCredentialId) {
        return {
          success: false,
          error: 'No biometric credentials found. Please enroll first.'
        }
      }

      const credentialId = new Uint8Array(storedCredentialId.split(',').map(Number))

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: this.textEncoder.encode(challenge),
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

  async isEnrolled(): Promise<boolean> {
    const credentialId = localStorage.getItem('vtopup_biometric_credential_id')
    return !!credentialId
  }

  async removeCredentials(): Promise<void> {
    localStorage.removeItem('vtopup_biometric_credential_id')
  }
}

export const biometricAuth = new BiometricAuth()
