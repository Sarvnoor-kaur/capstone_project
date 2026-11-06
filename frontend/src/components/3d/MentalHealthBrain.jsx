import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Mental Health Brain - Premium 3D visualization
 * Represents cognitive wellbeing, neural connections, and emotional balance
 */
export default function MentalHealthBrain() {
  const brainRef = useRef();
  const heartRef = useRef();
  const neuralRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Gentle brain rotation
    if (brainRef.current) {
      brainRef.current.rotation.y = time * 0.15;
      brainRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      brainRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }

    // Heart pulse animation
    if (heartRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      heartRef.current.scale.setScalar(pulse);
    }

    // Neural connections glow
    if (neuralRef.current) {
      neuralRef.current.rotation.y = -time * 0.1;
    }

    // Outer glow pulse
    if (glowRef.current) {
      const glowPulse = 1 + Math.sin(time * 1.5) * 0.15;
      glowRef.current.scale.setScalar(glowPulse);
    }
  });

  // Create brain-like geometry
  const createBrainGeometry = () => {
    const group = [];

    // Main brain hemispheres
    const leftHemisphere = (
      <mesh position={[-0.3, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial
          color="#B8A5D6"
          roughness={0.3}
          metalness={0.2}
          emissive="#9B8BC4"
          emissiveIntensity={0.2}
        />
      </mesh>
    );

    const rightHemisphere = (
      <mesh position={[0.3, 0, 0]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[0.8, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial
          color="#C4B5E6"
          roughness={0.3}
          metalness={0.2}
          emissive="#AFA0D4"
          emissiveIntensity={0.2}
        />
      </mesh>
    );

    // Brain wrinkles/folds (sulci)
    const folds = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 0.75;
      folds.push(
        <mesh
          key={`fold-${i}`}
          position={[
            Math.cos(angle) * radius * 0.6,
            Math.sin(angle * 2) * 0.4,
            Math.sin(angle) * radius * 0.6,
          ]}
          scale={0.15}
        >
          <torusGeometry args={[0.3, 0.08, 8, 16]} />
          <meshStandardMaterial
            color="#A594C6"
            roughness={0.4}
          />
        </mesh>
      );
    }

    return { leftHemisphere, rightHemisphere, folds };
  };

  const brain = createBrainGeometry();

  return (
    <group scale={2.2}>
      {/* Outer glow aura */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#DCD6F7"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main brain structure */}
      <group ref={brainRef}>
        {/* Brain hemispheres */}
        {brain.leftHemisphere}
        {brain.rightHemisphere}

        {/* Brain folds */}
        {brain.folds}

        {/* Corpus callosum (connection between hemispheres) */}
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
          <meshStandardMaterial
            color="#B8A5D6"
            roughness={0.3}
          />
        </mesh>

        {/* Integrated heart - emotional health */}
        <group ref={heartRef} position={[0, -0.6, 0.3]} scale={0.35}>
          {/* Heart shape using two spheres and a cone */}
          <mesh position={[-0.25, 0.2, 0]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial
              color="#FFB3C1"
              roughness={0.2}
              metalness={0.1}
              emissive="#FF8FA3"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[0.25, 0.2, 0]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial
              color="#FFB3C1"
              roughness={0.2}
              metalness={0.1}
              emissive="#FF8FA3"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI]}>
            <coneGeometry args={[0.45, 0.8, 24]} />
            <meshStandardMaterial
              color="#FFB3C1"
              roughness={0.2}
              metalness={0.1}
              emissive="#FF8FA3"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* Neural connection network */}
      <group ref={neuralRef}>
        {[...Array(20)].map((_, i) => {
          const angle1 = (i / 20) * Math.PI * 2;
          const angle2 = ((i + 5) / 20) * Math.PI * 2;
          const radius = 1.2;

          return (
            <mesh
              key={`neural-${i}`}
              position={[
                Math.cos(angle1) * radius,
                Math.sin(angle1 * 3) * 0.5,
                Math.sin(angle1) * radius,
              ]}
              scale={0.08}
            >
              <sphereGeometry args={[1, 12, 12]} />
              <meshStandardMaterial
                color="#A8D8EA"
                emissive="#A8D8EA"
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
      </group>

      {/* Energy rings - representing thoughts and awareness */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.5, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#B8C9B3"
          emissive="#B8C9B3"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      <mesh rotation={[0, Math.PI / 2.5, Math.PI / 4]}>
        <torusGeometry args={[1.6, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#DCD6F7"
          emissive="#DCD6F7"
          emissiveIntensity={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}
