<?php
require 'config.php';

header('Content-Type: application/json; charset=UTF-8');

// Si no viene id, devolver lista de todas las notas
if (!isset($_GET['id']) || trim($_GET['id']) === '') {
    $stmt = $pdo->query("SELECT id, titulo, imagen FROM notas ORDER BY created_at DESC");
    $lista = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($lista);
    exit;
}

// Si viene id, devolver la nota completa
$id = trim($_GET['id']);

$stmt = $pdo->prepare("SELECT * FROM notas WHERE id = ?");
$stmt->execute([$id]);
$nota = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$nota) {
    http_response_code(404);
    echo json_encode(['error' => 'Nota no encontrada']);
    exit;
}

// Devolver la nota tal cual (texto y subsecciones vienen como strings JSON desde la DB)
echo json_encode($nota);