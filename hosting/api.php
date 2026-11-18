<?php
/**
 * Recibe los formularios (contacto, muestra gratis, libro de reclamaciones) -> correo SMTP (PHPMailer) -> pagina de gracias.
 * Rutas: /api/contacto, /api/muestra, /api/reclamo (reescritas en .htaccess a api.php?f=...)
 * Configuracion: config.php (usuario/clave SMTP). Registro de envios: data/envios.log (protegido).
 */
declare(strict_types=1);
date_default_timezone_set('America/Lima');
ini_set('display_errors', '0');   // nunca mostrar errores PHP al visitante
$cfg = require __DIR__ . '/config.php';
require __DIR__ . '/lib/email.php';
require __DIR__ . '/vendor/phpmailer/Exception.php';
require __DIR__ . '/vendor/phpmailer/PHPMailer.php';
require __DIR__ . '/vendor/phpmailer/SMTP.php';
use PHPMailer\PHPMailer\PHPMailer;

// ---------- utilidades ----------
final class Bad extends Exception {}
function need(bool $ok, string $msg): void { if (!$ok) throw new Bad($msg); }
function clean($v, int $max = 200): string {
    $s = is_array($v) ? '' : (string)$v;
    if (!mb_check_encoding($s, 'UTF-8')) $s = mb_convert_encoding($s, 'UTF-8', 'ISO-8859-1');   // texto mal codificado: no romper
    return mb_substr(trim((string)preg_replace('/\s+/u', ' ', strip_tags($s))), 0, $max);
}
function digits($v): string { return preg_replace('/\D/', '', (string)$v); }
function cel($v): string { $d = digits($v); return (strlen($d) > 9 && strpos($d, '51') === 0) ? substr($d, 2) : $d; }
function email_ok(string $v): bool { return strlen($v) <= 100 && filter_var($v, FILTER_VALIDATE_EMAIL) && preg_match('/@[^@\s]+\.[^@\s]{2,}$/', $v); }
function ruc_ok(string $v): bool {
    if (!preg_match('/^(10|15|16|17|20)\d{9}$/', $v)) return false;
    $w = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]; $s = 0;
    for ($i = 0; $i < 10; $i++) $s += (int)$v[$i] * $w[$i];
    $r = 11 - ($s % 11);
    return (($r === 10) ? 0 : (($r === 11) ? 1 : $r)) === (int)$v[10];
}
const RE_NOMBRE = "/^\\p{L}[\\p{L} '.\\-]{2,79}$/u";
const RE_RAZON  = "/^(?=.*\\p{L})[\\p{L}\\p{N} .,&'\\-\\/()]{3,100}$/u";
const RE_LUGAR  = "/^\\p{L}[\\p{L} '.\\-]{1,59}$/u";
const RE_DIREC  = "/^(?=.*\\p{L})[\\p{L}\\p{N} .,#°ºª'\\-\\/()]{5,120}$/u";

function wants_json(): bool { return strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false; }
function fail(string $m, int $code = 400): void {
    http_response_code($code);
    if (wants_json()) { header('Content-Type: application/json; charset=utf-8'); echo json_encode(['ok' => false, 'error' => $m], JSON_UNESCAPED_UNICODE); exit; }
    echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:sans-serif;padding:40px;text-align:center"><h1>Revisa tus datos</h1><p>' . htmlspecialchars($m) . '</p><p><a href="javascript:history.back()">Volver al formulario</a></p>';
    exit;
}

