import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, OrbitControls } from '@react-three/drei';
import { Vector3, BufferGeometry, BufferAttribute, MeshBasicMaterial, QuadraticBezierCurve3, DoubleSide, BackSide, Mesh, Points, PointsMaterial } from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ThreatDotData {
  id: string;
  lat: number;
  lng: number;
  type: string;
  severity: string;
  time: string;
  location: string;
}

const threatDotPositions: ThreatDotData[] = [
  { id: 'gl1', lat: 40.7128, lng: -74.006, type: 'DDoS', severity: 'critical', time: '2 min ago', location: 'New York, US' },
  { id: 'gl2', lat: 51.5074, lng: -0.1278, type: 'Brute Force', severity: 'high', time: '8 min ago', location: 'London, UK' },
  { id: 'gl3', lat: 35.6762, lng: 139.6503, type: 'Port Scan', severity: 'medium', time: '15 min ago', location: 'Tokyo, JP' },
  { id: 'gl4', lat: -33.8688, lng: 151.2093, type: 'Malware', severity: 'critical', time: '1 min ago', location: 'Sydney, AU' },
  { id: 'gl5', lat: 1.3521, lng: 103.8198, type: 'Credential Theft', severity: 'high', time: '5 min ago', location: 'Singapore, SG' },
  { id: 'gl6', lat: 48.8566, lng: 2.3522, type: 'Data Scraping', severity: 'medium', time: '22 min ago', location: 'Paris, FR' },
  { id: 'gl7', lat: 55.7558, lng: 37.6173, type: 'APT Activity', severity: 'critical', time: '12 min ago', location: 'Moscow, RU' },
  { id: 'gl8', lat: 37.7749, lng: -122.4194, type: 'API Abuse', severity: 'high', time: '3 min ago', location: 'San Francisco, US' },
];

