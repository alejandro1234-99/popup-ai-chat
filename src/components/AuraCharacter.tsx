import { useState, useEffect } from "react";
import auraWaving from "@/assets/aura-character-waving.png";
import auraIdle from "@/assets/aura-character-idle.png";

interface AuraCharacterProps {
  onClick: () => void;
}

const AuraCharacter = ({ onClick }: AuraCharacterProps) => {
  const [isWaving, setIsWaving] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Animación de saludo inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(false);
    }, 3000); // Saluda durante 3 segundos

    return () => clearTimeout(timer);
  }, []);

  // Volver a saludar cada cierto tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2000);
    }, 30000); // Saluda cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[99999] group">
      {/* Glow effect */}
      <div className="absolute inset-0 blur-2xl opacity-60 animate-pulse-slow pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
      </div>

      {/* Character container */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-[140px] h-[140px] transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Abrir chat con AURA"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(96, 165, 250, 0.4))',
        }}
      >
        {/* Breathing animation container */}
        <div className="absolute inset-0 animate-breathing">
          <img
            src={isWaving ? auraWaving : auraIdle}
            alt="AURA - Asistente Virtual"
            className={`w-full h-full object-contain transition-all duration-500 ${
              isHovered ? 'animate-gentle-bounce' : ''
            }`}
          />
        </div>

        {/* Interactive rings */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping-slow pointer-events-none" />
        <div className="absolute inset-0 rounded-full border border-purple-400/20 animate-pulse-slow pointer-events-none" />

        {/* Name tag on hover */}
        <div
          className={`absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            Hola, soy AURA 👋
          </div>
        </div>

        {/* Pulse indicator */}
        {!isHovered && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-white shadow-lg" />
        )}
      </button>

      {/* Click hint */}
      <div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-blue-300 whitespace-nowrap transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Click para chatear
      </div>
    </div>
  );
};

export default AuraCharacter;
