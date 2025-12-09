document.addEventListener("DOMContentLoaded", async () => {
    // 1. Configuración
    const API = "/api/tratamiento_get.php";
    // CRÍTICO: Usar el selector de Tratamientos
    const section = document.querySelector(".tratamientos-body"); 
    const tituloListado = document.getElementById("tratamientos-listado-titulo");

    if (!section) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    try {
        if (id) {
            // DETALLE DEL TRATAMIENTO
            if (tituloListado) tituloListado.style.display = 'none'; // Oculta el título del listado
            await cargarDetalleTratamiento(section, API, id);
            inicializarNavegacion(API, id, "tratamiento");
        } else {
            // LISTADO DE TRATAMIENTOS
            if (tituloListado) tituloListado.style.display = 'flex'; // Muestra el título del listado
            await listarTodosLosTratamientos(section, API);
            // El listado no usa los botones de navegación anterior/siguiente
            const nav = document.querySelector(".botones-navegacion");
            if(nav) nav.style.display = 'none';
        }
    } catch (err) {
        console.error("Error global en tratamiento.js:", err);
        section.innerHTML = `<p>Error de conexión o configuración</p>`;
    }
});

// --- FUNCIONES AUXILIARES DE TRATAMIENTO (Similares a las de nota.js) ---

// CRÍTICO: Se debe importar o re-declarar la función formatearTextoPersonalizado de nota.js
// Asumo que la función formatearTextoPersonalizado está disponible globalmente si usas nota.js
// o debes copiarla a este archivo. La copio aquí por seguridad:

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;"); // Agregado para atributos HTML
}

function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
}

function procesarEstilo(texto, token, etiqueta) {
    if (!texto.includes(token)) return texto;

    return texto.split(token).map((fragmento, i) => {
        if (i % 2 === 1) {
            return `<${etiqueta}>${fragmento}</${etiqueta}>`;
        }
        return fragmento;
    }).join('');
}

function formatearTextoPersonalizado(textoRaw) {
    if (!textoRaw) return "";

    let texto = escapeHtml(textoRaw);
    const T_BOLD = "###TOKEN_BOLD###";
    const T_VIOLET = "###TOKEN_VIOLET###";
    const T_BR = "###TOKEN_BR###";

    // 1. REEMPLAZO PREVIO (Normalización)
    // CRÍTICO: Usamos los mismos tokens para que los formatos de nota.js funcionen aquí.
    texto = texto.replace(/\\r\\n|\r\n/g, T_BOLD);
    texto = texto.replace(/\\t|\t/g, T_VIOLET);
    texto = texto.replace(/\\n|\n/g, T_BR);

    // 2. PROCESAR ESTRUCTURA
    const partesVioleta = texto.split(T_VIOLET);

    return partesVioleta.map((parte, index) => {
        // A. Procesar Negrita
        let textoEstilizado = procesarEstilo(parte, T_BOLD, 'strong');

        // B. Procesar Salto de Línea
        textoEstilizado = textoEstilizado.split(T_BR).join('<br />');

        // C. Aplicar Estilo Violeta (Si es impar - TÍTULOS)
        if (index % 2 === 1) {
            if (!textoEstilizado.trim()) return "";
            // Cierra párrafo anterior, pone título, abre nuevo párrafo.
            return `</p><p><h4 class="subtitulo-violeta">${textoEstilizado}</h4>`;
        }

        return textoEstilizado;
    }).join('');
}

