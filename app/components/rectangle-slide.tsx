
import React, { useEffect, useState } from 'react';
import NarrativeTextBox from './narrative-box';

const SlidingRectangle = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-start the animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);


//   const restartAnimation = () => {
//     setIsVisible(true);
//     setTimeout(() => {
//       setIsVisible(false);
//     }, 100);
//   };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black z-50 transform transition-transform duration-[15000ms] ease-in-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      />
      
      {/* <button
        onClick={restartAnimation}
        className="fixed bottom-8 right-8 bg-white text-black px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors duration-200 z-40 font-semibold"
      >
        Restart Animation
      </button> */}
    </>
  );
};

export default SlidingRectangle;
