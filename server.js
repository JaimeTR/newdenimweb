// Servidor de New Denim: sirve el sitio estatico (public/) y recibe los 3 formularios -> correo.
// Variables de entorno: ver .env.example. Sin SMTP configurado, los envios solo se registran en consola.
const express = require('express');
const nodemailer = require('nodemailer');
const { render } = require('./lib/email');
const path = require('path');
const fs = require('fs');

const PUBLIC = path.join(__dirname, 'public');
const SITE = (process.env.SITE_URL || 'https://newdenimtextil.com').replace(/\/$/, '');
const MAIL_TO = process.env.MAIL_TO || 'newdenimsac@gmail.com';
const MAIL_CC = process.env.MAIL_CC ?? 'soporte@newdenimtextil.com';   // copia interna de cada aviso (vacio = sin copia)
const MAIL_FROM = process.env.MAIL_FROM || 'soporte@newdenimtextil.com';
const smtp = process.env.SMTP_HOST
  ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: +(process.env.SMTP_PORT || 465), secure: +(process.env.SMTP_PORT || 465) === 465, auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined })
  : null;

// ---------- validacion (mismas reglas que public/assets/js/main.js) ----------
const RE = { nombre: /^\p{L}[\p{L} '.\-]{2,79}$/u, razon: /^(?=.*\p{L})[\p{L}\p{N} .,&'\-\/()]{3,100}$/u, lugar: /^\p{L}[\p{L} '.\-]{1,59}$/u, direc: /^(?=.*\p{L})[\p{L}\p{N} .,#°ºª'\-\/()]{5,120}$/u };
const clean = (v, max = 200) => String(v ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
const digits = (v) => String(v ?? '').replace(/\D/g, '');
const cel = (v) => { let d = digits(v); if (d.length > 9 && d.startsWith('51')) d = d.slice(2); return d; };
const emailOk = (v) => v.length <= 100 && /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v);
function rucOk(v) {
  if (!/^(10|15|16|17|20)\d{9}$/.test(v)) return false;
  const w = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2], r = 11 - (w.reduce((s, x, i) => s + x * +v[i], 0) % 11);
  return (r === 10 ? 0 : r === 11 ? 1 : r) === +v[10];
}
class Bad extends Error {}
const need = (ok, msg) => { if (!ok) throw new Bad(msg); };

