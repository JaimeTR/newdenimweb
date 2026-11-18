// Diseno de los correos (HTML con tablas + estilos en linea para que Gmail/Outlook lo muestren bien).
// render(kind, lines, ctx) -> { html, text }.  kind: contacto | muestra | reclamo | copia
const SLATE = '#2C3442', GOLD = '#ECAB0F', GRAY = '#F8F8F8', LINE = '#E6E7EA', SOFT = '#5d6678';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const LONG = new Set(['Mensaje', 'Detalle', 'Pedido del consumidor']);   // textos largos: van en cajas aparte

const META = {
  contacto: { badge: 'Nueva consulta web', title: (c) => `Consulta de ${c.who}`, intro: 'Alguien escribió desde el formulario de contacto de newdenimtextil.com.' },
  muestra: { badge: 'Solicitud de muestra gratis', title: (c) => `Muestra gratis para ${c.who}`, intro: 'Se solicitó una muestra desde newdenimtextil.com/muestra-gratis. Coordinar por WhatsApp.' },
  reclamo: { badge: 'Libro de reclamaciones', title: (c) => `Hoja de reclamación de ${c.who}`, intro: 'Se registró una hoja en el libro de reclamaciones virtual. Plazo de respuesta: 15 días hábiles.' },
  copia: { badge: 'Copia de tu hoja', title: (c) => `Recibimos tu hoja, ${c.who}`, intro: 'New Denim SAC recibió tu hoja de reclamación. Te responderemos en un plazo máximo de 15 días hábiles. Esta es tu copia.' },
};

const btn = (href, label, bg, fg, border = '') =>
  `<td style="padding:0 8px 8px 0"><a href="${href}" style="display:inline-block;background:${bg};color:${fg};${border}font:600 14px Arial,Helvetica,sans-serif;text-decoration:none;padding:12px 20px;border-radius:10px">${label}</a></td>`;

function render(kind, lines, ctx = {}) {
  const m = META[kind], when = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima', dateStyle: 'long', timeStyle: 'short' });
  const rows = Object.entries(lines).filter(([k]) => !LONG.has(k));
  const longs = Object.entries(lines).filter(([k]) => LONG.has(k));
  const waMsg = ctx.waMsg || 'Hola, te escribimos de New Denim.';
  const actions = kind === 'copia' ? '' : `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:22px"><tr>
      ${ctx.cel ? btn(`https://wa.me/51${ctx.cel}?text=${encodeURIComponent(waMsg)}`, 'Responder por WhatsApp', '#25d366', '#04210f') : ''}
      ${ctx.cel ? btn(`tel:+51${ctx.cel}`, 'Llamar', SLATE, '#ffffff') : ''}
      ${ctx.correo ? btn(`mailto:${esc(ctx.correo)}`, 'Responder por correo', '#ffffff', SLATE, `border:2px solid ${SLATE};`) : ''}
    </tr></table>`;
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(m.badge)}</title></head>
<body style="margin:0;padding:0;background:#EEF0F3">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF0F3"><tr><td align="center" style="padding:26px 12px">
 <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden">
  <tr><td style="background:${SLATE};padding:22px 28px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:14px"><img src="cid:nd-logo" width="54" height="42" alt="ND" style="display:block;border:0"></td>
      <td><div style="font:italic 700 26px Georgia,'Times New Roman',serif;color:${GOLD};line-height:1">New Denim</div>
          <div style="font:500 10px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#DFDFDF;margin-top:5px">Distribuidor textil</div></td>
    </tr></table></td></tr>
  <tr><td style="background:${GOLD};padding:10px 28px;font:700 12px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${SLATE}">${esc(m.badge)}</td></tr>
  <tr><td style="padding:30px 28px 8px">
    <div style="font:700 24px Arial,Helvetica,sans-serif;color:${SLATE};line-height:1.25">${esc(m.title(ctx))}</div>
    <div style="font:400 13px Arial,sans-serif;color:${SOFT};margin-top:6px">${esc(when)} (hora de Lima)</div>
    <div style="font:400 15px/1.55 Arial,sans-serif;color:${SOFT};margin-top:14px">${esc(m.intro)}</div>
  </td></tr>
  <tr><td style="padding:14px 28px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${LINE};border-radius:12px">
    ${rows.map(([k, v], i) => `<tr><td style="padding:11px 16px;${i ? `border-top:1px solid ${LINE};` : ''}width:38%;font:600 11px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:${SOFT};background:${GRAY}">${esc(k)}</td>
      <td style="padding:11px 16px;${i ? `border-top:1px solid ${LINE};` : ''}font:500 15px Arial,sans-serif;color:${SLATE}">${esc(v)}</td></tr>`).join('')}
  </table></td></tr>
  ${longs.map(([k, v]) => `<tr><td style="padding:16px 28px 0"><div style="font:600 11px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:${SOFT};margin-bottom:6px">${esc(k)}</div>
    <div style="background:${GRAY};border-left:4px solid ${GOLD};border-radius:8px;padding:14px 16px;font:400 15px/1.6 Arial,sans-serif;color:${SLATE};white-space:pre-wrap">${esc(v)}</div></td></tr>`).join('')}
  <tr><td style="padding:6px 28px 30px">${actions}</td></tr>
  <tr><td style="background:${GRAY};padding:18px 28px;font:400 12px/1.6 Arial,sans-serif;color:${SOFT};border-top:1px solid ${LINE}">
    ${kind === 'copia' ? 'Si necesitas algo más, escríbenos por WhatsApp al +51 981 033 383.' : 'Aviso automático de newdenimtextil.com. Puedes responder este correo para escribirle directamente al cliente.'}<br>
    New Denim SAC · Jirón Luis Giribaldi 624 Tda 06, La Victoria, Lima · <a href="https://newdenimtextil.com" style="color:${SLATE}">newdenimtextil.com</a></td></tr>
 </table></td></tr></table></body></html>`;
  const text = `${m.badge.toUpperCase()}\n${m.title(ctx)} · ${when}\n\n${Object.entries(lines).map(([k, v]) => `${k}: ${v}`).join('\n')}\n${ctx.cel ? `\nWhatsApp: https://wa.me/51${ctx.cel}\n` : ''}`;
  return { html, text };
}
module.exports = { render };
