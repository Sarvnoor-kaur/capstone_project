import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WellnessOrb() {
  const outerRef = useRef();
  const innerRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (outerRef.current) {
      outerRef.current.rotation.x = time * 0.2;
      outerRef.current.rotation.y = time * 0.3;
      outerRef.current.position.y = Math.sin(time * 0.8) * 0.3;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x = -time * 0.25;
      innerRef.current.rotation.z = time * 0.15;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.4;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.3;
    }
  });

  return (
    <group scale={1.8}>
      {/* Outer main sphere - Lavender */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#DCD6F7"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          emissive="#DCD6F7"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner core sphere - Peach */}
      <mesh ref={innerRef} scale={0.7}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#F4CDBB"
          transparent
          opacity={0.6}
          emissive="#F4CDBB"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Rotating ring 1 - Sage */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]} scale={1.3}>
        <torusGeometry args={[1, 0.04, 16, 100]} />
        <meshStandardMaterial
          color="#B8C9B3"
          transparent
          opacity={0.7}
          emissive="#B8C9B3"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Rotating ring 2 - Lavender light */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, 0, Math.PI / 4]} scale={1.4}>
        <torusGeometry args={[1, 0.03, 16, 100]} />
        <meshStandardMaterial
          color="#EBE7FA"
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Small orbiting spheres */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 1.6,
              Math.sin(angle) * 0.3,
              Math.sin(angle) * 1.6,
            ]}
            scale={0.12}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color="#F4CDBB"
              emissive="#F4CDBB"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}
