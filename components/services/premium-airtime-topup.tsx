"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Smartphone, Shield, Zap, AlertTriangle, Loader2 } from 'lucide-react'
import { BiometricAuthDialog } from '@/components/biometric/biometric-auth-dialog'
import { InputPinCard } from '@/components/input-pin/input-pin'
import { toast } from 'sonner'
import { TransactionSuccessDialog } from "@/components/transactions/transaction-success-dialog"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { SlideUpTransactionSummary } from "@/components/ui/slide-up-transaction-summary"
import { RecentActionsSection } from "@/components/ui/recent-actions-section"
import { motion } from "framer-motion"
import { saveRecentAction, type RecentAction } from "@/lib/recent-actions"

const networks = [
  { id: 'mtn', name: 'MTN', color: 'bg-yellow-500', icon: '📱' },
  { id: 'glo', name: 'Glo', color: 'bg-green-500', icon: '🌐' },
  { id: 'airtel', name: 'Airtel', color: 'bg-red-500', icon: '📶' },
  { id: '9mobile', name: '9mobile', color: 'bg-emerald-500', icon: '📞' }
]

const quickAmounts = [100, 200, 500, 1000, 2000, 5000]

interface PremiumAirtimeTopupProps {
  userId: string
}

export function PremiumAirtimeTopup({ userId }: PremiumAirtimeTopupProps) {
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showBiometric, setShowBiometric] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [completedTransaction, setCompletedTransaction] = useState<any>(null)

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

    if (!amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(Number(amount)) || Number(amount) < 50) {
      newErrors.amount = 'Minimum amount is ₦50'
    } else if (Number(amount) > 50000) {
      newErrors.amount = 'Maximum amount is ₦50,000'
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

  const handlePinSuccess = (pin: string) => {
    processTransaction()
  }

  const processTransaction = async () => {
    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const reference = `VT${Date.now()}`
      const completedTx = {
        type: 'airtime',
        network: selectedNetworkData?.name || '',
        amount: Number(amount),
        phone: phoneNumber,
        reference,
        timestamp: new Date().toLocaleString(),
      }

      // Save to recent actions
      saveRecentAction({
        type: 'airtime',
        network: selectedNetworkData?.name || '',
        phoneNumber,
        amount: Number(amount)
      })

      setCompletedTransaction(completedTx)
      setShowSuccessDialog(true)

      toast.success(`₦${amount} airtime sent to ${phoneNumber}`)

      // Reset form
      setSelectedNetwork('')
      setPhoneNumber('')
      setAmount('')
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
    setAmount(action.amount?.toString() || '')
    toast.success('Recent transaction loaded')
  }

  const selectedNetworkData = networks.find(n => n.id === selectedNetwork)

  const transactionSummary = {
    title: "Airtime Purchase",
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
        label: "Amount",
        value: `₦${Number(amount || 0).toLocaleString()}`
      },
      {
        label: "Processing Fee",
        value: "₦0"
      }
    ],
    total: `₦${Number(amount || 0).toLocaleString()}`,
    buttonText: "Purchase Airtime",
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
          <h1 className="text-2xl font-bold mb-2">Airtime Top-up</h1>
          <p className="text-muted-foreground">Purchase airtime for any network</p>
        </motion.div>

        {/* Recent Actions */}
        <RecentActionsSection
          type="airtime"
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
                        ₦{quickAmount}
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
                  min="50"
                  max="50000"
                />
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
                  disabled={!selectedNetwork || !phoneNumber || !amount}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <Zap className="mr-2 h-5 w-5" />
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
        title="Authorize Airtime Purchase"
        description={`Confirm your airtime purchase of ₦${Number(amount || 0).toLocaleString()} to ${phoneNumber}`}
      />

      {/* PIN Dialog */}
      {showPin && (
        <InputPinCard
          onSuccess={handlePinSuccess}
          onCancel={() => setShowPin(false)}
          title="Enter Transaction PIN"
          description={`Confirm your airtime purchase of ₦${Number(amount || 0).toLocaleString()}`}
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
