// Shared parts for MoonPhasesClear: numbers, phase maths, a procedural Moon and Earth, a space scene,
// a ground-and-sky scene, a painted "Moon as you see it" disc, and a camera-locked card (HUD).
// Everything here is drawn by code. No photographs, maps or textures from anyone else are used.
import { THREE, M, canvasTexture, clamp, lerp, smooth, approach } from './kit.js';

export { THREE, M, clamp, lerp, smooth, approach };
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const TAU = Math.PI * 2, DEG = Math.PI / 180;
export const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export const COL = { sun: 0xffd37a, lit: 0xffb547, see: 0x8ef0ff, violet: 0xc49bff, coral: 0xff7a59, lime: 0xa3e635, white: 0xe9eef8, dim: 0x8f9bb5 };
export const HEX = (c) => '#' + c.toString(16).padStart(6, '0');

// Numbers. Mean synodic month 29.530589 d and sidereal month 27.321662 d; sidereal year 365.25636 d.
// Mean distance 384,400 km. Perigee usually falls between about 356,400 and 370,400 km, apogee between about
// 404,000 and 406,700 km. Libration: up to about 7.9° in longitude and 6.7° in latitude.
export const K = {
  SYN: 29.530589, SID: 27.321662, YEAR: 365.25636, TROP: 365.24219, ANOM: 27.554550, DRAC: 27.212221,
  dMean: 384400, periMin: 356400, periMax: 370400, apoMin: 404000, apoMax: 406700, Rm: 1737.4,
  incl: 5.145, libLon: 7.9, libLat: 6.7, lunarDayMin: 50.47,
};
export const fmtKm = (v) => Math.round(v).toLocaleString('en-US');
export const hm = (h) => { h = ((h % 24) + 24) % 24; let m = Math.round(h * 60); const hh = Math.floor(m / 60) % 24; m %= 60; return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')}`; };
export const wrap = (a) => ((a % TAU) + TAU) % TAU;

// e = elongation, the angle Sun–Earth–Moon (0 at new moon, π at full). Fraction of the disc lit:
export const illum = (e) => (1 - Math.cos(e)) / 2;
export const elongOfAge = (age) => wrap((age / K.SYN) * TAU);
export function phaseName(e) {
  const d = wrap(e) / DEG;
  if (d < 10 || d >= 350) return 'New moon';
  if (d < 80) return 'Waxing crescent';
  if (d < 100) return 'First quarter';
  if (d < 170) return 'Waxing gibbous';
  if (d < 190) return 'Full moon';
  if (d < 260) return 'Waning gibbous';
  if (d < 280) return 'Last quarter';
  return 'Waning crescent';
}
export const PHASES = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];

