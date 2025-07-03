'use client';

import { useEffect, useRef } from 'react';
// @ts-ignore
import * as THREE from 'three';

type Props = {
  text: string;
};

export default function ParticleText({ text }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mouse = new THREE.Vector2();
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 350;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    // 2D canvas to draw text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = width-400;
    canvas.height = height-200;

    // new lines for long
    function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = words[0];
    
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }
    

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const lines = wrapText(ctx, text, canvas.width-240);
    const lineHeight = 20;

    const textHeight = lines.length * lineHeight;
    let startY = (canvas.height - textHeight) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + i * lineHeight);
    });    

    // Extract pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const positions: number[] = [];
    const velocities: number[] = [];

    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 2) {
        const i = (y * canvas.width + x) * 4;
        const alpha = imageData[i + 3];

        if (alpha > 128) {
          // Convert 2D canvas position to 3D
          const posX = x - canvas.width / 2;
          const posY = canvas.height / 2 - y;
          positions.push(posX, posY, 0);

          // Initial velocity is zero (particles stay still)
          velocities.push(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          );
        }
      }
    }
    console.log('alpha sample:', imageData[3]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: '#D2B672',
      size: 2,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let shouldDisperse = false;
    setTimeout(() => {
      shouldDisperse = true;
    }, 10000);

    const animate = () => {
      requestAnimationFrame(animate);

      if (shouldDisperse) {
        const pos = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < pos.length; i += 3) {
          pos[i] += velocities[i] * 0.2;
          pos[i + 1] += velocities[i + 1] * 0.2;
          pos[i + 2] += velocities[i + 2] * 0.2;
        }
        geometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };


    const container = containerRef.current!;
    container.appendChild(renderer.domElement);
    animate();

    return () => {
      container.removeChild(renderer.domElement);
    };
  }, [text]);

  return <div ref={containerRef} className="w-full h-screen bg-black" />;
}
