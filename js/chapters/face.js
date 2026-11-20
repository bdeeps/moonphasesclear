// Chapter 5: the same face. The Moon is tidally locked: it turns once on its axis per orbit, so the same side
// always faces Earth. Libration lets us peek a little round the edges: in longitude (up to about 7.9°) because the
// orbit is an ellipse and the Moon's orbital speed varies while its spin does not, and in latitude (up to about
// 6.7°) because its axis is tilted to its orbit. Over time about 59% of the surface can be seen from Earth.
// Earthshine: sunlight reflected by Earth lights the Moon's night side, brightest near new moon when Earth,
// seen from the Moon, is nearly full. Libration here uses mean periods and simple sines; real values vary.
import { THREE, K, COL, V, TAU, DEG, illum, phaseName, earthMesh, moonMesh, sunBall, ringLine, lineBetween, setLine, faceTo, setupSpace, sunlight, Card, cardFrame, paintMoon, text, hud } from '../moon.js';

const R = 6.5, MR = 0.85;
const VIEWS = {
  above: { pos: [0, 15, 7], target: [0, 0, 0.8] },
  moon: { pos: [3, 3.5, 9], target: [0, 0, 2.5] },
};
const orbitAngle = (day) => Math.PI + (day / K.SYN) * TAU;
const libration = (day) => ({ lon: K.libLon * DEG * Math.sin((day / K.ANOM) * TAU + 1.1), lat: K.libLat * DEG * Math.sin((day / K.DRAC) * TAU + 0.4) });

