
import React, { useEffect, useState } from 'react';
import NarrativeTextBox from './narrative-box';

type Props = {
  direction: string;
};

const SlidingRectangle = ({ direction }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeClass, setFadeClass] = useState('opacity-100');

  useEffect(() => {
    // Auto-start the animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

// when direction is 'side', show overlay for 1s
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeClass('opacity-0 transition-opacity duration-3000 ease-out');
    }, 1000); 

    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      {direction === 'top-down' ? (
        <div
          className={`fixed inset-0 bg-black z-50 transform transition-transform duration-[15000ms] ease-in-out ${
            isVisible ? 'translate-y-0' : 'translate-y-full'
          }`}
        />
      ) : direction === 'side' ? (
        <div
          className={`fixed inset-0 bg-black z-50 pointer-events-none
        ${fadeClass}`}
        />
      ) : null}
    </>
  );
};

export default SlidingRectangle;
