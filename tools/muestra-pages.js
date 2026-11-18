// Paginas /muestra-gratis/ y /muestra-gratis/gracias/ (se incluyen desde build.js)
module.exports = ({ S, ico, waI, wa, add, V }) => {
  const CSS = `\n<link rel="stylesheet" href="/assets/css/muestra.css?v=${V('css/muestra.css')}">`;
  const chip = (n, d) => `<label class="chip"><input type="checkbox" name="telas[]" value="${n}"><span>${ico('layers')}<i><b>${n}</b><small>${d}</small></i><em class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></em></span></label>`;
  const inp = (label, name, ic, o = {}) => `<label class="f ${o.cls || ''}"${o.hid ? ' hidden' : ''}>${label}<span class="in">${ico(ic)}<input name="${name}" ${o.attr || ''}${o.hid ? ' disabled' : ''}></span></label>`;
  add({
    file: 'muestra-gratis', nav: '/muestra-gratis/', schema: CSS, script: `<script src="/assets/js/muestra.js?v=${V('js/muestra.js')}" defer></script>`,
    title: 'Muestra gratis de denim y drill | New Denim - Distribuidor Textil',
    desc: 'Solicita muestras gratis de denim y drill (hasta 1.5 m). Recojo en tienda en La Victoria, Lima, o envío. New Denim, distribuidor textil.',
    hero: `<section class="hero"><div class="wrap hero-grid">
  <div class="reveal in"><div class="kicker">Muestra gratis</div><h1>Prueba la calidad antes de <em>comprar</em></h1>
    <p class="lead">Solicita muestras de nuestras telas denim y drill. Ideal para diseñadores, marcas y confeccionistas. La muestra gratis es de hasta <b>1.5 metros</b>; una cantidad mayor tiene costo.</p>
    <div class="btns"><a class="btn dark" href="#solicitar">${ico('send')} Solicitar muestra gratis</a><a class="btn ghost" href="/linea-de-productos/">Ver productos ${ico('arrow')}</a></div>
    <ul class="badges"><li>${ico('gift')} Muestra gratis hasta 1.5 m</li><li>${ico('pin')} Recojo en tienda</li><li>${ico('clock')} Respuesta rápida</li></ul></div>
  <div class="hero-card reveal in"><div class="swatch s-denim"><span>${ico('layers')} Denim</span><small>Rígido, confort stretch, stretch y super stretch</small></div><div class="swatch s-drill"><span>${ico('layers')} Drill</span><small>Crudos de alta resistencia</small></div></div>
</div></section>`,
    body: `
<section class="section" id="solicitar-sec"><div class="wrap narrow"><div class="sec-head reveal"><h2 class="sec-title">Solicita tu <em>muestra</em></h2><p class="sec-sub">Dos pasos rápidos. Muestra gratis de hasta 1.5 metros.</p></div>
<form class="card mform" method="post" action="/api/muestra" id="solicitar" novalidate>
  <input type="hidden" name="t" value=""><input type="text" name="web" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
  <div class="prog" id="prog" hidden><div class="prog-track"><i id="progBar"></i></div><p id="progTxt">Paso 1 de 2</p></div>
  <div class="steps-box">
    <fieldset class="step"><legend><span class="num">1</span> Tu pedido</legend>
      <span class="lab">¿Qué tela quieres probar?</span><div class="chips2">${chip('Denim', 'Rígido y stretch')}${chip('Drill', 'Algodón y mezclas')}</div>
      <span class="lab gap">¿Cómo quieres recibirlas?</span>
      <div class="seg" role="radiogroup" id="seg2" data-on="0" aria-label="Forma de entrega"><i class="seg-bar"></i>
        <label><input type="radio" name="entrega" value="recojo" checked><span>${ico('pin')} Recojo en tienda</span></label><label><input type="radio" name="entrega" value="envio"><span>${ico('truck')} Envío</span></label></div>
      <p class="store-note ent ent-recojo">${ico('pin')} <span>Recoge en <b>${S.addrShort}</b>. Te avisamos cuando estén listas.</span></p>
      <div class="grid ent ent-envio" hidden>${inp('Distrito / ciudad', 'distrito', 'pin', { hid: 1, attr: 'maxlength="60"' })}${inp('Dirección de envío *', 'direccion', 'truck', { hid: 1, attr: 'maxlength="120" autocomplete="street-address"' })}</div>
    </fieldset>
    <fieldset class="step" hidden><legend><span class="num">2</span> Tus datos</legend>
      <div class="seg" role="radiogroup" id="seg" data-on="0" aria-label="Tipo de cliente"><i class="seg-bar"></i>
        <label><input type="radio" name="tipo" value="natural" checked><span>${ico('user')} Persona natural</span></label><label><input type="radio" name="tipo" value="empresa"><span>${ico('build')} Empresa</span></label></div>
      <div class="grid gap" id="grid">
        ${inp('Razón social *', 'razon', 'build', { cls: 'only-emp', hid: 1, attr: 'maxlength="100" autocomplete="organization"' })}${inp('RUC *', 'ruc', 'id', { cls: 'only-emp', hid: 1, attr: 'inputmode="numeric" maxlength="11" data-fmt="num" placeholder="11 dígitos"' })}
        ${inp('Nombre completo *', 'nombre', 'user', { cls: 'only-nat', attr: 'maxlength="80" autocomplete="name"' })}${inp('DNI <small>(opcional)</small>', 'dni', 'id', { cls: 'only-nat', attr: 'inputmode="numeric" maxlength="8" data-fmt="num" placeholder="8 dígitos"' })}
        ${inp('Celular / WhatsApp *', 'celular', 'phone', { attr: 'type="tel" inputmode="numeric" maxlength="18" data-fmt="cel" autocomplete="tel" placeholder="9XX XXX XXX"' })}${inp('Correo <small>(opcional)</small>', 'correo', 'mail', { attr: 'type="email" maxlength="100" autocomplete="email"' })}
        <p class="wa-note full">${waI} Toda la coordinación se realizará por WhatsApp.</p></div>
    </fieldset>
  </div>
  <div class="nav" id="nav"><button type="button" class="btn ghost" id="prev" hidden>&larr; Atrás</button><button type="button" class="btn" id="next">Siguiente &rarr;</button><button class="btn" type="submit" id="submitBtn" hidden>${ico('send')} Solicitar muestra gratis</button></div>
</form></div></section>
<section class="section alt steps"><div class="wrap"><div class="sec-head reveal"><h2 class="sec-title">¿Cómo <em>funciona</em>?</h2></div>
  <ol class="steps-grid"><li class="reveal"><span class="big">01.</span><b>Elige tu tela</b><p>Denim o drill, según lo que necesites confeccionar.</p></li><li class="reveal" style="transition-delay:80ms"><span class="big">02.</span><b>Completa tus datos</b><p>Como persona natural o empresa, en un formulario corto.</p></li><li class="reveal" style="transition-delay:160ms"><span class="big">03.</span><b>Recoge o recibe tus muestras</b><p>Te contactamos para coordinar la entrega.</p></li></ol></div></section>`,
  });
  add({
    file: 'muestra-gratis/gracias', title: 'Gracias | Muestra gratis New Denim', desc: 'Recibimos tu solicitud de muestra gratis.', noindex: true, nav: '/muestra-gratis/', schema: CSS,
    body: `<section class="section"><div class="wrap narrow"><div class="card reveal in" style="text-align:center;padding:48px 28px">
  <div class="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
  <h1 style="font-size:clamp(1.8rem,5vw,2.4rem);margin-bottom:8px">¡Gracias<span id="gn"></span>!</h1><p style="color:var(--soft);margin:0 0 26px">Recibimos tu solicitud de muestra gratis.</p>
  <ol class="next"><li><b>Te contactaremos</b> por WhatsApp o llamada al número que dejaste para confirmar tu pedido.</li><li id="gstep"><b>Recoge tus muestras</b> en ${S.addrShort}. Te avisaremos cuando estén listas.</li><li>Recuerda: la muestra gratis es de <b>hasta 1.5 metros</b>.</li></ol>
  <p id="gm" class="alert" style="max-width:520px;margin:0 auto 20px" hidden>No pudimos enviar el aviso por correo, pero guardamos tu solicitud. Envíala también por WhatsApp para atenderte de inmediato.</p>
  <a class="btn wa" id="gwa" href="${wa('Hola New Denim, quiero una muestra gratis.')}" target="_blank" rel="noopener">${waI} Enviar mi solicitud por WhatsApp</a>
  <p style="font-size:.82rem;color:var(--soft);margin:16px 0 0">Se abrirá WhatsApp con tu solicitud ya escrita. Solo presiona enviar y te atendemos más rápido.</p><p style="margin-top:18px"><a href="/" style="color:var(--soft);font-size:.88rem">Volver al inicio</a></p></div></div></section>
<script>(function(){var q=new URLSearchParams(location.search),$=function(i){return document.getElementById(i)},d={};try{d=JSON.parse(sessionStorage.getItem('nd_muestra')||'{}')}catch(e){}
if(d.who)$('gn').textContent=', '+d.who;if(d.msg)$('gwa').href='https://wa.me/${S.wa}?text='+encodeURIComponent(d.msg);
if(q.get('e')==='envio')$('gstep').innerHTML='<b>Coordinamos el envío</b> contigo: te confirmaremos la forma y los detalles de entrega.';if(q.get('m')==='0')$('gm').hidden=false})()</script>`,
  });
};
