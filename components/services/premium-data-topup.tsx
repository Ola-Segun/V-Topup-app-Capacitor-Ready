"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Wifi, Shield, Zap, AlertTriangle, Loader2, Clock } from 'lucide-react'
import { BiometricAuthDialog } from '@/components/biometric/biometric-auth-dialog'
import { InputPinCard } from '@/components/input-pin/input-pin'
import { toast } from 'sonner'
import { TransactionSuccessDialog } from '@/components/transactions/transaction-success-dialog'
import { PremiumMobileNav } from '@/components/navigation/premium-mobile-nav'
import { SlideUpTransactionSummary } from '@/components/ui/slide-up-transaction-summary'
import { RecentActionsSection } from '@/components/ui/recent-actions-section'
import { motion } from 'framer-motion'
import { saveRecentAction, type RecentAction } from '@/lib/recent-actions'

const networks = [
  { id: 'mtn', name: 'MTN', color: 'bg-yellow-500', icon: '📱' },
  { id: 'glo', name: 'Glo', color: 'bg-green-500', icon: '🌐' },
  { id: 'airtel', name: 'Airtel', color: 'bg-red-500', icon: '📶' },
  { id: '9mobile', name: '9mobile', color: 'bg-emerald-500', icon: '📞' }
]

interface DataPlan {
  id: string
  name: string
  size: string
  validity: string
  price: number
  popular?: boolean
}

const dataPlans: Record<string, DataPlan[]> = {
  mtn: [
    { id: 'mtn-1gb', name: '1GB', size: '1GB', validity: '30 days', price: 350 },
    { id: 'mtn-2gb', name: '2GB', size: '2GB', validity: '30 days', price: 700, popular: true },
    { id: 'mtn-5gb', name: '5GB', size: '5GB', validity: '30 days', price: 1500 },
    { id: 'mtn-10gb', name: '10GB', size: '10GB', validity: '30 days', price: 2500 },
  ],
  glo: [
    { id: 'glo-1gb', name: '1GB', size: '1GB', validity: '30 days', price: 300 },
    { id: 'glo-2gb', name: '2GB', size: '2GB', validity: '30 days', price: 600, popular: true },
    { id: 'glo-5gb', name: '5GB', size: '5GB', validity: '30 days', price: 1200 },
    { id: 'glo-10gb', name: '10GB', size: '10GB', validity: '30 days', price: 2000 },
  ],
  airtel: [
    { id: 'airtel-1gb', name: '1GB', size: '1GB', validity: '30 days', price: 400 },
    { id: 'airtel-2gb', name: '2GB', size: '2GB', validity: '30 days', price: 800, popular: true },
    { id: 'airtel-5gb', name: '5GB', size: '5GB', validity: '30 days', price: 1600 },
    { id: 'airtel-10gb', name: '10GB', size: '10GB', validity: '30 days', price: 2800 },
  ],
  '9mobile': [
    { id: '9mobile-1gb', name: '1GB', size: '1GB', validity: '30 days', price: 350 },
    { id: '9mobile-2gb', name: '2GB', size: '2GB', validity: '30 days', price: 750, popular: true },
    { id: '9mobile-5gb', name: '5GB', size: '5GB', validity: '30 days', price: 1400 },
    { id: '9mobile-10gb', name: '10GB', size: '10GB', validity: '30 days', price: 2300 },
  ],
}

interface PremiumDataTopupProps {
  userId: string
}

