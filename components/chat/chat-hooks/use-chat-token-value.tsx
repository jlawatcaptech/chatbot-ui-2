import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/browser-client"

interface TokenValue {
  token_value: number | null
  error: string | null
}

const useTokenValue = (chat_id: string): TokenValue => {
  const [tokenvalue, setTokenValue] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    //console.log("TokenValue hook mounted");

    // Validate inputs
    if (!chat_id) {
      //console.error("Invalid chat_id:", { chat_id });
      setError("Invalid chat_id")
      return
    }

    // Function to fetch content length
    const fetchTokenValue = async () => {
      //console.log("Fetching content length for chat_id:", chat_id);

      try {
        const { data, error } = await supabase
          .from("messages_token_value")
          .select("token_value")
          .eq("chat_id", chat_id)
          .single()

        if (error) {
          //console.error("Error fetching content length:", error.message);
          setError(error.message)
          setTokenValue(null)
        } else {
          //console.log("Fetched content length:", data?.content_length);
          setTokenValue(data?.token_value || 0)
          setError(null)
        }
      } catch (err) {
        //console.error("Fetch failed with error:", err);
        setError("Failed to fetch token value")
      }
    }

    // Fetch initially
    fetchTokenValue()

    // Set interval to fetch periodically
    const intervalId = setInterval(fetchTokenValue, 5000)

    return () => {
      //console.log("Cleaning up interval")
      clearInterval(intervalId)
    }
  }, [chat_id]) // Only rerun if chat_id  changes

  return { token_value: tokenvalue, error }
}

export default useTokenValue