// Cada formulario devuelve { subject, lines, next, replyTo? }
const forms = {
  contacto(b) {
    const o = { nombre: clean(b.nombre, 80), empresa: clean(b.empresa, 100), celular: cel(b.celular), correo: clean(b.correo, 100), mensaje: clean(b.mensaje, 1500) };
    need(RE.nombre.test(o.nombre), 'Escribe tu nombre completo.'); need(/^9\d{8}$/.test(o.celular), 'El celular debe tener 9 dígitos y empezar con 9.');
    need(emailOk(o.correo), 'Ingresa un correo válido.'); need(o.mensaje.length >= 10, 'Escribe tu consulta (mínimo 10 caracteres).');
    return { kind: 'contacto', who: o.nombre, cel: o.celular, correo: o.correo, waMsg: `Hola ${o.nombre.split(' ')[0]}, te escribimos de New Denim sobre tu consulta enviada desde la web.`,
      subject: `Nueva consulta web - ${o.nombre}`, replyTo: o.correo, next: '/gracias/?f=contacto',
      lines: { Nombre: o.nombre, Empresa: o.empresa || '-', Celular: o.celular, Correo: o.correo, Mensaje: o.mensaje } };
  },
  muestra(b) {
    const emp = b.tipo === 'empresa', env = b.entrega === 'envio';
    const tela = clean(b.tela, 20), tipoTela = clean(b.tipo_tela, 20), linea = clean(b.linea, 30), negocio = clean(b.negocio, 50), compra = clean(b.compra, 30);
    const o = { nombre: clean(b.nombre, 80), razon: clean(b.razon, 100), ruc: digits(b.ruc), dni: digits(b.dni), celular: cel(b.celular), correo: clean(b.correo, 100), distrito: clean(b.distrito, 60), direccion: clean(b.direccion, 120) };
    need(['Denim', 'Drill'].includes(tela), 'Elige un tipo de tela.');
    need((tela === 'Denim' ? ['Rígido', 'Confort', 'Stretch', 'Super stretch'] : ['Rígido', 'Confort', 'Stretch']).includes(tipoTela), 'Elige el tipo de tela.');
    need(['Moda hombre', 'Moda mujer', 'Niños y junior', 'Denim camisero', 'Denim de trabajo'].includes(linea), 'Elige la línea de producto.');
    if (emp) { need(RE.razon.test(o.razon), 'Escribe la razón social.'); need(rucOk(o.ruc), 'RUC no válido.'); }
    else { need(RE.nombre.test(o.nombre), 'Escribe tu nombre completo.'); need(/^\d{8}$/.test(o.dni), 'El DNI debe tener 8 dígitos.'); }
    need(['Marca propia', 'Maquilador / confección a tercero'].includes(negocio), 'Elige el tipo de negocio.');
    need(['5 a 20 rollos', '20 a 50 rollos', '50 rollos a más'].includes(compra), 'Elige la compra mensual.');
    need(/^9\d{8}$/.test(o.celular), 'El celular debe tener 9 dígitos y empezar con 9.'); need(!o.correo || emailOk(o.correo), 'Ingresa un correo válido.');
    if (env) { need(RE.direc.test(o.direccion), 'Escribe una dirección válida.'); need(RE.lugar.test(o.distrito), 'Escribe el distrito.'); }
    const who = emp ? o.razon : o.nombre;
    return { kind: 'muestra', who, cel: o.celular, correo: o.correo, waMsg: `Hola ${(emp ? who : o.nombre.split(' ')[0])}, gracias por solicitar tu muestra gratis en New Denim. Te escribimos para coordinar ${env ? 'el envío' : 'el recojo en tienda'}.`,
      subject: `Solicitud de muestra gratis - ${who}`, replyTo: o.correo, next: `/muestra-gratis/gracias/?e=${env ? 'envio' : 'recojo'}`,
      lines: { 'Tipo de cliente': emp ? 'Empresa' : 'Persona natural', ...(emp ? { 'Razon social': o.razon, RUC: o.ruc } : { Nombre: o.nombre, DNI: o.dni }), Celular: o.celular, Correo: o.correo || '-',
        Tela: tela, 'Tipo de tela': tipoTela, 'Linea de producto': linea, 'Tipo de negocio': negocio, 'Compra mensual': compra,
        Entrega: env ? 'Envio' : 'Recojo en tienda', ...(env ? { Distrito: o.distrito, Direccion: o.direccion, 'Costo de envio': 'Lo paga el cliente' } : {}) } };
  },
  reclamo(b) {
    const o = { nombre: clean(b.nombre, 80), tipo_doc: ['DNI', 'CE', 'RUC', 'Pasaporte'].includes(b.tipo_doc) ? b.tipo_doc : 'DNI', doc: digits(b.doc), celular: cel(b.celular), correo: clean(b.correo, 100), domicilio: clean(b.domicilio, 120),
      monto: clean(b.monto, 12), descripcion: clean(b.descripcion, 300), detalle: clean(b.detalle, 1500), pedido: clean(b.pedido, 800) };
    need(RE.nombre.test(o.nombre), 'Escribe tu nombre completo.'); need(/^\d{8,12}$/.test(o.doc), 'Documento de identidad no válido.'); need(/^9\d{8}$/.test(o.celular), 'El celular debe tener 9 dígitos y empezar con 9.');
    need(!o.correo || emailOk(o.correo), 'Ingresa un correo válido.'); need(o.domicilio.length >= 5, 'Escribe tu domicilio.'); need(!o.monto || /^\d{1,7}(\.\d{1,2})?$/.test(o.monto), 'Monto no válido.');
    need(o.detalle.length >= 10 && o.pedido.length >= 5, 'Completa el detalle y el pedido.');
    const d = new Date(), p = (n) => String(n).padStart(2, '0'), n = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
    return { kind: 'reclamo', who: o.nombre, cel: o.celular, correo: o.correo, waMsg: `Hola ${o.nombre.split(' ')[0]}, te escribimos de New Denim sobre tu hoja de reclamación N° ${n}.`,
      subject: `Libro de reclamaciones N° ${n} - ${o.nombre}`, replyTo: o.correo, copyTo: o.correo, next: `/gracias/?f=reclamo&n=${n}`,
      lines: { 'N° de hoja': n, Fecha: d.toLocaleString('es-PE', { timeZone: 'America/Lima' }), Tipo: b.tipo === 'queja' ? 'Queja' : 'Reclamo', Documento: `${o.tipo_doc} ${o.doc}`, Nombre: o.nombre, Celular: o.celular, Correo: o.correo || '-',
        Domicilio: o.domicilio, 'Bien contratado': b.bien === 'servicio' ? 'Servicio' : 'Producto', 'Monto reclamado': o.monto || '-', Descripcion: o.descripcion || '-', Detalle: o.detalle, 'Pedido del consumidor': o.pedido } };
  },
};

