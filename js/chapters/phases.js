// Chapter 2: the names of the phases, and why the month of phases (synodic, about 29.53 days) is longer than one
// lap against the stars (sidereal, about 27.32 days). While the Moon goes round, Earth carries it about 27° round
// the Sun, so the Moon must go a bit further to line up with the Sun again: 1/27.32 − 1/365.26 = 1/29.53.
// Not to scale: Earth's orbit is drawn about 5 times the Moon's orbit; really it is about 390 times.
import { THREE, K, COL, V, TAU, DEG, illum, phaseName, PHASES, earthMesh, moonMesh, sunBall, ringLine, lineBetween, setLine, faceTo, setupSpace, Card, cardFrame, paintMoon, text, hud, wrap } from '../moon.js';

const RE = 26, RM = 4.6, PSI0 = 0.35 * Math.PI;
const VIEWS = {
  earth: { pos: [6, 13, 11], target: [0, 0, 0] },
  wide: { pos: [0, 60, 34], target: [0, 0, 0] },
};
const earthAng = (day) => PSI0 + (day / K.YEAR) * TAU;
const moonAng = (day) => PSI0 + Math.PI + (day / K.SID) * TAU; // starts at new moon, between Earth and Sun
const at = (a, r, out = V(0, 0, 0)) => out.set(r * Math.cos(a), 0, -r * Math.sin(a));

function monthCard(card, day) {
  const e = wrap(moonAng(day) - earthAng(day) - Math.PI);
  card.show(day.toFixed(2), (g, W, H) => {
    cardFrame(g, W, H, 'The month of phases');
    paintMoon(g, W / 2, 210, 120, { e, pa: e < Math.PI ? 0 : Math.PI });
    text(g, phaseName(e), W / 2, 385, { size: 46, serif: true });
    text(g, `${Math.round(illum(e) * 100)}% lit · day ${(((day % K.SYN) + K.SYN) % K.SYN).toFixed(1)} of 29.5`, W / 2, 428, { size: 26, color: '#ffb547' });
    const x0 = 50, x1 = W - 50, y = 520, k = ((day % K.SYN) + K.SYN) % K.SYN / K.SYN;
    g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
    for (let i = 0; i <= 8; i++) {
      const x = x0 + ((x1 - x0) * i) / 8, ei = (i / 8) * TAU;
      paintMoon(g, x, y, 20, { e: ei === TAU ? 0.0001 : ei, pa: ei < Math.PI ? 0 : Math.PI, glow: false });
      if (i < 8 && i % 2 === 0) text(g, PHASES[i].replace(' moon', ''), x, y + 52, { size: 20, color: 'rgba(255,255,255,.65)' });
    }
    const xm = x0 + (x1 - x0) * k;
    g.fillStyle = '#ffb547'; g.beginPath(); g.moveTo(xm, y - 30); g.lineTo(xm - 10, y - 46); g.lineTo(xm + 10, y - 46); g.closePath(); g.fill();
    text(g, `Laps against the stars: ${(day / K.SID).toFixed(2)}`, W / 2, 630, { size: 26, color: '#8ef0ff' });
    text(g, `New moon to new moon: ${(day / K.SYN).toFixed(2)}`, W / 2, 668, { size: 26, color: '#ffb547' });
  });
}

