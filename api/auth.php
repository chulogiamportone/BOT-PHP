<?php
// Poner esto AL PRINCIPIO de index.php Y de api/auth.php
// (Justo después de <?php y antes de cualquier otra cosa)

session_set_cookie_params([
    'lifetime' => 0,            // Borrar al cerrar navegador
    'path' => '/',              // Disponible en todo el sitio
    'domain' => null,           // null = usar el dominio actual automáticamente
    'secure' => true,           // ¡OBLIGATORIO PARA HTTPS!
    'httponly' => true,         // Seguridad contra XSS
    'samesite' => 'Lax'         // Necesario para que la cookie sobreviva redirecciones
]);

session_name('MICAEL_APP');
session_start();

require 'config.php'; 

// Headers para respuesta JSON
header('Content-Type: application/json; charset=UTF-8');

// --- LÓGICA DE LOGIN ---
$action = $_POST['action'] ?? '';

if ($action === 'login') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Buscar usuario en DB
    // Asegúrate que tu tabla y columnas coincidan
    $stmt = $pdo->prepare("SELECT id, nombre, email, password FROM usuarios WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar contraseña
    if ($usuario && password_verify($password, $usuario['password'])) {
        
        // Asignar variables de sesión
        $_SESSION['user_id'] = $usuario['id'];
        $_SESSION['user_name'] = $usuario['nombre'];

        // FORZAR ESCRITURA DE SESIÓN ANTES DE SEGUIR
        session_write_close();

        // LIMPIAR CUALQUIER BASURA ANTERIOR Y MANDAR JSON
        ob_clean(); 
        echo json_encode(['success' => true]);
        exit(); // Mata el proceso aquí para evitar duplicados
    } else {
        // Error de credenciales
        ob_clean();
        echo json_encode(['success' => false, 'error' => 'Usuario o contraseña incorrectos']);
        exit();
    }
}

// Si la acción no es login
ob_clean();
echo json_encode(['success' => false, 'error' => 'Acción no válida']);
exit();