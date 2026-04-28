'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, MeshDistortMaterial, OrbitControls, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect, useMemo, useRef } from 'react';
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
