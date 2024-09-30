"use client"

import { useEffect, useState } from "react"
import { useMsal } from "@azure/msal-react"
import { useRouter } from "next/navigation"

const useMsalAuth = () => {
  const { instance, accounts } = useMsal()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuthentication = async () => {
      const response = await instance.handleRedirectPromise()
      if (response || accounts.length > 0) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        await instance.loginRedirect({
          scopes: ["user.read"] // Add the scopes you need
        })
      }
    }

    checkAuthentication()
  }, [instance, accounts])

  return isAuthenticated
}

export default useMsalAuth
