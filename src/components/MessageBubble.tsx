import ProductCard from "./ProductCard";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  // Try to parse as product cards JSON
  let parsedContent: any = null;
  try {
    parsedContent = JSON.parse(message.content);
  } catch {
    // Not JSON, treat as regular text
  }

  const isProductCards = parsedContent?.type === "product_cards" && Array.isArray(parsedContent?.items);

  if (isUser) {
    return (
      <div className="flex gap-2 items-start justify-end">
        <div className="bg-[hsl(var(--chat-user-bg))] text-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
          <p className="text-sm">{message.content}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium">Tú</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-xs text-primary-foreground font-medium">AI</span>
      </div>
      <div className="flex-1 max-w-[80%]">
        {isProductCards ? (
          <div className="space-y-3">
            {parsedContent.items.map((item: any, idx: number) => (
              <ProductCard key={idx} product={item} />
            ))}
          </div>
        ) : (
          <div className="bg-[hsl(var(--chat-bot-bg))] text-primary-foreground rounded-2xl rounded-tl-sm px-4 py-2">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
