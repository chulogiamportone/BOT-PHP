let currentSlide = 0;
const slides = document.querySelectorAll('.slider-image');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function changeSlide(index) {
    // Remover clase active de todos
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Agregar clase active al seleccionado
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Reiniciar el intervalo automático
    resetInterval();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    changeSlide(currentSlide);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 4000); // Cambia cada 4 segundos
}

function resetInterval() {
    clearInterval(slideInterval);
    startSlider();
}

// Iniciar el slider automáticamente
startSlider();

// Pausar al pasar el mouse
document.querySelector('.Slider').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

// Reanudar al quitar el mouse
document.querySelector('.Slider').addEventListener('mouseleave', () => {
    startSlider();
});