'use client';

import { useEffect, useRef, useState } from 'react';

export default function TypingText({ text }: { text: string }) {
  const [charCount, setCharCount] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  const typingStyle = {
    width: `${charCount}ch`,
    animation: `blink 1.5s step-end infinite, type 4s steps(${charCount}) forwards`,
  };

  return (
    <div
      ref={textRef}
      className="overflow-hidden whitespace-normal inline-block pb-2 w-[20vw]"
      style={typingStyle}
    >
      {text}
    </div>
  );
}
