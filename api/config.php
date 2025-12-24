
<?php
// Detectamos si estamos en entorno local
// Verificamos si el servidor se llama 'localhost' o '127.0.0.1'
$es_local = ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === '127.0.0.1');

if ($es_local) {
    // --- CONFIGURACIÓN LOCAL (Tu PC) ---
    // TRUCO: En Windows, usa "127.0.0.1" en vez de "localhost" para evitar errores de conexión
    $host = "127.0.0.1";
    $db = "bot_php"; // <--- CAMBIA ESTO
    $user = "root";                    // Usuario por defecto en local
    $pass = "root";                        // Contraseña por defecto (suele ser vacía o "root")
    $port = "3306";                    // Puerto estándar de MySQL
} else {
    // --- CONFIGURACIÓN PRODUCCIÓN (Hosting) ---
    $host = "localhost"; // generalmente localhost en hosting compartido
    $db = "a0010594_Micael";
    $user = "a0010594_Micael";
    $pass = "ze03VAnero";
    $port = "3306";
}

try {
    // Agregamos el puerto al DSN para asegurar la conexión correcta
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8";

    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Opcional: Descomenta esto solo para probar si conecta, luego bórralo
    // echo "Conectado exitosamente en modo: " . ($es_local ? "LOCAL" : "PRODUCCIÓN");

} catch (Exception $e) {
    // En producción no es bueno mostrar el error exacto al usuario, pero para desarrollar sí
    die("Error crítico de conexión: " . $e->getMessage());
}

$admin_email = "chulogiamportone@gmail.com";
?>