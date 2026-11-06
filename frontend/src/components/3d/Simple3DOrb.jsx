import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Simplified 3D Orb - guaranteed to be visible
 * Uses only basic Three.js geometries and materials
 */
export default function Simple3DOrb() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={2.5}>
      {/* Main large sphere - Lavender */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#DCD6F7"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Inner glowing sphere - Peach */}
      <mesh scale={0.6}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color="#F4CDBB"
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Ring around - Sage */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 12, 48]} />
        <meshStandardMaterial color="#B8C9B3" />
      </mesh>

      {/* Second ring - Lavender light */}
      <mesh rotation={[0, Math.PI / 2.5, Math.PI / 3]}>
        <torusGeometry args={[1.3, 0.04, 12, 48]} />
        <meshStandardMaterial
          color="#EBE7FA"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Four orbiting dots */}
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(rad) * 1.5,
              0,
              Math.sin(rad) * 1.5,
            ]}
          >
            <sphereGeometry args={[0.1, 12, 12]} />
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
