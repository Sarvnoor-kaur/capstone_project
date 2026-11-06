import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Simplified Wellness Orb for Authentication Pages
 * Optimized for smaller viewport and better performance
 */
export default function AuthWellnessOrb() {
  const outerRef = useRef();
  const innerRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (outerRef.current) {
      outerRef.current.rotation.y = time * 0.15;
      outerRef.current.position.y = Math.sin(time * 0.6) * 0.2;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x = time * 0.1;
      innerRef.current.rotation.z = time * 0.08;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.3;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.25;
    }
  });

  return (
    <group scale={1.5}>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#DCD6F7"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main sphere - Lavender */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial
          color="#A99BEA"
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.9}
          emissive="#A99BEA"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner core - Purple/Peach gradient effect */}
      <mesh ref={innerRef} scale={0.65}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#DDD7F7"
          transparent
          opacity={0.7}
          emissive="#F4CDBB"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Ring 1 - Sage */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]} scale={1.25}>
        <torusGeometry args={[1, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#B8C9B3"
          transparent
          opacity={0.8}
          emissive="#B8C9B3"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Ring 2 - Lighter lavender */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, 0, Math.PI / 4]} scale={1.35}>
        <torusGeometry args={[1, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#DDD7F7"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Small accent spheres */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.5,
              Math.sin(angle) * 0.3,
              Math.sin(angle) * 1.5,
            ]}
            scale={0.1}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color="#F4CDBB"
              emissive="#F4CDBB"
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}
