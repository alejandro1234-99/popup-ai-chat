import { useState } from "react";
import { createPortal } from "react-dom";
import ChatWindow from "./ChatWindow";
import AuraCharacter from "./AuraCharacter";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return createPortal(
    <>
      {!isOpen && <AuraCharacter onClick={() => setIsOpen(true)} />}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>,
    document.body
  );
};

export default ChatWidget;
