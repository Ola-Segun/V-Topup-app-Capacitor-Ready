"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Zap, Shield, CheckCircle, AlertTriangle, Loader2, MapPin, User } from 'lucide-react'
import { BiometricAuthDialog } from '@/components/biometric/biometric-auth-dialog'
import { InputPinCard } from '@/components/input-pin/input-pin'
import { toast } from 'sonner'
import { TransactionSuccessDialog } from '@/components/transactions/transaction-success-dialog'
import { PremiumMobileNav } from '@/components/navigation/premium-mobile-nav'
import { SlideUpTransactionSummary } from '@/components/ui/slide-up-transaction-summary'
import { RecentActionsSection } from '@/components/ui/recent-actions-section'
import { motion } from 'framer-motion'
import { saveRecentAction, type RecentAction } from '@/lib/recent-actions'

const electricityProviders = [
  { id: 'ekedc', name: 'Eko Electric', color: 'bg-blue-600', icon: '⚡' },
  { id: 'ikedc', name: 'Ikeja Electric', color: 'bg-green-600', icon: '🔌' },
  { id: 'aedc', name: 'Abuja Electric', color: 'bg-red-600', icon: '💡' },
  { id: 'phed', name: 'Port Harcourt Electric', color: 'bg-purple-600', icon: '⚡' },
  { id: 'kedco', name: 'Kano Electric', color: 'bg-orange-600', icon: '🔋' },
  { id: 'eedc', name: 'Enugu Electric', color: 'bg-teal-600', icon: '💡' }
]

const quickAmounts = [1000, 2000, 5000, 10000, 15000, 20000]

interface CustomerInfo {
  name: string
  address: string
  meterType: 'prepaid' | 'postpaid'
  tariff: string
}

interface PremiumElectricityTopupProps {
  userId: string
}

export function PremiumElectricityTopup({ userId }: PremiumElectricityTopupProps) {
  const [selectedProvider, setSelectedProvider] = useState('')
  const [meterNumber, setMeterNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [completedTransaction, setCompletedTransaction] = useState<any>(null)

  const verifyMeter = async () => {
    if (!meterNumber || !selectedProvider) return

    setIsVerifying(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setCustomerInfo({
        name: 'John Doe',
        address: '123 Lagos Street, Victoria Island',
        meterType: 'prepaid',
        tariff: 'R2 - Residential'
      })
      toast.success('Meter verified successfully')
    } catch (error) {
      toast.error('Failed to verify meter number')
      setCustomerInfo(null)
    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(() => {
    if (meterNumber.length >= 10 && selectedProvider) {
      verifyMeter()
    } else {
      setCustomerInfo(null)
    }
  }, [meterNumber, selectedProvider])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedProvider) {
      newErrors.provider = 'Please select an electricity provider'
    }

    if (!meterNumber) {
      newErrors.meter = 'Meter number is required'
    } else if (meterNumber.length < 10) {
      newErrors.meter = 'Please enter a valid meter number'
    }

    if (!amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(Number(amount)) || Number(amount) < 500) {
      newErrors.amount = 'Minimum amount is ₦500'
    } else if (Number(amount) > 100000) {
      newErrors.amount = 'Maximum amount is ₦100,000'
    }

    if (!customerInfo) {
      newErrors.customer = 'Meter verification required'
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
        type: 'electricity',
        provider: selectedProviderData?.name || '',
        amount: Number(amount),
        recipient: customerInfo?.name || '',
        reference,
        timestamp: new Date().toLocaleString(),
      }

      // Save to recent actions
      saveRecentAction({
        type: 'electricity',
        provider: selectedProviderData?.name || '',
        amount: Number(amount)
      })

      setCompletedTransaction(completedTx)
      setShowSuccessDialog(true)

      toast.success('Electricity payment successful!')

      // Reset form
      setSelectedProvider('')
      setMeterNumber('')
      setAmount('')
      setCustomerInfo(null)
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
    setSelectedProvider(electricityProviders.find(p => p.name === action.provider)?.id || '')
    setAmount(action.amount?.toString() || '')
    toast.success('Recent transaction loaded')
  }

  const selectedProviderData = electricityProviders.find(p => p.id === selectedProvider)
  const units = amount ? Math.floor(Number(amount) / 45) : 0

  const transactionSummary = {
    title: "Electricity Payment",
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
        value: customerInfo?.name || ""
      },
      {
        label: "Meter Number",
        value: meterNumber
      },
      {
        label: "Meter Type",
        value: customerInfo ? (
          <Badge variant="outline" className="text-xs">
            {customerInfo.meterType.toUpperCase()}
          </Badge>
        ) : ""
      },
      {
        label: "Amount",
        value: `₦${Number(amount || 0).toLocaleString()}`
      },
      {
        label: "Est. Units",
        value: `~${units} kWh`
      },
      {
        label: "Processing Fee",
        value: "₦0"
      }
    ],
    total: `₦${Number(amount || 0).toLocaleString()}`,
    buttonText: "Pay Electricity Bill",
    buttonIcon: <Zap className="mr-2 h-5 w-5" />
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
          <h1 className="text-2xl font-bold mb-2">Electricity Payment</h1>
          <p className="text-muted-foreground">Pay your electricity bills instantly</p>
        </motion.div>

        {/* Recent Actions */}
        <RecentActionsSection
          type="electricity"
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
                  Select Electricity Provider
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {electricityProviders.map((provider, index) => (
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

              {/* Meter Number */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label htmlFor="meter" className="text-base font-medium">
                  Meter Number
                </Label>
                <div className="relative">
                  <Input
                    id="meter"
                    type="text"
                    placeholder="Enter meter number"
                    value={meterNumber}
                    onChange={(e) => setMeterNumber(e.target.value)}
                    className={`h-12 bg-background/50 border-border/50 ${errors.meter ? 'border-red-500' : ''}`}
                  />
                  {isVerifying && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                {customerInfo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Meter Verified</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span>{customerInfo.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs">{customerInfo.address}</span>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {customerInfo.meterType.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {customerInfo.tariff}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                {errors.meter && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {errors.meter}
                  </motion.p>
                )}
              </motion.div>

              {/* Quick Amount Selection */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label className="text-base font-medium">Quick Select Amount</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((quickAmount, index) => (
                    <motion.div
                      key={quickAmount}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                    >
                      <Button
                        variant={amount === quickAmount.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAmount(quickAmount.toString())}
                        className="h-10 w-full"
                      >
                        ₦{quickAmount.toLocaleString()}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Custom Amount */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Label htmlFor="amount" className="text-base font-medium">
                  Amount (₦)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`h-12 bg-background/50 border-border/50 ${errors.amount ? 'border-red-500' : ''}`}
                  min="500"
                  max="100000"
                />
                {amount && units > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Estimated units: ~{units} kWh
                  </div>
                )}
                {errors.amount && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {errors.amount}
                  </motion.p>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedProvider || !meterNumber || !amount || !customerInfo}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Review Payment
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
        title="Authorize Electricity Payment"
        description={`Confirm your electricity payment of ₦${Number(amount || 0).toLocaleString()} for meter ${meterNumber}`}
      />

      {/* PIN Dialog */}
      {showPin && (
        <InputPinCard
          onSuccess={handlePinSuccess}
          onCancel={() => setShowPin(false)}
          title="Enter Transaction PIN"
          description={`Confirm your electricity payment of ₦${Number(amount || 0).toLocaleString()}`}
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
