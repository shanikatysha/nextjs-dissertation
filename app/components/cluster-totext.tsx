'use client';

import { useEffect, useRef } from 'react';
//@ts-ignore
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

type ClusterToTextProps = {
    words: [string, string, string]; // a tuple of 3 words
  };

export default function ClusterToText({ words }: ClusterToTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

    let morphing = false;
    setTimeout(() => {
        morphing = true;
    }, 4000); // delay in milliseconds before morphing starts

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 150;

    // const axesHelper = new THREE.AxesHelper( 300 );
    // scene.add( axesHelper );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 100;
    controls.maxDistance = 800;
    controls.target.set(0, 0, 0);
    

    // 2D canvas to draw text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = width-400;
    canvas.height = height-200;

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
        target: THREE.Vector3;
    }[] = [];  
    const particlesPerCluster = Math.floor(particleCount / clusterCount);
    const spacing = 100; // adjust how far apart they are on the X axis
    const clusterCenters = [
        new THREE.Vector3(-spacing, 0, 0),   // left
        new THREE.Vector3(0, 0, 0),          // center
        new THREE.Vector3(spacing, 0, 0),    // right
    ];

    const wordList = words; // 3 clusters = 3 words
    const targetPointsPerCluster: THREE.Vector3[][] = [];

    for (let c = 0; c < clusterCount; c++) {
        const points = getPointsFromText(wordList[c], 80, 500, 150);
        targetPointsPerCluster.push(points);
    }

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
            target: new THREE.Vector3(0, 0, 0)
          });
        }
    }

    // Assign target positions after particles are created
    for (let c = 0; c < clusterCount; c++) {
        const textPoints = getPointsFromText(wordList[c], 30, 500, 150);
        const start = c * particlesPerCluster;
    
        for (let i = 0; i < particlesPerCluster; i++) {
        const particleIndex = start + i;
        const target = textPoints[i % textPoints.length].clone();
    
        const wordSpacing = 40; // tweak this for how spaced out you want them
        target.x += (c - 1) * wordSpacing;
        target.y -= (c - 1) * wordSpacing - 20;
    
        particlesData[particleIndex].target = target;
        }
    }


    //function getPointsFromText(word: string, fontSize: number, canvasWidth: number, canvasHeight: number) {
    function getPointsFromText(word: string, fontSize: number, canvasWidth: number, canvasHeight: number) {
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillText(word, canvasWidth / 2, canvasHeight / 2);

        const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        const points = [];
        const step = 2; // ✅ smaller step = denser points

        for (let y = 0; y < canvasHeight; y += step) {
            for (let x = 0; x < canvasWidth; x += step) {
            const idx = (y * canvasWidth + x) * 4;
            if (imgData.data[idx + 3] > 128) { // alpha threshold
                points.push(new THREE.Vector3(x - canvasWidth / 2, -y + canvasHeight / 2, 0));
            }
            }
        }
        return points;
    }


    // Points geometry & material
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: new THREE.Color('#C4E1E1'),
      size: 1,
      target: new THREE.Vector3(0, 0, 0)
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- LINKED LINES SETUP ---

    const maxDistance = 15;
    const links: [number, number, number][] = [];

    for (let c = 0; c < clusterCount; c++) {
        const start = c * particlesPerCluster;
        const end = start + particlesPerCluster;

        for (let i = start; i < end; i++) {
            for (let j = i + 1; j < end; j++) {
                if (particlesData[i].position.distanceTo(particlesData[j].position) < maxDistance) {
                    links.push([i, j, c]);
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

    const cameraStart = camera.position.clone();
    const cameraZoomOutTarget = new THREE.Vector3(0, 10, 150); // zoomed-out Z position

    function animate() {
      requestAnimationFrame(animate);

      const posArray = geometry.attributes.position.array as Float32Array;
      if (morphing) {
        for (let i = 0; i < particlesData.length; i++) {
          const p = particlesData[i];
          p.position.lerp(p.target, 0.003); // control speed here
          scene.remove(linesMesh);
    
          const i3 = i * 3;
          posArray[i3] = p.position.x;
          posArray[i3 + 1] = p.position.y;
          posArray[i3 + 2] = p.position.z;
        }
        geometry.attributes.position.needsUpdate = true;

        camera.position.lerp(cameraZoomOutTarget, 0.02);
        controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.02); // optional: keep centered

      }
      updateLines();
      controls.update();
      renderer.render(scene, camera);
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
