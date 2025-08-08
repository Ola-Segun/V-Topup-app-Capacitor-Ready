"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Wallet, CreditCard, Loader2, Plus, Send, Calendar, Clock, Users, Smartphone, Building, QrCode, Copy, Eye, EyeOff } from 'lucide-react'
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import { WalletBalance } from "@/components/wallet/wallet-balance"
import { motion } from "framer-motion"
import { toast } from "sonner"

const fundWalletSchema = z.object({
  amount: z.string().min(1, "Please enter an amount"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
})

const transferSchema = z.object({
  recipient: z.string().min(1, "Please enter recipient"),
  amount: z.string().min(1, "Please enter amount"),
  pin: z.string().min(4, "Please enter your transaction PIN"),
  note: z.string().optional(),
})

const scheduleSchema = z.object({
  type: z.string().min(1, "Please select transaction type"),
  recipient: z.string().min(1, "Please enter recipient"),
  amount: z.string().min(1, "Please enter amount"),
  frequency: z.string().min(1, "Please select frequency"),
  startDate: z.string().min(1, "Please select start date"),
})

type FundWalletForm = z.infer<typeof fundWalletSchema>
type TransferForm = z.infer<typeof transferSchema>
type ScheduleForm = z.infer<typeof scheduleSchema>

const paymentMethods = [
  { value: "paystack", label: "Paystack (Card)", icon: CreditCard, fee: "1.5%" },
  { value: "bank_transfer", label: "Bank Transfer", icon: Building, fee: "₦50" },
  { value: "ussd", label: "USSD (*737#)", icon: Smartphone, fee: "₦10" },
  { value: "mobile_money", label: "Mobile Money", icon: Wallet, fee: "1.0%" },
  { value: "crypto", label: "Cryptocurrency", icon: QrCode, fee: "0.5%" },
]

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000]

