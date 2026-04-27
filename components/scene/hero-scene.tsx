'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { BlendFunction } from 'postprocessing';
import type { Project } from '@/content/projects';

function ProjectPanels({ projects, activeSlug }: { projects: Project[]; activeSlug?: string | null }) {
  const group = useRef<THREE.Group>(null);
  const textures = useTexture(projects.map((project) => project.image));

  useFrame((state) => {
    if (!group.current) return;
    const activeIndex = activeSlug ? projects.findIndex((project) => project.slug === activeSlug) : -1;
    const targetAngle = activeIndex >= 0 ? (activeIndex / Math.max(projects.length, 1)) * Math.PI * 2 : 0;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.clock.elapsedTime * 0.06 + targetAngle * 0.1,
      0.03,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      activeSlug ? 0.12 : Math.sin(state.clock.elapsedTime * 0.24) * 0.08,
      0.03,
    );
  });

  return (
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
            speed={isActive ? 2.2 : 1.25 + index * 0.14}
            rotationIntensity={isActive ? 0.52 : 0.24}
            floatIntensity={isActive ? 1.45 : 1}
            position={[
              Math.cos(angle) * radius,
              (index % 2 === 0 ? 1 : -1) * 0.68,
              Math.sin(angle) * radius - 1.4,
            ]}
          >
            <mesh rotation={[0, angle + Math.PI, 0]}>
              <planeGeometry args={[2.1, 1.28]} />
              <meshStandardMaterial
                map={texture}
                metalness={0.12}
                roughness={0.28}
                emissive={isActive ? '#1d2332' : '#000000'}
                emissiveIntensity={isActive ? 0.8 : 0}
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
                emissiveIntensity={isActive ? 0.55 : 0}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

function CoreSculpture({ activeSlug }: { activeSlug?: string | null }) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.18;
    mesh.current.rotation.y += delta * 0.28;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.32} floatIntensity={1.15}>
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

function SignalOrbit({ activeSlug }: { activeSlug?: string | null }) {
  const orbit = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (orbit.current) {
      orbit.current.rotation.z += delta * 0.22;
      orbit.current.rotation.x = THREE.MathUtils.lerp(
        orbit.current.rotation.x,
        state.pointer.y * 0.14 + (activeSlug ? 0.16 : 0.08),
        0.04,
      );
      orbit.current.rotation.y = THREE.MathUtils.lerp(
        orbit.current.rotation.y,
        -state.pointer.x * 0.18 + (activeSlug ? 0.24 : 0.12),
        0.04,
      );
    }

    if (ring.current) {
      ring.current.rotation.z += delta * (activeSlug ? 0.28 : 0.18);
      ring.current.scale.lerp(new THREE.Vector3(activeSlug ? 1.08 : 1, activeSlug ? 1.08 : 1, 1), 0.06);
    }
  });

  return (
    <group ref={orbit} position={[0, -0.1, -0.5]}>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.03, 18, 120]} />
        <meshStandardMaterial color={activeSlug ? '#8fe6ff' : '#6bb8ff'} emissive={activeSlug ? '#12354b' : '#091724'} emissiveIntensity={1.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]}>
        <torusGeometry args={[1.9, 0.018, 12, 96]} />
        <meshStandardMaterial color={activeSlug ? '#d7ffe8' : '#bdebdc'} emissive={activeSlug ? '#174b33' : '#0b1e18'} emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.55, 3.72, 64]} />
        <meshBasicMaterial color="#a6c6ff" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function PointerOrb({ activeSlug }: { activeSlug?: string | null }) {
  const orb = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!orb.current || !light.current) return;

    target.set(state.pointer.x * 3.2, state.pointer.y * 1.5, 2.8);
    orb.current.position.lerp(target, 0.08);
    orb.current.scale.lerp(new THREE.Vector3(activeSlug ? 0.28 : 0.22, activeSlug ? 0.28 : 0.22, activeSlug ? 0.28 : 0.22), 0.08);
    orb.current.rotation.y += delta * 0.5;
    light.current.position.lerp(target, 0.1);
    light.current.intensity = activeSlug ? 2.5 : 1.75;
  });

  return (
    <group>
      <pointLight ref={light} color={activeSlug ? '#8fe6ff' : '#5ebdff'} intensity={1.8} distance={9} />
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

function ParticleHalo({ activeSlug }: { activeSlug?: string | null }) {
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

export function HeroScene({ projects, activeProject }: { projects: Project[]; activeProject?: Project | null }) {
  const activeSlug = activeProject?.slug ?? null;

  return (
    <div className="scene-shell" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.35, 8], fov: 46 }}
        dpr={[1, 1.2]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      >
        <color attach="background" args={['#07111f']} />
        <fog attach="fog" args={['#07111f', 8, 18]} />
        <ambientLight intensity={activeSlug ? 0.88 : 0.72} />
        <directionalLight position={[5, 4, 5]} intensity={activeSlug ? 2.6 : 2.1} color={activeSlug ? '#fff0cf' : '#ffe9c8'} />
        <pointLight position={[-4, -2, -2]} intensity={activeSlug ? 1.8 : 1.3} color={activeSlug ? '#8ec9ff' : '#5ebdff'} />
        <Suspense fallback={null}>
          <ParticleHalo activeSlug={activeSlug} />
          <SignalOrbit activeSlug={activeSlug} />
          <CoreSculpture activeSlug={activeSlug} />
          <PointerOrb activeSlug={activeSlug} />
          <ProjectPanels projects={projects} activeSlug={activeSlug} />
          <gridHelper args={[22, 22, '#233a5c', '#132236']} position={[0, -2.35, -1.8]} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={activeSlug ? 0.35 : 0.15}
        />
        <EffectComposer>
          <DepthOfField focusDistance={0.025} focalLength={0.03} bokehScale={activeSlug ? 3 : 1.5} height={320} />
          <Bloom intensity={activeSlug ? 1.35 : 0.9} luminanceThreshold={0.2} luminanceSmoothing={0.92} />
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={activeSlug ? 0.05 : 0.02} />
          <Vignette eskil={false} offset={0.25} darkness={0.95} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
