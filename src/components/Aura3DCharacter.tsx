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
    
    // Respiración suave y constante - sensación de vida
    const breathScale = 1 + Math.sin(time * 1.2) * 0.015;
    groupRef.current.scale.y = breathScale;
    groupRef.current.scale.x = 1 + Math.sin(time * 1.2) * 0.008;
    
    // Animación de saludo con el brazo - suave y natural
    if (rightArmRef.current && isWaving) {
      // Rotación del brazo saludando - movimiento fluido y elegante
      const waveProgress = (Math.sin(time * 3) + 1) / 2; // 0 to 1, más lento
      const easedWave = waveProgress * waveProgress * (3 - 2 * waveProgress); // smooth easing
      // Reducido a ~25-30 grados (0.4-0.5 radianes)
      const waveRotation = easedWave * 0.5 - 0.25;
      rightArmRef.current.rotation.z = waveRotation;
      
      // Oscilación suave de la mano
      rightArmRef.current.rotation.x = Math.sin(time * 5) * 0.08;
      
      // Balanceo muy sutil del cuerpo durante el saludo
      groupRef.current.rotation.z = Math.sin(time * 3) * 0.02;
      groupRef.current.position.y = Math.sin(time * 3) * 0.03;
    } else if (rightArmRef.current) {
      // Brazo en posición relajada
      rightArmRef.current.rotation.z = -0.2;
      rightArmRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;
      
      // Idle animation - balanceo muy sutil para dar vida
      groupRef.current.rotation.y = Math.sin(time * 0.6) * 0.02;
      
      // Movimiento vertical suave por respiración
      if (hovered) {
        groupRef.current.position.y = Math.sin(time * 2) * 0.04;
      } else {
        groupRef.current.position.y = Math.sin(time * 1.2) * 0.012;
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
      {/* Cuerpo - forma redondeada más natural con textura suave */}
      <mesh position={[0, -0.4, 0]}>
        <capsuleGeometry args={[0.36, 0.48, 32, 32]} />
        <meshStandardMaterial 
          color="#FF7A34" 
          roughness={0.65} 
          metalness={0.08}
          emissive="#FF6B28"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Pecho blanco - degradado suave */}
      <mesh position={[0, -0.35, 0.32]}>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshStandardMaterial 
          color="#FFF5E6" 
          roughness={0.6} 
          metalness={0.02}
          emissive="#FFF5E6"
          emissiveIntensity={0.02}
        />
      </mesh>

      {/* Cabeza - esfera grande con proporciones equilibradas */}
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.46, 64, 64]} />
        <meshStandardMaterial 
          color="#FF7A34" 
          roughness={0.65} 
          metalness={0.08}
          emissive="#FF6B28"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Hocico/cara blanca - suave y expresiva */}
      <mesh position={[0, 0.14, 0.38]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFBF0" 
          roughness={0.55} 
          metalness={0.03}
          emissive="#FFFBF0"
          emissiveIntensity={0.03}
        />
      </mesh>

      {/* Nariz - brillante y expresiva */}
      <mesh position={[0, 0.14, 0.62]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial 
          color="#2A2A2A" 
          roughness={0.2} 
          metalness={0.3}
          emissive="#1a1a1a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Ojo izquierdo - grande, brillante y lleno de vida */}
      <mesh position={[-0.18, 0.4, 0.36]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.05} 
          metalness={0.1}
          emissive="#FFFFFF"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Pupila izquierda - profunda y expresiva */}
      <mesh position={[-0.16, 0.4, 0.48]}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshStandardMaterial 
          color="#1A1A1A" 
          roughness={0.02} 
          metalness={0.5}
          emissive="#0a0a0a"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Brillo principal en ojo izquierdo - muy visible */}
      <mesh position={[-0.14, 0.43, 0.53]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0} 
          metalness={1}
          emissive="#FFFFFF"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Brillo secundario - reflejo de luz */}
      <mesh position={[-0.18, 0.38, 0.52]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0} 
          metalness={1}
          emissive="#FFFFFF"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Ojo derecho - grande, brillante y lleno de vida */}
      <mesh position={[0.18, 0.4, 0.36]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0.05} 
          metalness={0.1}
          emissive="#FFFFFF"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Pupila derecha - profunda y expresiva */}
      <mesh position={[0.16, 0.4, 0.48]}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshStandardMaterial 
          color="#1A1A1A" 
          roughness={0.02} 
          metalness={0.5}
          emissive="#0a0a0a"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Brillo principal en ojo derecho - muy visible */}
      <mesh position={[0.14, 0.43, 0.53]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0} 
          metalness={1}
          emissive="#FFFFFF"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Brillo secundario - reflejo de luz */}
      <mesh position={[0.18, 0.38, 0.52]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          roughness={0} 
          metalness={1}
          emissive="#FFFFFF"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Oreja izquierda - más suave */}
      <mesh position={[-0.28, 0.68, 0]} rotation={[0, 0, -0.25]}>
        <coneGeometry args={[0.16, 0.45, 32]} />
        <meshStandardMaterial 
          color="#FF8C42" 
          roughness={0.7} 
          metalness={0.05}
          emissive="#FF8C42"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Interior oreja izquierda */}
      <mesh position={[-0.28, 0.68, 0.05]} rotation={[0, 0, -0.25]}>
        <coneGeometry args={[0.11, 0.35, 32]} />
        <meshStandardMaterial 
          color="#FFB380" 
          roughness={0.5} 
          metalness={0.02}
        />
      </mesh>

      {/* Oreja derecha - más suave */}
      <mesh position={[0.28, 0.68, 0]} rotation={[0, 0, 0.25]}>
        <coneGeometry args={[0.16, 0.45, 32]} />
        <meshStandardMaterial 
          color="#FF8C42" 
          roughness={0.7} 
          metalness={0.05}
          emissive="#FF8C42"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Interior oreja derecha */}
      <mesh position={[0.28, 0.68, 0.05]} rotation={[0, 0, 0.25]}>
        <coneGeometry args={[0.11, 0.35, 32]} />
        <meshStandardMaterial 
          color="#FFB380" 
          roughness={0.5} 
          metalness={0.02}
        />
      </mesh>

      {/* Brazo izquierdo - más natural */}
      <mesh position={[-0.42, -0.28, 0]} rotation={[0, 0, 0.25]}>
        <capsuleGeometry args={[0.09, 0.38, 16, 32]} />
        <meshStandardMaterial 
          color="#FF8C42" 
          roughness={0.7} 
          metalness={0.05}
          emissive="#FF8C42"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Mano izquierda */}
      <mesh position={[-0.5, -0.6, 0]}>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial 
          color="#FF8C42" 
          roughness={0.7} 
          metalness={0.05}
        />
      </mesh>

      {/* Brazo derecho (el que saluda) - más fluido */}
      <group ref={rightArmRef} position={[0.42, -0.18, 0]}>
        <mesh rotation={[0, 0, -0.2]}>
          <capsuleGeometry args={[0.09, 0.38, 16, 32]} />
          <meshStandardMaterial 
            color="#FF8C42" 
            roughness={0.7} 
            metalness={0.05}
            emissive="#FF8C42"
            emissiveIntensity={0.05}
          />
        </mesh>
        {/* Mano que saluda */}
        <mesh position={[0, -0.28, 0]}>
          <sphereGeometry args={[0.11, 32, 32]} />
          <meshStandardMaterial 
            color="#FF8C42" 
            roughness={0.7} 
            metalness={0.05}
          />
        </mesh>
      </group>

      {/* Pierna izquierda - más proporcionada */}
      <mesh position={[-0.16, -0.88, 0]}>
        <capsuleGeometry args={[0.13, 0.28, 16, 32]} />
        <meshStandardMaterial 
          color="#FF8C42" 
          roughness={0.7} 
          metalness={0.05}
          emissive="#FF8C42"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Pierna derecha - más proporcionada */}
      <mesh position={[0.16, -0.88, 0]}>
        <capsuleGeometry args={[0.13, 0.28, 16, 32]} />
        <meshStandardMaterial 
          color="#FF8C42" 
          roughness={0.7} 
          metalness={0.05}
          emissive="#FF8C42"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Cola - esponjosa con degradado */}
      <mesh position={[0, -0.32, -0.38]} rotation={[0.5, 0, 0]}>
        <sphereGeometry args={[0.27, 64, 64]} />
        <meshStandardMaterial 
          color="#FF7A34" 
          roughness={0.75} 
          metalness={0.03}
          emissive="#FF6B28"
          emissiveIntensity={0.06}
        />
      </mesh>
      {/* Punta de la cola - blanca y suave */}
      <mesh position={[0, -0.18, -0.6]} rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[0.19, 64, 64]} />
        <meshStandardMaterial 
          color="#FFFBF0" 
          roughness={0.65} 
          metalness={0.02}
          emissive="#FFFBF0"
          emissiveIntensity={0.04}
        />
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