export function WalletManagement() {
  const [loading, setLoading] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("")
  const [walletBalance] = useState(25000)
  const [showPin, setShowPin] = useState(false)
  const [activeTab, setActiveTab] = useState("fund")
  const { toast } = useToast()

  const fundForm = useForm<FundWalletForm>({
    resolver: zodResolver(fundWalletSchema),
  })

  const transferForm = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
  })

  const scheduleForm = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
  })

  const onFundSubmit = async (data: FundWalletForm) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      toast({
        title: "Wallet Funded Successfully!",
        description: `₦${data.amount} has been added to your wallet`,
      })
      fundForm.reset()
      setSelectedAmount("")
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onTransferSubmit = async (data: TransferForm) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Transfer Successful!",
        description: `₦${data.amount} sent to ${data.recipient}`,
      })
      transferForm.reset()
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Please check recipient details and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onScheduleSubmit = async (data: ScheduleForm) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast({
        title: "Schedule Created!",
        description: `${data.type} scheduled for ${data.frequency}`,
      })
      scheduleForm.reset()
    } catch (error) {
      toast({
        title: "Schedule Failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAmount = (amount: number) => {
    fundForm.setValue("amount", amount.toString())
    setSelectedAmount(amount.toString())
  }

  const bankDetails = {
    bankName: "Providus Bank",
    accountNumber: "9876543210",
    accountName: "VTopup - John Doe"
  }

  const scheduledTransactions = [
    {
      id: 1,
      type: "Airtime",
      recipient: "08012345678",
      amount: 1000,
      frequency: "Weekly",
      nextRun: "2024-01-22",
      status: "active"
    },
    {
      id: 2,
      type: "Data",
      recipient: "08087654321",
      amount: 2000,
      frequency: "Monthly",
      nextRun: "2024-02-01",
      status: "active"
    }
  ]

  const recentTransfers = [
    {
      id: 1,
      type: "sent",
      recipient: "Jane Smith",
      amount: 5000,
      date: "2024-01-15",
      status: "completed"
    },
    {
      id: 2,
      type: "received",
      sender: "Mike Johnson",
      amount: 3000,
      date: "2024-01-14",
      status: "completed"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      <MobileNav />

      <div className="mobile-container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Wallet Management</h1>
          <p className="text-muted-foreground">Fund your wallet, transfer money, and schedule payments</p>
        </motion.div>

        {/* Wallet Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <WalletBalance balance={walletBalance} />
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="fund" className="text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Fund
            </TabsTrigger>
            <TabsTrigger value="transfer" className="text-xs">
              <Send className="w-4 h-4 mr-1" />
              Transfer
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs">
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs">
              <Clock className="w-4 h-4 mr-1" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fund" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Fund Wallet
                  </CardTitle>
                  <CardDescription>Add money to your wallet using various payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={fundForm.handleSubmit(onFundSubmit)} className="space-y-6">
                    {/* Quick Amount Selection */}
                    <div className="space-y-2">
                      <Label>Quick Amount Selection</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={selectedAmount === amount.toString() ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleQuickAmount(amount)}
                            className="bg-transparent"
                          >
                            ₦{amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₦)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount (minimum ₦100)"
                        {...fundForm.register("amount")}
                        className={fundForm.formState.errors.amount ? "border-red-500" : ""}
                        onChange={(e) => setSelectedAmount(e.target.value)}
                      />
                      {fundForm.formState.errors.amount && (
                        <p className="text-sm text-red-500">{fundForm.formState.errors.amount.message}</p>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select onValueChange={(value) => fundForm.setValue("paymentMethod", value)}>
                        <SelectTrigger className={fundForm.formState.errors.paymentMethod ? "border-red-500" : ""}>
                          <SelectValue placeholder="Choose payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center space-x-2">
                                  <method.icon className="w-4 h-4" />
                                  <span>{method.label}</span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {method.fee}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fundForm.formState.errors.paymentMethod && (
                        <p className="text-sm text-red-500">{fundForm.formState.errors.paymentMethod.message}</p>
                      )}
                    </div>

                    {/* Bank Transfer Details */}
                    {fundForm.watch("paymentMethod") === "bank_transfer" && (
                      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-3">Bank Transfer Details</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Bank Name:</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{bankDetails.bankName}</span>
                                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(bankDetails.bankName)}>
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Account Number:</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{bankDetails.accountNumber}</span>
                                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(bankDetails.accountNumber)}>
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Account Name:</span>
                              <span className="font-medium">{bankDetails.accountName}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Transfer will be confirmed automatically within 5 minutes
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Payment...
                        </>
                      ) : (
                        "Fund Wallet"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="transfer" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Money
                  </CardTitle>
                  <CardDescription>Transfer money to other VTopup users</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={transferForm.handleSubmit(onTransferSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient</Label>
                      <Input
                        id="recipient"
                        placeholder="Phone number, email, or username"
                        {...transferForm.register("recipient")}
                        className={transferForm.formState.errors.recipient ? "border-red-500" : ""}
                      />
                      {transferForm.formState.errors.recipient && (
                        <p className="text-sm text-red-500">{transferForm.formState.errors.recipient.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transferAmount">Amount (₦)</Label>
                      <Input
                        id="transferAmount"
                        type="number"
                        placeholder="Enter amount"
                        {...transferForm.register("amount")}
                        className={transferForm.formState.errors.amount ? "border-red-500" : ""}
                      />
                      {transferForm.formState.errors.amount && (
                        <p className="text-sm text-red-500">{transferForm.formState.errors.amount.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note">Note (Optional)</Label>
                      <Input
                        id="note"
                        placeholder="Add a note"
                        {...transferForm.register("note")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pin">Transaction PIN</Label>
                      <div className="relative">
                        <Input
                          id="pin"
                          type={showPin ? "text" : "password"}
                          placeholder="Enter your 4-digit PIN"
                          maxLength={4}
                          {...transferForm.register("pin")}
                          className={transferForm.formState.errors.pin ? "border-red-500" : ""}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPin(!showPin)}
                        >
                          {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {transferForm.formState.errors.pin && (
                        <p className="text-sm text-red-500">{transferForm.formState.errors.pin.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Money"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Recent Transfers */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent Transfers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransfers.map((transfer) => (
                      <div key={transfer.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transfer.type === "sent" ? "bg-red-100 dark:bg-red-900" : "bg-green-100 dark:bg-green-900"
                          }`}>
                            <Send className={`w-5 h-5 ${
                              transfer.type === "sent" ? "text-red-600 rotate-45" : "text-green-600 -rotate-45"
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {transfer.type === "sent" ? `To ${transfer.recipient}` : `From ${transfer.sender}`}
                            </p>
                            <p className="text-xs text-muted-foreground">{transfer.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold text-sm ${
                            transfer.type === "sent" ? "text-red-600" : "text-green-600"
                          }`}>
                            {transfer.type === "sent" ? "-" : "+"}₦{transfer.amount.toLocaleString()}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {transfer.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Transaction
                  </CardTitle>
                  <CardDescription>Set up recurring payments and scheduled transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={scheduleForm.handleSubmit(onScheduleSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Transaction Type</Label>
                      <Select onValueChange={(value) => scheduleForm.setValue("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="airtime">Airtime Top-up</SelectItem>
                          <SelectItem value="data">Data Bundle</SelectItem>
                          <SelectItem value="cable">Cable TV</SelectItem>
                          <SelectItem value="electricity">Electricity</SelectItem>
                          <SelectItem value="transfer">Money Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scheduleRecipient">Recipient</Label>
                      <Input
                        id="scheduleRecipient"
                        placeholder="Phone number or account details"
                        {...scheduleForm.register("recipient")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scheduleAmount">Amount (₦)</Label>
                      <Input
                        id="scheduleAmount"
                        type="number"
                        placeholder="Enter amount"
                        {...scheduleForm.register("amount")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select onValueChange={(value) => scheduleForm.setValue("frequency", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        {...scheduleForm.register("startDate")}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Schedule...
                        </>
                      ) : (
                        "Create Schedule"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Scheduled Transactions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Active Schedules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scheduledTransactions.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{schedule.type} - {schedule.recipient}</p>
                            <p className="text-xs text-muted-foreground">
                              {schedule.frequency} • Next: {schedule.nextRun}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">₦{schedule.amount.toLocaleString()}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {schedule.status}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Transaction History
                  </CardTitle>
                  <CardDescription>Your wallet transaction history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        type: "Credit",
                        description: "Wallet Funding - Paystack",
                        amount: 5000,
                        date: "2024-01-15",
                        status: "completed",
                      },
                      {
                        id: 2,
                        type: "Debit",
                        description: "Airtime Purchase - MTN",
                        amount: -1000,
                        date: "2024-01-14",
                        status: "completed",
                      },
                      {
                        id: 3,
                        type: "Debit",
                        description: "Money Transfer to Jane Smith",
                        amount: -5000,
                        date: "2024-01-13",
                        status: "completed",
                      },
                      {
                        id: 4,
                        type: "Credit",
                        description: "Money Received from Mike Johnson",
                        amount: 3000,
                        date: "2024-01-12",
                        status: "completed",
                      },
                    ].map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-background/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              transaction.type === "Credit" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                            }`}
                          >
                            <Wallet
                              className={`w-5 h-5 ${transaction.type === "Credit" ? "text-green-600" : "text-red-600"}`}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold text-sm ${
                              transaction.type === "Credit" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "Credit" ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
