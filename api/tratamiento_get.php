<?php
require 'config.php';

header('Content-Type: application/json; charset=UTF-8');

// Conexión
if (!isset($pdo)) {
    if (!isset($dsn, $user, $pass)) {
        http_response_code(500);
        echo json_encode(['error' => 'Config de DB inválida']);
        exit;
    }
    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error de conexión: ' . $e->getMessage()]);
        exit;
    }
}

// Lista o detalle
if (!isset($_GET['id']) || trim($_GET['id']) === '') {
    $stmt = $pdo->query("SELECT id, titulo, imagen, texto, subsecciones FROM tratamientos ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

$id = trim($_GET['id']);
$stmt = $pdo->prepare("SELECT * FROM tratamientos WHERE id = ?");
$stmt->execute([$id]);
$trat = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$trat) {
    http_response_code(404);
    echo json_encode(['error' => 'Tratamiento no encontrado']);
    exit;
}

echo json_encode($trat);