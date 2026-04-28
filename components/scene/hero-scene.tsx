'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, MeshDistortMaterial, OrbitControls, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing';
import type { Project } from '@/content/projects';

type DisplayMode = 'editorial' | 'viz' | 'terminal';

type Pointer = {
  x: number;
  y: number;
};

function useScenePointer() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('pointermove', handleMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return pointer;
}

const modePalette: Record<
  DisplayMode,
  {
    primary: string;
    secondary: string;
    accent: string;
    frame: string;
    vignette: number;
    bloom: number;
  }
> = {
  editorial: {
    primary: '#f5cf8f',
    secondary: '#ff7b5f',
    accent: '#8fe6ff',
    frame: '#ffdca8',
    vignette: 0.98,
    bloom: 1.16,
  },
  viz: {
    primary: '#8fe6ff',
    secondary: '#93f2d0',
    accent: '#ffdca8',
    frame: '#8fe6ff',
    vignette: 0.95,
    bloom: 1.32,
  },
  terminal: {
    primary: '#93f2d0',
    secondary: '#a7e8ff',
    accent: '#f5cf8f',
    frame: '#93f2d0',
    vignette: 0.91,
    bloom: 1.02,
  },
};

function ProjectPanels({
  projects,
  activeSlug,
  pointer,
}: {
  projects: Project[];
  activeSlug?: string | null;
  pointer: RefObject<Pointer>;
}) {
  const group = useRef<THREE.Group>(null);
  const activeGlow = useRef<THREE.Mesh>(null);
  const connectors = useRef<THREE.Group>(null);
  const textures = useTexture(projects.map((project) => project.image));

  useFrame((state, delta) => {
    if (!group.current) return;
    const activeIndex = activeSlug ? projects.findIndex((project) => project.slug === activeSlug) : -1;
    const targetAngle = activeIndex >= 0 ? (activeIndex / Math.max(projects.length, 1)) * Math.PI * 2 : 0;
    const swayX = pointer.current.x * 0.14;
    const swayY = pointer.current.y * 0.1;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.clock.elapsedTime * 0.06 + targetAngle * 0.1 + swayX,
      0.03,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      (activeSlug ? 0.12 : Math.sin(state.clock.elapsedTime * 0.24) * 0.08) + swayY,
      0.03,
    );

    if (activeGlow.current) {
      activeGlow.current.rotation.z += delta * 0.12;
    }

    if (connectors.current) {
      connectors.current.rotation.y = THREE.MathUtils.lerp(connectors.current.rotation.y, state.clock.elapsedTime * 0.03, 0.02);
    }
  });

  return (
    <group>
      <group ref={connectors}>
        {projects.map((project, index) => {
          const angle = (index / projects.length) * Math.PI * 2;
          const radius = 3.9;
          const anchor: [number, number, number] = [
            Math.cos(angle) * radius,
            (index % 2 === 0 ? 1 : -1) * 0.68,
            Math.sin(angle) * radius - 1.4,
          ];
          const mid: [number, number, number] = [anchor[0] * 0.48, anchor[1] * 0.48, anchor[2] * 0.48];

          return (
            <group key={`${project.slug}-connector`}>
              <Line
                points={[[0, 0, 0], mid, anchor]}
                color={project.slug === activeSlug ? '#8fe6ff' : '#a7e8ff'}
                transparent
                opacity={project.slug === activeSlug ? 0.5 : 0.22}
                lineWidth={1}
              />
              <mesh position={mid}>
                <sphereGeometry args={[project.slug === activeSlug ? 0.08 : 0.055, 14, 14]} />
                <meshStandardMaterial
                  color={project.slug === activeSlug ? '#8fe6ff' : '#ffdca8'}
                  emissive={project.slug === activeSlug ? '#1d4059' : '#43301c'}
                  emissiveIntensity={1.2}
                  roughness={0.18}
                  metalness={0.84}
                />
              </mesh>
            </group>
          );
        })}
      </group>
      <group ref={group}>
      {projects.map((project, index) => {
        const angle = (index / projects.length) * Math.PI * 2;
        const radius = 3.9;
        const texture = textures[index];
        texture.colorSpace = THREE.SRGBColorSpace;
        const isActive = project.slug === activeSlug;

        return (
          <Float
            key={project.slug}
            speed={isActive ? 2.6 : 1.25 + index * 0.14}
            rotationIntensity={isActive ? 0.78 : 0.24}
            floatIntensity={isActive ? 1.65 : 1}
            position={[
              Math.cos(angle) * radius,
              (index % 2 === 0 ? 1 : -1) * 0.68,
              Math.sin(angle) * radius - 1.4,
            ]}
          >
            <mesh ref={isActive ? activeGlow : undefined} position={[0, 0, -0.22]} rotation={[0, angle + Math.PI, 0]}>
              <circleGeometry args={[1.25, 48]} />
              <meshBasicMaterial
                color={isActive ? '#8fe6ff' : '#6bb8ff'}
                transparent
                opacity={isActive ? 0.22 : 0.08}
              />
            </mesh>
            <mesh position={[0, 0, -0.14]} rotation={[0, angle + Math.PI, 0]}>
              <planeGeometry args={[2.36, 1.46]} />
              <meshBasicMaterial color="#08101a" transparent opacity={0.5} />
            </mesh>
            <mesh position={[0, 0, -0.06]} rotation={[0, angle + Math.PI, 0]}>
              <planeGeometry args={[2.46, 1.56]} />
              <meshBasicMaterial color={isActive ? '#8fe6ff' : '#ffdca8'} transparent opacity={0.08} />
            </mesh>
            <mesh rotation={[0, angle + Math.PI, 0]}>
              <planeGeometry args={[2.1, 1.28]} />
              <meshStandardMaterial
                map={texture}
                metalness={0.12}
                roughness={0.28}
                emissive={isActive ? '#1d2332' : '#000000'}
                emissiveIntensity={isActive ? 1 : 0}
              />
            </mesh>
            <mesh position={[0, 0, -0.03]} rotation={[0, angle + Math.PI, 0]}>
              <planeGeometry args={[2.22, 1.4]} />
              <meshPhysicalMaterial
                color={isActive ? '#fff1de' : '#efe4d0'}
                metalness={0.26}
                roughness={isActive ? 0.22 : 0.35}
                clearcoat={1}
                clearcoatRoughness={0.28}
                emissive={isActive ? '#24130f' : '#000000'}
                emissiveIntensity={isActive ? 0.75 : 0}
              />
            </mesh>
            <mesh position={[0, 0, 0.1]} rotation={[0, angle + Math.PI, 0]}>
              <boxGeometry args={[2.22, 1.4, 0.05]} />
              <meshStandardMaterial
                color={isActive ? '#101723' : '#0b121d'}
                metalness={0.45}
                roughness={0.46}
                emissive={isActive ? '#173246' : '#000000'}
                emissiveIntensity={isActive ? 0.4 : 0.12}
              />
            </mesh>
          </Float>
        );
      })}
      </group>
    </group>
  );
}

function CoreSculpture({ activeSlug, pointer }: { activeSlug?: string | null; pointer: RefObject<Pointer> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.18;
    mesh.current.rotation.y += delta * 0.28;

    if (halo.current) {
      halo.current.rotation.z += delta * 0.22;
      halo.current.scale.lerp(
        new THREE.Vector3(1 + Math.abs(pointer.current.x) * 0.06, 1 + Math.abs(pointer.current.y) * 0.06, 1),
        0.06,
      );
    }
  });

  return (
    <Float speed={2.1} rotationIntensity={0.42} floatIntensity={1.3}>
      <mesh ref={halo} position={[0, -0.1, -0.75]}>
        <torusGeometry args={[2.05, 0.1, 14, 100]} />
        <meshBasicMaterial color={activeSlug ? '#8fe6ff' : '#f5cf8f'} transparent opacity={0.24} />
      </mesh>
      <mesh ref={mesh} position={[0, 0.1, 0]}>
        <icosahedronGeometry args={[1.35, 8]} />
        <MeshDistortMaterial
          color={activeSlug ? '#ff7b5f' : '#f36a4f'}
          emissive="#4c1711"
          emissiveIntensity={activeSlug ? 1.1 : 0.85}
          roughness={0.18}
          metalness={0.56}
          distort={activeSlug ? 0.45 : 0.34}
          speed={activeSlug ? 2.8 : 2}
        />
      </mesh>
    </Float>
  );
}

