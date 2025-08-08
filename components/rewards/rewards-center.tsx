"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Star, Users, Zap, Crown, Target, Share2, Copy, CheckCircle, Coins, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { PremiumMobileNav } from "@/components/navigation/premium-mobile-nav"


const userLevel = {
  current: "Gold",
  points: 8750,
  nextLevel: "Platinum",
  pointsToNext: 1250,
  totalForNext: 10000,
  benefits: ["5% Cashback", "Priority Support", "Exclusive Offers"],
}

const achievements = [
  {
    id: 1,
    title: "First Purchase",
    description: "Complete your first transaction",
    icon: Zap,
    completed: true,
    points: 100,
    date: "2 weeks ago",
  },
  {
    id: 2,
    title: "Frequent User",
    description: "Make 10 transactions in a month",
    icon: Target,
    completed: true,
    points: 250,
    date: "1 week ago",
  },
  {
    id: 3,
    title: "Big Spender",
    description: "Spend ₦50,000 in total",
    icon: Crown,
    completed: false,
    points: 500,
    progress: 75,
  },
  {
    id: 4,
    title: "Referral Master",
    description: "Refer 5 friends successfully",
    icon: Users,
    completed: false,
    points: 1000,
    progress: 60,
  },
]

const rewardsCatalog = [
  {
    id: 1,
    title: "₦500 Airtime Bonus",
    description: "Free airtime credit to any network",
    points: 1000,
    category: "airtime",
    popular: true,
    image: "📱",
  },
  {
    id: 2,
    title: "1GB Data Bundle",
    description: "Free 1GB data for any network",
    points: 800,
    category: "data",
    popular: false,
    image: "📶",
  },
  {
    id: 3,
    title: "₦1000 Wallet Credit",
    description: "Direct credit to your wallet",
    points: 2000,
    category: "wallet",
    popular: true,
    image: "💰",
  },
  {
    id: 4,
    title: "Premium Support",
    description: "30 days of priority customer support",
    points: 1500,
    category: "service",
    popular: false,
    image: "🎧",
  },
  {
    id: 5,
    title: "Cashback Multiplier",
    description: "2x cashback for 7 days",
    points: 3000,
    category: "bonus",
    popular: true,
    image: "⚡",
  },
  {
    id: 6,
    title: "Bill Payment Discount",
    description: "10% discount on next bill payment",
    points: 1200,
    category: "discount",
    popular: false,
    image: "🏠",
  },
]

const referralCode = "TOPUP2024"

