// Función para agregar mensajes al DOM
function addMessage(text, sender) {
    // Buscamos el chatBox AQUÍ, justo cuando lo necesitamos
    const chatBox = document.getElementById('chat-box');

    if (!chatBox) return; // Protección por si no se ha cargado aún

    const div = document.createElement('div');
    div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll al final
}

// Función para enviar mensaje al backend
async function sendMessage() {
    // Buscamos el input AQUÍ, para asegurarnos de que existe
    const userInput = document.getElementById('user-input');

    if (!userInput) return;

    const text = userInput.value.trim();
    if (text === "") return;

    // 1. Mostrar mensaje del usuario
    addMessage(text, 'user');
    userInput.value = '';

    // 2. Enviar a PHP (Tu lógica original intacta)
    try {
        const response = await fetch('api/api_bot.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        // 3. Mostrar respuesta del bot
        addMessage(data.reply, 'bot');

    } catch (error) {
        console.error('Error:', error);
        addMessage("Lo siento, tengo problemas de conexión.", 'bot');
    }
}

// === EVENT LISTENERS (MODIFICADOS) ===
// Usamos delegación de eventos en el documento entero.
// Esto permite que el botón funcione aunque se cargue después.

document.addEventListener('click', (e) => {
    // Si lo que se clickeó tiene el ID 'send-btn'
    if (e.target && e.target.id === 'send-btn') {
        e.preventDefault(); // Evita recargas si está en un form
        sendMessage();
    }
});

document.addEventListener('keypress', (e) => {
    // Si se presionó tecla en el input 'user-input'
    if (e.target && e.target.id === 'user-input') {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita salto de línea
            sendMessage();
        }
    }
});

document.addEventListener('click', function (e) {

    // 1. Detectar click en el BOTÓN FLOTANTE (o la imagen dentro de él)
    const toggleBtn = e.target.closest('#chatToggleBtn');

    if (toggleBtn) {
        console.log("Botón flotante clickeado"); // Para depurar
        const chatContainer = document.getElementById('floating-chat-container');
        if (chatContainer) {
            chatContainer.classList.toggle('active');

            // Opcional: poner foco en el input al abrir
            if (chatContainer.classList.contains('active')) {
                const input = document.getElementById('user-input');
                if (input) setTimeout(() => input.focus(), 100);
            }
        }
    }

    // 2. Detectar click en la X DE CERRAR
    if (e.target.id === 'close-chat-x') {
        const chatContainer = document.getElementById('floating-chat-container');
        if (chatContainer) {
            chatContainer.classList.remove('active');
        }
    }
});

// Nota: Asegúrate de que el archivo /js/bot.js esté cargado en tu index.html
// <script src="/js/bot.js">