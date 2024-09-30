// useTokenCount.ts
import { get_encoding } from "tiktoken"
import { useState, useEffect } from "react"

// Todo: load encoding based on context
// cl100k_base	gpt-4, gpt-3.5-turbo, text-embedding-ada-002, text-embedding-3-small, text-embedding-3-large
// p50k_base	Codex models, text-davinci-002, text-davinci-003
// r50k_base (or gpt2)	GPT-3 models like davinci

const encoding = get_encoding("cl100k_base") // GPT4

const useTokenCount = (value: string) => {
  const [tokenCount, setTokenCount] = useState(0)

  useEffect(() => {
    const tokens = encoding.encode(value)
    setTokenCount(tokens.length)
  }, [value])

  return tokenCount
}

export default useTokenCount
