import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

export default function ChatAssistant3D() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main sphere */}
      <Sphere args={[0.8, 64, 64]}>
        <meshPhysicalMaterial
          color="#9333ea"
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.1}
          clearcoat={1}
        />
      </Sphere>

      {/* Inner core */}
      <Sphere args={[0.5, 32, 32]}>
        <meshBasicMaterial
          color="#F4CDBB"
          transparent
          opacity={0.5}
        />
      </Sphere>

      {/* Orbiting particles */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 3) * Math.PI * 2) * 1.2,
            0,
            Math.sin((i / 3) * Math.PI * 2) * 1.2,
          ]}
        >
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#DCD6F7" />
        </mesh>
      ))}
    </group>
  );
}
