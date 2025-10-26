document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "vitamina-c"; // por defecto

    const response = await fetch(`../nota.php?id=${id}`);
    const nota = await response.json();

    if (nota.error) {
        document.querySelector(".notas-body").innerHTML = `<p>${nota.error}</p>`;
        return;
    }

    const section = document.querySelector(".notas-body");
    section.innerHTML = `
        <div class="titulo"><h2>${nota.titulo}</h2></div>
        <div class="texto texto-1">
            ${nota.texto.map(p => `<p>${p}</p>`).join("")}
        </div>
        <div class="megadosis-image"><img src="${nota.imagen}" alt="${nota.titulo}"></div>
        ${nota.subsecciones.map(sub => `
            <div class="texto texto-2">
                <h3>${sub.titulo}</h3>
                ${sub.contenido.map(p => `<p>${p}</p>`).join("")}
            </div>
        `).join("")}
        <div class="boton-solicitar"><button>Solicitar consulta</button></div>
    `;
});
