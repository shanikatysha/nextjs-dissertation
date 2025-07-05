'use client';

import { useEffect, useRef } from 'react';
import { Gradient } from './gradient.js'; 

type GradientCanvasProps = {
  colors: [string, string, string, string]; 
};

export default function GradientCanvas({ colors }: GradientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set CSS custom properties dynamically
    colors.forEach((color, i) => {
      canvas.style.setProperty(`--gradient-color-${i + 1}`, color);
    });

    const gradient = new Gradient();
    gradient.initGradient('#gradient-canvas');
  }, [colors]);

  return <canvas id="gradient-canvas" ref={canvasRef} style={{ width: '100%', height: '100%', zIndex: 50, position: 'absolute' }} />;
}
