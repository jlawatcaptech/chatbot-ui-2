"use client"

import { useEffect } from "react"
import { useMsal } from "@azure/msal-react"
import { useRouter } from "next/navigation"
import { msalInstance } from "@/lib/msal/msalConfig"

const DirectLogin = () => {
  const { instance } = useMsal()
  const router = useRouter()

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize()
        const login = async () => {
          try {
            await instance.loginRedirect({
              scopes: ["user.read"] // Add the scopes you need
            })
          } catch (error) {
            console.error("Login failed:", error)
          }
        }

        const handleRedirect = async () => {
          const response = await instance.handleRedirectPromise()
          if (response) {
            // Successful login
            router.push("/login")
          } else {
            // Initiate login if no response
            login()
          }
        }

        handleRedirect()
      } catch (error) {
        console.error("MSAL initialization failed:", error)
      }
    }

    initializeMsal()
  }, [instance, router])

  return null // No UI is needed, as this component only handles the redirection
}

export default DirectLogin
