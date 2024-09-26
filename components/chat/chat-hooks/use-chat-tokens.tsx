// useTokenCount.ts
import { get_encoding } from "tiktoken"
import { useState, useEffect } from "react"

const encoding = get_encoding("cl100k_base")

const useTokenCount = (value: string) => {
  const [tokenCount, setTokenCount] = useState(0)

  useEffect(() => {
    const tokens = encoding.encode(value)
    setTokenCount(tokens.length)
  }, [value])

  return tokenCount
}

export default useTokenCount
