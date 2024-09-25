"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useMsalAuth from "@/lib/hooks/use-msalAuth"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useMsalAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // or a loading spinner
  }

  return children
}

export default ProtectedRoute
