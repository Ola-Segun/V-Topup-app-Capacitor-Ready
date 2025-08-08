"use client"

import { useState, useEffect } from "react"
import { OtpInputCard } from "./otp-input-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface InputPinCardProps {
  onSuccess: (pin: string) => void
  onCancel: () => void
  title?: string
  description?: string
}

export function InputPinCard({
  onSuccess,
  onCancel,
  title = "Enter PIN",
  description = "Please enter your PIN to continue.",
}: InputPinCardProps) {
  const [pin, setPin] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  // useEffect(() => {
  //   if (pin.length === 4) {
  //     handleVerifyPin()
  //   }
  // }, [pin])

  const handleVerifyPin = async () => {
    setIsVerifying(true)
    setError("")
    // Simulate PIN verification
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (pin === "1234") { // Mock success PIN
      onSuccess(pin)
    } else {
      setError("Invalid PIN. Please try again.")
      setPin("")
    }
    setIsVerifying(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <OtpInputCard value={pin} onChange={setPin} />
          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isVerifying}>
            Cancel
          </Button>
          <Button onClick={handleVerifyPin} disabled={isVerifying || pin.length < 4}>
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
