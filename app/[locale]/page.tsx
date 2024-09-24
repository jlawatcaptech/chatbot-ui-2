"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { MsalProvider } from "@azure/msal-react"
import { msalInstance } from "@/lib/msal/msalConfig"
import DirectLogin from "@/components/utility/direct-login"

export default function HomePage() {
  const { theme } = useTheme()
  const router = useRouter()

  return (
    <MsalProvider instance={msalInstance}>
      <div className="flex size-full flex-col items-center justify-center">
        <DirectLogin />
      </div>
    </MsalProvider>
  )
}
