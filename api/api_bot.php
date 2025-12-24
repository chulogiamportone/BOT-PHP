<?php
// api.php
header('Content-Type: application/json');

// 1. Cargar la lógica del Bot
// IMPORTANTE: Aquí asumo que bot.php está en la misma carpeta que api.php
// Si bot.php está en /src/, cambia esto a: __DIR__ . '/src/Chatbot.php';
$rutaLogica = __DIR__ . '/bot.php';

if (!file_exists($rutaLogica)) {
    echo json_encode(['reply' => "Error crítico: No encuentro el archivo de lógica en $rutaLogica"]);
    exit;
}

require_once $rutaLogica;

// 2. Recibir mensaje
$input = json_decode(file_get_contents('php://input'), true);
$message = $input['message'] ?? '';
$response = ['reply' => ''];

try {
    if (!empty($message)) {
        
        // --- AQUÍ ESTÁ LA CORRECCIÓN ---
        // Usamos __DIR__ para decirle la ruta exacta.
        
        // OPCIÓN A: Si api.php está en la RAÍZ junto con la carpeta data
        $rutaJson = __DIR__ . '/../data/bot.json';
        
        // OPCIÓN B: Si api.php está dentro de una carpeta (ej: /api/) y data está afuera
        // $rutaJson = __DIR__ . '/../data/intents.json';

        // Verificamos antes de enviar para saber si la ruta está bien
        if (!file_exists($rutaJson)) {
            throw new Exception("No encuentro el JSON en: " . $rutaJson);
        }

        // Iniciamos el bot con la ruta absoluta
        $bot = new Chatbot($rutaJson);
        $response['reply'] = $bot->getResponse($message);

    } else {
        $response['reply'] = 'Por favor escribe algo.';
    }
} catch (Exception $e) {
    $response['reply'] = 'Error del sistema: ' . $e->getMessage();
}

echo json_encode($response);
?>