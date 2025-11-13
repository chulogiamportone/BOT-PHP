document.addEventListener("DOMContentLoaded", async () => {
  const API = "/api/tratamiento_get.php";
  const section = document.querySelector(".notas-body");
  if (!section) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    if (id) {
      // Detalle de un tratamiento
      const res = await fetch(`${API}?id=${encodeURIComponent(id)}`);
      const trat = await res.json();

      if (!res.ok || trat.error) {
        section.innerHTML = `<p>${trat.error || "Error cargando el tratamiento"}</p>`;
        return;
      }

      // Parsear texto y subsecciones que vienen como strings JSON
      let textoArr = [];
      let subsArr = [];

      try {
        textoArr = JSON.parse(trat.texto || "[]");
      } catch (e) {
        console.error("Error parseando texto:", e);
      }

      try {
        subsArr = JSON.parse(trat.subsecciones || "[]");
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
        <div class="titulo"><h2>${escapeHtml(trat.titulo)}</h2></div>
        <div class="texto texto-1">
          ${textoHtml}
        </div>
        ${trat.imagen ? `<div class="megadosis-image"><img src="${escapeAttr(trat.imagen)}" alt="${escapeAttr(trat.titulo)}"></div>` : ""}
        ${subsHtml}
      `;

      // Botones Anterior / Siguiente
      inicializarNavegacion(API, id);
    } else {
      // Si no hay id, listar todos los tratamientos
      listarTodosLosTratamientos(section, API);
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

    section.innerHTML = `
      <div class="lista-notas">
        ${tratamientos.map(t => {
          // Parsear texto para mostrar preview
          let textoArr = [];
          try {
            textoArr = JSON.parse(t.texto || "[]");
          } catch (e) {}
          const preview = Array.isArray(textoArr) && textoArr.length > 0 
            ? escapeHtml(textoArr[0]).substring(0, 150) + "..." 
            : "";

          return `
            <article class="nota-item">
              ${t.imagen ? `<div class="nota-thumb"><img src="${escapeAttr(t.imagen)}" alt="${escapeAttr(t.titulo)}"></div>` : ""}
              <div class="nota-info">
                <h3>${escapeHtml(t.titulo)}</h3>
                ${preview ? `<p>${preview}</p>` : ""}
                <a class="btn-ver" href="?id=${encodeURIComponent(t.id)}">Ver tratamiento</a>
              </div>
            </article>
          `;
        }).join("")}
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