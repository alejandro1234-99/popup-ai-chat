import { useState } from "react";
import { createPortal } from "react-dom";
import ChatWindow from "./ChatWindow";
import Aura3DCharacter from "./Aura3DCharacter";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return createPortal(
    <>
      {!isOpen && <Aura3DCharacter onClick={() => setIsOpen(true)} />}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>,
    document.body
  );
};

export default ChatWidget;
