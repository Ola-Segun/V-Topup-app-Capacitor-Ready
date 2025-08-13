"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Tv,
  Zap,
  BarChart3,
  Gift,
  Settings,
  X,
  CreditCard,
  Phone,
  Wifi,
  Target,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { Haptics, ImpactStyle } from "@capacitor/haptics"
import { Capacitor } from "@capacitor/core"

const quickActionItems = [
  { href: "/dashboard/airtime", icon: Phone, label: "Airtime", color: "bg-blue-500", description: "Top up your mobile" },
  { href: "/dashboard/data", icon: Wifi, label: "Data", color: "bg-green-500", description: "Internet bundles" },
  { href: "/dashboard/cable", icon: Tv, label: "TV", color: "bg-purple-500", description: "Pay TV bills" },
  { href: "/dashboard/electricity", icon: Zap, label: "Electricity", color: "bg-yellow-500", description: "Power bills" },
  { href: "/dashboard/wallet", icon: CreditCard, label: "Wallet", color: "bg-indigo-500", description: "Add money" },
  { href: "/dashboard/rewards", icon: Gift, label: "Rewards", color: "bg-pink-500", description: "Earn points" },
  { href: "/dashboard/stats", icon: BarChart3, label: "Statistics", color: "bg-teal-500", description: "View analytics" },
  { href: "/dashboard/budget", icon: Target, label: "Budget", color: "bg-amber-500", description: "Manage your budget" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings", color: "bg-gray-500", description: "Account settings" },
]

interface QuickActionsMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickActionsMenu({ isOpen, onClose }: QuickActionsMenuProps) {
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    
    if (isOpen) {
      // Prevent body scroll and disable iOS bounce/stretch effect
      root.classList.add("modal-open")
      body.classList.add("modal-open")
      
      // Disable iOS bounce/stretch effect for Capacitor apps
      if (Capacitor.isNativePlatform()) {
        body.style.position = 'fixed'
        body.style.top = '0'
        body.style.left = '0'
        body.style.right = '0'
        body.style.bottom = '0'
        body.style.overflow = 'hidden'
        body.style.webkitOverflowScrolling = 'auto'
        
        // Haptic feedback
        Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {})
      }
    } else {
      root.classList.remove("modal-open")
      body.classList.remove("modal-open")
      
      // Reset styles for Capacitor
      if (Capacitor.isNativePlatform()) {
        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.right = ''
        body.style.bottom = ''
        body.style.overflow = ''
        body.style.webkitOverflowScrolling = ''
      }
    }
    
    return () => {
      root.classList.remove("modal-open")
      body.classList.remove("modal-open")
      if (Capacitor.isNativePlatform()) {
        body.style.position = ''
        body.style.top = ''
        body.style.left = ''
        body.style.right = ''
        body.style.bottom = ''
        body.style.overflow = ''
        body.style.webkitOverflowScrolling = ''
      }
    }
  }, [isOpen])

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Only close if dragging downward (positive y values)
    if (info.offset.y > 120 || (info.velocity.y > 600 && info.offset.y > 0)) {
      if (Capacitor.isNativePlatform()) {
        Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
      }
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop covering entire screen including top nav */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[45]"
            onClick={onClose}
            style={{ 
              // Prevent iOS bounce/stretch on backdrop
              touchAction: 'none',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'none'
            }}
          />

          {/* Draggable Quick Actions Menu */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300, mass: 0.5 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 300 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-[48] bg-background/95 backdrop-blur-lg border-t border-border/50 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden pb-20"
            role="dialog"
            aria-modal="true"
            style={{ 
              // Prevent iOS bounce/stretch on modal content
              touchAction: 'pan-y',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'none'
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full h-8 w-8"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Choose a service to get started</p>
            </div>

            {/* Quick Actions Grid */}
            <div 
              className="px-4 pb-6 overflow-y-auto max-h-[60vh]"
              style={{ 
                // Prevent iOS bounce/stretch on scrollable content
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'none'
              }}
            >
              <div className="grid grid-cols-5 gap-3 justify-items-center">
                {quickActionItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="grid w-fit justify-items-center gap-0.5"
                    >
                      <div className="bg-card hover:bg-accent/50 transition-colors duration-200 rounded-2xl p-2 border border-border/50 shadow-sm w-fit">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl ${item.color} shadow-sm`}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>
                      <h4 className="font-medium text-xs leading-tight mb-0.5">
                        {item.label}
                      </h4>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}       