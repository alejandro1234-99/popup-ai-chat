import { useState } from "react";
import { createPortal } from "react-dom";
import ChatWindow from "./ChatWindow";
import auraAvatar from "@/assets/aura-avatar.png";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return createPortal(
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[99999] w-[90px] h-[90px] rounded-full flex items-center justify-center bg-[rgba(15,23,42,0.7)] backdrop-blur-[10px] shadow-[0_0_25px_rgba(96,165,250,0.3)] border border-[#1e293b] overflow-hidden hover:shadow-[0_0_35px_rgba(96,165,250,0.5)] transition-shadow duration-300"
          aria-label="Abrir chat con AURA"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px'
          }}
        >
          <div 
            className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
            }}
          >
            <img 
              src={auraAvatar} 
              alt="AURA bot" 
              className="w-[110%] h-[110%] object-contain animate-gentle-wave drop-shadow-[0_0_15px_rgba(96,165,250,0.6)] scale-x-[-1]"
            />
          </div>
        </button>
      )}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>,
    document.body
  );
};

export default ChatWidget;
