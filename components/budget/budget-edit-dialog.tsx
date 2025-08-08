"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Edit, Trash2, RotateCcw, Pause, Play } from 'lucide-react'
import { toast } from "sonner"
import type { Budget } from "@/lib/services/budget-service"

interface BudgetEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  budget: Budget
  onUpdateBudget: (id: string, updates: Partial<Budget>) => void
  onDeleteBudget: (id: string) => void
}

const periods = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

export function BudgetEditDialog({ open, onOpenChange, budget, onUpdateBudget, onDeleteBudget }: BudgetEditDialogProps) {
  const [formData, setFormData] = useState({
    name: budget.name,
    amount: budget.amount.toString(),
    period: budget.period,
    alert_threshold: budget.alert_threshold,
    is_active: budget.is_active
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormData({
      name: budget.name,
      amount: budget.amount.toString(),
      period: budget.period,
      alert_threshold: budget.alert_threshold,
      is_active: budget.is_active
    })
  }, [budget])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Budget name is required'
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    }

    if (Number(formData.amount) < 1000) {
      newErrors.amount = 'Minimum budget amount is ₦1,000'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const updates: Partial<Budget> = {
      name: formData.name.trim(),
      amount: Number(formData.amount),
      period: formData.period as any,
      alert_threshold: formData.alert_threshold,
      is_active: formData.is_active
    }

    // If period changed, update end date
    if (formData.period !== budget.period) {
      const startDate = new Date(budget.start_date)
      const endDate = new Date(startDate)
      
      switch (formData.period) {
        case 'weekly':
          endDate.setDate(startDate.getDate() + 7)
          break
        case 'monthly':
          endDate.setMonth(startDate.getMonth() + 1)
          break
        case 'yearly':
          endDate.setFullYear(startDate.getFullYear() + 1)
          break
      }
      
      updates.end_date = endDate.toISOString()
    }

    onUpdateBudget(budget.id, updates)
  }

  const handleReset = () => {
    onUpdateBudget(budget.id, { spent: 0 })
    toast.success('Budget spending reset to ₦0')
  }

  const handleDelete = () => {
    onDeleteBudget(budget.id)
    onOpenChange(false)
  }

  const progress = Math.min((budget.spent / budget.amount) * 100, 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Budget
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Progress */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Current Progress</span>
              <span className="text-sm text-muted-foreground">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₦{budget.spent.toLocaleString()} spent</span>
              <span>₦{budget.amount.toLocaleString()} budget</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Budget Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
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
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Budget Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.is_active ? 'Budget is active' : 'Budget is paused'}
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Budget
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className=" rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{budget.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
