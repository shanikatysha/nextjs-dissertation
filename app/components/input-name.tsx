
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface ModernInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

const ModernInput: React.FC<ModernInputProps> = ({
  placeholder = "Enter your name...",
  onSubmit,
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

  return (
    <div className="w-full max-w-full mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? '' : placeholder}  // <-- here
            className={`
              w-full px-1 py-6 text-base text-left font-200 bg-transparent border-0 border-b-1 
              transition-all duration-300 ease-in-out outline-none placeholder-[#9B8184]
              ${isFocused || value 
                ? 'border-[#E5D4C7] text-[#5D3136]' 
                : 'border-[#E5D4C7] text-[#5D3136]'
              }
              hover:border-[#5D3136] focus:border-[#5D3136]
            `}
          />

          {/* Arrow icon */}
          <button
            type="submit"
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full
              transition-all duration-300 ease-in-out
              ${value.trim()
                ? 'text-[#9B8184] hover:text-[#5D3136] cursor-pointer opacity-100'
                : 'text-[#E5D4C7] cursor-not-allowed opacity-50'
              }
            `}
            disabled={!value.trim()}
          >
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Focus line animation */}
        <div 
          className={`
            absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-[#5D3136] to-[#5D3136]
            transition-all duration-300 ease-in-out
            ${isFocused ? 'w-full' : 'w-0'}
          `}
        />
      </form>
    </div>
  );
};

export default ModernInput;
