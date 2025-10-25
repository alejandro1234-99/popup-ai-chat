import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-2xl px-6">
        <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-primary to-[hsl(250,85%,75%)] bg-clip-text text-transparent">
          Widget de Chat IA
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Chat inteligente con soporte para tarjetas de producto dinámicas
        </p>
        <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Características:</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Botón flotante en esquina inferior derecha</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Pop-up con animación suave</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Integración con IA usando Lovable AI (GPT-4 compatible)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Tarjetas de producto dinámicas con imagen, precio y CTA</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Respuestas de texto normales y tarjetas intercambiables</span>
            </li>
          </ul>
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 Haz clic en el botón de chat en la esquina inferior derecha para probarlo.
              Prueba preguntando "Muéstrame algunos productos" para ver las tarjetas dinámicas.
            </p>
          </div>
        </div>
      </div>
      
      <ChatWidget />
    </div>
  );
};

export default Index;
