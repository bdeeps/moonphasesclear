// Chapter 6: myths and calendars.
// - Phases are not Earth's shadow. Earth's shadow points away from the Sun, so the Moon can only enter it at full
//   moon, and only when the full moon is near a node of its orbit (tilted about 5.1°): a lunar eclipse.
// - Supermoon: a full moon near perigee. Perigee distances run from about 356,400 to 370,400 km, apogee from about
//   404,000 to 406,700 km. Apparent size scales as 1/distance, brightness roughly as 1/distance².
// - Calendars: 12 synodic months = 354.37 days, about 11 days short of a 365.24-day year. A purely lunar calendar
//   (the Islamic Hijri calendar) drifts through the seasons and comes back after about 33 years. Lunisolar
//   calendars (Chinese, Hebrew, many Hindu calendars) add a leap month about 7 times in 19 years (235 months ≈ 19 years).
import { THREE, K, COL, V, TAU, DEG, clamp, illum, phaseName, earthMesh, moonMesh, sunBall, ringLine, faceTo, setupSpace, sunlight, Card, cardFrame, paintMoon, text, hud, fmtKm } from '../moon.js';

const R = 7, MR = 0.5, INC = K.incl * 3; // tilt drawn three times as large so you can see it
const VIEWS = { side: { pos: [9, 4, 9], target: [2, 0, 0] }, above: { pos: [3, 15, 12], target: [0, 0, 0] } };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const lunarYear = 12 * K.SYN;

function moonPos(day, node, out = V(0, 0, 0)) {
  const a = Math.PI + (day / K.SYN) * TAU, u = a - node, i = INC * DEG;
  return out.set(R * Math.cos(a), R * Math.sin(u) * Math.sin(i), -R * Math.sin(a));
}

