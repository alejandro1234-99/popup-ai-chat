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
      <div className="flex gap-3 items-start justify-end animate-fade-in">
        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-gray-700">Tú</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start animate-fade-in">
      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="text-sm text-white font-bold">A</span>
      </div>
      <div className="flex-1 max-w-full">
        {isProductCards ? (
          <div>
            <div className="text-xs font-medium text-blue-600 mb-2 flex items-center gap-1">
              AURA 💬
            </div>
            <div 
              className="flex overflow-x-auto gap-3 pb-3 scrollbar-hide snap-x snap-mandatory max-w-full"
              style={{ scrollBehavior: 'smooth' }}
            >
              {parsedContent.items.map((item: any, idx: number) => {
                // Validate required fields
                if (!item.title || !item.price || !item.url) {
                  console.warn("Invalid product item:", item);
                  return null;
                }
                return <ProductCard key={idx} product={item} />;
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1">
              AURA 💬
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-sm">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
