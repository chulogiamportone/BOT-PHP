<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/config.php';

$pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

if (!isset($_GET['id'])) {
  $stmt = $pdo->query("SELECT id, titulo, imagen FROM notas");
  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
  exit;
}

$stmt = $pdo->prepare("SELECT * FROM notas WHERE id = :id");
$stmt->execute([':id' => $_GET['id']]);
$nota = $stmt->fetch();

if (!$nota) {
  http_response_code(404);
  echo json_encode(['error' => 'Nota no encontrada']);
  exit;
}

$nota['texto'] = json_decode($nota['texto'], true);
$nota['subsecciones'] = json_decode($nota['subsecciones'], true);
echo json_encode($nota, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
