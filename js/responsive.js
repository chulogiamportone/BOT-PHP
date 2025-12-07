
function ajustarEscala() {
    // 1. Definimos el ancho base de tu diseño
    const anchoDiseno = 429;

    // 2. Obtenemos el ancho actual de la ventana del usuario
    const anchoVentana = window.innerWidth;

    // 3. Calculamos la escala (Ej: si la ventana es 860px, la escala será 2)
    const escala = anchoVentana / anchoDiseno;

    // 4. Aplicamos el zoom al body o al contenedor principal
    document.body.style.zoom = escala;
}

// Ejecutamos la función al cargar la página
ajustarEscala();

// Y también cada vez que el usuario redimensione la ventana
window.addEventListener('resize', ajustarEscala);
