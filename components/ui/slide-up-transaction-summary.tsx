"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Shield, Zap, Loader2, ChevronUp, ChevronDown, X } from 'lucide-react'

interface TransactionSummaryProps {
  isVisible: boolean
  onClose: () => void
  onConfirm: () => void
  isProcessing: boolean
  summary: {
    title: string
    items: Array<{
      label: string
      value: string | React.ReactNode
    }>
    total: string
    buttonText: string
    buttonIcon?: React.ReactNode
  }
}

export function SlideUpTransactionSummary({
  isVisible,
  onClose,
  onConfirm,
  isProcessing,
  summary
}: TransactionSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          
          {/* Slide-up Panel */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 500,
              mass: 0.8
            }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
          >
            {/* Handle bar */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {summary.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="rounded-full h-8 w-8"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Review your transaction details</p>
            </div>

            {/* Content */}
            <div className="px-4 pb-6 overflow-y-auto max-h-[60vh]">
              <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : "auto" }}
                className="space-y-4"
              >
                {/* Transaction Details */}
                <Card className="bg-muted/30 border-border/50">
                  <CardContent className="p-4">
                    <div className="space-y-3 text-sm">
                      {summary.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex justify-between items-center"
                        >
                          <span className="text-muted-foreground">{item.label}:</span>
                          <div className="font-medium">{item.value}</div>
                        </motion.div>
                      ))}
                      
                      <div className="border-t border-border/50 pt-3">
                        <div className="flex justify-between items-center font-semibold text-base">
                          <span>Total:</span>
                          <span className="text-primary">{summary.total}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Notice */}
                <Alert className="border-amber-200 bg-amber-50/50">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Transaction requires biometric or PIN authentication.
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 h-12"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onConfirm}
                    disabled={isProcessing}
                    className="flex-1 h-12 text-base font-medium"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {summary.buttonIcon || <Zap className="mr-2 h-5 w-5" />}
                        {summary.buttonText}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
