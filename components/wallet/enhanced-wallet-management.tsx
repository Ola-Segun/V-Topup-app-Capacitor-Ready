"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, CreditCard, Send, Plus, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Clock, Calendar, Eye, EyeOff, Copy, QrCode, Smartphone, Building, Shield, CheckCircle, AlertTriangle, Loader2, RefreshCw, Download, Upload, Settings, History, Star } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { BiometricAuthDialog } from "@/components/biometric/biometric-auth-dialog"
import { InputPinCard } from "@/components/input-pin/input-pin"
import { TransactionSuccessDialog } from "@/components/transactions/transaction-success-dialog"
import { SlideUpTransactionSummary } from "@/components/ui/slide-up-transaction-summary"
import { toast } from "sonner"
import { saveRecentAction } from "@/lib/recent-actions"

interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  description: string
  amount: number
  balance: number
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
  reference: string
  category: 'funding' | 'transfer' | 'service' | 'refund'
}

interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'bank' | 'ussd' | 'crypto' | 'mobile_money'
  icon: any
  fee: string
  processingTime: string
  limits: {
    min: number
    max: number
  }
  available: boolean
}

interface ScheduledTransaction {
  id: string
  type: 'funding' | 'transfer' | 'service'
  recipient: string
  amount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  nextRun: string
  status: 'active' | 'paused' | 'cancelled'
  description: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'paystack',
    name: 'Paystack (Card)',
    type: 'card',
    icon: CreditCard,
    fee: '1.5% + ₦100',
    processingTime: 'Instant',
    limits: { min: 100, max: 500000 },
    available: true
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    type: 'bank',
    icon: Building,
    fee: '₦50',
    processingTime: '5-10 minutes',
    limits: { min: 1000, max: 1000000 },
    available: true
  },
  {
    id: 'ussd',
    name: 'USSD (*737#)',
    type: 'ussd',
    icon: Smartphone,
    fee: '₦10',
    processingTime: '2-5 minutes',
    limits: { min: 100, max: 100000 },
    available: true
  },
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    type: 'mobile_money',
    icon: Wallet,
    fee: '1.0%',
    processingTime: 'Instant',
    limits: { min: 100, max: 200000 },
    available: true
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    type: 'crypto',
    icon: QrCode,
    fee: '0.5%',
    processingTime: '10-30 minutes',
    limits: { min: 1000, max: 5000000 },
    available: false
  }
]

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000]

