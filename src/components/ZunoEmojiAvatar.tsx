import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { ZunoFoxEmoji3D } from "./Zuno3DCharacter";

interface ZunoEmojiAvatarProps {
  size?: number;
  className?: string;
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

const ZunoEmojiAvatar = ({ size = 40, className = "" }: ZunoEmojiAvatarProps) => {
  const [supported, setSupported] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const ok = isWebGLAvailable();
    setSupported(ok);
    console.log("🦊 Renderizando avatar: ZunoEmojiAvatar (procedural)");
    console.log("🔗 Asset URL: procedural://ZunoFoxEmoji3D_v2");

    if (!ok) {
      // reintento simple a los 2s
      const t = setTimeout(() => setRetryKey(k => k + 1), 2000);
      return () => clearTimeout(t);
    }
  }, [retryKey]);

  if (!supported) {
    // Placeholder neutro: círculo gris (sin fallback al muñeco viejo)
    return (
      <div
        className={`rounded-full bg-slate-600/60 border border-white/10 shadow-inner ${className}`}
        style={{ width: size, height: size }}
        aria-label="placeholder-avatar"
        title="Cargando avatar 🦊"
      />
    );
  }

  return (
    <div className={className} style={{ width: size, height: size }}>
      <Canvas style={{ background: 'transparent' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 3.6]} fov={50} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.6} />
        <ZunoFoxEmoji3D isWaving={false} onHover={() => {}} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ZunoEmojiAvatar;
