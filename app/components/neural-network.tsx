'use client';

import { useEffect, useRef } from 'react';
//@ts-ignore
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function LinkedParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 800;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // --- PARTICLES SETUP ---

    const particleCount = 2500; // adjust for performance
    const positions: number[] = [];
    const velocities: number[] = [];
    const particlesData: {
      position: THREE.Vector3;
      nextPosition: THREE.Vector3;
      prevPosition: THREE.Vector3;
      moveTo: boolean;
      duration: number;
      timestamp: number;
    }[] = [];

    // Initialize particles randomly inside a cube volume
    const volumeSize = 500;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * volumeSize;
      const y = (Math.random() - 0.5) * volumeSize;
      const z = (Math.random() - 0.5) * volumeSize;

      positions.push(x, y, z);
      velocities.push(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      );

      particlesData.push({
        position: new THREE.Vector3(x, y, z),
        nextPosition: new THREE.Vector3(x, y, z),
        prevPosition: new THREE.Vector3(x, y, z),
        moveTo: false,
        duration: 0,
        timestamp: 0,
      });
    }

    // Points geometry & material
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color('#C4E1E1'),
      size: 2,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- LINKED LINES SETUP ---

    const maxDistance = 50;
    const links: [number, number][] = [];
    for (let i = 0; i < particlesData.length; i++) {
      for (let j = i + 1; j < particlesData.length; j++) {
        if (particlesData[i].position.distanceTo(particlesData[j].position) < maxDistance) {
          links.push([i, j]);
        }
      }
    }

    const linePositions = new Float32Array(links.length * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.3,
      transparent: true,
      depthWrite: false,
    });
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);


    function updateLines() {
      const posArray = geometry.attributes.position.array as Float32Array;

      for (let k = 0; k < links.length; k++) {
        const [i, j] = links[k];
        const ix = i * 3;
        const jx = j * 3;

        linePositions[k * 6] = posArray[ix];
        linePositions[k * 6 + 1] = posArray[ix + 1];
        linePositions[k * 6 + 2] = posArray[ix + 2];

        linePositions[k * 6 + 3] = posArray[jx];
        linePositions[k * 6 + 4] = posArray[jx + 1];
        linePositions[k * 6 + 5] = posArray[jx + 2];
      }
      lineGeometry.attributes.position.needsUpdate = true;
    }


    function animate() {
      requestAnimationFrame(animate);
      lineMaterial.opacity = 0.3 * (0.5 + 0.5 * Math.sin(performance.now() * 0.0008)); //blinkingg
      updateLines();
      renderer.render(scene, camera);
      controls.update();
    }

    container.appendChild(renderer.domElement);
    animate();

    // Cleanup on unmount
    return () => {
      container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen bg-black" />;
}
