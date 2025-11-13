<?php
require 'config.php';

// Solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Método no permitido']);
  exit;
}

// Conexión (usa $pdo si existe en config.php)
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

// Campos
$id = isset($_POST['id']) ? trim($_POST['id']) : '';
$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$titulo = isset($_POST['titulo']) ? trim($_POST['titulo']) : '';
$descripcion_corta = isset($_POST['descripcion_corta']) ? trim($_POST['descripcion_corta']) : '';
$descripcion_larga = isset($_POST['descripcion_larga']) ? trim($_POST['descripcion_larga']) : '';
$imagenUrl = isset($_POST['imagenUrl']) ? trim($_POST['imagenUrl']) : '';

// Validaciones
if ($id === '' || $nombre === '' || $titulo === '' || $descripcion_corta === '' || $descripcion_larga === '') {
  http_response_code(422);
  echo json_encode(['error' => 'Faltan campos obligatorios']);
  exit;
}

// Imagen: usar URL o subir archivo
$imagenFinal = $imagenUrl;

if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
  $archivo = $_FILES['imagen'];
  $nombreOriginal = basename($archivo['name']);
  $extension = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));

  $permitidas = ['jpg','jpeg','png','gif','webp'];
  if (!in_array($extension, $permitidas)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato de imagen no permitido. Use: jpg, jpeg, png, gif, webp']);
    exit;
  }
  if ($archivo['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'La imagen es muy grande. Máximo 5MB']);
    exit;
  }

  $destino = __DIR__ . '/../uploads/profesionales/';
  if (!is_dir($destino)) {
    mkdir($destino, 0755, true);
  }

  $nombreArchivo = uniqid('prof_', true) . '.' . $extension;
  $rutaCompleta = $destino . $nombreArchivo;

  if (move_uploaded_file($archivo['tmp_name'], $rutaCompleta)) {
    $imagenFinal = '/uploads/profesionales/' . $nombreArchivo;
  } else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al subir la imagen']);
    exit;
  }
}

try {
  // Crear tabla si no existe
  $pdo->exec("
    CREATE TABLE IF NOT EXISTS profesionales (
      id VARCHAR(191) PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      imagen VARCHAR(1000) NULL,
      titulo VARCHAR(255) NOT NULL,
      descripcion_corta VARCHAR(600) NOT NULL,
      descripcion_larga LONGTEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  ");

  // Insert / Update
  $sql = "
    INSERT INTO profesionales (id, nombre, imagen, titulo, descripcion_corta, descripcion_larga)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      nombre = VALUES(nombre),
      imagen = VALUES(imagen),
      titulo = VALUES(titulo),
      descripcion_corta = VALUES(descripcion_corta),
      descripcion_larga = VALUES(descripcion_larga),
      updated_at = CURRENT_TIMESTAMP
  ";

  $stmt = $pdo->prepare($sql);
  $stmt->execute([$id, $nombre, $imagenFinal, $titulo, $descripcion_corta, $descripcion_larga]);

  echo json_encode(['success' => true, 'message' => 'Profesional guardado correctamente']);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Error al guardar: ' . $e->getMessage()]);
}