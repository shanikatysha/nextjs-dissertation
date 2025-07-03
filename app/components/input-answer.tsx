
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface ModernInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  currentStep: number;
}

const BigTextInput: React.FC<ModernInputProps> = ({
  placeholder = "Being specific with your answers can help me understand better, so don't hold back on describing how these interactions make you feel...",
  onSubmit,
  currentStep,
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit && value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const wordCount = value.trim() === '' 
    ? 0 
    : value.trim().split(/\s+/).length;

  return (
    <div className="w-full max-w-full mx-auto">
      <form onSubmit={handleSubmit} className="w-full mx-auto">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? '' : placeholder}
            rows={12}
            className={`
              w-full px-8 py-8 text-base text-left leading-6 border-[1px] rounded-4xl resize-none 
              transition-all duration-300 ease-in-out outline-none placeholder-[#2a2a2a] bg-[#0b0b0b]
              ${isFocused || value 
                ? 'border-[#1d1d1d] text-[#8c8c8c]' 
                : 'border-[#1d1d1d] text-[#8c8c8c]'
              }
              hover:border-[#2b2b2b] focus:border-[#4a4a4a]
            `}
          />
          {/* Word counter */}
      <p className={`text-[12px] mt-2 text-right text-gray-600`}>
        {wordCount} / {150}
      </p>

          {/* Arrow icon */}
          <div className="flex justify-center">
          {!(currentStep === 6 && !value.trim()) && (
            <button
                type="submit"
                className={currentStep === 6
                    ? 'shiny-cta'
                    : `
                    rounded-full transition-all duration-300 ease-in-out
                    ${value.trim()
                        ? 'text-gray-500 hover:text-gray-100 cursor-pointer opacity-100'
                        : 'text-gray-800 cursor-not-allowed opacity-50'
                    }
                    `}
                disabled={!value.trim()}
                >
                {currentStep === 6 ? 'Generate' : <ArrowRight size={20} />}
                </button>
            )}
          </div>
      </form>
      
    </div>
  );
};

export default BigTextInput;
