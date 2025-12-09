// nav_bar.js (modificado para scroll correcto)

document.addEventListener("htmlIncluded", () => {
    if (document.querySelector("#menuContent")) {
        initMenu();
    }
});

(function () {
    function initMenu() {
        const menuButton = document.getElementById("menuButton");
        const menuContent = document.getElementById("menuContent");
        const menuButtons = document.querySelectorAll(".menu_button");

        if (!menuButton || !menuContent) {
            console.error("nav_bar: no se encontró menuButton o menuContent");
            return;
        }

        // Toggle menú
        menuButton.addEventListener("click", (e) => {
            e.stopPropagation();
            menuContent.classList.toggle("show");
        });

        // Evitar cerrar al hacer click dentro del menú
        menuContent.addEventListener("click", (e) => e.stopPropagation());

        // Cerrar menú al hacer click fuera
        document.addEventListener("click", () => {
            if (menuContent.classList.contains("show")) {
                menuContent.classList.remove("show");
            }
        });

        // Cerrar con ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") menuContent.classList.remove("show");
        });

        // Manejo de botones internos
        menuButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault(); // Evita cualquier comportamiento por href
                const targetId = btn.getAttribute("data-view") || btn.getAttribute("href");

                if (!targetId) return;

                // Buscamos la sección por ID (más confiable que name)
                const section = document.getElementById(targetId);

                if (section) {
                    section.scrollIntoView({ behavior: "smooth" });

                } else {
                    window.location.href = targetId ;
                    console.warn(`nav_bar: no se encontró sección con id="${targetId}"`);
                }

                // Cerrar menú
                menuContent.classList.remove("show");
            });
        });
    }


    console.log(document.querySelectorAll('#Tratamientos_Index').length);
    console.log(document.getElementById('Tratamientos_Index'))
    const s = document.getElementById('Tratamientos_Index');
    s && console.log(s.getBoundingClientRect().top, window.pageYOffset);
    const h = document.querySelector('header');
    h && console.log(getComputedStyle(h).position, h.offsetHeight);



    // Inicialización con htmlIncluded
    document.addEventListener("htmlIncluded", initMenu);

    // Fallback por si include_html ya cargó antes
    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(initMenu, 50);
    });
})();
