document.addEventListener("DOMContentLoaded", async () => {
  const API = "/api/nota_get.php";
  const section = document.querySelector(".notas-body");
  if (!section) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    if (id) {
      // Detalle de una nota
      const res = await fetch(`${API}?id=${encodeURIComponent(id)}`);
      const nota = await res.json();

      if (!res.ok || nota.error) {
        section.innerHTML = `<p>${nota.error || "Error cargando la nota"}</p>`;
        return;
      }

      // Parsear texto y subsecciones que vienen como strings JSON
      let textoArr = [];
      let subsArr = [];

      try {
        textoArr = JSON.parse(nota.texto || "[]");
      } catch (e) {
        console.error("Error parseando texto:", e);
      }

      try {
        subsArr = JSON.parse(nota.subsecciones || "[]");
      } catch (e) {
        console.error("Error parseando subsecciones:", e);
      }

      // --- CORRECCIÓN 1: Renderizar subsecciones usando el formateador ---
      const subsHtml = Array.isArray(subsArr)
        ? subsArr.map(sub => {
            const tituloSub = sub.titulo ? `<h3>${escapeHtml(sub.titulo)}</h3>` : "";
            let contenidoHtml = "";
            
            // Aquí estaba el error: antes usabas escapeHtml directo.
            // Ahora usamos formatearTextoPersonalizado
            if (Array.isArray(sub.contenido)) {
              contenidoHtml = sub.contenido.map(p => `<p>${formatearTextoPersonalizado(p)}</p>`).join("");
            } else if (typeof sub.contenido === "string") {
              contenidoHtml = `<p>${formatearTextoPersonalizado(sub.contenido)}</p>`;
            }
            
            return `
              <div class="texto texto-2">
                ${tituloSub}
                ${contenidoHtml}
              </div>
            `;
          }).join("")
        : "";

      // 1. Parseamos el JSON que viene de la base de datos (Cuerpo Principal)
      let parrafos = [];
      try {
        parrafos = JSON.parse(nota.texto);
      } catch (e) {
        console.error("Error parseando nota.texto", e);
        parrafos = [nota.texto];
      }

      // 2. Separamos la Entrada (índice 0) del Cuerpo (resto del array)
      const entradaRaw = parrafos.length > 0 ? parrafos[0] : "";
      const cuerpoArray = parrafos.length > 1 ? parrafos.slice(1) : [];

      // 3. Convertimos a HTML usando la función personalizada
      const entradaHtml = formatearTextoPersonalizado(entradaRaw);

      const cuerpoHtml = cuerpoArray
        .map(p => `<p>${formatearTextoPersonalizado(p)}</p>`)
        .join('');


      section.innerHTML = `
            <article class="nota-detalle">
                
                <header class="nota-header">
                    <h1 class="nota-titulo">${escapeHtml(nota.titulo)}</h1>
                </header>

                ${entradaHtml ? `
                    <div class="nota-entrada">
                        <div class="texto">
                             <p>${entradaHtml}</p>
                        </div>
                    </div>
                ` : ''}

                ${nota.imagen ? `
                    <figure class="nota-imagen-container">
                        <img src="${escapeAttr(nota.imagen)}" alt="${escapeAttr(nota.titulo)}" class="nota-imagen">
                    </figure>
                ` : ""}

                <div class="nota-cuerpo">
                    ${cuerpoHtml}
                    ${cuerpoHtml && subsHtml ? '<br>' : ''}
                    ${subsHtml}
                </div>

                <div class="nota-footer">
                    <button class="btn-solicitar">Solicitar consulta</button>
                </div>

            </article>
        `;
      
      inicializarNavegacion(API, id);
    } else {
      listarTodasLasNotas(section, API);
    }
  } catch (err) {
    console.error(err);
    section.innerHTML = `<p>Error de conexión</p>`;
  }
});

// --- FUNCIONES AUXILIARES ---

