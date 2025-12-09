// Esperamos a que todo el HTML esté cargado antes de ejecutar nada
document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.getElementById('loginForm');

    // Verificamos si el formulario realmente existe para evitar el error
    if (loginForm) {

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(loginForm);

            // AGREGAMOS LA ACCIÓN PARA EL NUEVO INDEX.PHP
            formData.append('action', 'login');

            fetch('index.php', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error en la red o servidor');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        window.location.href = './';
                    } else {
                        alert(data.error || 'Error desconocido');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Ocurrió un error al intentar iniciar sesión.');
                });
        });

    } else {
        console.error("Error: No se encontró el formulario con id='formLogin'. Revisa tu HTML.");
    }
});