import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Scroll-scrubbed procedural sculpture.
 * An icosahedron whose vertices are displaced by custom noise; rotation Y
 * and scale are mapped to scroll progress through the parent 200vh section.
 */
export default function VoidCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ---- Procedural sculpture ----
    const detail = 5;
    const geometry = new THREE.IcosahedronGeometry(1.4, detail);
    const basePositions = new Float32Array(geometry.attributes.position.array);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x4d4dff,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const mesh = new THREE.Mesh(geometry, wireMaterial);
    scene.add(mesh);

    // Inner glow sphere
    const innerGeo = new THREE.IcosahedronGeometry(0.6, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x4d4dff,
      transparent: true,
      opacity: 0.12,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Floating vertices (points) that "explode" on scroll
    const pointGeo = new THREE.BufferGeometry();
    const pointCount = 400;
    const pointPositions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      const i3 = i * 3;
      const idx = Math.floor((i / pointCount) * (basePositions.length / 3)) * 3;
      pointPositions[i3] = basePositions[idx];
      pointPositions[i3 + 1] = basePositions[idx + 1];
      pointPositions[i3 + 2] = basePositions[idx + 2];
    }
    pointGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    const pointMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloud = new THREE.Points(pointGeo, pointMat);
    scene.add(cloud);

    // ---- Mouse light influence ----
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener('mousemove', onMouseMove);

    // ---- Scroll progress (0 → 1 across the 200vh section) ----
    let scrollProgress = 0;
    const updateScroll = () => {
      const section = container.closest('[data-void-section]');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      scrollProgress = Math.max(0, Math.min(1, scrolled / total));
    };
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    // ---- Animation loop ----
    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotation mapped to scroll
      mesh.rotation.y = scrollProgress * Math.PI * 2 + t * 0.15;
      mesh.rotation.x = scrollProgress * Math.PI * 0.8 + t * 0.05;
      innerMesh.rotation.copy(mesh.rotation);
      cloud.rotation.copy(mesh.rotation);

      // Scale: 0.8 → 1.5 based on scroll
      const scale = 0.8 + scrollProgress * 0.7;
      mesh.scale.setScalar(scale);
      innerMesh.scale.setScalar(scale);
      // Cloud expands more — "explodes" with scroll
      const cloudScale = scale + scrollProgress * 0.6;
      cloud.scale.setScalar(cloudScale);

      // Mouse tilt
      mesh.rotation.z = mouse.x * 0.25;

      // Vertex displacement (noise-driven, intensifies with scroll)
      const pos = geometry.attributes.position.array;
      const explode = scrollProgress;
      for (let i = 0; i < pos.length; i += 3) {
        const ox = basePositions[i];
        const oy = basePositions[i + 1];
        const oz = basePositions[i + 2];
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
        const noise =
          Math.sin(ox * 3 + t * 1.8) *
          Math.cos(oy * 3 + t * 1.2) *
          Math.sin(oz * 2.5 + t * 1.5);
        const disp = noise * (0.15 + explode * 0.5);
        pos[i] = ox + (ox / len) * disp;
        pos[i + 1] = oy + (oy / len) * disp;
        pos[i + 2] = oz + (oz / len) * disp;
      }
      geometry.attributes.position.needsUpdate = true;

      // Point cloud follows displaced surface + drifts outward with scroll
      const ppos = pointGeo.attributes.position.array;
      for (let i = 0; i < pointCount; i++) {
        const i3 = i * 3;
        const idx = (i % (basePositions.length / 3)) * 3;
        ppos[i3] = pos[idx] * (1 + scrollProgress * 0.3);
        ppos[i3 + 1] = pos[idx + 1] * (1 + scrollProgress * 0.3);
        ppos[i3 + 2] = pos[idx + 2] * (1 + scrollProgress * 0.3);
      }
      pointGeo.attributes.position.needsUpdate = true;

      // Opacity changes
      wireMaterial.opacity = 0.4 + scrollProgress * 0.3;
      pointMat.opacity = 0.4 + scrollProgress * 0.4;

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
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      wireMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      pointGeo.dispose();
      pointMat.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}