const LOGO = [{ filename: 'nd.png', path: require('path').join(__dirname, 'lib', 'email-logo.png'), cid: 'nd-logo' }];
async function send(r) {
  const text = Object.entries(r.lines).map(([k, v]) => `${k}: ${v}`).join('\n');
  console.log(`[${new Date().toISOString()}] ${r.subject}\n${text}\n`);     // copia en los logs de Hostinger
  if (!smtp) return false;
  try {
    const a = render(r.kind, r.lines, r);
    await smtp.sendMail({ from: `New Denim Web <${MAIL_FROM}>`, to: MAIL_TO, cc: MAIL_CC || undefined, replyTo: r.replyTo || undefined, subject: r.subject, text: a.text, html: a.html, attachments: LOGO });
    if (r.copyTo) {   // copia para el cliente (solo libro de reclamaciones)
      const c = render('copia', r.lines, { who: r.who.split(' ')[0] });
      await smtp.sendMail({ from: `New Denim SAC <${MAIL_FROM}>`, to: r.copyTo, subject: `Copia de tu hoja - ${r.subject}`, text: c.text, html: c.html, attachments: LOGO });
    }
    return true;
  } catch (e) { console.error('MAIL-FAIL', e.message); return false; }
}

// Vista previa de los correos (solo en desarrollo): /__preview/contacto | muestra | reclamo | copia
const SAMPLES = {
  contacto: { who: 'Ana Pérez Soto', cel: '987654321', correo: 'ana@correo.com', waMsg: 'Hola Ana, te escribimos de New Denim.', lines: { Nombre: 'Ana Pérez Soto', Empresa: 'Confecciones Ana', Celular: '987654321', Correo: 'ana@correo.com', Mensaje: 'Hola, busco denim stretch para una colección de jeans. Necesito unos 300 metros y quisiera conocer precios por mayor.' } },
  muestra: { who: 'Confecciones Ana S.A.C.', cel: '987654321', correo: '', waMsg: 'Hola, gracias por solicitar tu muestra gratis.', lines: { 'Tipo de cliente': 'Empresa', 'Razon social': 'Confecciones Ana S.A.C.', RUC: '20100070970', Celular: '987654321', Correo: '-', Tela: 'Denim', 'Tipo de tela': 'Stretch', 'Linea de producto': 'Moda mujer', 'Tipo de negocio': 'Marca propia', 'Compra mensual': '5 a 20 rollos', Entrega: 'Envio', Distrito: 'Ate', Direccion: 'Av. Lima 123' } },
  reclamo: { who: 'Luis Gómez', cel: '987654321', correo: 'luis@correo.com', waMsg: 'Hola Luis, sobre tu hoja de reclamación.', lines: { 'N° de hoja': '20261118-154249', Fecha: '18/11/2026 15:42', Tipo: 'Reclamo', Documento: 'DNI 12345678', Nombre: 'Luis Gómez', Celular: '987654321', Correo: 'luis@correo.com', Domicilio: 'Av. Lima 123', 'Bien contratado': 'Producto', 'Monto reclamado': '150.50', Descripcion: 'Drill crudo', Detalle: 'La tela llegó con manchas en el borde del rollo.', 'Pedido del consumidor': 'Cambio del producto.' } },
};
SAMPLES.copia = { ...SAMPLES.reclamo, who: 'Luis' };

