// Chapter 3: when and where to see the Moon. Each day the Moon is about 12° further east of the Sun, so it rises
// on average about 50 minutes later (a lunar day is about 24 h 50 min). A full moon is opposite the Sun, so it
// rises around sunset; a first quarter is 90° east of the Sun, so it is high in the south at sunset (from northern
// mid-latitudes). Simplified: Sun and Moon on the celestial equator, as at an equinox, so the Sun rises at 06:00.
// The real daily delay varies a lot through the year because the Moon's path is tilted to the horizon.
import { K, DEG, illum, phaseName, buildSky, moonTimes, compassName, hm, Card, cardFrame, paintMoon, text, hud } from '../moon.js';

const VIEWS = {
  south: { pos: [0, 1.6, -1.2], target: [0, 4.2, 4] },
  east: { pos: [-1.2, 1.6, 0], target: [4, 3.4, 0.6] },
  west: { pos: [1.2, 1.6, 0], target: [-4, 3.4, 0.6] },
};

export function binoculars(card, info, title, sub) {
  card.show([info.e.toFixed(3), info.pa.toFixed(2), info.rot.toFixed(2), title, sub].join(), (g, W, H) => {
    cardFrame(g, W, H, title);
    paintMoon(g, W / 2, H * 0.44, W * 0.29, { e: info.e, pa: info.pa, rot: info.rot, es: 0.6 });
    text(g, phaseName(info.e), W / 2, H - 90, { size: 44, serif: true });
    text(g, sub, W / 2, H - 42, { size: 27, color: '#ffb547' });
  });
}

