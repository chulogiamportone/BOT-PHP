document.addEventListener("DOMContentLoaded", async () => {
  const API = "/api/profesional_get.php";
  const section = document.querySelector(".notas-body");
  if (!section) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    if (id) {
      // Detalle de un profesional
      const res = await fetch(`${API}?id=${encodeURIComponent(id)}`);
      const prof = await res.json();

      if (!res.ok || prof.error) {
        section.innerHTML = `<p>${prof.error || "Error cargando el perfil"}</p>`;
        return;
      }

      // Renderizar detalle
      section.innerHTML = `
        <div class="titulo"><h2>${escapeHtml(prof.nombre)}</h2></div>
        ${prof.titulo ? `<div class="texto texto-1"><p><strong>${escapeHtml(prof.titulo)}</strong></p></div>` : ""}
        ${prof.imagen ? `<div class="megadosis-image"><img src="${escapeAttr(prof.imagen)}" alt="${escapeAttr(prof.nombre)}"></div>` : ""}
        <div class="texto texto-1">
          ${prof.descripcion_larga ? formatearTexto(prof.descripcion_larga) : ""}
        </div>
      `;

      // Botones Anterior / Siguiente
      inicializarNavegacion(API, id);
    } else {
      // Si no hay id, listar todos los profesionales
      listarTodosLosProfesionales(section, API);
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

function formatearTexto(texto) {
  // Divide por saltos de línea y envuelve cada párrafo en <p>
  return texto
    .split('\n')
    .filter(p => p.trim() !== '')
    .map(p => `<p>${escapeHtml(p)}</p>`)
    .join('');
}

async function listarTodosLosProfesionales(section, API) {
  try {
    const res = await fetch(API);
    const profesionales = await res.json();
    if (!res.ok || !Array.isArray(profesionales)) {
      section.innerHTML = `<p>No se pudieron cargar los profesionales.</p>`;
      return;
    }

    if (profesionales.length === 0) {
      section.innerHTML = `<p>No hay profesionales cargados aún.</p>`;
      return;
    }

    section.innerHTML = `
      <div class="lista-notas">
        ${profesionales.map(p => `
          <article class="nota-item">
            ${p.imagen ? `<div class="nota-thumb"><img src="${escapeAttr(p.imagen)}" alt="${escapeAttr(p.nombre)}"></div>` : ""}
            <div class="nota-info">
              <h3>${escapeHtml(p.nombre)}</h3>
              ${p.titulo ? `<p><strong>${escapeHtml(p.titulo)}</strong></p>` : ""}
              ${p.descripcion_corta ? `<p>${escapeHtml(p.descripcion_corta)}</p>` : ""}
              <a class="btn-ver" href="?id=${encodeURIComponent(p.id)}">Ver perfil</a>
            </div>
          </article>
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

    lista.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || "", "es"));

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