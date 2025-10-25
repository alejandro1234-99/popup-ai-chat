import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

interface Character3DProps {
  onClick: () => void;
}

// Componente del zorro AURA construido con formas 3D
const AuraFoxModel = ({ isWaving, onHover }: { isWaving: boolean; onHover: (hover: boolean) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Animaciones del personaje completo
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Respiración - movimiento sutil del cuerpo
    const breathScale = 1 + Math.sin(time * 2) * 0.03;
    groupRef.current.scale.y = breathScale;
    
    // Animación de saludo con el brazo
    if (rightArmRef.current && isWaving) {
      // Rotación del brazo saludando
      const waveRotation = Math.sin(time * 6) * 0.6 - 0.3;
      rightArmRef.current.rotation.z = waveRotation;
      // Movimiento del cuerpo durante el saludo
      groupRef.current.position.y = Math.abs(Math.sin(time * 6)) * 0.1;
    } else if (rightArmRef.current) {
      // Brazo en posición relajada
      rightArmRef.current.rotation.z = -0.2;
      
      // Idle animation - balanceo muy sutil
      groupRef.current.rotation.y = Math.sin(time * 0.8) * 0.05;
      
      // Hover bounce
      if (hovered) {
        groupRef.current.position.y = Math.sin(time * 4) * 0.08;
      } else {
        groupRef.current.position.y = Math.sin(time * 1.2) * 0.02;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => {
        setHovered(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
      }}
    >
      {/* Cuerpo - forma redondeada */}
      <mesh position={[0, -0.4, 0]}>
        <capsuleGeometry args={[0.35, 0.4, 16, 32]} />
        <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Cabeza - esfera grande */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Hocico/cara blanca */}
      <mesh position={[0, 0.15, 0.4]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#FFF5E6" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Nariz */}
      <mesh position={[0, 0.15, 0.62]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#3D3D3D" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Ojo izquierdo - blanco */}
      <mesh position={[-0.18, 0.35, 0.35]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Pupila izquierda */}
      <mesh position={[-0.16, 0.35, 0.45]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#2D2D2D" roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Ojo derecho - blanco */}
      <mesh position={[0.18, 0.35, 0.35]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Pupila derecha */}
      <mesh position={[0.16, 0.35, 0.45]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#2D2D2D" roughness={0.1} metalness={0.3} />
      </mesh>

      {/* Oreja izquierda */}
      <mesh position={[-0.25, 0.65, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.15, 0.4, 16]} />
        <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Interior oreja izquierda */}
      <mesh position={[-0.25, 0.65, 0.05]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshStandardMaterial color="#FFB380" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Oreja derecha */}
      <mesh position={[0.25, 0.65, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.15, 0.4, 16]} />
        <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Interior oreja derecha */}
      <mesh position={[0.25, 0.65, 0.05]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshStandardMaterial color="#FFB380" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Brazo izquierdo */}
      <mesh position={[-0.4, -0.3, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
        <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Brazo derecho (el que saluda) */}
      <group ref={rightArmRef} position={[0.4, -0.2, 0]}>
        <mesh rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.08, 0.35, 8, 16]} />
          <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* Mano */}
        <mesh position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>

      {/* Pierna izquierda */}
      <mesh position={[-0.15, -0.85, 0]}>
        <capsuleGeometry args={[0.12, 0.25, 8, 16]} />
        <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Pierna derecha */}
      <mesh position={[0.15, -0.85, 0]}>
        <capsuleGeometry args={[0.12, 0.25, 8, 16]} />
        <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
      </mesh>

      {/* Cola */}
      <mesh position={[0, -0.3, -0.35]} rotation={[0.5, 0, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#FF8C42" roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.15, -0.55]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#FFF5E6" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
};

const Aura3DCharacter = ({ onClick }: Character3DProps) => {
  const [isWaving, setIsWaving] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Animación de saludo inicial - más larga para que sea notoria
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Saludar periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 3000);
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[99999] group">
      {/* Glow effect background */}
      <div className="absolute inset-0 blur-2xl opacity-50 animate-pulse-slow pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
      </div>

      {/* 3D Canvas Container */}
      <div
        onClick={onClick}
        className="relative w-[180px] h-[180px] cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(96, 165, 250, 0.5))',
        }}
      >
        <Canvas
          shadows
          style={{ 
            background: 'transparent',
            pointerEvents: 'auto'
          }}
        >
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

          {/* Lights */}
          <ambientLight intensity={0.6} />
          <pointLight position={[2, 2, 2]} intensity={1} color="#60A5FA" castShadow />
          <pointLight position={[-2, -1, 2]} intensity={0.5} color="#8B5CF6" />
          <spotLight
            position={[0, 3, 2]}
            angle={0.3}
            penumbra={1}
            intensity={0.8}
            color="#93C5FD"
            castShadow
          />

          {/* Character */}
          <AuraFoxModel isWaving={isWaving} onHover={setIsHovered} />

          {/* Environment */}
          <Environment preset="city" />
        </Canvas>

        {/* Interactive rings */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-400/20 animate-ping-slow pointer-events-none" />

        {/* Name tag on hover */}
        <div
          className={`absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            Hola, soy AURA 👋
          </div>
        </div>

        {/* Online indicator */}
        {!isHovered && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-lg pointer-events-none" />
        )}
      </div>

      {/* Click hint */}
      <div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-blue-300 whitespace-nowrap transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Click para chatear
      </div>
    </div>
  );
};

export default Aura3DCharacter;
