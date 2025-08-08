"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Smartphone,
  Wifi,
  Wallet,
  History,
  Settings,
  Menu,
  Tv,
  Zap,
  BarChart3,
  Gift,
  User,
  LogOut,
  MessageCircle,
  Plus,
  X,
  CreditCard,
  Phone,
  Router,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { FloatingSupportButton } from "../ui/floating-support-button"

const mainNavItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/airtime", icon: Smartphone, label: "Airtime" },
  { href: "/dashboard/data", icon: Wifi, label: "Data" },
  { href: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
  { href: "/dashboard/history", icon: History, label: "History" },
]

const quickActionItems = [
  { href: "/dashboard/airtime", icon: Phone, label: "Airtime", color: "bg-blue-500", description: "Top up your mobile" },
  { href: "/dashboard/data", icon: Wifi, label: "Data", color: "bg-green-500", description: "Internet bundles" },
  { href: "/dashboard/cable", icon: Tv, label: "TV", color: "bg-purple-500", description: "Pay TV bills" },
  { href: "/dashboard/electricity", icon: Zap, label: "Electricity", color: "bg-yellow-500", description: "Power bills" },
  { href: "/dashboard/wallet", icon: CreditCard, label: "Wallet", color: "bg-indigo-500", description: "Add money" },
  { href: "/dashboard/rewards", icon: Gift, label: "Rewards", color: "bg-pink-500", description: "Earn points" },
  { href: "/dashboard/stats", icon: BarChart3, label: "Statistics", color: "bg-teal-500", description: "View analytics" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings", color: "bg-gray-500", description: "Account settings" },
]

export function PremiumMobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isActive = (href: string) => pathname === href

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const toggleQuickMenu = () => {
    setIsQuickMenuOpen(!isQuickMenuOpen)
  }

  const closeQuickMenu = () => {
    setIsQuickMenuOpen(false)
  }

  return (
    <>
      {/* Mobile App Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="mobile-container flex items-center justify-between py-3 px-2">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full bg-primary/90 text-white shadow-md">
              <Smartphone className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="font-bold text-lg leading-tight">TopUp Pro</h1>
              <p className="text-xs text-muted-foreground">Digital Wallet</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter />
          </div>
        </div>
      </div>

      {/* Main Content Spacer for header */}
      {/* <div className="h-16" /> */}

      {/* Floating Support Button (mobile only) */}
      <FloatingSupportButton />

      {/* Quick Actions Overlay */}
      <AnimatePresence>
        {isQuickMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeQuickMenu}
            />
            
            {/* Quick Actions Menu */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/50 rounded-t-3xl shadow-2xl max-h-[70vh] overflow-y-auto pb-12"
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
                    onClick={closeQuickMenu}
                    className="rounded-full h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Choose a service to get started</p>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-5 gap-3 justify-items-center px-4 pb-6">
                {quickActionItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeQuickMenu}
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
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar (mobile-app style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 border-t border-border/50 shadow-t-lg">
        <div className="mobile-container flex items-center justify-between px-2 py-1">
          <div className="flex items-center justify-around w-full">
            {mainNavItems.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {/* <span className="text-xs font-medium">{item.label}</span> */}
                  {isActive(item.href) && <div className="w-1 h-1 bg-primary rounded-full"></div>}
                </Button>
              </Link>
            ))}
          </div>

          {/* FAB for quick actions (centered, floating above nav) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-7 z-10">
            <Button 
              onClick={toggleQuickMenu}
              className={`rounded-full shadow-xl w-14 h-14 flex items-center justify-center border-4 border-background transition-all duration-300 ${
                isQuickMenuOpen 
                  ? "bg-gray-500 rotate-45" 
                  : "bg-gradient-to-br from-primary to-purple-600 hover:shadow-2xl hover:scale-105"
              }`}
            >
              <Plus className="w-7 h-7 text-white" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="h-20" />
    </>
  )
}
