import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere } from '@react-three/drei';

export default function WellnessOrb() {
  const orbRef = useRef();

  useFrame(({ clock }) => {
    if (orbRef.current) {
      orbRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      orbRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      orbRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <group ref={orbRef}>
      <Sphere args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color="#DCD6F7"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          metalness={0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[0.8, 32, 32]} scale={1.5}>
        <meshBasicMaterial
          color="#F4CDBB"
          transparent
          opacity={0.3}
        />
      </Sphere>
    </group>
  );
}