export default {
  id: 'myths',
  short: 'Myths and calendars',
  title: 'Shadows, supermoons and calendars',
  subtitle: 'The phases are not Earth’s shadow. And half the world’s calendars follow the Moon.',
  view: VIEWS.side,
  learn: `<p>A common idea is that the phases are <b>Earth’s shadow</b> falling on the Moon. They are not. Earth’s shadow points straight away from the Sun, so the Moon could only enter it at <b>full moon</b>. Because the Moon’s orbit is tilted by about 5°, it usually passes just above or below the shadow. When it does pass through, that is a <b>lunar eclipse</b>, and the edge of the shadow looks quite different from the phases. See how eclipses work in <a href="/eclipseclear/#lunar">EclipseClear</a>.</p>
    <p>A <b>supermoon</b> is a full moon close to <b>perigee</b>, the nearest point of the Moon’s slightly oval orbit, usually around 357,000 to 370,000 km away. At <b>apogee</b> it is about 404,000 to 407,000 km away. A full moon near perigee looks about 14% wider than one near apogee. Side by side the difference is clear, but in the sky it is hard to notice. A <b>blue moon</b> is not blue: today it usually means the second full moon in one calendar month, which happens every two to three years because most months are a day or two longer than 29.5 days.</p>
    <p>Many calendars count months by the Moon. Twelve lunar months make about <b>354 days</b>, about 11 days short of a solar year. The <b>Islamic Hijri calendar</b> keeps purely to the Moon, with each month traditionally beginning when the new crescent is seen. So Ramadan comes about 11 days earlier each year and moves through all the seasons in about 33 years. The <b>Chinese</b>, <b>Hebrew</b> and many <b>Hindu</b> calendars are <b>lunisolar</b>: they add an extra month about seven times every 19 years, so festivals stay in their seasons.</p>
    <p class="tip"><b>Try it:</b> in <b>Earth’s shadow</b>, slide the <b>days</b> and the <b>nodes</b> until the Moon enters the purple shadow. Then try the other two topics.</p>`,
  terms: [
    { t: 'Lunar eclipse', d: 'The Moon passes through Earth’s shadow. It can only happen at full moon, and not every full moon.' },
    { t: 'Perigee and apogee', d: 'The nearest and farthest points of the Moon’s orbit from Earth.' },
    { t: 'Supermoon', d: 'A popular name for a full or new moon near perigee. It looks slightly bigger and brighter.' },
    { t: 'Blue moon', d: 'Usually the second full moon in a calendar month. An older meaning is the third of four full moons in a season.' },
    { t: 'Lunisolar calendar', d: 'A calendar of lunar months that adds a leap month now and then to keep in step with the seasons.' },
  ],
  defaults: { topic: 'shadow', day: 9, node: 0.6, dist: 362000, years: 0 },
  onChange(s, key) { if (key === 'topic') { if (s.topic === 'super') s.day = K.SYN / 2; } },
  controls: [
    { key: 'topic', type: 'seg', label: 'Topic', options: [{ v: 'shadow', label: 'Earth’s shadow' }, { v: 'super', label: 'Supermoons' }, { v: 'calendar', label: 'Moon calendars' }] },
    { key: 'day', type: 'range', label: 'Days (Earth’s shadow)', min: 0, max: 29.5, step: 0.05, fmt: (v) => `day ${v.toFixed(1)} · ${phaseName((v / K.SYN) * TAU).toLowerCase()}` },
    { key: 'node', type: 'range', label: 'Nodes: where the Moon’s orbit crosses Earth’s (Earth’s shadow)', min: 0, max: 3.14, step: 0.01, fmt: (v) => `${Math.round(v / DEG)}°`, hint: 'The nodes slowly turn round, once in about 18.6 years.' },
    { key: 'dist', type: 'range', label: 'Moon’s distance (Supermoons)', min: 356400, max: 406700, step: 100, fmt: (v) => `${fmtKm(v)} km`, ends: ['closest perigee', 'farthest apogee'] },
    { key: 'years', type: 'range', label: 'Years from now (Moon calendars)', min: 0, max: 36, step: 0.05, fmt: (v) => `${v.toFixed(1)} years` },
  ],
  quiz: [
    { q: 'Are the Moon’s phases caused by Earth’s shadow?', options: ['Yes, always', 'No. Earth’s shadow only reaches the Moon in a lunar eclipse, at full moon', 'Only the crescent phases', 'Only in winter'], answer: 1, why: 'The phases come from how much of the sunlit half we see. Earth’s shadow points away from the Sun and touches the Moon only in eclipses.' },
    { q: 'What makes a supermoon?', options: ['A full moon near the closest point of the Moon’s orbit', 'A full moon in a leap year', 'A blue-coloured Moon', 'Two full moons in a week'], answer: 0, why: 'The orbit is slightly oval. A full moon near perigee looks a little larger and brighter than usual.' },
    { q: 'Why does Ramadan come about 11 days earlier each year in the Gregorian calendar?', options: ['Because 12 lunar months are about 354 days, 11 short of a solar year', 'Because the Moon is slowing down', 'Because of leap years', 'It does not move'], answer: 0, why: 'The Hijri calendar follows the Moon alone, so its year is about 354 or 355 days and slides through the seasons.' },
    { q: 'How do lunisolar calendars such as the Chinese and Hebrew calendars stay with the seasons?', options: ['They ignore the Moon', 'They add a leap month about 7 times in 19 years', 'They add 11 days every December', 'They skip a month every year'], answer: 1, why: '235 lunar months are almost exactly 19 years, so adding 7 extra months in 19 years keeps the months in season.' },
  ],
  reel: [
    { ms: 5400, caption: 'The dark part is not Earth’s shadow. The shadow only reaches the Moon in a lunar eclipse.', set: { topic: 'shadow', node: 0, day: 12 }, anim: { day: [12, 14.77] }, view: VIEWS.side, spin: 0 },
    { ms: 5000, caption: 'Twelve moons make 354 days, so a Moon-only calendar slides 11 days a year through the seasons.', set: { topic: 'calendar', day: 14.77, node: 0.6 }, anim: { years: [0, 33] }, view: VIEWS.above, spin: 0.3 },
  ],
  build({ stage, s }) {
    setupSpace(stage);
    sunlight(stage);
    const root = new THREE.Group(); stage.root.add(root);
    const earth = earthMesh(1.2); root.add(earth);
    const ecl = ringLine(R, 0xffffff, 0.16); root.add(ecl);
    const orbit = ringLine(R, COL.violet, 0.55); root.add(orbit);
    const sun = sunBall(4); sun.position.set(-90, 0, 0); root.add(sun);
    stage.label('Sunlight →', [-10, 1.8, 0], root, 'hot');
    stage.label('Earth', [0, 1.9, 0], root);
    // Earth's umbra, pointing away from the Sun (drawn short and wide enough to see)
    const um = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 1.2, 10, 48, 1, true), new THREE.MeshBasicMaterial({ color: COL.violet, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }));
    um.rotation.z = -Math.PI / 2; um.position.x = 5.8; root.add(um);
    const lUm = stage.label('Earth’s shadow', [9.5, 1.2, 0], root, 'hot');
    const moon = moonMesh(MR); root.add(moon);
    const lMoon = stage.label('Moon', [0, 0, 0], root);
    const nodes = new THREE.Group(); root.add(nodes);
    for (const sg of [1, -1]) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), new THREE.MeshBasicMaterial({ color: COL.lime })); m.userData.sg = sg; nodes.add(m); }
    const lNode = stage.label('node', [0, 0, 0], root);
    const card = new Card(600, 560); hud(stage, card.mesh, { size: 0.32 });
    const p = V(0, 0, 0);
    const inShadow = (st) => { moonPos(st.day, st.node, p); const r = 1.2 - p.x * 0.086; return p.x > 0 && Math.hypot(p.y, p.z) < r; };
    return {
      update(dt, st) {
        earth.rotation.y += dt * 0.4;
        const n = st.node, i = INC * DEG;
        orbit.rotation.set(0, 0, 0); orbit.rotateY(n); orbit.rotateX(i);
        moonPos(st.day, n, p); moon.position.copy(p); faceTo(moon, V(0, 0, 0));
        lMoon.position.copy(p).add(V(0, MR + 0.5, 0));
        nodes.children.forEach((m) => m.position.set(m.userData.sg * R * Math.cos(n), 0, -m.userData.sg * R * Math.sin(n)));
        lNode.position.set(R * Math.cos(n), 0.6, -R * Math.sin(n));
        um.visible = lUm.visible = st.topic === 'shadow';
        const e = (st.day / K.SYN) * TAU, shadow = inShadow(st);
        if (st.topic === 'shadow') {
          card.show(['sh', e.toFixed(3), shadow].join(), (g, W, H) => {
            cardFrame(g, W, H, 'Seen from Earth');
            paintMoon(g, W / 2, H * 0.43, W * 0.26, { e, pa: e < Math.PI ? 0 : Math.PI });
            if (shadow) { g.fillStyle = 'rgba(120,20,10,.55)'; g.beginPath(); g.arc(W / 2, H * 0.43, W * 0.26, 0, TAU); g.fill(); }
            text(g, shadow ? 'Lunar eclipse!' : phaseName(e), W / 2, H - 92, { size: 44, serif: true });
            text(g, shadow ? 'only now is Earth’s shadow on the Moon' : 'the dark part is the Moon’s own night', W / 2, H - 44, { size: 26, color: '#ffb547' });
          });
        } else if (st.topic === 'super') {
          card.show(['su', st.dist].join(), (g, W, H) => {
            cardFrame(g, W, H, 'Full moons, to scale');
            const base = 104 * (384400 / 384400), rP = base * 384400 / 362000, rA = base * 384400 / 405500, rN = base * 384400 / st.dist;
            paintMoon(g, W * 0.27, 200, rP, { e: Math.PI }); paintMoon(g, W * 0.73, 200, rA, { e: Math.PI });
            text(g, 'near perigee', W * 0.27, 345, { size: 24, color: 'rgba(255,255,255,.7)' }); text(g, 'near apogee', W * 0.73, 345, { size: 24, color: 'rgba(255,255,255,.7)' });
            g.strokeStyle = '#ffb547'; g.lineWidth = 3; g.beginPath(); g.arc(W / 2, 450, rN * 0.55, 0, TAU); g.stroke();
            text(g, `yours: ${fmtKm(st.dist)} km`, W / 2, H - 22, { size: 24, color: '#ffb547' });
          });
        } else {
          card.show(['ca', st.years.toFixed(2)].join(), (g, W, H) => {
            cardFrame(g, W, H, 'Where the 9th lunar month starts');
            const cx = W / 2, cy = 270, r = 170;
            const seas = [['#5ce1a9', 'spring'], ['#ffb547', 'summer'], ['#ff7a59', 'autumn'], ['#8ef0ff', 'winter']];
            seas.forEach(([c], k) => { g.strokeStyle = c; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2 + (k + 0.22) * Math.PI / 2, -Math.PI / 2 + (k + 1.22) * Math.PI / 2); g.stroke(); });
            MONTHS.forEach((m, k) => { const a = -Math.PI / 2 + (k / 12) * TAU; text(g, m, cx + Math.cos(a) * (r - 40), cy + Math.sin(a) * (r - 40) + 8, { size: 20, color: 'rgba(255,255,255,.6)' }); });
            const start = 100, lunar = ((start - 10.875 * st.years) % 365.24 + 365.24) % 365.24;
            const leap = Math.floor((st.years % 19) * 7 / 19 + 0.5) ; const lsol = start + ((st.years % 19) * (lunarYear - 365.24) + leap * K.SYN) ;
            const dot = (doy, c, rr, lbl) => { const a = -Math.PI / 2 + (doy / 365.24) * TAU; g.fillStyle = c; g.beginPath(); g.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 13, 0, TAU); g.fill(); text(g, lbl, cx + Math.cos(a) * (rr + 34), cy + Math.sin(a) * (rr + 34) + 8, { size: 20, color: c }); };
            dot(lunar, '#c49bff', r + 4, 'lunar');
            dot(((lsol % 365.24) + 365.24) % 365.24, '#eef0f6', r - 80, 'lunisolar');
            text(g, `purely lunar: ${Math.round(10.875 * st.years) % 365} days earlier`, cx, H - 66, { size: 24, color: '#c49bff' });
            text(g, 'lunisolar: stays within about a month', cx, H - 30, { size: 24, color: '#eef0f6' });
          });
        }
        card.mesh.userData.update();
      },
      readout(st) {
        const e = (st.day / K.SYN) * TAU;
        if (st.topic === 'super') {
          const big = 405500 / st.dist, ang = (2 * Math.atan(K.Rm / st.dist)) / DEG;
          return `<div class="big">${st.dist < 371000 ? 'Supermoon range' : st.dist > 403000 ? 'Micromoon range' : 'In between'}</div><p class="r-say">Apparent size goes as 1 ÷ distance, brightness roughly as 1 ÷ distance squared.</p>
            <div class="row"><span>Looks</span><b>${ang.toFixed(3)}° wide</b></div>
            <div class="row"><span>Wider than at a typical apogee</span><b>${Math.round((big - 1) * 100)}%</b></div>
            <div class="row"><span>Brighter than at a typical apogee</span><b>about ${Math.round((big * big - 1) * 100)}%</b></div>
            <div class="row"><span>Perigee range</span><b>about 356,400–370,400 km</b></div>
            <div class="row"><span>Apogee range</span><b>about 404,000–406,700 km</b></div>`;
        }
        if (st.topic === 'calendar') {
          return `<div class="big">${(lunarYear).toFixed(2)}-day lunar year</div><p class="r-say">Twelve lunar months fall about 11 days short of the ${K.TROP.toFixed(2)}-day solar year.</p>
            <div class="row"><span>Drift after ${st.years.toFixed(1)} years</span><b>${Math.round((K.TROP - lunarYear) * st.years)} days</b></div>
            <div class="row"><span>Back to the same season after</span><b>about 33 years</b></div>
            <div class="row"><span>235 lunar months</span><b>${(235 * K.SYN).toFixed(1)} days</b></div>
            <div class="row"><span>19 solar years</span><b>${(19 * K.TROP).toFixed(1)} days</b></div>`;
        }
        const sh = inShadow(st);
        return `<div class="big">${sh ? 'Lunar eclipse' : phaseName(e)}</div><p class="r-say">${sh ? 'The Moon is inside Earth’s shadow. This only happens near full moon, when the Moon is also near a node.' : e > 2.9 && e < 3.4 ? 'Full moon, but it passes above or below Earth’s shadow. Slide the nodes to line it up.' : 'Earth’s shadow is nowhere near the Moon. The dark part is simply the Moon’s night side.'}</p>
          <div class="row"><span>Lit part of the disc</span><b>${Math.round(illum(e) * 100)}%</b></div>
          <div class="row"><span>Moon’s orbit tilt</span><b>about ${K.incl.toFixed(1)}° (drawn ×3)</b></div>
          <div class="row"><span>Moon in Earth’s shadow?</span><b class="${sh ? 'ok' : 'no'}">${sh ? 'yes' : 'no'}</b></div>`;
      },
    };
  },
};
void clamp;
