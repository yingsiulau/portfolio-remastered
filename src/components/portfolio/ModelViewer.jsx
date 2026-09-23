import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

export const FILTERS = ['none', 'ascii', 'pixel', 'duotone', 'thermal'];

// Maps scene luminance onto the site's two brand colors.
const DuotoneShader = {
  uniforms: {
    tDiffuse: { value: null },
    colorDark: { value: new THREE.Color(0x1a1a1a) },
    colorLight: { value: new THREE.Color(0x4d4dff) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 colorDark;
    uniform vec3 colorLight;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float lum = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
      gl_FragColor = vec4(mix(colorDark, colorLight, lum), texel.a);
    }
  `,
};

// Thermal-camera style rainbow LUT (navy → blue → cyan → green → yellow →
// orange → red → pink), keyed off scene luminance. Forces full opacity so
// the background paints solid navy instead of staying transparent.
const ThermalShader = {
  uniforms: {
    tDiffuse: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;

    vec3 thermalColor(float t) {
      t = clamp(t, 0.0, 1.0);
      if (t < 0.15) {
        return mix(vec3(0.04, 0.06, 0.31), vec3(0.10, 0.23, 0.84), t / 0.15);
      } else if (t < 0.32) {
        return mix(vec3(0.10, 0.23, 0.84), vec3(0.0, 0.85, 0.82), (t - 0.15) / 0.17);
      } else if (t < 0.48) {
        return mix(vec3(0.0, 0.85, 0.82), vec3(0.24, 0.95, 0.16), (t - 0.32) / 0.16);
      } else if (t < 0.62) {
        return mix(vec3(0.24, 0.95, 0.16), vec3(0.96, 0.93, 0.0), (t - 0.48) / 0.14);
      } else if (t < 0.75) {
        return mix(vec3(0.96, 0.93, 0.0), vec3(1.0, 0.54, 0.0), (t - 0.62) / 0.13);
      } else if (t < 0.85) {
        return mix(vec3(1.0, 0.54, 0.0), vec3(1.0, 0.16, 0.12), (t - 0.75) / 0.10);
      }
      return mix(vec3(1.0, 0.16, 0.12), vec3(1.0, 0.37, 0.84), (t - 0.85) / 0.15);
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float lum = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
      // The scene's lighting rarely pushes surfaces past mid brightness,
      // which would flatten everything into the cold end of the ramp —
      // boost and gamma-correct so highlights still reach yellow/pink.
      lum = pow(clamp(lum * 2.2, 0.0, 1.0), 0.75);
      gl_FragColor = vec4(thermalColor(lum), 1.0);
    }
  `,
};

/**
 * Loads and frames a glTF/GLB model (e.g. a Polycam export) in an
 * orbit-controlled Three.js scene. Falls back to a placeholder mesh
 * with an instructive message when the model file isn't there yet.
 * `filter` swaps the render pipeline between a few stylized looks —
 * see FILTERS above.
 */
export default function ModelViewer({ src, filter = 'none' }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [progress, setProgress] = useState(0);
  const filterRef = useRef(filter);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

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

    // OrbitControls always listens on the WebGL canvas — even in ASCII
    // mode, where that canvas is kept in the DOM at opacity 0 so pointer
    // events still land on it underneath the (pointer-events: none) text.
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

    // ---- Render pipelines, one per filter ----
    const composerNone = new EffectComposer(renderer);
    composerNone.addPass(new RenderPass(scene, camera));
    composerNone.addPass(new OutputPass());

    const pixelPass = new RenderPixelatedPass(6, scene, camera);
    const composerPixel = new EffectComposer(renderer);
    composerPixel.addPass(pixelPass);
    composerPixel.addPass(new OutputPass());

    const duotonePass = new ShaderPass(DuotoneShader);
    const composerDuotone = new EffectComposer(renderer);
    composerDuotone.addPass(new RenderPass(scene, camera));
    composerDuotone.addPass(duotonePass);
    composerDuotone.addPass(new OutputPass());

    const thermalPass = new ShaderPass(ThermalShader);
    const composerThermal = new EffectComposer(renderer);
    composerThermal.addPass(new RenderPass(scene, camera));
    composerThermal.addPass(thermalPass);
    composerThermal.addPass(new OutputPass());

    const composers = {
      none: composerNone,
      pixel: composerPixel,
      duotone: composerDuotone,
      thermal: composerThermal,
    };

    // No `invert`: AsciiEffect already forces fully-transparent (alpha 0)
    // background pixels to render as blank space, so leaving it off keeps
    // that background empty and maps dark model surfaces to dense chars.
    const asciiEffect = new AsciiEffect(renderer, ' .:-+*=%@#', { resolution: 0.18 });
    asciiEffect.setSize(container.clientWidth, container.clientHeight);
    Object.assign(asciiEffect.domElement.style, {
      position: 'absolute',
      inset: '0',
      overflow: 'hidden',
      pointerEvents: 'none',
      backgroundColor: 'transparent',
      color: '#4D4DFF',
    });
    container.appendChild(asciiEffect.domElement);

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

      const active = filterRef.current;
      const isAscii = active === 'ascii';
      renderer.domElement.style.opacity = isAscii ? '0' : '1';
      asciiEffect.domElement.style.visibility = isAscii ? 'visible' : 'hidden';

      if (isAscii) {
        asciiEffect.render(scene, camera);
      } else {
        (composers[active] || composerNone).render();
      }
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const { clientWidth: w, clientHeight: h } = container;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      Object.values(composers).forEach((c) => c.setSize(w, h));
      asciiEffect.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      if (asciiEffect.domElement.parentNode === container) {
        container.removeChild(asciiEffect.domElement);
      }
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      Object.values(composers).forEach((c) => c.dispose());
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
