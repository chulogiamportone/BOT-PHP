<?php
require_once __DIR__ . 'config.php';

if (!isset($pdo)) {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ]);
}

$sql = "
CREATE TABLE IF NOT EXISTS notas (
    id VARCHAR(191) NOT NULL PRIMARY KEY,
    titulo VARCHAR(500) NOT NULL,
    imagen VARCHAR(1000) NULL,
    texto LONGTEXT NOT NULL,
    subsecciones LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
$pdo->exec($sql);
echo 'Tabla notas creada/asegurada';