// ---------------------------------------------------------------- the Moon's surface (procedural)
// An equirectangular map. The middle of the near side sits at u = 0.25, which is local +z on a three.js sphere.
// Dark "seas" are placed roughly where the large maria are, as plain ellipses; craters are random.
const MARIA = [
  [-57, 18, 26, 20], [-16, 33, 17, 13], [17, 28, 10, 9], [31, 8, 12, 9], [59, 17, 7, 6], [51, -8, 9, 9], [34, -15, 5, 5],
  [-17, -21, 10, 8], [-39, -24, 6, 6], [0, 56, 36, 4], [4, 13, 5, 3], [-30, -5, 14, 9], [-50, 40, 12, 6], [128, -20, 6, 6], [147, 27, 4, 4],
];
let MOONCAN = null, ALB = null;
export function moonCanvas() {
  if (MOONCAN) return MOONCAN;
  const W = 1024, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), R = rng(11);
  const P = (lon, lat) => [((90 + lon) / 360) * W, ((90 - lat) / 180) * H];
  g.fillStyle = '#a9a7a1'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) { const x = R() * W, y = R() * H, r = 2 + R() * 10; g.fillStyle = `rgba(${R() < 0.5 ? '255,255,250' : '60,60,64'},0.05)`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  g.fillStyle = 'rgba(64,64,72,.5)';
  for (const [lo, la, rx, ry] of MARIA) {
    const [x, y] = P(lo, la), k = 1 / Math.max(0.35, Math.cos(la * DEG));
    g.beginPath(); g.ellipse(x, y, (rx / 360) * W * k, (ry / 180) * H, 0, 0, TAU); g.fill();
    for (let j = 0; j < 5; j++) { g.beginPath(); g.ellipse(x + (R() - 0.5) * rx * 2.2, y + (R() - 0.5) * ry * 2.2, (rx / 360) * W * k * 0.45, (ry / 180) * H * 0.45, R() * 3, 0, TAU); g.fill(); }
  }
  for (let i = 0; i < 520; i++) {
    const x = R() * W, y = H * (0.04 + R() * 0.92), r = 1.2 + R() * R() * 9;
    g.fillStyle = 'rgba(70,70,76,.16)'; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(240,240,232,.18)'; g.lineWidth = 1; g.beginPath(); g.arc(x - 0.6, y - 0.6, r, 0, TAU); g.stroke();
  }
  // two young, bright rayed craters
  for (const [lo, la, n] of [[-11, -43, 14], [-20, 10, 9]]) {
    const [x, y] = P(lo, la); g.strokeStyle = 'rgba(250,250,245,.22)'; g.lineWidth = 2;
    for (let k = 0; k < n; k++) { const a = R() * TAU, L = 30 + R() * 90; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L * 0.6); g.stroke(); }
    g.fillStyle = '#f2f1ea'; g.beginPath(); g.arc(x, y, 4, 0, TAU); g.fill();
  }
  return (MOONCAN = c);
}
function albedo() {
  if (ALB) return ALB;
  const src = moonCanvas(), w = 512, h = 256, c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); g.drawImage(src, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data, a = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) a[i] = d[i * 4] / 255;
  return (ALB = { w, h, a });
}
export function moonTexture() { const t = new THREE.CanvasTexture(moonCanvas()); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
export function moonMesh(r = 0.5, seg = 64) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg / 2), new THREE.MeshLambertMaterial({ map: moonTexture() }));
  return m;
}

// ---------------------------------------------------------------- Earth (procedural, simplified coastlines)
const POLY = {
  na: [[-168, 66], [-140, 70], [-95, 72], [-80, 68], [-62, 60], [-55, 50], [-67, 44], [-76, 35], [-81, 25], [-97, 26], [-97, 20], [-87, 21], [-83, 10], [-78, 8], [-90, 14], [-105, 20], [-117, 32], [-125, 42], [-125, 49], [-135, 58], [-150, 60], [-165, 62]],
  sa: [[-78, 8], [-60, 10], [-50, 0], [-35, -6], [-40, -22], [-58, -38], [-65, -55], [-72, -50], [-71, -30], [-75, -15], [-81, -5]],
  af: [[-17, 21], [-5, 35], [10, 37], [32, 31], [43, 12], [51, 11], [40, -15], [33, -27], [20, -35], [12, -17], [9, 4], [-8, 5], [-17, 14]],
  eu: [[-10, 36], [-9, 43], [0, 50], [10, 56], [25, 70], [60, 70], [100, 78], [140, 72], [180, 68], [170, 60], [140, 50], [130, 35], [122, 30], [120, 22], [108, 10], [100, 3], [98, 10], [92, 22], [80, 8], [73, 18], [67, 25], [57, 25], [50, 30], [56, 17], [43, 13], [35, 28], [30, 36], [22, 37], [12, 44], [3, 43]],
  au: [[114, -22], [130, -12], [142, -11], [153, -26], [147, -38], [135, -35], [115, -34]],
  gl: [[-55, 60], [-20, 70], [-20, 82], [-60, 82], [-70, 76]],
};
export function earthMesh(r = 1, seg = 64) {
  const t = canvasTexture(1024, 512, (g, W, H) => {
    const grad = g.createLinearGradient(0, 0, 0, H); grad.addColorStop(0, '#2a6aa8'); grad.addColorStop(0.5, '#1c5a9c'); grad.addColorStop(1, '#2a6aa8');
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    const P = (lon, lat) => [((lon + 180) / 360) * W, ((90 - lat) / 180) * H];
    for (const [k, pts] of Object.entries(POLY)) {
      g.beginPath(); pts.forEach(([lo, la], i) => { const [x, y] = P(lo, la); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath();
      g.fillStyle = k === 'gl' ? '#e8eef5' : k === 'au' ? '#b59b62' : k === 'af' ? '#a39a58' : '#4f8a4c'; g.fill();
    }
    g.fillStyle = '#eef3fa'; g.fillRect(0, 0, W, H * 0.045); g.fillRect(0, H * 0.935, W, H * 0.07);
    const R = rng(3); g.fillStyle = 'rgba(255,255,255,.18)';
    for (let i = 0; i < 60; i++) { g.beginPath(); g.ellipse(R() * W, R() * H, 20 + R() * 50, 5 + R() * 10, 0, 0, 7); g.fill(); }
  });
  return new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg / 2), new THREE.MeshLambertMaterial({ map: t.tex }));
}