function SignalOrbit({ activeSlug, pointer }: { activeSlug?: string | null; pointer: RefObject<Pointer> }) {
  const orbit = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const orbit2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (orbit.current) {
      orbit.current.rotation.z += delta * 0.22;
      orbit.current.rotation.x = THREE.MathUtils.lerp(
        orbit.current.rotation.x,
        pointer.current.y * 0.16 + (activeSlug ? 0.16 : 0.08),
        0.04,
      );
      orbit.current.rotation.y = THREE.MathUtils.lerp(
        orbit.current.rotation.y,
        -pointer.current.x * 0.22 + (activeSlug ? 0.24 : 0.12),
        0.04,
      );
    }

    if (ring.current) {
      ring.current.rotation.z += delta * (activeSlug ? 0.28 : 0.18);
      ring.current.scale.lerp(new THREE.Vector3(activeSlug ? 1.08 : 1, activeSlug ? 1.08 : 1, 1), 0.06);
    }

    if (orbit2.current) {
      orbit2.current.rotation.z -= delta * 0.14;
    }
  });

  return (
    <group ref={orbit} position={[0, -0.1, -0.5]}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.03, 18, 120]} />
        <meshStandardMaterial color={activeSlug ? '#8fe6ff' : '#6bb8ff'} emissive={activeSlug ? '#12354b' : '#091724'} emissiveIntensity={1.2} />
      </mesh>
      <mesh ref={orbit2} rotation={[Math.PI / 2, 0.55, 0]}>
        <torusGeometry args={[3.42, 0.015, 12, 140]} />
        <meshStandardMaterial color={activeSlug ? '#ffdca8' : '#f7d9a6'} emissive={activeSlug ? '#4a2d13' : '#24140c'} emissiveIntensity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <torusGeometry args={[1.9, 0.018, 12, 96]} />
        <meshStandardMaterial color={activeSlug ? '#d7ffe8' : '#bdebdc'} emissive={activeSlug ? '#174b33' : '#0b1e18'} emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.55, 3.72, 64]} />
        <meshBasicMaterial color="#a6c6ff" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.24, 2.34, 64]} />
        <meshBasicMaterial color={activeSlug ? '#8fe6ff' : '#f5cf8f'} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <ringGeometry args={[1.28, 1.41, 48]} />
        <meshBasicMaterial color={activeSlug ? '#93f2d0' : '#b9ffef'} transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DataSpokes({ activeSlug, pointer }: { activeSlug?: string | null; pointer: RefObject<Pointer> }) {
  const spokes = useRef<THREE.Group>(null);
  const shardA = useRef<THREE.Mesh>(null);
  const shardB = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!spokes.current) return;

    spokes.current.rotation.x = THREE.MathUtils.lerp(
      spokes.current.rotation.x,
      pointer.current.y * 0.1 + (activeSlug ? 0.18 : 0.08),
      0.03,
    );
    spokes.current.rotation.y = THREE.MathUtils.lerp(
      spokes.current.rotation.y,
      state.clock.elapsedTime * 0.07 - pointer.current.x * 0.12,
      0.03,
    );

    if (shardA.current) shardA.current.rotation.z += delta * 0.18;
    if (shardB.current) shardB.current.rotation.z -= delta * 0.16;
    if (shell.current) shell.current.rotation.y += delta * 0.04;
  });

  const pairs = [
    [-3.2, 1.45, -1.4],
    [3.35, 1.1, -1.2],
    [-3.05, -1.55, -1.3],
    [3.0, -1.35, -1.25],
  ] as const;

  return (
    <group ref={spokes} position={[0, 0.25, -1.4]}>
      <mesh ref={shell}>
        <dodecahedronGeometry args={[2.42, 1]} />
        <meshBasicMaterial color={activeSlug ? '#8fe6ff' : '#ffdca8'} transparent opacity={0.06} wireframe />
      </mesh>
      <mesh ref={shardA} position={[0, 1.8, 0.1]} rotation={[0.12, 0.18, 0.32]}>
        <boxGeometry args={[0.08, 2.8, 0.04]} />
        <meshBasicMaterial color={activeSlug ? '#8fe6ff' : '#93f2d0'} transparent opacity={0.38} />
      </mesh>
      <mesh ref={shardB} position={[0, -1.7, -0.1]} rotation={[-0.18, -0.06, -0.28]}>
        <boxGeometry args={[0.06, 2.45, 0.04]} />
        <meshBasicMaterial color={activeSlug ? '#ffdca8' : '#f5cf8f'} transparent opacity={0.28} />
      </mesh>
      {pairs.map((position, index) => (
        <group key={position.join(':')} position={position}>
          <mesh>
            <sphereGeometry args={[0.09 + index * 0.01, 14, 14]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? '#8fe6ff' : '#ffdca8'}
              emissive={index % 2 === 0 ? '#15324a' : '#47311b'}
              emissiveIntensity={1.2}
              roughness={0.24}
              metalness={0.76}
            />
          </mesh>
          <mesh position={[0, 0, -0.07]}>
            <ringGeometry args={[0.2, 0.29, 24]} />
            <meshBasicMaterial color={index % 2 === 0 ? '#93f2d0' : '#8fe6ff'} transparent opacity={0.18} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ScanBeam({ displayMode, activeSlug }: { displayMode: DisplayMode; activeSlug?: string | null }) {
  const beam = useRef<THREE.Mesh>(null);
  const sheen = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (beam.current) {
      beam.current.position.x = Math.sin(state.clock.elapsedTime * 0.42) * 4.4;
      beam.current.position.y = Math.cos(state.clock.elapsedTime * 0.24) * 0.55;
      beam.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.18) * 0.06;
    }

    if (sheen.current) {
      sheen.current.rotation.z += delta * (activeSlug ? 0.18 : 0.1);
      sheen.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
    }
  });

  return (
    <group position={[0, 0.2, -1.05]}>
      <mesh ref={beam} position={[-4.4, 0, 0.02]} rotation={[0, 0, 0.28]}>
        <boxGeometry args={[0.08, 6.1, 0.02]} />
        <meshBasicMaterial color={displayMode === 'terminal' ? '#93f2d0' : '#8fe6ff'} transparent opacity={0.08} />
      </mesh>
      <mesh ref={sheen} position={[0, 0, -0.15]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[8.8, 0.08]} />
        <meshBasicMaterial color={displayMode === 'viz' ? '#8fe6ff' : '#ffdca8'} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function CoderRoom({ displayMode, pointer }: { displayMode: DisplayMode; pointer: RefObject<Pointer> }) {
  const room = useRef<THREE.Group>(null);
  const coder = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Mesh>(null);
  const armR = useRef<THREE.Mesh>(null);
  const handL = useRef<THREE.Mesh>(null);
  const handR = useRef<THREE.Mesh>(null);
  const monitor = useRef<THREE.Mesh>(null);
  const keys = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (room.current) {
      room.current.rotation.y = THREE.MathUtils.lerp(room.current.rotation.y, pointer.current.x * 0.08, 0.03);
      room.current.rotation.x = THREE.MathUtils.lerp(room.current.rotation.x, pointer.current.y * 0.04, 0.03);
    }

    if (coder.current) {
      coder.current.position.y = Math.sin(state.clock.elapsedTime * 2.4) * 0.03;
    }

    const typingPulse = 0.08 + Math.sin(state.clock.elapsedTime * 10) * 0.03;
    if (armL.current) {
      armL.current.rotation.z = THREE.MathUtils.lerp(armL.current.rotation.z, -0.95 + typingPulse, 0.08);
    }
    if (armR.current) {
      armR.current.rotation.z = THREE.MathUtils.lerp(armR.current.rotation.z, 0.86 - typingPulse, 0.08);
    }
    if (handL.current) {
      handL.current.rotation.x = Math.sin(state.clock.elapsedTime * 9) * 0.18;
    }
    if (handR.current) {
      handR.current.rotation.x = Math.cos(state.clock.elapsedTime * 8.5) * 0.18;
    }
    if (monitor.current) {
      monitor.current.rotation.y = THREE.MathUtils.lerp(monitor.current.rotation.y, pointer.current.x * 0.06, 0.03);
      monitor.current.rotation.x = THREE.MathUtils.lerp(monitor.current.rotation.x, -0.05 + pointer.current.y * 0.02, 0.03);
    }
    if (keys.current) {
      keys.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.scale.y = 1 + Math.abs(Math.sin(state.clock.elapsedTime * 8 + index * 0.5)) * 0.16;
        }
      });
    }
  });

  const keyRows = [
    [-0.84, -0.92, 0.02],
    [-0.66, -0.92, 0.02],
    [-0.48, -0.92, 0.02],
    [-0.3, -0.92, 0.02],
    [-0.12, -0.92, 0.02],
    [0.06, -0.92, 0.02],
    [0.24, -0.92, 0.02],
    [0.42, -0.92, 0.02],
    [0.6, -0.92, 0.02],
    [-0.84, -1.1, 0.02],
    [-0.66, -1.1, 0.02],
    [-0.48, -1.1, 0.02],
    [-0.3, -1.1, 0.02],
    [-0.12, -1.1, 0.02],
    [0.06, -1.1, 0.02],
    [0.24, -1.1, 0.02],
    [0.42, -1.1, 0.02],
    [0.6, -1.1, 0.02],
  ] as const;

  return (
    <group ref={room} position={[0, -0.15, -0.9]}>
      <mesh position={[0, -1.95, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[11, 9, 1, 1]} />
        <meshStandardMaterial color={displayMode === 'terminal' ? '#0b1520' : '#121826'} roughness={0.95} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.8, -4.1]}>
        <planeGeometry args={[11, 6.4]} />
        <meshStandardMaterial color={displayMode === 'viz' ? '#101c30' : '#0b1220'} roughness={0.92} metalness={0.04} />
      </mesh>
      <mesh position={[-5.2, 0.4, -1.9]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6.2, 4.9]} />
        <meshStandardMaterial color="#0d1524" roughness={0.96} metalness={0.04} />
      </mesh>
      <mesh position={[5.2, 0.4, -1.9]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6.2, 4.9]} />
        <meshStandardMaterial color="#0d1524" roughness={0.96} metalness={0.04} />
      </mesh>

      <mesh position={[0, -1.0, -0.2]}>
        <boxGeometry args={[5.8, 0.16, 2.6]} />
        <meshStandardMaterial color={displayMode === 'terminal' ? '#152634' : '#1b2331'} roughness={0.78} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.8, -0.95]}>
        <boxGeometry args={[4.4, 1.0, 0.22]} />
        <meshStandardMaterial color="#121922" roughness={0.68} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.06, -0.92]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[2.6, 1.64, 0.14]} />
        <meshStandardMaterial color="#10161f" roughness={0.28} metalness={0.32} emissive={displayMode === 'viz' ? '#10324f' : '#0a1118'} emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={monitor} position={[0, 0.1, -0.82]} rotation={[0, 0, -0.02]}>
        <boxGeometry args={[2.32, 1.36, 0.05]} />
        <meshStandardMaterial color={displayMode === 'viz' ? '#8fe6ff' : '#93f2d0'} emissive={displayMode === 'terminal' ? '#0e2a20' : '#0d2539'} emissiveIntensity={1.6} roughness={0.1} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.1, -0.79]} rotation={[0, 0, -0.02]}>
        <planeGeometry args={[2.06, 1.08]} />
        <meshBasicMaterial color={displayMode === 'terminal' ? '#08130f' : '#09111a'} transparent opacity={0.9} />
      </mesh>
      <group position={[0, 0.12, -0.775]} rotation={[0, 0, -0.02]}>
        <mesh position={[-0.7, 0.28, 0.01]}>
          <boxGeometry args={[0.86, 0.06, 0.02]} />
          <meshBasicMaterial color="#8fe6ff" transparent opacity={0.92} />
        </mesh>
        <mesh position={[-0.5, 0.12, 0.01]}>
          <boxGeometry args={[0.66, 0.05, 0.02]} />
          <meshBasicMaterial color="#93f2d0" transparent opacity={0.86} />
        </mesh>
        <mesh position={[-0.22, -0.04, 0.01]}>
          <boxGeometry args={[0.24, 0.04, 0.02]} />
          <meshBasicMaterial color="#ffdca8" transparent opacity={0.84} />
        </mesh>
        <mesh position={[0.15, -0.04, 0.01]}>
          <boxGeometry args={[0.46, 0.04, 0.02]} />
          <meshBasicMaterial color="#8fe6ff" transparent opacity={0.5} />
        </mesh>
      </group>
      <mesh position={[0, -0.82, -0.74]}>
        <boxGeometry args={[1.62, 0.1, 0.6]} />
        <meshStandardMaterial color="#151d28" roughness={0.72} metalness={0.22} />
      </mesh>
      <group ref={keys} position={[0, -1.0, -0.58]}>
        {keyRows.map((position, index) => (
          <mesh key={position.join(':')} position={position}>
            <boxGeometry args={[0.12, 0.08, 0.04]} />
            <meshStandardMaterial
              color={index % 3 === 0 ? '#8fe6ff' : index % 3 === 1 ? '#93f2d0' : '#f5cf8f'}
              emissive={index % 3 === 0 ? '#0f2c40' : index % 3 === 1 ? '#123f36' : '#413018'}
              emissiveIntensity={0.66}
              roughness={0.24}
              metalness={0.44}
            />
          </mesh>
        ))}
      </group>
      <mesh position={[0, -1.24, -0.62]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.84, 0.1, 0.76]} />
        <meshStandardMaterial color="#111722" roughness={0.65} metalness={0.2} />
      </mesh>

      <group ref={coder} position={[0, -0.18, -0.56]}>
        <group position={[0, 1.16, 0.03]}>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.47, 28, 28]} />
            <meshStandardMaterial color="#d4a581" roughness={0.58} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.03, 0.1]}>
            <boxGeometry args={[0.54, 0.58, 0.44]} />
            <meshStandardMaterial color="#d4a581" roughness={0.58} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.15, 0.03]}>
            <boxGeometry args={[0.34, 0.2, 0.24]} />
            <meshStandardMaterial color="#dcae8c" roughness={0.46} metalness={0.04} />
          </mesh>
          <mesh position={[-0.33, 0.02, 0.02]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#d19a74" roughness={0.52} metalness={0.04} />
          </mesh>
          <mesh position={[0.33, 0.02, 0.02]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#d19a74" roughness={0.52} metalness={0.04} />
          </mesh>
          <mesh position={[-0.12, -0.05, 0.39]} rotation={[0.16, 0, 0.04]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#0a1116" />
          </mesh>
          <mesh position={[0.12, -0.05, 0.39]} rotation={[0.16, 0, -0.04]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#0a1116" />
          </mesh>
          <mesh position={[-0.12, -0.13, 0.4]}>
            <boxGeometry args={[0.12, 0.03, 0.02]} />
            <meshBasicMaterial color="#11161b" />
          </mesh>
          <mesh position={[0.12, -0.13, 0.4]}>
            <boxGeometry args={[0.12, 0.03, 0.02]} />
            <meshBasicMaterial color="#11161b" />
          </mesh>
          <mesh position={[0, -0.02, 0.43]}>
            <boxGeometry args={[0.08, 0.14, 0.03]} />
            <meshBasicMaterial color="#c08d68" />
          </mesh>
          <mesh position={[0, -0.23, 0.42]}>
            <boxGeometry args={[0.12, 0.04, 0.02]} />
            <meshBasicMaterial color="#6b3f33" />
          </mesh>
          <mesh position={[0, -0.28, 0.4]}>
            <torusGeometry args={[0.16, 0.02, 10, 20]} />
            <meshBasicMaterial color="#6b3f33" />
          </mesh>

          <group position={[0, 0.35, -0.02]}>
            <mesh position={[0, 0.18, -0.02]}>
              <boxGeometry args={[0.62, 0.14, 0.5]} />
              <meshStandardMaterial color="#1a1f25" roughness={0.9} metalness={0.06} />
            </mesh>
            {[
              [-0.2, 0.17, 0.2, 0.14, 0.54],
              [0.0, 0.25, 0.24, 0.12, 0.66],
              [0.18, 0.18, 0.22, 0.12, 0.52],
              [-0.3, 0.06, 0.18, 0.1, 0.38],
              [0.3, 0.07, 0.18, 0.1, 0.42],
              [-0.1, 0.3, 0.24, 0.11, 0.72],
              [0.12, 0.31, 0.23, 0.1, 0.75],
              [0.28, 0.28, 0.18, 0.09, 0.64],
              [-0.38, 0.12, 0.2, 0.09, 0.46],
              [0.4, 0.13, 0.18, 0.09, 0.44],
            ].map(([x, y, sx, sy, z], index) => (
              <mesh key={`hair-${index}`} position={[x, y, 0.02]} rotation={[0.2, 0, x > 0 ? 0.32 : -0.32]}>
                <boxGeometry args={[sx, sy, z]} />
                <meshStandardMaterial color="#060707" roughness={0.95} metalness={0.02} />
              </mesh>
            ))}
            <mesh position={[0, 0.02, -0.03]}>
              <cylinderGeometry args={[0.33, 0.4, 0.34, 14]} />
              <meshStandardMaterial color="#223040" roughness={0.82} metalness={0.07} />
            </mesh>
          </group>
        </group>

        <mesh position={[0, 0.84, -0.02]}>
          <boxGeometry args={[0.48, 0.86, 0.34]} />
          <meshStandardMaterial color="#cfe6ef" roughness={0.72} metalness={0.06} />
        </mesh>
        <mesh position={[0, 0.55, -0.01]}>
          <boxGeometry args={[0.68, 0.58, 0.42]} />
          <meshStandardMaterial color="#bfdde8" roughness={0.78} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.9, -0.02]}>
          <torusGeometry args={[0.24, 0.06, 12, 28]} />
          <meshStandardMaterial color="#d6edf4" roughness={0.82} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.88, -0.01]}>
          <torusGeometry args={[0.31, 0.06, 12, 28]} />
          <meshStandardMaterial color="#a9d7e7" roughness={0.8} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.28, -0.01]}>
          <boxGeometry args={[0.8, 0.42, 0.5]} />
          <meshStandardMaterial color="#b8d9e4" roughness={0.82} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.02, 0.02]}>
          <boxGeometry args={[0.58, 0.2, 0.4]} />
          <meshStandardMaterial color="#e6f3f7" roughness={0.88} metalness={0.03} />
        </mesh>
        <mesh position={[0, -0.2, 0.01]}>
          <cylinderGeometry args={[0.17, 0.22, 1.0, 14]} />
          <meshStandardMaterial color="#c9a07d" roughness={0.5} metalness={0.06} />
        </mesh>
        <mesh position={[0, -0.2, 0.11]}>
          <cylinderGeometry args={[0.17, 0.2, 0.96, 14]} />
          <meshStandardMaterial color="#d4a581" roughness={0.58} metalness={0.04} />
        </mesh>
        <mesh ref={armL} position={[-0.36, 0.2, 0.03]} rotation={[0, 0, -1.18]}>
          <cylinderGeometry args={[0.07, 0.06, 0.96, 12]} />
          <meshStandardMaterial color="#cfe6ef" roughness={0.78} metalness={0.04} />
        </mesh>
        <mesh ref={armR} position={[0.36, 0.24, 0.03]} rotation={[0, 0, 1.08]}>
          <cylinderGeometry args={[0.07, 0.06, 0.96, 12]} />
          <meshStandardMaterial color="#cfe6ef" roughness={0.78} metalness={0.04} />
        </mesh>
        <mesh ref={handL} position={[-0.76, -0.04, 0.04]} rotation={[0, 0.18, 0]}>
          <sphereGeometry args={[0.085, 14, 14]} />
          <meshStandardMaterial color="#c98f69" roughness={0.44} metalness={0.04} />
        </mesh>
        <mesh ref={handR} position={[0.76, -0.08, 0.05]} rotation={[0, -0.12, 0]}>
          <sphereGeometry args={[0.085, 14, 14]} />
          <meshStandardMaterial color="#c98f69" roughness={0.44} metalness={0.04} />
        </mesh>
        <mesh position={[0, -0.9, -0.03]}>
          <cylinderGeometry args={[0.22, 0.26, 1.0, 14]} />
          <meshStandardMaterial color="#1d2430" roughness={0.82} metalness={0.08} />
        </mesh>
        <mesh position={[-0.16, -1.02, 0.02]} rotation={[0, 0, -0.22]}>
          <cylinderGeometry args={[0.08, 0.1, 1.0, 12]} />
          <meshStandardMaterial color="#1f2831" roughness={0.88} metalness={0.06} />
        </mesh>
        <mesh position={[0.16, -1.02, 0.02]} rotation={[0, 0, 0.22]}>
          <cylinderGeometry args={[0.08, 0.1, 1.0, 12]} />
          <meshStandardMaterial color="#1f2831" roughness={0.88} metalness={0.06} />
        </mesh>
        <mesh position={[-0.44, -1.18, 0.02]} rotation={[0, 0, -0.26]}>
          <cylinderGeometry args={[0.08, 0.08, 0.88, 12]} />
          <meshStandardMaterial color="#202833" roughness={0.88} metalness={0.06} />
        </mesh>
        <mesh position={[0.44, -1.18, 0.02]} rotation={[0, 0, 0.26]}>
          <cylinderGeometry args={[0.08, 0.08, 0.88, 12]} />
          <meshStandardMaterial color="#202833" roughness={0.88} metalness={0.06} />
        </mesh>
        <mesh position={[0, -1.56, 0.06]}>
          <torusGeometry args={[0.8, 0.08, 12, 28]} />
          <meshStandardMaterial color="#111820" roughness={0.92} metalness={0.04} />
        </mesh>
      </group>

      <mesh position={[0, 1.0, -3.8]}>
        <planeGeometry args={[5.6, 2.4]} />
        <meshBasicMaterial color={displayMode === 'viz' ? '#8fe6ff' : '#ffdca8'} transparent opacity={0.08} />
      </mesh>
      <mesh position={[-3.8, 0.55, -2.7]} rotation={[0, Math.PI / 8, 0]}>
        <boxGeometry args={[0.16, 0.92, 0.14]} />
        <meshStandardMaterial color={displayMode === 'terminal' ? '#93f2d0' : '#8fe6ff'} emissive={displayMode === 'terminal' ? '#103b2b' : '#12314a'} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[3.7, 0.4, -2.5]} rotation={[0, -Math.PI / 7, 0]}>
        <boxGeometry args={[0.18, 1.02, 0.14]} />
        <meshStandardMaterial color="#f5cf8f" emissive="#3d2c16" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

