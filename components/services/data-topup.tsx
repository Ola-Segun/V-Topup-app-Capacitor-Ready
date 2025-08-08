"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Wifi, Loader2, CheckCircle, Zap, Clock, RotateCcw } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { saveRecentAction, getRecentActionsByType } from "@/lib/recent-actions"

const dataSchema = z.object({
  network: z.string().min(1, "Please select a network"),
  phoneNumber: z.string().min(11, "Please enter a valid phone number"),
  package: z.string().min(1, "Please select a data package"),
})

type DataForm = z.infer<typeof dataSchema>

const networks = [
  { value: "mtn", label: "MTN" },
  { value: "airtel", label: "Airtel" },
  { value: "glo", label: "Glo" },
  { value: "9mobile", label: "9mobile" },
]

const dataPackages = {
  mtn: [
    { value: "1gb-30days", label: "1GB - 30 Days", price: 1000 },
    { value: "2gb-30days", label: "2GB - 30 Days", price: 2000 },
    { value: "5gb-30days", label: "5GB - 30 Days", price: 2500 },
    { value: "10gb-30days", label: "10GB - 30 Days", price: 5000 },
  ],
  airtel: [
    { value: "1gb-30days", label: "1GB - 30 Days", price: 1200 },
    { value: "2gb-30days", label: "2GB - 30 Days", price: 2200 },
    { value: "5gb-30days", label: "5GB - 30 Days", price: 2700 },
    { value: "10gb-30days", label: "10GB - 30 Days", price: 5200 },
  ],
  glo: [
    { value: "1gb-30days", label: "1GB - 30 Days", price: 1100 },
    { value: "2gb-30days", label: "2GB - 30 Days", price: 2100 },
    { value: "5gb-30days", label: "5GB - 30 Days", price: 2600 },
    { value: "10gb-30days", label: "10GB - 30 Days", price: 5100 },
  ],
  "9mobile": [
    { value: "1gb-30days", label: "1GB - 30 Days", price: 1300 },
    { value: "2gb-30days", label: "2GB - 30 Days", price: 2300 },
    { value: "5gb-30days", label: "5GB - 30 Days", price: 2800 },
    { value: "10gb-30days", label: "10GB - 30 Days", price: 5300 },
  ],
}

export function DataTopup() {
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [recentActions, setRecentActions] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DataForm>({
    resolver: zodResolver(dataSchema),
  })

  const watchedNetwork = watch("network")
  const watchedPackage = watch("package")
  const watchedPhone = watch("phoneNumber")

  const selectedPackage =
    watchedNetwork && watchedPackage
      ? dataPackages[watchedNetwork as keyof typeof dataPackages]?.find((pkg) => pkg.value === watchedPackage)
      : null

  useEffect(() => {
    const recent = getRecentActionsByType("data")
    setRecentActions(recent)
  }, [])

  const onSubmit = async (data: DataForm) => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save recent action
      if (selectedPackage) {
        saveRecentAction({
          type: "data",
          network: data.network,
          phoneNumber: data.phoneNumber,
          package: data.package,
          amount: selectedPackage.price,
        })
      }

      setShowSuccess(true)

      setTimeout(() => {
        toast.success("Data Purchase Successful!", {
          description: `${selectedPackage?.label} sent to ${data.phoneNumber}`,
        })

        // Reset form
        setValue("phoneNumber", "")
        setValue("package", "")
        setValue("network", "")
        setShowSuccess(false)

        // Refresh recent actions
        const recent = getRecentActionsByType("data")
        setRecentActions(recent)
      }, 2000)
    } catch (error) {
      toast.error("Purchase Failed", {
        description: "Please try again or contact support.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRecentAction = (action: any) => {
    setValue("network", action.network)
    setValue("phoneNumber", action.phoneNumber)
    setValue("package", action.package)

    toast.success("Recent action applied!", {
      description: "Form filled with your recent transaction details",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Buy Data</h1>
          <p className="text-muted-foreground">Purchase data bundles for all networks</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Purchase Successful!</h2>
              <p className="text-muted-foreground">Your data bundle has been activated</p>
            </div>
            <div className="w-full max-w-sm">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Package</p>
                  <p className="text-xl font-bold">{selectedPackage?.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">to {watchedPhone}</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Recent Actions */}
            {recentActions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentActions.slice(0, 3).map((action, index) => (
                      <motion.button
                        key={action.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleRecentAction(action)}
                        className="w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                              <RotateCcw className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">
                                {networks.find((n) => n.value === action.network)?.label} - {action.phoneNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">₦{action.amount}</p>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(action.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wifi className="w-5 h-5 mr-2" />
                  Select Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={(value) => setValue("network", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose network provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {networks.map((network) => (
                      <SelectItem key={network.value} value={network.value}>
                        {network.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.network && <p className="text-sm text-red-500 mt-2">{errors.network.message}</p>}
              </CardContent>
            </Card>

            {/* Phone Number */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    {...register("phoneNumber")}
                    className={errors.phoneNumber ? "border-red-500" : ""}
                  />
                  {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Data Package Selection */}
            {watchedNetwork && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Data Package</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={(value) => setValue("package", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose data package" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataPackages[watchedNetwork as keyof typeof dataPackages]?.map((pkg) => (
                        <SelectItem key={pkg.value} value={pkg.value}>
                          {pkg.label} - ₦{pkg.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.package && <p className="text-sm text-red-500 mt-2">{errors.package.message}</p>}
                </CardContent>
              </Card>
            )}

            {/* Transaction Summary */}
            {selectedPackage && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-primary" />
                      Transaction Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network:</span>
                        <span className="font-medium">{networks.find((n) => n.value === watchedNetwork)?.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Package:</span>
                        <span className="font-medium">{selectedPackage.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">₦{selectedPackage.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fee:</span>
                        <span className="font-medium text-green-500">₦0</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-lg">₦{selectedPackage.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Purchase Button */}
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={loading || !watchedNetwork || !watchedPackage}
              className="w-full h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Purchase...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Purchase Data
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
