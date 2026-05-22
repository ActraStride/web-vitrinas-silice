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
// Función para renderizar la tarjeta de contacto dentro de chatbot.js
function renderContactCard(config) {
    const card = document.createElement('div');
    card.className = 'contact-card';
    
    // Configura tu link de WhatsApp aquí
    const phone = "523334683900"; // Número de WhatsApp con código de país (ejemplo para México)
    const message = encodeURIComponent("Hola, vengo del chat #2JS267D.");
    const waUrl = `https://wa.me/${phone}?text=${message}`;

    card.innerHTML = `
        <div class="contact-card-icon">
            <svg viewBox="0 0 25 25" fill="currentColor" width="23" height="23"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>  

        </div>
        <h5>${config.title || "Agendar Cotización"}</h5>
        <p>${config.subtitle || "Haz clic para hablar con un experto"}</p>
        <a href="${waUrl}" target="_blank" class="contact-card-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12.031 6.172c-2.203 0-4.007 1.797-4.007 3.993 0 .823.252 1.596.701 2.232l-.405 1.468 1.479-.389c.611.414 1.35.65 2.146.65 2.203 0 4.006-1.798 4.006-3.994s-1.803-3.993-4.02-3.993z"/>
            </svg>
            Contactar por WhatsApp
        </a>
    `;
    
    elements.chatMessages.appendChild(card);
    scrollToBottom();
}

async function fetchAIResponse(userMessage) {
    showTyping();
    isWaitingForResponse = true;
    elements.chatSubmitBtn.disabled = true;
    elements.chatInput.disabled = true;

    try {
        // PASO 1: Disparar el run
        const runResponse = await fetch('/xulcan/v1/agent/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                blueprint_id: 'chat',
                agent_id: sessionKey,
                input_text: userMessage,
                session_key: sessionKey
            })
        });

        if (!runResponse.ok) throw new Error('Error al iniciar el run');
        const { run_id } = await runResponse.json();

        // PASO 2: Escuchar el stream hasta run_completed
        const eventSource = new EventSource(`/xulcan/v1/runs/${run_id}/stream`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'run_completed') {
                eventSource.close();
                hideTyping();

                const aiText = data.final_response?.content || '';

                // Detección de tarjeta de contacto
                const cardRegex = /\[RENDER_CONTACT_CARD:\s*({.*?})\s*\]/s;
                const match = aiText.match(cardRegex);

                if (match) {
                    const cleanText = aiText.replace(cardRegex, '').trim();
                    if (cleanText) addMessage(cleanText, true);
                    try {
                        const config = JSON.parse(match[1]);
                        setTimeout(() => renderContactCard(config), 600);
                    } catch (e) {
                        console.error('Error en JSON de Card:', e);
                    }
                } else {
                    addMessage(aiText, true);
                }
            }

            if (data.type === 'run_failed') {
                eventSource.close();
                hideTyping();
                addMessage('Lo siento, tuve un problema. ¿Te gustaría hablar con un asesor?', true);
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            hideTyping();
            addMessage('Lo siento, tengo problemas para conectarme ahora mismo.', true);
        };

    } catch (error) {
        console.error('Error Xulcan:', error);
        hideTyping();
        addMessage('Lo siento, tengo problemas para conectarme ahora mismo.', true);
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

    // --- MODO PRODUCCIÓN ---
    setTimeout(() => {
        // Restauramos el mensaje inicial real
        addMessage(initialMessage, true);
    }, 1000); // 1 segundo de delay para que se sienta natural
    // -----------------------

    elements.chatLauncher.addEventListener('click', toggleChat);
    elements.chatClose.addEventListener('click', toggleChat);
    elements.chatForm.addEventListener('submit', handleChatSubmit);
}