// ---------------------------------------------------------------- the Moon as you see it, painted pixel by pixel
// e: elongation; pa: direction of the sunward side on screen (0 = right, π/2 = up); es: earthshine 0..1;
// rot: where the Moon's north points on screen (0 = up, positive = turned anticlockwise); lon0, lat0: libration.
const OFF = new Map();
export function paintMoon(g, cx, cy, R, o = {}) {
  const { e = Math.PI, pa = 0, es = 0, rot = 0, lon0 = 0, lat0 = 0, glow = true } = o;
  R = Math.max(4, Math.round(R)); const D = 2 * R;
  let c = OFF.get(D); if (!c) { c = document.createElement('canvas'); c.width = c.height = D; OFF.set(D, c); }
  const cg = c.getContext('2d'), img = cg.createImageData(D, D), d = img.data, A = albedo();
  const sx = Math.sin(e) * Math.cos(pa), sy = Math.sin(e) * Math.sin(pa), sz = -Math.cos(e);
  const cr = Math.cos(rot), sr = Math.sin(rot), cl = Math.cos(lon0), sl = Math.sin(lon0), cb = Math.cos(lat0), sb = Math.sin(lat0);
  for (let py = 0; py < D; py++) for (let px = 0; px < D; px++) {
    const x = (px + 0.5 - R) / R, y = (R - py - 0.5) / R, r2 = x * x + y * y;
    if (r2 > 1.0) continue;
    const z = Math.sqrt(1 - r2), lam = x * sx + y * sy + z * sz;
    const lit = smooth((lam + 0.02) / 0.09) * (0.78 + 0.22 * Math.max(0, lam));
    const bx = x * cr + y * sr, by = -x * sr + y * cr;
    const by2 = by * cb + z * sb, bz2 = -by * sb + z * cb;
    const bx3 = bx * cl + bz2 * sl, bz3 = -bx * sl + bz2 * cl;
    let u = Math.atan2(bz3, -bx3) / TAU; if (u < 0) u += 1;
    const v = Math.acos(clamp(by2, -1, 1)) / Math.PI;
    const a = A.a[Math.min(A.h - 1, (v * A.h) | 0) * A.w + Math.min(A.w - 1, (u * A.w) | 0)];
    const sh = es * 0.12 * (1 - lit), edge = clamp((1 - Math.sqrt(r2)) * R * 1.2, 0, 1);
    const i = (py * D + px) * 4;
    d[i] = 255 * clamp(a * (lit * 1.08 + sh * 0.85) + 0.012, 0, 1);
    d[i + 1] = 255 * clamp(a * (lit * 1.05 + sh * 0.92) + 0.014, 0, 1);
    d[i + 2] = 255 * clamp(a * (lit * 0.98 + sh * 1.1) + 0.02, 0, 1);
    d[i + 3] = 255 * edge;
  }
  cg.putImageData(img, 0, 0);
  if (glow) { const k = illum(e); const gr = g.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.7); gr.addColorStop(0, `rgba(230,236,255,${0.12 * k})`); gr.addColorStop(1, 'rgba(230,236,255,0)'); g.fillStyle = gr; g.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4); }
  g.drawImage(c, cx - R, cy - R);
}

