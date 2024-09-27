import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/browser-client"

interface ContentLength {
  content_length: number | null
  error: string | null
}

const useContentLength = (chat_id: string, user_id: string): ContentLength => {
  const [contentLength, setContentLength] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    //console.log("useContentLength hook mounted");

    // Validate inputs
    if (!chat_id || !user_id) {
      //console.error("Invalid chat_id or user_id:", { chat_id, user_id });
      setError("Invalid chat_id or user_id")
      return
    }

    // Function to fetch content length
    const fetchContentLength = async () => {
      //console.log("Fetching content length for chat_id:", chat_id, "user_id:", user_id);

      try {
        const { data, error } = await supabase
          .from("messages_content_length")
          .select("content_length")
          .eq("user_id", user_id)
          .eq("chat_id", chat_id)
          .single()

        if (error) {
          //console.error("Error fetching content length:", error.message);
          setError(error.message)
          setContentLength(null)
        } else {
          //console.log("Fetched content length:", data?.content_length);
          setContentLength(data?.content_length || 0)
          setError(null)
        }
      } catch (err) {
        //console.error("Fetch failed with error:", err);
        setError("Failed to fetch content length")
      }
    }

    // Fetch initially
    fetchContentLength()

    // Set interval to fetch periodically
    const intervalId = setInterval(fetchContentLength, 5000)

    return () => {
      console.log("Cleaning up interval")
      clearInterval(intervalId)
    }
  }, [chat_id, user_id]) // Only rerun if chat_id or user_id changes

  return { content_length: contentLength, error }
}

export default useContentLength
