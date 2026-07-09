import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Preload, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function OrbitParticles() {
  const count = 50;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.8 + Math.random() * 1.2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.08;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.03} color="#06b6d4" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function SurfaceGlowPoints() {
  const count = 20;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.01;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  const matRef = useRef<THREE.PointsMaterial>(null);
  useFrame(({ clock }) => {
    if (matRef.current) {
      const s = Math.sin(clock.getElapsedTime() * 0.6);
      matRef.current.size = 0.055 + s * 0.02;
      matRef.current.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 0.5 + 1.2) * 0.15;
    }
  });
  return (
    <points geometry={geo}>
      <pointsMaterial ref={matRef} size={0.055} color="#ef4444" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function ExpandingRings() {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const data = useMemo(() => [
    { speed: 0.12, maxScale: 3.0, phase: 0 },
    { speed: 0.16, maxScale: 3.5, phase: 0.7 },
    { speed: 0.10, maxScale: 3.0, phase: 1.3 },
    { speed: 0.14, maxScale: 4.0, phase: 2.1 },
  ], []);

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        const d = data[i];
        const raw = (clock.getElapsedTime() * d.speed + d.phase) % 1;
        const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        const scale = 0.01 + t * d.maxScale;
        mesh.scale.setScalar(scale);
        mesh.position.y = -0.2;
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.18 * (1 - t);
      }
    });
  });

  return (
    <>
      {data.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.02, 0.06, 48]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function ScanLine() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const raw = (clock.getElapsedTime() * 0.12) % 1;
      const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      ref.current.position.y = -2.2 + t * 4.4;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.18;
    }
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[2.5, 2.5, 64]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function AnimatedLines() {
  const lines = useMemo(() => {
    return [...Array(12)].map(() => {
      const startLat = (Math.random() - 0.5) * Math.PI;
      const startLon = (Math.random() - 0.5) * Math.PI * 2;
      const endLat = (Math.random() - 0.5) * Math.PI;
      const endLon = (Math.random() - 0.5) * Math.PI * 2;
      const start = new THREE.Vector3().setFromSphericalCoords(2.05, startLat + Math.PI / 2, startLon);
      const end = new THREE.Vector3().setFromSphericalCoords(2.05, endLat + Math.PI / 2, endLon);
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(2.5 + Math.random() * 0.5);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      return { curve, points: curve.getPoints(24), start, end, color: Math.random() > 0.4 ? '#ef4444' : '#06b6d4' };
    });
  }, []);

  const lineRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    lines.forEach((line, i) => {
      if (lineRefs.current[i]) {
        const t = (clock.getElapsedTime() * 0.25 + 0.15 * (i % 6)) % 1;
        const smoothT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const pt = line.curve.getPoint(smoothT);
        lineRefs.current[i]!.position.copy(pt);
      }
    });
  });

  return (
    <>
      {lines.map((line, i) => (
        <group key={i}>
          <Line points={line.points} color={line.color} lineWidth={1} transparent opacity={0.35} />
          <mesh position={line.start}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={line.end}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        </group>
      ))}
      {lines.map((line, i) => (
        <mesh
          key={`trail-${i}`}
          ref={(el) => { lineRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.85} />
        </mesh>
      ))}
    </>
  );
}

const GlobeMesh = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Base Globe */}
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial color="#020617" transparent opacity={0.85} />
      </Sphere>

      {/* Glowing inner core */}
      <Sphere args={[1.98, 32, 32]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.04} />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[2.02, 32, 32]}>
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* Purple secondary wireframe */}
      <Sphere args={[2.04, 24, 24]}>
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.06} />
      </Sphere>

      {/* Atmospheric Glow */}
      <Sphere args={[2.4, 32, 32]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.04} side={THREE.BackSide} />
      </Sphere>

      {/* Outer aura */}
      <Sphere args={[2.8, 32, 32]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.015} side={THREE.BackSide} />
      </Sphere>

      <SurfaceGlowPoints />
      <AnimatedLines />
      <ExpandingRings />
      <OrbitParticles />
      <ScanLine />
    </group>
  );
};

export const CyberGlobe = () => {
  return (
    <div className="w-full h-full relative cursor-move">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <GlobeMesh />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
        <Preload all />
      </Canvas>
      <div className="absolute top-4 left-4 bg-cyber-dark/80 px-3 py-1 rounded text-xs text-neon-cyan border border-cyber-border backdrop-blur font-mono">
        GLOBAL.THREAT.MONITOR
      </div>
    </div>
  );
};
