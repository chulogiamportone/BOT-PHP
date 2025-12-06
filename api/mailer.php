<?php
// Ajusta la ruta según dónde esté tu carpeta phpmailer
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';
require_once __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function enviarCorreo($destinatario, $asunto, $mensaje, $reply_to = null) {
    $mail = new PHPMailer(true);

    try {
        // CONFIGURACIÓN SMTP
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';      // Cambia si usas otro proveedor
        $mail->SMTPAuth   = true;
        $mail->Username   = 'tu_email@gmail.com';  // TU email
        $mail->Password   = 'tu_contraseña_app';   // Contraseña de aplicación
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';

        // REMITENTE
        $mail->setFrom('tu_email@gmail.com', 'Micael Medicina Integrativa');

        // DESTINATARIO
        $mail->addAddress($destinatario);

        // REPLY-TO (para poder responder al que envió el form)
        if ($reply_to) {
            $mail->addReplyTo($reply_to);
        }

        // CONTENIDO (TEXTO PLANO)
        $mail->isHTML(false);
        $mail->Subject = $asunto;
        $mail->Body    = $mensaje;

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log('Error al enviar correo: ' . $mail->ErrorInfo);
        return false;
    }
} 