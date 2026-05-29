import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import RacketModel from './RacketModel';

// 羽毛球场地颜色
const COURT_COLORS = {
  floor: '#2E7D32',      // 绿色场地
  lines: '#ffffff',       // 白色线
  border: '#1B5E20',      // 深绿色边框
  wall: '#f5f5f5',        // 墙壁颜色
};

interface SceneProps {
  className?: string;
  useCourtBackground?: boolean;
}

export default function Scene({ className, useCourtBackground = false }: SceneProps) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{
          position: [2, 1.5, 2],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          powerPreference: 'default',
        }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(useCourtBackground ? COURT_COLORS.wall : '#f0f0f0');
        }}
        fallback={
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#f0f0f0'
          }}>
            <p style={{ color: '#666' }}>加载中...</p>
          </div>
        }
      >
        {/* 灯光 */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
        />
        <directionalLight position={[-3, 5, -3]} intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={0.3} />

        {/* 球拍模型 */}
        <RacketModel />

        {/* 地面/场地 */}
        {useCourtBackground ? (
          <>
            {/* 羽毛球场地地面 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color={COURT_COLORS.floor} />
            </mesh>
            
            {/* 场地线 - 底线 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, 3]}>
              <planeGeometry args={[6.1, 0.05]} />
              <meshStandardMaterial color={COURT_COLORS.lines} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.19, -3]}>
              <planeGeometry args={[6.1, 0.05]} />
              <meshStandardMaterial color={COURT_COLORS.lines} />
            </mesh>
            
            {/* 场地线 - 边线 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.05, -1.19, 0]}>
              <planeGeometry args={[0.05, 6]} />
              <meshStandardMaterial color={COURT_COLORS.lines} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.05, -1.19, 0]}>
              <planeGeometry args={[0.05, 6]} />
              <meshStandardMaterial color={COURT_COLORS.lines} />
            </mesh>
            
            {/* 场地线 - 中线 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
              <planeGeometry args={[0.05, 6]} />
              <meshStandardMaterial color={COURT_COLORS.lines} />
            </mesh>
          </>
        ) : (
          <>
            {/* 简单地面 */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#e5e5e5" />
            </mesh>
            <gridHelper args={[10, 20, '#cccccc', '#eeeeee']} position={[0, -1.19, 0]} />
          </>
        )}

        {/* 控制器 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={8}
          target={[0, -0.2, 0]}
        />
      </Canvas>
    </div>
  );
}
