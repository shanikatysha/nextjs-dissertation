'use client';

import { useEffect, useRef } from 'react';
//@ts-ignore
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ClusterParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.x = 200;
    camera.position.y = 200;
    camera.position.z = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 800;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.target.set(0, 0, 0);

    // --- PARTICLES SETUP ---

    const particleCount = 2000; // adjust for performance
    const clusterCount = 3;
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
    const particlesPerCluster = Math.floor(particleCount / clusterCount);
    const radius = 40;
    const clusterCenters = [
        new THREE.Vector3(radius, 0, 0),
        new THREE.Vector3(-radius * 0.5, radius * Math.sqrt(3) / 2, 0),
        new THREE.Vector3(-radius * 0.5, -radius * Math.sqrt(3) / 2, 0),
    ];

    // Helper for organic shape (spherical distortion + noise)
    function generateClusterPosition(center: THREE.Vector3): THREE.Vector3 {
        const radius = 80 * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
    
        const x = radius * Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 20;
        const y = radius * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 20;
        const z = radius * Math.cos(phi) + (Math.random() - 0.5) * 20;
    
        return new THREE.Vector3(center.x + x, center.y + y, center.z + z);
    }

    for (let c = 0; c < clusterCount; c++) {
        const center = clusterCenters[c];
        for (let i = 0; i < particlesPerCluster; i++) {
          const pos = generateClusterPosition(center);
          positions.push(pos.x, pos.y, pos.z);
      
          velocities.push(
            (Math.random() - 0.5) * 2.0,
            (Math.random() - 0.5) * 1.0,
            (Math.random() - 0.5) * 2.0
          );
      
          particlesData.push({
            position: pos.clone(),
            nextPosition: pos.clone(),
            prevPosition: pos.clone(),
            moveTo: false,
            duration: 0,
            timestamp: 0,
          });
        }
      }

    // Points geometry & material
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color('#C4E1E1'),
      size: 1,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- LINKED LINES SETUP ---

    const maxDistance = 15;
    const links: [number, number][] = [];

    for (let c = 0; c < clusterCount; c++) {
    const start = c * particlesPerCluster;
    const end = start + particlesPerCluster;

    for (let i = start; i < end; i++) {
        for (let j = i + 1; j < end; j++) {
        if (particlesData[i].position.distanceTo(particlesData[j].position) < maxDistance) {
            links.push([i, j]);
        }
        }
    }
    }

    const linePositions = new Float32Array(links.length * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      opacity: 0.1,
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
      lineMaterial.opacity = 0.3 * (0.5 + 0.5 * Math.sin(performance.now() * 0.002)); //blinkingg
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
