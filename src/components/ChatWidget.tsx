import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatWindow from "./ChatWindow";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-[hsl(250,85%,75%)] text-primary-foreground shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <X className="h-6 w-6 mx-auto" />
        ) : (
          <MessageCircle className="h-6 w-6 mx-auto" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatWidget;
