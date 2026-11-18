// Optimiza las fotos de la web actual a webp (node imgs.js <carpeta-origen>)
const sharp = require('C:/Users/Jaime Tarazona/.gemini/antigravity/scratch/QR-Camion/node_modules/sharp');
const src = process.argv[2], out = __dirname + '/../public/assets/img/';
const M = {
  'hero-chaqueta': ['1979.jpg', 900], 'hero-reja': ['1974.jpg', 900], 'look-gris': ['1486.jpg', 900],
  'textura-denim': ['832-qxfpq4tud8lsczh7f0nuzk1eyeqcxpml9m6yqsufug.jpg', 800], 'moda-calle': ['3354-qxfd86h4tangov27u0u2wlmxxahz9qc92jsfhdzwe0.jpg', 800],
  'showroom': ['new-denim-2-qxfmb2siuwyehdq3qbaspamcolxa5vajttmk42b3ig.jpeg', 900], 'crudos-otono': ['CRUDOS_.jpg', 900],
  'cat-denim': ['DENIM_-qxh85dn8z9gm2se8dv2dls37hvatg6wahijz9vlfv8.jpg', 700], 'cat-crudos': ['CRUDOS_-qxh9587nmsjavebm1ux578f33wls0m7r2y9n6sfwk4.jpg', 700],
  'p-denim-rigido': ['Rigido-denim-qxh859vw7xbr0n7u5us3lcydb91g8cgyfqoyd90i2w.jpg', 600], 'p-denim-essential': ['Denim-essential-qxh859vw7xbr0n7u5us3lcydb91g8cgyfqoyd90i2w.jpg', 600],
  'p-comfort-stretch': ['Denim-comfort-stretch-qxh85atqerd1c96h0d6q5uptwmwtg1korvcfuiz3wo.jpg', 600], 'p-satin-stretch': ['DENIM-SATIN-STRETCH-qxh85atqerd1c96h0d6q5uptwmwtg1korvcfuiz3wo.jpg', 600],
  'p-premium-comfort': ['denim-premium-comfort-stretch-qxh85brkllebnv53uvlcqchai0s6nqof3zzxbsxpqg.jpg', 600], 'p-jogg': ['Jogg-Denim-1-qxh85cpesfflzh3qpdzzau8r3enjvfs5g4net2wbk8.jpg', 600],
  'p-premium-power': ['Denim-premium-power-stretch-qxh85cpesfflzh3qpdzzau8r3enjvfs5g4net2wbk8.jpg', 600], 'p-black-denim': ['Black-Denim-qxh85dn8z9gwb32djwelvc07osix34vvs9awacuxe0.jpg', 600],
  'p-essential-180': ['Denim-Essential-de-180-cm-qxh85brkllebnv53uvlcqchai0s6nqof3zzxbsxpqg.jpg', 600],
  'p-corduroy': ['CORDUROY_-2-qxhjpyq7wxqrtjy9zgz6fpjljh87hxp9e5yw856lqg.jpg', 600], 'p-drill': ['DRILLS_-1-qxhjpu10yrkc7i53qwy1l8qakjvdfg6lpipgtrdklk.jpg', 600],
  'p-crudo-satin-stretch': ['SATIN_ETRETCH_-1-qxhjpuyv5llmj43qlfco5qhr5xqqn5ac1ncyb1c6fc.jpg', 600], 'p-paper-touch': ['PAPER_TOUCH_-1-qxhjpwujj9o76c10ag5xaq0ocphh2jhspwnx9l9e2w.jpg', 600],
  'p-denim-liviano': ['DENIM_LIVIANO-2-qxhjq0lwaltcgrvjohsfkp2iq8yxxbwq2f9v6p3te0.jpg', 600], 'p-bull-denim': ['BULL_DENIM_-1-2-qxhjpxsdq3phhxzn4ykjv7s4y3cua8lj21beqv7zwo.jpg', 600],
  'ficha-rockero': ['DENIM_ROCKERO_WEB-LAV1-qxhhs3e3wa3gt1fxz9pj3ca3wdlzbwbjsc7jzos494.jpg', 700], 'ficha-lucas': ['DENIM_LUCAS_WEB-LAV1-qxhhs4by344r4nekts45nu1khrhcjlfa4gv1gyqq2w.jpg', 700],
  'prov-colortex': ['Logo_COLORTEX.png', 420], 'prov-nuevomundo': ['nuevomundo-logo.png', 420],
};
(async () => { for (const [k, [f, w]] of Object.entries(M)) { await sharp(src + '/' + f).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out + k + '.webp'); }
  await sharp(__dirname + '/../public/assets/img/nd-gold.svg', { density: 300 }).resize(180, 180, { fit: 'contain', background: '#2C3442' }).png().toFile(out + 'apple-touch-icon.png');
  await sharp(__dirname + '/../public/assets/img/logo-gold.svg', { density: 200 }).resize({ height: 480 }).png().toBuffer().then(b => sharp({ create: { width: 1200, height: 630, channels: 3, background: '#2C3442' } }).composite([{ input: b, gravity: 'center' }]).jpeg({ quality: 85 }).toFile(out + 'og.jpg'));
  console.log('ok'); })();