export function PremiumDataTopup({ userId }: PremiumDataTopupProps) {
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [availablePlans, setAvailablePlans] = useState<DataPlan[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [completedTransaction, setCompletedTransaction] = useState<any>(null)

  useEffect(() => {
    if (selectedNetwork) {
      setAvailablePlans(dataPlans[selectedNetwork] || [])
      setSelectedPlan(null)
    }
  }, [selectedNetwork])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedNetwork) {
      newErrors.network = 'Please select a network'
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^0[789][01]\d{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Nigerian phone number'
    }

    if (!selectedPlan) {
      newErrors.plan = 'Please select a data plan'
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
        type: 'data',
        network: selectedNetworkData?.name || '',
        amount: selectedPlan?.price || 0,
        phone: phoneNumber,
        plan: selectedPlan?.name || '',
        reference,
        timestamp: new Date().toLocaleString(),
      }

      // Save to recent actions
      saveRecentAction({
        type: 'data',
        network: selectedNetworkData?.name || '',
        phoneNumber,
        amount: selectedPlan?.price || 0,
        package: selectedPlan?.name || ''
      })

      setCompletedTransaction(completedTx)
      setShowSuccessDialog(true)

      toast.success('Data purchase successful!')

      // Reset form
      setSelectedNetwork('')
      setPhoneNumber('')
      setSelectedPlan(null)
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
    setSelectedNetwork(networks.find(n => n.name === action.network)?.id || '')
    setPhoneNumber(action.phoneNumber || '')
    // Find matching plan
    const networkPlans = dataPlans[networks.find(n => n.name === action.network)?.id || ''] || []
    const matchingPlan = networkPlans.find(p => p.name === action.package)
    if (matchingPlan) {
      setSelectedPlan(matchingPlan)
    }
    toast.success('Recent transaction loaded')
  }

  const selectedNetworkData = networks.find(n => n.id === selectedNetwork)

  const transactionSummary = {
    title: "Data Purchase",
    items: [
      {
        label: "Network",
        value: selectedNetworkData ? (
          <Badge variant="secondary" className="text-xs">
            {selectedNetworkData.name}
          </Badge>
        ) : ""
      },
      {
        label: "Phone Number",
        value: phoneNumber
      },
      {
        label: "Data Plan",
        value: selectedPlan?.size || ""
      },
      {
        label: "Validity",
        value: selectedPlan?.validity || ""
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
    buttonText: "Purchase Data Plan",
    buttonIcon: <Wifi className="mr-2 h-5 w-5" />
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
          <h1 className="text-2xl font-bold mb-2">Data Purchase</h1>
          <p className="text-muted-foreground">Buy data bundles for any network</p>
        </motion.div>

        {/* Recent Actions */}
        <RecentActionsSection
          type="data"
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
              {/* Network Selection */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Label htmlFor="network" className="text-base font-medium">
                  Select Network
                </Label>
                <div className="grid grid-cols-4 gap-3">
                  {networks.map((network, index) => (
                    <motion.button
                      key={network.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNetwork(network.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedNetwork === network.id
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border/50 hover:border-border bg-background/50'
                      }`}
                    >
                      <div className="text-center space-y-2">
                        <div className={`w-8 h-8 ${network.color} rounded-full flex items-center justify-center text-white text-xl mx-auto shadow-sm`}>
                          {network.icon}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                {errors.network && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {errors.network}
                  </motion.p>
                )}
              </motion.div>

              {/* Phone Number */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="phone" className="text-base font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08012345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`h-12 bg-background/50 border-border/50 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                />
                {errors.phoneNumber && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {errors.phoneNumber}
                  </motion.p>
                )}
              </motion.div>

              {/* Data Plans */}
              {selectedNetwork && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label className="text-base font-medium">
                    Select Data Plan
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
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
                            Popular
                          </Badge>
                        )}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-lg">{plan.size}</h4>
                            <span className="font-bold text-primary">₦{plan.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Valid for {plan.validity}
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
                  disabled={!selectedNetwork || !phoneNumber || !selectedPlan}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <Wifi className="mr-2 h-5 w-5" />
                  Review Purchase
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
        title="Authorize Data Purchase"
        description={`Confirm your data purchase of ${selectedPlan?.size} for ₦${selectedPlan?.price.toLocaleString()} to ${phoneNumber}`}
      />

      {/* PIN Dialog */}
      {showPin && (
        <InputPinCard
          onSuccess={handlePinSuccess}
          onCancel={() => setShowPin(false)}
          title="Enter Transaction PIN"
          description={`Confirm your data purchase of ${selectedPlan?.size} for ₦${selectedPlan?.price.toLocaleString()}`}
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
