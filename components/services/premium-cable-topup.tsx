"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tv, Shield, Zap, CheckCircle, AlertTriangle, Loader2, Clock, Star } from 'lucide-react'
import { BiometricAuthDialog } from '@/components/biometric/biometric-auth-dialog'
import { InputPinCard } from '@/components/input-pin/input-pin'
import { toast } from 'sonner'
import { TransactionSuccessDialog } from '@/components/transactions/transaction-success-dialog'
import { PremiumMobileNav } from '@/components/navigation/premium-mobile-nav'
import { SlideUpTransactionSummary } from '@/components/ui/slide-up-transaction-summary'
import { RecentActionsSection } from '@/components/ui/recent-actions-section'
import { motion } from 'framer-motion'
import { saveRecentAction, type RecentAction } from '@/lib/recent-actions'

const cableProviders = [
  { id: 'dstv', name: 'DStv', color: 'bg-blue-600', icon: '📺' },
  { id: 'gotv', name: 'GOtv', color: 'bg-green-600', icon: '📻' },
  { id: 'startimes', name: 'StarTimes', color: 'bg-red-600', icon: '⭐' },
  { id: 'showmax', name: 'Showmax', color: 'bg-purple-600', icon: '🎬' }
]

interface CablePlan {
  id: string
  name: string
  price: number
  duration: string
  channels: number
  features: string[]
  popular?: boolean
}

const cablePlans: Record<string, CablePlan[]> = {
  dstv: [
    { 
      id: 'dstv-access', 
      name: 'Access', 
      price: 2150, 
      duration: '1 month', 
      channels: 60,
      features: ['Local channels', 'News', 'Entertainment']
    },
    { 
      id: 'dstv-family', 
      name: 'Family', 
      price: 4000, 
      duration: '1 month', 
      channels: 120,
      features: ['Kids channels', 'Movies', 'Sports'],
      popular: true
    },
    { 
      id: 'dstv-compact', 
      name: 'Compact', 
      price: 7900, 
      duration: '1 month', 
      channels: 180,
      features: ['Premium sports', 'Movies', 'International']
    },
    { 
      id: 'dstv-premium', 
      name: 'Premium', 
      price: 18400, 
      duration: '1 month', 
      channels: 220,
      features: ['All channels', 'Premium content', '4K channels']
    }
  ],
  gotv: [
    { 
      id: 'gotv-lite', 
      name: 'Lite', 
      price: 600, 
      duration: '1 month', 
      channels: 15,
      features: ['Basic channels', 'Local content']
    },
    { 
      id: 'gotv-max', 
      name: 'Max', 
      price: 3200, 
      duration: '1 month', 
      channels: 65,
      features: ['Sports', 'Movies', 'Kids channels'],
      popular: true
    },
    { 
      id: 'gotv-jolli', 
      name: 'Jolli', 
      price: 2250, 
      duration: '1 month', 
      channels: 50,
      features: ['Entertainment', 'News', 'Music']
    }
  ],
  startimes: [
    { 
      id: 'startimes-nova', 
      name: 'Nova', 
      price: 900, 
      duration: '1 month', 
      channels: 32,
      features: ['Basic package', 'Local channels']
    },
    { 
      id: 'startimes-basic', 
      name: 'Basic', 
      price: 1700, 
      duration: '1 month', 
      channels: 45,
      features: ['Sports', 'Movies', 'Kids'],
      popular: true
    },
    { 
      id: 'startimes-smart', 
      name: 'Smart', 
      price: 2400, 
      duration: '1 month', 
      channels: 60,
      features: ['Premium content', 'International channels']
    }
  ],
  showmax: [
    { 
      id: 'showmax-mobile', 
      name: 'Mobile', 
      price: 1200, 
      duration: '1 month', 
      channels: 0,
      features: ['Mobile streaming', 'HD quality', '1 device']
    },
    { 
      id: 'showmax-standard', 
      name: 'Standard', 
      price: 2900, 
      duration: '1 month', 
      channels: 0,
      features: ['2 devices', 'HD streaming', 'Download'],
      popular: true
    },
    { 
      id: 'showmax-pro', 
      name: 'Pro', 
      price: 3200, 
      duration: '1 month', 
      channels: 0,
      features: ['Live sports', '4 devices', 'Premium content']
    }
  ]
}

