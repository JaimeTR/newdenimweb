// Formulario de muestra gratis: 2 pasos, campos segun tipo/entrega, validacion igual a server.js
(() => {
  const RE = {
    nombre: /^\p{L}[\p{L} '.\-]{2,79}$/u, razon: /^(?=.*\p{L})[\p{L}\p{N} .,&'\-\/()]{3,100}$/u,
    lugar: /^\p{L}[\p{L} '.\-]{1,59}$/u, direc: /^(?=.*\p{L})[\p{L}\p{N} .,#°ºª'\-\/()]{5,120}$/u, email: /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/,
  };
  const rucOk = (v) => {
    if (!/^(10|15|16|17|20)\d{9}$/.test(v)) return false;
    const w = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2], r = 11 - (w.reduce((s, x, i) => s + x * +v[i], 0) % 11);
    return (r === 10 ? 0 : r === 11 ? 1 : r) === +v[10];
  };
  const celNorm = (v) => { let d = v.replace(/\D/g, ''); if (d.length > 9 && d.startsWith('51')) d = d.slice(2); return d.slice(0, 9); };

  const f = document.getElementById('solicitar');
  if (!f) return;
  const steps = [...f.querySelectorAll('.step')];
  const prog = document.getElementById('prog'), bar = document.getElementById('progBar'), txt = document.getElementById('progTxt');
  const prev = document.getElementById('prev'), next = document.getElementById('next'), fin = document.getElementById('submitBtn');
  const val = (n) => f.querySelector(`[name=${n}]:checked`).value;
  const show = (sel, on) => f.querySelectorAll(sel).forEach((n) => { n.hidden = !on; });
  const enable = (sel, on) => f.querySelectorAll(sel).forEach((i) => { i.disabled = !on; });
  let cur = 0;
  f.elements.t.value = Math.floor(Date.now() / 1000);

  function apply() {
    const emp = val('tipo') === 'empresa', env = val('entrega') === 'envio';
    document.getElementById('seg').dataset.on = emp ? 1 : 0;
    document.getElementById('seg2').dataset.on = env ? 1 : 0;
    show('.only-emp', emp); show('.only-nat', !emp); show('.ent-envio', env); show('.ent-recojo', !env);
    enable('.only-emp input', emp); enable('.only-nat input', !emp); enable('.ent-envio input', env);
    f.querySelectorAll('.err').forEach((n) => n.remove());
  }
  f.querySelectorAll('[name=tipo],[name=entrega]').forEach((r) => r.addEventListener('change', apply));
  apply();

  // "Tipo de tela" depende de la tela elegida (Denim: 4 opciones; Drill: 3)
  const tt = f.elements.tipo_tela;
  function fillTipoTela() {
    const t = f.querySelector('[name=tela]:checked');
    tt.innerHTML = ''; tt.add(new Option(t ? 'Selecciona…' : 'Elige primero la tela', ''));
    if (t) tt.dataset[t.value.toLowerCase()].split('|').forEach((v) => tt.add(new Option(v, v)));
    tt.disabled = !t;
  }
  f.querySelectorAll('[name=tela]').forEach((r) => r.addEventListener('change', () => { fillTipoTela(); f.querySelectorAll('.err').forEach((n) => n.remove()); }));
  fillTipoTela();
  f.querySelectorAll('[data-fmt]').forEach((el) => el.addEventListener('input', () => ndFmt(el)));

  function errorsOf(i) {
    const emp = val('tipo') === 'empresa', bad = [];
    const g = (n) => f.elements[n].value.trim().replace(/\s+/g, ' ');
    const chk = (n, ok, msg) => { if (!ok(g(n))) bad.push([f.elements[n].closest('.in'), msg]); };
    if (i === 0) {
      if (!f.querySelector('[name=tela]:checked')) bad.push([f.querySelector('.chips2'), 'Elige un tipo de tela.']);
      else chk('tipo_tela', (v) => v, 'Elige el tipo de tela.');
      chk('linea', (v) => v, 'Elige la línea de producto.');
      if (val('entrega') === 'envio') { chk('distrito', (v) => RE.lugar.test(v), 'Escribe el distrito.'); chk('direccion', (v) => RE.direc.test(v), 'Escribe una dirección válida.'); }
    } else {
      if (emp) { chk('razon', (v) => RE.razon.test(v), 'Escribe la razón social (mínimo 3 caracteres).'); chk('ruc', rucOk, 'RUC no válido (11 dígitos, ej. 20100070970).'); }
      else { chk('nombre', (v) => RE.nombre.test(v), 'Escribe tu nombre completo (solo letras).'); chk('dni', (v) => /^\d{8}$/.test(v), 'El DNI debe tener 8 dígitos.'); }
      chk('celular', (v) => /^9\d{8}$/.test(v), 'Debe tener 9 dígitos y empezar con 9.');
      if (g('correo')) chk('correo', (v) => v.length <= 100 && RE.email.test(v), 'Ingresa un correo válido.');
      chk('negocio', (v) => v, 'Elige el tipo de negocio.');
      chk('compra', (v) => v, 'Elige la compra mensual.');
    }
    return bad;
  }
  const showErrors = (bad) => { bad.forEach(([el, m]) => el.insertAdjacentHTML('afterend', `<span class="err">${m}</span>`)); if (bad.length) bad[0][0].scrollIntoView({ behavior: 'smooth', block: 'center' }); };

  function go(i, scroll = true) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach((s, k) => { s.hidden = k !== cur; });
    bar.style.width = ((cur + 1) / steps.length) * 100 + '%';
    txt.textContent = `Paso ${cur + 1} de ${steps.length}`;
    prev.hidden = !cur; next.hidden = cur === steps.length - 1; fin.hidden = cur !== steps.length - 1;
    if (scroll) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  prog.hidden = false;
  go(0, false);
  next.addEventListener('click', () => { f.querySelectorAll('.err').forEach((n) => n.remove()); const bad = errorsOf(cur); bad.length ? showErrors(bad) : go(cur + 1); });
  prev.addEventListener('click', () => go(cur - 1));
  f.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.tagName === 'INPUT' && cur < steps.length - 1) { e.preventDefault(); next.click(); } });

  f.addEventListener('submit', (e) => {
    f.querySelectorAll('.err').forEach((n) => n.remove());
    for (let i = 0; i < steps.length; i++) { const bad = errorsOf(i); if (bad.length) { e.preventDefault(); go(i); showErrors(bad); return; } }
    // Guarda el resumen para la pagina de gracias (boton de WhatsApp con el mensaje ya escrito)
    const emp = val('tipo') === 'empresa', env = val('entrega') === 'envio', g = (n) => f.elements[n].value.trim().replace(/\s+/g, ' ');
    const tela = f.querySelector('[name=tela]:checked').value;
    const who = emp ? g('razon') : g('nombre');
    const msg = ['Hola New Denim, solicité una muestra gratis desde la web.', '', `${emp ? 'Empresa: ' : 'Nombre: '}${who}`, emp ? `RUC: ${g('ruc')}` : `DNI: ${g('dni')}`, `Celular: ${g('celular')}`,
      `Tela: ${tela} ${g('tipo_tela').toLowerCase()}`, `Línea: ${g('linea')}`, `Negocio: ${g('negocio')}`, `Compra mensual: ${g('compra')}`,
      env ? `Entrega: envío a ${g('direccion')}, ${g('distrito')}` : 'Entrega: recojo en tienda'].join('\n');
    // Primero se envia el correo; si sale bien se abre WhatsApp con este mensaje y se muestra la pagina de gracias
    e.preventDefault();
    ndSend(f, `https://wa.me/${f.dataset.wa}?text=${encodeURIComponent(msg)}`, { who: emp ? who : who.split(' ')[0], msg });
  });
})();
