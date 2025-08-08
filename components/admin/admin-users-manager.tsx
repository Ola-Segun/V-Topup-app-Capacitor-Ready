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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, Shield, Mail, Phone, Calendar, Wallet } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

interface User {
  id: string
  name: string
  email: string
  phone: string
  status: "active" | "suspended" | "pending"
  kycStatus: "verified" | "pending" | "rejected"
  walletBalance: number
  totalTransactions: number
  joinedDate: string
  lastActive: string
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john@example.com",
    phone: "08012345678",
    status: "active",
    kycStatus: "verified",
    walletBalance: 15000,
    totalTransactions: 45,
    joinedDate: "2024-01-15",
    lastActive: "2024-01-20 14:30",
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "08087654321",
    status: "active",
    kycStatus: "pending",
    walletBalance: 8500,
    totalTransactions: 23,
    joinedDate: "2024-01-10",
    lastActive: "2024-01-19 09:15",
  },
  {
    id: "USR003",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "08098765432",
    status: "suspended",
    kycStatus: "rejected",
    walletBalance: 2000,
    totalTransactions: 12,
    joinedDate: "2024-01-05",
    lastActive: "2024-01-18 16:45",
  },
  {
    id: "USR004",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "08123456789",
    status: "pending",
    kycStatus: "pending",
    walletBalance: 0,
    totalTransactions: 0,
    joinedDate: "2024-01-20",
    lastActive: "2024-01-20 10:00",
  },
]

export function AdminUsersManager() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [kycFilter, setKycFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      case "suspended":
        return "bg-red-500/20 text-red-600 border-red-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  const getKycColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-600 border-red-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          return { ...user, status: newStatus as any }
        }
        return user
      }),
    )
    toast.success(`User status updated to ${newStatus}`)
  }

  const handleKycStatusChange = (userId: string, newStatus: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          return { ...user, kycStatus: newStatus as any }
        }
        return user
      }),
    )
    toast.success(`KYC status updated to ${newStatus}`)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesKyc = kycFilter === "all" || user.kycStatus === kycFilter

    return matchesSearch && matchesStatus && matchesKyc
  })

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    pending: users.filter((u) => u.status === "pending").length,
    verified: users.filter((u) => u.kycStatus === "verified").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage users, KYC status, and account settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
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
      </div>

      {/* Filters */}
      <Card className="material-card">
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by KYC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All KYC</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <Badge className={`text-xs ${getStatusColor(user.status)}`}>{user.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">₦{user.walletBalance.toLocaleString()}</p>
                  <Badge className={`text-xs ${getKycColor(user.kycStatus)}`}>{user.kycStatus}</Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 mt-1"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </DialogTitle>
                        <DialogDescription>User ID: {user.id}</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Joined: {user.joinedDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Wallet className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Balance: ₦{user.walletBalance.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Status Controls */}
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium">Account Status</label>
                            <Select value={user.status} onValueChange={(value) => handleStatusChange(user.id, value)}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium">KYC Status</label>
                            <Select
                              value={user.kycStatus}
                              onValueChange={(value) => handleKycStatusChange(user.id, value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => toast.success("Email sent to user")}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => toast.success("User account reset")}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Reset
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
