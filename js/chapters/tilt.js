// Chapter 4: where you stand changes how the Moon looks. The lit side always points back along the sky towards the
// Sun. After sunset the Sun is below the western horizon; at high latitudes the Sun and Moon's path slants, so the
// crescent's lit side points down and to the side. Near the equator the path is nearly vertical, so the lit side
// points straight down: a crescent lying on its back, the "smiling Moon". From the southern hemisphere you face north
// to see the Moon, so it appears rotated by about 180° compared with the view from the north.
// Simplified: Sun and Moon on the celestial equator (equinox). The lit-side angle is measured on the 3D model.
import { V, DEG, illum, phaseName, buildSky, skyDir, skyAngles, poleDir, elongOfAge, compassName, Card, cardFrame, paintMoon, text, hud } from '../moon.js';

const PLACES = [{ v: 52, label: '52°N' }, { v: 35, label: '35°N' }, { v: 1, label: 'Equator' }, { v: -34, label: '34°S' }];

function anglesAt(lat, hours, age) {
  const L = lat * DEG, e = elongOfAge(age + (hours - 12) / 24), Hs = (hours - 12) * 15 * DEG;
  const s = skyDir(Hs, L), m = skyDir(Hs - e, L);
  return { e, m, ...skyAngles(m, s, poleDir(L)), alt: Math.asin(m.y) / DEG };
}
const describe = (pa) => {
  const c = (((90 - pa / DEG) % 360) + 360) % 360; // clockwise from straight up
  if (c >= 150 && c <= 210) return 'Lit side down: a smiling Moon';
  if (c > 100 && c < 150) return 'Lit side down and to the right';
  if (c > 210 && c < 260) return 'Lit side down and to the left';
  if (c >= 60 && c <= 100) return 'Lit side to the right';
  if (c >= 260 && c <= 300) return 'Lit side to the left';
  return 'Lit side up';
};

