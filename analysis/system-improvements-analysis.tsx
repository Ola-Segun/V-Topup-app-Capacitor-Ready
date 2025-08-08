"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, Shield, Smartphone, Wifi, Tv, Zap, CreditCard, Building, Car, Gamepad2, GraduationCap, Heart, Plane, ShoppingCart, Banknote, AlertTriangle, CheckCircle, Clock, TrendingUp, Settings, Database, Bell, FileText, BarChart3, UserCheck, Wallet } from 'lucide-react'

export function SystemImprovementsAnalysis() {
  const currentProgress = {
    admin: 65,
    user: 70,
    overall: 67
  }

  const adminImprovements = [
    {
      category: "User Management",
      priority: "High",
      status: "Partial",
      items: [
        "Real-time user activity monitoring",
        "Bulk user operations (suspend/activate)",
        "Advanced user search and filtering",
        "User communication tools (SMS/Email)",
        "KYC document verification workflow"
      ]
    },
    {
      category: "Transaction Management",
      priority: "High", 
      status: "Partial",
      items: [
        "Real-time transaction monitoring",
        "Failed transaction retry mechanism",
        "Bulk transaction processing",
        "Transaction dispute resolution",
        "Automated refund processing"
      ]
    },
    {
      category: "Analytics & Reporting",
      priority: "Medium",
      status: "Basic",
      items: [
        "Revenue analytics with forecasting",
        "User behavior analytics",
        "Service performance metrics",
        "Custom report generation",
        "Data export capabilities"
      ]
    },
    {
      category: "System Configuration",
      priority: "High",
      status: "Missing",
      items: [
        "Service provider management",
        "Commission rate configuration",
        "Fee structure management",
        "System maintenance mode",
        "API rate limiting controls"
      ]
    }
  ]

  const userImprovements = [
    {
      category: "Transaction Experience",
      priority: "High",
      status: "Good",
      items: [
        "Transaction scheduling/recurring payments",
        "Favorite recipients management",
        "Transaction templates",
        "Quick repeat transactions",
        "Transaction status notifications"
      ]
    },
    {
      category: "Wallet Management",
      priority: "High",
      status: "Partial",
      items: [
        "Multiple funding methods (Bank, Card, USSD)",
        "Wallet-to-wallet transfers",
        "Spending limits and controls",
        "Transaction categorization",
        "Budget tracking and alerts"
      ]
    },
    {
      category: "User Experience",
      priority: "Medium",
      status: "Good",
      items: [
        "Dark/Light theme toggle",
        "Personalized dashboard",
        "Transaction search and filters",
        "Export transaction history",
        "Multi-language support"
      ]
    },
    {
      category: "Security & Verification",
      priority: "High",
      status: "Partial",
      items: [
        "Two-factor authentication",
        "Transaction PIN verification",
        "Device management",
        "Login activity monitoring",
        "Suspicious activity alerts"
      ]
    }
  ]

  const additionalTransactionTypes = [
    {
      category: "Financial Services",
      icon: Banknote,
      color: "text-green-600",
      services: [
        "Bank Transfer",
        "Mobile Money (MTN MoMo, Airtel Money)",
        "Wallet Top-up",
        "Bill Splitting",
        "Savings/Investment"
      ]
    },
    {
      category: "Government Services",
      icon: Building,
      color: "text-blue-600", 
      services: [
        "Tax Payments",
        "Vehicle Registration",
        "Driver's License Renewal",
        "Passport Fees",
        "Court Fines"
      ]
    },
    {
      category: "Education",
      icon: GraduationCap,
      color: "text-purple-600",
      services: [
        "School Fees",
        "WAEC/NECO Registration",
        "JAMB Registration",
        "Online Course Payments",
        "Library Fines"
      ]
    },
    {
      category: "Entertainment & Gaming",
      icon: Gamepad2,
      color: "text-orange-600",
      services: [
        "Gaming Credits (Steam, PlayStation, Xbox)",
        "Streaming Services (Netflix, Spotify)",
        "Event Tickets",
        "Movie Tickets",
        "Sports Betting"
      ]
    },
    {
      category: "Transportation",
      icon: Car,
      color: "text-red-600",
      services: [
        "Fuel Payments",
        "Toll Payments",
        "Parking Fees",
        "Public Transport Cards",
        "Ride-hailing Credits"
      ]
    },
    {
      category: "Healthcare",
      icon: Heart,
      color: "text-pink-600",
      services: [
        "Hospital Bills",
        "Insurance Premiums",
        "Pharmacy Payments",
        "Telemedicine Consultations",
        "Health Checkup Packages"
      ]
    },
    {
      category: "Travel & Hospitality",
      icon: Plane,
      color: "text-indigo-600",
      services: [
        "Flight Bookings",
        "Hotel Reservations",
        "Travel Insurance",
        "Visa Application Fees",
        "Car Rental"
      ]
    },
    {
      category: "E-commerce & Shopping",
      icon: ShoppingCart,
      color: "text-teal-600",
      services: [
        "Online Shopping Payments",
        "Gift Cards",
        "Loyalty Points Top-up",
        "Marketplace Payments",
        "Subscription Boxes"
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good": return "bg-green-500/20 text-green-600 border-green-500/30"
      case "Partial": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      case "Basic": return "bg-orange-500/20 text-orange-600 border-orange-500/30"
      case "Missing": return "bg-red-500/20 text-red-600 border-red-500/30"
      default: return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-600 border-red-500/30"
      case "Medium": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      case "Low": return "bg-green-500/20 text-green-600 border-green-500/30"
      default: return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">System Improvements Analysis</h1>
        <p className="text-muted-foreground">TopUp Pro - Airtime, Data & Bills Payment Platform</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            System Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Admin Dashboard</span>
              <span>{currentProgress.admin}%</span>
            </div>
            <Progress value={currentProgress.admin} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>User Experience</span>
              <span>{currentProgress.user}%</span>
            </div>
            <Progress value={currentProgress.user} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span>Overall System</span>
              <span>{currentProgress.overall}%</span>
            </div>
            <Progress value={currentProgress.overall} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="admin">Admin Improvements</TabsTrigger>
          <TabsTrigger value="user">User Improvements</TabsTrigger>
          <TabsTrigger value="services">Additional Services</TabsTrigger>
        </TabsList>

        {/* Admin Improvements */}
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Admin Dashboard Improvements Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {adminImprovements.map((improvement, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{improvement.category}</h3>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(improvement.priority)}>
                          {improvement.priority}
                        </Badge>
                        <Badge className={getStatusColor(improvement.status)}>
                          {improvement.status}
                        </Badge>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {improvement.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Improvements */}
        <TabsContent value="user" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                User Experience Improvements Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {userImprovements.map((improvement, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{improvement.category}</h3>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(improvement.priority)}>
                          {improvement.priority}
                        </Badge>
                        <Badge className={getStatusColor(improvement.status)}>
                          {improvement.status}
                        </Badge>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {improvement.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Additional Services */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Additional Transaction Types & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalTransactionTypes.map((category, index) => {
                  const Icon = category.icon
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center mr-3">
                          <Icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <h3 className="font-semibold">{category.category}</h3>
                      </div>
                      <ul className="space-y-2">
                        {category.services.map((service, serviceIndex) => (
                          <li key={serviceIndex} className="flex items-center text-sm">
                            <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-2" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Implementation Priority */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Implementation Priority Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="font-semibold">Phase 1 (Weeks 1-2)</span>
              </div>
              <Badge className="bg-red-500/20 text-red-600 border-red-500/30">Critical</Badge>
            </div>
            <ul className="ml-7 space-y-1 text-sm">
              <li>• Service provider management system</li>
              <li>• Real-time transaction monitoring</li>
              <li>• Failed transaction retry mechanism</li>
              <li>• Two-factor authentication</li>
            </ul>

            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-semibold">Phase 2 (Weeks 3-4)</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Important</Badge>
            </div>
            <ul className="ml-7 space-y-1 text-sm">
              <li>• Advanced analytics and reporting</li>
              <li>• Multiple wallet funding methods</li>
              <li>• Transaction scheduling</li>
              <li>• User communication tools</li>
            </ul>

            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-semibold">Phase 3 (Weeks 5-6)</span>
              </div>
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Enhancement</Badge>
            </div>
            <ul className="ml-7 space-y-1 text-sm">
              <li>• Additional service integrations</li>
              <li>• Advanced user experience features</li>
              <li>• Multi-language support</li>
              <li>• Custom reporting tools</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
