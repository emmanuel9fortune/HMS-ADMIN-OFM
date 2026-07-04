import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function HumanModel() {
  const { scene } = useGLTF('models/scene.gltf'); // Place model in public/models folder
  return <primitive object={scene} scale={4} position={[0, -3, 0]} />;
}

export default function Anatomy() {
  return (
    <Canvas style={{ width: '350px', height: '350px' }}>
      <ambientLight />
      <Suspense fallback={null}>
        <HumanModel />
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
