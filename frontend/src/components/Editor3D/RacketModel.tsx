import { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useEditorStore } from '../../stores/editorStore';

// Create a simple racket geometry procedurally
function createRacketGeometry() {
  // Frame (oval shape)
  const frameShape = new THREE.Shape();
  const frameWidth = 0.6;
  const frameHeight = 0.9;
  const frameThickness = 0.05;

  // Create oval frame
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    const x = Math.cos(angle) * frameWidth;
    const y = Math.sin(angle) * frameHeight;
    if (i === 0) {
      frameShape.moveTo(x, y);
    } else {
      frameShape.lineTo(x, y);
    }
  }

  // Create hole for the string area
  const holePath = new THREE.Path();
  const holeWidth = frameWidth - frameThickness * 2;
  const holeHeight = frameHeight - frameThickness * 2;
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    const x = Math.cos(angle) * holeWidth;
    const y = Math.sin(angle) * holeHeight;
    if (i === 0) {
      holePath.moveTo(x, y);
    } else {
      holePath.lineTo(x, y);
    }
  }
  frameShape.holes.push(holePath);

  const extrudeSettings = {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 3,
  };

  const frameGeometry = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
  frameGeometry.center();

  return { frameGeometry, holeWidth, holeHeight };
}

// Create string pattern
function createStringGeometry(width: number, height: number) {
  const points: THREE.Vector3[] = [];
  const stringCount = 16;

  // Vertical strings
  for (let i = 0; i < stringCount; i++) {
    const x = (i / (stringCount - 1) - 0.5) * width * 1.6;
    points.push(new THREE.Vector3(x, -height * 0.8, 0.04));
    points.push(new THREE.Vector3(x, height * 0.8, 0.04));
  }

  // Horizontal strings
  for (let i = 0; i < stringCount; i++) {
    const y = (i / (stringCount - 1) - 0.5) * height * 1.6;
    points.push(new THREE.Vector3(-width * 0.8, y, 0.04));
    points.push(new THREE.Vector3(width * 0.8, y, 0.04));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return geometry;
}

interface RacketPartProps {
  element: any;
  isSelected: boolean;
  onClick: () => void;
}

function RacketPart({ element, isSelected, onClick }: RacketPartProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { frameGeometry, holeWidth, holeHeight } = useMemo(
    () => createRacketGeometry(),
    []
  );
  const stringGeometry = useMemo(
    () => createStringGeometry(holeWidth, holeHeight),
    [holeWidth, holeHeight]
  );

  const material = useMemo(() => {
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: element.color,
      roughness: 0.3,
      metalness: 0.1,
      transparent: element.opacity < 1,
      opacity: element.opacity,
    });

    // If there's a texture, load it
    if (element.texture) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(element.texture, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        baseMaterial.map = texture;
        baseMaterial.needsUpdate = true;
      });
    }

    return baseMaterial;
  }, [element.color, element.texture, element.opacity]);

  const getScale = (): [number, number, number] => {
    switch (element.type) {
      case 'shaft':
        return [0.15, 1.2, 0.1];
      case 'handle':
        return [0.2, 0.5, 0.2];
      case 'grip':
        return [0.22, 0.3, 0.22];
      default:
        return [1, 1, 1];
    }
  };

  const getRotation = (): [number, number, number] => {
    if (element.type === 'frame') {
      return [Math.PI / 2, 0, 0];
    }
    return [0, 0, 0];
  };

  return (
    <mesh
      ref={meshRef}
      geometry={element.type === 'string' ? stringGeometry : frameGeometry}
      position={[
        element.position.x,
        element.position.y,
        element.position.z,
      ]}
      rotation={getRotation()}
      scale={getScale()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      visible={element.visible}
    >
      {element.type === 'string' ? (
        <lineBasicMaterial
          color={element.color}
          linewidth={2}
          transparent={element.opacity < 1}
          opacity={element.opacity}
        />
      ) : (
        <primitive object={material} attach="material" />
      )}
      {isSelected && (
        <mesh>
          <boxGeometry args={[1.5, 2.5, 0.3]} />
          <meshBasicMaterial
            color="#00ff00"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </mesh>
  );
}

export default function RacketModel() {
  const design = useEditorStore((state) => state.design);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const selectElement = useEditorStore((state) => state.selectElement);

  const handleSelect = useCallback(
    (id: string) => {
      selectElement(id);
    },
    [selectElement]
  );

  const handleDeselect = useCallback(() => {
    selectElement(null);
  }, [selectElement]);

  return (
    <group onClick={handleDeselect}>
      {design.elements.map((element) => (
        <RacketPart
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          onClick={() => handleSelect(element.id)}
        />
      ))}
    </group>
  );
}
