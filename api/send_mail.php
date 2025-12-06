<?php
require 'config.php';
require 'mailer.php';
// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método no permitido');
}

// Recibir datos del formulario
$nombre = trim($_POST['nombre']);
$email = trim($_POST['email']);
$telefono = trim($_POST['telefono']);
$comentario = trim($_POST['comentario']);
$enviar_copia = isset($_POST['enviarCopia']) ? 1 : 0;

// Validaciones básicas
if (!$nombre || !$email || !$telefono || !$comentario) {
    http_response_code(400);
    exit('Todos los campos son obligatorios');
}

// Guardar en la base de datos
$stmt = $pdo->prepare("INSERT INTO mensajes (nombre, email, telefono, comentario, enviar_copia) VALUES (?, ?, ?, ?, ?)");
$stmt->execute([$nombre, $email, $telefono, $comentario, $enviar_copia]);

// Preparar correo al administrador
$asunto = "Nuevo mensaje desde el formulario de contacto";
$mensaje = "
Has recibido un nuevo mensaje:

Nombre: $nombre
Correo: $email
Teléfono: $telefono

Comentario:
$comentario
";

$cabeceras = "From: $nombre <$email>\r\n";
$cabeceras .= "Reply-To: $email\r\n";
$cabeceras .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Enviar correo al administrador
mail($admin_email, $asunto, $mensaje, $cabeceras);

// Enviar copia al usuario si marcó la opción
if ($enviar_copia) {
    $asunto_copia = "Copia de tu mensaje - Micael Medicina Integrativa";
    $mensaje_copia = "Hola $nombre,\n\nGracias por tu mensaje. Aquí tienes una copia de lo que enviaste:\n\n$mensaje";
    mail($email, $asunto_copia, $mensaje_copia, $cabeceras);
}

// Respuesta al frontend
echo json_encode(['success' => true]);
?>
