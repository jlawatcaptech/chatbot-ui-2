import { get_encoding } from "tiktoken"
import { useState } from "react"

const encoding = get_encoding("cl100k_base")

interface InputProps {
  initialInput?: string // Define the type for the initialInput prop
}

export function Tokens({ initialInput }: InputProps) {
  const [input, setInput] = useState(initialInput || "")

  const tokens = encoding.encode(input)

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div>{tokens.toString()}</div>
    </div>
  )
}
