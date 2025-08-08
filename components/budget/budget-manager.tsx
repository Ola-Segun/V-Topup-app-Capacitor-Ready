"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Target, TrendingUp, AlertTriangle, Edit, Trash2, Pause, Play } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"
import { BudgetCreationDialog } from "./budget-creation-dialog"
import { BudgetEditDialog } from "./budget-edit-dialog"
import { BudgetAlerts } from "./budget-alerts"
import { BudgetInsights } from "./budget-insights"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { budgetService, type Budget } from "@/lib/services/budget-service"
import { toast } from "sonner"

interface BudgetManagerProps {
  userId: string
}

export function BudgetManager({ userId }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null)
  const [selectedView, setSelectedView] = useState<'overview' | 'insights'>('overview')

  useEffect(() => {
    loadBudgets()
  }, [userId])

  const loadBudgets = async () => {
    try {
      setLoading(true)
      const data = await budgetService.getBudgets(userId)
      setBudgets(data)
    } catch (error) {
      toast.error('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBudget = async (budgetData: Omit<Budget, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newBudget = await budgetService.createBudget(budgetData)
      setBudgets(prev => [newBudget, ...prev])
      setShowCreateDialog(false)
      toast.success('Budget created successfully!')
    } catch (error) {
      toast.error('Failed to create budget')
    }
  }

  const handleUpdateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const updatedBudget = await budgetService.updateBudget(id, updates)
      setBudgets(prev => prev.map(b => b.id === id ? updatedBudget : b))
      setEditingBudget(null)
      toast.success('Budget updated successfully!')
    } catch (error) {
      toast.error('Failed to update budget')
    }
  }

  const handleDeleteBudget = async (id: string) => {
    try {
      await budgetService.deleteBudget(id)
      setBudgets(prev => prev.filter(b => b.id !== id))
      toast.success('Budget deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete budget')
    }
  }

  const toggleBudgetStatus = async (budget: Budget) => {
    await handleUpdateBudget(budget.id, { is_active: !budget.is_active })
  }

  const getBudgetProgress = (budget: Budget) => {
    return Math.min((budget.spent / budget.amount) * 100, 100)
  }

  const getBudgetStatus = (budget: Budget) => {
    const progress = getBudgetProgress(budget)
    if (progress >= 100) return { color: 'text-red-500', bg: 'bg-red-500', label: 'Exceeded' }
    if (progress >= budget.alert_threshold) return { color: 'text-orange-500', bg: 'bg-orange-500', label: 'Warning' }
    return { color: 'text-green-500', bg: 'bg-green-500', label: 'On Track' }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const activeBudgets = budgets.filter(b => b.is_active).length

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <PremiumMobileNav />
        <div className="mobile-container py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <PremiumMobileNav />
      
      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold mb-2">Budget Tracker</h1>
          <p className="text-muted-foreground">Manage your spending limits</p>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex bg-muted/30 rounded-xl p-1"
        >
          <Button
            variant={selectedView === 'overview' ? 'default' : 'ghost'}
            onClick={() => setSelectedView('overview')}
            className="flex-1 h-10"
          >
            <Target className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={selectedView === 'insights' ? 'default' : 'ghost'}
            onClick={() => setSelectedView('insights')}
            className="flex-1 h-10"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Insights
          </Button>
        </motion.div>

        {selectedView === 'overview' ? (
          <>
            {/* Budget Alerts */}
            <BudgetAlerts budgets={budgets} />

            {/* Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-3"
            >
              <Card className="glass-card border-0">
                <CardContent className="p-4 text-center">
                  <div className=" md:text-2xl text-md font-bold text-primary">₦{totalBudget.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Budget</div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0">
                <CardContent className="p-4 text-center">
                  <div className="md:text-2xl text-md font-bold text-orange-500">₦{totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Spent</div>
                </CardContent>
              </Card>
              <Card className="glass-card border-0">
                <CardContent className="p-4 text-center">
                  <div className="md:text-2xl text-md font-bold text-green-500">{activeBudgets}</div>
                  <div className="text-xs text-muted-foreground">Active Budgets</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Create Budget Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Budget
              </Button>
            </motion.div>

            {/* Budget List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <AlertDialog>
                <AnimatePresence>
                  {budgets.map((budget, index) => {
                    const progress = getBudgetProgress(budget)
                  const status = getBudgetStatus(budget)
                  
                  return (
                    <motion.div
                      key={budget.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`glass-card border-0 ${!budget.is_active ? 'opacity-60' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-base">{budget.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {budget.category.toUpperCase()}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${status.color}`}>
                                  {status.label}
                                </Badge>
                                {!budget.is_active && (
                                  <Badge variant="secondary" className="text-xs">
                                    Paused
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleBudgetStatus(budget)}
                                className="h-8 w-8"
                              >
                                {budget.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingBudget(budget)}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setDeletingBudget(budget)}
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>₦{budget.spent.toLocaleString()} spent</span>
                              <span>₦{budget.amount.toLocaleString()} budget</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{progress.toFixed(1)}% used</span>
                              <span>₦{(budget.amount - budget.spent).toLocaleString()} remaining</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    )
                  })}
                </AnimatePresence>
                
                {deletingBudget && (
                  <AlertDialogContent className=" rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        <span className="font-semibold"> {deletingBudget.name} </span> budget.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeletingBudget(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleDeleteBudget(deletingBudget.id)
                          setDeletingBudget(null)
                        }}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </AlertDialog>
              
              {budgets.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Target className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first budget to start tracking your spending</p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Budget
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </>
        ) : (
          <BudgetInsights budgets={budgets} />
        )}
      </div>

      {/* Dialogs */}
      <BudgetCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateBudget={handleCreateBudget}
        userId={userId}
      />

      {editingBudget && (
        <BudgetEditDialog
          open={!!editingBudget}
          onOpenChange={(open) => !open && setEditingBudget(null)}
          budget={editingBudget}
          onUpdateBudget={handleUpdateBudget}
          onDeleteBudget={handleDeleteBudget}
        />
      )}
    </div>
  )
}
