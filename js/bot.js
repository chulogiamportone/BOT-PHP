const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Función para agregar mensajes al DOM
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll al final
}

// Función para enviar mensaje al backend
async function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    // 1. Mostrar mensaje del usuario
    addMessage(text, 'user');
    userInput.value = '';

    // 2. Enviar a PHP
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

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});