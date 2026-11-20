// Chapter 1: the Sun always lights half the Moon. As the Moon goes round Earth we see different amounts of that
// lit half. The fraction of the disc that looks lit is (1 - cos e) / 2, where e is the elongation, the angle
// between the Sun and the Moon as seen from Earth (the phase angle, Sun–Moon–Earth, is close to 180° − e).
// Not to scale: the real Moon is about 30 Earth widths away and a quarter of Earth's width.
import { THREE, M, K, COL, V, TAU, DEG, illum, phaseName, earthMesh, moonMesh, sunBall, ringLine, lineBetween, setLine, greatCircle, faceTo, setupSpace, sunlight, Card, cardFrame, paintMoon, text, hud } from '../moon.js';

const R = 7, MR = 0.55;
const VIEWS = {
  above: { pos: [3, 15, 13], target: [0, 0, 0] },
  side: { pos: [-2, 3.2, 12], target: [0, 0, 0] },
};
const moonAt = (day, out = V(0, 0, 0)) => { const a = Math.PI + (day / K.SYN) * TAU; return out.set(R * Math.cos(a), 0, -R * Math.sin(a)); };

export function viewFromEarth(card, e, title = 'Seen from Earth', es = 0) {
  const k = illum(e), name = phaseName(e);
  card.show([e.toFixed(3), title, es.toFixed(2)].join(), (g, W, H) => {
    cardFrame(g, W, H, title);
    paintMoon(g, W / 2, H * 0.47, W * 0.3, { e, pa: e < Math.PI ? 0 : Math.PI, es });
    text(g, name, W / 2, H - 92, { size: 46, serif: true });
    text(g, `${Math.round(k * 100)}% of the disc lit`, W / 2, H - 42, { size: 30, color: '#ffb547' });
  });
}

