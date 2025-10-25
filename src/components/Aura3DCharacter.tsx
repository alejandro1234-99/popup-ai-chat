import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import auraFoxAvatar from "@/assets/aura-fox-avatar.png";

interface Character3DProps {
  onClick: () => void;
}

// Componente del zorro AURA en 3D
const AuraFoxModel = ({ isWaving, onHover }: { isWaving: boolean; onHover: (hover: boolean) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useLoader(THREE.TextureLoader, auraFoxAvatar);
  
  // Animaciones expresivas: respiración, saludo y movimiento idle
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Breathing animation - más notoria
    const breathScale = 1 + Math.sin(time * 2) * 0.05;
    meshRef.current.scale.set(breathScale, breathScale, 1);
    
    // Wave animation - movimiento completo de saludo
    if (isWaving) {
      const waveIntensity = Math.sin(time * 6) * 0.3;
      meshRef.current.rotation.z = waveIntensity;
      // Movimiento vertical durante el saludo
      meshRef.current.position.y = Math.abs(Math.sin(time * 6)) * 0.15;
      // Ligera rotación en Y para dar más vida
      meshRef.current.rotation.y = Math.sin(time * 3) * 0.1;
    } else {
      // Idle animation - movimiento sutil de cabeza
      meshRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
      meshRef.current.rotation.y = Math.sin(time * 0.8) * 0.08;
      
      // Hover bounce - más pronunciado
      if (hovered) {
        meshRef.current.position.y = Math.sin(time * 4) * 0.15;
      } else {
        meshRef.current.position.y = Math.sin(time * 1.2) * 0.03;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => {
        setHovered(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
      }}
    >
      <planeGeometry args={[2.8, 2.8]} />
      <meshStandardMaterial 
        map={texture} 
        transparent={true}
        side={THREE.DoubleSide}
        metalness={0.3}
        roughness={0.7}
        emissive="#FFE5CC"
        emissiveIntensity={0.2}
      />
    </mesh>
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
