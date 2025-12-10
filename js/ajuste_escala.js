
//Ajuste de escala

function ajustarEscala() {
  // 1. Ancho base de tu diseño (móvil)
  const anchoDiseno = 430;

  // 2. Límite máximo (donde quieres que deje de crecer)
  // Puedes cambiar 1080 por otro número si quieres que pare antes o después
  const anchoMaximo = 1080;

  // 3. Obtenemos el ancho real de la ventana
  const anchoVentana = window.innerWidth;

  // 4. LÓGICA DE PROTECCIÓN:
  // Si la pantalla es gigante (ej: 1920px), hacemos de cuenta que es de 1080px.
  // Si es chica (ej: 360px), usamos el tamaño real.
  const anchoParaCalculo = Math.min(anchoVentana, anchoMaximo);

  // 5. Calculamos el zoom
  const escala = anchoParaCalculo / anchoDiseno;

  // 6. Aplicamos el zoom
  document.body.style.zoom = escala;
}

// Ejecutamos la función al cargar y al mover la ventana
ajustarEscala();
window.addEventListener('resize', ajustarEscala);