export default {
  id: 'tilt',
  short: 'Tilted and upside down',
  title: 'The smiling Moon',
  subtitle: 'The same crescent leans differently at different latitudes, and flips south of the equator.',
  view: { pos: [1.2, 1.4, 0.4], target: [-4, 2.6, 0.2] },
  learn: `<p>The lit side of the Moon always points back towards the Sun. Just after sunset the Sun is below the western horizon, so an evening crescent’s bright edge points <b>down towards where the Sun went</b>.</p>
    <p>How it leans depends on your <b>latitude</b>. Far from the equator the Sun and Moon move along a slanted path, so the crescent leans to one side. Near the equator they rise and set almost straight up and down, so the lit edge points straight down and the horns point up: the Moon lies on its back like a <b>smile</b> or a boat.</p>
    <p>South of the equator you face <b>north</b> to see the Moon, not south. The Moon looks <b>turned round</b>: a waxing Moon is lit on the left, not the right, and the familiar face is upside down compared with what northern viewers see. Neither view is wrong. It is the same Moon from opposite sides of the globe.</p>
    <p class="tip"><b>Try it:</b> keep the evening crescent and move the <b>latitude</b> from 52°N to the equator, then to 34°S. The card compares the view here with the same moment at the opposite latitude.</p>
    <p class="note">Simplified: the Sun and the Moon follow the same path, as at the equinoxes. The tilt also changes with the season and the Moon’s orbit, so on a given night the real angle differs a little.</p>`,
  terms: [
    { t: 'Latitude', d: 'How far north or south of the equator you are, from 0° at the equator to 90° at the poles.' },
    { t: 'Smiling Moon', d: 'A crescent with its horns pointing up, common near the equator. Also called a boat Moon or Cheshire Moon.' },
    { t: 'Hemisphere', d: 'The northern or southern half of Earth. The Moon looks rotated round between the two.' },
  ],
  defaults: { lat: 52, age: 3.5, hours: 18.6, follow: true },
  controls: [
    { key: 'lat', type: 'range', label: 'Latitude', min: -60, max: 60, step: 0.5, fmt: (v) => (Math.abs(v) < 0.5 ? 'equator' : `${Math.abs(v).toFixed(0)}°${v > 0 ? 'N' : 'S'}`) },
    { key: 'lat', type: 'seg', label: 'Places', options: PLACES },
    { key: 'age', type: 'range', label: 'Moon’s age', min: 1.5, max: 28, step: 0.05, fmt: (v) => `${v.toFixed(1)} days` },
    { key: 'hours', type: 'range', label: 'Time of day', min: 0, max: 24, step: 0.02, fmt: (v) => `${String(Math.floor(v)).padStart(2, '0')}:${String(Math.round((v % 1) * 60) % 60).padStart(2, '0')}` },
    { key: 'follow', type: 'toggle', label: 'Keep looking at the Moon' },
    { key: 'pre', type: 'buttons', label: 'Moments', items: [
      { label: 'Evening crescent', act: (s) => Object.assign(s, { age: 3.5, hours: 18.6 }) },
      { label: 'First quarter at dusk', act: (s) => Object.assign(s, { age: 7.4, hours: 18.4 }) },
      { label: 'Morning crescent', act: (s) => Object.assign(s, { age: 26, hours: 5.4 }) },
    ] },
  ],
  quiz: [
    { q: 'Why does an evening crescent near the equator look like a smile?', options: ['The Moon is closer there', 'The Sun has set almost straight below it, so the lit edge points down', 'Earth’s shadow is curved', 'The air bends the light'], answer: 1, why: 'Near the equator the Sun and Moon move almost vertically, so the Sun is directly below the Moon after sunset and the lit edge faces down.' },
    { q: 'Seen from Australia, which side of a waxing Moon is lit?', options: ['The right side', 'The left side', 'The top', 'It depends on the weather'], answer: 1, why: 'From the southern hemisphere you look north at the Moon, so it appears turned round. A waxing Moon is lit on the left.' },
    { q: 'What does the lit side of the Moon always point towards?', options: ['North', 'The horizon', 'The Sun', 'Earth’s centre'], answer: 2, why: 'The Moon is lit by the Sun, so its bright edge always faces the Sun’s direction, even when the Sun is below the horizon.' },
  ],
  reel: [
    { ms: 5600, caption: 'Near the equator the evening crescent lies on its back. A smiling Moon.', set: { age: 3.5, hours: 18.6, follow: true }, anim: { lat: [52, 1] }, spin: 0 },
  ],
  build({ stage, s }) {
    const sky = buildSky(stage);
    const card = new Card(640, 470); hud(stage, card.mesh, { size: 0.36 });
    const eye = V(0, 1.5, 0);
    let follow = 0;
    return {
      update(dt, st) {
        const info = sky.update(st);
        if (st.follow) {
          // aim at the Moon, a little above it so the horizon stays in view
          const tgt = eye.clone().addScaledVector(sky.mDir, 4);
          if (tgt.y < 1.8) tgt.y = 1.8;
          const k = follow++ < 2 || document.body.classList.contains('gb-reel') ? 1 : 1 - Math.exp(-dt * 6);
          if (!stage.moved) {
            stage.tw = null;
            stage.controls.target.lerp(tgt, k);
            const back = stage.controls.target.clone().sub(eye).setY(0).normalize().multiplyScalar(-1.4).add(V(0, 1.4, 0));
            stage.camera.position.lerp(back, k);
          }
        }
        const here = anglesAt(st.lat, st.hours, st.age), there = anglesAt(-st.lat, st.hours, st.age);
        const nm = (l) => (Math.abs(l) < 0.5 ? 'Equator' : `${Math.abs(l).toFixed(0)}°${l > 0 ? 'N' : 'S'}`);
        card.show([here.pa.toFixed(2), here.rot.toFixed(2), there.pa.toFixed(2), here.e.toFixed(3), st.lat].join(), (g, W, H) => {
          cardFrame(g, W, H, 'The same Moon, the same moment');
          [[here, nm(st.lat), W * 0.27], [there, nm(-st.lat), W * 0.73]].forEach(([a, n, x]) => {
            paintMoon(g, x, 220, 112, { e: a.e, pa: a.pa, rot: a.rot, es: 0.5 });
            g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 140, 372); g.lineTo(x + 140, 372); g.stroke();
            text(g, 'horizon', x, 396, { size: 18, color: 'rgba(255,255,255,.45)' });
            text(g, n, x, 440, { size: 34, serif: true, color: a === here ? '#ffb547' : '#eef0f6' });
          });
        });
        card.mesh.userData.update();
        void info;
      },
      readout(st) {
        const a = anglesAt(st.lat, st.hours, st.age);
        const up = a.alt > 0;
        return `<div class="big">${describe(a.pa)}</div><p class="r-say">${up ? `At ${Math.abs(st.lat) < 0.5 ? 'the equator' : Math.abs(st.lat).toFixed(0) + '°' + (st.lat > 0 ? 'N' : 'S')} the Moon is ${Math.round(a.alt)}° up. Its bright edge faces the Sun, below the horizon.` : 'The Moon is below the horizon at this time. Try another time of day.'}</p>
          <div class="row"><span>Phase</span><b>${phaseName(a.e)} (${Math.round(illum(a.e) * 100)}%)</b></div>
          <div class="row"><span>Lit side points</span><b>${Math.round((((90 - a.pa / DEG) % 360) + 360) % 360)}° clockwise from straight up</b></div>
          <div class="row"><span>Look towards the</span><b>${compassName(a.m)}</b></div>`;
      },
    };
  },
};
