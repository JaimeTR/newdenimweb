// Generador del sitio estatico:  node build.js   ->  escribe las paginas HTML (carpeta/index.html), sitemap.xml y robots.txt
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'public');
const V = (f) => require('crypto').createHash('md5').update(fs.readFileSync(path.join(OUT, 'assets', f))).digest('hex').slice(0, 8);   // version por contenido: cambia solo si cambia el archivo
const S = {
  url: 'https://newdenimtextil.com', muestra: '/muestra-gratis/',
  wa: '51981033383', tel1: '+51 981 033 383', tel1raw: '51981033383', tel2: '+51 946 340 287', tel2raw: '51946340287',
  mail1: 'info@newdenimtextil.com', mail2: 'soporte@newdenimtextil.com',
  addr: 'Jirón Luis Giribaldi 624 Tda 06, La Victoria, Lima, Perú', addrShort: 'Giribaldi 624 Tda 06, La Victoria, Lima',
  mapQ: 'New Denim - Distribuidor textil, Jr. Luis Giribaldi 624, La Victoria 15018, Lima, Perú',   // consulta que ubica el pin correcto en Google Maps
  tel2label: 'Asesor 2',
  ig: 'https://www.instagram.com/newdenim_textil/', tk: 'https://www.tiktok.com/@newdenim_textil',
  fb: '', li: '',   // pegar aqui las URLs reales de Facebook/LinkedIn para que aparezcan en el sitio
};
const wa = (msg) => `https://wa.me/${S.wa}?text=${encodeURIComponent(msg)}`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

// ---------- iconos ----------
const P = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  layers: '<path d="m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', gift: '<path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', send: '<path d="m22 2-7 20-4-9-9-4zM22 2 11 13"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  ruler: '<path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4zM7.5 10.5l2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2"/>',
  scale: '<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 7-10 16-10 0 9-4 16-10 16zM4 21c2-6 5-9 9-11"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  build: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  id: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5M13 14h5"/>',
  msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"/>',
  ig: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  fb: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  li: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
};
const ico = (n) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
const waI = '<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.8 9.8 0 0 0 12.04 2zm4.52 13.26c-.19.54-1.12 1.03-1.54 1.1-.4.06-.9.09-1.45-.09a13 13 0 0 1-5.4-3.4c-1.7-1.8-2.2-3.4-2.3-3.6-.1-.2-.5-1.2-.5-2.2s.5-1.5.7-1.7c.2-.2.4-.3.6-.3h.4c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.2.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.8-.1 1.4z"/></svg>';
const tkI = '<svg class="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.2a6.2 6.2 0 1 0 5.3 6.2V8.6a7.4 7.4 0 0 0 4.3 1.4V6.7a4.4 4.4 0 0 1-4.3-4.7z"/></svg>';

// ---------- datos ----------
const DENIM = [
  ['denim-rigido', 'Denim Rígido', 'Tela resistente y duradera, ideal para confeccionar prendas de uso diario con un acabado robusto.', '/denim-rigido/'],
  ['denim-essential', 'Denim Essential', 'Denim versátil y ligero, perfecto para todo tipo de prendas clásicas, desde jeans hasta chaquetas.'],
  ['comfort-stretch', 'Denim Comfort Stretch', 'Tela con elasticidad, ofreciendo mayor comodidad y libertad de movimiento en prendas ajustadas.'],
  ['satin-stretch', 'Denim Satin Stretch', 'Denim suave con un toque elástico y un acabado satinado, perfecto para crear prendas elegantes.'],
  ['premium-comfort', 'Denim Premium Comfort Stretch', 'Denim de alta calidad con elasticidad mejorada, con confort y un ajuste elástico.'],
  ['jogg', 'Jogg Denim', 'Denim suave y flexible, ideal para ropa deportiva o casual con un toque moderno y relajado.'],
  ['premium-power', 'Denim Premium Power Stretch', 'Tela stretch avanzado, ideal para prendas que requieren un ajuste preciso y máximo confort.'],
  ['black-denim', 'Black Denim', 'Denim negro de alta calidad, perfecto para prendas versátiles que combinan elegancia.'],
  ['essential-180', 'Denim Essential de 180 cm', 'Denim ideal para proyectos más grandes y para diseñadores que requieren mayor amplitud.'],
];
const CRUDOS = [
  ['corduroy', 'Corduroy', 'Tela con textura acanalada, perfecta para prendas cálidas y elegantes con un toque clásico.'],
  ['drill', 'Drill', 'Tela resistente y versátil, ideal para ropa de trabajo, uniformes y proyectos funcionales.'],
  ['crudo-satin-stretch', 'Satin Stretch', 'Tela suave con elasticidad y un acabado brillante, ideal para prendas cómodas y modernas.'],
  ['paper-touch', 'Paper Touch', 'Tela ligera con una textura única, perfecta para diseños frescos y contemporáneos.'],
  ['denim-liviano', 'Denim Liviano', 'Denim en su estado más ligero, ideal para prendas cómodas y de uso diario.'],
  ['bull-denim', 'Bull Denim', 'Tela robusta y duradera, perfecta para proyectos que requieren resistencia y estilo.'],
];
const FAQ = [
  ['¿Qué tipos de telas ofrecen en la línea Denim?', 'Ofrecemos una variedad de productos dentro de la línea Denim, incluyendo <b>Denim Rígido</b>, <b>Denim Comfort Stretch</b>, <b>Denim Premium Stretch</b> y más. Cada una con características únicas adaptadas a diferentes necesidades de diseño.'],
  ['¿Cuál es la diferencia entre Denim y Crudos?', 'El Denim es una tela de algodón resistente, mientras que los Crudos incluyen opciones como <b>Drill</b> y <b>Bull Denim</b>, que ofrecen un acabado sin teñir, más natural y versátil para diferentes tipos de prendas.'],
  ['¿Cómo puedo realizar un pedido?', `Puedes contactarnos directamente por WhatsApp, a través de la sección de <a href="/contacto/">Contacto</a> o enviando un correo a <a href="mailto:${S.mail2}">${S.mail2}</a>. Estaremos encantados de ayudarte con el proceso de compra.`],
  ['¿Puedo solicitar muestras de tela?', `Sí, ofrecemos muestras para que puedas evaluar la calidad de nuestras telas antes de realizar un pedido mayor. Puedes pedirlas directamente en <a href="${S.muestra}">nuestra página de muestra gratis</a> (hasta 1.5 metros).`],
  ['¿En qué cantidades puedo comprar las telas?', 'Ofrecemos venta al por mayor y en distintas cantidades, adaptándonos a las necesidades de tu proyecto. Contáctanos para obtener más detalles.'],
  ['¿Realizan envíos a todo el Perú?', 'Sí, realizamos envíos a todo el país. Los costos y tiempos de envío varían dependiendo de la ubicación.'],
];
const NAV = [['/', 'Inicio'], ['/nosotros/', 'Nosotros'], ['/linea-de-productos/', 'Línea de productos'], ['/contacto/', 'Contacto']];
const img = (n, alt, extra = '') => `<img src="/assets/img/${n}.webp" alt="${esc(alt)}" loading="lazy" decoding="async" ${extra}>`;

