import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';

function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="#DCD6F7" emissive="#DCD6F7" emissiveIntensity={0.5} />
    </mesh>
  );
}

/**
 * Enhanced Scene3D for Mental Wellness visualization
 * Optimized lighting for premium healthcare aesthetic
 */
export default function Scene3D({ children }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      camera={{
        position: [0, 1, 8],
        fov: 45,
        near: 0.1,
        far: 1000
      }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2
      }}
    >
      {/* Ambient lighting for soft overall illumination */}
      <ambientLight intensity={0.6} />

      {/* Main key light - slightly purple tinted for wellness aesthetic */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        color="#F5F0FF"
        castShadow
      />

      {/* Fill light - soft blue for depth */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={0.4}
        color="#E3F2FD"
      />

      {/* Rim light - warm peach for emotional warmth */}
      <pointLight
        position={[0, -3, -5]}
        intensity={0.6}
        color="#F4CDBB"
        distance={20}
        decay={2}
      />

      {/* Top light - lavender for mental clarity */}
      <pointLight
        position={[0, 8, 0]}
        intensity={0.4}
        color="#DCD6F7"
        distance={15}
        decay={2}
      />

      {/* Side accent lights for dimension */}
      <pointLight position={[8, 0, 0]} intensity={0.3} color="#B8C9B3" distance={15} />
      <pointLight position={[-8, 0, 0]} intensity={0.3} color="#A8D8EA" distance={15} />

      {/* Hemisphere light for natural look */}
      <hemisphereLight
        skyColor="#E8E4F3"
        groundColor="#F4CDBB"
        intensity={0.3}
      />

      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>

      {/* Soft fog for depth perception */}
      <fog attach="fog" args={['#F8F7F3', 15, 30]} />
    </Canvas>
  );
}