function escapeHtml(str) {
  if (typeof str !== 'string') return str; // Protección extra
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

async function listarTodasLasNotas(section, API) {
  try {
    const res = await fetch(API);
    const notas = await res.json();
    if (!res.ok || !Array.isArray(notas)) {
      section.innerHTML = `<p>No se pudieron cargar las notas.</p>`;
      return;
    }

    if (notas.length === 0) {
      section.innerHTML = `<p>No hay notas cargadas aún.</p>`;
      return;
    }

    section.innerHTML = `
        <div class="lista-notas">
          ${notas.map(n => `
            <a class="card-nota" href="?id=${encodeURIComponent(n.id)}" style="display: block; text-decoration: none;">
              <div class="card-nota__media">
                ${n.imagen ? `<img src="${escapeAttr(n.imagen)}" alt="${escapeAttr(n.titulo)}">` : ""}
              </div>
              <div class="card-nota__overlay">
                <h3 class="card-nota__titulo">${escapeHtml(n.titulo)}</h3>
              </div>
            </a>
          `).join("")}
        </div>
      `;
  } catch (e) {
    console.error(e);
    section.innerHTML = `<p>Error de conexión</p>`;
  }
}

async function inicializarNavegacion(API, idActual) {
  const btnAnterior = document.querySelector(".btn-anterior");
  const btnSiguiente = document.querySelector(".btn-siguiente");
  // Verificamos si los botones existen en el HTML antes de usarlos
  if (!btnAnterior && !btnSiguiente) return; 

  try {
    const res = await fetch(API);
    const lista = await res.json();
    if (!Array.isArray(lista)) return;

    lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));

    const idx = lista.findIndex(n => String(n.id) === String(idActual));
    if (idx === -1) return;

    const anterior = idx > 0 ? lista[idx - 1] : null;
    const siguiente = idx < lista.length - 1 ? lista[idx + 1] : null;

    if (btnAnterior) {
        if (anterior) {
            btnAnterior.disabled = false;
            btnAnterior.onclick = () => window.location.search = `?id=${encodeURIComponent(anterior.id)}`;
        } else {
            btnAnterior.disabled = true;
        }
    }

    if (btnSiguiente) {
        if (siguiente) {
            btnSiguiente.disabled = false;
            btnSiguiente.onclick = () => window.location.search = `?id=${encodeURIComponent(siguiente.id)}`;
        } else {
            btnSiguiente.disabled = true;
        }
    }
  } catch (e) {
    console.error(e);
  }
}

/* --- CORRECCIÓN 2: Lógica de Formateo Robusta (Tokens) --- */
function formatearTextoPersonalizado(textoRaw) {
  if (!textoRaw) return "";

  // 1. SEGURIDAD
  let texto = escapeHtml(textoRaw);

  // 2. DEFINICIÓN DE TOKENS
  const T_BOLD   = "###TOKEN_BOLD###";
  const T_VIOLET = "###TOKEN_VIOLET###";
  const T_TAB    = "###TOKEN_TAB###";

  // 3. REEMPLAZO
  texto = texto.replace(/\\r\\n|\r\n/g, T_BOLD);   
  texto = texto.replace(/\\n|\n/g, T_VIOLET);      
  texto = texto.replace(/\\t|\t/g, T_TAB);         

  // 4. PROCESAR ESTRUCTURA
  const partesVioleta = texto.split(T_VIOLET);

  return partesVioleta.map((parte, index) => {

    // --- ESTILOS INTERNOS ---
    let textoEstilizado = procesarEstilo(parte, T_BOLD, 'strong');
    textoEstilizado = procesarEstilo(textoEstilizado, T_TAB, 'em');
    // ------------------------

    // C. Aplicar Estilo Violeta (Si es impar)
    if (index % 2 === 1) {
        if (!textoEstilizado.trim()) return ""; 
        
        const htmlTitulo = `<br><h4 class="subtitulo-violeta">${textoEstilizado}</h4>`;

        
           
        
        
        // Para el resto, lo devolvemos normal
        return htmlTitulo;
    }

    return textoEstilizado;

  }).join('');
}

// Función auxiliar para cortar y envolver (reutilizable para Bold e Italic)
function procesarEstilo(texto, token, etiqueta) {
    if (!texto.includes(token)) return texto;

    return texto.split(token).map((fragmento, i) => {
        // Si el índice es impar, aplicamos la etiqueta
        if (i % 2 === 1) {
            return `<${etiqueta}>${fragmento}</${etiqueta}>`;
        }
        return fragmento;
    }).join('');
}