export default {
  id: 'rise',
  short: 'When to see it',
  title: 'When to look up',
  subtitle: 'The Moon rises about 50 minutes later each day, so each phase keeps its own hours.',
  view: VIEWS.east,
  learn: `<p>Earth turns once a day, so the Sun and the Moon both rise in the east and set in the west. But the Moon is also moving round Earth, about <b>12° a day</b> further east of the Sun. Earth needs a little extra turn to catch it, so the Moon rises on average about <b>50 minutes later each day</b>.</p>
    <p>That links each phase to a time of day. A <b>full moon</b> is opposite the Sun, so it <b>rises at sunset</b> and is up all night. A <b>first quarter</b> is a quarter turn behind the Sun, so it rises around midday and is <b>high in the sky at sunset</b>. A <b>waxing crescent</b> follows the Sun down in the evening west. A <b>last quarter</b> rises around midnight and is still up after sunrise, which is why you can see the Moon in a blue morning sky.</p>
    <p class="tip"><b>Try it:</b> use the preset buttons, then drag the <b>time of day</b>. Change the <b>Moon’s age</b> by one day and see the rising time move by about 50 minutes.</p>
    <p class="note">Simplified: the Sun and the Moon follow the same path, as at the equinoxes, and the place is 40° north. In real life the daily delay changes a lot through the year, because the Moon’s path meets the horizon at different angles. The Moon is drawn much bigger than it looks.</p>`,
  terms: [
    { t: 'Lunar day', d: 'The time from one moonrise to the next, about 24 hours 50 minutes on average.' },
    { t: 'Moonrise', d: 'When the Moon’s top edge clears the horizon. It comes later each day.' },
    { t: 'Daytime Moon', d: 'Except near new moon, the Moon is above the horizon in daylight for part of most days.' },
  ],
  defaults: { hours: 18.7, age: 14.8, lat: 40, play: false },
  controls: [
    { key: 'hours', type: 'range', label: 'Time of day', min: 0, max: 24, step: 0.02, fmt: (v) => hm(v) },
    { key: 'age', type: 'range', label: 'Moon’s age', min: 0, max: 29.5, step: 0.05, fmt: (v) => `${v.toFixed(1)} days after new moon` },
    { key: 'play', type: 'toggle', label: 'Play the day' },
    { key: 'pre', type: 'buttons', label: 'Presets', items: [
      { label: 'Full moon at sunset', act: (s, i) => { Object.assign(s, { age: 14.8, hours: 18.15, play: false }); i.look('east'); } },
      { label: 'First quarter at sunset', act: (s, i) => { Object.assign(s, { age: 7.4, hours: 18.15, play: false }); i.look('south'); } },
      { label: 'Evening crescent', act: (s, i) => { Object.assign(s, { age: 3, hours: 18.6, play: false }); i.look('west'); } },
      { label: 'Morning last quarter', act: (s, i) => { Object.assign(s, { age: 22.1, hours: 8.5, play: false }); i.look('south'); } },
    ] },
    { key: 'v', type: 'buttons', label: 'Look', items: [{ label: 'East', act: (s, i) => i.look('east') }, { label: 'South', act: (s, i) => i.look('south') }, { label: 'West', act: (s, i) => i.look('west') }] },
  ],
  quiz: [
    { q: 'On average, how much later does the Moon rise each day?', options: ['About 5 minutes', 'About 50 minutes', 'About 2 hours', 'It rises at the same time'], answer: 1, why: 'The Moon moves about 12° east of the Sun each day, so Earth takes about 50 more minutes to bring it over the horizon.' },
    { q: 'When does a full moon rise?', options: ['At sunrise', 'At midday', 'Around sunset', 'At midnight'], answer: 2, why: 'A full moon is on the opposite side of Earth from the Sun, so it comes up as the Sun goes down.' },
    { q: 'Where is a first-quarter Moon at sunset, seen from northern mid-latitudes?', options: ['Just rising in the east', 'High in the south', 'Setting in the west', 'Below the horizon'], answer: 1, why: 'It is 90° east of the Sun, so when the Sun is setting in the west it is high in the southern sky.' },
    { q: 'Why can you sometimes see the Moon in the morning sky?', options: ['It is reflecting city lights', 'Waning phases rise late at night and are still up after sunrise', 'Only during eclipses', 'You can’t'], answer: 1, why: 'A last quarter rises around midnight and sets around midday, so it is easy to spot in the morning.' },
  ],
  reel: [
    { ms: 5400, caption: 'A full moon is opposite the Sun, so it rises just as the Sun sets.', set: { age: 14.8, lat: 40, play: false }, anim: { hours: [17.4, 19.6] }, view: { pos: [-1.6, 1.6, 0.6], target: [4, 2.6, 0.2] }, spin: 0 },
  ],
  build({ stage, s }) {
    const sky = buildSky(stage);
    const card = new Card(512, 560); hud(stage, card.mesh, { size: 0.28 });
    return {
      look(k) { stage.setView(VIEWS[k].pos, VIEWS[k].target, 1.1); },
      update(dt, st) {
        if (st.play) { st.hours += dt * 1.2; if (st.hours >= 24) st.hours -= 24; }
        const info = sky.update(st);
        const t = moonTimes(st.age);
        binoculars(card, info, 'Through binoculars', info.moonAlt > 0 ? `up, ${Math.round(info.moonAlt)}° high` : 'below the horizon now');
        card.mesh.userData.update();
        void t;
      },
      readout(st) {
        const info = sky.update(st), t = moonTimes(st.age), up = info.moonAlt > 0;
        const tomorrow = moonTimes(st.age + 1).rise;
        const say = up ? `The Moon is up, in the ${compassName(sky.mDir)}, ${Math.round(info.moonAlt)}° above the horizon.` : 'The Moon is below the horizon. Change the time to find it.';
        const sun = info.sunAlt > 0 ? 'Sun is up' : info.sunAlt > -6 ? 'twilight' : 'night';
        return `<div class="big">${hm(st.hours)} · ${sun}</div><p class="r-say">${say}</p>
          <div class="row"><span>Phase</span><b>${phaseName(info.e)} (${Math.round(illum(info.e) * 100)}%)</b></div>
          <div class="row"><span>Moonrise, roughly</span><b>${hm(t.rise)}</b></div>
          <div class="row"><span>Highest, roughly</span><b>${hm(t.high)}</b></div>
          <div class="row"><span>Moonset, roughly</span><b>${hm(t.set)}</b></div>
          <div class="row"><span>Tomorrow it rises</span><b>${hm(tomorrow)} (about ${Math.round(K.lunarDayMin)} min later)</b></div>`;
      },
    };
  },
};
void DEG;
