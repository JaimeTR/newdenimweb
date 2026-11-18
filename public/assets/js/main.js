// Menu movil
const burger = document.getElementById('burger'), menu = document.getElementById('menu');
if (burger && menu) {
  const set = (o) => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); };
  burger.addEventListener('click', () => set(!menu.classList.contains('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
}

// Aparicion suave al hacer scroll (sin JS todo se ve igual)
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((n) => io.observe(n));
} else document.querySelectorAll('.reveal').forEach((n) => n.classList.add('in'));

// Formularios: mismas reglas que enviar.php
const RE = {
  nombre: /^\p{L}[\p{L} '.\-]{2,79}$/u,
  texto: /^(?=.*\p{L})[\p{L}\p{N} .,&'\-\/()#°]{3,120}$/u,
  email: /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/,
};
// Filtra lo que se escribe segun el campo (celular 9 digitos, nombres solo letras, etc.). Lo usa tambien muestra.js
window.ndFmt = (el) => {
  const k = el.dataset.fmt, m = el.maxLength > 0 ? el.maxLength : 200;
  const rule = { num: /\D/g, name: /[^\p{L} '.\-]/gu, biz: /[^\p{L}\p{N} .,&'\-\/()]/gu, addr: /[^\p{L}\p{N} .,#°ºª'\-\/()]/gu, mail: /\s/g, money: /[^\d.]/g }[k];
  if (k === 'cel') el.value = celNorm(el.value);
  else if (rule) { let v = el.value.replace(rule, '').replace(/^\s+/, ''); if (k === 'money') v = v.replace(/(\..*)\./g, '$1').replace(/^(\d*\.\d{0,2}).*/, '$1'); el.value = v.slice(0, m); }
};
const celNorm = (v) => { let d = v.replace(/\D/g, ''); if (d.length > 9 && d.startsWith('51')) d = d.slice(2); return d.replace(/^[^9]+/, '').slice(0, 9); };   // solo empieza con 9
document.querySelectorAll('form[data-form]').forEach((f) => {
  const t = f.querySelector('[name=t]'); if (t) t.value = Math.floor(Date.now() / 1000);
  f.querySelectorAll('[data-fmt]').forEach((el) => el.addEventListener('input', () => ndFmt(el)));
  const rules = {
    nombre: [(v) => RE.nombre.test(v), 'Escribe tu nombre completo (solo letras).'],
    empresa: [(v) => !v || RE.texto.test(v), 'Nombre de empresa no válido.'],
    correo: [(v) => v.length <= 100 && RE.email.test(v), 'Ingresa un correo válido.'],
    correo_op: [(v) => !v || RE.email.test(v), 'Ingresa un correo válido.'],
    celular: [(v) => /^9\d{8}$/.test(v), 'Debe tener 9 dígitos y empezar con 9.'],
    doc: [(v) => /^\d{8,12}$/.test(v), 'Documento no válido (DNI: 8 dígitos).'],
    domicilio: [(v) => RE.texto.test(v) && v.length >= 5, 'Escribe tu domicilio.'],
    texto: [(v) => v.length >= 10 && /\p{L}/u.test(v), 'Escribe al menos 10 caracteres.'],
    monto: [(v) => !v || /^\d{1,7}(\.\d{1,2})?$/.test(v), 'Monto no válido (ej. 150.50).'],
    req: [(v) => v.length > 0, 'Campo obligatorio.'],
  };
  f.addEventListener('submit', (e) => {
    f.querySelectorAll('.err').forEach((n) => n.remove());
    f.querySelectorAll('.bad').forEach((n) => n.classList.remove('bad'));
    let first = null;
    f.querySelectorAll('[data-v]').forEach((el) => {
      const v = el.type === 'checkbox' ? (el.checked ? '1' : '') : el.value.trim().replace(/[ \t]+/g, ' ');
      const [ok, msg] = rules[el.dataset.v];
      if (!ok(v)) { const box = el.closest('.f,.chk'); box.classList.add('bad'); box.insertAdjacentHTML('beforeend', `<span class="err">${msg}</span>`); first = first || el; }
    });
    if (first) { e.preventDefault(); first.scrollIntoView({ behavior: 'smooth', block: 'center' }); first.focus({ preventScroll: true }); return; }
    f.querySelectorAll('button[type=submit]').forEach((b) => { b.disabled = true; });
  });
});

// Widget flotante de chat y llamadas
(() => {
  const w = document.getElementById('cw'), b = document.getElementById('cwBtn'), p = document.getElementById('cwPanel');
  if (!w) return;
  const hint = document.getElementById('cwHint'), back = document.getElementById('cwBack'), x = document.getElementById('cwX');
  const set = (o) => { w.classList.toggle('open', o); b.setAttribute('aria-expanded', o); p.hidden = !o; if (o && hint) hint.classList.remove('on'); };
  b.addEventListener('click', () => set(p.hidden));
  if (x) x.addEventListener('click', () => { set(false); b.focus(); });
  if (back) back.addEventListener('click', () => set(false));
  // Burbuja "¿Hablamos?" una sola vez por visita, a los 4 segundos
  try { if (hint && !sessionStorage.getItem('nd_hint')) { sessionStorage.setItem('nd_hint', '1'); setTimeout(() => { if (p.hidden) { hint.classList.add('on'); setTimeout(() => hint.classList.remove('on'), 5000); } }, 4000); } } catch (_) {}
  document.addEventListener('click', (e) => { if (!p.hidden && !w.contains(e.target)) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !p.hidden) { set(false); b.focus(); } });
})();
