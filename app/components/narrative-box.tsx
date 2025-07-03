import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface NarrativeTextBoxProps {
  text: string;
  isVisible: boolean;
  title?: string;
  animationPhase?: number;
  onNext?: () => void;
}

const NarrativeTextBox = ({ text, isVisible, title, animationPhase = 0, onNext }: NarrativeTextBoxProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]); // restart typing only if text changes

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('');
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 80);

      return () => clearTimeout(timer);
    }
  }, [text, currentIndex, isVisible, 80]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-80 w-11/12 max-w-6xl">
      <div className="bg-black border-1 border-gray-500 rounded-lg p-6 shadow-2xl backdrop-blur-sm">
        {/* Retro header bar */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-600">
          <div className="text-gray-400 text-sm font-mono">
          {title ? `STEP ${animationPhase + 1}: ${title}` : "STEP"}</div>
          {onNext && (
            <button
              onClick={onNext}
              type="button"
              className="right-0 p-1 rounded-full text-gray-600 hover:text-gray-100 transition-colors"
              aria-label="Next"
            >
              <ArrowRight size={20} />
            </button>
          )}
        </div>
        
        {/* Text content */}
        <div className="text-gray-300 font-mono text-lg leading-relaxed">
          {displayedText}
          <span className="animate-pulse text-gray-300">|</span>
        </div>
      </div>
    </div>
  );
};

export default NarrativeTextBox;
