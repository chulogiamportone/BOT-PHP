<?php
// Configuración de la base de datos
$host = "localhost"; // generalmente localhost en hosting compartido
$db   = "a0010594_Micael";
$user = "a0010594_Micael";
$pass = "ze03VAnero";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    die("Error al conectar a la base de datos: " . $e->getMessage());
}

// Correo del administrador
$admin_email = "chulogiamportone@gmail.com";
?>
