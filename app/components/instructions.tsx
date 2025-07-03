
import React from 'react';

const Instructions = () => {
  return (
    <div className="flex flex-col items-center justify-center space-x-3 z-80">
      <span className="text-white font-light animate-pulse tracking-wide text-center">Click & drag to rotate</span>
      <span className="text-white font-light animate-pulse tracking-wide text-center">Scroll to zoom in/out</span>
      <span className="text-white font-light animate-pulse tracking-wide text-center">Right-click & drag to pan</span>
    </div>
  );
};

export default Instructions;
