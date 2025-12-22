document.addEventListener("htmlIncluded", () => {
	initBurguerMenu();
});

// Fallback por si el evento htmlIncluded ya pasó o no se dispara
if (document.readyState === "complete" || document.readyState === "interactive") {
	setTimeout(initBurguerMenu, 100);
} else {
	document.addEventListener("DOMContentLoaded", () => {
		setTimeout(initBurguerMenu, 100);
	});
}

function initBurguerMenu() {
	const menuButton = document.getElementById("menuButton");
	const menuContent = document.getElementById("menuContent");
	const navBar = document.querySelector(".NavBar");
	const menuLinks = document.querySelectorAll(".menu_button");

	// 1. Validación de seguridad: Si no existen los elementos o YA se iniciaron, frenamos.
	if (!menuButton || !menuContent || menuButton.dataset.init === "true") {
		return;
	}

	// Marcamos el botón como "iniciado" para evitar duplicar la lógica
	menuButton.dataset.init = "true";

	// ----------------------------------------------------
	// LÓGICA 1: Scroll de la Barra (Color de fondo)
	// ----------------------------------------------------
	window.addEventListener("scroll", () => {
		if (window.scrollY > 100) {
			navBar.classList.add("scrolled");
			document.body.classList.add("scrolled-mode");
		} else {
			navBar.classList.remove("scrolled");
			document.body.classList.remove("scrolled-mode");
		}
	});

	// ----------------------------------------------------
	// LÓGICA 2: Abrir / Cerrar Menú (Fix Móvil)
	// ----------------------------------------------------
	
	// Usamos 'onclick' directo para evitar acumulación de listeners
	menuButton.onclick = (e) => {
		// Detenemos la propagación para que el document no reciba el click
		e.stopPropagation();
		e.preventDefault();
		menuContent.classList.toggle("show");
	};

	// Evitar que clicks DENTRO del menú lo cierren (excepto los botones)
	menuContent.onclick = (e) => {
		e.stopPropagation();
	};

	// Click en cualquier parte del documento cierra el menú
	document.addEventListener("click", (e) => {
		// Solo cerramos si está abierto y el click no fue en el botón
		if (menuContent.classList.contains("show")) {
			menuContent.classList.remove("show");
		}
	});

	// Cerrar con tecla ESC
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && menuContent.classList.contains("show")) {
			menuContent.classList.remove("show");
		}
	});

	// ----------------------------------------------------
	// LÓGICA 3: Navegación (Links del menú)
	// ----------------------------------------------------
	menuLinks.forEach((btn) => {
		btn.onclick = (e) => {
			// 1. Cerramos el menú inmediatamente
			menuContent.classList.remove("show");

			// 2. Obtenemos el destino
			const targetId = btn.getAttribute("data-view") || btn.getAttribute("href");
			if (!targetId) return;

			// 3. Verificamos si es un ancla interna (#) o navegación
			const section = document.getElementById(targetId);

			if (section) {
				e.preventDefault(); // Evitamos recarga si es en la misma página
				section.scrollIntoView({ behavior: "smooth" });
			} else {
				// Dejamos que el href funcione normal para ir a otra página
				// Si usas data-view y no es href, forzamos la redirección:
				if (!btn.getAttribute("href")) {
					window.location.href = targetId;
				}
			}
		};
	});
}