function latLngToPosition(lat: number, lng: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function ThreatDot({
  data,
  index,
  onDotClick,
}: {
  data: ThreatDotData;
  index: number;
  onDotClick: (dot: ThreatDotData) => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const offset = index * 0.4;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset;
    if (meshRef.current) {
      const pulse = 0.7 + Math.sin(t * 3) * 0.3;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2.5) * 0.2);
      (meshRef.current.material as MeshBasicMaterial).opacity = pulse;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.5);
      (glowRef.current.material as MeshBasicMaterial).opacity = 0.12 + Math.sin(t * 2) * 0.06;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.8;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.15);
      (ringRef.current.material as MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 2.5) * 0.1;
    }
  });

  const pos = useMemo(() => latLngToPosition(data.lat, data.lng, 2.05), [data.lat, data.lng]);
  const sevColor = data.severity === 'critical' ? '#ef4444'
    : data.severity === 'high' ? '#f97316'
    : data.severity === 'medium' ? '#eab308'
    : '#3b82f6';

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onDotClick(data);
  }, [data, onDotClick]);

  return (
    <group position={pos}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshBasicMaterial color={sevColor} transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.13, 16]} />
        <meshBasicMaterial color={sevColor} transparent opacity={0.2} side={DoubleSide} depthWrite={false} />
      </mesh>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={sevColor} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function OrbitParticles() {
  const count = 40;
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.6 + Math.random() * 1.4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 0.03 + 0.01;
    }
    g.setAttribute('position', new BufferAttribute(pos, 3));
    return g;
  }, []);
  const ref = useRef<Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.03;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.06;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.025} color="#06b6d4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function SurfaceGlowPoints() {
  const count = 12;
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.01;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute('position', new BufferAttribute(pos, 3));
    return g;
  }, []);
  const matRef = useRef<PointsMaterial>(null);
  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.size = 0.05 + Math.sin(clock.getElapsedTime() * 0.5) * 0.015;
      matRef.current.opacity = 0.45 + Math.sin(clock.getElapsedTime() * 0.4 + 1.2) * 0.15;
    }
  });
  return (
    <points geometry={geo}>
      <pointsMaterial ref={matRef} size={0.05} color="#ef4444" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function ExpandingRings() {
  const refs = useRef<(Mesh | null)[]>([]);
  const data = useMemo(() => [
    { speed: 0.12, maxScale: 2.8, phase: 0 },
    { speed: 0.08, maxScale: 3.2, phase: 0.7 },
    { speed: 0.15, maxScale: 2.5, phase: 1.4 },
  ], []);

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        const d = data[i];
        const raw = (clock.getElapsedTime() * d.speed + d.phase) % 1;
        const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        mesh.scale.setScalar(0.01 + t * d.maxScale);
        mesh.position.y = -0.2;
        (mesh.material as MeshBasicMaterial).opacity = 0.2 * (1 - t);
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
          <ringGeometry args={[0.02, 0.05, 32]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} side={DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function ScanLine() {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const raw = (clock.getElapsedTime() * 0.08) % 1;
      const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      ref.current.position.y = -2.1 + t * 4.2;
      (ref.current.material as MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.2;
    }
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[2.05, 2.05, 48]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0} side={DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function DataStreams() {
  const refs = useRef<(Mesh | null)[]>([]);
  const count = 3;
  const data = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      lat: (Math.random() - 0.5) * 120,
      lng: (Math.random() - 0.5) * 360,
      speed: 0.06 + Math.random() * 0.06,
      phase: i * 1.2,
    })),
  []);

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = data[i];
      const t = ((clock.getElapsedTime() * d.speed + d.phase) % 1);
      const pos = latLngToPosition(d.lat, d.lng, 2.02 + t * 0.6);
      mesh.position.copy(pos);
      (mesh.material as MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.5;
      mesh.scale.setScalar(0.03 + t * 0.04);
    });
  });

  return (
    <>
      {data.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function AnimatedLines() {
  const lines = useMemo(() => {
    return [...Array(8)].map(() => {
      const startLat = (Math.random() - 0.5) * Math.PI;
      const startLon = (Math.random() - 0.5) * Math.PI * 2;
      const endLat = (Math.random() - 0.5) * Math.PI;
      const endLon = (Math.random() - 0.5) * Math.PI * 2;
      const start = new Vector3().setFromSphericalCoords(2.05, startLat + Math.PI / 2, startLon);
      const end = new Vector3().setFromSphericalCoords(2.05, endLat + Math.PI / 2, endLon);
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(2.5 + Math.random() * 0.5);
      const curve = new QuadraticBezierCurve3(start, mid, end);
      const color = Math.random() > 0.5 ? '#ef4444' : '#06b6d4';
      return { curve, points: curve.getPoints(20), start, end, color };
    });
  }, []);

  const lineRefs = useRef<(Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    lines.forEach((line, i) => {
      if (lineRefs.current[i]) {
        const t = (clock.getElapsedTime() * 0.2 + 0.15 * (i % 8)) % 1;
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
          <Line points={line.points} color={line.color} lineWidth={1} transparent opacity={0.3} />
          <mesh position={line.start}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.7} />
          </mesh>
          <mesh position={line.end}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
      {lines.map((line, i) => (
        <mesh
          key={`trail-${i}`}
          ref={(el) => { lineRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
        </mesh>
      ))}
    </>
  );
}

function GlobeMesh({ onDotClick }: { onDotClick: (dot: ThreatDotData) => void }) {
  const outerGlowRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (outerGlowRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 0.3) * 0.02;
      outerGlowRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <Sphere args={[2, 48, 48]}>
        <meshBasicMaterial color="#020617" transparent opacity={0.88} />
      </Sphere>
      <Sphere args={[1.98, 24, 24]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.05} />
      </Sphere>
      <Sphere args={[2.01, 24, 24]}>
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.12} />
      </Sphere>
      <Sphere args={[2.03, 16, 16]}>
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.05} />
      </Sphere>
      <mesh ref={outerGlowRef}>
        <Sphere args={[2.3, 24, 24]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.035} side={BackSide} />
        </Sphere>
      </mesh>
      <Sphere args={[2.7, 16, 16]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.012} side={BackSide} />
      </Sphere>
      <SurfaceGlowPoints />
      <AnimatedLines />
      <DataStreams />
      <ExpandingRings />
      <OrbitParticles />
      <ScanLine />
      {threatDotPositions.map((dot, i) => (
        <ThreatDot key={dot.id} data={dot} index={i} onDotClick={onDotClick} />
      ))}
    </group>
  );
}

export const CyberGlobe = () => {
  const [selectedDot, setSelectedDot] = useState<ThreatDotData | null>(null);

  const handleDotClick = useCallback((dot: ThreatDotData) => {
    setSelectedDot(dot);
  }, []);

  const sevColor = selectedDot?.severity === 'critical' ? 'text-red-500'
    : selectedDot?.severity === 'high' ? 'text-orange-500'
    : selectedDot?.severity === 'medium' ? 'text-yellow-500'
    : 'text-blue-500';

  return (
    <div className="w-full h-full relative cursor-move">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <GlobeMesh onDotClick={handleDotClick} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
      <div className="absolute top-4 left-4 bg-cyber-dark/80 px-3 py-1 rounded text-xs text-neon-cyan border border-cyber-border backdrop-blur font-mono">
        GLOBAL.THREAT.MONITOR
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2">
        {['critical', 'high', 'medium', 'low'].map(s => (
          <div key={s} className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
            <div className={`w-1.5 h-1.5 rounded-full ${
              s === 'critical' ? 'bg-red-500' : s === 'high' ? 'bg-orange-500' : s === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedDot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedDot(null)}
            onKeyDown={e => { if (e.key === 'Escape') setSelectedDot(null); }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              className="glass-panel p-0 overflow-hidden max-w-sm w-full"
            >
              <div className="p-5 border-b border-cyber-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedDot.severity === 'critical' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                    : selectedDot.severity === 'high' ? 'bg-orange-500' : selectedDot.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <h3 className="text-lg font-bold text-white">Threat Detected</h3>
                </div>
                <button onClick={() => setSelectedDot(null)} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-mono">LOCATION</p>
                    <p className="text-lg font-bold text-white">{selectedDot.location}</p>
                  </div>
                  <span className={`text-xs font-bold ${sevColor} px-2 py-1 rounded-full bg-current/10`}>{selectedDot.severity.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-cyber-dark/40 border border-cyber-border/60">
                    <p className="text-[10px] text-gray-500 font-mono">THREAT TYPE</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{selectedDot.type}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-cyber-dark/40 border border-cyber-border/60">
                    <p className="text-[10px] text-gray-500 font-mono">DETECTED</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{selectedDot.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-cyber-dark border border-cyber-border text-gray-400 font-mono">
                    Lat: {selectedDot.lat.toFixed(2)}°
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-cyber-dark border border-cyber-border text-gray-400 font-mono">
                    Lng: {selectedDot.lng.toFixed(2)}°
                  </span>
                </div>
              </div>
              <div className="p-4 border-t border-cyber-border flex justify-end">
                <button onClick={() => setSelectedDot(null)} className="px-4 py-2 text-sm bg-neon-cyan/10 text-neon-cyan rounded-lg font-medium hover:bg-neon-cyan/20 transition-colors border border-neon-cyan/30">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
