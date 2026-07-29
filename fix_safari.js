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

// --- Recolectar datos del formulario ---
$nombre      = htmlspecialchars(trim($_POST['name']       ?? 'Sin nombre'));
$telefono    = htmlspecialchars(trim($_POST['phone']      ?? 'No especificado'));
$email       = htmlspecialchars(trim($_POST['email']      ?? ''));
$operacion   = htmlspecialchars(trim($_POST['operation']  ?? 'No especificado'));
$tipo        = htmlspecialchars(trim($_POST['type']       ?? 'No especificado'));
$ciudad      = htmlspecialchars(trim($_POST['city']       ?? 'No especificada'));
$zona        = htmlspecialchars(trim($_POST['zone']       ?? 'No especificada'));
$direccion   = htmlspecialchars(trim($_POST['address']    ?? 'No especificada'));
$precio      = htmlspecialchars(trim($_POST['price']      ?? 'No especificado'));
$construccion= htmlspecialchars(trim($_POST['construct']  ?? 'No especificado'));
$terreno     = htmlspecialchars(trim($_POST['land']       ?? 'No especificado'));
$recamaras   = htmlspecialchars(trim($_POST['rooms']      ?? 'No especificado'));
$banos       = htmlspecialchars(trim($_POST['baths']      ?? 'No especificado'));
$ocultarDir  = isset($_POST['hideAddr']) ? 'Sí' : 'No';
$descripcion = htmlspecialchars(trim($_POST['details']    ?? '(Sin descripción)'));

// Manejar archivos adjuntos
$fotosInfo = '';
if (isset($_FILES['photos']) && $_FILES['photos']['error'][0] === 0) {
    $fotosInfo = count($_FILES['photos']['name']) . ' foto(s) adjuntas.';
} else {
    $fotosInfo = 'Sin fotos adjuntas.';
}

$docsInfo = '';
if (isset($_FILES['documents']) && $_FILES['documents']['error'] === 0) {
    $docsInfo = 'Documento adjunto.';
} else {
    $docsInfo = 'Sin documentos adjuntos.';
}

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

    // Adjuntar fotos (hasta 5)
    if (isset($_FILES['photos']) && $_FILES['photos']['error'][0] === 0) {
        $maxFotos = min(count($_FILES['photos']['name']), 5);
        for ($i = 0; $i < $maxFotos; $i++) {
            if ($_FILES['photos']['error'][$i] === 0) {
                $mail->addAttachment(
                    $_FILES['photos']['tmp_name'][$i],
                    'foto_' . ($i + 1) . '_' . basename($_FILES['photos']['name'][$i])
                );
            }
        }
    }

    // Adjuntar documento (escrituras) si existe
    if (isset($_FILES['documents']) && $_FILES['documents']['error'] === 0) {
        $mail->addAttachment($_FILES['documents']['tmp_name'], 'docs_' . basename($_FILES['documents']['name']));
    }

    $mail->isHTML(true);
    $mail->Subject = '🏠 Nueva Propiedad para Publicar — ' . ucfirst($tipo) . ' en ' . $ciudad;

    $mail->Body = "
    <div style='font-family:Arial,sans-serif;color:#333;max-width:640px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;'>
        <div style='background:#111;padding:20px;text-align:center;'>
            <h2 style='color:#d1b463;margin:0;'>🏠 Nueva Propiedad en Urban R8</h2>
        </div>
        <div style='padding:24px;'>
            <h3 style='color:#d1b463;margin-top:0;'>Datos del Propietario</h3>
            <table style='width:100%;border-collapse:collapse;'>
                <tr><td style='padding:8px 0;font-weight:bold;width:160px;'>Nombre:</td><td>{$nombre}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Teléfono:</td><td>{$telefono}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Correo:</td><td>{$email}</td></tr>
            </table>
            <hr style='border:0;border-top:1px solid #eee;margin:20px 0;'>
            <h3 style='color:#d1b463;'>Detalles de la Propiedad</h3>
            <table style='width:100%;border-collapse:collapse;'>
                <tr><td style='padding:8px 0;font-weight:bold;width:160px;'>Operación:</td><td>{$operacion}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Tipo:</td><td>{$tipo}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Ciudad/Estado:</td><td>{$ciudad}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Zona/Colonia:</td><td>{$zona}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Dirección Exacta:</td><td>{$direccion}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Ocultar Dirección:</td><td>{$ocultarDir}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Precio Estimado:</td><td>{$precio}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>M² Construcción:</td><td>{$construccion}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>M² Terreno:</td><td>{$terreno}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Recámaras:</td><td>{$recamaras}</td></tr>
                <tr><td style='padding:8px 0;font-weight:bold;'>Baños:</td><td>{$banos}</td></tr>
            </table>
            <hr style='border:0;border-top:1px solid #eee;margin:20px 0;'>
            <h3 style='color:#d1b463;'>Descripción / Detalles</h3>
            <p style='background:#f9f9f9;padding:14px;border-radius:6px;line-height:1.6;'>{$descripcion}</p>
            <p style='color:#999;font-size:12px;margin-top:16px;'>📎 Archivos: {$fotosInfo} | {$docsInfo}</p>
        </div>
        <div style='padding:16px;background:#f5f5f5;text-align:center;font-size:12px;color:#999;'>
            © 2025 Urban R8 — urbanr8.com.mx
        </div>
    </div>";

    $mail->AltBody = "Nueva propiedad:\nPropietario: {$nombre}\nTel: {$telefono}\nCorreo: {$email}\nTipo: {$tipo}\nOperación: {$operacion}\nUbicación: {$ciudad}, {$zona}\nPrecio: {$precio}\n\nDescripción:\n{$descripcion}";
    $mail->send();

    // ── Confirmación al propietario ──
    if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $mail->clearAddresses();
        $mail->clearAttachments();
        $mail->addAddress($email, $nombre);
        $mail->Subject = '¡Recibimos tu propiedad! — Urban R8';
        $mail->Body = "
        <div style='font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;'>
            <div style='background:#111;padding:20px;text-align:center;'>
                <h2 style='color:#d1b463;margin:0;'>Urban R8</h2>
            </div>
            <div style='padding:24px;'>
                <h3 style='margin-top:0;'>Hola, {$nombre} 🙌</h3>
                <p>Hemos recibido la información de tu propiedad. Uno de nuestros agentes la revisará y se pondrá en contacto contigo a la brevedad para coordinar los próximos pasos.</p>
                <div style='background:#f9f9f9;padding:16px;border-radius:8px;border-left:4px solid #d1b463;margin:20px 0;'>
                    <p style='margin:0;'><strong>Propiedad:</strong> {$tipo} en {$ciudad}</p>
                    <p style='margin:8px 0 0;'><strong>Operación:</strong> {$operacion}</p>
                </div>
                <p>📱 <strong>WhatsApp:</strong> <a href='https://wa.me/5213328418117' style='color:#d1b463;'>33 28 41 81 17</a></p>
                <p>📧 <strong>Email:</strong> contacto@urbanr8.com.mx</p>
            </div>
            <div style='padding:16px;background:#f5f5f5;text-align:center;font-size:12px;color:#999;'>
                © 2025 Urban R8 — urbanr8.com.mx
            </div>
        </div>";
        $mail->AltBody = "Hola {$nombre},\n\nHemos recibido tu propiedad ({$tipo} en {$ciudad}).\nUn asesor te contactará pronto.\n\nUrban R8\n33 28 41 81 17";
        $mail->send();
    }

    echo json_encode(['success' => true, 'message' => 'Propiedad enviada correctamente.']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al enviar: ' . $mail->ErrorInfo]);
}
