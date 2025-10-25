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
          className="fixed bottom-6 right-6 z-50 w-[80px] h-[80px] rounded-full bg-[#0f172a]/70 backdrop-blur-md shadow-[0_0_20px_rgba(96,165,250,0.3)] flex items-center justify-center hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-shadow duration-300 overflow-hidden border border-white/10"
          aria-label="Abrir chat con AURA"
        >
          <img 
            src={auraAvatar} 
            alt="AURA bot" 
            className="w-16 h-16 object-contain animate-gentle-wave"
          />
        </button>
      )}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatWidget;