export function EnhancedWalletManagement() {
  const [walletBalance, setWalletBalance] = useState(25750)
  const [showBalance, setShowBalance] = useState(true)
  const [selectedTab, setSelectedTab] = useState("fund")
  const [isLoading, setIsLoading] = useState(false)
  
  // Form states
  const [fundAmount, setFundAmount] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [transferRecipient, setTransferRecipient] = useState("")
  const [transferAmount, setTransferAmount] = useState("")
  const [transferNote, setTransferNote] = useState("")
  
  // Authentication states
  const [showBiometric, setShowBiometric] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [completedTransaction, setCompletedTransaction] = useState<any>(null)
  const [pendingTransaction, setPendingTransaction] = useState<any>(null)

  const [transactions, setTransactions] = useState<WalletTransaction[]>([
    {
      id: '1',
      type: 'credit',
      description: 'Wallet Funding - Paystack',
      amount: 5000,
      balance: 25750,
      timestamp: '2024-01-20 14:30:00',
      status: 'completed',
      reference: 'VT20240120143000',
      category: 'funding'
    },
    {
      id: '2',
      type: 'debit',
      description: 'Airtime Purchase - MTN',
      amount: -1000,
      balance: 20750,
      timestamp: '2024-01-20 13:15:00',
      status: 'completed',
      reference: 'VT20240120131500',
      category: 'service'
    },
    {
      id: '3',
      type: 'debit',
      description: 'Money Transfer to Jane Smith',
      amount: -3000,
      balance: 21750,
      timestamp: '2024-01-20 12:00:00',
      status: 'completed',
      reference: 'VT20240120120000',
      category: 'transfer'
    },
    {
      id: '4',
      type: 'credit',
      description: 'Refund - Failed Transaction',
      amount: 2000,
      balance: 24750,
      timestamp: '2024-01-20 11:30:00',
      status: 'completed',
      reference: 'VT20240120113000',
      category: 'refund'
    }
  ])

  const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>([
    {
      id: '1',
      type: 'service',
      recipient: '08012345678',
      amount: 1000,
      frequency: 'weekly',
      nextRun: '2024-01-27',
      status: 'active',
      description: 'Weekly Airtime Top-up'
    },
    {
      id: '2',
      type: 'transfer',
      recipient: 'jane@example.com',
      amount: 5000,
      frequency: 'monthly',
      nextRun: '2024-02-01',
      status: 'active',
      description: 'Monthly Transfer to Jane'
    }
  ])

  const bankDetails = {
    bankName: 'Providus Bank',
    accountNumber: '9876543210',
    accountName: 'VTopup - John Doe'
  }

  const handleFundWallet = () => {
    if (!fundAmount || !selectedPaymentMethod) {
      toast.error("Please fill in all required fields")
      return
    }

    if (Number(fundAmount) < 100) {
      toast.error("Minimum funding amount is ₦100")
      return
    }

    const method = paymentMethods.find(m => m.id === selectedPaymentMethod)
    if (!method) return

    setPendingTransaction({
      type: 'wallet_funding',
      amount: Number(fundAmount),
      paymentMethod: method.name,
      fee: method.fee
    })
    setShowSummary(true)
  }

  const handleTransferMoney = () => {
    if (!transferRecipient || !transferAmount) {
      toast.error("Please fill in all required fields")
      return
    }

    if (Number(transferAmount) < 100) {
      toast.error("Minimum transfer amount is ₦100")
      return
    }

    if (Number(transferAmount) > walletBalance) {
      toast.error("Insufficient wallet balance")
      return
    }

    setPendingTransaction({
      type: 'money_transfer',
      amount: Number(transferAmount),
      recipient: transferRecipient,
      note: transferNote
    })
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
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const reference = `VT${Date.now()}`
      const timestamp = new Date().toLocaleString()

      if (pendingTransaction?.type === 'wallet_funding') {
        const newBalance = walletBalance + pendingTransaction.amount
        setWalletBalance(newBalance)
        
        const newTransaction: WalletTransaction = {
          id: Date.now().toString(),
          type: 'credit',
          description: `Wallet Funding - ${pendingTransaction.paymentMethod}`,
          amount: pendingTransaction.amount,
          balance: newBalance,
          timestamp,
          status: 'completed',
          reference,
          category: 'funding'
        }
        
        setTransactions(prev => [newTransaction, ...prev])
        
        setCompletedTransaction({
          type: 'wallet_funding',
          amount: pendingTransaction.amount,
          paymentMethod: pendingTransaction.paymentMethod,
          reference,
          timestamp
        })

        // Reset form
        setFundAmount("")
        setSelectedPaymentMethod("")
      } else if (pendingTransaction?.type === 'money_transfer') {
        const newBalance = walletBalance - pendingTransaction.amount
        setWalletBalance(newBalance)
        
        const newTransaction: WalletTransaction = {
          id: Date.now().toString(),
          type: 'debit',
          description: `Money Transfer to ${pendingTransaction.recipient}`,
          amount: -pendingTransaction.amount,
          balance: newBalance,
          timestamp,
          status: 'completed',
          reference,
          category: 'transfer'
        }
        
        setTransactions(prev => [newTransaction, ...prev])
        
        setCompletedTransaction({
          type: 'money_transfer',
          amount: pendingTransaction.amount,
          recipient: pendingTransaction.recipient,
          reference,
          timestamp
        })

        // Reset form
        setTransferRecipient("")
        setTransferAmount("")
        setTransferNote("")
      }

      // Save recent action
      await saveRecentAction({
        type: pendingTransaction?.type || 'wallet_action',
        amount: pendingTransaction?.amount || 0,
        description: `${pendingTransaction?.type} completed`,
        status: 'completed'
      })

      setShowSuccessDialog(true)
      toast.success("Transaction completed successfully!")
      
    } catch (error) {
      toast.error("Transaction failed. Please try again.")
    } finally {
      setIsLoading(false)
      setShowBiometric(false)
      setShowPin(false)
      setPendingTransaction(null)
    }
  }

  const handleQuickAmount = (amount: number) => {
    if (selectedTab === 'fund') {
      setFundAmount(amount.toString())
    } else if (selectedTab === 'transfer') {
      setTransferAmount(amount.toString())
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const refreshBalance = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Simulate balance refresh
      toast.success("Balance refreshed!")
    } catch (error) {
      toast.error("Failed to refresh balance")
    } finally {
      setIsLoading(false)
    }
  }

  const exportTransactions = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success("Transaction history exported!")
    } catch (error) {
      toast.error("Export failed")
    } finally {
      setIsLoading(false)
    }
  }

  const getTransactionIcon = (transaction: WalletTransaction) => {
    if (transaction.type === 'credit') {
      return <ArrowDownRight className="w-5 h-5 text-green-500" />
    } else {
      return <ArrowUpRight className="w-5 h-5 text-red-500" />
    }
  }

  const getTransactionColor = (transaction: WalletTransaction) => {
    return transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      funding: 'bg-green-100 text-green-800',
      transfer: 'bg-blue-100 text-blue-800',
      service: 'bg-purple-100 text-purple-800',
      refund: 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const transactionSummary = {
    title: pendingTransaction?.type === 'wallet_funding' ? "Wallet Funding" : "Money Transfer",
    items: pendingTransaction?.type === 'wallet_funding' ? [
      {
        label: "Amount",
        value: `₦${pendingTransaction?.amount?.toLocaleString() || 0}`
      },
      {
        label: "Payment Method",
        value: pendingTransaction?.paymentMethod || ""
      },
      {
        label: "Processing Fee",
        value: pendingTransaction?.fee || "₦0"
      }
    ] : [
      {
        label: "Recipient",
        value: pendingTransaction?.recipient || ""
      },
      {
        label: "Amount",
        value: `₦${pendingTransaction?.amount?.toLocaleString() || 0}`
      },
      {
        label: "Note",
        value: pendingTransaction?.note || "No note"
      },
      {
        label: "Transfer Fee",
        value: "₦0"
      }
    ],
    total: `₦${pendingTransaction?.amount?.toLocaleString() || 0}`,
    buttonText: pendingTransaction?.type === 'wallet_funding' ? "Fund Wallet" : "Send Money",
    buttonIcon: pendingTransaction?.type === 'wallet_funding' ? <Plus className="mr-2 h-5 w-5" /> : <Send className="mr-2 h-5 w-5" />
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
          <p className="text-muted-foreground">Manage your funds securely</p>
        </motion.div>

        {/* Enhanced Wallet Balance Card */}
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
                  <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/20 rounded-full"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-6 h-6" />
                      <span className="text-white/80">Wallet Balance</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-white hover:bg-white/20 h-8 w-8"
                      >
                        {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={refreshBalance}
                        disabled={isLoading}
                        className="text-white hover:bg-white/20 h-8 w-8"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-4xl font-bold mb-2">
                      {showBalance ? `₦${walletBalance.toLocaleString()}` : "₦****"}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-300" />
                        <span className="text-sm text-green-300">+12.5% this month</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-0">
                        <Shield className="w-3 h-3 mr-1" />
                        Secured
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="secondary" 
                      className="bg-white/20 text-white border-0 hover:bg-white/30"
                      onClick={() => setSelectedTab('fund')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Fund Wallet
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="bg-white/20 text-white border-0 hover:bg-white/30"
                      onClick={() => setSelectedTab('transfer')}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Money
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((amount, index) => (
                  <motion.div
                    key={amount}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(amount)}
                      className="h-12 w-full bg-background/50 hover:bg-background/80"
                    >
                      ₦{amount.toLocaleString()}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger value="fund" className="flex flex-col items-center space-y-1 py-3">
                <Plus className="w-4 h-4" />
                <span className="text-xs">Fund</span>
              </TabsTrigger>
              <TabsTrigger value="transfer" className="flex flex-col items-center space-y-1 py-3">
                <Send className="w-4 h-4" />
                <span className="text-xs">Transfer</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex flex-col items-center space-y-1 py-3">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">Schedule</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex flex-col items-center space-y-1 py-3">
                <History className="w-4 h-4" />
                <span className="text-xs">History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fund" className="space-y-6">
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Fund Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label htmlFor="fundAmount">Amount (₦)</Label>
                    <Input
                      id="fundAmount"
                      type="number"
                      placeholder="Enter amount (minimum ₦100)"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="h-12 bg-background/50 border-border/50"
                      min="100"
                    />
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <motion.div
                            key={method.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              selectedPaymentMethod === method.id
                                ? 'border-primary bg-primary/10'
                                : 'border-border/50 hover:border-border bg-background/30'
                            } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => method.available && setSelectedPaymentMethod(method.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-background/50 rounded-lg">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{method.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Fee: {method.fee} • {method.processingTime}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Limits: ₦{method.limits.min.toLocaleString()} - ₦{method.limits.max.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {!method.available && (
                                  <Badge variant="secondary" className="text-xs">
                                    Coming Soon
                                  </Badge>
                                )}
                                {method.id === 'paystack' && (
                                  <Badge className="bg-green-100 text-green-800 border-0 text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Bank Transfer Details */}
                  {selectedPaymentMethod === 'bank_transfer' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-3 flex items-center">
                            <Building className="w-4 h-4 mr-2" />
                            Bank Transfer Details
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Bank Name:</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{bankDetails.bankName}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => copyToClipboard(bankDetails.bankName)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Account Number:</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium font-mono">{bankDetails.accountNumber}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => copyToClipboard(bankDetails.accountNumber)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Account Name:</span>
                              <span className="font-medium">{bankDetails.accountName}</span>
                            </div>
                          </div>
                          <Alert className="mt-3">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Transfer will be confirmed automatically within 5-10 minutes
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  <Button 
                    onClick={handleFundWallet} 
                    className="w-full h-12 text-base font-medium"
                    disabled={!fundAmount || !selectedPaymentMethod || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Fund Wallet
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transfer" className="space-y-6">
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Money
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input
                      id="recipient"
                      placeholder="Phone number, email, or username"
                      value={transferRecipient}
                      onChange={(e) => setTransferRecipient(e.target.value)}
                      className="h-12 bg-background/50 border-border/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transferAmount">Amount (₦)</Label>
                    <Input
                      id="transferAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="h-12 bg-background/50 border-border/50"
                      min="100"
                      max={walletBalance}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available balance: ₦{walletBalance.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Input
                      id="note"
                      placeholder="Add a note for this transfer"
                      value={transferNote}
                      onChange={(e) => setTransferNote(e.target.value)}
                      className="h-12 bg-background/50 border-border/50"
                    />
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Transfers are instant and secure. No fees for transfers to VTopup users.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={handleTransferMoney} 
                    className="w-full h-12 text-base font-medium"
                    disabled={!transferRecipient || !transferAmount || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Money
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Scheduled Transactions
                    </CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Schedule
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scheduledTransactions.map((schedule, index) => (
                      <motion.div
                        key={schedule.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">{schedule.description}</h4>
                              <p className="text-xs text-muted-foreground">
                                {schedule.recipient} • ₦{schedule.amount.toLocaleString()}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {schedule.frequency}
                                </Badge>
                                <Badge className={`text-xs ${
                                  schedule.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                } border-0`}>
                                  {schedule.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Next run</p>
                            <p className="text-sm font-medium">{schedule.nextRun}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {scheduledTransactions.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No scheduled transactions</h3>
                        <p className="text-muted-foreground mb-4">Set up recurring payments and transfers</p>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Schedule
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="glass-card border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <History className="w-5 h-5 mr-2" />
                      Transaction History
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={exportTransactions} disabled={isLoading}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg bg-background/30 hover:bg-background/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center border border-border/30">
                              {getTransactionIcon(transaction)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{transaction.description}</h4>
                                <Badge className={`text-xs ${getCategoryBadge(transaction.category)} border-0`}>
                                  {transaction.category}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                              <p className="text-xs text-muted-foreground font-mono">{transaction.reference}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-sm ${getTransactionColor(transaction)}`}>
                              {transaction.type === 'credit' ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Balance: ₦{transaction.balance.toLocaleString()}
                            </p>
                            <Badge className={`text-xs mt-1 ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            } border-0`}>
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Slide-up Transaction Summary */}
      <SlideUpTransactionSummary
        isVisible={showSummary}
        onClose={() => setShowSummary(false)}
        onConfirm={handleConfirmTransaction}
        isProcessing={isLoading}
        summary={transactionSummary}
      />

      {/* Biometric Auth Dialog */}
      <BiometricAuthDialog
        open={showBiometric}
        onOpenChange={setShowBiometric}
        onSuccess={handleBiometricSuccess}
        onFallback={handleBiometricFallback}
        userId="wallet-user"
        title="Authorize Transaction"
        description={`Confirm your ${pendingTransaction?.type === 'wallet_funding' ? 'wallet funding' : 'money transfer'} of ₦${pendingTransaction?.amount?.toLocaleString()}`}
      />

      {/* PIN Dialog */}
      {showPin && (
        <InputPinCard
          onSuccess={handlePinSuccess}
          onCancel={() => setShowPin(false)}
          title="Enter Transaction PIN"
          description={`Confirm your ${pendingTransaction?.type === 'wallet_funding' ? 'wallet funding' : 'money transfer'} of ₦${pendingTransaction?.amount?.toLocaleString()}`}
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
