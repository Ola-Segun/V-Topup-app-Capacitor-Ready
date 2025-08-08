"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export function FloatingSupportButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed right-4 bottom-20 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            onClick={() => router.push("/dashboard/support")}
            size="lg"
            className="rounded-full w-12 h-12 premium-gradient shadow-lg hover:shadow-xl transition-shadow"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
