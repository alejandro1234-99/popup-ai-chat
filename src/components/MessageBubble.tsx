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

  // Robust JSON parsing for product cards
  let parsedContent: any = null;
  let isProductCards = false;

  if (!isUser) {
    try {
      // Try direct parsing first
      const cleanedContent = message.content.trim();
      parsedContent = JSON.parse(cleanedContent);
      
      // Validate product_cards structure
      if (
        parsedContent?.type === "product_cards" && 
        Array.isArray(parsedContent?.items) && 
        parsedContent.items.length > 0
      ) {
        isProductCards = true;
      }
    } catch (e) {
      // Try to extract JSON from text
      try {
        const jsonMatch = message.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
          if (
            parsedContent?.type === "product_cards" && 
            Array.isArray(parsedContent?.items) && 
            parsedContent.items.length > 0
          ) {
            isProductCards = true;
          }
        }
      } catch {
        // Not product cards JSON, will render as text
      }
    }
  }

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
      <div className="flex-1">
        {isProductCards ? (
          <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-4 pb-2 pr-4">
            {parsedContent.items.map((item: any, idx: number) => {
              // Validate required fields
              if (!item.title || !item.price || !item.url) {
                console.warn("Invalid product item:", item);
                return null;
              }
              return <ProductCard key={idx} product={item} />;
            })}
          </div>
        ) : (
          <div className="bg-[hsl(var(--chat-bot-bg))] text-primary-foreground rounded-2xl rounded-tl-sm px-4 py-2 max-w-[85%]">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
