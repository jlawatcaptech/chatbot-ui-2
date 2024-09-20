"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function HomePage() {
  const { theme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.push("/login")
  }, [router])

  return <div className="flex size-full flex-col items-center justify-center" />
}
