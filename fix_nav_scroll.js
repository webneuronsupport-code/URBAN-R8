<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');

if (!file_exists('lib/PHPMailer/PHPMailer.php')) {
    echo json_encode(['success' => false, 'message' => 'Error 500: No se encontró la carpeta "lib". Asegúrate de haber extraído todo el contenido del zip, incluyendo la carpeta lib.']);
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'lib/PHPMailer/Exception.php';
require 'lib/PHPMailer/PHPMailer.php';
require 'lib/PHPMailer/SMTP.php';

// Get JSON POST payload
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

$clientName = htmlspecialchars($data['name'] ?? 'Cliente');
$clientPhone = htmlspecialchars($data['phone'] ?? 'No especificado');
$clientEmail = htmlspecialchars($data['email'] ?? 'No especificado');
$propTitle = htmlspecialchars($data['propTitle'] ?? 'Propiedad Desconocida');
$propId = htmlspecialchars($data['propId'] ?? '');
$propPrice = htmlspecialchars($data['propPrice'] ?? '');
$propPhoto = htmlspecialchars($data['propPhoto'] ?? '');

// --- RESPUESTA TEMPRANA PARA LIBERAR LA INTERFAZ RÁPIDO ---
// Esto permite que el usuario reciba la confirmación inmediatamente
// mientras los correos se envían en segundo plano.
ignore_user_abort(true);
ob_start();
echo json_encode(['success' => true, 'message' => 'Messages have been sent']);
$size = ob_get_length();
header("Content-Length: $size");
header('Connection: close');
ob_end_flush();
@ob_flush();
@flush();
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
}
// -----------------------------------------------------------

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'contacto@urbanr8.com.mx';
    $mail->Password   = 'c/H1CMo!hq3';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->SMTPKeepAlive = true; // Mantiene la conexión abierta para enviar 2 correos más rápido

    $mail->CharSet = 'UTF-8';

    // 1. Enviar correo al Administrador (Urban R8)
    $mail->setFrom('contacto@urbanr8.com.mx', 'Urban R8 Website');
    $mail->addAddress('contacto@urbanr8.com.mx');     // Send to themselves

    $mail->isHTML(true);
    $mail->Subject = 'Nuevo interesado en: ' . $propTitle;
    
    // HTML Body Admin
    $bodyAdmin = "
    <div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>
        <div style='background-color: #d1b463; padding: 20px; text-align: center;'>
            <h2 style='color: #111; margin: 0;'>¡Nuevo Prospecto Interesado!</h2>
        </div>
        <div style='padding: 20px;'>
            <h3 style='margin-top: 0; color: #d1b463;'>Datos del Cliente</h3>
            <p><strong>Nombre:</strong> {$clientName}</p>
            <p><strong>Teléfono/WhatsApp:</strong> {$clientPhone}</p>
            <p><strong>Correo:</strong> {$clientEmail}</p>
            
            <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
            
            <h3 style='color: #d1b463;'>Detalles de la Propiedad</h3>
            <p><strong>ID:</strong> {$propId}</p>
            <p><strong>Propiedad:</strong> {$propTitle}</p>
            <p><strong>Precio:</strong> {$propPrice}</p>
        </div>";

    if (!empty($propPhoto)) {
        $bodyAdmin .= "
        <div style='padding: 0 20px 20px 20px; text-align: center;'>
            <img src='{$propPhoto}' alt='Foto de Propiedad' style='max-width: 100%; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);' />
        </div>";
    }

    $bodyAdmin .= "</div>";

    $mail->Body = $bodyAdmin;
    $mail->AltBody = "Nuevo interesado: {$clientName}\nTel: {$clientPhone}\nCorreo: {$clientEmail}\n\nPropiedad: {$propTitle}\nPrecio: {$propPrice}\nID: {$propId}\n\nFoto: {$propPhoto}";

    $mail->send(); // Enviar a Admin

    // 2. Enviar correo al Cliente
    if (filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
        $mail->clearAddresses(); // Limpiamos destinatarios anteriores
        $mail->addAddress($clientEmail); // Agregamos al cliente
        $mail->Subject = 'Detalles de tu propiedad - Urban R8';

        $bodyClient = "
        <div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>
            <div style='background-color: #111; padding: 20px; text-align: center;'>
                <h2 style='color: #d1b463; margin: 0;'>Urban R8</h2>
            </div>
            <div style='padding: 20px;'>
                <h3 style='margin-top: 0;'>Hola {$clientName},</h3>
                <p>Gracias por tu interés. Aquí tienes la información de la propiedad que solicitaste:</p>
                
                <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
                
                <h3 style='color: #d1b463;'>{$propTitle}</h3>
                <p><strong>Precio:</strong> {$propPrice}</p>
                <p><strong>ID de Propiedad:</strong> {$propId}</p>
            </div>";

        if (!empty($propPhoto)) {
            $bodyClient .= "
            <div style='padding: 0 20px 20px 20px; text-align: center;'>
                <img src='{$propPhoto}' alt='Foto de Propiedad' style='max-width: 100%; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);' />
            </div>";
        }

        $bodyClient .= "
            <div style='padding: 20px; background-color: #f9f9f9; text-align: center; font-size: 14px;'>
                <p>En breve uno de nuestros asesores se pondrá en contacto contigo.</p>
                <p>Si tienes dudas, puedes responder a este correo.</p>
            </div>
        </div>";

        $mail->Body = $bodyClient;
        $mail->AltBody = "Hola {$clientName},\n\nGracias por tu interés en: {$propTitle}\nPrecio: {$propPrice}\n\nEn breve uno de nuestros asesores te contactará.";
        
        $mail->send(); // Enviar a Cliente
    }
    
    // Cerramos la conexión activa
    $mail->smtpClose();

} catch (Exception $e) {
    // Si hay un error al enviar, lo guardamos en un log (no podemos hacer echo porque ya respondimos)
    error_log("Mailer Error: {$mail->ErrorInfo}");
}
