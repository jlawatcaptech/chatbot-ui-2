"use client"
import { get_encoding } from "tiktoken";
import { useEffect, useState } from 'react';



// You can retrieve the encoding for a model using tiktoken.encoding_for_model() as follows:
// encoding = tiktoken.encoding_for_model('gpt-3.5-turbo')

const encoding = get_encoding("cl100k_base");

function getRandomString() {
  const dictionary = [
    "apple", "banana", "orange", "grape", "pineapple", "mango", "kiwi", "watermelon", "strawberry", "blueberry",
    "peach", "plum", "pear", "cherry", "apricot", "nectarine", "blackberry", "raspberry", "pomegranate", "lemon",
    "lime", "coconut", "dragonfruit", "papaya", "fig", "passionfruit", "guava", "avocado", "cranberry", "lychee",
    "quince", "tangerine", "melon", "cantaloupe", "persimmon", "starfruit", "kumquat", "durian", "jackfruit", "mangosteen",
    "elderberry", "gooseberry", "mulberry", "soursop", "yuzu", "rhubarb", "longan", "loquat", "salak", "tamarind"
  ];

  // Generate a random number of words (between 5 and 10)
  const wordCount = Math.floor(Math.random() * 6) + 10;

  // Shuffle and pick a random subset of words
  const shuffledWords = dictionary.sort(() => 0.5 - Math.random());
  const randomString = shuffledWords.slice(0, wordCount).join(" ");

  return randomString;
}


export default function Home() {
  const [input, setInput] = useState(getRandomString());
  const tokens = encoding.encode(input);

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "1020px",
          height: "40px",
          backgroundColor: "blue",
          boxSizing: "border-box",
          padding: "10px",
          fontSize: "16px",
          whiteSpace: "normal", // default behavior for word wrapping
          wordWrap: "break-word", // ensures long words break and wrap to the next line
          overflowWrap: "break-word" // additional support for breaking long words
        }}
      />
      <div>{tokens.length} </div>
    </div>
  );
}