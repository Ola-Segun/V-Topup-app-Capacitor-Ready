"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  Shield,
  Bell,
  FileText,
  Database,
  Activity,
  User,
  TrendingUp,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"

const adminNavItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: Activity,
        badge: null,
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
      },
      {
        title: "Transactions",
        href: "/admin/transactions",
        icon: CreditCard,
        badge: "23",
      },
      {
        title: "Complaints",
        href: "/admin/complaints",
        icon: MessageSquare,
        badge: "5",
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
      },
      {
        title: "System Logs",
        href: "/admin/logs",
        icon: Database,
        badge: null,
      },
      {
        title: "Security",
        href: "/admin/security",
        icon: Shield,
        badge: "2",
      },
      {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        badge: "12",
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
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
        badge: null,
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center space-x-3 p-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Management Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {adminNavItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <Icon className="w-4 h-4" />
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary text-sm">AD</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@vtopup.com</p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/auth/login" className="text-red-500 hover:text-red-600">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
