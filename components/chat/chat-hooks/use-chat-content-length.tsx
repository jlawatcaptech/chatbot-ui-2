// src/hooks/useContentLength.ts
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
    const fetchContentLength = async () => {
      const { data, error } = await supabase
        .from("messages_content_length")
        .select("content_length")
        .eq("user_id", user_id)
        .eq("chat_id", chat_id)
        .single()

      if (error) {
        setError(error.message)
        setContentLength(null)
      } else {
        setContentLength(data?.content_length || 0)
        setError(null)
      }
    }

    fetchContentLength()
  }, [chat_id, user_id])

  return { content_length: contentLength, error }
}

export default useContentLength
