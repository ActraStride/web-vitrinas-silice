// js/modules/chatbot.js
import { elements } from '../dom.js';

let isChatOpen = false;
let unreadMessages = 0;
let isWaitingForResponse = false; // Bloquea el input mientras la IA responde

// Iniciar con un mensaje de bienvenida
const initialMessage = "¡Hola! Soy el asistente virtual de Vitrinas Sílice. ¿Te gustaría agendar una cotización o tienes alguna duda técnica sobre nuestros modelos?";
let sessionKey = localStorage.getItem('xulcan_session_id') || `sess_${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem('xulcan_session_id', sessionKey);


function toggleChat() {
    isChatOpen = !isChatOpen;
    elements.chatWindow.classList.toggle('active', isChatOpen);
    
    if (isChatOpen) {
        // Ocultar notificaciones al abrir
        unreadMessages = 0;
        elements.chatBadge.style.display = 'none';
        elements.chatInput.focus();
    }
}

function updateBadge() {
    if (!isChatOpen && unreadMessages > 0) {
        elements.chatBadge.textContent = unreadMessages;
        elements.chatBadge.style.display = 'flex';
    }
}

function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function addMessage(text, isBot = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${isBot ? 'bot-msg' : 'user-msg'}`;
    
    // Si queremos parsear negritas de la IA, podemos usar innerHTML, pero para seguridad mejor textContent
    msgDiv.textContent = text; 
    
    elements.chatMessages.appendChild(msgDiv);
    scrollToBottom();

    // Si el chat está cerrado y escribe el bot, sumamos notificación
    if (isBot && !isChatOpen) {
        unreadMessages++;
        updateBadge();
    }
}

// Control del indicador de "Escribiendo..."
function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    elements.chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTyping() {
    const typingDiv = document.getElementById('typingIndicator');
    if (typingDiv) typingDiv.remove();
}

// ==========================================
// 🔌 AQUÍ CONECTARÁS TU IA EN EL FUTURO
// ==========================================
async function fetchAIResponse(userMessage) {
    showTyping();
    isWaitingForResponse = true;
    elements.chatSubmitBtn.disabled = true;
    elements.chatInput.disabled = true;

    try {
        // LLAMADA AL BACKEND A TRAVÉS DEL PROXY NGINX
        // Usamos /service/chat porque Nginx redirige eso al contenedor de Python
        const response = await fetch('/service/chat', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                prompt: userMessage,
                agent_id: "vitrinas-whatsapp-funnel", // El ID que pusiste en tu vitrinas.yml
                session_key: sessionKey 
            })
        });

        if (!response.ok) throw new Error("Error en la comunicación con el servidor");

        const data = await response.json();
        
        // El backend devuelve { "run_id": "...", "response_text": "..." }
        const aiText = data.response_text;

        hideTyping();
        addMessage(aiText, true);

    } catch (error) {
        console.error("Error Xulcan:", error);
        hideTyping();
        addMessage("Lo siento, tengo problemas para conectarme ahora mismo. ¿Te gustaría hablar con un asesor por WhatsApp?", true);
    } finally {
        isWaitingForResponse = false;
        elements.chatSubmitBtn.disabled = false;
        elements.chatInput.disabled = false;
        elements.chatInput.focus();
    }
}

async function handleChatSubmit(e) {
    e.preventDefault();
    if (isWaitingForResponse) return; // Prevenir doble envío

    const message = elements.chatInput.value.trim();
    if (!message) return;

    // Usuario envía mensaje
    addMessage(message, false);
    elements.chatInput.value = '';

    // Llamar a la IA
    await fetchAIResponse(message);
}

export function initChatbot() {
    if (!elements.chatLauncher) return;

    // Insertar el primer mensaje al cargar
    setTimeout(() => {
        addMessage(initialMessage, true);
    }, 1000); // Entra un segundo después de cargar la web

    elements.chatLauncher.addEventListener('click', toggleChat);
    elements.chatClose.addEventListener('click', toggleChat);
    elements.chatForm.addEventListener('submit', handleChatSubmit);
}