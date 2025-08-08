"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  Smartphone,
  Wifi,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface TransactionDetailsProps {
  transactionId: string
}

// Mock transaction data - in real app, this would come from API
const mockTransaction = {
  id: "TXN001234567",
  type: "airtime",
  network: "MTN",
  amount: 1000,
  phone: "08012345678",
  status: "completed",
  date: "2024-01-15",
  time: "14:30:25",
  reference: "TXN001234567",
  description: "Airtime Purchase - MTN",
  fee: 0,
  total: 1000,
  paymentMethod: "Wallet",
  balanceBefore: 26750,
  balanceAfter: 25750,
  processingTime: "2.3 seconds",
  receipt: {
    merchant: "TopUp Pro",
    merchantId: "TUP001",
    terminal: "WEB001",
    location: "Online",
  },
}

export function TransactionDetails({ transactionId }: TransactionDetailsProps) {
  const [transaction] = useState(mockTransaction)

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "airtime":
        return Smartphone
      case "data":
        return Wifi
      case "wallet_funding":
        return Wallet
      default:
        return Wallet
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "failed":
        return XCircle
      case "pending":
        return Clock
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "failed":
        return "text-red-500"
      case "pending":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  const handleDownloadReceipt = () => {
    toast.success("Receipt downloaded successfully")
  }

  const handleShareReceipt = () => {
    toast.success("Receipt shared successfully")
  }

  const handleRetryTransaction = () => {
    toast.info("Redirecting to retry transaction...")
  }

  const Icon = getTransactionIcon(transaction.type)
  const StatusIcon = getStatusIcon(transaction.status)
  const statusColor = getStatusColor(transaction.status)

  return (
    <div className="min-h-screen">
      <PremiumMobileNav />

      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4"
        >
          <Link href="/dashboard/history">
            <Button variant="ghost" size="icon" className="glass-card">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Transaction Details</h1>
            <p className="text-muted-foreground">Reference: {transaction.reference}</p>
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    transaction.status === "completed"
                      ? "emerald-gradient"
                      : transaction.status === "failed"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                >
                  <StatusIcon className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">₦{transaction.amount.toLocaleString()}</h2>
                <p className="text-muted-foreground">{transaction.description}</p>
                <Badge
                  className={`${
                    transaction.status === "completed"
                      ? "bg-green-500/20 text-green-500"
                      : transaction.status === "failed"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-yellow-500/20 text-yellow-500"
                  } border-0 capitalize`}
                >
                  {transaction.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon className="w-5 h-5 mr-2" />
                Transaction Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold capitalize">{transaction.type.replace("_", " ")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="font-semibold">{transaction.network || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-semibold">{transaction.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-semibold">{transaction.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">
                    {transaction.date} {transaction.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Processing Time</p>
                  <p className="font-semibold">{transaction.processingTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Amount Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Amount Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">₦{transaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="font-semibold text-green-500">₦{transaction.fee}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">₦{transaction.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet Balance */}
        {transaction.type !== "wallet_funding" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Balance Before</span>
                  <span className="font-semibold">₦{transaction.balanceBefore.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount Deducted</span>
                  <span className="font-semibold text-red-500">-₦{transaction.total.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Balance After</span>
                    <span className="font-bold text-lg">₦{transaction.balanceAfter.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Receipt Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Receipt Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Merchant</p>
                  <p className="font-semibold">{transaction.receipt.merchant}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Merchant ID</p>
                  <p className="font-semibold">{transaction.receipt.merchantId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Terminal</p>
                  <p className="font-semibold">{transaction.receipt.terminal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{transaction.receipt.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleDownloadReceipt}
              className="h-12 glass-card border border-white/20 hover:bg-white/10 bg-transparent"
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleShareReceipt}
              className="h-12 glass-card border border-white/20 hover:bg-white/10 bg-transparent"
              variant="outline"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {transaction.status === "failed" && (
            <Button
              onClick={handleRetryTransaction}
              className="w-full h-12 mt-4 premium-gradient text-white font-semibold"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Transaction
            </Button>
          )}
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-muted-foreground">Transaction secured with 256-bit encryption</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
