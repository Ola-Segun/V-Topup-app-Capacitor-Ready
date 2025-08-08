import { RegisterForm } from "@/components/auth/register-form"
import { ConfigNotice } from "@/components/config-notice"

export default function RegisterPage() {
  return (
    <div className="bg-background text-foreground">
      {/* <ConfigNotice /> */}
      <RegisterForm />
    </div>
  )
}
