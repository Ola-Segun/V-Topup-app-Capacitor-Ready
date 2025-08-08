"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Smartphone, Wifi, Tv, Zap, CreditCard, Building, Car, GraduationCap, Heart, Plane, ShoppingCart, Search, Filter, Star, Clock, TrendingUp, Gift, Percent, Bell, CheckCircle, AlertTriangle, Info, Loader2, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { PremiumAirtimeTopup } from "@/components/services/premium-airtime-topup"
import { PremiumDataTopup } from "@/components/services/premium-data-topup"
import { PremiumCableTopup } from "@/components/services/premium-cable-topup"
import { PremiumElectricityTopup } from "@/components/services/premium-electricity-topup"
import { toast } from "sonner"

interface ServiceCategory {
  id: string
  name: string
  icon: any
  color: string
  bgColor: string
  services: Service[]
  isPopular?: boolean
}

interface Service {
  id: string
  name: string
  description: string
  icon: any
  status: 'active' | 'maintenance' | 'inactive'
  discount?: number
  isNew?: boolean
  estimatedTime: string
  fee: string
}

interface Promotion {
  id: string
  title: string
  description: string
  discount: number
  code: string
  validUntil: string
  category: string
  isActive: boolean
}

interface RecentTransaction {
  id: string
  type: string
  description: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  timestamp: string
}

