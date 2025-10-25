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
          className="fixed bottom-6 right-6 z-50 w-[80px] h-[80px] rounded-full shadow-[0_4px_15px_rgba(96,165,250,0.4)] overflow-hidden bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur-sm border border-blue-400/30 flex items-center justify-center hover:scale-110 hover:shadow-[0_6px_25px_rgba(96,165,250,0.6)] transition-all duration-300 animate-float group"
          aria-label="Abrir chat con AURA"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl animate-pulse" />
            {/* Avatar with wave animation */}
            <img 
              src={auraAvatar} 
              alt="AURA bot" 
              className="relative w-14 h-14 object-contain animate-wave group-hover:animate-bounce"
            />
          </div>
        </button>
      )}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatWidget;
