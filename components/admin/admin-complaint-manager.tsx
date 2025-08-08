"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, CheckCircle, Send, User } from "lucide-react"
import { toast } from "sonner"

interface Complaint {
  id: string
  userId: string
  userName: string
  userEmail: string
  subject: string
  category: string
  priority: "low" | "medium" | "high"
  status: "open" | "in-progress" | "resolved" | "closed"
  description: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  responses: {
    id: string
    message: string
    sender: "user" | "admin"
    senderName: string
    timestamp: string
  }[]
}

const mockComplaints: Complaint[] = [
  {
    id: "CMP001",
    userId: "USR001",
    userName: "John Doe",
    userEmail: "john@example.com",
    subject: "Failed Transaction Not Refunded",
    category: "billing",
    priority: "high",
    status: "in-progress",
    description: "My airtime purchase failed but money was deducted from my wallet. Transaction ID: TXN12345",
    createdAt: "2024-01-15 10:30",
    updatedAt: "2024-01-15 14:20",
    assignedTo: "Admin User",
    responses: [
      {
        id: "1",
        message: "Thank you for contacting us. We're investigating your transaction issue.",
        sender: "admin",
        senderName: "Support Team",
        timestamp: "2024-01-15 11:00",
      },
      {
        id: "2",
        message: "I've been waiting for 4 hours. When will this be resolved?",
        sender: "user",
        senderName: "John Doe",
        timestamp: "2024-01-15 14:20",
      },
    ],
  },
  {
    id: "CMP002",
    userId: "USR002",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    subject: "Unable to Purchase Data Bundle",
    category: "technical",
    priority: "medium",
    status: "resolved",
    description: "The app keeps showing error when I try to buy data for my Airtel line",
    createdAt: "2024-01-14 16:45",
    updatedAt: "2024-01-15 09:15",
    assignedTo: "Tech Support",
    responses: [
      {
        id: "1",
        message: "We've identified and fixed the issue. Please try again.",
        sender: "admin",
        senderName: "Tech Support",
        timestamp: "2024-01-15 09:15",
      },
    ],
  },
  {
    id: "CMP003",
    userId: "USR003",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    subject: "Account Verification Issues",
    category: "account",
    priority: "low",
    status: "open",
    description: "I'm having trouble verifying my account with my BVN",
    createdAt: "2024-01-13 12:00",
    updatedAt: "2024-01-13 12:00",
    responses: [],
  },
]

