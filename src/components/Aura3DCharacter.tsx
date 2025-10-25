import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface Character3DProps {
  onClick: () => void;
}

// Componente del personaje 3D
const AuraModel = ({ isWaving, onHover }: { isWaving: boolean; onHover: (hover: boolean) => void }) => {
  const leftArmRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Animación de respiración y saludo
  useFrame((state) => {
    if (!leftArmRef.current || !groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Breathing animation (sutil)
    const breathScale = 1 + Math.sin(time * 2) * 0.02;
    groupRef.current.scale.y = breathScale;
    
    // Idle rotation
    if (!isWaving) {
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
    
    // Wave animation - mueve el brazo izquierdo
    if (isWaving) {
      const waveRotation = Math.sin(time * 8) * 0.3;
      leftArmRef.current.rotation.z = -0.5 + waveRotation;
    } else {
      leftArmRef.current.rotation.z = 0.2;
    }
    
    // Hover bounce
    if (hovered) {
      groupRef.current.position.y = Math.sin(time * 3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh 
        position={[0, 0.7, 0]}
        onPointerOver={() => {
          setHovered(true);
          onHover(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(false);
        }}
      >
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial 
          color="#60A5FA" 
          emissive="#2563EB"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.12, 0.75, 0.3]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1E293B" emissive="#8B5CF6" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.12, 0.75, 0.3]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#1E293B" emissive="#8B5CF6" emissiveIntensity={0.5} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.6, 32]} />
        <meshStandardMaterial 
          color="#3B82F6" 
          emissive="#1D4ED8"
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Left Arm (waving) */}
      <group ref={leftArmRef} position={[-0.35, 0.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial color="#60A5FA" metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#93C5FD" metalness={0.3} roughness={0.5} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.35, 0.3, 0]}>
        <mesh rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial color="#60A5FA" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#93C5FD" metalness={0.3} roughness={0.5} />
        </mesh>
      </group>

      {/* Legs */}
      <mesh position={[-0.15, -0.45, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#2563EB" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.15, -0.45, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.6, 16]} />
        <meshStandardMaterial color="#2563EB" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
};

const Aura3DCharacter = ({ onClick }: Character3DProps) => {
  const [isWaving, setIsWaving] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Animación de saludo inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Saludar periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2000);
    }, 30000);

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
          <AuraModel isWaving={isWaving} onHover={setIsHovered} />

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
