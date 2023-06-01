import { TInputWord } from "../../types";
import "./InputWord.css";
import { useState, useRef } from "react";

export default function InputWord({ onComplete }: TInputWord) {
  const [word, setWord] = useState<string[]>([]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleInputChange(index: number, value: string) {
    word[index] = value;
    setWord(word);
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
    if (index === 4 && value) {
      onComplete(word.join("").toUpperCase());
    }
  }

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && index > 0) {
      word[index] = "";
      setWord(word);
      inputRefs.current[index - 1]?.focus();
    }
  };
  return (
    <div>
      {Array.from(Array(5)).map((_, index) => (
        <input
          className="input-char"
          autoFocus={index === 0}
          key={`otpItem${index}`}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          maxLength={1}
          value={word[index]}
          onChange={(event) => handleInputChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
        />
      ))}
    </div>
  );
}
