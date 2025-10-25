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

const WEBHOOK_URL = "https://hook.eu2.make.com/w54qg7nwtelumvreln44ieb1ide6i2ge";

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
      console.log("Sending message to Make webhook:", userMessage.content);
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
          "1. El webhook de Make esté activo\n" +
          "2. El escenario esté ejecutándose";
        
        toast({
          title: "Error de conexión",
          description: "El webhook no responde. Verifica el escenario de Make.",
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
    <div className="fixed bottom-24 right-6 z-40 w-full max-w-[450px] sm:w-[450px] h-[650px] bg-gradient-to-b from-[#0F172A] to-[#1E293B] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-[#1F2937] flex flex-col overflow-hidden animate-scale-in backdrop-blur-md mx-4 sm:mx-0" style={{ overflowX: 'hidden' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A]/40 to-[#2563EB]/30 backdrop-blur-sm text-white p-5 flex items-center justify-between border-b border-[#3B82F6]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(96,165,250,0.4)] overflow-hidden" style={{ background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
            <img src={auraAvatar} alt="AURA" className="w-[110%] h-[110%] object-contain" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-[#E0E7FF]">AURA</h3>
            <p className="text-xs text-[#93C5FD]">Asistente Universal de Recomendaciones</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 rounded-full p-2 transition-colors backdrop-blur-sm"
          aria-label="Cerrar chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-4 bg-gradient-to-b from-[#111827]/50 to-[#0F172A]/50">
        {messages.length === 0 && (
          <div className="text-center text-[#9CA3AF] py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(96,165,250,0.3)] overflow-hidden" style={{ background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
              <img src={auraAvatar} alt="AURA" className="w-[110%] h-[110%] object-contain" />
            </div>
            <p className="text-base font-medium text-[#E0E7FF] mb-2">Hola 👋 soy AURA</p>
            <p className="text-sm text-[#93C5FD]">Tu asistente inteligente</p>
            <p className="text-xs text-[#6B7280] mt-2">¿Quieres que te recomiende algo ahora?</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3 items-start animate-fade-in">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(96,165,250,0.3)] overflow-hidden" style={{ background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
              <img src={auraAvatar} alt="AURA" className="w-[110%] h-[110%] object-contain" />
            </div>
            <div className="bg-gradient-to-r from-[#1E3A8A]/20 to-[#2563EB]/10 border border-[#3B82F6]/40 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-[#60A5FA] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-[#60A5FA] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[#60A5FA] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#1F2937] bg-[#111827]/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1 bg-[#1F2937]/60 border-[#374151] text-[#E5E7EB] placeholder:text-[#6B7280] focus:border-[#60A5FA] focus:ring-[#60A5FA]/30 backdrop-blur-sm"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
