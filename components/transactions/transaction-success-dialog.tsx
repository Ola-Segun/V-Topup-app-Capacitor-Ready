"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Share2, Copy, Star, Home } from 'lucide-react'
import { toast } from "sonner"
import Link from "next/link"

interface TransactionSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: {
    type: string
    network?: string
    amount: number
    phone?: string
    reference: string
    timestamp: string
    recipient?: string
    plan?: string
    provider?: string
  } | null
}

export function TransactionSuccessDialog({ open, onOpenChange, transaction }: TransactionSuccessDialogProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Early return if transaction is null
  if (!transaction) {
    return null
  }

  const handleShare = async () => {
    setIsSharing(true)
    
    const shareData = {
      title: 'Transaction Receipt',
      text: `Transaction successful! Reference: ${transaction.reference}`,
      url: window.location.href
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("Receipt shared successfully")
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(
          `Transaction Receipt\n\nType: ${transaction.type}\nAmount: ₦${transaction.amount.toLocaleString()}\nReference: ${transaction.reference}\nTime: ${transaction.timestamp}`
        )
        toast.success("Receipt details copied to clipboard")
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error("Failed to share receipt")
    } finally {
      setIsSharing(false)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Generate receipt content
      const receiptData = `
VTOPUP TRANSACTION RECEIPT
========================

Transaction Type: ${transaction.type.toUpperCase()}
${transaction.network ? `Network: ${transaction.network.toUpperCase()}` : ''}
${transaction.provider ? `Provider: ${transaction.provider.toUpperCase()}` : ''}
Amount: ₦${transaction.amount.toLocaleString()}
${transaction.phone ? `Phone: ${transaction.phone}` : ''}
${transaction.plan ? `Plan: ${transaction.plan}` : ''}
Reference: ${transaction.reference}
Date & Time: ${transaction.timestamp}
Status: Successful

Thank you for using VTopup!
      `
      
      const blob = new Blob([receiptData], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vtopup-receipt-${transaction.reference}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success("Receipt downloaded successfully")
    } catch (error) {
      console.error('Download error:', error)
      toast.error("Failed to download receipt")
    } finally {
      setIsDownloading(false)
    }
  }

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(transaction.reference)
      toast.success("Reference number copied to clipboard")
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error("Failed to copy reference number")
    }
  }

  const handleRating = (rating: number) => {
    toast.success(`Thank you for rating us ${rating} stars!`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-background border-0 shadow-2xl">
        <DialogHeader className="text-center pb-0">
          <div className="mx-auto mb-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
            Successful!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Details Card */}
          <Card className="border-green-200 py-0 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="p-4 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">₦{transaction.amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground capitalize">{transaction.type} Purchase</p>
              </div>

              <Separator />

              <div className="space-y-3">
                {transaction.network && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Network</span>
                    <Badge variant="outline" className="bg-background">
                      {transaction.network.toUpperCase()}
                    </Badge>
                  </div>
                )}

                {transaction.provider && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Provider</span>
                    <Badge variant="outline" className="bg-background">
                      {transaction.provider.toUpperCase()}
                    </Badge>
                  </div>
                )}

                {transaction.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Phone Number</span>
                    <span className="text-sm font-medium">{transaction.phone}</span>
                  </div>
                )}

                {transaction.plan && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Plan</span>
                    <span className="text-sm font-medium">{transaction.plan}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reference</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono">{transaction.reference}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyReference}
                      className="h-6 w-6 p-0 hover:bg-muted"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Date & Time</span>
                  <span className="text-sm font-medium">{transaction.timestamp}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Successful
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleShare}
              disabled={isSharing}
              className="bg-background"
            >
              {isSharing ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              Share
            </Button>

            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-background"
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Receipt
            </Button>
          </div>

          {/* Rating Section */}
          <Card className="border-dashed py-0">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-3">How was your experience?</p>
              <div className="flex justify-center space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRating(star)}
                    className="h-8 w-8 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                  >
                    <Star className="w-5 h-5 text-yellow-400 hover:fill-yellow-400 transition-colors" />
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Tap to rate your experience</p>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full bg-background">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
