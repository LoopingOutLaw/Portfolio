import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const vertexShader = `
  varying vec2 vUv;
  varying float vWave;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vec3 pos = position;
    float dist = distance(uv, uMouse);
    float mouseElevate = smoothstep(0.5, 0.0, dist) * 0.8;
    float wave = sin(dist * 10.0 - uTime * 2.0) * 0.2;
    pos.y += wave + mouseElevate;
    vWave = pos.y;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vWave;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    float dist = distance(vUv, uMouse);
    float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.5 + 0.5;
    vec3 baseColor = vec3(0.05, 0.05, 0.05);
    vec3 rippleColor = mix(vec3(1.0, 0.0, 0.0), vec3(0.5, 0.0, 0.0), ripple * (1.0 - dist));
    vec3 color = mix(baseColor, rippleColor, ripple * (1.0 - dist));
    color += vec3(0.1, 0.0, 0.0) * vWave;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function ParametricWaveCurtain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.PlaneGeometry(30, 30, 200, 200);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      },
      wireframe: false,
      side: THREE.DoubleSide,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.offsetWidth, container.offsetHeight),
      0.4,
      0.5,
      0.7
    );
    composer.addPass(bloomPass);

    composerRef.current = composer;

    composer.setSize(container.offsetWidth, container.offsetHeight);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth);
      const y = 1 - (e.clientY / window.innerHeight);
      material.uniforms.uMouse.value.set(x, y);
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    let time = 0;
    const animate = () => {
      time += 0.01;
      material.uniforms.uTime.value = time;
      composer.render();
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      composer.dispose();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '65%',
        zIndex: 1,
      }}
    />
  );
}
