<?php
// ============================================================================
// 0. MANEJO DE ARCHIVOS ESTÁTICOS (SOLO PARA SERVIDOR LOCAL PHP)
// ============================================================================
// Esto permite que CSS, JS e Imágenes carguen sin ser interceptados por el router
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (file_exists(__DIR__ . $requestUri) && is_file(__DIR__ . $requestUri)) {
    return false; // Sirve el archivo tal cual (css, js, png, etc.)
}

// ============================================================================
// 1. CONFIGURACIÓN Y DIAGNÓSTICO
// ============================================================================
ini_set('display_errors', 1);
error_reporting(E_ALL);
ob_start();

// --- CARPETA DE SESIONES ---
$rutaSesiones = __DIR__ . '/sesiones_temp';
if (!file_exists($rutaSesiones)) {
    mkdir($rutaSesiones, 0777, true);
}
session_save_path($rutaSesiones);

// --- CONFIGURACIÓN DE COOKIE ---
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '', 
    'secure' => false, 
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_name('MICAEL_APP');
session_start();

// ============================================================================
// 2. CONEXIÓN A BASE DE DATOS
// ============================================================================
$rutaConfig = __DIR__ . '/config.php';

// (Mantenemos tu lógica de config)
if (file_exists($rutaConfig)) {
    require_once $rutaConfig;
} elseif (file_exists('api/config.php')) {
    require_once 'api/config.php';
} else {
    // Si no hay DB local, puedes comentar el die() para probar solo HTML
    // die("<h1>ERROR</h1><p>No encuentro config.php</p>");
}

// ============================================================================
// 3. API LOGIN (Igual que antes)
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    ob_clean(); 
    header('Content-Type: application/json; charset=UTF-8');

    if ($_POST['action'] === 'login') {
        // ... (Tu código de login se mantiene igual) ...
        // Asegúrate de tener la variable $pdo definida arriba
    }
    exit();
}

// ============================================================================
// 4. VERIFICADOR DE SESIÓN Y ENRUTAMIENTO
// ============================================================================

// --- CAMBIO CLAVE: DETECCIÓN DE RUTA PARA LOCAL Y SERVIDOR ---
// Si existe $_GET['ruta'] (Servidor real con htaccess), úsalo.
// Si no, parseamos la URL (Servidor local).
if (isset($_GET['ruta'])) {
    $ruta = $_GET['ruta'];
} else {
    // Tomamos la URL, le quitamos las barras iniciales/finales
    $ruta = trim($requestUri, '/');
    // Si es index.php o vacío, la ruta es ''
    if ($ruta == 'index.php') $ruta = '';
}

// Mapeo de vistas
$baseVistas = __DIR__ . '/vistas/';
$vistas = [
    ''                  => ['archivo' => 'index.html',              'protegido' => false],
    'login'             => ['archivo' => 'login.html',              'protegido' => false],
    'blog'              => ['archivo' => 'nota.html',               'protegido' => false],
    'profesionales'     => ['archivo' => 'profesional.html',        'protegido' => false],
    'tratamientos'      => ['archivo' => 'tratamiento.html',        'protegido' => true],
    'crear-nota'        => ['archivo' => 'formulario_notas.html',       'protegido' => false],
    'crear-profesional' => ['archivo' => 'formulario_profesional.html', 'protegido' => false],
    'crear-tratamiento' => ['archivo' => 'formulario_tratamiento.html', 'protegido' => false],
    'chat'              => ['archivo' => 'bot.html', 'protegido' => false],
];

if (array_key_exists($ruta, $vistas)) {
    $config = $vistas[$ruta];
    $archivoFinal = $baseVistas . $config['archivo'];

    if ($config['protegido']) {
        if (empty($_SESSION['user_id'])) {
            header('Location: /login'); // Usamos /login absoluto
            exit();
        }
    }

    if (file_exists($archivoFinal)) {
        require_once $archivoFinal;
    } else {
        echo "404 - Archivo no encontrado en: " . $archivoFinal;
    }

} else {
    // Si la ruta no existe, redirigir al home o mostrar error 404
    // Para local es mejor no redirigir en bucle si hay error
    header('Location: /');
    exit();
}
ob_end_flush();
?>