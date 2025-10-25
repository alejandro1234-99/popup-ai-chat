import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ChatWindow from "./ChatWindow";
import Zuno3DCharacter from "./Zuno3DCharacter";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Verificación de avatar al montar
  useEffect(() => {
    console.log("🦊 ChatWidget montado - Avatar: Zuno v2 (Emoji 3D)");
    console.log("🚫 Fallback desactivado - Solo emoji 3D permitido");
  }, []);

  return createPortal(
    <>
      {!isOpen && <Zuno3DCharacter onClick={() => setIsOpen(true)} />}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>,
    document.body
  );
};

export default ChatWidget;
