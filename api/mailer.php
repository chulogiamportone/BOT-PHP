<?php
header('Content-Type: application/json; charset=UTF-8');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

$mail = new PHPMailer(true);

try {
  $mail->isSMTP();
  $mail->Host = 'mail.tudominio.com';     // tu host SMTP
  $mail->SMTPAuth = true;
  $mail->Username = 'contacto@tudominio.com';
  $mail->Password = 'TU_PASSWORD';
  $mail->SMTPSecure = 'tls';
  $mail->Port = 587;

  $mail->setFrom('contacto@tudominio.com', 'Formulario Web');
  $mail->addAddress('tuemail@ejemplo.com', 'Admin'); // destino principal

  if ($enviarCopia) $mail->addAddress($email); // copia al usuario

  $mail->isHTML(true);
  $mail->Subject = 'Nuevo mensaje desde la web';
  $mail->Body = "
    <h2>Nuevo mensaje</h2>
    <p><strong>Nombre:</strong> {$nombre}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Teléfono:</strong> {$telefono}</p>
    <p><strong>Comentario:</strong><br>{$comentario}</p>
  ";

  $mail->send();
  echo json_encode(['success' => true, 'message' => 'Mensaje enviado y guardado']);
} catch (Exception $e) {
  echo json_encode(['success' => true, 'message' => 'Guardado en DB, pero error al enviar email']);
}
?>