// ---------- layout ----------
function layout({ file, title, desc, body, hero = '', og = 'og.jpg', noindex = false, schema = '', nav = '', script = '' }) {
  const url = S.url + (file === '' ? '/' : '/' + file + '/');
  const cur = nav || (file === '' ? '/' : '/' + file + '/');
  const navHtml = NAV.map(([h, t]) => `<a href="${h}"${h === cur ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="es-PE">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:locale" content="es_PE"><meta property="og:site_name" content="New Denim">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${S.url}/assets/img/${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2C3442">
<link rel="icon" type="image/svg+xml" href="/assets/img/nd-gold.svg"><link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/styles.css?v=${V('css/styles.css')}">${schema}
</head>
<body>
<a class="skip" href="#main">Saltar al contenido</a>
<header class="site-head">
  <div class="wrap bar">
    <a class="brand" href="/" aria-label="New Denim - Inicio"><img src="/assets/img/nd-gold.svg" alt=""><span><b>New Denim</b><small>Distribuidor Textil</small></span></a>
    <nav class="mainnav" id="menu" aria-label="Principal">${navHtml}<a class="navcta" href="/muestra-gratis/"${cur.startsWith('/muestra-gratis') ? ' aria-current="page"' : ''}>Muestra gratis</a></nav>
    <button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu">${ico('menu')}</button>
  </div>
</header>
<main id="main">
${hero}${body}
</main>
<footer class="site-foot">
  <div class="wrap foot-grid">
    <div>
      <img class="foot-logo" src="/assets/img/logo-gold.svg" alt="New Denim Distribuidor Textil" width="104" height="100" loading="lazy">
      <p>Distribuidor de telas denim &amp; drill. Inspira, crea y transforma.</p>
      <div class="social">${social()}</div>
    </div>
    <div><h3>Sitio web</h3>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="${S.muestra}">Muestra gratis</a></div>
    <div><h3>Productos</h3><a href="/denim/">Línea Denim</a><a href="/crudos/">Línea Crudos</a><a href="/denim-rigido/">Denim Rígido</a></div>
    <div><h3>Contacto</h3>
      <a href="https://wa.me/${S.wa}" target="_blank" rel="noopener">${waI} ${S.tel1}</a>
      <a href="tel:+${S.tel2raw}">${ico('phone')} ${S.tel2}</a>
      <a href="mailto:${S.mail1}">${ico('mail')} ${S.mail1}</a>
      <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(S.mapQ)}" target="_blank" rel="noopener">${ico('pin')} ${S.addrShort}</a></div>
  </div>
  <div class="wrap copy"><span>&copy; ${new Date().getFullYear()} New Denim SAC. Todos los derechos reservados.</span>
    <span><a href="/libro-de-reclamaciones/">Libro de reclamaciones</a><a href="/terminos-y-condiciones/">Términos</a><a href="/politica-de-privacidad/">Privacidad</a><a href="/accesibilidad/">Accesibilidad</a></span></div>
</footer>
<div class="cw" id="cw">
  <div class="cw-back" id="cwBack"></div>
  <div class="cw-panel" id="cwPanel" role="dialog" aria-label="Contacto rápido" hidden>
    <div class="cw-head">
      <img src="/assets/img/nd-gold.svg" alt="" width="46" height="35">
      <div><b>New Denim</b><small><i></i> Asesores disponibles por WhatsApp</small></div>
      <button type="button" class="cw-x" id="cwX" aria-label="Cerrar"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
    </div>
    <div class="cw-body">
      <p class="cw-hi">Hola 👋 ¿En qué podemos ayudarte? Elige un asesor y te respondemos.</p>
      <a class="cw-row wa" href="${wa('Hola New Denim, deseo más información')}" target="_blank" rel="noopener"><i>${waI}</i><span><small>Asesor 1</small><b>${S.tel1}</b></span><em>Chatear</em></a>
      <a class="cw-row wa" href="https://wa.me/${S.tel2raw}?text=${encodeURIComponent('Hola New Denim, deseo más información')}" target="_blank" rel="noopener"><i>${waI}</i><span><small>Asesor 2</small><b>${S.tel2}</b></span><em>Chatear</em></a>
      <div class="cw-sep"><span>o prefieres llamar</span></div>
      <div class="cw-calls">
        <a href="tel:+${S.tel1raw}">${ico('phone')}<span>Asesor 1</span></a>
        <a href="tel:+${S.tel2raw}">${ico('phone')}<span>Asesor 2</span></a>
      </div>
    </div>
  </div>
  <div class="cw-hint" id="cwHint">¿Hablamos? <b>Escríbenos</b></div>
  <button type="button" class="cw-fab" id="cwBtn" aria-expanded="false" aria-controls="cwPanel" aria-label="Chat y llamadas"><span class="o">${waI}</span><span class="c"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></span></button>
</div>
<script src="/assets/js/main.js?v=${V('js/main.js')}" defer></script>${script}
</body>
</html>
`;
}
function social() {
  return [[S.ig, 'Instagram', ico('ig')], [S.tk, 'TikTok', tkI], [`https://wa.me/${S.wa}`, 'WhatsApp', waI], [S.fb, 'Facebook', ico('fb')], [S.li, 'LinkedIn', ico('li')]]
    .filter(([u]) => u).map(([u, n, i]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${n}">${i}</a>`).join('');
}
const pageHero = (kicker, h1, p, crumbs = []) => `<section class="page-hero"><div class="wrap">
  <div class="crumbs"><a href="/">Inicio</a>${crumbs.map(([h, t]) => `<span>/</span><a href="${h}">${t}</a>`).join('')}<span>/</span>${esc(kicker)}</div>
  <div class="kicker">${esc(kicker)}</div><h1>${h1}</h1><p>${p}</p></div></section>`;
const cta = (h, p, dark = false) => `<section class="cta${dark ? ' dark' : ''}"><div class="wrap reveal"><h2>${h}</h2><p>${p}</p>
  <div class="btns"><a class="btn ${dark ? '' : 'dark'}" href="${wa('Hola New Denim, quiero información sobre sus telas.')}" target="_blank" rel="noopener">${waI} Contactar por WhatsApp</a><a class="btn ghost" href="/contacto/">Escribirnos ${ico('arrow')}</a></div></div></section>`;
const provs = () => `<section class="section alt"><div class="wrap"><div class="sec-head reveal"><div class="kicker">Aliados</div><h2 class="sec-title">Nuestros <em>proveedores</em></h2>
  <p class="sec-sub">Trabajamos con los mejores proveedores para ofrecerte telas de calidad superior. Con aliados estratégicos como Nuevo Mundo, Colortex y nuestra importación propia, garantizamos productos que cumplen con los más altos estándares.</p></div>
  <div class="provs reveal"><img src="/assets/img/prov-nuevomundo.webp" alt="Nuevo Mundo" loading="lazy" height="56"><img src="/assets/img/prov-colortex.webp" alt="Colortex" loading="lazy" height="56"><span class="own"><img src="/assets/img/nd-slate.svg" alt="" height="44"> Importación propia</span></div></div></section>`;
const prodCards = (list, tag, prefix) => `<div class="prods">${list.map(([id, name, d, link], i) => `
  <article class="prod reveal" style="transition-delay:${(i % 3) * 80}ms"><div class="ph">${img(prefix + id, name)}<span class="tg">${tag}</span></div>
    <div class="bd"><h3>${name}</h3><p>${d}</p><div class="btns">${link ? `<a class="btn sm dark" href="${link}">Ver detalle</a>` : ''}<a class="btn sm" href="${wa('Hola New Denim, quiero cotizar: ' + name)}" target="_blank" rel="noopener">${waI} Cotizar</a></div></div></article>`).join('')}</div>`;

const pages = [];
const add = (p) => pages.push(p);

// ---------- INICIO ----------
add({
  file: '', title: 'New Denim | Distribuidor de telas Denim & Drill en Lima, Perú',
  desc: 'Distribuidor de telas denim y drill de alta calidad para diseñadores y confeccionistas. Venta mayorista, muestras gratis y envíos a todo el Perú. La Victoria, Lima.',
  schema: `\n<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'New Denim SAC', url: S.url, image: S.url + '/assets/img/og.jpg', telephone: '+' + S.tel1raw, email: S.mail1, address: { '@type': 'PostalAddress', streetAddress: 'Jirón Luis Giribaldi 624 Tda 06', addressLocality: 'La Victoria', addressRegion: 'Lima', addressCountry: 'PE' }, sameAs: [S.ig, S.tk], description: 'Distribuidor de telas denim y drill para diseñadores y confeccionistas.' })}</script>`,
  hero: `<section class="hero"><div class="wrap hero-grid">
  <div class="reveal in"><div class="kicker">Distribuidor de telas denim &amp; drill</div>
    <h1>Inspira, crea y <em>transforma</em></h1>
    <p class="lead">Telas denim y drill de alta calidad para diseñadores y confeccionistas. Crea, transforma e inspira con soluciones personalizadas que destacan en la moda peruana.</p>
    <div class="btns"><a class="btn dark" href="/linea-de-productos/">Ver productos ${ico('arrow')}</a><a class="btn ghost" href="${S.muestra}">${ico('gift')} Solicitar muestra gratis</a></div>
    <ul class="badges"><li>${ico('check')} Venta al por mayor</li><li>${ico('truck')} Envíos a todo el Perú</li><li>${ico('pin')} La Victoria, Lima</li></ul></div>
  <div class="hero-photo reveal in">${img('hero-chaqueta', 'Modelo con chaqueta y jean de tela denim New Denim').replace('loading="lazy"', 'fetchpriority="high"')}<div class="tag"><b>Muestra gratis</b>de hasta 1.5 metros</div></div>
</div></section>`,
  body: `
<section class="section"><div class="wrap"><div class="sec-head reveal"><div class="kicker">¿Por qué New Denim?</div><h2 class="sec-title">Telas que dan vida a tus <em>ideas</em></h2>
  <p class="sec-sub">Entendemos que cada cliente tiene una visión única de la moda. Por eso te acompañamos en cada etapa de tu proyecto.</p></div>
  <div class="feats">
    <div class="feat reveal"><i>${ico('shield')}</i><b>Calidad superior</b><p>Telas de primera calidad, resistentes y versátiles, de proveedores de confianza.</p></div>
    <div class="feat reveal" style="transition-delay:80ms"><i>${ico('layers')}</i><b>Amplia variedad</b><p>Denim rígido, stretch, premium, drill, bull denim, corduroy y más.</p></div>
    <div class="feat reveal" style="transition-delay:160ms"><i>${ico('users')}</i><b>Atención personalizada</b><p>Trabajamos mano a mano con diseñadores y confeccionistas.</p></div>
    <div class="feat reveal" style="transition-delay:240ms"><i>${ico('truck')}</i><b>Envíos a todo el Perú</b><p>Venta mayorista y en distintas cantidades, con entrega a nivel nacional.</p></div>
  </div></div></section>

<section class="section alt"><div class="wrap"><div class="sec-head reveal"><div class="kicker">Línea de productos</div><h2 class="sec-title">Explora nuestras <em>categorías</em></h2>
  <p class="sec-sub">Encuentra en cada categoría la materia prima ideal para confeccionar piezas únicas.</p></div>
  <div class="cats">
    <a class="cat reveal" href="/denim/">${img('cat-denim', 'Línea Denim')}<div class="cat-body"><h3>Línea <em>Denim</em></h3><p>Resistencia, estilo y versatilidad en cada fibra. Desde opciones rígidas hasta tejidos premium con stretch.</p>
      <div class="chips"><span>Denim Rígido</span><span>Confort Stretch</span><span>Stretch</span><span>Super Stretch</span></div><span class="more">Ver denim ${ico('arrow')}</span></div></a>
    <a class="cat reveal" style="transition-delay:100ms" href="/crudos/">${img('cat-crudos', 'Línea Crudos')}<div class="cat-body"><h3>Línea <em>Crudos</em></h3><p>La base de tus ideas. Durabilidad, suavidad y elegancia en cada hilo, de lo clásico a lo innovador.</p>
      <div class="chips"><span>Bull Denim</span><span>Drill</span><span>Denim Stretch</span></div><span class="more">Ver crudos ${ico('arrow')}</span></div></a>
  </div></div></section>

<section class="cta"><div class="wrap reveal"><h2>Transforma tus ideas en <em>realidad</em></h2><p>Descubre nuestras telas de alta calidad diseñadas para confeccionar piezas únicas y destacar en el mundo de la moda. Tu próxima creación comienza aquí.</p>
  <div class="btns"><a class="btn dark" href="${wa('Hola New Denim, quiero información sobre sus telas.')}" target="_blank" rel="noopener">${waI} Contáctanos ahora</a><a class="btn ghost" href="${S.muestra}">Pedir muestra gratis ${ico('arrow')}</a></div></div></section>

<section class="section"><div class="wrap split"><div class="reveal"><div class="kicker">Sobre nosotros</div><h2 class="sec-title">Una empresa joven enfocada en <em>tu éxito</em></h2>
  <p>En <b>New Denim SAC</b> entendemos que cada cliente tiene una visión única de la moda. Por eso te ofrecemos un servicio personalizado y una gama de telas denim &amp; drill para que puedas dar vida a tus ideas más creativas.</p>
  <p>Nuestra empresa joven y dinámica está completamente enfocada en tu éxito. Trabajamos mano a mano contigo para ofrecerte soluciones personalizadas y llevar tus ideas a la realidad, destacando en la industria textil peruana.</p>
  <a class="btn dark" href="/nosotros/">Más información ${ico('arrow')}</a></div>
  <div class="reveal">${img('showroom', 'Showroom de New Denim en La Victoria, Lima')}</div></div></section>
${provs()}`,
});

// ---------- NOSOTROS ----------
add({
  file: 'nosotros', title: 'Nosotros | New Denim - Distribuidor de telas denim en Lima',
  desc: 'Conoce a New Denim SAC: un equipo apasionado por ofrecer telas de alta calidad, inspirando a diseñadores y confeccionistas de la moda peruana.',
  hero: pageHero('Nosotros', 'Conoce a <em>New Denim</em>', 'Un equipo apasionado por ofrecer telas de alta calidad, inspirando a diseñadores y confeccionistas a crear.'),
  body: `
<section class="section"><div class="wrap split"><div class="reveal">${img('hero-reja', 'Modelo con camisa denim New Denim')}</div>
  <div class="reveal"><div class="kicker">¿Quiénes somos?</div><h2 class="sec-title">Telas que inspiran y <em>transforman</em></h2>
  <p>En <b>New Denim SAC</b> nos dedicamos a ofrecer telas de la más alta calidad, diseñadas para inspirar y transformar tus ideas en creaciones únicas. Como empresa dinámica y comprometida con la innovación, trabajamos de la mano con diseñadores y confeccionistas para brindar soluciones personalizadas que destaquen en la industria textil.</p>
  <p>Nuestra misión es ser un referente en la moda peruana, promoviendo colecciones sostenibles y creativas.</p>
  <a class="btn dark" href="/contacto/">Contactar ${ico('arrow')}</a></div></div></section>

<section class="section alt"><div class="wrap"><div class="sec-head reveal"><div class="kicker">Nuestro propósito</div><h2 class="sec-title">Misión y <em>visión</em></h2></div>
  <div class="mv">
    <article class="reveal"><div class="num">01.</div><h3>Misión</h3><p>En New Denim, nuestra misión es proporcionar telas de alta calidad y sostenibles, diseñadas para inspirar la creatividad de diseñadores y marcas de moda. Nos comprometemos a acompañar a nuestros clientes en cada etapa de su proyecto, ayudándolos a transformar sus ideas en prendas únicas y exitosas.</p></article>
    <article class="d reveal" style="transition-delay:100ms"><div class="num">02.</div><h3>Visión</h3><p>Aspiramos a ser el aliado estratégico líder en la industria textil peruana, reconocido por fomentar la innovación, la sostenibilidad y la excelencia. Nuestro objetivo es empoderar a diseñadores y marcas con las mejores herramientas para crear colecciones que marquen tendencia y promuevan una moda.</p></article>
  </div></div></section>

<section class="section"><div class="wrap split rev"><div class="reveal"><div class="kicker">Nuestros valores</div><h2 class="sec-title">Lo que nos <em>define</em></h2>
  <ul class="ticks"><li>${ico('check')}<span><b>Calidad:</b> telas de primera calidad en cada metro.</span></li><li>${ico('check')}<span><b>Innovación:</b> variedad y novedades para colecciones que marcan tendencia.</span></li><li>${ico('check')}<span><b>Sostenibilidad:</b> promovemos colecciones sostenibles y creativas.</span></li><li>${ico('check')}<span><b>Acompañamiento:</b> te acompañamos en cada etapa de tu proyecto.</span></li></ul>
  <a class="btn dark" href="/linea-de-productos/">Ver productos ${ico('arrow')}</a></div><div class="reveal">${img('moda-calle', 'Moda en denim con telas New Denim')}</div></div></section>
${provs()}
${cta('Transforma tus ideas en <em>realidad</em>', 'Descubre nuestras telas de alta calidad diseñadas para confeccionar piezas únicas. Tu próxima creación comienza aquí.')}`,
});

// ---------- LINEA DE PRODUCTOS ----------
add({
  file: 'linea-de-productos', title: 'Línea de productos | Telas Denim y Crudos - New Denim',
  desc: 'Telas denim y crudos de alta calidad, resistencia y versatilidad: denim rígido, stretch, premium, drill, bull denim y más. Venta mayorista en Lima.',
  hero: pageHero('Línea de productos', 'Denim y <em>Crudos</em>', 'Dos categorías clave que ofrecen telas de alta calidad, resistencia y versatilidad para tus proyectos.'),
  body: `
<section class="section"><div class="wrap"><div class="cats">
  <a class="cat reveal" href="/denim/">${img('cat-denim', 'Línea Denim')}<div class="cat-body"><h3>Línea <em>Denim</em></h3><p>Una amplia variedad de telas diseñadas para adaptarse a tus necesidades creativas y técnicas. Desde opciones rígidas hasta tejidos premium con stretch.</p>
    <div class="chips"><span>Denim Rígido</span><span>Confort Stretch</span><span>Stretch</span><span>Super Stretch</span></div><span class="more">Ver denim ${ico('arrow')}</span></div></a>
  <a class="cat reveal" style="transition-delay:100ms" href="/crudos/">${img('cat-crudos', 'Línea Crudos')}<div class="cat-body"><h3>Línea <em>Crudos</em></h3><p>Telas crudas versátiles y de alta calidad para proyectos que exigen resistencia, estilo y funcionalidad. Desde materiales clásicos hasta innovadores.</p>
    <div class="chips"><span>Bull Denim</span><span>Drill</span><span>Denim Stretch</span></div><span class="more">Ver crudos ${ico('arrow')}</span></div></a>
</div></div></section>
${cta('¿Listo para <em>empezar</em>?', 'Descubre nuestra variedad de telas Denim y Crudos, perfectas para tus proyectos más exigentes. Contáctanos para encontrar la tela ideal para tu colección.', true)}
${provs()}`,
});

// ---------- DENIM ----------
add({
  file: 'denim', nav: '/linea-de-productos/', title: 'Línea Denim | Denim rígido, stretch y premium - New Denim',
  desc: 'Telas denim de alta calidad: rígido, essential, comfort stretch, satin stretch, premium, jogg denim y black denim. Cotiza por WhatsApp.',
  hero: pageHero('Línea Denim', 'Nuestra línea de <em>Denim</em>', 'Telas de alta calidad diseñadas para proporcionar resistencia, comodidad y estilo en cada prenda. Ideal para crear desde básicos hasta colecciones de alta moda.', [['/linea-de-productos/', 'Productos']]),
  body: `<section class="section"><div class="wrap"><div class="sec-head reveal"><h2 class="sec-title">Nuestra variedad de <em>Denim</em></h2></div>${prodCards(DENIM, 'Denim', 'p-')}</div></section>
${cta('Descubre nuestra línea de <em>Denim</em>', 'Encuentra la tela ideal para cada proyecto y contacta con nosotros para más detalles.')}`,
});

// ---------- CRUDOS ----------
add({
  file: 'crudos', nav: '/linea-de-productos/', title: 'Línea Crudos | Drill, Bull Denim, Corduroy - New Denim',
  desc: 'Telas crudas versátiles y naturales: drill, bull denim, corduroy, satin stretch, paper touch y denim liviano. Venta mayorista en Lima.',
  hero: pageHero('Línea Crudos', 'Nuestra línea de <em>Crudos</em>', 'Telas versátiles y naturales, como Drill, Bull Denim y Corduroy, perfectas para proyectos que destacan por su autenticidad y estilo.', [['/linea-de-productos/', 'Productos']]),
  body: `<section class="section"><div class="wrap"><div class="sec-head reveal"><h2 class="sec-title">Nuestra variedad de <em>Crudos</em></h2></div>${prodCards(CRUDOS, 'Crudos', 'p-')}</div></section>
<section class="section alt"><div class="wrap split"><div class="reveal">${img('crudos-otono', 'Prendas confeccionadas con telas crudas')}</div><div class="reveal"><div class="kicker">Versatilidad</div><h2 class="sec-title">Descubre la versatilidad de nuestros <em>Crudos</em></h2>
  <p>Explora nuestra línea de telas Crudos, ideales para proyectos que requieren naturalidad y estilo. Contáctanos para más detalles y encuentra la opción perfecta para tus creaciones.</p><a class="btn dark" href="/contacto/">Contáctanos ${ico('arrow')}</a></div></div></section>`,
});

// ---------- DENIM RIGIDO ----------
const ficha = (code, name, img_, w, oz, txt, pdf) => `<article class="ficha reveal">${img(img_, name)}<div class="bd"><div class="code">${code}</div><h2>${name}</h2>
  <ul class="specs"><li>${ico('leaf')} 100% Algodón</li><li>${ico('ruler')} Ancho ${w}</li><li>${ico('scale')} ${oz}</li></ul><p>${txt}</p>
  <div class="btns"><a class="btn dark" href="/assets/catalogos/${pdf}" target="_blank" rel="noopener">${ico('file')} Ver catálogo (PDF)</a><a class="btn" href="${wa('Hola New Denim, quiero cotizar el ' + name + ' ' + code)}" target="_blank" rel="noopener">${waI} Cotizar</a></div></div></article>`;
add({
  file: 'denim-rigido', nav: '/linea-de-productos/', title: 'Denim Rígido | Denim Rockero y Denim Lucas - New Denim',
  desc: 'Denim rígido 100% algodón: Denim Rockero 71118 (10.50 oz) y Denim Lucas 71119 (12 oz). Resistencia y estilo en cada prenda. Catálogos y cotización.',
  hero: pageHero('Denim Rígido', 'Resistencia y estilo en cada <em>prenda</em>', 'El Denim Rígido es la opción perfecta para quienes buscan una estructura firme y duradera, ideal para prendas de alta calidad que resistan el paso del tiempo.', [['/linea-de-productos/', 'Productos'], ['/denim/', 'Denim']]),
  body: `<section class="section"><div class="wrap"><div class="fichas">
${ficha('71118', 'Denim Rockero', 'ficha-rockero', '1.72 m', '10.50 oz', 'Un satín mejorado con acabado espectacular. Es ideal para confeccionistas que requieren más rendimiento metro a metro de tela. Dirigido a todo tipo de prendas de dama y caballero.', 'CATALOGO-71118-DENIM-ROCKERO-2022.pdf')}
${ficha('71119', 'Denim Lucas', 'ficha-lucas', '1.70 m', '12 oz', 'Tela con hilo en urdiembre y trama color negro, ideal para todo tipo de lavados y crear el efecto destroyer. Nuestra tela le dará a tus prendas caída y comfort perfectos.', 'CATALOGO-71119-DENIM-LUCAS-2022.pdf')}
</div></div></section>
<section class="section alt"><div class="wrap split"><div class="reveal"><div class="kicker">Denim Rígido</div><h2 class="sec-title">Una tela de alta durabilidad y <em>resistencia</em></h2>
  <p>Perfecta para prendas que requieren estructura. Ideal para jeans, chaquetas y proyectos de moda que exigen calidad y estilo atemporal.</p><a class="btn dark" href="/contacto/">Contáctanos para más detalles ${ico('arrow')}</a></div><div class="reveal">${img('look-gris', 'Chaqueta de denim rígido')}</div></div></section>`,
});

// ---------- CONTACTO ----------
const ICON = { nombre: 'user', empresa: 'build', correo: 'mail', celular: 'phone', mensaje: 'msg', tipo_doc: 'id', doc: 'id', domicilio: 'pin', bien: 'layers', monto: 'coin', descripcion: 'layers', tipo: 'msg', detalle: 'msg', pedido: 'check' };
const FMT = { nombre: 'name', empresa: 'biz', domicilio: 'addr', correo: 'mail', monto: 'money', doc: 'num', celular: 'cel' };
const field = (label, name, o = {}) => {
  const ic = ico(ICON[name] || 'msg'), fmt = FMT[name] || o.fmt, at = `name="${name}"${fmt ? ` data-fmt="${fmt}"` : ''}${fmt === 'num' || fmt === 'cel' || fmt === 'money' ? ' inputmode="numeric"' : ''}${o.max ? ` maxlength="${o.max}"` : ''}${o.ph ? ` placeholder="${o.ph}"` : ''}${o.auto ? ` autocomplete="${o.auto}"` : ''}${o.v ? ` data-v="${o.v}"` : ''}`;
  const ctl = o.tag === 'textarea' ? `<span class="in ta">${ic}<textarea ${at} rows="${o.rows || 5}" maxlength="${o.max || 1500}"></textarea></span>`
    : o.tag === 'select' ? `<span class="in">${ic}<select name="${name}">${o.opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select></span>`
    : `<span class="in">${ic}<input type="${o.type || 'text'}" ${at}></span>`;
  return `<label class="f${o.full ? ' full' : ''}">${label}${ctl}</label>`;
};
const hid = (form) => `<input type="hidden" name="form" value="${form}"><input type="hidden" name="t" value=""><input type="text" name="web" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">`;
add({
  file: 'contacto', title: 'Contacto | New Denim - Telas Denim y Drill en La Victoria, Lima',
  desc: 'Contáctanos: Jirón Luis Giribaldi 624 Tda 06, La Victoria, Lima. WhatsApp +51 981 033 383. Cotiza telas denim y crudos al por mayor.',
  hero: pageHero('Contacto', 'Estamos aquí para <em>ayudarte</em>', 'Si tienes preguntas o necesitas más información sobre nuestros productos, ponte en contacto con nuestro equipo por nuestros canales de atención.'),
  body: `<section class="section"><div class="wrap contact">
  <div class="cinfo reveal">
    <div class="cbox"><i>${ico('pin')}</i><div><b>Nuestra dirección</b><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(S.mapQ)}" target="_blank" rel="noopener">${S.addr}</a></div></div>
    <div class="cbox"><i>${ico('phone')}</i><div><b>Número de contacto</b><a href="tel:+${S.tel1raw}">${S.tel1}</a><a href="tel:+${S.tel2raw}">${S.tel2}</a></div></div>
    <div class="cbox"><i>${ico('mail')}</i><div><b>Correos</b><a href="mailto:${S.mail1}">${S.mail1}</a><a href="mailto:${S.mail2}">${S.mail2}</a></div></div>
    <div class="btns"><a class="btn wa" href="${wa('Hola New Denim, quiero información sobre sus telas.')}" target="_blank" rel="noopener">${waI} Escribir por WhatsApp</a></div>
    <div class="social">${social()}</div>
    <iframe class="map" title="Ubicación de New Denim en Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(S.mapQ)}&t=m&z=16&output=embed"></iframe>
  </div>
  <div class="card reveal" style="transition-delay:100ms"><h2>Formulario de contacto</h2><p>Envíanos tu mensaje y te responderemos pronto.</p>
    <form method="post" action="/api/contacto" data-form novalidate>${hid('contacto')}<div class="grid">
      ${field('Nombre y apellidos *', 'nombre', { max: 80, auto: 'name', v: 'nombre' })}${field('Empresa <small>(opcional)</small>', 'empresa', { max: 100, auto: 'organization', v: 'empresa' })}
      ${field('Correo electrónico *', 'correo', { type: 'email', max: 100, auto: 'email', v: 'correo' })}${field('Celular / WhatsApp *', 'celular', { type: 'tel', fmt: 'cel', max: 18, ph: '9XX XXX XXX', auto: 'tel', v: 'celular' })}
      ${field('¿Cómo podemos ayudarle? *', 'mensaje', { tag: 'textarea', full: true, v: 'texto', ph: 'Cuéntanos qué tela buscas, cantidad aproximada y para qué prenda.' })}</div>
      <button class="btn dark" type="submit" style="margin-top:20px">${ico('send')} Enviar mensaje</button>
      <p class="terms"><b>Términos y condiciones:</b> el primer servicio es gratuito, pero los adicionales tienen un costo. Se dispone de 30 días para completar el desarrollo; de no cumplirse este plazo, se deberá realizar una devolución o pagar el valor del corte.</p></form></div>
</div></section>
<section class="section alt"><div class="wrap"><div class="sec-head reveal"><div class="kicker">Ayuda</div><h2 class="sec-title">Preguntas <em>frecuentes</em></h2><p class="sec-sub">Aquí encontrarás respuestas a las preguntas más comunes sobre nuestros productos y servicios.</p></div>
  <div class="faq reveal">${FAQ.map(([q, a]) => `<details><summary>${q}</summary><div class="ans"><p>${a}</p></div></details>`).join('')}</div></div></section>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) })}</script>`,
});

// ---------- LIBRO DE RECLAMACIONES ----------
add({
  file: 'libro-de-reclamaciones', title: 'Libro de reclamaciones | New Denim SAC',
  desc: 'Libro de reclamaciones virtual de New Denim SAC conforme al Código de Protección y Defensa del Consumidor.',
  hero: pageHero('Libro de reclamaciones', 'Libro de <em>reclamaciones</em>', 'Conforme al Código de Protección y Defensa del Consumidor, ponemos a tu disposición nuestro libro de reclamaciones virtual.'),
  body: `<section class="section"><div class="wrap narrow"><div class="card reveal in">
  <div class="notice"><b>New Denim SAC</b> · ${S.addr}. Recibirás una copia de la hoja en tu correo (si lo indicas) y te responderemos dentro del plazo legal.</div>
  <form method="post" action="/api/reclamo" data-form novalidate>${hid('reclamo')}
  <fieldset><legend><span>1</span> Identificación del consumidor</legend><div class="grid">
    ${field('Nombre completo *', 'nombre', { max: 80, auto: 'name', v: 'nombre' })}
    ${field('Tipo de documento', 'tipo_doc', { tag: 'select', opts: [['DNI', 'DNI'], ['CE', 'Carné de extranjería'], ['RUC', 'RUC'], ['Pasaporte', 'Pasaporte']] })}
    ${field('N° de documento *', 'doc', { fmt: 'num', max: 12, v: 'doc' })}${field('Celular *', 'celular', { type: 'tel', fmt: 'cel', max: 18, ph: '9XX XXX XXX', auto: 'tel', v: 'celular' })}
    ${field('Correo electrónico <small>(opcional, para recibir copia)</small>', 'correo', { type: 'email', max: 100, auto: 'email', v: 'correo_op' })}${field('Domicilio *', 'domicilio', { max: 120, auto: 'street-address', v: 'domicilio' })}</div></fieldset>
  <fieldset><legend><span>2</span> Identificación del bien contratado</legend><div class="grid">
    ${field('Bien contratado', 'bien', { tag: 'select', opts: [['producto', 'Producto'], ['servicio', 'Servicio']] })}${field('Monto reclamado (S/) <small>(opcional)</small>', 'monto', { max: 10, v: 'monto', ph: '0.00' })}
    ${field('Descripción del producto o servicio <small>(opcional)</small>', 'descripcion', { max: 300, full: true })}</div></fieldset>
  <fieldset><legend><span>3</span> Detalle del reclamo o queja</legend><div class="grid">
    ${field('Tipo', 'tipo', { tag: 'select', opts: [['reclamo', 'Reclamo (disconformidad con el producto o servicio)'], ['queja', 'Queja (malestar con la atención, sin relación al producto)']], full: true })}
    ${field('Detalle *', 'detalle', { tag: 'textarea', full: true, v: 'texto', ph: 'Describe lo ocurrido.' })}${field('Pedido del consumidor *', 'pedido', { tag: 'textarea', rows: 3, max: 800, full: true, v: 'texto', ph: '¿Qué solución esperas?' })}</div></fieldset>
  <label class="chk"><input type="checkbox" data-v="req"> <span>Declaro que los datos son ciertos y acepto el tratamiento de mis datos personales según la <a href="/politica-de-privacidad/">política de privacidad</a>.</span></label>
  <button class="btn dark" type="submit" style="margin-top:22px">${ico('send')} Enviar hoja de reclamación</button>
  <p class="terms">La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI. El proveedor debe dar respuesta en un plazo no mayor a 15 días hábiles.</p></form></div></div></section>`,
});

// ---------- LEGALES ----------
const legal = (file, title, desc, h1, p, html) => add({ file, title, desc, hero: pageHero(h1, h1.replace(/(\S+)$/, '<em>$1</em>'), p), body: `<section class="section"><div class="wrap narrow"><div class="legal reveal in">${html}</div></div></section>` });
legal('terminos-y-condiciones', 'Términos y condiciones | New Denim', 'Términos y condiciones de uso del sitio web y de los servicios de New Denim SAC.', 'Términos y condiciones', 'Condiciones de uso del sitio web y de nuestros servicios.', `
<h2>1. Información general</h2><p>Este sitio web pertenece a <b>New Denim SAC</b> (en adelante, "New Denim"), con domicilio en ${S.addr}. Al navegar por el sitio aceptas estos términos.</p>
<h2>2. Productos e información</h2><p>La información, imágenes y descripciones de telas son referenciales. Las características finales (color, ancho, peso, lote) se confirman al momento de la cotización o pedido. Los precios y la disponibilidad se informan por los canales de contacto.</p>
<h2>3. Pedidos, muestras y servicios</h2><p>Los pedidos se coordinan con nuestro equipo por WhatsApp, teléfono o correo. El primer servicio es gratuito, pero los adicionales tienen un costo. Se dispone de 30 días para completar el desarrollo; de no cumplirse este plazo, se deberá realizar una devolución o pagar el valor del corte. Las muestras gratuitas son de hasta 1.5 metros; una cantidad mayor tiene costo.</p>
<h2>4. Envíos</h2><p>Realizamos envíos a todo el Perú. Los costos y tiempos dependen de la ubicación y se informan antes de confirmar el pedido.</p>
<h2>5. Propiedad intelectual</h2><p>Los logotipos, textos e imágenes del sitio pertenecen a New Denim o a sus titulares y no pueden usarse sin autorización.</p>
<h2>6. Reclamos</h2><p>Puedes presentar un reclamo o queja en nuestro <a href="/libro-de-reclamaciones/">Libro de reclamaciones</a>.</p>
<h2>7. Contacto</h2><p>Escríbenos a <a href="mailto:${S.mail1}">${S.mail1}</a> o por WhatsApp al ${S.tel1}.</p>`);
legal('politica-de-privacidad', 'Política de privacidad | New Denim', 'Cómo New Denim SAC trata y protege tus datos personales conforme a la Ley N.° 29733.', 'Política de privacidad', 'Cómo tratamos y protegemos tus datos personales.', `
<h2>1. Responsable</h2><p><b>New Denim SAC</b>, ${S.addr}. Contacto: <a href="mailto:${S.mail1}">${S.mail1}</a>.</p>
<h2>2. Datos que recopilamos</h2><p>Los que nos envías voluntariamente en los formularios de contacto, solicitud de muestra y libro de reclamaciones: nombre, empresa, documento de identidad (solo en reclamaciones), celular, correo, dirección y el contenido de tu mensaje.</p>
<h2>3. Finalidad</h2><p>Atender tus consultas, cotizaciones, muestras y reclamos, y coordinar la entrega. No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>
<h2>4. Conservación y seguridad</h2><p>Conservamos los datos el tiempo necesario para cumplir la finalidad y las obligaciones legales, aplicando medidas de seguridad razonables.</p>
<h2>5. Tus derechos</h2><p>Conforme a la Ley N.° 29733, Ley de Protección de Datos Personales, puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición escribiéndonos a <a href="mailto:${S.mail1}">${S.mail1}</a>.</p>
<h2>6. Servicios de terceros</h2><p>Este sitio usa Google Fonts y Google Maps, que pueden tratar datos técnicos de tu navegación según sus propias políticas.</p>`);
legal('accesibilidad', 'Accesibilidad | New Denim', 'Compromiso de accesibilidad del sitio web de New Denim.', 'Accesibilidad', 'Nuestro compromiso con un sitio web usable para todas las personas.', `
<h2>Nuestro compromiso</h2><p>New Denim trabaja para que su sitio web sea accesible y fácil de usar, con textos legibles, contraste suficiente, navegación por teclado, enlace para saltar al contenido, imágenes con texto alternativo y diseño adaptable a móvil.</p>
<h2>¿Encontraste una barrera?</h2><p>Si tienes dificultades para usar alguna parte del sitio, cuéntanos en <a href="mailto:${S.mail1}">${S.mail1}</a> o por WhatsApp al ${S.tel1} y la corregiremos.</p>`);

// ---------- GRACIAS y 404 ----------
add({
  file: 'gracias', title: 'Gracias | New Denim', desc: 'Recibimos tu mensaje.', noindex: true, nav: '/contacto/',
  body: `<section class="section"><div class="wrap narrow"><div class="card center-card reveal in" style="text-align:center;padding:56px 28px">
  <div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
  <h1 style="font-size:clamp(1.8rem,5vw,2.5rem);margin-bottom:10px"><span id="gt">¡Gracias por escribirnos!</span></h1>
  <p id="gp" style="color:var(--soft);margin:0 0 8px">Recibimos tu mensaje y te responderemos pronto por WhatsApp, teléfono o correo.</p>
  <p id="gn" style="font-weight:700;margin:0 0 8px" hidden></p><p id="gm" class="alert" style="max-width:480px;margin:14px auto" hidden>No pudimos enviar el aviso por correo automático. Escríbenos también por WhatsApp para atenderte de inmediato.</p>
  <div class="btns" style="justify-content:center;margin-top:24px"><a class="btn wa" href="${wa('Hola New Denim, acabo de enviar un mensaje desde la web.')}" target="_blank" rel="noopener">${waI} Escribir por WhatsApp</a><a class="btn ghost" href="/">Volver al inicio</a></div></div></div></section>
<script>(function(){var q=new URLSearchParams(location.search),$=function(i){return document.getElementById(i)};if(q.get('f')==='reclamo'){$('gt').textContent='Recibimos tu reclamación';$('gp').textContent='Te responderemos dentro del plazo legal. Si indicaste un correo, enviamos una copia de tu hoja.';var n=(q.get('n')||'').replace(/[^0-9-]/g,'');if(n){$('gn').textContent='N° de hoja: '+n;$('gn').hidden=false}}if(q.get('m')==='0')$('gm').hidden=false})()</script>`,
});
add({
  file: '404', title: 'Página no encontrada | New Denim', desc: 'La página que buscas no existe.', noindex: true, outFile: '404.html',
  body: `<section class="section"><div class="wrap center" style="text-align:center"><div class="big">404</div><h1 style="font-size:clamp(1.8rem,4vw,2.6rem)">Esta tela no está en <em>nuestro catálogo</em></h1>
  <p style="color:var(--soft);margin:0 0 26px">La página que buscas no existe o cambió de lugar.</p><div class="btns" style="justify-content:center"><a class="btn dark" href="/">Ir al inicio</a><a class="btn ghost" href="/linea-de-productos/">Ver productos</a></div></div></section>`,
});

require('./tools/muestra-pages.js')({ S, ico, waI, wa, add, V });
require('./tools/links-page.js')({ S, ico, waI, tkI, wa, V, esc, fs, path, OUT });

// ---------- escribir ----------
for (const p of pages) {
  const dest = p.outFile ? path.join(OUT, p.outFile) : path.join(OUT, p.file, 'index.html');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, layout(p));
}
const urls = pages.filter((p) => !p.noindex).map((p) => (p.file === '' ? '/' : '/' + p.file + '/')).concat('/links/');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${S.url}${u}</loc><changefreq>monthly</changefreq><priority>${u === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /data/\nSitemap: ${S.url}/sitemap.xml\n`);
console.log(pages.length + ' paginas generadas');
