import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Interactive Three.js particle system for the hero.
 * Organic, smoky swirls at rest → rigid geometric lattice as cursor speeds up.
 */
export default function HeroCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 48;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ---- Particle field ----
    const particleCount = 2500;
    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 18 + Math.random() * 14;
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      basePositions[i3] = positions[i3];
      basePositions[i3 + 1] = positions[i3 + 1];
      basePositions[i3 + 2] = positions[i3 + 2];
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x4d4dff,
      size: 0.35,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---- Interaction state ----
    const mouse = { x: 0, y: 0, speed: 0, vx: 0, vy: 0 };
    let lastX = 0, lastY = 0;

    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const spd = Math.sqrt(dx * dx + dy * dy);
      mouse.speed = Math.min(mouse.speed + spd / 8, 6);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ---- Animation loop ----
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Gentle rotation + mouse drift
      points.rotation.y += 0.0008 + mouse.x * 0.0015;
      points.rotation.x += mouse.y * 0.0015;

      const pos = geometry.attributes.position.array;
      const spdNorm = Math.min(mouse.speed / 6, 1);
      const organic = 1 - spdNorm; // 1 = organic, 0 = rigid
      const gridSize = 3;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ox = basePositions[i3];
        const oy = basePositions[i3 + 1];
        const oz = basePositions[i3 + 2];

        // Organic noise swirl
        const n =
          Math.sin(t * 0.4 + ox * 0.08) *
          Math.cos(t * 0.3 + oy * 0.08) *
          Math.sin(t * 0.5 + oz * 0.06);

        // Geometric snap toward grid lattice (when cursor is fast)
        const gridX = Math.round(ox / gridSize) * gridSize;
        const gridY = Math.round(oy / gridSize) * gridSize;
        const gridZ = Math.round(oz / gridSize) * gridSize;

        pos[i3] = ox + n * organic * 3.5 + (gridX - ox) * spdNorm * 0.15;
        pos[i3 + 1] = oy + Math.cos(t * 0.35 + oz * 0.07) * organic * 3.5 + (gridY - oy) * spdNorm * 0.15;
        pos[i3 + 2] = oz + Math.sin(t * 0.45 + ox * 0.05) * organic * 2.5 + (gridZ - oz) * spdNorm * 0.15;
      }
      geometry.attributes.position.needsUpdate = true;

      // Speed decay
      mouse.speed *= 0.93;

      renderer.render(scene, camera);
    };
    animate();

    // ---- Resize ----
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}