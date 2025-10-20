// nav_bar.js
document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const menuContent = document.getElementById("menuContent");
    const menuButtons = document.querySelectorAll(".menu_button");

    // Alternar visibilidad del menú
    menuButton.addEventListener("click", () => {
        menuContent.classList.toggle("show");
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener("click", (e) => {
        if (!menuContent.contains(e.target) && !menuButton.contains(e.target)) {
            menuContent.classList.remove("show");
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            menuContent.classList.remove("show");
        }
    });

    // Redirección o llamada al controlador
    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const view = btn.dataset.view;

            // OPCIÓN A: Redirección directa (rutas reales)
            // window.location.href = `${view}.html`;

            // OPCIÓN B: Disparar evento para controlador SPA
            const navEvent = new CustomEvent("app:navigate", { detail: { view } });
            document.dispatchEvent(navEvent);

            // Ocultar el menú
            menuContent.classList.remove("show");
        });
    });
});
