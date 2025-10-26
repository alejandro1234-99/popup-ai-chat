(function() {
  'use strict';

  const WEBHOOK_URL = "https://n8n-n8n.e07dhf.easypanel.host/webhook/c2ee33f4-37d4-49c0-975e-a47e7f0a7e29";
  const STORAGE_KEY = "zuno-chat-messages";
  
  // Evitar múltiples inicializaciones
  if (window.chatWidgetInitialized) return;
  window.chatWidgetInitialized = true;

  // Estilos del widget
  const styles = `
    .chat-widget-container * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    .chat-widget-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9998;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, hsl(25, 95%, 53%), hsl(33, 100%, 60%));
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 40px -10px hsla(25, 95%, 53%, 0.4);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-widget-button:hover {
      transform: scale(1.1);
      box-shadow: 0 10px 50px -5px hsla(25, 95%, 53%, 0.6);
    }

    .chat-widget-button svg {
      width: 24px;
      height: 24px;
      color: white;
    }

    .chat-widget-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      z-index: 9999;
      width: 380px;
      height: 600px;
      background: linear-gradient(135deg, hsl(220, 26%, 14%) 0%, hsl(220, 26%, 18%) 100%);
      border-radius: 16px;
      box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: scaleIn 0.2s ease-out;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .chat-widget-header {
      background: linear-gradient(135deg, hsl(25, 95%, 53%), hsl(33, 100%, 60%));
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chat-widget-header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-weight: 600;
      font-size: 16px;
    }

    .chat-widget-status-dot {
      width: 8px;
      height: 8px;
      background: hsl(142, 71%, 45%);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .chat-widget-close {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .chat-widget-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .chat-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: linear-gradient(135deg, hsl(220, 26%, 14%) 0%, hsl(220, 26%, 18%) 100%);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .chat-widget-empty {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      padding: 32px 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
    }

    .chat-message {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    .chat-message.user {
      justify-content: flex-end;
    }

    .chat-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      flex-shrink: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .chat-avatar.bot {
      background: transparent;
      font-size: 24px;
    }

    .chat-avatar.user {
      background: linear-gradient(135deg, hsl(25, 95%, 53%), hsl(33, 100%, 60%));
      color: white;
    }

    .chat-bubble {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .chat-bubble.user {
      background: linear-gradient(135deg, hsl(25, 95%, 53%), hsl(33, 100%, 60%));
      color: white;
      border-top-right-radius: 4px;
    }

    .chat-bubble.bot {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-top-left-radius: 4px;
    }

    .chat-typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      border-top-left-radius: 4px;
      width: fit-content;
    }

    .chat-typing-dot {
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out;
    }

    .chat-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .chat-typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-8px); }
    }

    .chat-product-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.2s;
      margin-bottom: 12px;
    }

    .chat-product-card:hover {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .chat-product-card:last-child {
      margin-bottom: 0;
    }

    .chat-product-image {
      width: 100%;
      height: 128px;
      object-fit: cover;
    }

    .chat-product-content {
      padding: 12px;
    }

    .chat-product-title {
      font-weight: 600;
      font-size: 14px;
      color: #1f2937;
      margin-bottom: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .chat-product-description {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 12px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .chat-product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
    }

    .chat-product-price {
      font-size: 18px;
      font-weight: 700;
      color: hsl(25, 95%, 53%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .chat-product-button {
      background: hsl(25, 95%, 53%);
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: background 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .chat-product-button:hover {
      background: hsl(25, 95%, 48%);
    }

    .chat-widget-input-container {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      gap: 8px;
    }

    .chat-widget-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-radius: 8px;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      outline: none;
      transition: border-color 0.2s;
    }

    .chat-widget-input::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .chat-widget-input:focus {
      border-color: hsl(25, 95%, 53%);
    }

    .chat-widget-send {
      background: linear-gradient(135deg, hsl(25, 95%, 53%), hsl(33, 100%, 60%));
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .chat-widget-send:hover:not(:disabled) {
      background: linear-gradient(135deg, hsl(25, 95%, 48%), hsl(33, 100%, 55%));
    }

    .chat-widget-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chat-widget-send svg {
      width: 16px;
      height: 16px;
      color: white;
    }

    @media (max-width: 480px) {
      .chat-widget-window {
        width: calc(100vw - 32px);
        height: calc(100vh - 120px);
        right: 16px;
        bottom: 88px;
      }

      .chat-widget-button {
        right: 16px;
        bottom: 16px;
      }
    }
  `;

  // Inyectar estilos
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Estado del chat
  let isOpen = false;
  let isLoading = false;
  let messages = [];

  // Cargar mensajes desde localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      messages = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading messages from localStorage:', error);
  }

  // Crear elementos del DOM
  const container = document.createElement('div');
  container.className = 'chat-widget-container';

  // Botón flotante
  const button = document.createElement('button');
  button.className = 'chat-widget-button';
  button.innerHTML = `
    <span style="font-size: 28px;">🦊</span>
  `;

  // Ventana del chat
  const chatWindow = document.createElement('div');
  chatWindow.className = 'chat-widget-window';
  chatWindow.style.display = 'none';
  chatWindow.innerHTML = `
    <div class="chat-widget-header">
      <div class="chat-widget-header-title">
        <div class="chat-widget-status-dot"></div>
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <span style="font-weight: 600;">Zuno</span>
          <span style="font-size: 11px; opacity: 0.9;">Tu asistente inteligente</span>
        </div>
      </div>
      <button class="chat-widget-close" aria-label="Cerrar chat">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="chat-widget-messages" id="chat-messages">
      <div class="chat-widget-empty">
        <div style="font-size: 48px; margin-bottom: 8px;">🦊</div>
        <p style="font-weight: 600; margin-bottom: 4px;">¡Hola! Soy Zuno</p>
        <p style="font-size: 12px; opacity: 0.8;">Tu asistente inteligente</p>
      </div>
    </div>
    <div class="chat-widget-input-container">
      <input 
        type="text" 
        class="chat-widget-input" 
        placeholder="Escribe tu mensaje..."
        id="chat-input"
      />
      <button class="chat-widget-send" id="chat-send" aria-label="Enviar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  `;

  container.appendChild(button);
  container.appendChild(chatWindow);
  document.body.appendChild(container);

  // Referencias a elementos
  const messagesContainer = chatWindow.querySelector('#chat-messages');
  const input = chatWindow.querySelector('#chat-input');
  const sendButton = chatWindow.querySelector('#chat-send');
  const closeButton = chatWindow.querySelector('.chat-widget-close');

  // Toggle chat
  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    
    if (isOpen) {
      input.focus();
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      `;
    } else {
      button.innerHTML = `
        <span style="font-size: 28px;">🦊</span>
      `;
    }
  }

  // Renderizar mensajes
  function renderMessages() {
    messagesContainer.innerHTML = '';
    
    if (messages.length === 0) {
      messagesContainer.innerHTML = `
        <div class="chat-widget-empty">
          <div style="font-size: 48px; margin-bottom: 8px;">🦊</div>
          <p style="font-weight: 600; margin-bottom: 4px;">¡Hola! Soy Zuno</p>
          <p style="font-size: 12px; opacity: 0.8;">Tu asistente inteligente</p>
        </div>
      `;
      return;
    }

    messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${msg.role}`;

      if (msg.role === 'user') {
        messageDiv.innerHTML = `
          <div class="chat-bubble user">${msg.content}</div>
          <div class="chat-avatar user">Tú</div>
        `;
      } else {
        // Intentar parsear como JSON
        let content;
        try {
          const parsed = JSON.parse(msg.content);
          
          if (parsed.type === 'product_cards' && Array.isArray(parsed.items)) {
            // Renderizar tarjetas de producto
            content = `<div style="max-width: 80%;">`;
            parsed.items.forEach(item => {
              content += `
                <div class="chat-product-card">
                  <img src="${item.image}" alt="${item.title}" class="chat-product-image" />
                  <div class="chat-product-content">
                    <div class="chat-product-title">${item.title}</div>
                    <div class="chat-product-description">${item.description}</div>
                    <div class="chat-product-footer">
                      <div class="chat-product-price">${item.price}</div>
                      <button class="chat-product-button" onclick="window.open('${item.url}', '_blank')">
                        Ver producto
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="12" height="12">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            });
            content += `</div>`;
          } else if (parsed.type === 'text') {
            // Respuesta de texto simple
            content = `<div class="chat-bubble bot">${parsed.content}</div>`;
          } else {
            // Formato desconocido, mostrar como texto
            content = `<div class="chat-bubble bot">${msg.content}</div>`;
          }
        } catch {
          // No es JSON, mostrar como texto normal
          content = `<div class="chat-bubble bot">${msg.content}</div>`;
        }

        messageDiv.innerHTML = `
          <div class="chat-avatar bot">🦊</div>
          ${content}
        `;
      }

      messagesContainer.appendChild(messageDiv);
    });

    // Mostrar indicador de escritura si está cargando
    if (isLoading) {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'chat-message';
      typingDiv.innerHTML = `
        <div class="chat-avatar bot">AI</div>
        <div class="chat-typing">
          <div class="chat-typing-dot"></div>
          <div class="chat-typing-dot"></div>
          <div class="chat-typing-dot"></div>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
    }

    // Scroll al final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Enviar mensaje
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    // Agregar mensaje del usuario
    messages.push({ role: 'user', content: text });
    
    // Guardar mensajes en localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
    
    input.value = '';
    isLoading = true;
    sendButton.disabled = true;
    input.disabled = true;

    renderMessages();

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      const data = await response.json();
      
      let assistantContent;
      
      if (data.type === 'text') {
        assistantContent = data.content;
      } else if (data.type === 'product_cards') {
        assistantContent = JSON.stringify(data);
      } else {
        assistantContent = typeof data === 'string' ? data : JSON.stringify(data);
      }

      messages.push({ role: 'assistant', content: assistantContent });
      
      // Guardar mensajes en localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Error saving messages to localStorage:', error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      messages.push({ 
        role: 'assistant', 
        content: 'Ups, hubo un error. Inténtalo de nuevo.' 
      });
    } finally {
      isLoading = false;
      sendButton.disabled = false;
      input.disabled = false;
      renderMessages();
      input.focus();
    }
  }

  // Event listeners
  button.addEventListener('click', toggleChat);
  closeButton.addEventListener('click', toggleChat);
  sendButton.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
