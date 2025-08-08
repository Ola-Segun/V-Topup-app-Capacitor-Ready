"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Smartphone, Zap, Shield, Users, CreditCard, Bell, Camera, Fingerprint, Wifi, Battery, MapPin, Share2, Download, Palette, Globe, Database, Code, Rocket } from 'lucide-react'

export function AppCritique() {
  const strengths = [
    {
      category: "UI/UX Design",
      icon: Palette,
      items: [
        "Mobile-first responsive design with proper touch targets",
        "Modern Material Design 3 inspired interface",
        "Consistent color scheme and typography (Poppins font)",
        "Intuitive navigation with bottom tab bar",
        "Smooth animations and micro-interactions",
        "Dark/light theme support",
        "Premium visual hierarchy with cards and gradients"
      ]
    },
    {
      category: "Core Functionality",
      icon: Smartphone,
      items: [
        "Complete airtime/data top-up system",
        "Multi-service support (Cable TV, Electricity)",
        "Wallet management with funding options",
        "Transaction history and tracking",
        "User authentication and registration",
        "Admin dashboard for management",
        "Real-time transaction updates"
      ]
    },
    {
      category: "Security Features",
      icon: Shield,
      items: [
        "Biometric authentication (WebAuthn)",
        "Secure API endpoints with proper validation",
        "User session management",
        "Transaction PIN verification",
        "Encrypted data storage patterns",
        "Admin role-based access control"
      ]
    },
    {
      category: "Technical Architecture",
      icon: Code,
      items: [
        "Next.js 14 with App Router",
        "TypeScript for type safety",
        "Supabase integration for backend",
        "Modular component architecture",
        "Custom hooks for reusable logic",
        "Service layer abstraction",
        "PWA capabilities with service worker"
      ]
    }
  ]

  const weaknesses = [
    {
      category: "Native Mobile Integration",
      icon: Smartphone,
      severity: "high",
      items: [
        "No Capacitor/Cordova integration for native features",
        "Limited device API access (camera, contacts, etc.)",
        "No native app store deployment configuration",
        "Missing native splash screen and app icons",
        "No deep linking implementation",
        "Limited offline functionality",
        "No native push notification registration"
      ]
    },
    {
      category: "Performance & Optimization",
      icon: Zap,
      severity: "medium",
      items: [
        "No image optimization for mobile networks",
        "Missing lazy loading for heavy components",
        "No bundle splitting for faster initial load",
        "Limited caching strategies",
        "No performance monitoring",
        "Heavy animation libraries (Framer Motion) for mobile",
        "No network-aware loading states"
      ]
    },
    {
      category: "Mobile-Specific Features",
      icon: Bell,
      severity: "high",
      items: [
        "No haptic feedback integration",
        "Missing pull-to-refresh functionality",
        "No swipe gestures for navigation",
        "Limited accessibility features",
        "No voice input support",
        "Missing QR code scanning",
        "No location-based services",
        "No contact integration for quick transfers"
      ]
    },
    {
      category: "Data & Connectivity",
      icon: Database,
      severity: "medium",
      items: [
        "Limited offline data synchronization",
        "No background sync for failed transactions",
        "Missing data usage optimization",
        "No connection quality detection",
        "Limited error recovery mechanisms",
        "No local data persistence strategy"
      ]
    }
  ]

  const recommendations = [
    {
      category: "Immediate Improvements",
      icon: Rocket,
      priority: "High",
      items: [
        "Integrate Capacitor for native mobile deployment",
        "Implement haptic feedback for better UX",
        "Add pull-to-refresh on main screens",
        "Optimize images and implement lazy loading",
        "Add QR code scanning for quick payments",
        "Implement proper offline data caching",
        "Add swipe gestures for navigation"
      ]
    },
    {
      category: "Native Features Integration",
      icon: Fingerprint,
      priority: "High",
      items: [
        "Native biometric authentication (Touch ID/Face ID)",
        "Camera integration for document scanning",
        "Contact book integration for transfers",
        "Native push notifications with FCM",
        "Location services for nearby services",
        "Native sharing capabilities",
        "Device storage access for receipts"
      ]
    },
    {
      category: "Performance Enhancements",
      icon: Battery,
      priority: "Medium",
      items: [
        "Implement virtual scrolling for large lists",
        "Add progressive image loading",
        "Optimize bundle size with code splitting",
        "Implement service worker caching strategies",
        "Add performance monitoring and analytics",
        "Optimize animations for 60fps",
        "Implement background sync for offline actions"
      ]
    },
    {
      category: "User Experience",
      icon: Users,
      priority: "Medium",
      items: [
        "Add voice commands for accessibility",
        "Implement smart form auto-completion",
        "Add contextual help and onboarding",
        "Implement smart notifications",
        "Add transaction categorization",
        "Implement spending insights and analytics",
        "Add social features (referrals, sharing)"
      ]
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive"
      case "medium": return "secondary"
      case "low": return "outline"
      default: return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive"
      case "Medium": return "secondary"
      case "Low": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">TopUp Pro App Analysis</h1>
            <p className="text-gray-600 mt-2">Comprehensive critique and recommendations for mobile native integration</p>
          </div>
        </div>

        {/* Strengths Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Strengths</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {strengths.map((strength, index) => (
              <Card key={index} className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <strength.icon className="w-5 h-5" />
                    {strength.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {strength.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-green-700">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Weaknesses Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">Areas for Improvement</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {weaknesses.map((weakness, index) => (
              <Card key={index} className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-orange-800">
                    <weakness.icon className="w-5 h-5" />
                    {weakness.category}
                    <Badge variant={getSeverityColor(weakness.severity)} className="ml-auto">
                      {weakness.severity} priority
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {weakness.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-orange-700">
                        <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Rocket className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Recommendations</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {recommendations.map((recommendation, index) => (
              <Card key={index} className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <recommendation.icon className="w-5 h-5" />
                    {recommendation.category}
                    <Badge variant={getPriorityColor(recommendation.priority)} className="ml-auto">
                      {recommendation.priority}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recommendation.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm text-blue-700">
                        <Rocket className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Roadmap */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-800">
              <MapPin className="w-5 h-5" />
              Implementation Roadmap
            </CardTitle>
            <CardDescription>Suggested phases for mobile native integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="destructive">Phase 1</Badge>
                <span className="font-semibold">Foundation (2-3 weeks)</span>
              </div>
              <ul className="ml-6 space-y-1 text-sm text-gray-700">
                <li>• Set up Capacitor for native deployment</li>
                <li>• Implement haptic feedback and basic native features</li>
                <li>• Add pull-to-refresh and swipe gestures</li>
                <li>• Optimize performance and bundle size</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Phase 2</Badge>
                <span className="font-semibold">Native Integration (3-4 weeks)</span>
              </div>
              <ul className="ml-6 space-y-1 text-sm text-gray-700">
                <li>• Integrate camera for QR scanning and document capture</li>
                <li>• Add native biometric authentication</li>
                <li>• Implement contact book integration</li>
                <li>• Set up native push notifications</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline">Phase 3</Badge>
                <span className="font-semibold">Advanced Features (4-5 weeks)</span>
              </div>
              <ul className="ml-6 space-y-1 text-sm text-gray-700">
                <li>• Add location services and nearby features</li>
                <li>• Implement advanced offline capabilities</li>
                <li>• Add voice commands and accessibility features</li>
                <li>• Integrate analytics and performance monitoring</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technical Debt Summary */}
        <Card className="border-gray-200 bg-gray-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <Code className="w-5 h-5" />
              Technical Debt & Architecture Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Current Architecture Strengths:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Well-structured component hierarchy</li>
                  <li>• Proper separation of concerns</li>
                  <li>• Type-safe with TypeScript</li>
                  <li>• Modern React patterns and hooks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Areas Needing Refactoring:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Heavy reliance on client-side state</li>
                  <li>• Limited error boundary implementation</li>
                  <li>• Inconsistent loading state management</li>
                  <li>• Missing comprehensive testing setup</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