// ---------- formularios ----------
function f_contacto(array $b): array {
    $o = ['nombre' => clean($b['nombre'] ?? '', 80), 'empresa' => clean($b['empresa'] ?? '', 100), 'celular' => cel($b['celular'] ?? ''), 'correo' => clean($b['correo'] ?? '', 100), 'mensaje' => clean($b['mensaje'] ?? '', 1500)];
    need((bool)preg_match(RE_NOMBRE, $o['nombre']), 'Escribe tu nombre completo.');
    need((bool)preg_match('/^9\d{8}$/', $o['celular']), 'El celular debe tener 9 dígitos y empezar con 9.');
    need(email_ok($o['correo']), 'Ingresa un correo válido.');
    need(mb_strlen($o['mensaje']) >= 10, 'Escribe tu consulta (mínimo 10 caracteres).');
    return ['kind' => 'contacto', 'who' => $o['nombre'], 'cel' => $o['celular'], 'correo' => $o['correo'], 'waMsg' => 'Hola ' . explode(' ', $o['nombre'])[0] . ', te escribimos de New Denim sobre tu consulta enviada desde la web.',
        'subject' => 'Nueva consulta web - ' . $o['nombre'], 'replyTo' => $o['correo'], 'next' => '/gracias/?f=contacto',
        'lines' => ['Nombre' => $o['nombre'], 'Empresa' => $o['empresa'] ?: '-', 'Celular' => $o['celular'], 'Correo' => $o['correo'], 'Mensaje' => $o['mensaje']]];
}
function f_muestra(array $b): array {
    $emp = ($b['tipo'] ?? '') === 'empresa'; $env = ($b['entrega'] ?? '') === 'envio';
    $tela = clean($b['tela'] ?? '', 20); $tipoTela = clean($b['tipo_tela'] ?? '', 20); $linea = clean($b['linea'] ?? '', 30); $negocio = clean($b['negocio'] ?? '', 50); $compra = clean($b['compra'] ?? '', 30);
    $o = ['nombre' => clean($b['nombre'] ?? '', 80), 'razon' => clean($b['razon'] ?? '', 100), 'ruc' => digits($b['ruc'] ?? ''), 'dni' => digits($b['dni'] ?? ''), 'celular' => cel($b['celular'] ?? ''), 'correo' => clean($b['correo'] ?? '', 100), 'distrito' => clean($b['distrito'] ?? '', 60), 'direccion' => clean($b['direccion'] ?? '', 120)];
    need(in_array($tela, ['Denim', 'Drill'], true), 'Elige un tipo de tela.');
    need(in_array($tipoTela, $tela === 'Denim' ? ['Rígido', 'Confort', 'Stretch', 'Super stretch'] : ['Rígido', 'Confort', 'Stretch'], true), 'Elige el tipo de tela.');
    need(in_array($linea, ['Moda hombre', 'Moda mujer', 'Niños y junior', 'Denim camisero', 'Denim de trabajo'], true), 'Elige la línea de producto.');
    if ($emp) { need((bool)preg_match(RE_RAZON, $o['razon']), 'Escribe la razón social.'); need(ruc_ok($o['ruc']), 'RUC no válido.'); }
    else { need((bool)preg_match(RE_NOMBRE, $o['nombre']), 'Escribe tu nombre completo.'); need((bool)preg_match('/^\d{8}$/', $o['dni']), 'El DNI debe tener 8 dígitos.'); }
    need(in_array($negocio, ['Marca propia', 'Maquilador / confección a tercero'], true), 'Elige el tipo de negocio.');
    need(in_array($compra, ['5 a 20 rollos', '20 a 50 rollos', '50 rollos a más'], true), 'Elige la compra mensual.');
    need((bool)preg_match('/^9\d{8}$/', $o['celular']), 'El celular debe tener 9 dígitos y empezar con 9.');
    need($o['correo'] === '' || email_ok($o['correo']), 'Ingresa un correo válido.');
    if ($env) { need((bool)preg_match(RE_DIREC, $o['direccion']), 'Escribe una dirección válida.'); need((bool)preg_match(RE_LUGAR, $o['distrito']), 'Escribe el distrito.'); }
    $who = $emp ? $o['razon'] : $o['nombre'];
    $lines = ['Tipo de cliente' => $emp ? 'Empresa' : 'Persona natural'];
    $lines += $emp ? ['Razon social' => $o['razon'], 'RUC' => $o['ruc']] : ['Nombre' => $o['nombre'], 'DNI' => $o['dni']];
    $lines += ['Celular' => $o['celular'], 'Correo' => $o['correo'] ?: '-', 'Tela' => $tela, 'Tipo de tela' => $tipoTela, 'Linea de producto' => $linea, 'Tipo de negocio' => $negocio, 'Compra mensual' => $compra, 'Entrega' => $env ? 'Envio' : 'Recojo en tienda'];
    if ($env) $lines += ['Distrito' => $o['distrito'], 'Direccion' => $o['direccion']];
    return ['kind' => 'muestra', 'who' => $who, 'cel' => $o['celular'], 'correo' => $o['correo'],
        'waMsg' => 'Hola ' . ($emp ? $who : explode(' ', $o['nombre'])[0]) . ', gracias por solicitar tu muestra gratis en New Denim. Te escribimos para coordinar ' . ($env ? 'el envío' : 'el recojo en tienda') . '.',
        'subject' => 'Solicitud de muestra gratis - ' . $who, 'replyTo' => $o['correo'], 'next' => '/muestra-gratis/gracias/?e=' . ($env ? 'envio' : 'recojo'), 'lines' => $lines];
}
function f_reclamo(array $b): array {
    $td = in_array($b['tipo_doc'] ?? '', ['DNI', 'CE', 'RUC', 'Pasaporte'], true) ? $b['tipo_doc'] : 'DNI';
    $o = ['nombre' => clean($b['nombre'] ?? '', 80), 'doc' => digits($b['doc'] ?? ''), 'celular' => cel($b['celular'] ?? ''), 'correo' => clean($b['correo'] ?? '', 100), 'domicilio' => clean($b['domicilio'] ?? '', 120),
        'monto' => clean($b['monto'] ?? '', 12), 'descripcion' => clean($b['descripcion'] ?? '', 300), 'detalle' => clean($b['detalle'] ?? '', 1500), 'pedido' => clean($b['pedido'] ?? '', 800)];
    need((bool)preg_match(RE_NOMBRE, $o['nombre']), 'Escribe tu nombre completo.'); need((bool)preg_match('/^\d{8,12}$/', $o['doc']), 'Documento de identidad no válido.');
    need((bool)preg_match('/^9\d{8}$/', $o['celular']), 'El celular debe tener 9 dígitos y empezar con 9.'); need($o['correo'] === '' || email_ok($o['correo']), 'Ingresa un correo válido.');
    need(mb_strlen($o['domicilio']) >= 5, 'Escribe tu domicilio.'); need($o['monto'] === '' || (bool)preg_match('/^\d{1,7}(\.\d{1,2})?$/', $o['monto']), 'Monto no válido.');
    need(mb_strlen($o['detalle']) >= 10 && mb_strlen($o['pedido']) >= 5, 'Completa el detalle y el pedido.');
    $n = date('Ymd-His');
    return ['kind' => 'reclamo', 'who' => $o['nombre'], 'cel' => $o['celular'], 'correo' => $o['correo'], 'copyTo' => $o['correo'],
        'waMsg' => 'Hola ' . explode(' ', $o['nombre'])[0] . ", te escribimos de New Denim sobre tu hoja de reclamación N° $n.",
        'subject' => "Libro de reclamaciones N° $n - " . $o['nombre'], 'replyTo' => $o['correo'], 'next' => "/gracias/?f=reclamo&n=$n",
        'lines' => ['N° de hoja' => $n, 'Fecha' => date('d/m/Y H:i'), 'Tipo' => (($b['tipo'] ?? '') === 'queja') ? 'Queja' : 'Reclamo', 'Documento' => "$td " . $o['doc'], 'Nombre' => $o['nombre'], 'Celular' => $o['celular'], 'Correo' => $o['correo'] ?: '-',
            'Domicilio' => $o['domicilio'], 'Bien contratado' => (($b['bien'] ?? '') === 'servicio') ? 'Servicio' : 'Producto', 'Monto reclamado' => $o['monto'] ?: '-', 'Descripcion' => $o['descripcion'] ?: '-', 'Detalle' => $o['detalle'], 'Pedido del consumidor' => $o['pedido']]];
}

