"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MessageCircle, Phone, Mail, Clock, FileText, Send, Search } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface Complaint {
  id: string
  subject: string
  category: string
  priority: "low" | "medium" | "high"
  status: "open" | "in-progress" | "resolved" | "closed"
  description: string
  createdAt: string
  updatedAt: string
  responses: {
    id: string
    message: string
    sender: "user" | "admin"
    timestamp: string
  }[]
}

const mockComplaints: Complaint[] = [
  {
    id: "CMP001",
    subject: "Failed Transaction Not Refunded",
    category: "billing",
    priority: "high",
    status: "in-progress",
    description: "My airtime purchase failed but money was deducted from my wallet. Transaction ID: TXN12345",
    createdAt: "2024-01-15 10:30",
    updatedAt: "2024-01-15 14:20",
    responses: [
      {
        id: "1",
        message: "Thank you for contacting us. We're investigating your transaction issue.",
        sender: "admin",
        timestamp: "2024-01-15 11:00",
      },
      {
        id: "2",
        message: "I've been waiting for 4 hours. When will this be resolved?",
        sender: "user",
        timestamp: "2024-01-15 14:20",
      },
    ],
  },
  {
    id: "CMP002",
    subject: "Unable to Purchase Data Bundle",
    category: "technical",
    priority: "medium",
    status: "resolved",
    description: "The app keeps showing error when I try to buy data for my Airtel line",
    createdAt: "2024-01-14 16:45",
    updatedAt: "2024-01-15 09:15",
    responses: [
      {
        id: "1",
        message: "We've identified and fixed the issue. Please try again.",
        sender: "admin",
        timestamp: "2024-01-15 09:15",
      },
    ],
  },
]

const faqItems = [
  {
    question: "How long does it take for airtime to be delivered?",
    answer: "Airtime is usually delivered instantly. In rare cases, it may take up to 5 minutes.",
  },
  {
    question: "What should I do if my transaction fails?",
    answer:
      "If your transaction fails, the amount will be automatically refunded to your wallet within 24 hours. If not, please contact support.",
  },
  {
    question: "How can I fund my wallet?",
    answer:
      "You can fund your wallet using bank transfer, debit card, or USSD. Go to Wallet > Fund Wallet to see all options.",
  },
  {
    question: "Are there any transaction limits?",
    answer: "Yes, there are daily limits: ₦50,000 for airtime, ₦100,000 for data, and ₦200,000 for wallet funding.",
  },
]

export function CustomerSupport() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [newComplaint, setNewComplaint] = useState({
    subject: "",
    category: "",
    priority: "medium" as const,
    description: "",
  })

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const complaint: Complaint = {
      id: `CMP${String(complaints.length + 1).padStart(3, "0")}`,
      ...newComplaint,
      status: "open",
      createdAt: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      responses: [],
    }

    setComplaints([complaint, ...complaints])
    setNewComplaint({ subject: "", category: "", priority: "medium", description: "" })
    setIsSubmitting(false)
    toast.success("Complaint submitted successfully!")
  }

  const handleSendMessage = async (complaintId: string) => {
    if (!newMessage.trim()) return

    const updatedComplaints = complaints.map((complaint) => {
      if (complaint.id === complaintId) {
        return {
          ...complaint,
          responses: [
            ...complaint.responses,
            {
              id: String(complaint.responses.length + 1),
              message: newMessage,
              sender: "user" as const,
              timestamp: new Date().toLocaleString(),
            },
          ],
          updatedAt: new Date().toLocaleString(),
        }
      }
      return complaint
    })

    setComplaints(updatedComplaints)
    setSelectedComplaint(updatedComplaints.find((c) => c.id === complaintId) || null)
    setNewMessage("")
    toast.success("Message sent!")
  }

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

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
        <p className="text-muted-foreground">We're here to help you with any issues or questions</p>
      </div>

      <Tabs defaultValue="support" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="support" className="space-y-6">
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Submit a Complaint</span>
              </CardTitle>
              <CardDescription>Tell us about your issue and we'll help resolve it</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={newComplaint.subject}
                      onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                      required
                      className="material-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newComplaint.category}
                      onValueChange={(value) => setNewComplaint({ ...newComplaint, category: value })}
                      required
                    >
                      <SelectTrigger className="material-input">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="technical">Technical Issues</SelectItem>
                        <SelectItem value="account">Account Management</SelectItem>
                        <SelectItem value="service">Service Quality</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newComplaint.priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setNewComplaint({ ...newComplaint, priority: value })
                    }
                  >
                    <SelectTrigger className="material-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your issue..."
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                    required
                    rows={4}
                    className="material-input"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full material-button">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Complaint
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 material-input"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredComplaints.length === 0 ? (
              <Card className="material-card">
                <CardContent className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No complaints found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? "Try adjusting your search terms" : "You haven't submitted any complaints yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredComplaints.map((complaint) => (
                <motion.div key={complaint.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} layout>
                  <Card className="material-card cursor-pointer hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{complaint.subject}</h3>
                            <Badge className={`text-xs ${getStatusColor(complaint.status)}`}>
                              {complaint.status.replace("-", " ")}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(complaint.priority)}`}>
                              {complaint.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">ID: {complaint.id}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Created: {complaint.createdAt}</span>
                        <span>Updated: {complaint.updatedAt}</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{complaint.responses.length} response(s)</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedComplaint(complaint)}
                              className="material-button"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <span>{complaint.subject}</span>
                                <Badge className={`text-xs ${getStatusColor(complaint.status)}`}>
                                  {complaint.status.replace("-", " ")}
                                </Badge>
                              </DialogTitle>
                              <DialogDescription>Complaint ID: {complaint.id}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm">{complaint.description}</p>
                                <p className="text-xs text-muted-foreground mt-2">Created: {complaint.createdAt}</p>
                              </div>

                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {complaint.responses.map((response) => (
                                  <div
                                    key={response.id}
                                    className={`p-3 rounded-lg ${
                                      response.sender === "admin"
                                        ? "bg-blue-500/10 border-l-4 border-blue-500"
                                        : "bg-green-500/10 border-l-4 border-green-500 ml-8"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium">
                                        {response.sender === "admin" ? "Support Team" : "You"}
                                      </span>
                                      <span className="text-xs text-muted-foreground">{response.timestamp}</span>
                                    </div>
                                    <p className="text-sm">{response.message}</p>
                                  </div>
                                ))}
                              </div>

                              {complaint.status !== "closed" && (
                                <div className="flex space-x-2">
                                  <Input
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 material-input"
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSendMessage(complaint.id)
                                      }
                                    }}
                                  />
                                  <Button
                                    onClick={() => handleSendMessage(complaint.id)}
                                    disabled={!newMessage.trim()}
                                    className="material-button"
                                  >
                                    <Send className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card className="material-card">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-border pb-4 last:border-b-0">
                  <h3 className="font-semibold mb-2">{item.question}</h3>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="material-card">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Available 24/7</p>
                <Button variant="outline" className="w-full material-button bg-transparent">
                  Call +234 800 123 4567
                </Button>
              </CardContent>
            </Card>

            <Card className="material-card">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Response within 2 hours</p>
                <Button variant="outline" className="w-full material-button bg-transparent">
                  support@topuppro.com
                </Button>
              </CardContent>
            </Card>

            <Card className="material-card">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">Instant assistance</p>
                <Button variant="outline" className="w-full material-button bg-transparent">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="material-card">
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone & Live Chat</p>
                    <p className="text-sm text-muted-foreground">24/7 Available</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">Response within 2 hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
