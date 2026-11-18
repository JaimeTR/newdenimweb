// Empaqueta el sitio para hosting compartido (estatico + PHP):  node tools/pack-php.js
// Genera dist-php/ (carpeta para public_html) y ../Web-New-Denim-hosting.zip (+ version sin catalogos PDF).
// config.php se crea desde .env (no se sube a Git; el zip contiene la clave: no compartirlo).
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const root = path.join(__dirname, '..'), dist = path.join(root, 'dist-php');
execSync('node build.js', { cwd: root, stdio: 'inherit' });
fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, 'public'), dist, { recursive: true });
fs.cpSync(path.join(root, 'hosting'), dist, { recursive: true });
fs.mkdirSync(path.join(dist, 'data'), { recursive: true });
fs.writeFileSync(path.join(dist, 'data', '.htaccess'), 'Require all denied\n');
fs.writeFileSync(path.join(dist, 'lib', '.htaccess'), 'Require all denied\n');
fs.writeFileSync(path.join(dist, 'vendor', '.htaccess'), 'Require all denied\n');
fs.rmSync(path.join(dist, 'config.sample.php'));

const env = {};
try { for (const l of fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) env[m[1]] = m[2]; } } catch (_) { console.warn('Sin .env: config.php quedara sin clave SMTP'); }
const q = (s) => "'" + String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
fs.writeFileSync(path.join(dist, 'config.php'), `<?php
// Generado desde .env. Contiene la clave SMTP: no compartir ni subir a GitHub.
return [
    'mail_to'   => ${q(env.MAIL_TO || 'newdenimsac@gmail.com')},
    'mail_cc'   => ${q(env.MAIL_CC ?? 'soporte@newdenimtextil.com')},
    'mail_from' => ${q(env.MAIL_FROM || 'soporte@newdenimtextil.com')},
    'smtp_host' => ${q(env.SMTP_HOST || 'smtp.hostinger.com')},
    'smtp_port' => ${+(env.SMTP_PORT || 465)},
    'smtp_user' => ${q(env.SMTP_USER || 'soporte@newdenimtextil.com')},
    'smtp_pass' => ${q(env.SMTP_PASS)},
];
`);
const zip = (name, extra = '') => { const out = path.join(root, '..', name); fs.rmSync(out, { force: true }); execSync(`tar -a -cf ../../${name} ${extra} .`, { cwd: dist, stdio: 'inherit' }); console.log(name, (fs.statSync(out).size / 1048576).toFixed(1) + ' MB'); };
zip('Web-New-Denim.zip');   // un solo zip con todo (incluye los catalogos PDF)
