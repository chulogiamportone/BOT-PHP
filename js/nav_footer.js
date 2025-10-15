// Función para incluir fragmentos HTML
function includeHTML() {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(el => {
    const file = el.getAttribute('data-include');
    if (file) {
      fetch(file)
        .then(response => {
          if (!response.ok) throw new Error(`Error cargando ${file}`);
          return response.text();
        })
        .then(data => {
          el.innerHTML = data;
        })
        .catch(err => {
          console.error(err);
          el.innerHTML = "<p>Error al cargar contenido.</p>";
        });
    }
  });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", includeHTML);