import { ShoppingBag, Sparkles } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  const products = [
    {
      id: 1,
      name: "Premium Sneakers Elite",
      price: "149.99€",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      category: "Calzado"
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: "299.99€",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      category: "Tecnología"
    },
    {
      id: 3,
      name: "Designer Backpack",
      price: "89.99€",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      category: "Accesorios"
    },
    {
      id: 4,
      name: "Wireless Headphones",
      price: "199.99€",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      category: "Audio"
    },
    {
      id: 5,
      name: "Leather Jacket Premium",
      price: "249.99€",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      category: "Moda"
    },
    {
      id: 6,
      name: "Minimalist Sunglasses",
      price: "119.99€",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
      category: "Accesorios"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#111827] relative overflow-hidden">
      {/* Efectos de luz de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-[#1F2937] bg-[#0F172A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(96,165,250,0.4)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">AURA Store</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-full bg-[#1F2937] hover:bg-[#374151] text-[#E5E7EB] transition-colors border border-[#374151]">
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Productos Destacados</h2>
          <p className="text-[#93C5FD]">Descubre nuestra colección premium seleccionada por AURA</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:shadow-[0_4px_16px_rgba(96,165,250,0.2)] hover:border-[#3B82F6]/40 transition-all duration-300 group"
            >
              <div className="aspect-square overflow-hidden bg-[#0F172A]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <span className="text-xs text-[#60A5FA] font-medium">{product.category}</span>
                <h3 className="text-lg font-semibold text-[#F3F4F6] mt-1 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-[#60A5FA]">{product.price}</span>
                  <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white text-sm font-medium transition-all duration-200 shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-[#1E3A8A]/20 to-[#2563EB]/10 border border-[#3B82F6]/40 rounded-2xl p-8 text-center backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-3">¿Necesitas ayuda para elegir?</h3>
          <p className="text-[#93C5FD] mb-6">Pregunta a AURA, tu asistente inteligente de compras</p>
          <div className="inline-flex items-center gap-2 text-[#60A5FA] text-sm">
            <div className="w-2 h-2 bg-[#60A5FA] rounded-full animate-pulse" />
            Haz clic en el chat flotante en la esquina inferior derecha
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Index;
