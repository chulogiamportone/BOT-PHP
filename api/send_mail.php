<?php
// Asegúrate de que config.php conecta a la BD correctamente
require 'config.php';

// --- CONFIGURACIÓN ---
// 1. Correo donde TÚ recibirás las consultas
$mi_correo_real = "contacto@micaelmedicinaintegrativa.com.ar";

// 2. Correo que usa el servidor para enviar (Debe ser de tu dominio)
$correo_servidor = "contacto@micaelmedicinaintegrativa.com.ar";


// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Método no permitido']));
}

// Recibir datos del formulario (usamos null coalescing operator ?? para evitar errores)
$nombre = trim($_POST['nombre'] ?? '');
$email_usuario = trim($_POST['email'] ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$comentario = trim($_POST['comentario'] ?? '');
$enviar_copia = isset($_POST['enviarCopia']) ? 1 : 0;

// Validaciones básicas
if (empty($nombre) || empty($email_usuario) || empty($telefono) || empty($comentario)) {
    http_response_code(400);
    exit(json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']));
}

try {
    // 1. GUARDAR EN BASE DE DATOS
    // Asumimos que $pdo viene de config.php
    $stmt = $pdo->prepare("INSERT INTO mensajes (nombre, email, telefono, comentario, enviar_copia) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$nombre, $email_usuario, $telefono, $comentario, $enviar_copia]);


    // 2. ENVIAR CORREO AL ADMINISTRADOR (A TI)
    $asunto = "Nuevo mensaje web de: $nombre";
    
    $cuerpo_mensaje = "Has recibido una nueva consulta desde la web:\n\n";
    $cuerpo_mensaje .= "Nombre: $nombre\n";
    $cuerpo_mensaje .= "Email: $email_usuario\n";
    $cuerpo_mensaje .= "Teléfono: $telefono\n\n";
    $cuerpo_mensaje .= "Mensaje:\n$comentario\n";
    $cuerpo_mensaje .= "\n--------------------------\n";
    $cuerpo_mensaje .= "Este mensaje fue guardado en la base de datos.";

    // Cabeceras para evitar SPAM
    // IMPORTANTE: El 'From' es TU servidor, el 'Reply-To' es el cliente.
    $cabeceras  = "From: Web Micael <$correo_servidor>\r\n";
    $cabeceras .= "Reply-To: $email_usuario\r\n";
    $cabeceras .= "MIME-Version: 1.0\r\n";
    $cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $cabeceras .= "X-Mailer: PHP/" . phpversion();

    // Enviar
    mail($mi_correo_real, $asunto, $cuerpo_mensaje, $cabeceras);


    // 3. ENVIAR COPIA AL USUARIO (Si marcó el checkbox)
    if ($enviar_copia) {
        $asunto_copia = "Copia de tu consulta - Micael Medicina Integrativa";
        
        $cuerpo_copia = "Hola $nombre,\n\n";
        $cuerpo_copia .= "Gracias por contactarte con Micael Medicina Integrativa. ";
        $cuerpo_copia .= "Hemos recibido tu mensaje correctamente:\n\n";
        $cuerpo_copia .= "\"$comentario\"\n\n";
        $cuerpo_copia .= "Nos pondremos en contacto contigo a la brevedad.\n\n";
        $cuerpo_copia .= "Atentamente,\nEl equipo de Micael Medicina Integrativa.";

        // Aquí el 'From' eres tú y va dirigido al usuario
        $cabeceras_copia  = "From: Micael Medicina Integrativa <$correo_servidor>\r\n";
        $cabeceras_copia .= "Reply-To: $correo_servidor\r\n";
        $cabeceras_copia .= "Content-Type: text/plain; charset=UTF-8\r\n";

        mail($email_usuario, $asunto_copia, $cuerpo_copia, $cabeceras_copia);
    }

    // Respuesta exitosa para el Javascript
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    // Error en base de datos o servidor
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Error interno del servidor']);
}
?>