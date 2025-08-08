"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, Button, Link } from "@material-tailwind/react"
import { Wallet, Eye, EyeOff, Plus } from "lucide-react"

const WalletBalance: React.FC = () => {
  const [balance, setBalance] = useState(1000000) // Example balance
  const [showBalance, setShowBalance] = useState(true)

  return (
    <Card className="material-card shadow-xl border-0 bg-card/50 backdrop-blur-sm mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <p className="text-2xl font-bold text-foreground">
                {showBalance ? `₦${balance.toLocaleString()}` : "Hidden"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>

        <Link href="/dashboard/wallet">
          <Button className="w-full material-button bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Fund Wallet
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default WalletBalance
