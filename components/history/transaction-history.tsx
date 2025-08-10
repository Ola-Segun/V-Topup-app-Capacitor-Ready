"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Smartphone, Wifi, Calendar, Tv, Zap, Filter, X } from 'lucide-react'
import Link from "next/link"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { motion } from "framer-motion"

interface Transaction {
  id: string
  type: "airtime" | "data" | "wallet_funding" | "cable" | "electricity"
  network?: string
  amount: number
  phone?: string
  status: "completed" | "pending" | "failed"
  date: string
  time: string
  reference: string
  description: string
  provider?: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "airtime",
    network: "MTN",
    amount: 1000,
    phone: "08012345678",
    status: "completed",
    date: "2024-01-15",
    time: "14:30",
    reference: "TXN001234567",
    description: "Airtime Purchase - MTN",
  },
  {
    id: "2",
    type: "data",
    network: "Airtel",
    amount: 2000,
    phone: "08087654321",
    status: "completed",
    date: "2024-01-14",
    time: "10:15",
    reference: "TXN001234568",
    description: "Data Purchase - 2GB Monthly",
  },
  {
    id: "3",
    type: "wallet_funding",
    amount: 5000,
    status: "completed",
    date: "2024-01-13",
    time: "16:45",
    reference: "TXN001234569",
    description: "Wallet Funding - Paystack",
  },
  {
    id: "4",
    type: "cable",
    provider: "DSTV",
    amount: 9000,
    status: "pending",
    date: "2024-01-12",
    time: "09:20",
    reference: "TXN001234570",
    description: "DSTV Compact Subscription",
  },
  {
    id: "5",
    type: "electricity",
    provider: "EKEDC",
    amount: 3000,
    status: "failed",
    date: "2024-01-11",
    time: "13:10",
    reference: "TXN001234571",
    description: "Electricity Payment - EKEDC",
  },
]

export function TransactionHistory() {
  const [transactions] = useState(mockTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [sortBy, setSortBy] = useState("date_desc")

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      // Search filter
      const searchMatch =
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.network?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.provider?.toLowerCase().includes(searchTerm.toLowerCase())

      // Type filter
      const typeMatch = filterType === "all" || transaction.type === filterType

      // Status filter
      const statusMatch = filterStatus === "all" || transaction.status === filterStatus

      // Date filter
      let dateMatch = true
      if (filterDate !== "all") {
        const transactionDate = new Date(transaction.date)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        const lastWeek = new Date(today)
        lastWeek.setDate(lastWeek.getDate() - 7)
        const lastMonth = new Date(today)
        lastMonth.setMonth(lastMonth.getMonth() - 1)

        switch (filterDate) {
          case "today":
            dateMatch = transactionDate.toDateString() === today.toDateString()
            break
          case "yesterday":
            dateMatch = transactionDate.toDateString() === yesterday.toDateString()
            break
          case "last_week":
            dateMatch = transactionDate >= lastWeek
            break
          case "last_month":
            dateMatch = transactionDate >= lastMonth
            break
        }
      }

      return searchMatch && typeMatch && statusMatch && dateMatch
    })

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.date + " " + b.time).getTime() - new Date(a.date + " " + a.time).getTime()
        case "date_asc":
          return new Date(a.date + " " + a.time).getTime() - new Date(b.date + " " + b.time).getTime()
        case "amount_desc":
          return b.amount - a.amount
        case "amount_asc":
          return a.amount - b.amount
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return filtered
  }, [transactions, searchTerm, filterType, filterStatus, filterDate, sortBy])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "airtime":
        return Smartphone
      case "data":
        return Wifi
      case "wallet_funding":
        return Calendar
      case "cable":
        return Tv
      case "electricity":
        return Zap
      default:
        return Calendar
    }
  }

  const getTransactionColor = (type: string, status: string) => {
    if (status === "failed") return "text-red-500"
    if (status === "pending") return "text-yellow-500"

    switch (type) {
      case "airtime":
        return "text-blue-500"
      case "data":
        return "text-green-500"
      case "wallet_funding":
        return "text-purple-500"
      case "cable":
        return "text-orange-500"
      case "electricity":
        return "text-yellow-600"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-500 border-0 text-xs">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-0 text-xs">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-500 border-0 text-xs">Failed</Badge>
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Unknown
          </Badge>
        )
    }
  }

  const formatDate = (date: string, time: string) => {
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    if (date === today) return `Today, ${time}`
    if (date === yesterday) return `Yesterday, ${time}`
    return `${date}, ${time}`
  }

  const clearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterStatus("all")
    setFilterDate("all")
    setSortBy("date_desc")
  }

  const hasActiveFilters = searchTerm !== "" || filterType !== "all" || filterStatus !== "all" || filterDate !== "all"

  return (
    <div className="min-h-screen">
      <PremiumMobileNav />

      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">View all your transactions</p>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters} className="glass-card bg-transparent">
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card border-0 shadow-lg">
            <CardContent className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions, references, phone numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>

              {/* Filters Row 1 */}
              <div className="grid grid-cols-2 gap-3">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="airtime">Airtime</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="wallet_funding">Wallet Funding</SelectItem>
                    <SelectItem value="cable">Cable TV</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filters Row 2 */}
              <div className="grid grid-cols-2 gap-3">
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="last_week">Last Week</SelectItem>
                    <SelectItem value="last_month">Last Month</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Newest First</SelectItem>
                    <SelectItem value="date_asc">Oldest First</SelectItem>
                    <SelectItem value="amount_desc">Highest Amount</SelectItem>
                    <SelectItem value="amount_asc">Lowest Amount</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  <span>
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Transactions</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {filteredTransactions.length} transactions
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTransactions.map((transaction, index) => {
                  const Icon = getTransactionIcon(transaction.type)
                  const color = getTransactionColor(transaction.type, transaction.status)

                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Link href={`/dashboard/history/${transaction.id}`}>
                        <div className="flex items-center justify-between p-4 bg-background/30 rounded-xl hover:bg-background/50 transition-colors cursor-pointer border border-border/30">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-background/50 rounded-lg flex items-center justify-center border border-border/30 flex-shrink-0">
                              <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-semibold text-sm truncate">{transaction.description}</p>
                                {(transaction.network || transaction.provider) && (
                                  <Badge variant="outline" className="text-xs border-border/50 flex-shrink-0">
                                    {transaction.network || transaction.provider}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {transaction.phone || "Wallet"} • {formatDate(transaction.date, transaction.time)}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">{transaction.reference}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-3">
                            <p
                              className={`font-bold text-sm ${
                                transaction.type === "wallet_funding" ? "text-green-500" : color
                              }`}
                            >
                              {transaction.type === "wallet_funding" ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                            </p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No transactions found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
