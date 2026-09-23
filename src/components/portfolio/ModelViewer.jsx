import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

/**
 * Loads and frames a glTF/GLB model (e.g. a Polycam export) in an
 * orbit-controlled Three.js scene. Falls back to a placeholder mesh
 * with an instructive message when the model file isn't there yet.
 */
export default function ModelViewer({ src }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.01,
      2000
    );
    camera.position.set(4, 3, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.5;
    controls.maxDistance = 200;

    // ---- Lighting ----
    scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a1a, 1.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x4d4dff, 0.6);
    rimLight.position.set(-6, 2, -4);
    scene.add(rimLight);

    let disposables = [];
    let placeholder = null;
    let loadedRoot = null;
    let frameId;

    const frameObject = (object) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const radius = Math.max(size.x, size.y, size.z, 0.001);

      object.position.sub(center);
      controls.target.set(0, 0, 0);
      camera.position.set(radius * 0.9, radius * 0.6, radius * 1.1);
      camera.near = radius / 100;
      camera.far = radius * 100;
      camera.updateProjectionMatrix();
      controls.minDistance = radius * 0.1;
      controls.maxDistance = radius * 10;
      controls.update();
    };

    const addPlaceholder = () => {
      const geometry = new THREE.IcosahedronGeometry(1.4, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x4d4dff,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });
      placeholder = new THREE.Mesh(geometry, material);
      scene.add(placeholder);
      disposables.push(geometry, material);
      frameObject(placeholder);
    };

    if (src) {
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        src,
        (gltf) => {
          loadedRoot = gltf.scene;
          scene.add(loadedRoot);
          frameObject(loadedRoot);
          setStatus('ready');
        },
        (event) => {
          if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
        },
        (err) => {
          console.error('Failed to load model:', src, err);
          addPlaceholder();
          setStatus('error');
        }
      );
    } else {
      addPlaceholder();
      setStatus('error');
    }

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (placeholder) {
        placeholder.rotation.y += 0.004;
        placeholder.rotation.x += 0.0015;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      disposables.forEach((d) => d.dispose());
      if (loadedRoot) {
        loadedRoot.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              if (!mat) return;
              Object.values(mat).forEach((value) => {
                if (value && value.isTexture) value.dispose();
              });
              mat.dispose();
            });
          }
        });
      }
    };
  }, [src]);

  // Sized via `absolute inset-0` rather than `w-full h-full`: the caller's
  // box only sets a min-height, and percentage heights don't resolve
  // against an ancestor whose height comes from min-height alone. The
  // caller just needs to be `position: relative` (or similar) and sized.
  return (
    <>
      <div ref={containerRef} className="absolute inset-0" />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xs font-mono uppercase tracking-widest text-white/60">
            Loading model… {progress}%
          </span>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-end justify-center pb-6 px-4 text-center pointer-events-none">
          <span className="text-xs font-mono uppercase tracking-widest text-white/50">
            Model not found — drop the exported .glb at{' '}
            <code className="text-[#4D4DFF]">{src}</code>
          </span>
        </div>
      )}
    </>
  );
}