// ---------------------------------------------------------------- a card locked to a screen corner
export class Card {
  constructor(w = 768, h = 768) {
    this.ct = canvasTexture(w, h, (g, W, H, fn) => { g.clearRect(0, 0, W, H); if (fn) fn(g, W, H); });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, h / w), new THREE.MeshBasicMaterial({ map: this.ct.tex, toneMapped: false, transparent: true }));
    this.key = '';
  }
  show(key, fn) { if (key === this.key) return; this.key = key; this.ct.redraw(fn); }
}
export function cardFrame(g, W, H, title) {
  g.fillStyle = 'rgba(5,7,14,.88)'; roundRect(g, 2, 2, W - 4, H - 4, 26); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = 3; roundRect(g, 2, 2, W - 4, H - 4, 26); g.stroke();
  if (title) { g.fillStyle = 'rgba(255,255,255,.72)'; g.font = '500 30px Geist, system-ui, sans-serif'; g.textAlign = 'left'; g.fillText(title, 30, 52); }
}
export function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
export function text(g, s, x, y, { size = 30, weight = 500, color = '#eef0f6', align = 'center', serif = false } = {}) {
  g.fillStyle = color; g.textAlign = align; g.font = `${weight} ${size}px ${serif ? "'Instrument Serif', Georgia, serif" : 'Geist, system-ui, sans-serif'}`; g.fillText(s, x, y);
}
// A plane locked to a corner of the screen. Call mesh.userData.update() every frame after the camera moves.
export function hud(stage, mesh, { size = 0.34, corner = 'br', dist = 4 } = {}) {
  stage.root.add(mesh);
  mesh.renderOrder = 999; mesh.material.depthTest = false; mesh.material.depthWrite = false; mesh.frustumCulled = false;
  const aspect = mesh.geometry.parameters.height / mesh.geometry.parameters.width;
  mesh.userData.update = () => {
    const cam = stage.camera, hh = dist * Math.tan((cam.fov * DEG) / 2), hw = hh * cam.aspect;
    const s = Math.min(size * 2 * hh, (hw * 2 * 0.46)), m = 0.04 * hh, sh = s * aspect;
    const sx = corner.includes('r') ? 1 : -1, sy = corner.includes('b') ? -1 : 1;
    const off = V(sx * (hw - s / 2 - m), sy * (hh - sh / 2 - m * (sy < 0 ? 4.2 : 3.5)), -dist);
    mesh.position.copy(off.applyQuaternion(cam.quaternion).add(cam.position));
    mesh.quaternion.copy(cam.quaternion); mesh.scale.setScalar(s);
  };
  return mesh;
}

// ---------------------------------------------------------------- small 3D helpers
export function stars(n = 900, r = 900, seed = 7) {
  const R = rng(seed), pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const u = R() * 2 - 1, a = R() * TAU, q = Math.sqrt(1 - u * u); pos.set([q * Math.cos(a) * r, u * r, q * Math.sin(a) * r], i * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const p = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xcfd8ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.75, depthWrite: false }));
  p.frustumCulled = false; return p;
}
export function glowSprite(color, size) {
  const t = canvasTexture(128, 128, (g) => { const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,230,160,.55)'); r.addColorStop(1, 'rgba(255,200,100,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t.tex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  s.scale.setScalar(size); return s;
}
export function sunBall(r = 4) { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), M.glow(0xffe29a)), glowSprite(0xffffff, r * 6)); return g; }
export function ringLine(R, color, opacity = 0.5, n = 200) {
  const pts = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU; pts.push(V(R * Math.cos(a), 0, -R * Math.sin(a))); }
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
}
export function lineBetween(a, b, color, opacity = 0.6, dashed = false) {
  const mat = dashed ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.35, gapSize: 0.25 }) : new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), mat);
  if (dashed) l.computeLineDistances();
  l.frustumCulled = false; return l;
}
export function setLine(l, a, b) { const p = l.geometry.attributes.position; p.setXYZ(0, a.x, a.y, a.z); p.setXYZ(1, b.x, b.y, b.z); p.needsUpdate = true; if (l.material.isLineDashedMaterial) l.computeLineDistances(); }
// A thin ring around a sphere of radius r, facing direction dir (a great circle).
export function greatCircle(r, color, opacity = 0.95) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(r, Math.max(0.008, r * 0.03), 8, 120), M.glow(color, { transparent: true, opacity }));
  m.face = (dir) => { m.quaternion.setFromUnitVectors(V(0, 0, 1), dir.clone().normalize()); return m; };
  return m;
}
// Turn a mesh so its local +z (the Moon's near side) points at a target, keeping north along `up`.
export function faceTo(obj, target, up = V(0, 1, 0)) { obj.up.copy(up); obj.lookAt(target); }

// A space scene: black sky, stars, a little fill light. Sunlight is added by the chapter.
export function setupSpace(stage, { fov = 42, maxDist = 400, amb = 0.06 } = {}) {
  stage.setWorldMode(true);
  stage.scene.background = new THREE.Color(0x05060b);
  stage.camera.fov = fov; stage.camera.updateProjectionMatrix();
  stage.controls.maxDistance = maxDist; stage.controls.minDistance = 0.5;
  stage.root.add(new THREE.AmbientLight(0x9fb4e8, amb));
  stage.root.add(stars());
}
// Sunlight arriving along +x (the Sun is far off on the -x side). Returns the light.
export function sunlight(stage, intensity = 3.2, from = V(-1, 0, 0)) {
  const dl = new THREE.DirectionalLight(0xfff4e0, intensity);
  dl.position.copy(from).multiplyScalar(100); stage.root.add(dl); stage.root.add(dl.target);
  return dl;
}

