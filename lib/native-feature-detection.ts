export interface NativeCapabilities {
  isNative: boolean
  platform: 'web' | 'ios' | 'android'
  availableFeatures: string[]
  missingFeatures: string[]
}

export class NativeFeatureDetection {
  private static instance: NativeFeatureDetection
  private capabilities: NativeCapabilities

  private constructor() {
    this.capabilities = this.detectCapabilities()
  }

  public static getInstance(): NativeFeatureDetection {
    if (!NativeFeatureDetection.instance) {
      NativeFeatureDetection.instance = new NativeFeatureDetection()
    }
    return NativeFeatureDetection.instance
  }

  private detectCapabilities(): NativeCapabilities {
    const isNative = !!(window as any).Capacitor
    const platform = this.detectPlatform()
    const availableFeatures = this.detectAvailableFeatures()
    const missingFeatures = this.detectMissingFeatures(availableFeatures)

    return {
      isNative,
      platform,
      availableFeatures,
      missingFeatures
    }
  }

  private detectPlatform(): 'web' | 'ios' | 'android' {
    if (!(window as any).Capacitor) return 'web'
    
    const platform = (window as any).Capacitor.getPlatform()
    return platform === 'ios' ? 'ios' : platform === 'android' ? 'android' : 'web'
  }

  private detectAvailableFeatures(): string[] {
    const features: string[] = []

    // Web-based features (always available)
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) features.push('service_worker')
      if ('PushManager' in window) features.push('web_push')
      if ('geolocation' in navigator) features.push('web_geolocation')
      if ('vibrate' in navigator) features.push('web_vibration')
      if ('share' in navigator) features.push('web_share')
      if (window.PublicKeyCredential) features.push('webauthn')
      if ('indexedDB' in window) features.push('indexeddb')
      if ('localStorage' in window) features.push('local_storage')
    }

    // Native features (Capacitor)
    if ((window as any).Capacitor) {
      const plugins = (window as any).Capacitor.Plugins
      
      if (plugins.BiometricAuth) features.push('native_biometric')
      if (plugins.PushNotifications) features.push('native_push')
      if (plugins.Camera) features.push('native_camera')
      if (plugins.BarcodeScanner) features.push('qr_scanner')
      if (plugins.Contacts) features.push('native_contacts')
      if (plugins.Haptics) features.push('haptic_feedback')
      if (plugins.Share) features.push('native_share')
      if (plugins.SMS) features.push('sms_integration')
      if (plugins.Geolocation) features.push('native_geolocation')
      if (plugins.Filesystem) features.push('native_filesystem')
      if (plugins.Network) features.push('network_monitoring')
      if (plugins.Device) features.push('device_info')
    }

    return features
  }

  private detectMissingFeatures(available: string[]): string[] {
    const allPossibleFeatures = [
      'native_biometric', 'native_push', 'native_camera', 'qr_scanner',
      'native_contacts', 'haptic_feedback', 'native_share', 'sms_integration',
      'native_geolocation', 'native_filesystem', 'network_monitoring', 'device_info'
    ]

    return allPossibleFeatures.filter(feature => !available.includes(feature))
  }

  public getCapabilities(): NativeCapabilities {
    return this.capabilities
  }

  public hasFeature(feature: string): boolean {
    return this.capabilities.availableFeatures.includes(feature)
  }

  public isNativeApp(): boolean {
    return this.capabilities.isNative
  }

  public getPlatform(): 'web' | 'ios' | 'android' {
    return this.capabilities.platform
  }

  public getFeatureGaps(): { category: string; missing: string[]; impact: string }[] {
    const gaps = []

    if (!this.hasFeature('native_biometric')) {
      gaps.push({
        category: 'Authentication',
        missing: ['native_biometric'],
        impact: 'Limited to WebAuthn with poor mobile UX'
      })
    }

    if (!this.hasFeature('native_camera') || !this.hasFeature('qr_scanner')) {
      gaps.push({
        category: 'Camera & Scanning',
        missing: ['native_camera', 'qr_scanner'],
        impact: 'No QR code scanning, limited camera functionality'
      })
    }

    if (!this.hasFeature('native_contacts')) {
      gaps.push({
        category: 'Contact Integration',
        missing: ['native_contacts'],
        impact: 'Manual contact entry, no contact sync'
      })
    }

    if (!this.hasFeature('haptic_feedback')) {
      gaps.push({
        category: 'User Experience',
        missing: ['haptic_feedback'],
        impact: 'No tactile feedback, poor mobile UX'
      })
    }

    if (!this.hasFeature('native_push')) {
      gaps.push({
        category: 'Notifications',
        missing: ['native_push'],
        impact: 'Limited push notifications, poor engagement'
      })
    }

    return gaps
  }

  public generateMigrationPlan(): { phase: string; features: string[]; timeline: string; priority: string }[] {
    const missingFeatures = this.capabilities.missingFeatures

    return [
      {
        phase: 'Phase 1: Core Native Features',
        features: missingFeatures.filter(f => 
          ['native_biometric', 'native_push', 'haptic_feedback'].includes(f)
        ),
        timeline: '2-3 weeks',
        priority: 'High'
      },
      {
        phase: 'Phase 2: Camera & Scanning',
        features: missingFeatures.filter(f => 
          ['native_camera', 'qr_scanner'].includes(f)
        ),
        timeline: '1-2 weeks',
        priority: 'High'
      },
      {
        phase: 'Phase 3: Device Integration',
        features: missingFeatures.filter(f => 
          ['native_contacts', 'native_share', 'sms_integration'].includes(f)
        ),
        timeline: '2-3 weeks',
        priority: 'Medium'
      },
      {
        phase: 'Phase 4: System Features',
        features: missingFeatures.filter(f => 
          ['native_geolocation', 'native_filesystem', 'network_monitoring', 'device_info'].includes(f)
        ),
        timeline: '1-2 weeks',
        priority: 'Low'
      }
    ]
  }
}

// Export singleton instance
export const nativeFeatureDetection = NativeFeatureDetection.getInstance()
