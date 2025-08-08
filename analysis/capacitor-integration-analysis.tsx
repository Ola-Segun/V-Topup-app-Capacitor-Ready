"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Globe, Camera, Fingerprint, Bell, MapPin, Mic, Users, Wifi, Battery, Vibrate, QrCode, FileText, Share, Calendar, Phone, MessageSquare, Shield, Zap, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react'

interface FeatureComparison {
  category: string
  icon: any
  webFeatures: WebFeature[]
  nativeFeatures: NativeFeature[]
  priority: 'high' | 'medium' | 'low'
  complexity: 'easy' | 'medium' | 'hard'
}

interface WebFeature {
  name: string
  status: 'available' | 'limited' | 'unavailable'
  description: string
  limitations: string[]
}

interface NativeFeature {
  name: string
  plugin: string
  description: string
  benefits: string[]
  implementation: string
}

const featureCategories: FeatureComparison[] = [
  {
    category: "Authentication & Security",
    icon: Shield,
    priority: 'high',
    complexity: 'medium',
    webFeatures: [
      {
        name: "WebAuthn Biometric",
        status: 'limited',
        description: "Browser-based biometric authentication using WebAuthn API",
        limitations: [
          "Limited browser support",
          "No native biometric UI",
          "Platform-dependent reliability",
          "No fallback to device PIN"
        ]
      },
      {
        name: "Web Push Notifications",
        status: 'limited',
        description: "Browser push notifications with service worker",
        limitations: [
          "Requires user permission",
          "Limited on iOS Safari",
          "No background processing",
          "Basic notification UI"
        ]
      }
    ],
    nativeFeatures: [
      {
        name: "Native Biometric Authentication",
        plugin: "@capacitor/biometric-auth",
        description: "Full native biometric authentication with Face ID, Touch ID, Fingerprint",
        benefits: [
          "Native biometric UI",
          "Fallback to device PIN/Pattern",
          "Better security integration",
          "Consistent cross-platform experience"
        ],
        implementation: "BiometricAuth.authenticate({ reason: 'Authenticate to complete transaction' })"
      },
      {
        name: "Native Push Notifications",
        plugin: "@capacitor/push-notifications",
        description: "Full native push notification support with rich media",
        benefits: [
          "Rich notifications with images",
          "Background processing",
          "Better delivery rates",
          "Native notification management"
        ],
        implementation: "PushNotifications.register() + FCM/APNs integration"
      }
    ]
  },
  {
    category: "Camera & Media",
    icon: Camera,
    priority: 'high',
    complexity: 'easy',
    webFeatures: [
      {
        name: "Web Camera API",
        status: 'limited',
        description: "Basic camera access through getUserMedia API",
        limitations: [
          "Limited camera controls",
          "No native camera UI",
          "Poor image quality optimization",
          "No document scanning features"
        ]
      },
      {
        name: "File Upload",
        status: 'available',
        description: "Standard HTML file input for document uploads",
        limitations: [
          "No camera integration",
          "Limited file type detection",
          "No image processing",
          "Poor mobile UX"
        ]
      }
    ],
    nativeFeatures: [
      {
        name: "Native Camera",
        plugin: "@capacitor/camera",
        description: "Full native camera integration with editing capabilities",
        benefits: [
          "Native camera UI",
          "Image editing and cropping",
          "Multiple source options",
          "Optimized image compression"
        ],
        implementation: "Camera.getPhoto({ quality: 90, allowEditing: true, resultType: CameraResultType.DataUrl })"
      },
      {
        name: "QR Code Scanner",
        plugin: "@capacitor-community/barcode-scanner",
        description: "Native barcode and QR code scanning",
        benefits: [
          "Fast scanning performance",
          "Multiple format support",
          "Real-time scanning",
          "Native scanning UI"
        ],
        implementation: "BarcodeScanner.startScan() with camera overlay"
      }
    ]
  },
  {
    category: "Device Integration",
    icon: Smartphone,
    priority: 'high',
    complexity: 'medium',
    webFeatures: [
      {
        name: "Web Contacts API",
        status: 'unavailable',
        description: "Very limited browser support for contacts",
        limitations: [
          "No browser support",
          "Privacy restrictions",
          "No contact management",
          "Limited to Chrome origin trials"
        ]
      },
      {
        name: "Web Vibration API",
        status: 'limited',
        description: "Basic vibration patterns through navigator.vibrate",
        limitations: [
          "No iOS support",
          "Limited pattern control",
          "No haptic feedback types",
          "Poor user experience"
        ]
      }
    ],
    nativeFeatures: [
      {
        name: "Native Contacts",
        plugin: "@capacitor-community/contacts",
        description: "Full contact book integration with read/write access",
        benefits: [
          "Complete contact access",
          "Contact creation/editing",
          "Phone number validation",
          "Contact synchronization"
        ],
        implementation: "Contacts.getContacts() with permission handling"
      },
      {
        name: "Haptic Feedback",
        plugin: "@capacitor/haptics",
        description: "Rich haptic feedback with multiple patterns",
        benefits: [
          "Multiple haptic types",
          "iOS and Android support",
          "Better user feedback",
          "Accessibility improvements"
        ],
        implementation: "Haptics.impact({ style: ImpactStyle.Medium })"
      }
    ]
  },
  {
    category: "Communication",
    icon: MessageSquare,
    priority: 'medium',
    complexity: 'easy',
    webFeatures: [
      {
        name: "Web Share API",
        status: 'limited',
        description: "Basic sharing through navigator.share",
        limitations: [
          "Limited browser support",
          "No native share sheet",
          "Limited sharing options",
          "No file sharing"
        ]
      },
      {
        name: "SMS Links",
        status: 'available',
        description: "SMS links using tel: and sms: protocols",
        limitations: [
          "No direct SMS sending",
          "No message composition",
          "Platform-dependent behavior",
          "No delivery confirmation"
        ]
      }
    ],
    nativeFeatures: [
      {
        name: "Native Sharing",
        plugin: "@capacitor/share",
        description: "Native share sheet with multiple options",
        benefits: [
          "Native share UI",
          "Multiple sharing options",
          "File and text sharing",
          "Better user experience"
        ],
        implementation: "Share.share({ title: 'Transaction Receipt', text: 'Your transaction was successful' })"
      },
      {
        name: "SMS Integration",
        plugin: "@capacitor-community/sms",
        description: "Direct SMS sending and management",
        benefits: [
          "Direct SMS sending",
          "Message composition",
          "Delivery status",
          "Contact integration"
        ],
        implementation: "SMS.send({ numbers: ['1234567890'], text: 'Your OTP is 123456' })"
      }
    ]
  },
  {
    category: "Location & Maps",
    icon: MapPin,
    priority: 'medium',
    complexity: 'medium',
    webFeatures: [
      {
        name: "Web Geolocation API",
        status: 'limited',
        description: "Basic location access through navigator.geolocation",
        limitations: [
          "Requires user permission",
          "Limited accuracy",
          "No background location",
          "Battery intensive"
        ]
      }
    ],
    nativeFeatures: [
      {
        name: "Native Geolocation",
        plugin: "@capacitor/geolocation",
        description: "Enhanced location services with background support",
        benefits: [
          "Better accuracy",
          "Background location",
          "Location watching",
          "Power optimization"
        ],
        implementation: "Geolocation.getCurrentPosition({ enableHighAccuracy: true })"
      }
    ]
  },
  {
    category: "Storage & Files",
    icon: FileText,
    priority: 'medium',
    complexity: 'easy',
    webFeatures: [
      {
        name: "Web Storage APIs",
        status: 'available',
        description: "localStorage, sessionStorage, and IndexedDB",
        limitations: [
          "Storage quotas",
          "No file system access",
          "Limited to web context",
          "No native file integration"
        ]
      }
    ],
    nativeFeatures: [
      {
        name: "Native File System",
        plugin: "@capacitor/filesystem",
        description: "Full file system access with native integration",
        benefits: [
          "File system access",
          "Document directory access",
          "File sharing integration",
          "Better storage management"
        ],
        implementation: "Filesystem.writeFile({ path: 'receipt.pdf', data: base64Data })"
      }
    ]
  },
  {
    category: "Network & Connectivity",
    icon: Wifi,
    priority: 'low',
    complexity: 'easy',
    webFeatures: [
      {
        name: "Network Information API",
        status: 'limited',
        description: "Basic network status through navigator.onLine",
        limitations: [
          "Limited network info",
          "No connection quality",
          "No network type detection",
          "Basic online/offline status"
        ]
      }
    ],
    nativeFeatures: [
      {
        name: "Network Status",
        plugin: "@capacitor/network",
        description: "Detailed network information and monitoring",
        benefits: [
          "Connection type detection",
          "Network quality monitoring",
          "Real-time status updates",
          "Better offline handling"
        ],
        implementation: "Network.getStatus() + Network.addListener('networkStatusChange')"
      }
    ]
  },
  {
    category: "Device Information",
    icon: Battery,
    priority: 'low',
    complexity: 'easy',
    webFeatures: [
      {
        name: "Web Device APIs",
        status: 'limited',
        description: "Limited device information through navigator",
        limitations: [
          "Basic device info only",
          "No battery status",
          "No device ID",
          "Privacy restrictions"
        ]
      }
    ],
    nativeFeatures: [
      {
        name: "Device Information",
        plugin: "@capacitor/device",
        description: "Comprehensive device information and status",
        benefits: [
          "Complete device info",
          "Battery status",
          "Device ID generation",
          "Platform-specific details"
        ],
        implementation: "Device.getInfo() + Device.getBatteryInfo()"
      }
    ]
  }
]