// ---------------------------------------------------------------- the sky from the ground
// Local frame: East = +x, Up = +y, South = +z (North = -z). Sun and Moon are kept on the celestial equator
// (as at an equinox, ignoring the Moon's 5° tilt), which is enough to show rising times and the crescent's tilt.
// `age` is the Moon's age at local noon; the Moon keeps moving east through the day.
export function skyDir(H, lat, out = V(0, 0, 0)) { // H = hour angle (rad), lat in rad, declination 0
  return out.set(-Math.sin(H), Math.cos(lat) * Math.cos(H), Math.sin(lat) * Math.cos(H));
}
export const poleDir = (lat) => V(0, Math.sin(lat), -Math.cos(lat));
const COMPASS = [['N', [0, 0, -1]], ['E', [1, 0, 0]], ['S', [0, 0, 1]], ['W', [-1, 0, 0]], ['NE', [0.707, 0, -0.707]], ['SE', [0.707, 0, 0.707]], ['SW', [-0.707, 0, 0.707]], ['NW', [-0.707, 0, -0.707]]];
export const compassName = (v) => { const a = Math.atan2(v.x, -v.z) / DEG; const n = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west']; return n[Math.round(((a + 360) % 360) / 45) % 8]; };

// Where the sunward side of the Moon points as you look at it, and where its north points.
export function skyAngles(m, sDir, pole) {
  const Y = V(0, 1, 0), uS = Y.clone().addScaledVector(m, -Y.dot(m)).normalize(), rS = m.clone().cross(uS).normalize();
  const t = sDir.clone().addScaledVector(m, -sDir.dot(m)), p = pole.clone().addScaledVector(m, -pole.dot(m));
  return { pa: Math.atan2(t.dot(uS), t.dot(rS)), rot: Math.atan2(-p.dot(rS), p.dot(uS)) };
}

export function buildSky(stage, { moonR = 1.5, dist = 26 } = {}) {
  stage.setWorldMode(true);
  stage.camera.fov = 62; stage.camera.updateProjectionMatrix();
  stage.controls.maxDistance = 12; stage.controls.minDistance = 0.5;
  const root = new THREE.Group(); stage.root.add(root);
  const domeMat = new THREE.MeshBasicMaterial({ color: 0x05070d, side: THREE.BackSide, depthWrite: false, fog: false });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(60, 48, 24), domeMat); root.add(dome);
  const st = stars(1100, 55, 9); root.add(st);
  const glowCan = canvasTexture(16, 256, (g, W, H) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,1)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 14, 64, 1, true), new THREE.MeshBasicMaterial({ map: glowCan.tex, color: 0xff9a5a, transparent: true, opacity: 0, side: THREE.BackSide, depthWrite: false, toneMapped: false }));
  band.position.y = 6.9; root.add(band);
  const groundMat = new THREE.MeshBasicMaterial({ color: 0x10141a });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(58, 64), groundMat); ground.rotation.x = -Math.PI / 2; root.add(ground);
  const hz = ringLine(57.5, 0x8f9bb5, 0.35); hz.position.y = 0.02; root.add(hz);
  // a few hills and trees so the horizon reads as land
  const R = rng(4), hills = new THREE.Group(), hillMat = new THREE.MeshBasicMaterial({ color: 0x0b0e13 });
  for (let i = 0; i < 26; i++) { const a = R() * TAU, h = 1 + R() * 3.5, w = 6 + R() * 10; const m = new THREE.Mesh(new THREE.ConeGeometry(w, h, 12), hillMat); m.position.set(Math.cos(a) * 52, h / 2 - 0.2, Math.sin(a) * 52); hills.add(m); }
  root.add(hills);
  COMPASS.forEach(([n, d]) => stage.label(n, [d[0] * 20, 0.5, d[2] * 20], root, n.length === 1 ? 'hot' : ''));
  // the path the Sun and Moon follow today (celestial equator)
  const pathGeo = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 121 }, () => V(0, 0, 0)));
  const path = new THREE.Line(pathGeo, new THREE.LineDashedMaterial({ color: 0xc49bff, transparent: true, opacity: 0.45, dashSize: 0.8, gapSize: 0.6, depthWrite: false })); path.frustumCulled = false; root.add(path);
  const sun = sunBall(1.6); root.add(sun);
  const dl = new THREE.DirectionalLight(0xfff4e0, 3.4); root.add(dl); root.add(dl.target);
  root.add(new THREE.AmbientLight(0x9fb4e8, 0.02));
  const moon = moonMesh(moonR, 64); root.add(moon);
  const esMat = moon.material; esMat.emissive = new THREE.Color(0x2a3550); esMat.emissiveMap = esMat.map;
  const lSun = stage.label('Sun', [0, 0, 0], root), lMoon = stage.label('Moon', [0, 0, 0], root, 'hot');
  const tmp = V(0, 0, 0);
  let lastLat = null;
  const api = {
    root, moon, sun, dl, dome, ground,
    sDir: V(1, 0, 0), mDir: V(1, 0, 0), pole: V(0, 1, 0), info: {},
    // hours: local solar time; age: days since new moon; lat: degrees
    update({ hours, age, lat, earthshine = true }) {
      const L = lat * DEG, e = elongOfAge(age + (hours - 12) / 24), Hs = (hours - 12) * 15 * DEG, Hm = Hs - e;
      skyDir(Hs, L, api.sDir); skyDir(Hm, L, api.mDir); api.pole.copy(poleDir(L));
      if (lastLat !== lat) {
        lastLat = lat; const p = pathGeo.attributes.position;
        for (let i = 0; i <= 120; i++) { skyDir((i / 120) * TAU, L, tmp).multiplyScalar(dist + 0.5); p.setXYZ(i, tmp.x, tmp.y, tmp.z); }
        p.needsUpdate = true; path.computeLineDistances(); pathGeo.computeBoundingSphere();
      }
      sun.position.copy(api.sDir).multiplyScalar(dist + 6); sun.visible = api.sDir.y > -0.12;
      dl.position.copy(api.sDir).multiplyScalar(100);
      moon.position.copy(api.mDir).multiplyScalar(dist);
      faceTo(moon, V(0, 0, 0), api.pole);
      esMat.emissiveIntensity = earthshine ? 0.18 * (1 + Math.cos(e)) / 2 : 0;
      lSun.position.copy(api.sDir).multiplyScalar(dist + 6).add(V(0, 2.6, 0)); lSun.visible = api.sDir.y > 0;
      lMoon.position.copy(moon.position).add(V(0, moonR + 1.1, 0)); lMoon.visible = api.mDir.y > -0.02;
      // sky colour from the Sun's altitude
      const alt = Math.asin(clamp(api.sDir.y, -1, 1)) / DEG;
      const day = smooth((alt + 6) / 14), dusk = Math.max(0, 1 - Math.abs(alt + 2) / 9);
      const c = new THREE.Color(0x04060c).lerp(new THREE.Color(0x3f78b8), day);
      domeMat.color.copy(c); st.material.opacity = 0.8 * (1 - smooth((alt + 12) / 12));
      band.material.opacity = dusk * 0.75; band.rotation.y = Math.atan2(api.sDir.x, api.sDir.z);
      groundMat.color.set(0x0b0e13).lerp(new THREE.Color(0x26302a), day);
      hillMat.color.set(0x07090c).lerp(new THREE.Color(0x1b231e), day);
      const ang = skyAngles(api.mDir, api.sDir, api.pole);
      api.info = { e, alt, moonAlt: Math.asin(clamp(api.mDir.y, -1, 1)) / DEG, sunAlt: alt, pa: ang.pa, rot: ang.rot, day };
      return api.info;
    },
  };
  return api;
}
// Rough rise, high point and set times (hours) for a Moon of this age at local noon, on the celestial equator.
// The Moon keeps moving east while Earth turns, so it gains on the Sun at 15 - 15/29.53 degrees per hour.
export function moonTimes(age) {
  const e = elongOfAge(age) / DEG, rate = 15 - 15 / K.SYN, P = 360 / rate, w = (h) => ((h % P) + P) % P;
  return { rise: w(12 + (e - 90) / rate), high: w(12 + e / rate), set: w(12 + (e + 90) / rate) };
}
