import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Emotional Elements - Floating symbols representing different emotions
 * Happiness, calmness, hope, healing, growth
 */
export default function EmotionalElements() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }

    // Animate individual elements
    groupRef.current?.children.forEach((child, i) => {
      const time = clock.getElapsedTime();
      child.position.y += Math.sin(time * 0.5 + i) * 0.001;
      child.rotation.y = time * 0.2 * (i % 2 === 0 ? 1 : -1);
    });
  });

  const emotions = useMemo(() => [
    // Happiness (Yellow star)
    {
      type: 'star',
      color: '#FFD93D',
      emissive: '#FFC107',
      position: [3, 2, 1],
      scale: 0.3,
    },
    // Calmness (Blue cloud)
    {
      type: 'cloud',
      color: '#A8D8EA',
      emissive: '#7EC8E3',
      position: [-3, 1.5, -1],
      scale: 0.35,
    },
    // Hope (Green butterfly)
    {
      type: 'butterfly',
      color: '#B8C9B3',
      emissive: '#9BB896',
      position: [2, -1, 2],
      scale: 0.25,
    },
    // Healing (Pink heart)
    {
      type: 'heart',
      color: '#FFB3C1',
      emissive: '#FF8FA3',
      position: [-2, -1.5, 1.5],
      scale: 0.25,
    },
    // Growth (Mint leaf)
    {
      type: 'leaf',
      color: '#B8E6C9',
      emissive: '#93D4A8',
      position: [1.5, 2.5, -2],
      scale: 0.3,
    },
    // Peace (Lavender lotus)
    {
      type: 'lotus',
      color: '#DCD6F7',
      emissive: '#C4B5E6',
      position: [-2.5, 2, 2],
      scale: 0.28,
    },
  ], []);

  const createStar = (color, emissive) => {
    const points = [];
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const radius = i % 2 === 0 ? 0.5 : 0.2;
      points.push(new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius));
    }
    const shape = new THREE.Shape(points);

    return (
      <mesh>
        <extrudeGeometry args={[shape, { depth: 0.1, bevelEnabled: false }]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.4}
        />
      </mesh>
    );
  };

  const createCloud = (color) => (
    <group>
      <mesh position={[-0.3, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.1, 0.1, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );

  const createButterfly = (color, emissive) => (
    <group>
      {/* Left wing */}
      <mesh position={[-0.25, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.25, 0, 0]} rotation={[0, Math.PI, -Math.PI / 6]}>
        <sphereGeometry args={[0.3, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );

  const createHeart = (color, emissive) => (
    <group scale={1.2}>
      <mesh position={[-0.15, 0.1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0.15, 0.1, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, -0.15, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.25, 0.4, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );

  const createLeaf = (color, emissive) => (
    <mesh rotation={[0, 0, Math.PI / 4]}>
      <sphereGeometry args={[0.4, 16, 16, 0, Math.PI, 0, Math.PI]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );

  const createLotus = (color) => (
    <group>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2]}
            rotation={[Math.PI / 3, angle, 0]}
          >
            <sphereGeometry args={[0.15, 12, 12, 0, Math.PI, 0, Math.PI / 2]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#FFD93D" />
      </mesh>
    </group>
  );

  const renderElement = (emotion) => {
    switch (emotion.type) {
      case 'star':
        return createStar(emotion.color, emotion.emissive);
      case 'cloud':
        return createCloud(emotion.color);
      case 'butterfly':
        return createButterfly(emotion.color, emotion.emissive);
      case 'heart':
        return createHeart(emotion.color, emotion.emissive);
      case 'leaf':
        return createLeaf(emotion.color, emotion.emissive);
      case 'lotus':
        return createLotus(emotion.color);
      default:
        return null;
    }
  };

  return (
    <group ref={groupRef}>
      {emotions.map((emotion, index) => (
        <group
          key={index}
          position={emotion.position}
          scale={emotion.scale}
        >
          {renderElement(emotion)}
        </group>
      ))}

      {/* Additional floating light particles */}
      {[...Array(30)].map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 3.5 + Math.random() * 1;
        const height = (Math.random() - 0.5) * 4;

        return (
          <mesh
            key={`light-${i}`}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius,
            ]}
            scale={0.04 + Math.random() * 0.06}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={['#DCD6F7', '#F4CDBB', '#B8C9B3', '#A8D8EA'][Math.floor(Math.random() * 4)]}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}