export function CapacitorIntegrationAnalysis() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'limited':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'unavailable':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Capacitor Integration Analysis</h1>
        <p className="text-muted-foreground">
          Detailed comparison of web vs native capabilities for TopUp Pro mobile app
        </p>
      </div>

      <Alert className="mb-6">
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>Current Status:</strong> Web-based PWA with limited native capabilities. 
          Capacitor integration will unlock full native mobile features and app store deployment.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4">
            {featureCategories.map((category, index) => {
              const Icon = category.icon
              const webAvailable = category.webFeatures.filter(f => f.status === 'available').length
              const webLimited = category.webFeatures.filter(f => f.status === 'limited').length
              const webUnavailable = category.webFeatures.filter(f => f.status === 'unavailable').length
              const nativeCount = category.nativeFeatures.length

              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.category}</CardTitle>
                          <CardDescription>
                            {category.webFeatures.length} web features → {nativeCount} native features
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(category.priority)}>
                          {category.priority} priority
                        </Badge>
                        <Badge className={getComplexityColor(category.complexity)}>
                          {category.complexity}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Web Capabilities
                        </h4>
                        <div className="space-y-1">
                          {webAvailable > 0 && (
                            <div className="flex items-center text-sm text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {webAvailable} available
                            </div>
                          )}
                          {webLimited > 0 && (
                            <div className="flex items-center text-sm text-yellow-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {webLimited} limited
                            </div>
                          )}
                          {webUnavailable > 0 && (
                            <div className="flex items-center text-sm text-red-600">
                              <XCircle className="w-3 h-3 mr-1" />
                              {webUnavailable} unavailable
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center">
                          <Smartphone className="w-4 h-4 mr-2" />
                          Native Capabilities
                        </h4>
                        <div className="flex items-center text-sm text-blue-600">
                          <Zap className="w-3 h-3 mr-1" />
                          {nativeCount} enhanced features
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {featureCategories.map((category, categoryIndex) => {
            const Icon = category.icon
            return (
              <Card key={categoryIndex}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle>{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Web Features */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        Current Web Implementation
                      </h3>
                      {category.webFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{feature.name}</h4>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(feature.status)}
                              <Badge variant="outline" className="text-xs">
                                {feature.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          {feature.limitations.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-red-600">Limitations:</p>
                              <ul className="text-xs text-red-600 space-y-1">
                                {feature.limitations.map((limitation, limitIndex) => (
                                  <li key={limitIndex} className="flex items-start">
                                    <span className="mr-1">•</span>
                                    {limitation}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Native Features */}
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center">
                        <Smartphone className="w-5 h-5 mr-2" />
                        Native Capacitor Implementation
                      </h3>
                      {category.nativeFeatures.map((feature, featureIndex) => (
                        <div key={featureIndex} className="border rounded-lg p-4 space-y-3 bg-blue-50/50">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{feature.name}</h4>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {feature.plugin}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          {feature.benefits.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-green-600">Benefits:</p>
                              <ul className="text-xs text-green-600 space-y-1">
                                {feature.benefits.map((benefit, benefitIndex) => (
                                  <li key={benefitIndex} className="flex items-start">
                                    <CheckCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="bg-gray-100 rounded p-2">
                            <p className="text-xs font-mono text-gray-700">{feature.implementation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Roadmap</CardTitle>
              <CardDescription>
                Step-by-step guide to integrate Capacitor and unlock native features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Initial Capacitor Setup</h3>
                    <p className="text-sm text-muted-foreground">Install and configure Capacitor for iOS and Android</p>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                      npm install @capacitor/core @capacitor/cli<br/>
                      npx cap init TopUpPro com.topuppro.app<br/>
                      npm install @capacitor/ios @capacitor/android
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">High Priority Plugins</h3>
                    <p className="text-sm text-muted-foreground">Install essential native functionality</p>
                    <div className="mt-2 space-y-1">
                      {featureCategories
                        .filter(cat => cat.priority === 'high')
                        .map((cat, index) => (
                          <div key={index} className="text-xs">
                            <strong>{cat.category}:</strong> {cat.nativeFeatures.map(f => f.plugin).join(', ')}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Medium Priority Features</h3>
                    <p className="text-sm text-muted-foreground">Add enhanced user experience features</p>
                    <div className="mt-2 space-y-1">
                      {featureCategories
                        .filter(cat => cat.priority === 'medium')
                        .map((cat, index) => (
                          <div key={index} className="text-xs">
                            <strong>{cat.category}:</strong> {cat.nativeFeatures.map(f => f.plugin).join(', ')}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Platform Configuration</h3>
                    <p className="text-sm text-muted-foreground">Configure iOS and Android specific settings</p>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                      npx cap add ios<br/>
                      npx cap add android<br/>
                      npx cap sync
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">App Store Deployment</h3>
                    <p className="text-sm text-muted-foreground">Build and deploy to iOS App Store and Google Play</p>
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                      npx cap build ios<br/>
                      npx cap build android<br/>
                      npx cap open ios # Xcode<br/>
                      npx cap open android # Android Studio
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <ArrowRight className="h-4 w-4" />
                <AlertDescription>
                  <strong>Estimated Timeline:</strong> 6-8 weeks for complete native integration with all high and medium priority features.
                  This includes development, testing, and app store submission process.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
