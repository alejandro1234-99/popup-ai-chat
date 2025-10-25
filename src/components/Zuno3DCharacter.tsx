import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

interface Character3DProps {
  onClick: () => void;
}

// Componente emoji 3D del zorro 🦊 - ZUNO v2 (único avatar permitido)
export const ZunoFoxEmoji3D = ({ isWaving, onHover }: { isWaving: boolean; onHover: (hover: boolean) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const blinkTimerRef = useRef<number>(0);
  
  // Log de verificación - confirmación del avatar activo y limpieza de cachés
  useEffect(() => {
    console.log("✅ Avatar activo: 🦊 Zuno v2 (Emoji 3D)");
    console.log("📦 Asset ID: ZunoFoxEmoji3D_v2 - Modelo 3D procedural (sin URL)");
    console.log("🚫 Cache desactivado - No fallback al avatar anterior");
    
    // Limpiar localStorage/sessionStorage de avatares anteriores
    const keysToRemove = ['avatar', 'assistantAvatar', 'assetVersion', 'emojiFox', 'auraAvatar'];
    keysToRemove.forEach(key => {
      try { localStorage.removeItem(key); } catch {}
      try { sessionStorage.removeItem(key); } catch {}
    });
    
    // Limpiar caches y desregistrar service workers si existen
    if ('caches' in window) {
      caches.keys().then(keys => keys.forEach(k => caches.delete(k))).catch(() => {});
    }
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister())).catch(() => {});
    }

    // Establecer nuevo avatar en storage
    try { localStorage.setItem('currentAvatar', 'ZunoFoxEmoji3D_v2'); } catch {}
  }, []);
  
  // Sistema de parpadeo natural
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      
      // Siguiente parpadeo en 2-5 segundos
      const nextBlink = 2000 + Math.random() * 3000;
      blinkTimerRef.current = window.setTimeout(blink, nextBlink);
    };
    
    // Primer parpadeo después de 2 segundos
    blinkTimerRef.current = window.setTimeout(blink, 2000);
    
    return () => {
      if (blinkTimerRef.current) {
        clearTimeout(blinkTimerRef.current);
      }
    };
  }, []);
  
  // Animaciones de la cabeza
  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Respiración suave - sensación de vida
    const breathScale = 1 + Math.sin(time * 1.2) * 0.008;
    groupRef.current.scale.y = breathScale;
    groupRef.current.scale.x = 1 + Math.sin(time * 1.2) * 0.005;
    
    // Animación de saludo inicial - movimiento sutil de cabeza
    if (isWaving) {
      // Inclinación suave de la cabeza
      headRef.current.rotation.z = Math.sin(time * 3) * 0.12;
      headRef.current.rotation.y = Math.sin(time * 2) * 0.08;
      headRef.current.position.y = Math.sin(time * 3) * 0.04;
    } else {
      // Idle - movimientos muy sutiles
      headRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
      headRef.current.rotation.y = Math.sin(time * 0.6) * 0.03;
      headRef.current.rotation.x = Math.sin(time * 0.7) * 0.015;
      
      // Movimiento vertical suave
      if (hovered) {
        headRef.current.position.y = Math.sin(time * 2) * 0.03;
      } else {
        headRef.current.position.y = Math.sin(time * 1) * 0.01;
      }
    }
    
    // Animación de parpadeo
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkScale = isBlinking ? 0.1 : 1;
      const winkScale = isWinking ? 0.1 : 1;
      
      leftEyeRef.current.scale.y = isWinking ? winkScale : blinkScale;
      rightEyeRef.current.scale.y = blinkScale;
    }
  });

  // Interacción al hacer clic
  const handleClick = () => {
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 300);
  };

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
      }}
    >
      {/* Grupo de la cabeza - permite rotaciones independientes */}
      <group ref={headRef} position={[0, 0, 0]}>
      {/* Cabeza principal - esfera grande estilo emoji 🦊 */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.68, 64, 64]} />
        <meshStandardMaterial 
          color="#FF7A34" 
          roughness={0.35} 
          metalness={0.12}
          emissive="#FF6B28"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Marcas blancas en las mejillas - estilo emoji 🦊 */}
      <mesh position={[-0.38, -0.1, 0.48]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFBF0" 
          roughness={0.45} 
          metalness={0.06}
          emissive="#FFFBF0"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh position={[0.38, -0.1, 0.48]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFBF0" 
          roughness={0.45} 
          metalness={0.06}
          emissive="#FFFBF0"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Hocico/cara - prominente estilo emoji 🦊 */}
      <mesh position={[0, -0.18, 0.52]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFBF0" 
          roughness={0.4} 
          metalness={0.06}
          emissive="#FFFBF0"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Nariz pequeña y brillante - estilo emoji 🦊 */}
      <mesh position={[0, -0.14, 0.85]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial 
          color="#1A1A1A" 
          roughness={0.08} 
          metalness={0.5}
          emissive="#0a0a0a"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Boca sonriente - estilo emoji 🦊 */}
      <mesh position={[0, -0.32, 0.74]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.14, 0.025, 16, 32, Math.PI]} />
        <meshStandardMaterial 
          color="#2A2A2A" 
          roughness={0.5} 
          metalness={0.15}
          emissive="#1a1a1a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Ojo izquierdo - grande y expresivo estilo emoji 🦊 */}
      <group ref={leftEyeRef} position={[-0.24, 0.14, 0.5]}>
        {/* Blanco del ojo */}
        <mesh>
          <sphereGeometry args={[0.19, 32, 32]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0.03} 
            metalness={0.2}
            emissive="#FFFFFF"
            emissiveIntensity={0.12}
          />
        </mesh>
        {/* Pupila */}
        <mesh position={[0.02, -0.01, 0.17]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial 
            color="#0A0A0A" 
            roughness={0.01} 
            metalness={0.7}
            emissive="#000000"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Brillo principal */}
        <mesh position={[0.06, 0.06, 0.23]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0} 
            metalness={1}
            emissive="#FFFFFF"
            emissiveIntensity={2}
          />
        </mesh>
        {/* Brillo secundario */}
        <mesh position={[-0.03, -0.04, 0.22]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0} 
            metalness={1}
            emissive="#FFFFFF"
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>

      {/* Ojo derecho - grande y expresivo estilo emoji 🦊 */}
      <group ref={rightEyeRef} position={[0.24, 0.14, 0.5]}>
        {/* Blanco del ojo */}
        <mesh>
          <sphereGeometry args={[0.19, 32, 32]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0.03} 
            metalness={0.2}
            emissive="#FFFFFF"
            emissiveIntensity={0.12}
          />
        </mesh>
        {/* Pupila */}
        <mesh position={[-0.02, -0.01, 0.17]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial 
            color="#0A0A0A" 
            roughness={0.01} 
            metalness={0.7}
            emissive="#000000"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Brillo principal */}
        <mesh position={[-0.06, 0.06, 0.23]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0} 
            metalness={1}
            emissive="#FFFFFF"
            emissiveIntensity={2}
          />
        </mesh>
        {/* Brillo secundario */}
        <mesh position={[0.03, -0.04, 0.22]}>
          <sphereGeometry args={[0.022, 16, 16]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            roughness={0} 
            metalness={1}
            emissive="#FFFFFF"
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>

      {/* Oreja izquierda - triangular estilo emoji 🦊 */}
      <mesh position={[-0.42, 0.55, -0.08]} rotation={[0.15, 0, -0.25]}>
        <coneGeometry args={[0.22, 0.6, 32]} />
        <meshStandardMaterial 
          color="#FF7A34" 
          roughness={0.4} 
          metalness={0.15}
          emissive="#FF6B28"
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Interior oreja izquierda */}
      <mesh position={[-0.42, 0.54, -0.02]} rotation={[0.15, 0, -0.25]}>
        <coneGeometry args={[0.15, 0.46, 32]} />
        <meshStandardMaterial 
          color="#FFB380" 
          roughness={0.35} 
          metalness={0.08}
          emissive="#FFB380"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Oreja derecha - triangular estilo emoji 🦊 */}
      <mesh position={[0.42, 0.55, -0.08]} rotation={[0.15, 0, 0.25]}>
        <coneGeometry args={[0.22, 0.6, 32]} />
        <meshStandardMaterial 
          color="#FF7A34" 
          roughness={0.4} 
          metalness={0.15}
          emissive="#FF6B28"
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Interior oreja derecha */}
      <mesh position={[0.42, 0.54, -0.02]} rotation={[0.15, 0, 0.25]}>
        <coneGeometry args={[0.15, 0.46, 32]} />
        <meshStandardMaterial 
          color="#FFB380" 
          roughness={0.35} 
          metalness={0.08}
          emissive="#FFB380"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Detalles de textura - manchas sutiles en la frente estilo emoji 🦊 */}
      <mesh position={[0, 0.38, 0.54]}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial 
          color="#FF9960" 
          roughness={0.45} 
          metalness={0.1}
          transparent={true}
          opacity={0.35}
          emissive="#FF8F50"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      </group>
    </group>
  );
};

