"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Clock, Smartphone, Wifi, Tv, Zap, Wallet, RotateCcw, ChevronDown } from 'lucide-react'
import { getRecentActionsByType, type RecentAction } from "@/lib/recent-actions"

interface RecentActionsSectionProps {
  type: "airtime" | "data" | "cable" | "electricity" | "wallet_funding"
  onActionSelect: (action: RecentAction) => void
  className?: string
}

const typeConfig = {
  airtime: {
    icon: Smartphone,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    title: "Recent Airtime"
  },
  data: {
    icon: Wifi,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    title: "Recent Data"
  },
  cable: {
    icon: Tv,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    title: "Recent Cable"
  },
  electricity: {
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    title: "Recent Electricity"
  },
  wallet_funding: {
    icon: Wallet,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    title: "Recent Funding"
  }
}

export function RecentActionsSection({ type, onActionSelect, className }: RecentActionsSectionProps) {
  const [recentActions, setRecentActions] = useState<RecentAction[]>([])
  const config = typeConfig[type]
  const Icon = config.icon

  const loadRecentActions = () => {
    const actions = getRecentActionsByType(type)
    setRecentActions(actions.slice(0, 5)) // Show up to 5 recent actions
  }

  useEffect(() => {
    loadRecentActions()
    
    // Listen for storage changes to update immediately after transactions
    const handleStorageChange = () => {
      loadRecentActions()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-tab updates
    window.addEventListener('recentActionsUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('recentActionsUpdated', handleStorageChange)
    }
  }, [type])

  if (recentActions.length === 0) {
    return null
  }

  const formatActionDisplay = (action: RecentAction) => {
    switch (action.type) {
      case "airtime":
      case "data":
        return {
          primary: action.network || "Unknown Network",
          secondary: action.phoneNumber || "Unknown Number",
          amount: action.amount ? `₦${action.amount.toLocaleString()}` : "",
          detail: action.package || ""
        }
      case "cable":
      case "electricity":
        return {
          primary: action.provider || "Unknown Provider",
          secondary: action.package || "Standard Package",
          amount: action.amount ? `₦${action.amount.toLocaleString()}` : "",
          detail: ""
        }
      case "wallet_funding":
        return {
          primary: "Wallet Funding",
          secondary: action.paymentMethod || "Payment Gateway",
          amount: action.amount ? `₦${action.amount.toLocaleString()}` : "",
          detail: ""
        }
      default:
        return {
          primary: "Recent Transaction",
          secondary: "",
          amount: "",
          detail: ""
        }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={className}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full h-12 justify-between bg-background/50 border-border/50 hover:bg-background/80"
          >
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${config.color}`} />
              <span className="font-medium text-sm">{config.title}</span>
              <Badge variant="secondary" className="text-xs">
                {recentActions.length}
              </Badge>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-80 max-h-96 overflow-y-auto" 
          align="start"
          side="bottom"
        >
          <DropdownMenuLabel className="flex items-center gap-2">
            <RotateCcw className={`w-4 h-4 ${config.color}`} />
            {config.title}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {recentActions.map((action, index) => {
            const display = formatActionDisplay(action)
            const timeAgo = new Date(action.timestamp).toLocaleDateString()
            
            return (
              <DropdownMenuItem
                key={action.id}
                onClick={() => onActionSelect(action)}
                className="p-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <RotateCcw className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm truncate">{display.primary}</p>
                      {display.amount && (
                        <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                          {display.amount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground truncate">
                        {display.secondary}
                        {display.detail && ` • ${display.detail}`}
                      </p>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            )
          })}
          
          {recentActions.length === 0 && (
            <DropdownMenuItem disabled className="p-3 text-center">
              <div className="flex items-center justify-center w-full text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" />
                No recent transactions
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  )
}
