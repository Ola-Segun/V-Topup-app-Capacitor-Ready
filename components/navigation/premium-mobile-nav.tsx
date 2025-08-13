"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Home,
  Smartphone,
  Wifi,
  Wallet,
  History,
  Plus,
  User,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { FloatingSupportButton } from "../ui/floating-support-button"
import { QuickActionsMenu } from "@/components/ui/quick-actions-menu"

const mainNavItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/airtime", icon: Smartphone, label: "Airtime" },
  { href: "/dashboard/data", icon: Wifi, label: "Data" },
  { href: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
  { href: "/dashboard/history", icon: History, label: "History" },
]

export function PremiumMobileNav() {
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (href: string) => pathname === href

  const toggleQuickMenu = () => {
    setIsQuickMenuOpen(!isQuickMenuOpen)
  }

  const closeQuickMenu = () => {
    setIsQuickMenuOpen(false)
  }

  const [showBalance, setShowBalance] = useState(true)

  return (
    <>
      {/* Mobile App Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="mobile-container flex justify-between items-center">
          <div className=" flex items-center py-3 px-2 pt-5 gap-2">
          <Link href='/dashboard/settings' className=" text-white bg-accent-foreground rounded-full">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="grid gap-0.5">
            </div>
          </Link>
              <h1 className="font-bold text-base leading-tight">
                {/* {user ? user.user_metadata?.first_name || user.email : "Guest"} */}
                Hi
                {user?.user_metadata?.first_name}
              </h1>
          </div>
          <div className="">
            <NotificationCenter  />
            {/* <Bell></Bell> */}
          </div>
        </div>
      </div>

      {/* Floating Support Button (mobile only) */}
      <FloatingSupportButton />

      {/* Quick Actions Menu Component */}
      <QuickActionsMenu isOpen={isQuickMenuOpen} onClose={closeQuickMenu} />

      {/* Bottom Navigation Bar (mobile-app style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-background/95 border-t border-border/50 shadow-t-lg">
        <div className="mobile-container flex items-center justify-between px-2 py-1">
          <div className="flex items-center justify-around w-full">
            {mainNavItems.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex flex-col items-center space-y-1 h-auto py-1 px-3 ${isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {isActive(item.href) && <div className="w-1 h-1 bg-primary rounded-full"></div>}
                </Button>
              </Link>
            ))}
          </div>

          {/* FAB for quick actions (centered, floating above nav) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-7 z-10">
            <Button
              onClick={toggleQuickMenu}
              className={`rounded-full shadow-xl w-14 h-14 flex items-center justify-center border-4 border-background transition-all duration-300 ${isQuickMenuOpen
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