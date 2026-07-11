import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, OrbitControls } from '@react-three/drei';
import { Vector3, BufferGeometry, BufferAttribute, MeshBasicMaterial, QuadraticBezierCurve3, DoubleSide, BackSide, Mesh, Points, PointsMaterial, TorusGeometry } from 'three';
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
  { id: 'gl9', lat: -23.5505, lng: -46.6333, type: 'Ransomware', severity: 'critical', time: '30 sec ago', location: 'Sao Paulo, BR' },
  { id: 'gl10', lat: 28.6139, lng: 77.209, type: 'Phishing', severity: 'high', time: '6 min ago', location: 'New Delhi, IN' },
  { id: 'gl11', lat: -1.2921, lng: 36.8219, type: 'Zero-Day', severity: 'critical', time: '4 min ago', location: 'Nairobi, KE' },
  { id: 'gl12', lat: 59.9139, lng: 10.7522, type: 'Supply Chain', severity: 'medium', time: '18 min ago', location: 'Oslo, NO' },
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

// Hex grid on globe surface
function HexGrid() {
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const verts: number[] = [];
    const radius = 2.005;
    const rings = 18;
    for (let i = 0; i < rings; i++) {
      const lat = (i / rings) * Math.PI - Math.PI / 2;
      const circumference = Math.cos(lat);
      const count = Math.max(4, Math.floor(circumference * 12));
      for (let j = 0; j < count; j++) {
        const lng = (j / count) * Math.PI * 2;
        const p = new Vector3(
          -radius * Math.cos(lat) * Math.cos(lng),
          radius * Math.sin(lat),
          radius * Math.cos(lat) * Math.sin(lng),
        );
        const offset = radius * 0.012;
        verts.push(p.x - offset, p.y, p.z, p.x + offset, p.y, p.z);
        verts.push(p.x, p.y - offset, p.z, p.x, p.y + offset, p.z);
      }
    }
    g.setAttribute('position', new BufferAttribute(new Float32Array(verts), 3));
    return g;
  }, []);

  const ref = useRef<Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as PointsMaterial).opacity = 0.15 + Math.sin(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.015} color="#06b6d4" transparent opacity={0.15} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Latitude/longitude grid lines
function LatLngLines() {
  const lines = useMemo(() => {
    const result: { points: Vector3[]; color: string }[] = [];
    const r = 2.002;
    // Latitude lines
    for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
      const points: Vector3[] = [];
      const phi = (90 - latDeg) * (Math.PI / 180);
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new Vector3(
          -r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ));
      }
      result.push({ points, color: '#06b6d4' });
    }
    // Longitude lines
    for (let lngDeg = 0; lngDeg < 360; lngDeg += 30) {
      const points: Vector3[] = [];
      const theta = (lngDeg + 180) * (Math.PI / 180);
      for (let i = 0; i <= 48; i++) {
        const phi = (i / 48) * Math.PI;
        points.push(new Vector3(
          -r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta),
        ));
      }
      result.push({ points, color: '#8b5cf6' });
    }
    return result;
  }, []);

  return (
    <>
      {lines.map((l, i) => (
        <Line key={i} points={l.points} color={l.color} lineWidth={0.5} transparent opacity={0.08} />
      ))}
    </>
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
  const beamRef = useRef<Mesh>(null);
  const outerRingRef = useRef<Mesh>(null);
  const offset = index * 0.4;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset;
    if (meshRef.current) {
      const pulse = 0.7 + Math.sin(t * 3) * 0.3;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 2.5) * 0.3);
      (meshRef.current.material as MeshBasicMaterial).opacity = pulse;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.6);
      (glowRef.current.material as MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 2) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 1.2;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.2);
      (ringRef.current.material as MeshBasicMaterial).opacity = 0.2 + Math.sin(t * 2.5) * 0.15;
    }
    if (beamRef.current) {
      const beamPulse = Math.sin(t * 1.5) * 0.5 + 0.5;
      beamRef.current.scale.y = 1 + beamPulse * 0.4;
      (beamRef.current.material as MeshBasicMaterial).opacity = 0.08 + beamPulse * 0.07;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.6;
      outerRingRef.current.rotation.x = Math.sin(t * 0.3) * 0.3;
      const ringPulse = Math.sin(t * 1.8) * 0.5 + 0.5;
      (outerRingRef.current.material as MeshBasicMaterial).opacity = 0.08 + ringPulse * 0.06;
      outerRingRef.current.scale.setScalar(1 + ringPulse * 0.15);
    }
  });

  const pos = useMemo(() => latLngToPosition(data.lat, data.lng, 2.05), [data.lat, data.lng]);
  const normal = useMemo(() => pos.clone().normalize(), [pos]);
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
      {/* Energy beam shooting outward */}
      <mesh ref={beamRef} position={normal.clone().multiplyScalar(0.15)}>
        <cylinderGeometry args={[0.005, 0.02, 0.5, 6]} />
        <meshBasicMaterial color={sevColor} transparent opacity={0.1} depthWrite={false} />
      </mesh>

      {/* Outer rotating ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[0.18, 0.2, 24]} />
        <meshBasicMaterial color={sevColor} transparent opacity={0.08} side={DoubleSide} depthWrite={false} />
      </mesh>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial color={sevColor} transparent opacity={0.12} depthWrite={false} />
      </mesh>

      {/* Spinning ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.14, 20]} />
        <meshBasicMaterial color={sevColor} transparent opacity={0.25} side={DoubleSide} depthWrite={false} />
      </mesh>

      {/* Core dot */}
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshBasicMaterial color={sevColor} transparent opacity={0.95} />
      </mesh>

      {/* Second inner glow */}
      <mesh>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="white" transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

