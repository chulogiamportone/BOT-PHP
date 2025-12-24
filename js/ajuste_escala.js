// Ajuste de escala + Corrección del Chatbot
function ajustarEscala() {
    // 1. Configuración base
    const anchoDiseno = 430;
    const anchoMaximo = 1080;
    const anchoVentana = window.innerWidth;
  
    // 2. Cálculo del zoom general
    const anchoParaCalculo = Math.min(anchoVentana, anchoMaximo);
    const escala = anchoParaCalculo / anchoDiseno;
  
    // 3. Aplicamos el zoom al sitio web
    document.body.style.zoom = escala;
  
    // --- LÓGICA ESPECIAL PARA EL CHATBOT ---
    const chatContainer = document.getElementById('floating-chat-container');
    const botonWsp = document.querySelector('.btn-flotante-toggle'); // O tu clase del botón
    
    if (chatContainer) {
        // Umbral para considerar "Escritorio" (aprox cuando el zoom pasa de 1.5 o ancho > 768)
        if (anchoVentana > 768) {
            // MODO ESCRITORIO (Facebook Style)
            chatContainer.classList.add('desktop-mode');
            
            // MAGIA: Aplicamos zoom inverso (1 / escala) para que el chat
            // vuelva a tener tamaño real (1:1) y no se vea gigante.
            chatContainer.style.zoom = (1 / escala);
            
            // También corregimos el botón de WhatsApp si quieres que no sea enorme
            if(botonWsp) botonWsp.style.zoom = (1 / escala);
            
        } else {
            // MODO MÓVIL (Tu diseño 430px)
            chatContainer.classList.remove('desktop-mode');
            
            // En móvil dejamos que herede el zoom del body para que llene la pantalla
            chatContainer.style.zoom = 'normal';
            if(botonWsp) botonWsp.style.zoom = 'normal';
        }
    }
}
  
// Ejecutamos al cargar y al redimensionar
window.addEventListener('load', ajustarEscala); // Aseguramos que cargue
window.addEventListener('resize', ajustarEscala);
ajustarEscala();