<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/config.php';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
  http_response_code(400);
  echo json_encode(['error' => 'JSON inválido']);
  exit;
}

$id = trim($data['id'] ?? '');
$titulo = trim($data['titulo'] ?? '');
$imagen = trim($data['imagen'] ?? '');
$texto = $data['texto'] ?? [];
$subsecciones = $data['subsecciones'] ?? [];

if ($id === '' || $titulo === '') {
  http_response_code(422);
  echo json_encode(['error' => 'Faltan campos obligatorios']);
  exit;
}

try {
  $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

  $stmt = $pdo->prepare("
    REPLACE INTO notas (id, titulo, imagen, texto, subsecciones)
    VALUES (:id, :titulo, :imagen, :texto, :subsecciones)
  ");

  $stmt->execute([
    ':id' => $id,
    ':titulo' => $titulo,
    ':imagen' => $imagen,
    ':texto' => json_encode($texto, JSON_UNESCAPED_UNICODE),
    ':subsecciones' => json_encode($subsecciones, JSON_UNESCAPED_UNICODE)
  ]);

  echo json_encode(['success' => true, 'message' => 'Nota guardada']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Error al guardar nota']);
}