export default {
  id: 'phases',
  short: 'The phases and the month',
  title: 'Crescent, quarter, gibbous, full',
  subtitle: 'Eight names for one cycle, and why it takes 29.5 days, not 27.3.',
  view: VIEWS.earth,
  learn: `<p>From one <b>new moon</b> to the next, the lit part grows and then shrinks. While it grows the Moon is <b>waxing</b>, and while it shrinks it is <b>waning</b>. A <b>crescent</b> is less than half lit, a <b>quarter</b> is exactly half, and <b>gibbous</b> means more than half. In order: new, waxing crescent, first quarter, waxing gibbous, full, waning gibbous, last quarter, waning crescent.</p>
    <p>The Moon goes once round Earth, measured against the distant stars, in about <b>27.3 days</b>: the <b>sidereal month</b>. But the phases repeat every <b>29.5 days</b> on average: the <b>synodic month</b>. Why the difference? While the Moon makes its lap, Earth carries it about a thirteenth of the way round the Sun. The Sun is now in a different direction, so the Moon needs about two more days to catch up and line up with it again.</p>
    <p class="tip"><b>Try it:</b> press <b>Play</b> and watch the dashed line that always points at the same distant star. When the Moon is back on that line, it has done one lap, but it is not yet a new moon. Press <b>One lap against the stars</b>, then <b>Next new moon</b>.</p>
    <p class="note">Not to scale. Earth’s orbit is really about 390 times wider than the Moon’s. Month lengths are averages: a single synodic month can run several hours longer or shorter.</p>`,
  terms: [
    { t: 'Waxing and waning', d: 'Waxing: the lit part is growing, from new towards full. Waning: it is shrinking, from full back to new.' },
    { t: 'Crescent and gibbous', d: 'A crescent is less than half lit. Gibbous, from a word for humped, is more than half but not full.' },
    { t: 'Synodic month', d: 'New moon to new moon, about 29.53 days on average. This is the month of the phases.' },
    { t: 'Sidereal month', d: 'One lap of the Moon measured against the stars, about 27.32 days.' },
  ],
  defaults: { day: 0, play: false, follow: true, speed: 4 },
  controls: [
    { key: 'day', type: 'range', label: 'Days', min: 0, max: 60, step: 0.05, fmt: (v) => `day ${v.toFixed(1)}` },
    { key: 'play', type: 'toggle', label: 'Play' },
    { key: 'speed', type: 'range', label: 'Speed', min: 1, max: 10, step: 0.1, fmt: (v) => `${v.toFixed(1)} days per second` },
    { key: 'follow', type: 'toggle', label: 'Follow Earth round the Sun' },
    { key: 'jump', type: 'buttons', label: 'Jump', items: [
      { label: 'Start (new moon)', act: (s) => { s.day = 0; s.play = false; } },
      { label: 'One lap against the stars', act: (s) => { s.day = K.SID; s.play = false; } },
      { label: 'Next new moon', act: (s) => { s.day = K.SYN; s.play = false; } },
    ] },
    { key: 'v', type: 'buttons', label: 'Camera', items: [{ label: 'Near Earth', act: (s, i) => i.look('earth') }, { label: 'Whole orbit', act: (s, i) => { s.follow = false; i.look('wide'); } }] },
  ],
  quiz: [
    { q: 'Which comes straight after a first quarter?', options: ['Waxing crescent', 'Waxing gibbous', 'Waning gibbous', 'Full moon'], answer: 1, why: 'After first quarter the lit part keeps growing past half: a waxing gibbous, then full.' },
    { q: 'Why is new moon to new moon longer than one lap against the stars?', options: ['The Moon slows down each month', 'Earth moves round the Sun, so the Moon must go further to line up with the Sun again', 'Earth’s shadow delays it', 'The month is measured from full moon'], answer: 1, why: 'In 27.3 days Earth moves about 27° round the Sun, so the Moon needs about 2.2 more days to catch up.' },
    { q: 'About how long is the synodic month?', options: ['24.8 hours', '27.3 days', '29.5 days', '30.4 days'], answer: 2, why: 'On average 29.53 days. The 27.3-day figure is the sidereal month, one lap against the stars.' },
    { q: 'What does “gibbous” describe?', options: ['Less than half lit', 'Exactly half lit', 'More than half lit, not yet full', 'A Moon near the horizon'], answer: 2, why: 'Gibbous comes from a word for humped. It is the bulging shape between a quarter and full.' },
  ],
  reel: [
    { ms: 5800, caption: 'One lap against the stars takes 27.3 days. But Earth has moved, so the next new moon comes at 29.5.', set: { follow: true, play: false }, anim: { day: [0, K.SYN] }, view: { pos: [5, 12, 10], target: [0, 0, 0] }, spin: 0 },
  ],
  build({ stage, s }) {
    setupSpace(stage, { maxDist: 220 });
    const sys = new THREE.Group(); stage.root.add(sys);
    const sun = sunBall(3); sys.add(sun);
    const pl = new THREE.PointLight(0xfff4e0, 3.4, 0, 0); sys.add(pl);
    sys.add(ringLine(RE, 0xffffff, 0.18));
    const earthG = new THREE.Group(); sys.add(earthG);
    const earth = earthMesh(1.1); earthG.add(earth);
    earthG.add(ringLine(RM, 0xffffff, 0.2));
    const moon = moonMesh(0.42); earthG.add(moon);
    const star = lineBetween(V(0, 0, 0), V(1, 0, 0), COL.see, 0.85, true); earthG.add(star);
    const toSun = lineBetween(V(0, 0, 0), V(1, 0, 0), COL.lit, 0.7); earthG.add(toSun);
    const startMark = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 8), new THREE.MeshBasicMaterial({ color: COL.see })); earthG.add(startMark);
    stage.label('Sun', [0, 4.6, 0], sys, 'hot');
    stage.label('Earth', [0, 1.8, 0], earthG);
    stage.label('Moon', [0, 0.9, 0], moon, 'hot');
    const lStar = stage.label('to a distant star', [0, 0, 0], earthG);
    const lSun = stage.label('to the Sun', [0, 0, 0], earthG, 'hot');
    const card = new Card(560, 700); hud(stage, card.mesh, { size: 0.31 });
    const pE = V(0, 0, 0), pM = V(0, 0, 0), dStar = at(PSI0 + Math.PI, 1);
    return {
      look(k) { stage.setView(VIEWS[k].pos, VIEWS[k].target, 1.1); },
      update(dt, st) {
        if (st.play) { st.day += dt * st.speed; if (st.day > 60) st.day = 0; }
        const aE = earthAng(st.day), aM = moonAng(st.day);
        at(aE, RE, pE); earthG.position.copy(pE);
        sys.position.copy(st.follow ? pE.clone().negate() : V(0, 0, 0));
        at(aM, RM, pM); moon.position.copy(pM); earthG.updateWorldMatrix(true, false); faceTo(moon, earthG.getWorldPosition(V(0, 0, 0)));
        earth.rotation.y += dt * 0.5;
        setLine(star, V(0, 0, 0), dStar.clone().multiplyScalar(RM * 1.9));
        const dS = pE.clone().negate().normalize();
        setLine(toSun, V(0, 0, 0), dS.clone().multiplyScalar(RM * 1.9));
        lStar.position.copy(dStar).multiplyScalar(RM * 2.15).add(V(0, 0.5, 0));
        lSun.position.copy(dS).multiplyScalar(RM * 2.15).add(V(0, 0.5, 0));
        startMark.position.copy(dStar).multiplyScalar(RM);
        monthCard(card, st.day);
        card.mesh.userData.update();
      },
      readout(st) {
        const e = wrap(moonAng(st.day) - earthAng(st.day) - Math.PI), past = wrap(moonAng(st.day) - moonAng(0)) / DEG;
        const lap = Math.abs(st.day - K.SID) < 0.3, nm = Math.abs(st.day - K.SYN) < 0.3;
        const say = lap ? 'Back in line with the same star: one lap done. But the Sun has moved on, so this is a thin crescent, not a new moon.' : nm ? 'Lined up with the Sun again: new moon. That took about 2.2 days longer than one lap.' : 'Watch the dashed star line and the gold Sun line drift apart as Earth moves.';
        return `<div class="big">${phaseName(e)}</div><p class="r-say">${say}</p>
          <div class="row"><span>Day</span><b>${st.day.toFixed(1)}</b></div>
          <div class="row"><span>Moon’s turn, measured from the star line</span><b>${Math.round(past)}°</b></div>
          <div class="row"><span>Earth’s trip round the Sun so far</span><b>${((st.day / K.YEAR) * 360).toFixed(1)}°</b></div>
          <div class="row"><span>Sidereal month</span><b>${K.SID.toFixed(2)} days</b></div>
          <div class="row"><span>Synodic month</span><b>${K.SYN.toFixed(2)} days</b></div>`;
      },
    };
  },
};
