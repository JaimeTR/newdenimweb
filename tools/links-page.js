// Pagina /links/ (estilo Linktree) para perfiles de redes sociales. La llama build.js.
module.exports = ({ S, ico, waI, tkI, wa, V, esc, fs, path, OUT }) => {
  const globe = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
  const share = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>';
  const qr = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v.01M14 20v.01M17 20h3v-3"/></svg>';
  const card = (href, icon, title, desc, cls = '', ext = true) => `<a class="lk ${cls}" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}><i>${icon}</i><span><b>${title}</b><small>${desc}</small></span>${ico('arrow')}</a>`;
  const circles = [[S.ig, 'Instagram', ico('ig')], [S.tk, 'TikTok', tkI], [`https://wa.me/${S.wa}`, 'WhatsApp', waI], [S.fb, 'Facebook', ico('fb')], [S.li, 'LinkedIn', ico('li')]]
    .filter(([u]) => u).map(([u, n, i]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${n}" title="${n}">${i}</a>`).join('');
  const url = S.url + '/links/';
  const title = 'New Denim | Distribuidor Textil - Enlaces oficiales';
  const desc = 'Todos los canales de New Denim: WhatsApp, muestra gratis, catálogo, productos, ubicación y redes sociales. Telas denim y drill por mayor y menor.';
  const html = `<!DOCTYPE html>
<html lang="es-PE">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:locale" content="es_PE"><meta property="og:site_name" content="New Denim"><meta property="og:title" content="${title}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${S.url}/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2C3442">
<link rel="icon" type="image/svg+xml" href="/assets/img/nd-gold.svg"><link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kaushan+Script&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/links.css?v=${V('css/links.css')}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'New Denim SAC', url: S.url, logo: S.url + '/assets/img/og.jpg', telephone: '+' + S.tel1raw, sameAs: [S.ig, S.tk] })}</script>
</head>
<body>
<main class="lt">
  <div class="tools"><button type="button" id="qrBtn" aria-label="Ver código QR">${qr}</button><button type="button" id="shareBtn" aria-label="Compartir esta página">${share}</button></div>
  <header class="prof">
    <div class="av"><img src="/assets/img/nd-gold.svg" alt="Isotipo New Denim" width="84" height="64"></div>
    <h1>New Denim</h1><p class="tag">Distribuidor Textil</p>
    <p class="bio">Venta de denim y drill de alta calidad por mayor y menor. Diseñados para potenciar tus confecciones.</p>
    <span class="pill"><i></i> Atención activa · Envíos a todo el Perú</span>
  </header>
  <nav class="soc" aria-label="Redes sociales">${circles}</nav>
  <section class="grp" aria-label="Enlaces">
    <h2>Canales directos</h2>
    ${card(wa('Hola New Denim, deseo más información'), waI, 'Atención inmediata por WhatsApp', 'Cotizaciones, pedidos por mayor y asesoría', 'wa')}
    ${card('/muestra-gratis/', ico('gift'), 'Solicitar muestra gratis', 'Hasta 1.5 m de denim o drill · recojo o envío', 'hot', false)}
    ${card(wa('Hola New Denim, deseo el catálogo digital actualizado'), ico('file'), 'Catálogo digital de telas', 'Gramajes, composiciones y fichas técnicas')}
    ${card(wa('Hola New Denim, quiero cotizar telas y conocer precios por mayor'), ico('layers'), 'Cotizar por mayor', 'Precios por volumen para marcas y confeccionistas')}
    <h2>Conoce más</h2>
    ${card('/linea-de-productos/', ico('layers'), 'Línea de productos', 'Denim rígido, stretch, drill, bull denim y más', '', false)}
    ${card('/', globe, 'Sitio web oficial', 'newdenimtextil.com', '', false)}
    ${card('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(S.mapQ), ico('pin'), 'Visítanos en La Victoria', S.addr)}
    <h2>Redes sociales</h2>
    ${card(S.ig, ico('ig'), 'Síguenos en Instagram', '@newdenim_textil · novedades y rollos de tela')}
    ${card(S.tk, tkI, 'TikTok oficial', 'Recomendaciones, acabados y tendencias')}
  </section>
  <footer>© ${new Date().getFullYear()} New Denim SAC · <a href="/">newdenimtextil.com</a></footer>
</main>
<dialog id="qrDlg"><form method="dialog"><button class="x" aria-label="Cerrar">×</button></form><img src="/assets/img/qr-links.svg" alt="Código QR de esta página" width="240" height="240"><p>Escanea para abrir los enlaces de New Denim</p></dialog>
<div class="toast" id="toast" role="status" aria-live="polite">Enlace copiado</div>
<script>
(function(){var u=${JSON.stringify(url)},t=document.getElementById('toast'),d=document.getElementById('qrDlg');
document.getElementById('qrBtn').onclick=function(){d.showModal?d.showModal():location.href='/assets/img/qr-links.svg'};
d.addEventListener('click',function(e){if(e.target===d)d.close()});
document.getElementById('shareBtn').onclick=function(){if(navigator.share){navigator.share({title:'New Denim',text:'Distribuidor textil: denim y drill',url:u}).catch(function(){})}else if(navigator.clipboard){navigator.clipboard.writeText(u).then(function(){t.classList.add('on');setTimeout(function(){t.classList.remove('on')},1800)})}else{prompt('Copia el enlace',u)}}})();
</script>
</body>
</html>
`;
  fs.mkdirSync(path.join(OUT, 'links'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'links', 'index.html'), html);
};