const Zuno3DCharacter = ({ onClick }: Character3DProps) => {
  const [isWaving, setIsWaving] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showVerification, setShowVerification] = useState(true);

  // Mensaje de verificación temporal (2 segundos)
  useEffect(() => {
    const verificationTimer = setTimeout(() => {
      setShowVerification(false);
    }, 2000);
    return () => clearTimeout(verificationTimer);
  }, []);

  // Animación de saludo inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Saludar periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2000);
    }, 20000);

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

          {/* Avatar emoji 3D del zorro - ÚNICO PERMITIDO */}
          <ZunoFoxEmoji3D isWaving={isWaving} onHover={setIsHovered} />

          {/* Environment */}
          <Environment preset="city" />
        </Canvas>

        {/* Mensaje de verificación temporal */}
        {showVerification && (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-fade-in pointer-events-none">
            ✅ Avatar activo: 🦊 Zuno v2
          </div>
        )}

        {/* Interactive rings */}
        <div className="absolute inset-0 rounded-full border-2 border-orange-400/20 animate-ping-slow pointer-events-none" />

        {/* Name tag on hover */}
        <div
          className={`absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            ¡Hola! Soy Zuno 🦊
          </div>
        </div>

        {/* Online indicator */}
        {!isHovered && !showVerification && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-lg pointer-events-none" />
        )}
      </div>

      {/* Click hint */}
      <div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-orange-300 whitespace-nowrap transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Click para chatear
      </div>
    </div>
  );
};

export default Zuno3DCharacter;
