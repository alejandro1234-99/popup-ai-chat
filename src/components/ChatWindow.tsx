import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import MessageBubble from "./MessageBubble";
import { useToast } from "@/hooks/use-toast";
import auraAvatar from "@/assets/aura-avatar.png";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ChatWindowProps {
  onClose: () => void;
}

const WEBHOOK_URL = "https://n8n-n8n.e07dhf.easypanel.host/webhook/c2ee33f4-37d4-49c0-975e-a47e7f0a7e29";

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("Sending message to n8n webhook:", userMessage.content);
      console.log("Webhook URL:", WEBHOOK_URL);
      
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error("Webhook responded with error:", response.status, response.statusText);
        throw new Error(`Webhook error: ${response.status}`);
      }

      // Get response as text first to handle potential formatting issues
      const textResponse = await response.text();
      console.log("Raw response text:", textResponse);
      
      // Try to parse the JSON manually
      let data: any;
      try {
        // Clean the response - extract only the JSON part
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          data = JSON.parse(jsonMatch[0]);
        } else {
          data = JSON.parse(textResponse);
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        throw new Error("La respuesta no es un JSON válido");
      }

      console.log("Parsed data:", data);
      
      let assistantContent: string;
      
      if (data.type === "text") {
        // Simple text response
        assistantContent = data.content || "";
      } else if (data.type === "product_cards" && Array.isArray(data.items) && data.items.length > 0) {
        // Product cards response - store complete JSON
        assistantContent = JSON.stringify(data);
      } else {
        // Unknown format, treat as text
        assistantContent = typeof data === "string" ? data : (data.content || JSON.stringify(data));
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantContent },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      
      let errorMessage = "Ups, hubo un error al procesar la respuesta.";
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "No se puede conectar al webhook. Verifica que:\n\n" +
          "1. El webhook de n8n esté activo\n" +
          "2. El workflow esté ejecutándose";
        
        toast({
          title: "Error de conexión",
          description: "El webhook no responde. Verifica el workflow de n8n.",
          variant: "destructive",
        });
      } else if (error instanceof Error && error.message.includes("JSON")) {
        errorMessage = "Error al procesar la respuesta del servidor.";
        
        toast({
          title: "Error de formato",
          description: "La respuesta del webhook no tiene el formato esperado.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      // Show error message in chat
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: errorMessage
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-40 w-full max-w-[450px] sm:w-[450px] h-[650px] bg-gradient-to-b from-slate-900/80 to-slate-800/80 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_80px_rgba(255,122,52,0.15)] border border-white/10 flex flex-col overflow-hidden animate-scale-in backdrop-blur-2xl mx-4 sm:mx-0" style={{ overflowX: 'hidden', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.85) 100%)' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-xl text-white p-5 flex items-center justify-between border-b border-white/10 shadow-[0_1px_20px_rgba(255,122,52,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,122,52,0.3),0_0_40px_rgba(255,122,52,0.15)] overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-orange-500/20">
            <img src={auraAvatar} alt="Zuno" className="w-[110%] h-[110%] object-contain" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-white/95 tracking-wide">Zuno 🦊</h3>
            <p className="text-xs text-orange-200/70 font-light">Tu asistente inteligente</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 rounded-full p-2 transition-all duration-300 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(255,122,52,0.2)]"
          aria-label="Cerrar chat"
        >
          <X className="h-5 w-5 text-white/80 hover:text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide p-5 space-y-4 bg-gradient-to-b from-slate-900/30 to-slate-950/40 backdrop-blur-sm">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,122,52,0.3),0_0_60px_rgba(255,122,52,0.15)] overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-orange-500/20">
              <img src={auraAvatar} alt="Zuno" className="w-[110%] h-[110%] object-contain" />
            </div>
            <p className="text-base font-medium text-white/95 mb-2">¡Hola! Soy Zuno 🦊</p>
            <p className="text-sm text-orange-200/70">Tu asistente inteligente</p>
            <p className="text-xs text-slate-400 mt-2">¿Quieres que te recomiende algo ahora?</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3 items-start animate-fade-in">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(255,122,52,0.3)] overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-orange-500/20">
              <img src={auraAvatar} alt="Zuno" className="w-[110%] h-[110%] object-contain" />
            </div>
            <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-2xl rounded-tl-sm px-4 py-3 backdrop-blur-xl shadow-[0_2px_10px_rgba(255,122,52,0.1)]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-xl shadow-[0_-2px_20px_rgba(0,0,0,0.2)]">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 bg-slate-800/40 border-white/10 text-white placeholder:text-slate-400 focus:border-orange-500/40 focus:ring-orange-500/20 backdrop-blur-sm rounded-xl shadow-inner"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-[0_0_20px_rgba(255,122,52,0.4)] hover:shadow-[0_0_25px_rgba(255,122,52,0.5)] transition-all duration-300 rounded-xl"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
