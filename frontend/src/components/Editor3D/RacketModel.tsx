import { useMemo } from 'react';
import * as THREE from 'three';
import { useEditorStore, type DesignElement } from '../../stores/editorStore';

// 创建带贴图的材质
function useTexturedMaterial(element: DesignElement) {
  const textureLoader = useMemo(() => new THREE.TextureLoader(), []);

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: element.color,
      roughness: 0.2,
      metalness: 0.6,
      side: THREE.DoubleSide,
      transparent: element.opacity < 1,
      opacity: element.opacity,
    });

    if (element.texture) {
      textureLoader.load(element.texture, (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(element.textureScale || 1, element.textureScale || 1);
        tex.offset.set(element.textureOffsetX || 0, element.textureOffsetY || 0);
        tex.rotation = element.textureRotation || 0;
        mat.map = tex;
        mat.needsUpdate = true;
      });
    }

    return mat;
  }, [
    element.color,
    element.texture,
    element.textureScale,
    element.textureOffsetX,
    element.textureOffsetY,
    element.textureRotation,
    element.opacity,
    textureLoader,
  ]);

  return material;
}

// 创建弧形拍框段
function createFrameSegment(
  startAngle: number,
  endAngle: number,
  outerRadiusX: number,
  outerRadiusY: number,
  thickness: number,
  depth: number
): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const segments = 32;
  
  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (i / segments) * (endAngle - startAngle);
    const x = Math.cos(angle) * outerRadiusX;
    const y = Math.sin(angle) * outerRadiusY;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  
  const innerRadiusX = outerRadiusX - thickness;
  const innerRadiusY = outerRadiusY - thickness;
  for (let i = segments; i >= 0; i--) {
    const angle = startAngle + (i / segments) * (endAngle - startAngle);
    const x = Math.cos(angle) * innerRadiusX;
    const y = Math.sin(angle) * innerRadiusY;
    shape.lineTo(x, y);
  }
  
  shape.closePath();
  
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    bevelEnabled: false,
  });
  geo.computeBoundingBox();
  return geo;
}

// 单个部件组件
function RacketPart({ 
  element, 
  geometry, 
  isSelected,
  onSelect
}: { 
  element: DesignElement;
  geometry: THREE.BufferGeometry;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const material = useTexturedMaterial(element);

  if (!element.visible) return null;

  const position: [number, number, number] = [element.positionX, element.positionY, element.positionZ];

  return (
    <group>
      <mesh
        geometry={geometry}
        material={material}
        position={position}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        castShadow
      />
      {isSelected && (
        <mesh position={position}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

export default function RacketModel() {
  const design = useEditorStore((state) => state.design);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const selectElement = useEditorStore((state) => state.selectElement);

  // 拍框参数
  const frameOuterX = 0.45;
  const frameOuterY = 0.65;
  const frameThickness = 0.05;
  const frameDepth = 0.06;

  // 创建各段拍框几何体
  const frameGeometries = useMemo(() => {
    const top = createFrameSegment(Math.PI * 0.35, Math.PI * 0.65, frameOuterX, frameOuterY, frameThickness, frameDepth);
    const upperLeft = createFrameSegment(Math.PI * 0.65, Math.PI * 0.85, frameOuterX, frameOuterY, frameThickness, frameDepth);
    const upperRight = createFrameSegment(Math.PI * 0.15, Math.PI * 0.35, frameOuterX, frameOuterY, frameThickness, frameDepth);
    const left = createFrameSegment(Math.PI * 0.85, Math.PI * 1.15, frameOuterX, frameOuterY, frameThickness, frameDepth);
    const right = createFrameSegment(Math.PI * -0.15, Math.PI * 0.15, frameOuterX, frameOuterY, frameThickness, frameDepth);
    const lowerLeft = createFrameSegment(Math.PI * 1.15, Math.PI * 1.35, frameOuterX, frameOuterY, frameThickness, frameDepth);
    const lowerRight = createFrameSegment(Math.PI * -0.35, Math.PI * -0.15, frameOuterX, frameOuterY, frameThickness, frameDepth);
    const throat = createFrameSegment(Math.PI * 1.35, Math.PI * 1.65, frameOuterX, frameOuterY, frameThickness, frameDepth);

    return { top, upperLeft, upperRight, left, right, lowerLeft, lowerRight, throat };
  }, []);

  // 中杆几何体 - 加长
  const shaftGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.025, 0.02, 1.2, 12);
    geo.computeBoundingBox();
    return geo;
  }, []);

  // 锥形过渡
  const taperGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.03, 0.05, 0.2, 8);
    geo.computeBoundingBox();
    return geo;
  }, []);

  // 手柄几何体 - 加长
  const handleGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.055, 0.05, 0.7, 8);
    geo.computeBoundingBox();
    return geo;
  }, []);

  // 底盖
  const capGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.04, 0.06, 0.03, 12);
  }, []);

  const getElement = (id: string) => {
    return design.elements.find(el => el.id === id);
  };

  // 拍框各段配置
  const frameSegmentIds = [
    'frame_top', 'frame_upper_left', 'frame_upper_right',
    'frame_left', 'frame_right',
    'frame_lower_left', 'frame_lower_right', 'frame_throat'
  ];

  const frameGeometryMap: Record<string, THREE.ExtrudeGeometry> = {
    frame_top: frameGeometries.top,
    frame_upper_left: frameGeometries.upperLeft,
    frame_upper_right: frameGeometries.upperRight,
    frame_left: frameGeometries.left,
    frame_right: frameGeometries.right,
    frame_lower_left: frameGeometries.lowerLeft,
    frame_lower_right: frameGeometries.lowerRight,
    frame_throat: frameGeometries.throat,
  };

  // 获取手柄元素用于锥形过渡颜色
  const handleElement = getElement('handle');

  return (
    <group onClick={() => selectElement(null)}>
      {/* 拍框各段 */}
      {frameSegmentIds.map((id) => {
        const el = getElement(id);
        if (!el) return null;
        return (
          <RacketPart
            key={id}
            element={el}
            geometry={frameGeometryMap[id]}
            isSelected={selectedElementId === id}
            onSelect={() => selectElement(id)}
          />
        );
      })}

      {/* 中杆 */}
      {(() => {
        const el = getElement('shaft');
        if (!el) return null;
        return (
          <RacketPart
            element={el}
            geometry={shaftGeometry}
            isSelected={selectedElementId === 'shaft'}
            onSelect={() => selectElement('shaft')}
          />
        );
      })()}

      {/* 锥形过渡 */}
      {handleElement && handleElement.visible && (
        <mesh
          geometry={taperGeometry}
          position={[handleElement.positionX, handleElement.positionY + 0.45, handleElement.positionZ]}
          castShadow
        >
          <meshStandardMaterial color={handleElement.color} roughness={0.4} metalness={0.3} />
        </mesh>
      )}

      {/* 手柄 */}
      {(() => {
        const el = getElement('handle');
        if (!el) return null;
        return (
          <RacketPart
            element={el}
            geometry={handleGeometry}
            isSelected={selectedElementId === 'handle'}
            onSelect={() => selectElement('handle')}
          />
        );
      })()}

      {/* 底盖 */}
      {handleElement && handleElement.visible && (
        <mesh 
          geometry={capGeometry} 
          position={[handleElement.positionX, handleElement.positionY - 0.38, handleElement.positionZ]} 
          castShadow
        >
          <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.5} />
        </mesh>
      )}
    </group>
  );
}