interface PremiumCableTopupProps {
  userId: string
}

export function PremiumCableTopup({ userId }: PremiumCableTopupProps) {
  const [selectedProvider, setSelectedProvider] = useState('')
  const [smartCardNumber, setSmartCardNumber] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<CablePlan | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availablePlans, setAvailablePlans] = useState<CablePlan[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [completedTransaction, setCompletedTransaction] = useState<any>(null)

  useEffect(() => {
    if (selectedProvider) {
      setAvailablePlans(cablePlans[selectedProvider] || [])
      setSelectedPlan(null)
    }
  }, [selectedProvider])

  const verifySmartCard = async () => {
    if (!smartCardNumber || !selectedProvider) return

    setIsVerifying(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCustomerName('John Doe')
      toast.success('Smart card verified successfully')
    } catch (error) {
      toast.error('Failed to verify smart card')
      setCustomerName('')
    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(() => {
    if (smartCardNumber.length >= 10 && selectedProvider) {
      verifySmartCard()
    } else {
      setCustomerName('')
    }
  }, [smartCardNumber, selectedProvider])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedProvider) {
      newErrors.provider = 'Please select a cable provider'
    }

    if (!smartCardNumber) {
      newErrors.smartCard = 'Smart card number is required'
    } else if (smartCardNumber.length < 10) {
      newErrors.smartCard = 'Please enter a valid smart card number'
    }

    if (!selectedPlan) {
      newErrors.plan = 'Please select a subscription plan'
    }

    if (!customerName) {
      newErrors.customer = 'Smart card verification required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    setShowSummary(true)
  }

  const handleConfirmTransaction = () => {
    setShowSummary(false)
    setShowBiometric(true)
  }

  const handleBiometricSuccess = () => {
    processTransaction()
  }

  const handleBiometricFallback = () => {
    setShowPin(true)
  }

  const handlePinSuccess = () => {
    processTransaction()
  }

  const processTransaction = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const reference = `VT${Date.now()}`
      const completedTx = {
        type: 'cable',
        provider: selectedProviderData?.name || '',
        amount: selectedPlan?.price || 0,
        plan: selectedPlan?.name || '',
        recipient: customerName,
        reference,
        timestamp: new Date().toLocaleString(),
      }

      // Save to recent actions
      saveRecentAction({
        type: 'cable',
        provider: selectedProviderData?.name || '',
        amount: selectedPlan?.price || 0,
        package: selectedPlan?.name || ''
      })

      setCompletedTransaction(completedTx)
      setShowSuccessDialog(true)

      toast.success('Cable TV subscription successful!')

      // Reset form
      setSelectedProvider('')
      setSmartCardNumber('')
      setSelectedPlan(null)
      setCustomerName('')
      setErrors({})
    } catch (error) {
      toast.error('Transaction failed. Please try again.')
    } finally {
      setIsProcessing(false)
      setShowBiometric(false)
      setShowPin(false)
    }
  }

  const handleRecentActionSelect = (action: RecentAction) => {
    setSelectedProvider(cableProviders.find(p => p.name === action.provider)?.id || '')
    // Find matching plan
    const providerPlans = cablePlans[cableProviders.find(p => p.name === action.provider)?.id || ''] || []
    const matchingPlan = providerPlans.find(p => p.name === action.package)
    if (matchingPlan) {
      setSelectedPlan(matchingPlan)
    }
    toast.success('Recent transaction loaded')
  }

  const selectedProviderData = cableProviders.find(p => p.id === selectedProvider)

  const transactionSummary = {
    title: "Cable Subscription",
    items: [
      {
        label: "Provider",
        value: selectedProviderData ? (
          <Badge variant="secondary" className="text-xs">
            {selectedProviderData.name}
          </Badge>
        ) : ""
      },
      {
        label: "Customer",
        value: customerName
      },
      {
        label: "Smart Card",
        value: smartCardNumber
      },
      {
        label: "Plan",
        value: selectedPlan?.name || ""
      },
      {
        label: "Duration",
        value: selectedPlan?.duration || ""
      },
      {
        label: "Amount",
        value: `₦${selectedPlan?.price.toLocaleString() || 0}`
      },
      {
        label: "Processing Fee",
        value: "₦0"
      }
    ],
    total: `₦${selectedPlan?.price.toLocaleString() || 0}`,
    buttonText: "Subscribe Now",
    buttonIcon: <Tv className="mr-2 h-5 w-5" />
  }

  return (
    <div className="min-h-screen pb-20">
      <PremiumMobileNav />

      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold mb-2">Cable TV Subscription</h1>
          <p className="text-muted-foreground">Pay for your cable TV subscription</p>
        </motion.div>

        {/* Recent Actions */}
        <RecentActionsSection
          type="cable"
          onActionSelect={handleRecentActionSelect}
        />

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Provider Selection */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="provider" className="text-base font-medium">
                  Select Cable Provider
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {cableProviders.map((provider, index) => (
                    <motion.button
                      key={provider.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedProvider(provider.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedProvider === provider.id
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border/50 hover:border-border bg-background/50'
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <div className={`w-12 h-12 ${provider.color} rounded-full flex items-center justify-center text-white text-xl mx-auto shadow-sm`}>
                          {provider.icon}
                        </div>
                        <p className="font-medium text-sm">{provider.name}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
                {errors.provider && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {errors.provider}
                  </motion.p>
                )}
              </motion.div>

              {/* Smart Card Number */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="smartcard" className="text-base font-medium">
                  Smart Card Number
                </Label>
                <div className="relative">
                  <Input
                    id="smartcard"
                    type="text"
                    placeholder="Enter smart card number"
                    value={smartCardNumber}
                    onChange={(e) => setSmartCardNumber(e.target.value)}
                    className={`h-12 bg-background/50 border-border/50 ${errors.smartCard ? 'border-red-500' : ''}`}
                  />
                  {isVerifying && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                {customerName && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Customer: {customerName}</span>
                  </motion.div>
                )}
                {errors.smartCard && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {errors.smartCard}
                  </motion.p>
                )}
              </motion.div>

              {/* Subscription Plans */}
              {selectedProvider && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label className="text-base font-medium">
                    Select Subscription Plan
                  </Label>
                  <div className="grid grid-cols-1 gap-4">
                    {availablePlans.map((plan, index) => (
                      <motion.button
                        key={plan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                          selectedPlan?.id === plan.id
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-border/50 hover:border-border bg-background/50'
                        }`}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-orange-500">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-lg">{plan.name}</h4>
                            <span className="font-bold text-primary">₦{plan.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Valid for {plan.duration}
                          </div>
                          {plan.channels > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {plan.channels} channels
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1">
                            {plan.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {errors.plan && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-500 flex items-center gap-1"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      {errors.plan}
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedProvider || !smartCardNumber || !selectedPlan || !customerName}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <Tv className="mr-2 h-5 w-5" />
                  Review Subscription
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Slide-up Transaction Summary */}
      <SlideUpTransactionSummary
        isVisible={showSummary}
        onClose={() => setShowSummary(false)}
        onConfirm={handleConfirmTransaction}
        isProcessing={isProcessing}
        summary={transactionSummary}
      />

      {/* Biometric Auth Dialog */}
      <BiometricAuthDialog
        open={showBiometric}
        onOpenChange={setShowBiometric}
        onSuccess={handleBiometricSuccess}
        onFallback={handleBiometricFallback}
        userId={userId}
        title="Authorize Cable Subscription"
        description={`Confirm your ${selectedPlan?.name} subscription for ₦${selectedPlan?.price.toLocaleString()} for ${customerName}`}
      />

      {/* PIN Dialog */}
      {showPin && (
        <InputPinCard
          onSuccess={handlePinSuccess}
          onCancel={() => setShowPin(false)}
          title="Enter Transaction PIN"
          description={`Confirm your ${selectedPlan?.name} subscription for ₦${selectedPlan?.price.toLocaleString()}`}
        />
      )}

      {/* Success Dialog */}
      <TransactionSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        transaction={completedTransaction}
      />
    </div>
  )
}
