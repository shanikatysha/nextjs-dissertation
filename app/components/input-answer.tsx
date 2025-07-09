
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface ModernInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  currentStep: number;
}

const BigTextInput: React.FC<ModernInputProps> = ({
  placeholder = "Write your experience, thoughts, or feelings...",
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
              transition-all duration-300 ease-in-out outline-none placeholder-[#bcafb0] bg-[#f2e2d6]
              ${isFocused || value 
                ? 'border-[#E5D4C7] text-[#5D3136]' 
                : 'border-[#534648] text-[#5D3136]'
              }
              hover:border-[#5D3136] focus:border-[#5D3136]
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
                        ? 'text-[#9B8184] hover:text-[#5D3136] cursor-pointer opacity-100'
                :         'text-[#E5D4C7] cursor-not-allowed opacity-50'
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
