import { Leaf } from "lucide-react"

import { LoginForm } from "@/components/ui/login_form"

export default function LoginPage() {
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#fafdf7] p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2.5 self-center font-medium">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2d5016] text-white">
            <Leaf className="size-4" />
          </div>
          <span className="text-lg font-extrabold text-[#2d5016]">GetGardening</span>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