export default {
  id: 'face',
  short: 'The same face',
  title: 'Always the same face',
  subtitle: 'The Moon turns once each orbit, so we only ever see one side, plus a little extra.',
  view: VIEWS.above,
  learn: `<p>The Moon <b>does spin</b>. It turns once on its axis in exactly the time it takes to go once round Earth. So it always keeps the <b>same face</b> towards us. This is called <b>tidal locking</b>. Long ago the Moon spun faster, but Earth’s pull raised slight bulges in its rock, and the drag on those bulges slowed the spin until it matched the orbit.</p>
    <p>The “dark side of the Moon” is not dark. The <b>far side</b> gets just as much sunlight as the near side. At new moon the far side is in full daylight. We simply never see it from Earth.</p>
    <p>We see a little more than half, though. The orbit is an ellipse, so the Moon speeds up and slows down while its spin stays steady, and its axis is tilted a little. The result is a slow wobble called <b>libration</b>. Over time about <b>59%</b> of the surface can be seen from Earth.</p>
    <p>Look at a thin crescent and you may see the rest of the disc glowing faintly. That is <b>earthshine</b>: sunlight bounced off Earth onto the Moon’s night side and back to us. It is strongest near new moon, when Earth, seen from the Moon, is almost full.</p>
    <p class="tip"><b>Try it:</b> switch <b>How it spins</b> to “Doesn’t spin” and watch the red marker and the far side swing into view. Then turn on <b>libration</b> and watch the face nod and sway in the card.</p>`,
  terms: [
    { t: 'Tidal locking', d: 'When a moon spins once per orbit, so the same side always faces its planet.' },
    { t: 'Far side', d: 'The half of the Moon that never faces Earth. It is not dark; it gets day and night like the near side.' },
    { t: 'Libration', d: 'A slow apparent wobble that lets us see about 59% of the Moon’s surface over time.' },
    { t: 'Earthshine', d: 'Sunlight reflected from Earth that faintly lights the Moon’s night side.' },
  ],
  defaults: { day: 3, play: true, spin: 'locked', lib: false, es: true },
  controls: [
    { key: 'day', type: 'range', label: 'Day of the month', min: 0, max: 29.5, step: 0.05, fmt: (v) => `day ${v.toFixed(1)}` },
    { key: 'play', type: 'toggle', label: 'Play' },
    { key: 'spin', type: 'seg', label: 'How it spins', options: [{ v: 'locked', label: 'Once per orbit (real)' }, { v: 'none', label: 'Doesn’t spin' }, { v: 'fast', label: 'Twice per orbit' }] },
    { key: 'lib', type: 'toggle', label: 'Libration (shown 3× larger in 3D)' },
    { key: 'es', type: 'toggle', label: 'Earthshine' },
    { key: 'v', type: 'buttons', label: 'Camera', items: [{ label: 'From above', act: (s, i) => i.look('above') }, { label: 'Close to the Moon', act: (s, i) => i.look('moon') }] },
  ],
  quiz: [
    { q: 'Why do we always see the same side of the Moon?', options: ['The Moon does not spin', 'It spins once for every orbit round Earth', 'Earth blocks the other side', 'The far side is always dark'], answer: 1, why: 'Its spin and its orbit take the same time, so the same face stays turned towards Earth. That is tidal locking.' },
    { q: 'Is the far side of the Moon always dark?', options: ['Yes, it never gets sunlight', 'No, it has day and night just like the near side', 'Only during eclipses', 'It is lit by Earth only'], answer: 1, why: 'At new moon the far side is in full sunlight. “Dark side” only means unseen from Earth.' },
    { q: 'About how much of the Moon’s surface can be seen from Earth over time?', options: ['Exactly 50%', 'About 59%', 'About 75%', 'All of it'], answer: 1, why: 'Libration lets us peek round the edges, so about 59% is visible at one time or another.' },
    { q: 'What is earthshine?', options: ['Light from Earth’s cities', 'Sunlight reflected from Earth onto the Moon’s dark part', 'The Moon’s own glow', 'Light bent by Earth’s air'], answer: 1, why: 'Earth reflects sunlight onto the Moon’s night side, which glows faintly, best seen beside a thin crescent.' },
  ],
  reel: [
    { ms: 5200, caption: 'The Moon spins once for every trip round Earth, so the same face always looks at us.', set: { spin: 'locked', lib: false, es: true, play: false }, anim: { day: [0, 14] }, view: VIEWS.above, spin: 0.25 },
  ],
  build({ stage, s }) {
    setupSpace(stage);
    sunlight(stage);
    const root = new THREE.Group(); stage.root.add(root);
    const earth = earthMesh(1.2); root.add(earth);
    root.add(ringLine(R, 0xffffff, 0.22));
    const sun = sunBall(4); sun.position.set(-90, 0, 0); root.add(sun);
    stage.label('Sunlight →', [-10, 1.8, 0], root, 'hot');
    stage.label('Earth', [0, 1.9, 0], root);
    const moon = moonMesh(MR); root.add(moon);
    const mat = moon.material; mat.emissive = new THREE.Color(0x2a3550); mat.emissiveMap = mat.map;
    const pin = new THREE.Group();
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), new THREE.MeshBasicMaterial({ color: COL.coral }));
    stick.rotation.x = Math.PI / 2; stick.position.z = MR + 0.3; pin.add(stick);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshBasicMaterial({ color: COL.coral })); tip.position.z = MR + 0.62; pin.add(tip);
    moon.add(pin);
    const lMoon = stage.label('Moon', [0, MR + 0.5, 0], root, 'hot');
    const sight = lineBetween(V(0, 0, 0), V(1, 0, 0), COL.see, 0.45, true); root.add(sight);
    const card = new Card(512, 600); hud(stage, card.mesh, { size: 0.3 });
    const p = V(0, 0, 0);
    return {
      look(k) { stage.setView(VIEWS[k].pos, VIEWS[k].target, 1.1); },
      update(dt, st) {
        if (st.play) { st.day += dt * 1.6; if (st.day > K.SYN) st.day -= K.SYN; }
        const a = orbitAngle(st.day);
        p.set(R * Math.cos(a), 0, -R * Math.sin(a)); moon.position.copy(p);
        lMoon.position.copy(p).add(V(0, MR + 0.55, 0));
        earth.rotation.y += dt * 0.5;
        const lib = st.lib ? libration(st.day) : { lon: 0, lat: 0 };
        // the angle the Moon has turned relative to "facing Earth"
        let off = 0;
        if (st.spin === 'none') off = -(a - Math.PI);
        if (st.spin === 'fast') off = a - Math.PI;
        faceTo(moon, V(0, 0, 0));
        moon.rotateY(off - lib.lon * 3); moon.rotateX(lib.lat * 3);
        setLine(sight, V(0, 0, 0), p);
        const e = (st.day / K.SYN) * TAU, esK = st.es ? (1 + Math.cos(e)) / 2 : 0;
        mat.emissiveIntensity = 0.25 * esK;
        // seen from Earth: sub-Earth longitude moves by -off
        const lon0 = -off + lib.lon, lat0 = lib.lat;
        card.show([e.toFixed(3), lon0.toFixed(3), lat0.toFixed(3), esK.toFixed(2)].join(), (g, W, H) => {
          cardFrame(g, W, H, 'Seen from Earth');
          paintMoon(g, W / 2, H * 0.43, W * 0.3, { e, pa: e < Math.PI ? 0 : Math.PI, es: esK * 1.6, lon0, lat0 });
          text(g, phaseName(e), W / 2, H - 100, { size: 44, serif: true });
          text(g, st.spin === 'locked' ? (st.lib ? 'the face nods and sways' : 'always the same face') : 'a different face each night', W / 2, H - 50, { size: 27, color: '#ffb547' });
        });
        card.mesh.userData.update();
      },
      readout(st) {
        const e = (st.day / K.SYN) * TAU, earthLit = (1 + Math.cos(e)) / 2;
        const say = st.spin === 'locked' ? 'One turn per orbit: the red marker keeps pointing at Earth.' : st.spin === 'none' ? 'Without spin, the marker points the same way in space, and Earth would see every side of the Moon in a month.' : 'Spinning too fast, it would show us every side too.';
        return `<div class="big">${st.spin === 'locked' ? 'Tidally locked' : 'Not locked'}</div><p class="r-say">${say}</p>
          <div class="row"><span>Seen at one time</span><b>just under 50%</b></div>
          <div class="row"><span>Seen over time, thanks to libration</span><b>about 59%</b></div>
          <div class="row"><span>Libration</span><b>up to ${K.libLon}° east–west, ${K.libLat}° north–south</b></div>
          <div class="row"><span>Earth seen from the Moon</span><b>${Math.round(earthLit * 100)}% lit${st.es ? ' (earthshine ' + (earthLit > 0.7 ? 'strong' : earthLit > 0.3 ? 'faint' : 'very faint') + ')' : ''}</b></div>
          <div class="row"><span>Phase from Earth</span><b>${phaseName(e)} (${Math.round(illum(e) * 100)}%)</b></div>`;
      },
    };
  },
};
