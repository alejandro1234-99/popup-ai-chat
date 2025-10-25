import { useState } from "react";
import ChatWindow from "./ChatWindow";
import auraAvatar from "@/assets/aura-avatar.png";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-[90px] h-[90px] rounded-full relative flex items-center justify-center bg-[#0f172a]/70 backdrop-blur-md shadow-[0_0_25px_rgba(96,165,250,0.3)] border border-[#1e293b] overflow-visible hover:shadow-[0_0_35px_rgba(96,165,250,0.5)] transition-shadow duration-300"
          aria-label="Abrir chat con AURA"
        >
          {/* Inner glow gradient layer */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#60A5FA]/10 to-[#7C3AED]/10 animate-pulse-slow"></div>
          
          {/* Glass reflection effect */}
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/5 blur-sm"></div>
          
          {/* AURA avatar with floating animation */}
          <div className="relative z-10 w-20 h-20 flex items-center justify-center animate-float-subtle">
            <img 
              src={auraAvatar} 
              alt="AURA bot" 
              className="w-16 h-16 object-contain animate-gentle-wave drop-shadow-[0_0_15px_rgba(96,165,250,0.6)] scale-x-[-1]"
            />
          </div>
          
          {/* Outer rim glow */}
          <div className="absolute inset-[-2px] rounded-full bg-gradient-to-br from-[#60A5FA]/20 to-[#7C3AED]/20 blur-sm -z-10"></div>
        </button>
      )}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatWidget;
