import ChatWidget from "@/components/ChatWidget";
import { ExternalLink, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-[hsl(250,85%,75%)] to-accent p-6">
      <div className="text-center max-w-4xl">
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-3xl p-8 md:p-12 shadow-[var(--shadow-elegant)]">
          <h1 className="mb-4 text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-[hsl(250,85%,75%)] bg-clip-text text-transparent">
            Widget de Chat IA + n8n
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Chat inteligente conectado a tu webhook de n8n con tarjetas de producto dinámicas
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-background border border-border rounded-2xl p-6 text-left">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Demo React
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Integración con n8n webhook</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Respuestas de texto y tarjetas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Animaciones suaves</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Manejo de errores robusto</span>
                </li>
              </ul>
            </div>

            <div className="bg-background border border-border rounded-2xl p-6 text-left">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">📦</span>
                Widget Standalone
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Archivo JavaScript listo para insertar en cualquier web con un simple snippet:
              </p>
              <div className="bg-muted rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <code>&lt;script src="widget.js"&gt;&lt;/script&gt;</code>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="gap-2"
              onClick={() => window.open('/widget-demo.html', '_blank')}
            >
              <ExternalLink className="h-5 w-5" />
              Ver demo standalone
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => window.open('/widget.js', '_blank')}
            >
              <Code className="h-5 w-5" />
              Ver código widget.js
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">
              💡 <strong>Prueba el chat ahora:</strong> Haz clic en el botón flotante en la esquina inferior derecha
            </p>
            <p className="text-xs text-muted-foreground">
              El widget envía mensajes a: <code className="bg-muted px-2 py-1 rounded">https://ibfnlxoh.rpcd.host/webhook/...</code>
            </p>
          </div>
        </div>
      </div>
      
      <ChatWidget />
    </div>
  );
};

export default Index;