export default {
  id: 'lit',
  short: 'Half lit, always',
  title: 'Half lit, always',
  subtitle: 'The Sun always lights half the Moon. We just see different amounts of that half.',
  view: VIEWS.above,
  learn: `<p>The Moon makes no light of its own. It shines because <b>sunlight</b> bounces off its grey rock. Like any ball in sunshine, <b>one half is always lit</b> and the other half is in night. That never changes.</p>
    <p>What changes is <b>where we stand</b>. The Moon goes round Earth about once a month. When it sits between us and the Sun, its lit half faces away and we see almost nothing: a <b>new moon</b>. A quarter of the way round we see half of the lit half. When it is on the far side of Earth from the Sun, the whole lit half faces us: a <b>full moon</b>.</p>
    <p>So the shape you see depends on one angle: how far the Moon is from the Sun in our sky. The share of the disc that looks lit is <span class="formula">(1 − cos e) ÷ 2</span>, where <b>e</b> is that angle.</p>
    <p class="tip"><b>Try it:</b> drag the <b>day</b> slider. The gold ring on the Moon marks the edge of its daylight. The blue ring marks the half that faces Earth. The phase is the overlap. Then press <b>Stand on Earth</b>.</p>
    <p class="note">Not to scale. The real Moon is about 384,000 km away, about 30 Earth widths, and only a quarter as wide as Earth.</p>`,
  terms: [
    { t: 'Phase', d: 'The shape of the lit part of the Moon as seen from Earth.' },
    { t: 'Terminator', d: 'The line between day and night on the Moon. Its curve gives the crescent and gibbous shapes.' },
    { t: 'Elongation', d: 'The angle between the Sun and the Moon as seen from Earth: 0° at new moon, 180° at full.' },
    { t: 'Illuminated fraction', d: 'The share of the Moon’s disc that looks lit, from 0% at new moon to 100% at full.' },
  ],
  defaults: { day: 4, play: false, rings: true, ghosts: false },
  controls: [
    { key: 'day', type: 'range', label: 'Day of the month', min: 0, max: 29.5, step: 0.05, fmt: (v) => `day ${v.toFixed(1)}` , ends: ['new moon', 'new moon again'] },
    { key: 'play', type: 'toggle', label: 'Play' },
    { key: 'rings', type: 'toggle', label: 'Show the lit half and the half facing Earth' },
    { key: 'ghosts', type: 'toggle', label: 'Show eight Moons around the orbit', hint: 'Every one of them is half lit, on the side facing the Sun.' },
    { key: 'v', type: 'buttons', label: 'Camera', items: [{ label: 'From above', act: (s, i) => i.look('above') }, { label: 'From the side', act: (s, i) => i.look('side') }, { label: 'Stand on Earth', act: (s, i) => i.look('earth') }] },
  ],
  quiz: [
    { q: 'How much of the Moon does the Sun light at a new moon?', options: ['None of it', 'Half of it, the side facing away from us', 'All of it', 'A thin crescent'], answer: 1, why: 'The Sun always lights half the Moon. At new moon that lit half faces away from Earth, so we see the dark side.' },
    { q: 'What decides the phase you see?', options: ['How much of the Moon Earth’s shadow covers', 'The angle between the Sun and the Moon as seen from Earth', 'How far the Moon is from Earth', 'Clouds on the Moon'], answer: 1, why: 'The phase depends on how much of the lit half faces us, which is set by the Sun–Earth–Moon angle.' },
    { q: 'At first quarter, how much of the disc looks lit?', options: ['A quarter', 'Half', 'Three quarters', 'All of it'], answer: 1, why: 'It is called a quarter because the Moon is a quarter of the way round its orbit. We see half the disc lit: (1 − cos 90°) ÷ 2 = 0.5.' },
  ],
  reel: [
    { ms: 5200, caption: 'The Sun always lights exactly half the Moon. Always.', set: { rings: true, ghosts: true, play: false }, anim: { day: [1, 28] }, view: VIEWS.above, spin: 0.3 },
    { ms: 5400, caption: 'What changes is how much of that lit half is turned towards us.', set: { rings: true, ghosts: false, play: false }, anim: { day: [2, 14.7] }, view: { pos: [2, 6, 10], target: [0, 0, 0] }, spin: 0 },
  ],
  build({ stage, s }) {
    setupSpace(stage);
    sunlight(stage);
    const root = new THREE.Group(); stage.root.add(root);
    const earth = earthMesh(1.2); root.add(earth);
    const moon = moonMesh(MR); root.add(moon);
    root.add(ringLine(R, 0xffffff, 0.22));
    const sun = sunBall(4); sun.position.set(-90, 0, 0); root.add(sun);
    // parallel sunlight
    for (const z of [-6, -3, 0, 3, 6]) for (const y of [-1.2, 1.2]) root.add(lineBetween(V(-14, y, z), V(-9.5, y, z), COL.sun, 0.45));
    stage.label('Sunlight →', [-12, 2.2, 0], root, 'hot');
    stage.label('Earth', [0, 1.9, 0], root);
    const lMoon = stage.label('Moon', [0, 1.1, 0], moon, 'hot');
    const ringLit = greatCircle(MR * 1.04, COL.lit), ringSee = greatCircle(MR * 1.06, COL.see);
    root.add(ringLit, ringSee);
    const sight = lineBetween(V(0, 0, 0), V(1, 0, 0), COL.see, 0.5, true); root.add(sight);
    const ghosts = new THREE.Group(); root.add(ghosts);
    const gl = [];
    for (let i = 0; i < 8; i++) {
      const m = moonMesh(MR * 0.8, 32); const p = moonAt((i / 8) * K.SYN); m.position.copy(p); faceTo(m, V(0, 0, 0)); ghosts.add(m);
      gl.push(stage.label(['New', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full', 'Waning gibbous', 'Last quarter', 'Waning crescent'][i], [p.x * 1.25, 0.9, p.z * 1.25], ghosts));
    }
    const card = new Card(512, 560); hud(stage, card.mesh, { size: 0.3 });
    const p = V(0, 0, 0);
    void lMoon; void gl; void M; void DEG;
    return {
      look(k) {
        if (k !== 'earth') return stage.setView(VIEWS[k].pos, VIEWS[k].target, 1.1);
        const d = moon.position.clone().normalize(), c = d.clone().multiplyScalar(0.3).add(V(0, 2.2, 0));
        stage.setView(c.toArray(), moon.position.toArray(), 1.1);
      },
      update(dt, st) {
        if (st.play) { st.day += dt * 2.2; if (st.day > K.SYN) st.day -= K.SYN; }
        earth.rotation.y += dt * 0.4;
        moonAt(st.day, p); moon.position.copy(p); faceTo(moon, V(0, 0, 0));
        ringLit.position.copy(p); ringLit.face(V(-1, 0, 0));
        ringSee.position.copy(p); ringSee.face(p.clone().negate());
        ringLit.visible = ringSee.visible = st.rings;
        setLine(sight, V(0, 0, 0), p); sight.visible = st.rings;
        ghosts.visible = st.ghosts;
        const e = (st.day / K.SYN) * TAU;
        viewFromEarth(card, e);
        card.mesh.userData.update();
      },
      readout(st) {
        const e = (st.day / K.SYN) * TAU, k = illum(e);
        const say = k < 0.03 ? 'The lit half faces away from us. We are looking at the Moon’s night side.' : k > 0.97 ? 'The whole lit half faces us.' : `We see ${Math.round(k * 100)}% of the lit half from here. The rest is around the side, out of view.`;
        return `<div class="big">${phaseName(e)}</div><p class="r-say">${say}</p>
          <div class="row"><span>Lit by the Sun</span><b>50% of the Moon, always</b></div>
          <div class="row"><span>Sun–Moon angle seen from Earth</span><b>${Math.round(e / DEG) % 360}°</b></div>
          <div class="row"><span>Disc that looks lit</span><b>${Math.round(k * 100)}%</b></div>
          <div class="row"><span>Days since new moon</span><b>${st.day.toFixed(1)} of ${K.SYN.toFixed(1)}</b></div>`;
      },
    };
  },
};
