<?php
header('Content-Type: application/json; charset=UTF-8');

// Opcional: limitar a POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Método no permitido']);
  exit;
}

// Lee JSON; si viene vacío, intenta con $_POST (urlencoded)
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data && !empty($_POST)) {
  $data = $_POST;
}

$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
$nombre = trim($data['nombre'] ?? '');
$telefono = trim($data['telefono'] ?? '');
$comentario = trim($data['comentario'] ?? '');
$enviarCopia = !empty($data['enviarCopia']) ? 1 : 0;

if (!$email || $nombre === '' || $telefono === '' || $comentario === '') {
  http_response_code(422);
  echo json_encode(['success' => false, 'message' => 'Campos inválidos']);
  exit;
}



try {
  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]);

  $stmt = $pdo->prepare("
    INSERT INTO contactos (email, nombre, telefono, comentario, enviarCopia, ip, user_agent)
    VALUES (:email, :nombre, :telefono, :comentario, :enviarCopia, :ip, :ua)
  ");

  $stmt->execute([
    ':email' => $email,
    ':nombre' => $nombre,
    ':telefono' => $telefono,
    ':comentario' => $comentario,
    ':enviarCopia' => $enviarCopia,
    ':ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    ':ua' => $_SERVER['HTTP_USER_AGENT'] ?? null
  ]);

  echo json_encode(['success' => true, 'message' => 'Guardado en DB']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Error en el servidor']);
}


?>