function OrbitParticles() {
  const count = 80;
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const mix = Math.random();
      if (mix < 0.4) { colors[i * 3] = 0.024; colors[i * 3 + 1] = 0.714; colors[i * 3 + 2] = 0.831; }
      else if (mix < 0.7) { colors[i * 3] = 0.545; colors[i * 3 + 1] = 0.361; colors[i * 3 + 2] = 0.965; }
      else { colors[i * 3] = 1; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1; }
    }
    g.setAttribute('position', new BufferAttribute(pos, 3));
    g.setAttribute('color', new BufferAttribute(colors, 3));
    return g;
  }, []);
  const ref = useRef<Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.08;
      (ref.current.material as PointsMaterial).opacity = 0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.15;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// Inner dust cloud
function InnerDust() {
  const count = 60;
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.08 + Math.random() * 0.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute('position', new BufferAttribute(pos, 3));
    return g;
  }, []);
  const ref = useRef<Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = -clock.getElapsedTime() * 0.02;
      ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.01) * 0.05;
      (ref.current.material as PointsMaterial).size = 0.012 + Math.sin(clock.getElapsedTime() * 0.8) * 0.004;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.012} color="#06b6d4" transparent opacity={0.3} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function SurfaceGlowPoints() {
  const count = 18;
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
      matRef.current.size = 0.06 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02;
      matRef.current.opacity = 0.4 + Math.sin(clock.getElapsedTime() * 0.4 + 1.2) * 0.15;
    }
  });
  return (
    <points geometry={geo}>
      <pointsMaterial ref={matRef} size={0.06} color="#ef4444" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function ExpandingRings() {
  const refs = useRef<(Mesh | null)[]>([]);
  const data = useMemo(() => [
    { speed: 0.1, maxScale: 3.5, phase: 0 },
    { speed: 0.07, maxScale: 4.0, phase: 0.5 },
    { speed: 0.13, maxScale: 3.0, phase: 1.0 },
    { speed: 0.09, maxScale: 3.8, phase: 1.5 },
    { speed: 0.16, maxScale: 2.8, phase: 2.0 },
  ], []);

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        const d = data[i];
        const raw = (clock.getElapsedTime() * d.speed + d.phase) % 1;
        const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        mesh.scale.setScalar(0.01 + t * d.maxScale);
        mesh.position.y = -0.2;
        (mesh.material as MeshBasicMaterial).opacity = 0.15 * (1 - t);
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
          <ringGeometry args={[0.02, 0.04, 48]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} side={DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function ScanLine() {
  const ref = useRef<Mesh>(null);
  const ref2 = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const raw = (clock.getElapsedTime() * 0.06) % 1;
      const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      ref.current.position.y = -2.1 + t * 4.2;
      (ref.current.material as MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.25;
    }
    if (ref2.current) {
      const raw = ((clock.getElapsedTime() + 0.5) * 0.06) % 1;
      const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      ref2.current.position.y = -2.1 + t * 4.2;
      (ref2.current.material as MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.12;
    }
  });
  return (
    <>
      <mesh ref={ref}>
        <ringGeometry args={[2.05, 2.05, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0} side={DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={ref2}>
        <ringGeometry args={[2.08, 2.08, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0} side={DoubleSide} depthWrite={false} />
      </mesh>
    </>
  );
}

// Vertical light pillars from threat locations
function ThreatPillars() {
  const refs = useRef<(Mesh | null)[]>([]);
  const count = threatDotPositions.length;

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = clock.getElapsedTime() + i * 0.7;
      const data = threatDotPositions[i];
      const pos = latLngToPosition(data.lat, data.lng, 2.05);
      const dir = pos.clone().normalize();
      const pillarLen = 0.3 + Math.sin(t * 1.2) * 0.15;
      const offset = dir.clone().multiplyScalar(0.15 + pillarLen * 0.5);
      mesh.position.copy(pos).add(offset);
      mesh.lookAt(dir.clone().multiplyScalar(10));
      const pulse = Math.sin(t * 2) * 0.5 + 0.5;
      (mesh.material as MeshBasicMaterial).opacity = 0.03 + pulse * 0.04;
    });
  });

  return (
    <>
      {threatDotPositions.map((data, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
        >
          <cylinderGeometry args={[0.003, 0.015, 0.6, 4]} />
          <meshBasicMaterial
            color={data.severity === 'critical' ? '#ef4444' : data.severity === 'high' ? '#f97316' : '#eab308'}
            transparent
            opacity={0.05}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

function DataStreams() {
  const refs = useRef<(Mesh | null)[]>([]);
  const count = 6;
  const data = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      lat: (Math.random() - 0.5) * 140,
      lng: (Math.random() - 0.5) * 360,
      speed: 0.05 + Math.random() * 0.05,
      phase: i * 0.8,
    })),
  []);

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const d = data[i];
      const t = ((clock.getElapsedTime() * d.speed + d.phase) % 1);
      const pos = latLngToPosition(d.lat, d.lng, 2.02 + t * 0.8);
      mesh.position.copy(pos);
      (mesh.material as MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.6;
      mesh.scale.setScalar(0.02 + t * 0.06);
    });
  });

  return (
    <>
      {data.map((_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function AnimatedLines() {
  const lines = useMemo(() => {
    return [...Array(12)].map(() => {
      const startLat = (Math.random() - 0.5) * Math.PI;
      const startLon = (Math.random() - 0.5) * Math.PI * 2;
      const endLat = (Math.random() - 0.5) * Math.PI;
      const endLon = (Math.random() - 0.5) * Math.PI * 2;
      const start = new Vector3().setFromSphericalCoords(2.05, startLat + Math.PI / 2, startLon);
      const end = new Vector3().setFromSphericalCoords(2.05, endLat + Math.PI / 2, endLon);
      const mid = start.clone().lerp(end, 0.5).normalize().multiplyScalar(2.6 + Math.random() * 0.6);
      const curve = new QuadraticBezierCurve3(start, mid, end);
      const rand = Math.random();
      const color = rand > 0.6 ? '#ef4444' : rand > 0.3 ? '#06b6d4' : '#8b5cf6';
      return { curve, points: curve.getPoints(24), start, end, color };
    });
  }, []);

  const lineRefs = useRef<(Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    lines.forEach((line, i) => {
      if (lineRefs.current[i]) {
        const t = (clock.getElapsedTime() * 0.15 + 0.1 * (i % 12)) % 1;
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
          <Line points={line.points} color={line.color} lineWidth={1} transparent opacity={0.25} />
          <mesh position={line.start}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.6} />
          </mesh>
          <mesh position={line.end}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
      {lines.map((line, i) => (
        <mesh
          key={`trail-${i}`}
          ref={(el) => { lineRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color={line.color} transparent opacity={0.7} />
        </mesh>
      ))}
    </>
  );
}

// Rotating torus rings around globe
function OrbitalRings() {
  const ref1 = useRef<Mesh>(null);
  const ref2 = useRef<Mesh>(null);
  const ref3 = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref1.current) {
      ref1.current.rotation.z = t * 0.15;
      ref1.current.rotation.x = Math.PI / 3;
      (ref1.current.material as MeshBasicMaterial).opacity = 0.08 + Math.sin(t * 0.5) * 0.03;
    }
    if (ref2.current) {
      ref2.current.rotation.z = -t * 0.12;
      ref2.current.rotation.x = Math.PI / 2.5;
      ref2.current.rotation.y = t * 0.08;
      (ref2.current.material as MeshBasicMaterial).opacity = 0.06 + Math.sin(t * 0.4 + 1) * 0.03;
    }
    if (ref3.current) {
      ref3.current.rotation.z = t * 0.1;
      ref3.current.rotation.x = Math.PI / 1.8;
      ref3.current.rotation.y = -t * 0.06;
      (ref3.current.material as MeshBasicMaterial).opacity = 0.05 + Math.sin(t * 0.3 + 2) * 0.02;
    }
  });

  return (
    <>
      <mesh ref={ref1}>
        <torusGeometry args={[2.5, 0.008, 8, 128]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={ref2}>
        <torusGeometry args={[2.8, 0.005, 8, 128]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.06} depthWrite={false} />
      </mesh>
      <mesh ref={ref3}>
        <torusGeometry args={[3.1, 0.004, 8, 128]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.04} depthWrite={false} />
      </mesh>
    </>
  );
}

// Floating holographic ring segments
function HoloSegments() {
  const refs = useRef<(Mesh | null)[]>([]);
  const segments = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      radius: 2.3 + i * 0.15,
      arc: 0.3 + Math.random() * 0.6,
      speed: (0.1 + Math.random() * 0.15) * (i % 2 === 0 ? 1 : -1),
      offset: i * 1.2,
      color: i % 2 === 0 ? '#06b6d4' : '#8b5cf6',
    })),
  []);

  useFrame(({ clock }) => {
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = segments[i];
      const t = clock.getElapsedTime();
      mesh.rotation.z = t * s.speed + s.offset;
      (mesh.material as MeshBasicMaterial).opacity = 0.06 + Math.sin(t * 0.6 + s.offset) * 0.04;
    });
  });

  return (
    <>
      {segments.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => { refs.current[i] = el; }}
        >
          <torusGeometry args={[s.radius, 0.003, 4, 48, s.arc]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.06} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function GlobeMesh({ onDotClick }: { onDotClick: (dot: ThreatDotData) => void }) {
  const outerGlowRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerGlowRef.current) {
      const s = 1 + Math.sin(t * 0.3) * 0.03;
      outerGlowRef.current.scale.setScalar(s);
    }
    if (coreRef.current) {
      const pulse = 0.04 + Math.sin(t * 1.5) * 0.015;
      (coreRef.current.material as MeshBasicMaterial).opacity = pulse;
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05);
    }
  });

  return (
    <group>
      {/* Inner core glow */}
      <Sphere args={[1.5, 16, 16]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.02} side={BackSide} />
      </Sphere>
      <mesh ref={coreRef}>
        <Sphere args={[1.8, 12, 12]}>
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.04} side={BackSide} />
        </Sphere>
      </mesh>

      {/* Main dark sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshBasicMaterial color="#020617" transparent opacity={0.9} />
      </Sphere>

      {/* Inner glow layer */}
      <Sphere args={[1.98, 32, 32]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.06} />
      </Sphere>

      {/* Primary wireframe */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* Secondary wireframe (purple, different density) */}
      <Sphere args={[2.025, 20, 20]}>
        <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.07} />
      </Sphere>

      {/* Tertiary wireframe (blue, fine) */}
      <Sphere args={[2.04, 48, 48]}>
        <meshBasicMaterial color="#3b82f6" wireframe transparent opacity={0.03} />
      </Sphere>

      {/* Lat/lng lines */}
      <LatLngLines />

      {/* Hex grid overlay */}
      <HexGrid />

      {/* Atmosphere layers */}
      <mesh ref={outerGlowRef}>
        <Sphere args={[2.35, 32, 32]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.04} side={BackSide} />
        </Sphere>
      </mesh>
      <Sphere args={[2.5, 24, 24]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.025} side={BackSide} />
      </Sphere>
      <Sphere args={[2.8, 16, 16]}>
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.015} side={BackSide} />
      </Sphere>
      <Sphere args={[3.2, 12, 12]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.008} side={BackSide} />
      </Sphere>

      {/* Orbital torus rings */}
      <OrbitalRings />

      {/* Holographic segments */}
      <HoloSegments />

      <SurfaceGlowPoints />
      <AnimatedLines />
      <DataStreams />
      <ExpandingRings />
      <OrbitParticles />
      <InnerDust />
      <ThreatPillars />
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
      <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }}>
        <ambientLight intensity={0.3} />
        <GlobeMesh onDotClick={handleDotClick} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>

      {/* HUD overlays */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-cyber-dark/80 px-3 py-1 rounded text-xs text-neon-cyan border border-neon-cyan/30 backdrop-blur font-mono flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
          GLOBAL.THREAT.MONITOR
        </div>
        <div className="bg-cyber-dark/60 px-3 py-1 rounded text-[10px] text-gray-500 border border-cyber-border/50 backdrop-blur font-mono">
          LIVE &middot; {threatDotPositions.length} THREATS TRACKED
        </div>
      </div>

      <div className="absolute bottom-4 left-4 flex gap-3">
        {['critical', 'high', 'medium', 'low'].map(s => (
          <div key={s} className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_6px_${
              s === 'critical' ? 'rgba(239,68,68,0.6)' : s === 'high' ? 'rgba(249,115,22,0.6)' : s === 'medium' ? 'rgba(234,179,8,0.6)' : 'rgba(59,130,246,0.6)'
            }] ${
              s === 'critical' ? 'bg-red-500 animate-pulse' : s === 'high' ? 'bg-orange-500' : s === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </div>
        ))}
      </div>

      {/* Corner bracket decorations */}
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-neon-cyan/30" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-neon-cyan/30" />

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
