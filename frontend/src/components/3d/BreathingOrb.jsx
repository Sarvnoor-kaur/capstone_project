import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

export default function BreathingOrb({ phase = 'idle', breatheDuration = 4 }) {
  const orbRef = useRef();
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!orbRef.current) return;

    timeRef.current += delta;
    const time = timeRef.current;

    if (phase === 'inhale') {
      const scale = 1 + Math.sin(time * Math.PI / breatheDuration) * 0.5;
      orbRef.current.scale.setScalar(scale);
    } else if (phase === 'exhale') {
      const scale = 1.5 - Math.sin(time * Math.PI / breatheDuration) * 0.5;
      orbRef.current.scale.setScalar(scale);
    } else if (phase === 'hold') {
      orbRef.current.scale.setScalar(1.5);
    } else {
      orbRef.current.scale.setScalar(1);
    }

    orbRef.current.rotation.y = time * 0.3;
  });

  return (
    <group ref={orbRef}>
      <Sphere args={[1, 64, 64]}>
        <meshPhysicalMaterial
          color="#A8D8EA"
          transparent
          opacity={0.7}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshBasicMaterial
          color="#DCD6F7"
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}