export function RewardsCenter() {
  const [activeTab, setActiveTab] = useState("overview")
  const [copiedCode, setCopiedCode] = useState(false)

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopiedCode(true)
    toast.success("Referral code copied!")
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const redeemReward = (reward: any) => {
    if (userLevel.points >= reward.points) {
      toast.success(`${reward.title} redeemed!`, {
        description: "Your reward will be processed within 24 hours",
      })
    } else {
      toast.error("Insufficient points", {
        description: `You need ${reward.points - userLevel.points} more points`,
      })
    }
  }

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join TopUp Pro",
        text: `Use my referral code ${referralCode} and get bonus points!`,
        url: window.location.origin,
      })
    } else {
      copyReferralCode()
    }
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pb-20">
      <PremiumMobileNav />
      <div className="mobile-container py-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Rewards Center</h1>
          <p className="text-muted-foreground">Earn points and unlock amazing rewards</p>
        </motion.div>

        {/* User Level Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="material-card bg-gradient-to-br from-amber-500/10 to-amber-700/10 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{userLevel.current} Member</h3>
                    <p className="text-sm text-muted-foreground">Level 3 of 5</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-600">{userLevel.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress to {userLevel.nextLevel}</span>
                  <span className="font-semibold text-foreground">{userLevel.pointsToNext} points to go</span>
                </div>
                <Progress value={(userLevel.points / userLevel.totalForNext) * 100} className="h-2" />

                <div className="flex flex-wrap gap-2 mt-4">
                  {userLevel.benefits.map((benefit, index) => (
                    <Badge key={index} className="bg-amber-500/20 text-amber-600 border-0">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="overview" className="text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="rewards" className="text-xs">
                Rewards
              </TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs">
                Achievements
              </TabsTrigger>
              <TabsTrigger value="referral" className="text-xs">
                Referral
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="material-card bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 mx-auto bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shadow-md mb-2">
                      <Coins className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">₦2,450</p>
                    <p className="text-xs text-muted-foreground">Total Earned</p>
                  </CardContent>
                </Card>

                <Card className="material-card bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <div className="w-10 h-10 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-md mb-2">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">47</p>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Rewards */}
              <Card className="material-card bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Rewards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Transaction Bonus", points: "+50", time: "2 hours ago", icon: Zap },
                    { title: "Daily Login", points: "+10", time: "Today", icon: Star },
                    { title: "Referral Bonus", points: "+200", time: "Yesterday", icon: Users },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-500">{item.points}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 gap-4">
                {rewardsCatalog.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="material-card bg-card border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{reward.image}</div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-foreground">{reward.title}</h4>
                                {reward.popular && (
                                  <Badge className="bg-amber-500/20 text-amber-600 border-0">
                                    <Star className="w-3 h-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{reward.description}</p>
                              <p className="text-xs font-bold text-primary">{reward.points} points</p>
                            </div>
                          </div>
                          <Button
                            onClick={() => redeemReward(reward)}
                            disabled={userLevel.points < reward.points}
                            className="material-button bg-primary text-primary-foreground"
                            size="sm"
                          >
                            {userLevel.points >= reward.points ? "Redeem" : "Need More"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-4 mt-6">
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`material-card ${
                        achievement.completed ? "bg-green-500/10 border-green-500/20" : "bg-card border-border"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                              achievement.completed
                                ? "bg-gradient-to-br from-green-500 to-green-700"
                                : "bg-gradient-to-br from-gray-400 to-gray-600"
                            }`}
                          >
                            <achievement.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                              {achievement.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs font-bold text-primary">+{achievement.points} points</span>
                              {achievement.completed ? (
                                <span className="text-xs text-green-500">{achievement.date}</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">{achievement.progress}% complete</span>
                              )}
                            </div>
                            {!achievement.completed && achievement.progress && (
                              <Progress value={achievement.progress} className="h-1 mt-2" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Referral Tab */}
            <TabsContent value="referral" className="space-y-4 mt-6">
              {/* Referral Stats */}
              <Card className="material-card bg-gradient-to-br from-purple-500/10 to-purple-700/10 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Invite Friends & Earn</h3>
                  <p className="text-muted-foreground mb-4">Get 200 points for each successful referral</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">3</p>
                      <p className="text-xs text-muted-foreground">Friends Referred</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">600</p>
                      <p className="text-xs text-muted-foreground">Points Earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Referral Code */}
              <Card className="material-card bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Your Referral Code</CardTitle>
                  <CardDescription className="text-muted-foreground">Share this code with friends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-muted rounded-xl border-2 border-dashed border-border">
                      <p className="text-center font-mono text-lg font-bold text-foreground">{referralCode}</p>
                    </div>
                    <Button
                      onClick={copyReferralCode}
                      className="material-button bg-primary text-primary-foreground"
                      size="icon"
                    >
                      {copiedCode ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={shareReferral}
                      className="material-button bg-gradient-to-r from-primary to-purple-600 text-primary-foreground"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      onClick={copyReferralCode}
                      variant="outline"
                      className="material-button border-border bg-background text-foreground"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* How it Works */}
              <Card className="material-card bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">How Referrals Work</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { step: 1, title: "Share your code", desc: "Send your referral code to friends" },
                    { step: 2, title: "Friend signs up", desc: "They create an account using your code" },
                    { step: 3, title: "First transaction", desc: "They make their first purchase" },
                    { step: 4, title: "You both earn", desc: "You get 200 points, they get 100 points" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
