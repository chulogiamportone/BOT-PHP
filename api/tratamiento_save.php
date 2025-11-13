<?php
require 'config.php';

// Aceptar solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

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

// Recibir campos del formulario
$id = isset($_POST['id']) ? trim($_POST['id']) : '';
$titulo = isset($_POST['titulo']) ? trim($_POST['titulo']) : '';
$imagenUrl = isset($_POST['imagenUrl']) ? trim($_POST['imagenUrl']) : '';

// Validaciones básicas
if ($id === '' || $titulo === '') {
    http_response_code(422);
    echo json_encode(['error' => 'Faltan campos obligatorios (id y título)']);
    exit;
}

// Procesar imagen subida
$imagenFinal = $imagenUrl;

if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $archivo = $_FILES['imagen'];
    $nombreOriginal = basename($archivo['name']);
    $extension = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));
    
    $extensionesPermitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($extension, $extensionesPermitidas)) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato de imagen no permitido. Use: jpg, jpeg, png, gif, webp']);
        exit;
    }
    
    if ($archivo['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['error' => 'La imagen es muy grande. Máximo 5MB']);
        exit;
    }
    
    $carpetaDestino = __DIR__ . '/../uploads/tratamientos/';
    if (!is_dir($carpetaDestino)) {
        mkdir($carpetaDestino, 0755, true);
    }
    
    $nombreArchivo = uniqid('trat_', true) . '.' . $extension;
    $rutaCompleta = $carpetaDestino . $nombreArchivo;
    
    if (move_uploaded_file($archivo['tmp_name'], $rutaCompleta)) {
        $imagenFinal = '/uploads/tratamientos/' . $nombreArchivo;
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al subir la imagen']);
        exit;
    }
}

// texto[] llega como array de párrafos
$textoArr = isset($_POST['texto']) && is_array($_POST['texto']) ? $_POST['texto'] : [];

// subsecciones llegan como arreglos paralelos
$subsTit = isset($_POST['subsecciones']['titulo']) && is_array($_POST['subsecciones']['titulo']) ? $_POST['subsecciones']['titulo'] : [];
$subsCon = isset($_POST['subsecciones']['contenido']) && is_array($_POST['subsecciones']['contenido']) ? $_POST['subsecciones']['contenido'] : [];

// Normalizar texto: limpiar vacíos
$textoArr = array_values(array_filter(array_map('trim', $textoArr), fn($t) => $t !== ''));

// Combinar subsecciones en array de objetos
$subsecciones = [];
$max = max(count($subsTit), count($subsCon));
for ($i = 0; $i < $max; $i++) {
    $t = isset($subsTit[$i]) ? trim($subsTit[$i]) : '';
    $c = isset($subsCon[$i]) ? trim($subsCon[$i]) : '';
    if ($t !== '' || $c !== '') {
        $subsecciones[] = ['titulo' => $t, 'contenido' => $c];
    }
}

// Serializar a JSON para guardar
$textoJson = json_encode($textoArr, JSON_UNESCAPED_UNICODE);
$subsJson  = json_encode($subsecciones, JSON_UNESCAPED_UNICODE);

try {
    // Asegurar que la tabla exista
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS tratamientos (
            id VARCHAR(191) NOT NULL PRIMARY KEY,
            titulo VARCHAR(500) NOT NULL,
            imagen VARCHAR(1000) NULL,
            texto LONGTEXT NOT NULL,
            subsecciones LONGTEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    $sql = "
        INSERT INTO tratamientos (id, titulo, imagen, texto, subsecciones)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            titulo = VALUES(titulo),
            imagen = VALUES(imagen),
            texto = VALUES(texto),
            subsecciones = VALUES(subsecciones),
            updated_at = CURRENT_TIMESTAMP
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id, $titulo, $imagenFinal, $textoJson, $subsJson]);

    echo json_encode(['success' => true, 'message' => 'Tratamiento guardado correctamente']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar tratamiento: ' . $e->getMessage()]);
}