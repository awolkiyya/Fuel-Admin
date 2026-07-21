"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const router = useRouter()

  const user = useSelector((state: any) => state.auth.user)

  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
  }, [user, router])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}