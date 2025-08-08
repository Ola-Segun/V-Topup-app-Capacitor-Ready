"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Wallet, CreditCard, Loader2, Plus, Eye, EyeOff, TrendingUp, ArrowUpRight, ArrowDownRight, Shield, Zap } from 'lucide-react'

import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { motion } from "framer-motion"
import { BiometricAuthDialog } from "@/components/biometric/biometric-auth-dialog"
import { InputPinCard } from "@/components/input-pin/input-pin"
import { TransactionSuccessDialog } from "@/components/transactions/transaction-success-dialog"
import { SlideUpTransactionSummary } from "@/components/ui/slide-up-transaction-summary"
import { RecentActionsSection } from "@/components/ui/recent-actions-section"
import { saveRecentAction, type RecentAction } from "@/lib/recent-actions"

const fundWalletSchema = z.object({
  amount: z.string().min(1, "Please enter an amount"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
})

type FundWalletForm = z.infer<typeof fundWalletSchema>

const paymentMethods = [
  { value: "paystack", label: "Paystack", icon: CreditCard },
  { value: "flutterwave", label: "Flutterwave", icon: CreditCard },
  { value: "bank_transfer", label: "Bank Transfer", icon: CreditCard },
]

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000]

export function PremiumWalletManagement() {
  const [loading, setLoading] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("")
  const [walletBalance] = useState(25750)
  const [showBalance, setShowBalance] = useState(true)
  
  // Transaction authentication state
  const [showBiometric, setShowBiometric] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [completedTransaction, setCompletedTransaction] = useState<any>(null)
  const [pendingTransaction, setPendingTransaction] = useState<any>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FundWalletForm>({
    resolver: zodResolver(fundWalletSchema),
  })

  const watchedAmount = watch("amount")
  const watchedPaymentMethod = watch("paymentMethod")

  // Validation function
  const validateForm = () => {
    const amount = watchedAmount
    const paymentMethod = watchedPaymentMethod

    if (!amount || !paymentMethod) {
      toast.error("Please fill in all required fields")
      return false
    }

    if (isNaN(Number(amount)) || Number(amount) < 100) {
      toast.error("Minimum funding amount is ₦100")
      return false
    }

    if (Number(amount) > 500000) {
      toast.error("Maximum funding amount is ₦500,000")
      return false
    }

    return true
  }

  // Handle form submission with authentication
  const handleAuthSubmit = () => {
    if (!validateForm()) return
    setShowSummary(true)
  }

  const handleConfirmTransaction = () => {
    const transactionData = {
      amount: Number(watchedAmount),
      paymentMethod: paymentMethods.find(m => m.value === watchedPaymentMethod)?.label || '',
      type: 'wallet-funding'
    }

    setPendingTransaction(transactionData)
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
    setLoading(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock reference
      const reference = `VT${Date.now()}`
      const completedTx = {
        type: 'wallet-fund',
        amount: pendingTransaction?.amount || Number(watchedAmount),
        paymentMethod: pendingTransaction?.paymentMethod || paymentMethods.find((m) => m.value === watchedPaymentMethod)?.label || '',
        reference,
        timestamp: new Date().toLocaleString(),
      }

      // Save to recent actions
      saveRecentAction({
        type: 'wallet_funding',
        amount: completedTx.amount,
        paymentMethod: completedTx.paymentMethod
      })

      setCompletedTransaction(completedTx)
      setShowSuccessDialog(true)

      toast.success(`₦${completedTx.amount.toLocaleString()} added to wallet successfully!`)

      // Reset form
      reset()
      setSelectedAmount("")
      setPendingTransaction(null)
    } catch (error) {
      toast.error("Payment Failed. Please try again.")
    } finally {
      setLoading(false)
      setShowBiometric(false)
      setShowPin(false)
    }
  }

  const handleAuthCancel = () => {
    setPendingTransaction(null)
    setShowBiometric(false)
    setShowPin(false)
  }

  const handleQuickAmount = (amount: number) => {
    setValue("amount", amount.toString())
    setSelectedAmount(amount.toString())
  }

  const handleRecentActionSelect = (action: RecentAction) => {
    setValue("amount", action.amount?.toString() || "")
    setSelectedAmount(action.amount?.toString() || "")
    if (action.paymentMethod) {
      const method = paymentMethods.find(m => m.label === action.paymentMethod)
      if (method) {
        setValue("paymentMethod", method.value)
      }
    }
    toast.success('Recent transaction loaded')
  }

  const transactions = [
    {
      id: 1,
      type: "Credit",
      description: "Wallet Funding - Paystack",
      amount: 5000,
      date: "2 mins ago",
      status: "completed",
      icon: ArrowDownRight,
      color: "text-green-500",
    },
    {
      id: 2,
      type: "Debit",
      description: "Airtime Purchase - MTN",
      amount: -1000,
      date: "1 hour ago",
      status: "completed",
      icon: ArrowUpRight,
      color: "text-red-500",
    },
    {
      id: 3,
      type: "Debit",
      description: "Data Purchase - Airtel",
      amount: -2000,
      date: "Yesterday",
      status: "completed",
      icon: ArrowUpRight,
      color: "text-red-500",
    },
  ]

  const transactionSummary = {
    title: "Wallet Funding",
    items: [
      {
        label: "Amount",
        value: `₦${Number(watchedAmount || 0).toLocaleString()}`
      },
      {
        label: "Payment Method",
        value: paymentMethods.find((m) => m.value === watchedPaymentMethod)?.label || ""
      },
      {
        label: "Processing Fee",
        value: "₦0"
      }
    ],
    total: `₦${Number(watchedAmount || 0).toLocaleString()}`,
    buttonText: "Fund Wallet",
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
          <h1 className="text-2xl font-bold mb-2">Wallet Management</h1>
          <p className="text-muted-foreground">Fund your wallet securely</p>
        </motion.div>

        {/* Premium Wallet Balance Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 py-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-6 text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
                  <div className="absolute -top-8 -right-8 w-24 h-24 border border-white/20 rounded-full"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5" />
                      <span className="text-white/80 text-sm">Total Balance</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-white hover:bg-white/20 h-8 w-8"
                    >
                      {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="mb-4">
                    <p className="text-3xl font-bold">{showBalance ? `₦${walletBalance.toLocaleString()}` : "₦****"}</p>
                    <p className="text-white/80 text-sm">Available for transactions</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-sm text-green-300">+12.5% this month</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/60">Last updated</p>
                      <p className="text-xs text-white/80">Just now</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Actions */}
        <RecentActionsSection
          type="wallet_funding"
          onActionSelect={handleRecentActionSelect}
        />

        {/* Fund Wallet */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6 space-y-6">
              {/* Quick Amount Selection */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-medium mb-3">Quick Amount</h3>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((amount, index) => (
                    <motion.div
                      key={amount}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Button
                        variant={selectedAmount === amount.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleQuickAmount(amount)}
                        className="h-12 w-full"
                      >
                        ₦{amount.toLocaleString()}
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
                transition={{ delay: 0.5 }}
              >
                <label className="text-sm font-medium">Custom Amount (₦)</label>
                <Input
                  type="number"
                  placeholder="Enter amount (min ₦100)"
                  {...register("amount")}
                  className={`h-12 bg-background/50 border-border/50 ${errors.amount ? "border-red-500" : ""}`}
                  onChange={(e) => setSelectedAmount(e.target.value)}
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
              </motion.div>

              {/* Payment Method */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="text-sm font-medium">Payment Method</label>
                <Select onValueChange={(value) => setValue("paymentMethod", value)}>
                  <SelectTrigger className={`h-12 bg-background/50 border-border/50 ${errors.paymentMethod ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center space-x-2">
                          <method.icon className="w-4 h-4" />
                          <span>{method.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <p className="text-sm text-red-500">{errors.paymentMethod.message}</p>}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={handleAuthSubmit}
                  disabled={loading || !watchedAmount || !watchedPaymentMethod}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Review Funding
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Recent Transactions
              </h3>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-background/30 rounded-xl hover:bg-background/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center shadow-sm border border-border/30">
                        <transaction.icon className={`w-5 h-5 ${transaction.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${transaction.color}`}>
                        {transaction.type === "Credit" ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-green-500 capitalize">{transaction.status}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Slide-up Transaction Summary */}
      <SlideUpTransactionSummary
        isVisible={showSummary}
        onClose={() => setShowSummary(false)}
        onConfirm={handleConfirmTransaction}
        isProcessing={loading}
        summary={transactionSummary}
      />

      {/* Biometric Auth Dialog */}
      <BiometricAuthDialog
        open={showBiometric}
        onOpenChange={setShowBiometric}
        onSuccess={handleBiometricSuccess}
        onFallback={handleBiometricFallback}
        userId={"wallet-user"}
        title="Authorize Wallet Funding"
        description={`Confirm your wallet funding of ₦${Number(watchedAmount || 0).toLocaleString()} via ${paymentMethods.find((m) => m.value === watchedPaymentMethod)?.label || ''}`}
      />

      {/* PIN Dialog */}
      {showPin && (
        <InputPinCard
          onSuccess={handlePinSuccess}
          onCancel={handleAuthCancel}
          title="Enter Transaction PIN"
          description={`Confirm your wallet funding of ₦${Number(watchedAmount || 0).toLocaleString()}`}
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