// ---------- envio ----------
function mailer(array $cfg): PHPMailer {
    $m = new PHPMailer(true);
    $m->isSMTP(); $m->Host = $cfg['smtp_host']; $m->Port = (int)$cfg['smtp_port']; $m->SMTPAuth = true;
    $m->Username = $cfg['smtp_user']; $m->Password = $cfg['smtp_pass'];
    $m->SMTPSecure = ((int)$cfg['smtp_port'] === 465) ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $m->CharSet = 'UTF-8'; $m->Timeout = 15; $m->isHTML(true);
    $m->addEmbeddedImage(__DIR__ . '/lib/email-logo.png', 'nd-logo', 'nd.png', 'base64', 'image/png');
    return $m;
}
function send_all(array $cfg, array $r): bool {
    try {
        [$html, $text] = nd_render($r['kind'], $r['lines'], $r);
        $m = mailer($cfg);
        $m->setFrom($cfg['mail_from'], 'New Denim Web'); $m->addAddress($cfg['mail_to']);
        if (!empty($cfg['mail_cc'])) $m->addCC($cfg['mail_cc']);
        if (!empty($r['replyTo']) && email_ok($r['replyTo'])) $m->addReplyTo($r['replyTo']);
        $m->Subject = $r['subject']; $m->Body = $html; $m->AltBody = $text;
        $m->send();
        if (!empty($r['copyTo']) && email_ok($r['copyTo'])) {   // copia para el cliente (solo libro de reclamaciones)
            [$h2, $t2] = nd_render('copia', $r['lines'], ['who' => explode(' ', $r['who'])[0]]);
            $c = mailer($cfg);
            $c->setFrom($cfg['mail_from'], 'New Denim SAC'); $c->addAddress($r['copyTo']);
            $c->Subject = 'Copia de tu hoja - ' . $r['subject']; $c->Body = $h2; $c->AltBody = $t2;
            $c->send();
        }
        return true;
    } catch (Throwable $e) { @file_put_contents(__DIR__ . '/data/errores.log', date('c') . ' ' . $e->getMessage() . "\n", FILE_APPEND | LOCK_EX); return false; }
}