// --- FUNCIÓN DE CARGA DEL DETALLE (CRÍTICO: Usa las clases y el formato de nota) ---
async function cargarDetalleTratamiento(section, API, id) {
    const res = await fetch(`${API}?id=${encodeURIComponent(id)}`);
    const trat = await res.json();

    if (!res.ok || trat.error) {
        section.innerHTML = `<p>${trat.error || "Error cargando el tratamiento"}</p>`;
        return;
    }

    let parrafos = [];
    try {
        parrafos = JSON.parse(trat.texto || "[]");
    } catch (e) {
        console.error("Error parseando trat.texto", e);
        parrafos = [trat.texto];
    }

    let subsArr = [];
    try {
        subsArr = JSON.parse(trat.subsecciones || "[]");
    } catch (e) {
        console.error("Error parseando subsecciones:", e);
    }
    
    // Separamos la Entrada (índice 0) del Cuerpo (resto)
    const entradaRaw = parrafos.length > 0 ? parrafos[0] : "";
    const cuerpoArray = parrafos.length > 1 ? parrafos.slice(1) : [];

    // Formateamos la Entrada y el Cuerpo
    const entradaHtml = formatearTextoPersonalizado(entradaRaw);
    const cuerpoHtml = cuerpoArray
        .map(p => `<p>${formatearTextoPersonalizado(p)}</p>`)
        .join('');

    // Formateamos las Subsecciones
    const subsHtml = Array.isArray(subsArr)
        ? subsArr.map(sub => {
            const tituloSub = sub.titulo ? `<h3>${escapeHtml(sub.titulo)}</h3>` : "";
            let contenidoHtml = "";
            if (Array.isArray(sub.contenido)) {
                contenidoHtml = sub.contenido.map(p => `<p>${formatearTextoPersonalizado(p)}</p>`).join("");
            } else if (typeof sub.contenido === "string") {
                contenidoHtml = `<p>${formatearTextoPersonalizado(sub.contenido)}</p>`;
            }

            return `<div class="tratamiento-cuerpo texto"> ${tituloSub} ${contenidoHtml}</div>`;
        }).join("")
        : "";

    // CRÍTICO: Usamos las clases de Tratamiento (.tratamiento-detalle, .tratamiento-titulo, etc.)
    section.innerHTML = `
        <article class="tratamiento-detalle">
            <header class="tratamiento-header">
                <h1 class="tratamiento-titulo">${escapeHtml(trat.titulo)}</h1>
            </header>

            ${entradaHtml ? `
                <div class="tratamiento-entrada">
                    <div class="texto">
                           <p>${entradaHtml}</p>
                    </div>
                </div>
            ` : ''}

            ${trat.imagen ? `
                <figure class="tratamiento-imagen-container">
                    <img src="${escapeAttr(trat.imagen)}" alt="${escapeAttr(trat.titulo)}" class="tratamiento-imagen">
                </figure>
            ` : ""}

            <div class="tratamiento-cuerpo">
                ${cuerpoHtml}
                ${cuerpoHtml && subsHtml ? '' : ''}
                ${subsHtml}
            </div>

            <div class="tratamiento-footer boton-solicitar">
                <button class="btn-solicitar">Solicitar consulta</button>
            </div>

            <div class="botones-navegacion">
                <button class="btn-anterior">
                    <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
                        <path d="M10.226 1.05296C10.0932 0.919055 9.93518 0.812773 9.76109 0.740243C9.587 0.667713 9.40027 0.630371 9.21167 0.630371C9.02307 0.630371 8.83634 0.667713 8.66225 0.740243C8.48816 0.812773 8.33015 0.919055 8.19734 1.05296L1.05418 8.19612C0.920275 8.32893 0.813993 8.48694 0.741464 8.66103C0.668934 8.83512 0.631592 9.02185 0.631592 9.21045C0.631592 9.39905 0.668934 9.58578 0.741464 9.75987C0.813993 9.93396 0.920275 10.092 1.05418 10.2248L8.19734 17.3679C8.33015 17.5018 8.48816 17.6081 8.66225 17.6807C8.83634 17.7532 9.02307 17.7905 9.21167 17.7905C9.40027 17.7905 9.587 17.7532 9.76109 17.6807C9.93518 17.6081 10.0932 17.5018 10.226 17.3679Z" fill="#824C91" />
                    </svg>
                    Anterior
                </button>

                <button class="btn-siguiente">
                    Siguiente
                    <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
                        <path d="M1.40559 1.05296C1.5384 0.919055 1.69641 0.812773 1.8705 0.740243C2.04459 0.667713 2.23133 0.630371 2.41992 0.630371C2.60852 0.630371 2.79525 0.667713 2.96934 0.740243C3.14343 0.812773 3.30144 0.919055 3.43425 1.05296L10.5774 8.19612C10.7113 8.32893 10.8176 8.48694 10.8901 8.66103C10.9627 8.83512 11 9.02185 11 9.21045C11 9.39905 10.9627 9.58578 10.8901 9.75987C10.8176 9.93396 10.7113 10.092 10.5774 10.2248L3.43425 17.3679Z" fill="#824C91" />
                    </svg>
                </button>
            </div>
        </article>
    `;
}

// --- FUNCIÓN DE CARGA DEL LISTADO (CRÍTICO: Usa las clases de Card Tratamiento) ---
async function listarTodosLosTratamientos(section, API) {
    try {
        const res = await fetch(API);
        const tratamientos = await res.json();
        if (!res.ok || !Array.isArray(tratamientos)) {
            section.innerHTML = `<p>No se pudieron cargar los tratamientos.</p>`;
            return;
        }

        if (tratamientos.length === 0) {
            section.innerHTML = `<p>No hay tratamientos cargados aún.</p>`;
            return;
        }

        // CRÍTICO: Usamos las clases de Tratamiento para el listado
        section.innerHTML = `
            <div class="lista-tratamientos">
                ${tratamientos.map(t => `
                    <a class="card-tratamiento" href="?id=${encodeURIComponent(t.id)}" style="display: block; text-decoration: none;">
                        <div class="card-tratamiento__media">
                            ${t.imagen ? `<img src="${escapeAttr(t.imagen)}" alt="${escapeAttr(t.titulo)}">` : ""}
                        </div>
                        <div class="card-tratamiento__overlay">
                            <h3 class="card-tratamiento__titulo">${escapeHtml(t.titulo)}</h3>
                        </div>
                    </a>
                `).join("")}
            </div>
        `;
    } catch (e) {
        console.error("Error listando tratamientos:", e);
        section.innerHTML = `<p>Error de conexión</p>`;
    }
}

// --- FUNCIÓN DE NAVEGACIÓN (Universal) ---
async function inicializarNavegacion(API, idActual, tipo) {
    const btnAnterior = document.querySelector(".btn-anterior");
    const btnSiguiente = document.querySelector(".btn-siguiente");
    if (!btnAnterior || !btnSiguiente) return;

    try {
        const res = await fetch(API);
        const lista = await res.json();
        if (!Array.isArray(lista)) return;

        // CRÍTICO: Aseguramos que la navegación se muestre
        const navContainer = document.querySelector(".botones-navegacion");
        if(navContainer) navContainer.style.display = 'flex';
        
        lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));

        const idx = lista.findIndex(n => String(n.id) === String(idActual));
        if (idx === -1) return;

        const anterior = idx > 0 ? lista[idx - 1] : null;
        const siguiente = idx < lista.length - 1 ? lista[idx + 1] : null;

        if (anterior) {
            btnAnterior.disabled = false;
            btnAnterior.onclick = () => window.location.search = `?id=${encodeURIComponent(anterior.id)}`;
        } else {
            btnAnterior.disabled = true;
        }

        if (siguiente) {
            btnSiguiente.disabled = false;
            btnSiguiente.onclick = () => window.location.search = `?id=${encodeURIComponent(siguiente.id)}`;
        } else {
            btnSiguiente.disabled = true;
        }
    } catch (e) {
        console.error("Error en navegación:", e);
    }
}