// ---------- app ----------
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (/^qr\./.test(host) && req.path === '/') return res.redirect(301, SITE + '/links/');                      // el enlace/QR viejo del Linktree
  if (/^(muestragratis|pruebagratis)\./.test(host)) return res.redirect(301, SITE + '/muestra-gratis/');   // el QR del camion sigue funcionando
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] === 'http') return res.redirect(301, 'https://' + host + req.originalUrl);
  res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'SAMEORIGIN' });
  next();
});

const hits = new Map();   // antispam: 6 envios por minuto por IP
setInterval(() => hits.clear(), 60000).unref();
app.post('/api/:form', express.urlencoded({ extended: false, limit: '30kb' }), async (req, res) => {
  const fn = forms[req.params.form];
  const json = String(req.headers.accept || '').includes('application/json');
  const fail0 = (m) => res.status(400).type('html').send(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="font-family:sans-serif;padding:40px;text-align:center"><h1>Revisa tus datos</h1><p>${String(m).replace(/</g, '&lt;')}</p><p><a href="javascript:history.back()">Volver al formulario</a></p>`);
  const fail = (m) => json ? res.status(400).json({ ok: false, error: String(m) }) : fail0(m);
  if (!fn) return res.status(404).end();
  const b = req.body || {};
  if (b.web) return json ? res.json({ ok: true, next: '/gracias/' }) : res.redirect(303, '/gracias/');                                                     // honeypot
  if ((hits.set(req.ip, (hits.get(req.ip) || 0) + 1), hits.get(req.ip)) > 6) return json ? res.status(429).json({ ok: false, error: 'Demasiados envíos. Espera un minuto.' }) : res.status(429).send('Demasiados envíos. Espera un minuto.');
  if (Date.now() / 1000 - (+b.t || 0) < 3) return fail('Envío demasiado rápido. Inténtalo de nuevo.');   // anti bot
  let r; try { r = fn(b); } catch (e) { if (e instanceof Bad) return fail(e.message); throw e; }
  const ok = await send(r);
  const next = r.next + (ok ? '' : (r.next.includes('?') ? '&' : '?') + 'm=0');
  json ? res.json({ ok: true, next, sent: ok }) : res.redirect(303, next);
});

if (process.env.NODE_ENV !== 'production') app.get('/__preview/:k', (req, res) => {
  const k = req.params.k, d = SAMPLES[k]; if (!d) return res.status(404).end();
  res.type('html').send(render(k, d.lines, d).html.replace('cid:nd-logo', '/__preview-logo.png'));
});
app.get('/__preview-logo.png', (req, res) => process.env.NODE_ENV === 'production' ? res.status(404).end() : res.sendFile(require('path').join(__dirname, 'lib', 'email-logo.png')));

app.use(express.static(PUBLIC, { extensions: ['html'], maxAge: '30d', setHeaders: (res, f) => { if (f.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache'); } }));
app.use((req, res) => res.status(404).sendFile(path.join(PUBLIC, '404.html')));
app.use((err, req, res, next) => { console.error(err); res.status(500).send('Error del servidor'); });

const PORT = process.env.PORT || 3000;
if (require.main === module) app.listen(PORT, () => console.log(`New Denim en http://localhost:${PORT}  (SMTP ${smtp ? 'activo' : 'NO configurado: solo logs'})`));
module.exports = app;
