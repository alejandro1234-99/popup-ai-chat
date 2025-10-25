import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import MessageBubble from "./MessageBubble";
import { useToast } from "@/hooks/use-toast";

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
    <div className="fixed bottom-24 right-6 z-40 w-[380px] h-[600px] bg-card rounded-2xl shadow-[var(--shadow-elegant)] border border-border flex flex-col overflow-hidden animate-scale-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-[hsl(250,85%,75%)] text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <h3 className="font-semibold">Asistente IA</h3>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-white/10 rounded-full p-1 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm">¡Hola! ¿En qué puedo ayudarte hoy?</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2 items-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-primary-foreground">AI</span>
            </div>
            <div className="bg-[hsl(var(--chat-bot-bg))] text-primary-foreground rounded-2xl rounded-tl-sm px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
