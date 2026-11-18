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
const celNorm = (v) => { let d = v.replace(/\D/g, ''); if (d.length > 9 && d.startsWith('51')) d = d.slice(2); return d.slice(0, 9); };
document.querySelectorAll('form[data-form]').forEach((f) => {
  const t = f.querySelector('[name=t]'); if (t) t.value = Math.floor(Date.now() / 1000);
  f.querySelectorAll('[data-fmt]').forEach((el) => el.addEventListener('input', () => {
    el.value = el.dataset.fmt === 'cel' ? celNorm(el.value) : el.value.replace(/\D/g, '').slice(0, el.maxLength > 0 ? el.maxLength : 20);
  }));
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
