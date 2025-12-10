document.addEventListener("DOMContentLoaded", () => {
    // Configuración
    const JSON_URL = '/data/tratamientos.json'; // La misma ruta que usas
    const CONTAINER_ID = 'cards-destacados-container';

    initDestacados(JSON_URL, CONTAINER_ID);
});

async function initDestacados(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al cargar JSON");
        
        const data = await res.json();

        // AQUÍ ESTÁ LA MAGIA: .slice(0, 2) toma solo los dos primeros elementos
        const destacados = data.slice(0, 2);

        // Renderizamos
        destacados.forEach(item => {
            const cardHTML = createCardHTML(item);
            container.appendChild(cardHTML);
        });

    } catch (error) {
        console.error("Error cargando destacados:", error);
    }
}

// Función para crear el DOM de la card (Reutilizando tu estructura exacta)
function createCardHTML(data) {
    const article = document.createElement('article');
    article.className = 'treatment-card';

    // Lógica de par/impar para la animación (opcional, igual que en tu index)
    if (data.id % 2 === 0) {
        article.classList.add('reverse-hover');
    }

    article.innerHTML = `
        <div class="t-card-image-bg">
            <img src="${data.image}" alt="${data.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
        </div>

        <div class="t-card-info">
            <div class="t-card-title">${data.title}</div>
            <div class="t-card-desc">${data.description}</div>

            <div class="t-card-btn">
                <span>MÁS INFORMACIÓN</span>
                <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.02779 7.20699L2.37079 12.864L0.956787 11.45L5.90679 6.49999L0.956787 1.54999L2.37079 0.135986L8.02779 5.79299C8.21526 5.98051 8.32057 6.23482 8.32057 6.49999C8.32057 6.76515 8.21526 7.01946 8.02779 7.20699Z" fill="white"/>
                </svg>
            </div>
        </div>
    `;

    // Evento de Click
    article.addEventListener('click', () => {
        if (data.link && data.link.trim() !== "") {
            window.location.href = data.link;
        } else {
            const slug = data.title.toLowerCase().trim().replace(/\s+/g, '-');
            window.location.href = `/tratamientos/${slug}.html`;
        }
    });

    return article;
}