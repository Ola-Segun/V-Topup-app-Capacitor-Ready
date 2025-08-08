"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Loader2 } from 'lucide-react'
import { ReactNode } from "react"

interface TransactionSummaryItem {
  label: string
  value: string | ReactNode
}

interface TransactionSummary {
  title: string
  items: TransactionSummaryItem[]
  total: string
  buttonText: string
  buttonIcon?: ReactNode
}

interface SlideUpTransactionSummaryProps {
  isVisible: boolean
  onClose: () => void
  onConfirm: () => void
  isProcessing: boolean
  summary: TransactionSummary
}

export function SlideUpTransactionSummary({
  isVisible,
  onClose,
  onConfirm,
  isProcessing,
  summary
}: SlideUpTransactionSummaryProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Slide-up Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 400,
              mass: 0.6
            }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <Card className="rounded-t-3xl border-0 shadow-2xl bg-background/95 backdrop-blur-xl">
              {/* Handle Bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              <CardContent className="px-6 pb-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">{summary.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Summary Items */}
                <div className="space-y-3">
                  {summary.items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.02 }}
                      className="flex justify-between items-center py-2"
                    >
                      <span className="text-muted-foreground text-sm">{item.label}:</span>
                      <div className="font-medium text-sm">
                        {typeof item.value === 'string' ? item.value : item.value}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Divider */}
                  <div className="border-t border-border/50 my-4" />
                  
                  {/* Total */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="flex justify-between items-center py-2 bg-muted/30 rounded-lg px-3"
                  >
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg text-primary">{summary.total}</span>
                  </motion.div>
                </div>

                {/* Confirm Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    onClick={onConfirm}
                    disabled={isProcessing}
                    className="w-full h-14 text-base font-semibold rounded-xl"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {summary.buttonIcon}
                        {summary.buttonText}
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
