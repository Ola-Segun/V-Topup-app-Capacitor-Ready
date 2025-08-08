"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, Tv, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const serviceCategories = [
  {
    title: "Airtime",
    description: "All Networks",
    icon: Smartphone,
    href: "/dashboard/airtime",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    networks: ["MTN", "Airtel", "Glo", "9mobile"],
    popular: true,
  },
  {
    title: "Data Bundles",
    description: "Best Plans",
    icon: Wifi,
    href: "/dashboard/data",
    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    networks: ["MTN", "Airtel", "Glo", "9mobile"],
    popular: true,
  },
  {
    title: "Cable TV",
    description: "All Providers",
    icon: Tv,
    href: "/dashboard/cable",
    gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
    networks: ["DSTV", "GOtv", "Startimes", "ShowMax"],
    popular: false,
  },
  {
    title: "Electricity",
    description: "All DISCOs",
    icon: Zap,
    href: "/dashboard/electricity",
    gradient: "bg-gradient-to-br from-amber-500 to-amber-700",
    networks: ["PHCN", "EKEDC", "IKEDC", "AEDC"],
    popular: false,
  },
]

export function ServiceCategories() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">All Services</h2>
        <Badge variant="outline" className="text-xs">
          4 Categories
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {serviceCategories.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={service.href}>
              <Card className="material-card py-0 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden">
                <CardContent className="p-0">
                  <div className={`${service.gradient} p-4 text-white relative`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-2 right-2 w-20 h-20 border border-white/20 rounded-full"></div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-white/20 rounded-full"></div>
                    </div>

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                          <service.icon className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">{service.title}</h3>
                            {service.popular && (
                              <Badge className="bg-white/20 text-white border-0 text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-white/80 text-sm mb-2">{service.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {service.networks.slice(0, 3).map((network, idx) => (
                              <span key={idx} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                {network}
                              </span>
                            ))}
                            {service.networks.length > 3 && (
                              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                +{service.networks.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
