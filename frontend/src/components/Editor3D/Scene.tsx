import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useEditorStore } from '../../stores/editorStore';
import RacketModel from './RacketModel';

function SceneSetup() {
  const { scene } = useThree();
  const design = useEditorStore((state) => state.design);

  useEffect(() => {
    // Set background color
    scene.background = new THREE.Color(design.backgroundColor);
  }, [design.backgroundColor, scene]);

  return null;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={0.5} />
    </>
  );
}

interface SceneProps {
  className?: string;
}

export default function Scene({ className }: SceneProps) {
  const design = useEditorStore((state) => state.design);

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{
          position: [
            design.cameraPosition.x,
            design.cameraPosition.y,
            design.cameraPosition.z,
          ],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
        }}
      >
        <SceneSetup />
        <Lighting />

        {/* Main racket model */}
        <RacketModel />

        {/* Ground plane with shadows */}
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        {/* Environment for reflections */}
        <Environment preset="studio" />

        {/* Camera controls */}
        <OrbitControls
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
