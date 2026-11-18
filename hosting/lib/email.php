<?php
// Diseno de los correos (HTML con tablas y estilos en linea). render($kind, $lines, $ctx) -> [html, text]
// $kind: contacto | muestra | reclamo | copia
function nd_render(string $kind, array $lines, array $ctx = []): array {
    $SLATE = '#2C3442'; $GOLD = '#ECAB0F'; $GRAY = '#F8F8F8'; $LINE = '#E6E7EA'; $SOFT = '#5d6678';
    $e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
    $who = $ctx['who'] ?? '';
    $META = [
        'contacto' => ['Nueva consulta web', "Consulta de $who", 'Alguien escribió desde el formulario de contacto de newdenimtextil.com.'],
        'muestra'  => ['Solicitud de muestra gratis', "Muestra gratis para $who", 'Se solicitó una muestra desde newdenimtextil.com/muestra-gratis. Coordinar por WhatsApp.'],
        'reclamo'  => ['Libro de reclamaciones', "Hoja de reclamación de $who", 'Se registró una hoja en el libro de reclamaciones virtual. Plazo de respuesta: 15 días hábiles.'],
        'copia'    => ['Copia de tu hoja', "Recibimos tu hoja, $who", 'New Denim SAC recibió tu hoja de reclamación. Te responderemos en un plazo máximo de 15 días hábiles. Esta es tu copia.'],
    ];
    [$badge, $title, $intro] = $META[$kind];
    $long = ['Mensaje', 'Detalle', 'Pedido del consumidor'];
    $rows = array_filter($lines, fn($k) => !in_array($k, $long, true), ARRAY_FILTER_USE_KEY);
    $longs = array_filter($lines, fn($k) => in_array($k, $long, true), ARRAY_FILTER_USE_KEY);
    $when = (new DateTime('now', new DateTimeZone('America/Lima')))->format('d/m/Y H:i');
    $btn = fn($href, $label, $bg, $fg, $border = '') => '<td style="padding:0 8px 8px 0"><a href="' . $href . '" style="display:inline-block;background:' . $bg . ';color:' . $fg . ';' . $border . 'font:600 14px Arial,Helvetica,sans-serif;text-decoration:none;padding:12px 20px;border-radius:10px">' . $label . '</a></td>';
    $cel = $ctx['cel'] ?? ''; $correo = $ctx['correo'] ?? '';
    $actions = '';
    if ($kind !== 'copia') {
        $actions = '<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:22px"><tr>'
            . ($cel ? $btn('https://wa.me/51' . $cel . '?text=' . rawurlencode($ctx['waMsg'] ?? 'Hola, te escribimos de New Denim.'), 'Responder por WhatsApp', '#25d366', '#04210f') : '')
            . ($cel ? $btn('tel:+51' . $cel, 'Llamar', $SLATE, '#ffffff') : '')
            . ($correo ? $btn('mailto:' . $e($correo), 'Responder por correo', '#ffffff', $SLATE, "border:2px solid $SLATE;") : '')
            . '</tr></table>';
    }
    $trs = ''; $i = 0;
    foreach ($rows as $k => $v) {
        $bt = $i ? "border-top:1px solid $LINE;" : '';
        $trs .= "<tr><td style=\"padding:11px 16px;{$bt}width:38%;font:600 11px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:$SOFT;background:$GRAY\">" . $e($k) . "</td><td style=\"padding:11px 16px;{$bt}font:500 15px Arial,sans-serif;color:$SLATE\">" . $e($v) . '</td></tr>';
        $i++;
    }
    $lg = '';
    foreach ($longs as $k => $v) {
        $lg .= "<tr><td style=\"padding:16px 28px 0\"><div style=\"font:600 11px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:$SOFT;margin-bottom:6px\">" . $e($k) . "</div><div style=\"background:$GRAY;border-left:4px solid $GOLD;border-radius:8px;padding:14px 16px;font:400 15px/1.6 Arial,sans-serif;color:$SLATE;white-space:pre-wrap\">" . $e($v) . '</div></td></tr>';
    }
    $foot = $kind === 'copia' ? 'Si necesitas algo más, escríbenos por WhatsApp al +51 981 033 383.' : 'Aviso automático de newdenimtextil.com. Puedes responder este correo para escribirle directamente al cliente.';
    $html = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' . $e($badge) . '</title></head>'
        . "<body style=\"margin:0;padding:0;background:#EEF0F3\"><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#EEF0F3\"><tr><td align=\"center\" style=\"padding:26px 12px\">"
        . "<table role=\"presentation\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden\">"
        . "<tr><td style=\"background:$SLATE;padding:22px 28px\"><table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\"><tr><td style=\"padding-right:14px\"><img src=\"cid:nd-logo\" width=\"54\" height=\"42\" alt=\"ND\" style=\"display:block;border:0\"></td>"
        . "<td><div style=\"font:italic 700 26px Georgia,'Times New Roman',serif;color:$GOLD;line-height:1\">New Denim</div><div style=\"font:500 10px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#DFDFDF;margin-top:5px\">Distribuidor textil</div></td></tr></table></td></tr>"
        . "<tr><td style=\"background:$GOLD;padding:10px 28px;font:700 12px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:$SLATE\">" . $e($badge) . '</td></tr>'
        . "<tr><td style=\"padding:30px 28px 8px\"><div style=\"font:700 24px Arial,Helvetica,sans-serif;color:$SLATE;line-height:1.25\">" . $e($title) . "</div><div style=\"font:400 13px Arial,sans-serif;color:$SOFT;margin-top:6px\">" . $e($when) . " (hora de Lima)</div><div style=\"font:400 15px/1.55 Arial,sans-serif;color:$SOFT;margin-top:14px\">" . $e($intro) . '</div></td></tr>'
        . "<tr><td style=\"padding:14px 28px 0\"><table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"border:1px solid $LINE;border-radius:12px\">$trs</table></td></tr>"
        . $lg . "<tr><td style=\"padding:6px 28px 30px\">$actions</td></tr>"
        . "<tr><td style=\"background:$GRAY;padding:18px 28px;font:400 12px/1.6 Arial,sans-serif;color:$SOFT;border-top:1px solid $LINE\">$foot<br>New Denim SAC · Jirón Luis Giribaldi 624 Tda 06, La Victoria, Lima · <a href=\"https://newdenimtextil.com\" style=\"color:$SLATE\">newdenimtextil.com</a></td></tr>"
        . '</table></td></tr></table></body></html>';
    $text = strtoupper($badge) . "\n$title · $when\n\n";
    foreach ($lines as $k => $v) $text .= "$k: $v\n";
    if ($cel) $text .= "\nWhatsApp: https://wa.me/51$cel\n";
    return [$html, $text];
}
