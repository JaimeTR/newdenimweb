# New Denim: web informativa + muestra gratis (un solo proyecto Node.js)

`newdenimtextil.com` sirve todo: páginas informativas, `/muestra-gratis/` y los formularios (contacto, muestra, libro de reclamaciones).
Los subdominios `muestragratis.` y `pruebagratis.` redirigen (301) a `/muestra-gratis/`, así el QR del camión sigue funcionando.

## Estructura
- `server.js`: Express. Sirve `public/` y recibe `POST /api/contacto|muestra|reclamo` → correo (nodemailer, SMTP).
- `build.js` + `tools/muestra-pages.js`: generan las páginas HTML en `public/` (textos, productos, teléfonos y redes se editan en `build.js`).
- `public/`: sitio generado + `assets/` (css, js, imágenes webp, catálogos PDF). **Se sube a Git ya generado**.
- `tools/imgs.js`: optimiza fotos originales a webp (solo uso local, requiere `sharp`).

## Trabajar
```bash
npm install
npm run dev        # build + servidor en http://localhost:3000
```
Cambia textos en `build.js`, corre `npm run build`, revisa en local, `git commit` y `git push`.
Sin SMTP los correos no salen: quedan en la consola. Para probarlos copia `.env.example` a `.env` y arranca con `node --env-file=.env server.js`.

## Despliegue automático en Hostinger (requiere plan con Node.js)
1. Subir este proyecto a un repositorio de GitHub (rama `main`).
2. hPanel → **Sitios web → Agregar sitio web → Aplicación web Node.js → Importar repositorio Git** → conectar GitHub y elegir repo y rama `main`.
3. Ajustes de compilación: Node 20 o superior · build `npm install` · inicio `npm start` (archivo de entrada `server.js`).
4. **Variables de entorno** (en el panel, nunca en el repo): `NODE_ENV=production`, `SITE_URL`, `MAIL_TO`, `MAIL_FROM`, `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_USER`, `SMTP_PASS` (ver `.env.example`).
5. Usar el correo `soporte@newdenimtextil.com` de Hostinger como `SMTP_USER` (y `MAIL_FROM`).
6. Conectar el dominio `newdenimtextil.com` a esta app y también `muestragratis.newdenimtextil.com` (para que redirija).
7. Desde ahí, cada `git push` a `main` redespliega solo.

**Antes de apuntar el dominio, respaldar el WordPress actual.**

## Pendientes de datos
- URLs de Facebook y LinkedIn (`S.fb`, `S.li` en `build.js`).
- RUC de New Denim SAC para el libro de reclamaciones.
- Correo destino definitivo (`MAIL_TO`).
