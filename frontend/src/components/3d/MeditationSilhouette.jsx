import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Meditation Silhouette - Peaceful human figure in meditation pose
 * Represents mindfulness, emotional balance, and self-care
 */
export default function MeditationSilhouette() {
  const groupRef = useRef();
  const auraRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Gentle floating
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.8) * 0.15;
    }

    // Breathing aura animation
    if (auraRef.current) {
      const breathe = 1 + Math.sin(time * 1.2) * 0.2;
      auraRef.current.scale.setScalar(breathe);
      auraRef.current.material.opacity = 0.2 + Math.sin(time * 1.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]} scale={0.8}>
      {/* Breathing aura */}
      <mesh ref={auraRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#A8D8EA"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial
          color="#9B8BC4"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Body (torso) */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.9, 24]} />
        <meshStandardMaterial
          color="#AFA0D4"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Legs in cross-legged position */}
      {/* Left leg */}
      <group position={[-0.35, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.12, 0.8, 16]} />
          <meshStandardMaterial
            color="#9B8BC4"
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Right leg */}
      <group position={[0.35, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.12, 0.8, 16]} />
          <meshStandardMaterial
            color="#9B8BC4"
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Arms in meditation pose */}
      {/* Left arm */}
      <group position={[-0.45, 0.9, 0.2]} rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.1, 0.7, 16]} />
          <meshStandardMaterial
            color="#AFA0D4"
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[0.45, 0.9, 0.2]} rotation={[Math.PI / 3, 0, -Math.PI / 4]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.1, 0.7, 16]} />
          <meshStandardMaterial
            color="#AFA0D4"
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Hands touching (mudra position) */}
      <mesh position={[0, 0.5, 0.5]} scale={0.15}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color="#C4B5E6"
          roughness={0.3}
        />
      </mesh>

      {/* Meditation platform/cushion */}
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.9, 0.2, 32]} />
        <meshStandardMaterial
          color="#F4CDBB"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* Glowing chakra point (third eye) */}
      <mesh position={[0, 1.55, 0.35]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color="#DCD6F7"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Small light particles around figure */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.2;
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos(angle) * radius,
              0.8 + Math.sin(angle * 2) * 0.3,
              Math.sin(angle) * radius,
            ]}
            scale={0.06}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial
              color="#F4CDBB"
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </group>
  );
}
