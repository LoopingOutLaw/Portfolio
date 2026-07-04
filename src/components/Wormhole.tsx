import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface WormholeProps {
  scrollProgress: number;
}

function canUseWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

export default function Wormhole({ scrollProgress }: WormholeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rafRef = useRef<number>(0);
  const tubeRef = useRef<THREE.Mesh | null>(null);
  const nodesRef = useRef<THREE.Group[]>([]);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;

    if (!canUseWebGL()) {
      setWebglFailed(true);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    } catch (error) {
      console.warn('Wormhole disabled because WebGL could not be initialized.', error);
      setWebglFailed(true);
      return;
    }
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x050505);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create tube path
    const splinePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = Math.sin(t * Math.PI * 4) * 2;
      const y = Math.cos(t * Math.PI * 2) * 1.5;
      const z = t * 60 - 30;
      splinePoints.push(new THREE.Vector3(x, y, z));
    }
    const path = new THREE.CatmullRomCurve3(splinePoints);

    // Main tube
    const tubeGeometry = new THREE.TubeGeometry(path, 300, 4, 32, false);

    const tubeVertexShader = `
      varying vec2 vUv;
      varying float vProgress;
      uniform float uScrollSpeed;

      void main() {
        vUv = uv;
        vec3 pos = position;
        vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        float yOffset = uScrollSpeed * 0.1;
        pos.y += yOffset;
        vProgress = uv.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const tubeFragmentShader = `
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uGridScale;
      uniform float uLineWidth;
      uniform float uScrollSpeed;
      uniform float uTime;
      varying vec2 vUv;
      varying float vProgress;

      float gridLine(float coord, float width) {
        float fw = fwidth(coord);
        float p = abs(fract(coord - 0.5) - 0.5);
        return 1.0 - smoothstep(width * fw, (width + 1.0) * fw, p);
      }

      void main() {
        vec2 uv = vUv * uGridScale;
        float line = max(gridLine(uv.x, uLineWidth), gridLine(uv.y, uLineWidth));
        float flow = fract(vUv.y - uTime * 0.1);
        float core = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
        float alpha = line * uOpacity;
        vec3 color = mix(uColor, vec3(1.0), flow * 0.3);
        gl_FragColor = vec4(color, alpha * core);
      }
    `;

    const tubeMaterial = new THREE.ShaderMaterial({
      vertexShader: tubeVertexShader,
      fragmentShader: tubeFragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uColor: { value: new THREE.Color(0x00ffff) },
        uOpacity: { value: 0.6 },
        uGridScale: { value: 20.0 },
        uLineWidth: { value: 1.0 },
        uScrollSpeed: { value: 0.0 },
        uTime: { value: 0.0 },
      },
    });

    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube);
    tubeRef.current = tube;

    // Particle nodes (rings at project positions)
    const projectPositions = [0.15, 0.4, 0.65, 0.9];
    const groups: THREE.Group[] = [];

    projectPositions.forEach((t, idx) => {
      const group = new THREE.Group();
      const point = path.getPointAt(Math.min(0.99, t));
      group.position.copy(point);

      const tangent = path.getTangentAt(Math.min(0.99, t)).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
      const angle = Math.acos(up.dot(tangent));
      group.quaternion.setFromAxisAngle(axis, angle);

      const count = 16;
      const radiusBase = 5;
      const color = idx % 2 === 0 ? 0xff0000 : 0x00ffff;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const geo = new THREE.CylinderGeometry(0.01, 0.01, 0.08, 4);
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color).convertSRGBToLinear(),
          emissive: new THREE.Color(color).convertSRGBToLinear(),
          emissiveIntensity: 2,
          toneMapped: false,
        });
        const mesh = new THREE.Mesh(geo, mat);

        const p = new THREE.Vector3(
          Math.cos(angle),
          Math.sin(angle),
          0
        ).multiplyScalar(0.05);

        mesh.position.set(
          p.x * radiusBase + (Math.random() - 0.5) * 0.02,
          p.y * radiusBase + (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        );
        mesh.rotation.z = angle;
        group.add(mesh);
      }

      scene.add(group);
      groups.push(group);
    });

    nodesRef.current = groups;

    camera.position.z = -30;

    let time = 0;
    const animate = () => {
      time += 0.005;
      tubeMaterial.uniforms.uTime.value = time;
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.offsetWidth;
      const nh = container.offsetHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      tubeGeometry.dispose();
      tubeMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update camera position based on scroll progress
  useEffect(() => {
    if (!cameraRef.current) return;
    const startZ = -30;
    const endZ = 15;
    const currentZ = startZ + (endZ - startZ) * scrollProgress;
    cameraRef.current.position.z = currentZ;
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      className={webglFailed ? 'wormhole-fallback' : undefined}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
    />
  );
}