type RoomSpec = {
  id: string;
  label: string;
  kind: 'code' | 'notes' | 'review';
  accent: string;
  glow: string;
  x: number;
};

function RoomPod({ room, active }: { room: RoomSpec; active: boolean }) {
  const sign = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const screen = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (sign.current) {
      sign.current.rotation.y = THREE.MathUtils.lerp(sign.current.rotation.y, active ? 0.08 : -0.12, 0.04);
      sign.current.position.y = 1.7 + Math.sin(state.clock.elapsedTime * 1.5 + room.x * 0.1) * 0.05;
    }
    if (glow.current) {
      glow.current.rotation.z += delta * (active ? 0.16 : 0.08);
    }
    if (screen.current) {
      screen.current.rotation.y = THREE.MathUtils.lerp(screen.current.rotation.y, active ? 0.02 : -0.04, 0.04);
    }
  });

  return (
    <group position={[room.x, -0.15, -0.9]}>
      <mesh position={[0, -1.95, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.8, 9, 1, 1]} />
        <meshStandardMaterial color={active ? '#121a2a' : '#0e1520'} roughness={0.95} metalness={0.04} />
      </mesh>
      <mesh position={[0, 1.8, -4.1]}>
        <planeGeometry args={[5.8, 6.4]} />
        <meshStandardMaterial color={room.kind === 'notes' ? '#151b28' : '#0b1220'} roughness={0.92} metalness={0.04} />
      </mesh>
      <mesh position={[-2.9, 0.4, -1.9]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6.2, 4.9]} />
        <meshStandardMaterial color="#0d1524" roughness={0.96} metalness={0.04} />
      </mesh>
      <mesh position={[2.9, 0.4, -1.9]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6.2, 4.9]} />
        <meshStandardMaterial color="#0d1524" roughness={0.96} metalness={0.04} />
      </mesh>

      <mesh ref={glow} position={[0, 0.1, -0.95]}>
        <torusGeometry args={[1.65, 0.08, 16, 72]} />
        <meshBasicMaterial color={room.glow} transparent opacity={active ? 0.28 : 0.12} />
      </mesh>
      <mesh position={[0, -1.0, -0.2]}>
        <boxGeometry args={[4.8, 0.16, 2.6]} />
        <meshStandardMaterial color={active ? '#1b2331' : '#171e29'} roughness={0.8} metalness={0.08} />
      </mesh>

      <mesh position={[0, 0.04, -0.88]}>
        <boxGeometry args={[2.12, 1.28, 0.06]} />
        <meshStandardMaterial color="#10161f" roughness={0.3} metalness={0.3} emissive={room.glow} emissiveIntensity={0.45} />
      </mesh>
      <mesh ref={screen} position={[0, 0.06, -0.84]}>
        <planeGeometry args={[1.92, 1.04]} />
        <meshBasicMaterial color={room.glow} transparent opacity={0.9} />
      </mesh>

      {room.kind === 'code' ? (
        <group position={[0, 0.12, -0.79]}>
          <mesh position={[-0.52, 0.24, 0]}>
            <boxGeometry args={[0.82, 0.06, 0.02]} />
            <meshBasicMaterial color="#8fe6ff" transparent opacity={0.85} />
          </mesh>
          <mesh position={[-0.28, 0.08, 0]}>
            <boxGeometry args={[0.56, 0.05, 0.02]} />
            <meshBasicMaterial color="#93f2d0" transparent opacity={0.72} />
          </mesh>
          <mesh position={[0.1, -0.08, 0]}>
            <boxGeometry args={[0.34, 0.05, 0.02]} />
            <meshBasicMaterial color="#f5cf8f" transparent opacity={0.68} />
          </mesh>
        </group>
      ) : null}

      {room.kind === 'notes' ? (
        <group position={[0, 0.18, -0.76]}>
          <mesh position={[-0.55, 0.2, 0.02]} rotation={[0, 0, -0.16]}>
            <boxGeometry args={[0.76, 0.5, 0.02]} />
            <meshBasicMaterial color="#f5cf8f" transparent opacity={0.86} />
          </mesh>
          <mesh position={[0.42, 0.28, 0.02]} rotation={[0, 0, 0.08]}>
            <cylinderGeometry args={[0.06, 0.08, 0.42, 12]} />
            <meshStandardMaterial color="#ffdca8" roughness={0.52} metalness={0.04} />
          </mesh>
          <mesh position={[0.42, 0.54, 0.02]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshBasicMaterial color="#ffdca8" />
          </mesh>
          <mesh position={[0, -0.08, 0.02]}>
            <boxGeometry args={[0.98, 0.14, 0.02]} />
            <meshBasicMaterial color="#8fe6ff" transparent opacity={0.24} />
          </mesh>
        </group>
      ) : null}

      {room.kind === 'review' ? (
        <group position={[0, 0.1, -0.76]}>
          <mesh position={[-0.55, 0.22, 0.02]}>
            <boxGeometry args={[0.42, 0.42, 0.02]} />
            <meshBasicMaterial color="#8fe6ff" transparent opacity={0.86} />
          </mesh>
          <mesh position={[-0.05, 0.16, 0.02]}>
            <boxGeometry args={[0.42, 0.42, 0.02]} />
            <meshBasicMaterial color="#93f2d0" transparent opacity={0.76} />
          </mesh>
          <mesh position={[0.45, 0.1, 0.02]}>
            <boxGeometry args={[0.42, 0.42, 0.02]} />
            <meshBasicMaterial color="#f5cf8f" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0.08, -0.18, 0.02]}>
            <boxGeometry args={[1.02, 0.08, 0.02]} />
            <meshBasicMaterial color={room.glow} transparent opacity={0.3} />
          </mesh>
        </group>
      ) : null}

      <mesh position={[0, -0.88, -0.72]}>
        <boxGeometry args={[1.6, 0.1, 0.58]} />
        <meshStandardMaterial color="#141a24" roughness={0.7} metalness={0.18} />
      </mesh>
      <mesh position={[0, -1.2, -0.62]}>
        <boxGeometry args={[1.8, 0.08, 0.7]} />
        <meshStandardMaterial color="#111820" roughness={0.85} metalness={0.06} />
      </mesh>
      <mesh position={[0, 1.72, -0.2]} ref={sign}>
        <boxGeometry args={[1.3, 0.28, 0.06]} />
        <meshStandardMaterial color={room.accent} emissive={room.glow} emissiveIntensity={1.05} roughness={0.3} metalness={0.18} />
      </mesh>
      <mesh position={[0, 1.72, -0.16]}>
        <boxGeometry args={[1.06, 0.12, 0.02]} />
        <meshBasicMaterial color="#07111f" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 1.92, -0.15]}>
        <boxGeometry args={[0.66, 0.05, 0.02]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.78} />
      </mesh>
    </group>
  );
}

