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
          className="fixed bottom-6 right-6 z-50 w-[70px] h-[70px] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center hover:scale-110 hover:shadow-[0_6px_20px_rgba(96,165,250,0.5)] transition-all duration-300 animate-float"
          aria-label="Abrir chat con AURA"
        >
          <img 
            src={auraAvatar} 
            alt="AURA bot" 
            className="w-full h-full object-cover p-2 animate-wave"
          />
        </button>
      )}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatWidget;
