<?php
// ============================================================================
// 1. CONFIGURACIÓN Y DIAGNÓSTICO
// ============================================================================
ini_set('display_errors', 1);
error_reporting(E_ALL);
ob_start();

// --- CARPETA DE SESIONES (Usamos la local que ya tienes) ---
$rutaSesiones = __DIR__ . '/sesiones_temp';

if (!file_exists($rutaSesiones)) {
    mkdir($rutaSesiones, 0777, true);
}

// Forzamos uso de esta carpeta
session_save_path($rutaSesiones);

// --- CONFIGURACIÓN DE COOKIE "NUCLEAR" (Para arreglar el bucle) ---
// Ponemos 'secure' en FALSE a la fuerza. Esto elimina problemas con SSL/Certificados.
// Ponemos 'domain' vacío para evitar conflictos de www vs no-www.
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => '', 
    'secure' => false,     // <--- CAMBIO CLAVE: False para que no falle nunca
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_name('MICAEL_APP');
session_start();

// ============================================================================
// 2. CONEXIÓN A BASE DE DATOS
// ============================================================================
$rutaConfig = __DIR__ . '/config.php';

if (file_exists($rutaConfig)) {
    require_once $rutaConfig;
} elseif (file_exists('api/config.php')) {
    require_once 'api/config.php';
} else {
    die("<h1>ERROR</h1><p>No encuentro config.php</p>");
}

// ============================================================================
// 3. API LOGIN
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    
    ob_clean(); 
    header('Content-Type: application/json; charset=UTF-8');

    if ($_POST['action'] === 'login') {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        try {
            if (!isset($pdo)) { throw new Exception("Error conexión DB"); }

            $stmt = $pdo->prepare("SELECT id, nombre, email, password FROM usuarios WHERE email = ? LIMIT 1");
            $stmt->execute([$email]);
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($usuario && password_verify($password, $usuario['password'])) {
                // Login Exitoso
                $_SESSION['user_id'] = $usuario['id'];
                $_SESSION['user_name'] = $usuario['nombre'];
                
                // Forzamos la escritura en el disco YA MISMO
                session_write_close();
                
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Datos incorrectos']);
            }
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => 'Error: ' . $e->getMessage()]);
        }
    }
    exit();
}

// ============================================================================
// 4. VERIFICADOR DE SESIÓN (Debug)
// ============================================================================
// Si el usuario intenta entrar a una ruta protegida y falla, esto nos dirá por qué.
$ruta = isset($_GET['ruta']) ? $_GET['ruta'] : '';

// Mapeo de vistas
$baseVistas = __DIR__ . '/vistas/';
$vistas = [
    ''                  => ['archivo' => 'index.html',              'protegido' => false],
    'login'             => ['archivo' => 'login.html',              'protegido' => false],
    'notas'             => ['archivo' => 'nota.html',               'protegido' => false],
    'profesionales'     => ['archivo' => 'profesional.html',        'protegido' => false],
    'tratamientos'      => ['archivo' => 'tratamiento.html',        'protegido' => false],
    'crear-nota'        => ['archivo' => 'formulario_notas.html',       'protegido' => true],
    'crear-profesional' => ['archivo' => 'formulario_profesional.html', 'protegido' => true],
    'crear-tratamiento' => ['archivo' => 'formulario_tratamiento.html', 'protegido' => true],
];

if (array_key_exists($ruta, $vistas)) {
    $config = $vistas[$ruta];
    $archivoFinal = $baseVistas . $config['archivo'];

    if ($config['protegido']) {
        if (empty($_SESSION['user_id'])) {
            // AQUÍ OCURRE EL BUCLE. 
            // Si llegamos aquí justo después de loguearnos, la sesión se perdió.
            
            // Redirigir al login
            header('Location: login'); 
            exit();
        }
    }

    if (file_exists($archivoFinal)) {
        require_once $archivoFinal;
    } else {
        echo "404 - Archivo no encontrado";
    }

} else {
    header('Location: ./');
    exit();
}
ob_end_flush();
?>