
import React from 'react';

const LoadingHeartbeat = () => {
  return (
    <div className="flex items-center justify-center space-x-3 z-80">
      <div className="relative">
        <div className="w-3 h-3 bg-white rounded-sm transform rotate-45 animate-ping"></div>
        <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
      </div>
      <span className="text-white font-light animate-pulse tracking-wide text-center">Analyzing your story...</span>
    </div>
  );
};

export default LoadingHeartbeat;
