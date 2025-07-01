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
    animation: `blink 1s step-end infinite, type 1s steps(${charCount}) forwards`,
  };

  return (
    <div
      ref={textRef}
      className="overflow-hidden whitespace-nowrap border-r-[3px] border-white inline-block"
      style={typingStyle}
    >
      {text}
    </div>
  );
}
