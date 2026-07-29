<?php
ini_set('display_errors', 0);
error_reporting(E_ALL);
header('Content-Type: application/json');

if (!file_exists('lib/PHPMailer/PHPMailer.php')) {
    echo json_encode(['success' => false, 'message' => 'Error 500: Falta la carpeta lib con PHPMailer.']);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'lib/PHPMailer/Exception.php';
require 'lib/PHPMailer/PHPMailer.php';
require 'lib/PHPMailer/SMTP.php';

// --- Recolectar datos del formulario (POST normal) ---
$nombre  = htmlspecialchars(trim($_POST['nombre']  ?? $_POST['name']    ?? 'Sin nombre'));
$telefono= htmlspecialchars(trim($_POST['telefono'] ?? $_POST['phone']   ?? 'No especificado'));
$correo  = htmlspecialchars(trim($_POST['correo']   ?? $_POST['email']   ?? ''));
$asunto  = htmlspecialchars(trim($_POST['asunto']   ?? $_POST['service'] ?? 'No especificado'));
$mensaje = htmlspecialchars(trim($_POST['mensaje']  ?? $_POST['message'] ?? '(Sin mensaje)'));
$origen  = htmlspecialchars(trim($_POST['origen']   ?? 'Sitio Web - Formulario de Contacto'));

$mail = new PHPMailer(true);

try {
    // Configuración SMTP Hostinger
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'contacto@urbanr8.com.mx';
    $mail->Password   = 'c/H1CMo!hq3';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    // ── Correo al equipo de Urban R8 ──
    $mail->setFrom('contacto@urbanr8.com.mx', 'Urban R8 Website');
    $mail->addAddress('contacto@urbanr8.com.mx', 'Urban R8');
    $mail->isHTML(true);
    $mail->Subject = '📩 Nuevo contacto: ' . $asunto . ' — ' . $nombre;
    $mail->Body = "
    <div style='font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;'>
        <div style='background:#111;padding:20px;text-align:center;'>
            <h2 style='color:#d1b463;margin:0;'>Urban R8 — Nuevo Contacto</h2>
            <p style='color:#aaa;margin:4px 0 0;font-size:13px;'>{$origen}</p>
        </div>
        <div style='padding:24px;'>
            <h3 style='color:#d1b463;margin-top:0;'>Datos del prospecto</h3>
            <table style='width:100%;border-collapse:collapse;'>
                <tr><td style='padding:8px 0;font-weight:bold;width:140px;'>Nombre:</td><td>{$nombre}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Teléfono:</td><td>{$telefono}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Correo:</td><td>{$correo}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Servicio:</td><td>{$asunto}</td></tr>
            </table>
            <hr style='border:0;border-top:1px solid #eee;margin:20px 0;'>
            <h3 style='color:#d1b463;'>Mensaje</h3>
            <p style='background:#f9f9f9;padding:12px;border-radius:6px;line-height:1.6;'>{$mensaje}</p>
        </div>
        <div style='padding:16px;background:#f5f5f5;text-align:center;font-size:12px;color:#999;'>
            Este correo fue generado automáticamente por urbanr8.com.mx
        </div>
    </div>";
    $mail->AltBody = "Nuevo contacto desde: {$origen}\n\nNombre: {$nombre}\nTeléfono: {$telefono}\nCorreo: {$correo}\nServicio: {$asunto}\n\nMensaje:\n{$mensaje}";
    $mail->send();

    // ── Correo de confirmación al cliente (si dejó su correo) ──
    if ($correo && filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $mail->clearAddresses();
        $mail->clearReplyTos();
        $mail->addAddress($correo, $nombre);
        $mail->Subject = '¡Gracias por contactarnos! — Urban R8';
        $mail->Body = "
        <div style='font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;'>
            <div style='background:#111;padding:20px;text-align:center;'>
                <h2 style='color:#d1b463;margin:0;'>Urban R8</h2>
                <p style='color:#aaa;margin:4px 0 0;font-size:13px;'>Inmobiliaria &amp; Constructora</p>
            </div>
            <div style='padding:24px;'>
                <h3 style='margin-top:0;'>Hola, {$nombre} 👋</h3>
                <p>Hemos recibido tu mensaje y uno de nuestros asesores se pondrá en contacto contigo a la brevedad.</p>
                <div style='background:#f9f9f9;padding:16px;border-radius:8px;border-left:4px solid #d1b463;margin:20px 0;'>
                    <p style='margin:0;'><strong>Servicio solicitado:</strong> {$asunto}</p>
                </div>
                <p>Mientras tanto puedes contactarnos directamente:</p>
                <p>📱 <strong>WhatsApp:</strong> <a href='https://wa.me/5213328418117' style='color:#d1b463;'>33 28 41 81 17</a></p>
                <p>📧 <strong>Email:</strong> contacto@urbanr8.com.mx</p>
            </div>
            <div style='padding:16px;background:#f5f5f5;text-align:center;font-size:12px;color:#999;'>
                © 2025 Urban R8 — urbanr8.com.mx
            </div>
        </div>";
        $mail->AltBody = "Hola {$nombre},\n\nHemos recibido tu mensaje. Un asesor te contactará pronto.\n\nServicio: {$asunto}\n\nUrban R8\nTel: 33 28 41 81 17\ncontacto@urbanr8.com.mx";
        $mail->send();
    }

    echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente.']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al enviar: ' . $mail->ErrorInfo]);
}
