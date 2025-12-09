<?php
$host = "localhost"; // generalmente localhost en hosting compartido
$db   = "a0010594_Micael";
$user = "a0010594_Micael";
$pass = "ze03VAnero";
             // <--- CONTRASEÑA DE LA DB

// Datos del usuario a crear
$email_nuevo = 'admin@sitio.com';
$pass_nuevo  = '12345'; // Esta será tu contraseña para entrar

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h3>1. Conexión a Base de Datos: EXITOSA ✅</h3>";

    // Encriptamos la contraseña
    $password_encriptada = password_hash($pass_nuevo, PASSWORD_DEFAULT);

    // Intentamos insertar
    $sql = "INSERT INTO usuarios (nombre, email, password) VALUES (:nombre, :email, :pass)";
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
        ':nombre' => 'Administrador',
        ':email'  => $email_nuevo,
        ':pass'   => $password_encriptada
    ]);

    echo "<h3>2. Usuario creado correctamente ✅</h3>";
    echo "<p>Email: <b>$email_nuevo</b></p>";
    echo "<p>Contraseña: <b>$pass_nuevo</b></p>";
    echo "<br><a href='login'>Ir al Login</a>";

} catch (PDOException $e) {
    echo "<h3 style='color:red'>ERROR ❌</h3>";
    echo "No se pudo conectar o crear el usuario.<br>";
    echo "Mensaje técnico: " . $e->getMessage();
}
?>