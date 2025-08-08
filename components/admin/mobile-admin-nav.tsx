"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Menu,
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  Shield,
  Bell,
  FileText,
  Database,
  LogOut,
  X,
  ChevronRight,
  Activity,
  User,
  TrendingUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const adminNavItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        badge: null,
        description: "Main overview",
      },
      {
        title: "Enhanced Dashboard",
        href: "/admin/enhanced",
        icon: TrendingUp,
        badge: null,
        description: "Advanced metrics",
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: Activity,
        badge: null,
        description: "Performance insights",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
        badge: "156",
        description: "User management",
      },
      {
        title: "Transactions",
        href: "/admin/transactions",
        icon: CreditCard,
        badge: "23",
        description: "Payment monitoring",
      },
      {
        title: "Complaints",
        href: "/admin/complaints",
        icon: MessageSquare,
        badge: "5",
        description: "Customer support",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Reports",
        href: "/admin/reports",
        icon: FileText,
        badge: null,
        description: "Generate reports",
      },
      {
        title: "System Logs",
        href: "/admin/logs",
        icon: Database,
        badge: null,
        description: "System monitoring",
      },
      {
        title: "Security",
        href: "/admin/security",
        icon: Shield,
        badge: "2",
        description: "Security settings",
      },
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        badge: "12",
        description: "Alert management",
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Profile",
        href: "/admin/profile",
        icon: User,
        badge: null,
        description: "Admin profile",
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
        badge: null,
        description: "System configuration",
      },
    ],
  },
]

export function MobileAdminNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-xl border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Management Dashboard</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Sheet open={isOpen} onValueChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="w-6 h-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">Admin Panel</h2>
                      <p className="text-sm text-muted-foreground">Management Dashboard</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-muted/50">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-6">
                    {adminNavItems.map((group, groupIndex) => (
                      <div key={group.title}>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
                          {group.title}
                        </h3>
                        <div className="space-y-2">
                          <AnimatePresence>
                            {group.items.map((item, index) => {
                              const isActive = pathname === item.href
                              const Icon = item.icon

                              return (
                                <motion.div
                                  key={item.href}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ delay: (groupIndex * group.items.length + index) * 0.05 }}
                                >
                                  <Link
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`group flex items-center justify-between w-full p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                                      isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "hover:bg-muted/50 text-foreground hover:shadow-md"
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div
                                        className={`p-2 rounded-lg transition-colors ${
                                          isActive ? "bg-primary-foreground/20" : "bg-muted/50 group-hover:bg-muted"
                                        }`}
                                      >
                                        <Icon
                                          className={`w-5 h-5 ${
                                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                                          }`}
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <p
                                          className={`font-medium text-sm ${
                                            isActive ? "text-primary-foreground" : "text-foreground"
                                          }`}
                                        >
                                          {item.title}
                                        </p>
                                        <p
                                          className={`text-xs ${
                                            isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                                          }`}
                                        >
                                          {item.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {item.badge && (
                                        <Badge
                                          variant={isActive ? "secondary" : "default"}
                                          className={`text-xs ${
                                            isActive
                                              ? "bg-primary-foreground/20 text-primary-foreground"
                                              : "bg-primary/10 text-primary"
                                          }`}
                                        >
                                          {item.badge}
                                        </Badge>
                                      )}
                                      <ChevronRight
                                        className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                                          isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                                        }`}
                                      />
                                    </div>
                                  </Link>
                                </motion.div>
                              )
                            })}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border/50 bg-muted/20">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-card/50 rounded-xl border border-border/30">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary text-sm">AD</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Admin User</p>
                        <p className="text-xs text-muted-foreground">admin@vtopup.com</p>
                      </div>
                    </div>

                    <Link href="/auth/login">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-around">
            {[
              { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
              { href: "/admin/users", icon: Users, label: "Users" },
              { href: "/admin/transactions", icon: CreditCard, label: "Transactions" },
              { href: "/admin/analytics", icon: Activity, label: "Analytics" },
              { href: "/admin/settings", icon: Settings, label: "Settings" },
            ].map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                    {isActive && <div className="w-1 h-1 bg-primary rounded-full"></div>}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom padding to prevent content from being hidden behind bottom nav */}
      <div className="h-20"></div>
    </>
  )
}
