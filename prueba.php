<?php
// COMPLETAR con tus credenciales
$host = 'localhost';      // suele ser localhost
$db   = 'NOMBRE_DE_TU_BD';
$user = 'USUARIO_BD';
$pass = 'PASSWORD_BD';

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

$sql = "
CREATE TABLE IF NOT EXISTS contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  comentario TEXT NOT NULL,
  enviarCopia TINYINT(1) NOT NULL DEFAULT 0,
  ip VARCHAR(45),
  user_agent VARCHAR(255),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
";

try {
  $pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
  ]);
  $pdo->exec($sql);
  echo "Tabla creada/ya existente OK";
} catch (Throwable $e) {
  http_response_code(500);
  echo "Error: " . $e->getMessage();
}