// ---------- flujo ----------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: /contacto/'); exit; }
$f = $_GET['f'] ?? '';
if (!in_array($f, ['contacto', 'muestra', 'reclamo'], true)) { http_response_code(404); exit; }
if (!empty($_POST['web'])) { if (wants_json()) { header('Content-Type: application/json'); echo '{"ok":true,"next":"/gracias/"}'; exit; } header('Location: /gracias/', true, 303); exit; }                                     // honeypot
if (time() - (int)($_POST['t'] ?? 0) < 3) fail('Envío demasiado rápido. Inténtalo de nuevo.');                      // anti bot

@mkdir(__DIR__ . '/data/rate', 0755, true);                                                                          // 6 envios por minuto por IP
$rf = __DIR__ . '/data/rate/' . md5($_SERVER['REMOTE_ADDR'] ?? '');
$hits = array_filter(array_map('intval', @file($rf, FILE_IGNORE_NEW_LINES) ?: []), fn($t) => $t > time() - 60);
if (count($hits) >= 6) fail('Demasiados envíos. Espera un minuto.', 429);
$hits[] = time(); @file_put_contents($rf, implode("\n", $hits), LOCK_EX);

try { $r = ['contacto' => 'f_contacto', 'muestra' => 'f_muestra', 'reclamo' => 'f_reclamo'][$f]($_POST); }
catch (Bad $e) { fail($e->getMessage()); }

$ok = send_all($cfg, $r);
@file_put_contents(__DIR__ . '/data/envios.log', date('c') . ' ' . ($ok ? 'OK' : 'MAIL-FAIL') . ' ' . $r['subject'] . ' ' . json_encode($r['lines'], JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
$next = $r['next'] . ($ok ? '' : ((strpos($r['next'], '?') !== false ? '&' : '?') . 'm=0'));
if (wants_json()) { header('Content-Type: application/json; charset=utf-8'); echo json_encode(['ok' => true, 'next' => $next, 'sent' => $ok]); exit; }
header('Location: ' . $next, true, 303);
