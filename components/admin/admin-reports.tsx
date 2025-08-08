"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Download,
  CalendarIcon,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"

const reportTypes = [
  {
    id: "transactions",
    title: "Transaction Report",
    description: "Detailed transaction history and analytics",
    icon: CreditCard,
    color: "bg-blue-500",
  },
  {
    id: "users",
    title: "User Activity Report",
    description: "User registration and activity metrics",
    icon: Users,
    color: "bg-green-500",
  },
  {
    id: "revenue",
    title: "Revenue Report",
    description: "Financial performance and revenue analysis",
    icon: TrendingUp,
    color: "bg-purple-500",
  },
  {
    id: "system",
    title: "System Performance",
    description: "System health and performance metrics",
    icon: Activity,
    color: "bg-orange-500",
  },
]

const recentReports = [
  {
    id: 1,
    name: "Monthly Transaction Report - December 2024",
    type: "Transactions",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "User Activity Report - Q4 2024",
    type: "Users",
    status: "processing",
    createdAt: "2024-01-14T15:45:00Z",
    size: "1.8 MB",
  },
  {
    id: 3,
    name: "Revenue Analysis - December 2024",
    type: "Revenue",
    status: "completed",
    createdAt: "2024-01-13T09:15:00Z",
    size: "3.2 MB",
  },
  {
    id: 4,
    name: "System Performance - Weekly",
    type: "System",
    status: "failed",
    createdAt: "2024-01-12T14:20:00Z",
    size: "0.9 MB",
  },
]

export function AdminReports() {
  const [selectedReportType, setSelectedReportType] = useState("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and manage system reports</p>
        </div>
        <Button onClick={handleGenerateReport} disabled={!selectedReportType || isGenerating}>
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Report Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Report Type</CardTitle>
              <CardDescription>Choose the type of report you want to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTypes.map((report) => {
                  const Icon = report.icon
                  const isSelected = selectedReportType === report.id

                  return (
                    <motion.div key={report.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card
                        className={`cursor-pointer transition-all duration-200 ${
                          isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedReportType(report.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${report.color} text-white`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{report.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Report Configuration */}
          {selectedReportType && (
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>Configure your report parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-from">From Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-to">To Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Export Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Report To (Optional)</Label>
                  <Input id="email" type="email" placeholder="admin@vtopup.com" />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>View and download previously generated reports</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {report.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(report.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{report.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(report.status)}
                        <Badge className={`text-xs ${getStatusColor(report.status)}`}>{report.status}</Badge>
                      </div>

                      {report.status === "completed" && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}

                      {report.status === "processing" && (
                        <div className="flex items-center space-x-2">
                          <Progress value={65} className="w-20" />
                          <span className="text-xs text-muted-foreground">65%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