function MultiRoomStudio({ displayMode, pointer }: { displayMode: DisplayMode; pointer: RefObject<Pointer> }) {
  const stage = useRef<THREE.Group>(null);
  const avatar = useRef<THREE.Group>(null);
  const chair = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Mesh>(null);
  const armR = useRef<THREE.Mesh>(null);
  const handL = useRef<THREE.Mesh>(null);
  const handR = useRef<THREE.Mesh>(null);
  const monitor = useRef<THREE.Mesh>(null);
  const keys = useRef<THREE.Group>(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const targetIndex = useRef(0);
  const idleClock = useRef(0);

  const rooms = useMemo<RoomSpec[]>(
    () => [
      { id: 'code', label: 'Code Room', kind: 'code', accent: '#8fe6ff', glow: '#73d5ff', x: -7.4 },
      { id: 'notes', label: 'Notes Room', kind: 'notes', accent: '#f5cf8f', glow: '#ffdca8', x: 0 },
      { id: 'review', label: 'Review Room', kind: 'review', accent: '#93f2d0', glow: '#93f2d0', x: 7.4 },
    ],
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        const nextIndex = (targetIndex.current - 1 + rooms.length) % rooms.length;
        targetIndex.current = nextIndex;
        setActiveRoomIndex(nextIndex);
        idleClock.current = 0;
      }
      if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        const nextIndex = (targetIndex.current + 1) % rooms.length;
        targetIndex.current = nextIndex;
        setActiveRoomIndex(nextIndex);
        idleClock.current = 0;
      }
      if (event.key === '1') {
        targetIndex.current = 0;
        setActiveRoomIndex(0);
        idleClock.current = 0;
      }
      if (event.key === '2') {
        targetIndex.current = 1;
        setActiveRoomIndex(1);
        idleClock.current = 0;
      }
      if (event.key === '3') {
        targetIndex.current = 2;
        setActiveRoomIndex(2);
        idleClock.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rooms.length]);

  useFrame((state, delta) => {
    idleClock.current += delta;
    if (idleClock.current > 7) {
      const nextIndex = (targetIndex.current + 1) % rooms.length;
      targetIndex.current = nextIndex;
      setActiveRoomIndex(nextIndex);
      idleClock.current = 0;
    }

    const activeRoom = rooms[activeRoomIndex];
    const targetX = activeRoom.x;

    if (stage.current) {
      stage.current.position.x = THREE.MathUtils.lerp(stage.current.position.x, targetX * 0.08, 0.03);
      stage.current.rotation.y = THREE.MathUtils.lerp(stage.current.rotation.y, pointer.current.x * 0.06, 0.03);
      stage.current.rotation.x = THREE.MathUtils.lerp(stage.current.rotation.x, pointer.current.y * 0.025, 0.03);
    }

    if (avatar.current) {
      avatar.current.position.x = THREE.MathUtils.lerp(avatar.current.position.x, targetX, 0.06);
      avatar.current.position.y = THREE.MathUtils.lerp(avatar.current.position.y, -0.18 + Math.sin(state.clock.elapsedTime * 2.2) * 0.02, 0.08);
    }

    if (chair.current) {
      chair.current.position.x = THREE.MathUtils.lerp(chair.current.position.x, targetX, 0.06);
      chair.current.rotation.y = THREE.MathUtils.lerp(chair.current.rotation.y, pointer.current.x * 0.12, 0.04);
    }

    const typingPulse = 0.08 + Math.sin(state.clock.elapsedTime * 10) * 0.03;
    if (armL.current) {
      armL.current.rotation.z = THREE.MathUtils.lerp(armL.current.rotation.z, -0.95 + typingPulse, 0.08);
    }
    if (armR.current) {
      armR.current.rotation.z = THREE.MathUtils.lerp(armR.current.rotation.z, 0.86 - typingPulse, 0.08);
    }
    if (handL.current) {
      handL.current.rotation.x = Math.sin(state.clock.elapsedTime * 9) * 0.18;
    }
    if (handR.current) {
      handR.current.rotation.x = Math.cos(state.clock.elapsedTime * 8.5) * 0.18;
    }
    if (monitor.current) {
      monitor.current.rotation.y = THREE.MathUtils.lerp(monitor.current.rotation.y, pointer.current.x * 0.06, 0.03);
      monitor.current.rotation.x = THREE.MathUtils.lerp(monitor.current.rotation.x, -0.05 + pointer.current.y * 0.02, 0.03);
    }
    if (keys.current) {
      keys.current.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) {
          child.scale.y = 1 + Math.abs(Math.sin(state.clock.elapsedTime * 8 + index * 0.5)) * 0.16;
        }
      });
    }
  });

  const keyRows = [
    [-0.84, -0.92, 0.02],
    [-0.66, -0.92, 0.02],
    [-0.48, -0.92, 0.02],
    [-0.3, -0.92, 0.02],
    [-0.12, -0.92, 0.02],
    [0.06, -0.92, 0.02],
    [0.24, -0.92, 0.02],
    [0.42, -0.92, 0.02],
    [0.6, -0.92, 0.02],
    [-0.84, -1.1, 0.02],
    [-0.66, -1.1, 0.02],
    [-0.48, -1.1, 0.02],
    [-0.3, -1.1, 0.02],
    [-0.12, -1.1, 0.02],
    [0.06, -1.1, 0.02],
    [0.24, -1.1, 0.02],
    [0.42, -1.1, 0.02],
    [0.6, -1.1, 0.02],
  ] as const;

  const currentRoom = rooms[activeRoomIndex];

  return (
    <group ref={stage} position={[0, -0.1, -0.9]}>
      {rooms.map((room) => (
        <RoomPod key={room.id} room={room} active={room.id === currentRoom.id} />
      ))}

      <group ref={chair} position={[currentRoom.x, -0.18, -0.56]}>
        <mesh position={[0, -0.9, -0.03]}>
          <cylinderGeometry args={[0.22, 0.26, 1.0, 14]} />
          <meshStandardMaterial color="#1d2430" roughness={0.82} metalness={0.08} />
        </mesh>
        <mesh position={[0, -1.56, 0.06]}>
          <torusGeometry args={[0.8, 0.08, 12, 28]} />
          <meshStandardMaterial color="#111820" roughness={0.92} metalness={0.04} />
        </mesh>
        <mesh position={[-0.16, -1.02, 0.02]} rotation={[0, 0, -0.22]}>
          <cylinderGeometry args={[0.08, 0.1, 1.0, 12]} />
          <meshStandardMaterial color="#1f2831" roughness={0.88} metalness={0.06} />
        </mesh>
        <mesh position={[0.16, -1.02, 0.02]} rotation={[0, 0, 0.22]}>
          <cylinderGeometry args={[0.08, 0.1, 1.0, 12]} />
          <meshStandardMaterial color="#1f2831" roughness={0.88} metalness={0.06} />
        </mesh>
        <mesh position={[-0.44, -1.18, 0.02]} rotation={[0, 0, -0.26]}>
          <cylinderGeometry args={[0.08, 0.08, 0.88, 12]} />
          <meshStandardMaterial color="#202833" roughness={0.88} metalness={0.06} />
        </mesh>
        <mesh position={[0.44, -1.18, 0.02]} rotation={[0, 0, 0.26]}>
          <cylinderGeometry args={[0.08, 0.08, 0.88, 12]} />
          <meshStandardMaterial color="#202833" roughness={0.88} metalness={0.06} />
        </mesh>
      </group>

      <group ref={avatar} position={[currentRoom.x, -0.18, -0.56]}>
        <group position={[0, 1.16, 0.03]}>
          <mesh position={[0, 0.08, 0]}>
            <sphereGeometry args={[0.47, 28, 28]} />
            <meshStandardMaterial color="#d4a581" roughness={0.58} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.03, 0.1]}>
            <boxGeometry args={[0.54, 0.58, 0.44]} />
            <meshStandardMaterial color="#d4a581" roughness={0.58} metalness={0.05} />
          </mesh>
          <mesh position={[0, -0.15, 0.03]}>
            <boxGeometry args={[0.34, 0.2, 0.24]} />
            <meshStandardMaterial color="#dcae8c" roughness={0.46} metalness={0.04} />
          </mesh>
          <mesh position={[-0.33, 0.02, 0.02]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#d19a74" roughness={0.52} metalness={0.04} />
          </mesh>
          <mesh position={[0.33, 0.02, 0.02]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color="#d19a74" roughness={0.52} metalness={0.04} />
          </mesh>
          <mesh position={[-0.12, -0.05, 0.39]} rotation={[0.16, 0, 0.04]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#0a1116" />
          </mesh>
          <mesh position={[0.12, -0.05, 0.39]} rotation={[0.16, 0, -0.04]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#0a1116" />
          </mesh>
          <mesh position={[-0.12, -0.13, 0.4]}>
            <boxGeometry args={[0.12, 0.03, 0.02]} />
            <meshBasicMaterial color="#11161b" />
          </mesh>
          <mesh position={[0.12, -0.13, 0.4]}>
            <boxGeometry args={[0.12, 0.03, 0.02]} />
            <meshBasicMaterial color="#11161b" />
          </mesh>
          <mesh position={[0, -0.02, 0.43]}>
            <boxGeometry args={[0.08, 0.14, 0.03]} />
            <meshBasicMaterial color="#c08d68" />
          </mesh>
          <mesh position={[0, -0.23, 0.42]}>
            <boxGeometry args={[0.12, 0.04, 0.02]} />
            <meshBasicMaterial color="#6b3f33" />
          </mesh>
          <mesh position={[0, -0.28, 0.4]}>
            <torusGeometry args={[0.16, 0.02, 10, 20]} />
            <meshBasicMaterial color="#6b3f33" />
          </mesh>

          <group position={[0, 0.35, -0.02]}>
            <mesh position={[0, 0.18, -0.02]}>
              <boxGeometry args={[0.62, 0.14, 0.5]} />
              <meshStandardMaterial color="#1a1f25" roughness={0.9} metalness={0.06} />
            </mesh>
            {[
              [-0.2, 0.17, 0.2, 0.14, 0.54],
              [0.0, 0.25, 0.24, 0.12, 0.66],
              [0.18, 0.18, 0.22, 0.12, 0.52],
              [-0.3, 0.06, 0.18, 0.1, 0.38],
              [0.3, 0.07, 0.18, 0.1, 0.42],
              [-0.1, 0.3, 0.24, 0.11, 0.72],
              [0.12, 0.31, 0.23, 0.1, 0.75],
              [0.28, 0.28, 0.18, 0.09, 0.64],
              [-0.38, 0.12, 0.2, 0.09, 0.46],
              [0.4, 0.13, 0.18, 0.09, 0.44],
            ].map(([x, y, sx, sy, z], index) => (
              <mesh key={`hair-${index}`} position={[x, y, 0.02]} rotation={[0.2, 0, x > 0 ? 0.32 : -0.32]}>
                <boxGeometry args={[sx, sy, z]} />
                <meshStandardMaterial color="#060707" roughness={0.95} metalness={0.02} />
              </mesh>
            ))}
            <mesh position={[0, 0.02, -0.03]}>
              <cylinderGeometry args={[0.33, 0.4, 0.34, 14]} />
              <meshStandardMaterial color="#223040" roughness={0.82} metalness={0.07} />
            </mesh>
          </group>
        </group>

        <mesh position={[0, 0.84, -0.02]}>
          <boxGeometry args={[0.48, 0.86, 0.34]} />
          <meshStandardMaterial color="#cfe6ef" roughness={0.72} metalness={0.06} />
        </mesh>
        <mesh position={[0, 0.55, -0.01]}>
          <boxGeometry args={[0.68, 0.58, 0.42]} />
          <meshStandardMaterial color="#bfdde8" roughness={0.78} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.9, -0.02]}>
          <torusGeometry args={[0.24, 0.06, 12, 28]} />
          <meshStandardMaterial color="#d6edf4" roughness={0.82} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.88, -0.01]}>
          <torusGeometry args={[0.31, 0.06, 12, 28]} />
          <meshStandardMaterial color="#a9d7e7" roughness={0.8} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.28, -0.01]}>
          <boxGeometry args={[0.8, 0.42, 0.5]} />
          <meshStandardMaterial color="#b8d9e4" roughness={0.82} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.02, 0.02]}>
          <boxGeometry args={[0.58, 0.2, 0.4]} />
          <meshStandardMaterial color="#e6f3f7" roughness={0.88} metalness={0.03} />
        </mesh>
        <mesh position={[0, -0.2, 0.01]}>
          <cylinderGeometry args={[0.17, 0.22, 1.0, 14]} />
          <meshStandardMaterial color="#c9a07d" roughness={0.5} metalness={0.06} />
        </mesh>
        <mesh position={[0, -0.2, 0.11]}>
          <cylinderGeometry args={[0.17, 0.2, 0.96, 14]} />
          <meshStandardMaterial color="#d4a581" roughness={0.58} metalness={0.04} />
        </mesh>
        <mesh ref={armL} position={[-0.36, 0.2, 0.03]} rotation={[0, 0, -1.18]}>
          <cylinderGeometry args={[0.07, 0.06, 0.96, 12]} />
          <meshStandardMaterial color="#cfe6ef" roughness={0.78} metalness={0.04} />
        </mesh>
        <mesh ref={armR} position={[0.36, 0.24, 0.03]} rotation={[0, 0, 1.08]}>
          <cylinderGeometry args={[0.07, 0.06, 0.96, 12]} />
          <meshStandardMaterial color="#cfe6ef" roughness={0.78} metalness={0.04} />
        </mesh>
        <mesh ref={handL} position={[-0.76, -0.04, 0.04]} rotation={[0, 0.18, 0]}>
          <sphereGeometry args={[0.085, 14, 14]} />
          <meshStandardMaterial color="#c98f69" roughness={0.44} metalness={0.04} />
        </mesh>
        <mesh ref={handR} position={[0.76, -0.08, 0.05]} rotation={[0, -0.12, 0]}>
          <sphereGeometry args={[0.085, 14, 14]} />
          <meshStandardMaterial color="#c98f69" roughness={0.44} metalness={0.04} />
        </mesh>
        <mesh position={[0, -0.18, -0.03]}>
          <cylinderGeometry args={[0.22, 0.26, 0.92, 14]} />
          <meshStandardMaterial color={currentRoom.accent} roughness={0.5} metalness={0.08} />
        </mesh>
      </group>

      <mesh position={[currentRoom.x, 1.02, -3.8]}>
        <planeGeometry args={[5.2, 2.4]} />
        <meshBasicMaterial color={currentRoom.glow} transparent opacity={0.08} />
      </mesh>
      <mesh position={[currentRoom.x - 3.8, 0.55, -2.7]} rotation={[0, Math.PI / 8, 0]}>
        <boxGeometry args={[0.16, 0.92, 0.14]} />
        <meshStandardMaterial color={displayMode === 'terminal' ? '#93f2d0' : '#8fe6ff'} emissive={displayMode === 'terminal' ? '#103b2b' : '#12314a'} emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[currentRoom.x + 3.7, 0.4, -2.5]} rotation={[0, -Math.PI / 7, 0]}>
        <boxGeometry args={[0.18, 1.02, 0.14]} />
        <meshStandardMaterial color="#f5cf8f" emissive="#3d2c16" emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function VizLattice({ activeSlug, pointer }: { activeSlug?: string | null; pointer: RefObject<Pointer> }) {
  const lattice = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () => [
      [-2.8, 1.5, -0.6],
      [2.55, 1.2, -0.8],
      [-2.25, -0.9, -0.4],
      [2.65, -1.2, -0.7],
      [0, 1.95, -1.05],
      [0.15, -1.8, -0.9],
    ] as const,
    [],
  );

  useFrame((state, delta) => {
    if (!lattice.current) return;

    lattice.current.rotation.y = THREE.MathUtils.lerp(
      lattice.current.rotation.y,
      state.clock.elapsedTime * 0.1 + pointer.current.x * 0.24,
      0.04,
    );
    lattice.current.rotation.x = THREE.MathUtils.lerp(
      lattice.current.rotation.x,
      pointer.current.y * 0.14 + (activeSlug ? 0.08 : 0.02),
      0.04,
    );
    lattice.current.position.y = THREE.MathUtils.lerp(
      lattice.current.position.y,
      pointer.current.y * 0.22,
      0.05,
    );
    lattice.current.position.x = THREE.MathUtils.lerp(
      lattice.current.position.x,
      pointer.current.x * 0.16,
      0.05,
    );

    lattice.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh) {
        child.rotation.z += delta * (index % 2 === 0 ? 0.12 : -0.08);
      }
    });
  });

  return (
    <group ref={lattice} position={[0, 0.1, -0.95]}>
      {nodes.map((position, index) => {
        const isCore = index === 4;
        const beam = Math.max(0.65, 1.8 - Math.abs(position[1]) * 0.32);

        return (
          <group key={position.join(':')} position={position}>
            <mesh>
              <sphereGeometry args={[isCore ? 0.14 : 0.1, 20, 20]} />
              <meshStandardMaterial
                color={isCore || activeSlug ? '#8fe6ff' : '#a7e8ff'}
                emissive={isCore || activeSlug ? '#173b53' : '#102336'}
                emissiveIntensity={isCore || activeSlug ? 1.4 : 0.95}
                roughness={0.22}
                metalness={0.72}
              />
            </mesh>
            <mesh position={[0, beam * 0.42, -0.06]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.022, 0.022, beam, 6]} />
              <meshBasicMaterial color={activeSlug ? '#93f2d0' : '#8fe6ff'} transparent opacity={0.3} />
            </mesh>
            <mesh position={[0, -beam * 0.34, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.14, 0.22, 24]} />
              <meshBasicMaterial color={activeSlug ? '#ffdca8' : '#93f2d0'} transparent opacity={0.22} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0, -0.18]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.78, 64]} />
        <meshBasicMaterial color={activeSlug ? '#8fe6ff' : '#93f2d0'} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function PointerOrb({ activeSlug, pointer }: { activeSlug?: string | null; pointer: RefObject<Pointer> }) {
  const orb = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const trail = useRef<THREE.Mesh>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const trailTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!orb.current || !light.current) return;

    target.set(pointer.current.x * 3.2, pointer.current.y * 1.5, 2.8);
    orb.current.position.lerp(target, 0.08);
    orb.current.scale.lerp(new THREE.Vector3(activeSlug ? 0.28 : 0.22, activeSlug ? 0.28 : 0.22, activeSlug ? 0.28 : 0.22), 0.08);
    orb.current.rotation.y += delta * 0.5;
    light.current.position.lerp(target, 0.1);
    light.current.intensity = activeSlug ? 2.5 : 1.75;

    if (trail.current) {
      trailTarget.set(pointer.current.x * 2.3, pointer.current.y * 1.1, 1.8);
      trail.current.position.lerp(trailTarget, 0.05);
    }
  });

  return (
    <group>
      <pointLight ref={light} color={activeSlug ? '#8fe6ff' : '#5ebdff'} intensity={1.8} distance={9} />
      <mesh ref={trail} position={[0, 0, 1.2]}>
        <icosahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial color={activeSlug ? '#ffdca8' : '#8fe6ff'} emissive={activeSlug ? '#5f3417' : '#112a3d'} emissiveIntensity={1.2} transparent opacity={0.78} />
      </mesh>
      <mesh ref={orb}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={activeSlug ? '#d1fff1' : '#a7e8ff'}
          emissive={activeSlug ? '#234e44' : '#15324a'}
          emissiveIntensity={1}
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

function ParticleHalo({ activeSlug, pointer }: { activeSlug?: string | null; pointer: RefObject<Pointer> }) {
  const points = useRef<THREE.Points>(null);
  const particles = useMemo(() => {
    const positions = new Float32Array(660);

    for (let index = 0; index < 220; index += 1) {
      const i = index * 3;
      const radius = 5.8 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.cos(phi) * 0.45;
      positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * (activeSlug ? 0.05 : 0.02);
    points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, pointer.current.y * 0.05, 0.03);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
          count={particles.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={activeSlug ? '#ffdca8' : '#fff1c7'}
        size={activeSlug ? 0.06 : 0.045}
        sizeAttenuation
        transparent
        opacity={activeSlug ? 0.95 : 0.84}
      />
    </points>
  );
}

function ModeFrame({
  displayMode,
  pointer,
}: {
  displayMode: DisplayMode;
  pointer: RefObject<Pointer>;
}) {
  const frame = useRef<THREE.Mesh>(null);
  const palette = modePalette[displayMode];

  useFrame((_, delta) => {
    if (!frame.current) return;
    frame.current.rotation.x = THREE.MathUtils.lerp(frame.current.rotation.x, pointer.current.y * 0.06, 0.04);
    frame.current.rotation.y = THREE.MathUtils.lerp(frame.current.rotation.y, pointer.current.x * 0.08, 0.04);
    frame.current.rotation.z += delta * 0.08;
  });

  return (
    <group ref={frame} position={[0, 0.45, -1.25]}>
      <mesh>
        <boxGeometry args={[5.6, 4.2, 0.02]} />
        <meshBasicMaterial color={palette.frame} transparent opacity={0.04} />
      </mesh>
      <mesh position={[-2.72, 1.88, 0.05]}>
        <boxGeometry args={[0.34, 0.04, 0.04]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.95} />
      </mesh>
      <mesh position={[2.72, 1.88, 0.05]}>
        <boxGeometry args={[0.34, 0.04, 0.04]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.95} />
      </mesh>
      <mesh position={[-2.72, -1.88, 0.05]}>
        <boxGeometry args={[0.34, 0.04, 0.04]} />
        <meshBasicMaterial color={palette.secondary} transparent opacity={0.95} />
      </mesh>
      <mesh position={[2.72, -1.88, 0.05]}>
        <boxGeometry args={[0.34, 0.04, 0.04]} />
        <meshBasicMaterial color={palette.secondary} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 0.02, 0.03]}>
        <boxGeometry args={[5.22, 0.02, 0.02]} />
        <meshBasicMaterial color={palette.primary} transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, 0.72, 0.03]}>
        <boxGeometry args={[5.1, 0.01, 0.01]} />
        <meshBasicMaterial color={palette.primary} transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export function HeroScene({
  projects,
  activeProject,
  displayMode = 'editorial',
}: {
  projects: Project[];
  activeProject?: Project | null;
  displayMode?: DisplayMode;
}) {
  const activeSlug = activeProject?.slug ?? null;
  const pointer = useScenePointer();
  const palette = modePalette[displayMode];

  return (
    <div className={`scene-shell scene-shell--${displayMode}`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.35, 8], fov: 46 }}
        dpr={[1, 1.2]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      >
        <color attach="background" args={[displayMode === 'terminal' ? '#050911' : '#07111f']} />
        <fog attach="fog" args={[displayMode === 'terminal' ? '#050911' : '#07111f', 8, 18]} />
        <ambientLight intensity={displayMode === 'terminal' ? 0.62 : activeSlug ? 0.92 : 0.74} />
        <directionalLight
          position={[5, 4, 5]}
          intensity={displayMode === 'viz' ? 2.8 : activeSlug ? 2.6 : 2.1}
          color={palette.secondary}
        />
        <pointLight position={[-4, -2, -2]} intensity={displayMode === 'terminal' ? 1.2 : activeSlug ? 1.85 : 1.3} color={palette.primary} />
        <Suspense fallback={null}>
          <MultiRoomStudio displayMode={displayMode} pointer={pointer} />
          <ModeFrame displayMode={displayMode} pointer={pointer} />
          <ParticleHalo activeSlug={activeSlug} pointer={pointer} />
          <SignalOrbit activeSlug={activeSlug} pointer={pointer} />
          <DataSpokes activeSlug={activeSlug} pointer={pointer} />
          <ScanBeam displayMode={displayMode} activeSlug={activeSlug} />
          {displayMode === 'viz' ? <VizLattice activeSlug={activeSlug} pointer={pointer} /> : null}
          <CoreSculpture activeSlug={activeSlug} pointer={pointer} />
          <PointerOrb activeSlug={activeSlug} pointer={pointer} />
          <ProjectPanels projects={projects} activeSlug={activeSlug} pointer={pointer} />
          <mesh position={[0, 0.2, -1.6]} rotation={[0, 0, 0]}>
            <planeGeometry args={[6.8, 4.8]} />
            <meshBasicMaterial
              color={displayMode === 'terminal' ? '#93f2d0' : displayMode === 'viz' ? '#8fe6ff' : '#ffdca8'}
              transparent
              opacity={0.018}
            />
          </mesh>
          <gridHelper args={[22, 22, '#233a5c', '#132236']} position={[0, -2.35, -1.8]} />
          <mesh position={[0, 1.7, -1.18]}>
            <planeGeometry args={[6.2, 0.02]} />
            <meshBasicMaterial color={palette.accent} transparent opacity={0.24} />
          </mesh>
          <mesh position={[0, -2.7, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[24, 24, 1, 1]} />
            <meshBasicMaterial color="#07111f" transparent opacity={0.2} />
          </mesh>
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate
          enableDamping
          dampingFactor={0.08}
          autoRotate
          autoRotateSpeed={displayMode === 'terminal' ? 0.34 : activeSlug ? 0.5 : 0.22}
        />
        <EffectComposer>
          <DepthOfField focusDistance={0.02} focalLength={0.035} bokehScale={activeSlug ? 3.2 : 1.7} height={320} />
          <Bloom intensity={displayMode === 'viz' ? 1.46 : activeSlug ? 1.58 : 1.08} luminanceThreshold={0.16} luminanceSmoothing={0.86} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={displayMode === 'terminal' ? 0.04 : activeSlug ? 0.06 : 0.03} />
          <Vignette eskil={false} offset={0.2} darkness={palette.vignette} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