export function AdminComplaintManager() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [newResponse, setNewResponse] = useState("")
  const [isResponding, setIsResponding] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500/20 text-blue-600 border-blue-500/30"
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      case "resolved":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      case "closed":
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-600 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-600 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500/30"
    }
  }

  const handleStatusChange = (complaintId: string, newStatus: string) => {
    setComplaints((prev) =>
      prev.map((complaint) => {
        if (complaint.id === complaintId) {
          return {
            ...complaint,
            status: newStatus as any,
            updatedAt: new Date().toLocaleString(),
          }
        }
        return complaint
      }),
    )
    toast.success(`Complaint status updated to ${newStatus}`)
  }

  const handleSendResponse = async () => {
    if (!newResponse.trim() || !selectedComplaint) return

    setIsResponding(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id === selectedComplaint.id) {
        return {
          ...complaint,
          responses: [
            ...complaint.responses,
            {
              id: String(complaint.responses.length + 1),
              message: newResponse,
              sender: "admin" as const,
              senderName: "Support Team",
              timestamp: new Date().toLocaleString(),
            },
          ],
          status: complaint.status === "open" ? ("in-progress" as const) : complaint.status,
          updatedAt: new Date().toLocaleString(),
        }
      }
      return complaint
    })

    setComplaints(updatedComplaints)
    setSelectedComplaint(updatedComplaints.find((c) => c.id === selectedComplaint.id) || null)
    setNewResponse("")
    setIsResponding(false)
    toast.success("Response sent successfully!")
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.userName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    highPriority: complaints.filter((c) => c.priority === "high").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Complaint Management</h1>
          <p className="text-muted-foreground">Handle customer complaints and support requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              <p className="text-sm text-muted-foreground">Open</p>
            </div>
          </CardContent>
        </Card>
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="material-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48 material-input">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full md:w-48 material-input">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card className="material-card">
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
          <CardDescription>Manage customer complaints and support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="font-mono text-sm">{complaint.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{complaint.userName}</p>
                        <p className="text-xs text-muted-foreground">{complaint.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate">{complaint.subject}</p>
                      <p className="text-xs text-muted-foreground capitalize">{complaint.category}</p>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getPriorityColor(complaint.priority)}`}>{complaint.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={complaint.status}
                        onValueChange={(value) => handleStatusChange(complaint.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={`text-xs ${getStatusColor(complaint.status)} border-0`}>
                            {complaint.status.replace("-", " ")}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">{complaint.createdAt}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <span>{complaint.subject}</span>
                              <Badge className={`text-xs ${getStatusColor(complaint.status)}`}>
                                {complaint.status.replace("-", " ")}
                              </Badge>
                              <Badge className={`text-xs ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority}
                              </Badge>
                            </DialogTitle>
                            <DialogDescription>
                              Complaint ID: {complaint.id} • Customer: {complaint.userName}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Complaint Details */}
                            <div className="md:col-span-1 space-y-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Customer Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                      <p className="font-medium">{complaint.userName}</p>
                                      <p className="text-sm text-muted-foreground">{complaint.userEmail}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Complaint Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-medium">Category</Label>
                                    <p className="text-sm capitalize">{complaint.category}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Created</Label>
                                    <p className="text-sm">{complaint.createdAt}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Last Updated</Label>
                                    <p className="text-sm">{complaint.updatedAt}</p>
                                  </div>
                                  {complaint.assignedTo && (
                                    <div>
                                      <Label className="text-sm font-medium">Assigned To</Label>
                                      <p className="text-sm">{complaint.assignedTo}</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>

                            {/* Conversation */}
                            <div className="md:col-span-2 space-y-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Original Complaint</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm">{complaint.description}</p>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Conversation</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                                    {complaint.responses.length === 0 ? (
                                      <p className="text-center text-muted-foreground py-4">No responses yet</p>
                                    ) : (
                                      complaint.responses.map((response) => (
                                        <div
                                          key={response.id}
                                          className={`p-3 rounded-lg ${
                                            response.sender === "admin"
                                              ? "bg-blue-500/10 border-l-4 border-blue-500"
                                              : "bg-green-500/10 border-l-4 border-green-500 ml-8"
                                          }`}
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">{response.senderName}</span>
                                            <span className="text-xs text-muted-foreground">{response.timestamp}</span>
                                          </div>
                                          <p className="text-sm">{response.message}</p>
                                        </div>
                                      ))
                                    )}
                                  </div>

                                  {complaint.status !== "closed" && (
                                    <div className="space-y-3">
                                      <Textarea
                                        placeholder="Type your response..."
                                        value={newResponse}
                                        onChange={(e) => setNewResponse(e.target.value)}
                                        rows={3}
                                        className="material-input"
                                      />
                                      <div className="flex justify-end space-x-2">
                                        <Button
                                          variant="outline"
                                          onClick={() => handleStatusChange(complaint.id, "resolved")}
                                          className="material-button"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Mark Resolved
                                        </Button>
                                        <Button
                                          onClick={handleSendResponse}
                                          disabled={!newResponse.trim() || isResponding}
                                          className="material-button"
                                        >
                                          {isResponding ? (
                                            <>
                                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                              Sending...
                                            </>
                                          ) : (
                                            <>
                                              <Send className="w-4 h-4 mr-2" />
                                              Send Response
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
