"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Target, Calendar, Bell, Smartphone, Wifi, Tv, Zap, Wallet } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { Budget } from "@/lib/services/budget-service"

interface BudgetCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBudget: (budget: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => void
  userId: string
}

const categories = [
  { id: 'airtime', name: 'Airtime', icon: Smartphone, color: 'bg-blue-500' },
  { id: 'data', name: 'Data', icon: Wifi, color: 'bg-green-500' },
  { id: 'cable', name: 'Cable TV', icon: Tv, color: 'bg-purple-500' },
  { id: 'electricity', name: 'Electricity', icon: Zap, color: 'bg-yellow-500' },
  { id: 'wallet_funding', name: 'Wallet Funding', icon: Wallet, color: 'bg-indigo-500' },
  { id: 'all', name: 'All Services', icon: Target, color: 'bg-gray-500' }
]

const periods = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

const quickAmounts = [5000, 10000, 20000, 50000, 100000, 200000]

export function BudgetCreationDialog({ open, onOpenChange, onCreateBudget, userId }: BudgetCreationDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    period: 'monthly',
    alert_threshold: 80
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Budget name is required'
      }
      if (!formData.category) {
        newErrors.category = 'Please select a category'
      }
    }

    if (currentStep === 2) {
      if (!formData.amount || Number(formData.amount) <= 0) {
        newErrors.amount = 'Please enter a valid amount'
      }
      if (Number(formData.amount) < 1000) {
        newErrors.amount = 'Minimum budget amount is ₦1,000'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    setStep(step - 1)
    setErrors({})
  }

  const handleCreate = () => {
    if (!validateStep(step)) return

    const now = new Date()
    const endDate = new Date()
    
    switch (formData.period) {
      case 'weekly':
        endDate.setDate(now.getDate() + 7)
        break
      case 'monthly':
        endDate.setMonth(now.getMonth() + 1)
        break
      case 'yearly':
        endDate.setFullYear(now.getFullYear() + 1)
        break
    }

    const budgetData: Omit<Budget, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      name: formData.name.trim(),
      category: formData.category as any,
      amount: Number(formData.amount),
      spent: 0,
      period: formData.period as any,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      alert_threshold: formData.alert_threshold,
      is_active: true
    }

    onCreateBudget(budgetData)
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      amount: '',
      period: 'monthly',
      alert_threshold: 80
    })
    setStep(1)
    setErrors({})
  }

  const handleClose = () => {
    onOpenChange(false)
    setStep(1)
    setErrors({})
  }

  const selectedCategory = categories.find(c => c.id === formData.category)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Create Budget
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i === step
                    ? 'bg-primary text-primary-foreground'
                    : i < step
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="font-semibold">Budget Details</h3>
                  <p className="text-sm text-muted-foreground">Give your budget a name and category</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Budget Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Monthly Airtime"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-3">
                  <Label>Category</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setFormData({ ...formData, category: category.id })}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          formData.category === category.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-border/80'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                            <category.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-sm">{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>
              </motion.div>
            )}

            {/* Step 2: Amount & Period */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="font-semibold">Budget Amount</h3>
                  <p className="text-sm text-muted-foreground">Set your spending limit</p>
                </div>

                <div className="space-y-3">
                  <Label>Quick Select</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={formData.amount === amount.toString() ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                        className="h-10"
                      >
                        ₦{amount.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Custom Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className={errors.amount ? 'border-red-500' : ''}
                  />
                  {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Budget Period</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value) => setFormData({ ...formData, period: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {periods.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {/* Step 3: Alert Settings */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="font-semibold">Alert Settings</h3>
                  <p className="text-sm text-muted-foreground">Get notified when you're close to your limit</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Alert Threshold: {formData.alert_threshold}%</Label>
                    <Slider
                      value={[formData.alert_threshold]}
                      onValueChange={(value) => setFormData({ ...formData, alert_threshold: value[0] })}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Preview Card */}
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Budget Preview</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span className="font-medium">{formData.name || 'Untitled Budget'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Category:</span>
                          {selectedCategory && (
                            <Badge variant="secondary" className="text-xs">
                              {selectedCategory.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-medium">₦{Number(formData.amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Period:</span>
                          <span className="font-medium capitalize">{formData.period}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Alert at:</span>
                          <span className="font-medium">{formData.alert_threshold}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={step === 1 ? handleClose : handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            <Button
              onClick={step === 3 ? handleCreate : handleNext}
              className="flex items-center gap-2"
            >
              {step === 3 ? (
                <>
                  <Target className="w-4 h-4" />
                  Create Budget
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
