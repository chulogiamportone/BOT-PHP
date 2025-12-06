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

      // Renderizar texto
      const textoHtml = Array.isArray(textoArr)
        ? textoArr.map(p => `<p>${escapeHtml(p)}</p>`).join("")
        : "";

      // Renderizar subsecciones
      const subsHtml = Array.isArray(subsArr)
        ? subsArr.map(sub => {
          const tituloSub = sub.titulo ? `<h3>${escapeHtml(sub.titulo)}</h3>` : "";
          let contenidoHtml = "";
          if (Array.isArray(sub.contenido)) {
            contenidoHtml = sub.contenido.map(p => `<p>${escapeHtml(p)}</p>`).join("");
          } else if (typeof sub.contenido === "string") {
            contenidoHtml = `<p>${escapeHtml(sub.contenido)}</p>`;
          }
          return `
              <div class="texto texto-2">
                ${tituloSub}
                ${contenidoHtml}
              </div>
            `;
        }).join("")
        : "";

      section.innerHTML = `
        <div class="titulo"><h2>${escapeHtml(nota.titulo)}</h2></div>
        <div class="texto texto-1">
          ${textoHtml}
        </div>
        ${nota.imagen ? `<div class="megadosis-image"><img src="${escapeAttr(nota.imagen)}" alt="${escapeAttr(nota.titulo)}"></div>` : ""}
        ${subsHtml}
        <div class="boton-solicitar"><button>Solicitar consulta</button></div>
      `;

      // Botones Anterior / Siguiente
      inicializarNavegacion(API, id);
    } else {
      // Si no hay id, listar todas las notas
      listarTodasLasNotas(section, API);
    }
  } catch (err) {
    console.error(err);
    section.innerHTML = `<p>Error de conexión</p>`;
  }
});

function escapeHtml(str) {
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
  if (!btnAnterior || !btnSiguiente) return;

  try {
    const res = await fetch(API);
    const lista = await res.json();
    if (!Array.isArray(lista)) return;

    lista.sort((a, b) => a.titulo.localeCompare(b.titulo, 'es'));

    const idx = lista.findIndex(n => String(n.id) === String(idActual));
    if (idx === -1) return;

    const anterior = idx > 0 ? lista[idx - 1] : null;
    const siguiente = idx < lista.length - 1 ? lista[idx + 1] : null;

    if (anterior) {
      btnAnterior.disabled = false;
      btnAnterior.addEventListener("click", () => {
        window.location.search = `?id=${encodeURIComponent(anterior.id)}`;
      });
    } else {
      btnAnterior.disabled = true;
    }

    if (siguiente) {
      btnSiguiente.disabled = false;
      btnSiguiente.addEventListener("click", () => {
        window.location.search = `?id=${encodeURIComponent(siguiente.id)}`;
      });
    } else {
      btnSiguiente.disabled = true;
    }
  } catch (e) {
    console.error(e);
  }
}