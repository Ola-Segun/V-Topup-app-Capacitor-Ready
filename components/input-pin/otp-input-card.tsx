"use client"

import * as React from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function OtpInputCard({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const handleNumberClick = (number: string) => {
    if (value.length < 4) {
      onChange(value + number)
    }
  }
  
  const handleDeleteClick = () => {
    onChange(value.slice(0, -1))
  }
  
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
  
  // console.log("Current PIN value:", value)
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Enter PIN</CardTitle> */}
        <CardDescription className="text-xs text-muted-foreground">
          Enter your 4-digit PIN to authorize this transaction.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full justify-item-center items-center gap-4">
        <InputOTP
          maxLength={4}
          value={value}
          onChange={onChange}
          pattern="[0-9]"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
        
        <div className="grid grid-cols-3 gap-2 mt-4 w-full">
          {numbers.map((number) => (
            <Button
              key={number}
              variant="outline"
              onClick={() => handleNumberClick(number)}
              className="active:scale-95 transition-transform w-full"
            >
              {number}
            </Button>
          ))}
          <div />
          <Button
            variant="outline"
            onClick={() => handleNumberClick("0")}
            className="active:scale-95 transition-transform w-full"
          >
            0
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteClick}
            className="active:scale-95 transition-transform w-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      {/* <CardFooter>
        <Button>Submit</Button>
      </CardFooter> */}
    </Card>
  )
}
