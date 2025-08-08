"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, CheckCircle, XCircle, Smartphone, Wifi, Tv, Zap, Wallet } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface Transaction {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: "airtime" | "data" | "cable" | "electricity" | "wallet_funding"
  description: string
  amount: number
  status: "completed" | "pending" | "failed"
  date: string
  reference: string
  network?: string
  phoneNumber?: string
  provider?: string
  fee: number
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN001",
    userId: "USR001",
    userName: "John Doe",
    userEmail: "john@example.com",
    type: "airtime",
    description: "MTN Airtime Purchase",
    amount: 1000,
    status: "completed",
    date: "2024-01-20 14:30",
    reference: "VT001234567",
    network: "MTN",
    phoneNumber: "08012345678",
    fee: 0,
  },
  {
    id: "TXN002",
    userId: "USR002",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    type: "data",
    description: "Airtel 5GB Data Bundle",
    amount: 2500,
    status: "pending",
    date: "2024-01-20 13:15",
    reference: "VT001234568",
    network: "Airtel",
    phoneNumber: "08087654321",
    fee: 0,
  },
  {
    id: "TXN003",
    userId: "USR003",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    type: "cable",
    description: "DSTV Compact Subscription",
    amount: 9000,
    status: "failed",
    date: "2024-01-20 11:45",
    reference: "VT001234569",
    provider: "DSTV",
    fee: 100,
  },
  {
    id: "TXN004",
    userId: "USR004",
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    type: "electricity",
    description: "EKEDC Electricity Payment",
    amount: 5000,
    status: "completed",
    date: "2024-01-20 10:20",
    reference: "VT001234570",
    provider: "EKEDC",
    fee: 50,
  },
  {
    id: "TXN005",
    userId: "USR001",
    userName: "John Doe",
    userEmail: "john@example.com",
    type: "wallet_funding",
    description: "Wallet Funding - Paystack",
    amount: 10000,
    status: "completed",
    date: "2024-01-20 09:00",
    reference: "VT001234571",
    fee: 150,
  },
]

export function AdminTransactionsManager() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-600 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "airtime":
        return Smartphone
      case "data":
        return Wifi
      case "cable":
        return Tv
      case "electricity":
        return Zap
      case "wallet_funding":
        return Wallet
      default:
        return Wallet
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "airtime":
        return "text-blue-500"
      case "data":
        return "text-green-500"
      case "cable":
        return "text-purple-500"
      case "electricity":
        return "text-yellow-500"
      case "wallet_funding":
        return "text-indigo-500"
      default:
        return "text-gray-500"
    }
  }

  const handleStatusChange = (transactionId: string, newStatus: string) => {
    setTransactions((prev) =>
      prev.map((transaction) => {
        if (transaction.id === transactionId) {
          return { ...transaction, status: newStatus as any }
        }
        return transaction
      }),
    )
    toast.success(`Transaction status updated to ${newStatus}`)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.phoneNumber?.includes(searchQuery) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    total: transactions.length,
    completed: transactions.filter((t) => t.status === "completed").length,
    pending: transactions.filter((t) => t.status === "pending").length,
    failed: transactions.filter((t) => t.status === "failed").length,
    totalAmount: transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Transaction Management</h1>
        <p className="text-muted-foreground">Monitor and manage all platform transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">₦{stats.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="material-card">
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="airtime">Airtime</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="cable">Cable TV</SelectItem>
                <SelectItem value="electricity">Electricity</SelectItem>
                <SelectItem value="wallet_funding">Wallet Funding</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle>All Transactions ({filteredTransactions.length})</CardTitle>
          <CardDescription>Monitor and manage platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => {
              const Icon = getTypeIcon(transaction.type)
              const typeColor = getTypeColor(transaction.type)

              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-background/50 rounded-xl flex items-center justify-center border border-border/30">
                      <Icon className={`w-6 h-6 ${typeColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-sm">{transaction.description}</p>
                        <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>{transaction.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{transaction.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.reference} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">₦{transaction.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Fee: ₦{transaction.fee}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 mt-1"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Icon className={`w-5 h-5 ${typeColor}`} />
                            <span>{transaction.description}</span>
                          </DialogTitle>
                          <DialogDescription>Transaction ID: {transaction.id}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          {/* Transaction Details */}
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Customer:</span>
                              <span className="text-sm font-medium">{transaction.userName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Email:</span>
                              <span className="text-sm">{transaction.userEmail}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Amount:</span>
                              <span className="text-sm font-medium">₦{transaction.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Fee:</span>
                              <span className="text-sm">₦{transaction.fee}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Reference:</span>
                              <span className="text-sm font-mono">{transaction.reference}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Date:</span>
                              <span className="text-sm">{transaction.date}</span>
                            </div>
                            {transaction.phoneNumber && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Phone:</span>
                                <span className="text-sm">{transaction.phoneNumber}</span>
                              </div>
                            )}
                            {transaction.network && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Network:</span>
                                <span className="text-sm">{transaction.network}</span>
                              </div>
                            )}
                            {transaction.provider && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Provider:</span>
                                <span className="text-sm">{transaction.provider}</span>
                              </div>
                            )}
                          </div>

                          {/* Status Control */}
                          {transaction.status === "pending" && (
                            <div className="space-y-3">
                              <label className="text-sm font-medium">Update Status</label>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                                  onClick={() => handleStatusChange(transaction.id, "completed")}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                                  onClick={() => handleStatusChange(transaction.id, "failed")}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
