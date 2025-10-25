import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import ZunoEmojiAvatar from "./ZunoEmojiAvatar";
type Message = {
  role: "user" | "assistant";
  content: string;
};
interface MessageBubbleProps {
  message: Message;
}
const ProductCarousel = ({
  items
}: {
  items: any[];
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const checkScroll = () => {
    if (scrollRef.current) {
      const {
        scrollLeft,
        scrollWidth,
        clientWidth
      } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  useEffect(() => {
    checkScroll();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, [items]);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 250; // ancho aproximado de tarjeta + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  return <div className="relative">
      {showLeftArrow && <button onClick={() => scroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[rgba(37,99,235,0.1)] backdrop-blur-[6px] border border-[rgba(96,165,250,0.3)] text-white/70 hover:bg-[rgba(37,99,235,0.25)] hover:text-white transition-all duration-300 flex items-center justify-center" aria-label="Anterior">
          <ChevronLeft className="h-4 w-4" />
        </button>}
      
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 pb-3 scrollbar-hide px-3" style={{
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch',
      scrollPaddingLeft: '12px',
      scrollPaddingRight: '12px'
    }}>
        {items.map((item: any, idx: number) => {
        if (!item.title || !item.price || !item.url) {
          console.warn("Invalid product item:", item);
          return null;
        }
        return <ProductCard key={idx} product={item} />;
      })}
      </div>

      {showRightArrow && <button onClick={() => scroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[rgba(37,99,235,0.1)] backdrop-blur-[6px] border border-[rgba(96,165,250,0.3)] text-white/70 hover:bg-[rgba(37,99,235,0.25)] hover:text-white transition-all duration-300 flex items-center justify-center" aria-label="Siguiente">
          <ChevronRight className="h-4 w-4" />
        </button>}
    </div>;
};
const MessageBubble = ({
  message
}: MessageBubbleProps) => {
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
      if (parsedContent?.type === "product_cards" && Array.isArray(parsedContent?.items) && parsedContent.items.length > 0) {
        isProductCards = true;
      }
    } catch (e) {
      // Try to extract JSON from text
      try {
        const jsonMatch = message.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
          if (parsedContent?.type === "product_cards" && Array.isArray(parsedContent?.items) && parsedContent.items.length > 0) {
            isProductCards = true;
          }
        }
      } catch {
        // Not product cards JSON, will render as text
      }
    }
  }
  if (isUser) {
    return <div className="flex gap-3 items-start justify-end animate-fade-in">
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] shadow-[0_2px_10px_rgba(37,99,235,0.3)]">
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#374151] flex items-center justify-center flex-shrink-0 border border-[#4B5563]">
          <span className="text-xs font-semibold text-[#E5E7EB]">Tú</span>
        </div>
      </div>;
  }
  return <div className="flex gap-3 items-start animate-fade-in">
      <div className="flex-1 max-w-full">
        {isProductCards ? <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <ZunoEmojiAvatar size={40} />
              </div>
              <span className="text-sm font-semibold text-white/90">Zuno</span>
            </div>
            <ProductCarousel items={parsedContent.items} />
          </div> : <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <ZunoEmojiAvatar size={40} />
              </div>
              <span className="text-sm font-semibold text-white/90 px-px py-0 my-0 mx-0">Zuno</span>
            </div>
            <div className="bg-gradient-to-r from-[#1E3A8A]/20 to-[#2563EB]/10 border border-[#3B82F6]/40 text-[#E0E7FF] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>}
      </div>
    </div>;
};
export default MessageBubble;