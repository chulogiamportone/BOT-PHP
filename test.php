<?php
// Guardar como: api/diagnostico.php

// Intentamos configurar la cookie
$configurado = session_set_cookie_params(0, '/');

// Iniciamos sesión
$inicio = session_start();

echo "<h1>Diagnóstico de Sesión</h1>";

// CHEQUEO 1: ¿Se enviaron headers antes de tiempo?
if (headers_sent($archivo, $linea)) {
    echo "<h2 style='color:red'>❌ ERROR GRAVE: Salida prematura detectada</h2>";
    echo "<p>Las cookies NO se pueden guardar porque algo se imprimió antes en la pantalla.</p>";
    echo "<p><strong>El culpable es el archivo:</strong> $archivo</p>";
    echo "<p><strong>En la línea:</strong> $linea</p>";
    echo "<p>Revisa ese archivo y quita espacios en blanco o 'echo' antes de session_start().</p>";
} else {
    echo "<h2 style='color:green'>✅ Headers OK: No hay espacios molestando</h2>";
    
    // CHEQUEO 2: Intentar crear la cookie
    $_SESSION['prueba'] = 'funciona';
    $cookieParams = session_get_cookie_params();
    
    echo "<h3>Configuración de Cookie:</h3>";
    echo "<pre>";
    print_r($cookieParams);
    echo "</pre>";
    
    echo "<p><strong>Path esperado:</strong> / (Si dice /api, está mal)</p>";
    
    if ($cookieParams['path'] === '/') {
        echo "<h3 style='color:green'>✅ El Path es correcto (Raíz)</h3>";
    } else {
        echo "<h3 style='color:red'>❌ El Path es incorrecto (Es: " . $cookieParams['path'] . ")</h3>";
        echo "Asegúrate de usar session_set_cookie_params(0, '/') antes de session_start()";
    }
}
?>