import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.topuppro.app',
  appName: 'TopUp Pro',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // High Priority Plugins
    BiometricAuth: {
      reason: "Use biometric authentication to secure your transactions"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    Camera: {
      permissions: {
        camera: "This app needs camera access to scan QR codes and capture documents"
      }
    },
    BarcodeScanner: {
      targetedFormats: ["QR_CODE", "CODE_128", "CODE_39"]
    },
    Contacts: {
      permissions: {
        contacts: "Access contacts to quickly send money to friends and family"
      }
    },
    Haptics: {
      // No configuration needed
    },
    
    // Medium Priority Plugins
    Share: {
      // No configuration needed
    },
    SMS: {
      permissions: {
        sms: "Send SMS for transaction confirmations and OTP"
      }
    },
    Geolocation: {
      permissions: {
        location: "Find nearby agents and ATMs"
      }
    },
    Filesystem: {
      // No configuration needed
    },
    
    // Low Priority Plugins
    Network: {
      // No configuration needed
    },
    Device: {
      // No configuration needed
    }
  },
  ios: {
    scheme: 'TopUp Pro',
    contentInset: 'automatic',
    backgroundColor: '#ffffff'
  },
  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    buildOptions: {
      sourceCompatibility: "VERSION_17",
      targetCompatibility: "VERSION_17"
    }
  }
}

export default config