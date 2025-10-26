<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

$file = __DIR__ . '/data/nota.json';

if (!file_exists($file)) {
    http_response_code(404);
    echo json_encode(["error" => "Archivo JSON no encontrado"]);
    exit;
}

$data = json_decode(file_get_contents($file), true);

if (!isset($_GET['id'])) {
    echo json_encode($data["notas"], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

$id = $_GET['id'];
$nota = array_values(array_filter($data["notas"], fn($n) => $n["id"] === $id));

if (empty($nota)) {
    http_response_code(404);
    echo json_encode(["error" => "Nota no encontrada"]);
    exit;
}

echo json_encode($nota[0], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