const serviceCategories: ServiceCategory[] = [
  {
    id: 'mobile',
    name: 'Mobile Services',
    icon: Smartphone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    isPopular: true,
    services: [
      {
        id: 'airtime',
        name: 'Airtime Topup',
        description: 'Buy airtime for all networks',
        icon: Smartphone,
        status: 'active',
        discount: 2,
        estimatedTime: 'Instant',
        fee: '₦0'
      },
      {
        id: 'data',
        name: 'Data Bundles',
        description: 'Purchase data plans',
        icon: Wifi,
        status: 'active',
        discount: 5,
        estimatedTime: 'Instant',
        fee: '₦0'
      }
    ]
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    services: [
      {
        id: 'electricity',
        name: 'Electricity Bills',
        description: 'Pay electricity bills',
        icon: Zap,
        status: 'active',
        estimatedTime: '2-5 minutes',
        fee: '₦50'
      },
      {
        id: 'cable',
        name: 'Cable TV',
        description: 'Subscribe to cable TV',
        icon: Tv,
        status: 'active',
        estimatedTime: '2-5 minutes',
        fee: '₦50'
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial Services',
    icon: CreditCard,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    services: [
      {
        id: 'wallet_funding',
        name: 'Fund Wallet',
        description: 'Add money to wallet',
        icon: CreditCard,
        status: 'active',
        estimatedTime: 'Instant',
        fee: 'Varies'
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Transfer to bank account',
        icon: Building,
        status: 'maintenance',
        isNew: true,
        estimatedTime: '10-30 minutes',
        fee: '₦25'
      }
    ]
  },
  {
    id: 'transport',
    name: 'Transportation',
    icon: Car,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    services: [
      {
        id: 'fuel_payment',
        name: 'Fuel Payment',
        description: 'Pay for fuel at stations',
        icon: Car,
        status: 'inactive',
        isNew: true,
        estimatedTime: 'Instant',
        fee: '₦10'
      }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-500/10',
    services: [
      {
        id: 'school_fees',
        name: 'School Fees',
        description: 'Pay school fees',
        icon: GraduationCap,
        status: 'inactive',
        isNew: true,
        estimatedTime: '5-10 minutes',
        fee: '₦100'
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    services: [
      {
        id: 'health_insurance',
        name: 'Health Insurance',
        description: 'Pay insurance premiums',
        icon: Heart,
        status: 'inactive',
        isNew: true,
        estimatedTime: '5-10 minutes',
        fee: '₦50'
      }
    ]
  }
]

const promotions: Promotion[] = [
  {
    id: '1',
    title: '5% Off Data Bundles',
    description: 'Get 5% discount on all data purchases',
    discount: 5,
    code: 'DATA5',
    validUntil: '2024-02-29',
    category: 'data',
    isActive: true
  },
  {
    id: '2',
    title: 'Free Airtime Bonus',
    description: 'Get ₦100 bonus on ₦1000+ airtime purchase',
    discount: 10,
    code: 'AIRTIME100',
    validUntil: '2024-02-15',
    category: 'airtime',
    isActive: true
  },
  {
    id: '3',
    title: 'Electricity Bill Cashback',
    description: 'Get 2% cashback on electricity payments',
    discount: 2,
    code: 'POWER2',
    validUntil: '2024-03-31',
    category: 'electricity',
    isActive: true
  }
]

const quickAmounts = [500, 1000, 2000, 5000, 10000]

export function EnhancedServiceHub() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, string>>({})

  // Load recent transactions and service statuses
  useEffect(() => {
    loadRecentTransactions()
    loadServiceStatuses()
  }, [])

  const loadRecentTransactions = async () => {
    try {
      // Simulate API call
      const mockTransactions: RecentTransaction[] = [
        {
          id: '1',
          type: 'airtime',
          description: 'MTN Airtime - 08012345678',
          amount: 1000,
          status: 'completed',
          timestamp: '2 minutes ago'
        },
        {
          id: '2',
          type: 'data',
          description: 'Airtel 5GB Data - 08087654321',
          amount: 2500,
          status: 'completed',
          timestamp: '1 hour ago'
        },
        {
          id: '3',
          type: 'electricity',
          description: 'EKEDC Payment - 12345678901',
          amount: 5000,
          status: 'pending',
          timestamp: '3 hours ago'
        }
      ]
      setRecentTransactions(mockTransactions)
    } catch (error) {
      console.error('Failed to load recent transactions:', error)
    }
  }

  const loadServiceStatuses = async () => {
    try {
      // Simulate API call to check service statuses
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const statuses = {
        airtime: 'active',
        data: 'active',
        electricity: 'active',
        cable: 'active',
        wallet_funding: 'active',
        bank_transfer: 'maintenance'
      }
      setServiceStatuses(statuses)
    } catch (error) {
      console.error('Failed to load service statuses:', error)
    }
  }

  const refreshServiceStatuses = async () => {
    setIsLoading(true)
    try {
      await loadServiceStatuses()
      toast.success('Service statuses updated')
    } catch (error) {
      toast.error('Failed to refresh service statuses')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCategories = serviceCategories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return category.name.toLowerCase().includes(query) ||
             category.services.some(service => 
               service.name.toLowerCase().includes(query) ||
               service.description.toLowerCase().includes(query)
             )
    }
    
    return true
  })

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'airtime': return Smartphone
      case 'data': return Wifi
      case 'electricity': return Zap
      case 'cable': return Tv
      case 'wallet_funding': return CreditCard
      case 'bank_transfer': return Building
      default: return CreditCard
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      case 'maintenance': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
      case 'inactive': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'maintenance': return AlertTriangle
      case 'inactive': return AlertTriangle
      default: return Info
    }
  }

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handleCloseService = () => {
    setSelectedService(null)
  }

  const renderServiceDialog = () => {
    switch (selectedService) {
      case 'airtime':
        return <PremiumAirtimeTopup onClose={handleCloseService} />
      case 'data':
        return <PremiumDataTopup onClose={handleCloseService} />
      case 'cable':
        return <PremiumCableTopup onClose={handleCloseService} />
      case 'electricity':
        return <PremiumElectricityTopup onClose={handleCloseService} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <PremiumMobileNav />

      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold mb-2">Services</h1>
            <p className="text-muted-foreground">Choose from our wide range of services</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshServiceStatuses}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </motion.div>

        {/* Active Promotions */}
        {promotions.filter(p => p.isActive).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-5 h-5" />
                    <span className="font-semibold">Active Promotions</span>
                  </div>
                  <Badge className="bg-white/20 text-white border-0">
                    {promotions.filter(p => p.isActive).length} Active
                  </Badge>
                </div>
                <div className="space-y-2">
                  {promotions.filter(p => p.isActive).slice(0, 2).map((promo, index) => (
                    <motion.div
                      key={promo.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">{promo.title}</p>
                        <p className="text-xs text-white/80">{promo.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{promo.discount}% OFF</p>
                        <p className="text-xs text-white/80">Code: {promo.code}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-0">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 bg-background/50 border-border/50">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {serviceCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {quickAmounts.map((amount, index) => (
                  <motion.div
                    key={amount}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleServiceSelect('airtime')}
                      className="h-12 w-full bg-background/50 hover:bg-background/80 flex flex-col"
                    >
                      <span className="text-xs">₦{amount}</span>
                      <span className="text-xs text-muted-foreground">Airtime</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Service Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <AnimatePresence>
            {filteredCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <Card className="glass-card border-0">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center">
                          <div className={`p-2 rounded-lg ${category.bgColor} mr-3`}>
                            <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                          </div>
                          {category.name}
                          {category.isPopular && (
                            <Badge className="ml-2 bg-orange-100 text-orange-800 border-0">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.services.map((service, serviceIndex) => {
                          const ServiceIcon = service.icon
                          const StatusIcon = getStatusIcon(serviceStatuses[service.id] || service.status)
                          const status = serviceStatuses[service.id] || service.status
                          
                          return (
                            <motion.div
                              key={service.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + serviceIndex * 0.1 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                                status === 'active' 
                                  ? 'border-border/50 hover:border-primary/50 bg-background/30 hover:bg-background/50' 
                                  : 'border-border/30 bg-background/20 opacity-60 cursor-not-allowed'
                              }`}
                              onClick={() => status === 'active' && handleServiceSelect(service.id)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="p-3 bg-background/50 rounded-lg border border-border/30">
                                    <ServiceIcon className={`w-6 h-6 ${category.color}`} />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-sm">{service.name}</h3>
                                    <p className="text-xs text-muted-foreground">{service.description}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                  {service.discount && (
                                    <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                                      <Percent className="w-3 h-3 mr-1" />
                                      {service.discount}% OFF
                                    </Badge>
                                  )}
                                  {service.isNew && (
                                    <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">
                                      New
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>Fee: {service.fee}</span>
                                  <span>Time: {service.estimatedTime}</span>
                                </div>
                                <Badge className={`text-xs ${getStatusColor(status)} border-0`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {status === 'active' ? 'Available' : status === 'maintenance' ? 'Maintenance' : 'Unavailable'}
                                </Badge>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 3).map((transaction, index) => {
                    const ServiceIcon = getServiceIcon(transaction.type)
                    
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center border border-border/30">
                            <ServiceIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">₦{transaction.amount.toLocaleString()}</p>
                          <Badge className={`text-xs ${getStatusColor(transaction.status)} border-0`}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Service Usage Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Save frequently used recipients in your contacts for faster transactions. 
              Enable notifications to get instant updates on your transactions.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>

      {/* Service Dialogs */}
      {renderServiceDialog()}
    </div>
  )
}
