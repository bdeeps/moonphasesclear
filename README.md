<!-- glassbox:start -->
<!-- Generated from glassbox.json by the Glassbox hub (npm run readme -- moonphasesclear). Edit glassbox.json, not this block. -->

<h1 align="center">MoonPhasesClear</h1>

<p align="center"><b>Why does the Moon change shape?</b><br>The Moon never changes shape. The Sun always lights exactly half of it, and what changes is how much of that half faces you. Turn the Moon round its orbit, watch it rise from any latitude, and see why a crescent smiles near the equator.</p>

<p align="center"><a href="https://glassbox.how/moonphasesclear/"><b>▶ Play with it</b></a> &nbsp;·&nbsp; <a href="https://glassbox.how/e/moonphasesclear/">Read the 60-second explainer</a></p>

<p align="center">
  <a href="https://glassbox.how/e/moonphasesclear/"><img alt="Glassbox No. 248" src="https://img.shields.io/badge/Glassbox-No.%20248-8ef0ff"></a>
  <a href="https://glassbox.how/e/moonphasesclear/"><img alt="Space" src="https://img.shields.io/badge/field-Space-c49bff"></a>
  <a href="LICENSE"><img alt="Code: MIT" src="https://img.shields.io/badge/code-MIT-3fb950"></a>
  <a href="LICENSE-CONTENT.md"><img alt="Content: CC BY 4.0" src="https://img.shields.io/badge/content-CC%20BY%204.0-ef9421"></a>
  <a href="#privacy"><img alt="Privacy: explained" src="https://img.shields.io/badge/privacy-explained-555"></a>
</p>

## In 60 seconds

1. **Always half lit.** The Moon makes no light. Sunlight always lights one half of it, like any ball in sunshine. The phases are how much of that lit half is turned towards Earth: none at new moon, half at the quarters, all of it at full moon.
2. **Eight names, one cycle.** From new moon the lit part grows (waxing) through crescent, first quarter and gibbous to full, then shrinks (waning) through gibbous, last quarter and crescent. The share of the disc lit is (1 − cos e) ÷ 2, where e is the Sun–Moon angle in our sky.
3. **Two kinds of month.** The Moon goes once round Earth against the stars in about 27.3 days. But Earth moves round the Sun meanwhile, so the phases repeat only every 29.5 days on average.
4. **Each phase keeps its hours.** The Moon rises on average about 50 minutes later each day. A full moon rises at sunset, a first quarter is high at sunset, and a last quarter hangs in the morning sky. Near the equator an evening crescent lies on its back, and south of the equator the Moon looks turned round.
5. **The same face.** The Moon spins once per orbit, so the same side always faces us. A slow wobble called libration lets us see about 59% of its surface over time. The faint glow on a crescent's dark part is earthshine, sunlight bounced off Earth.
6. **Not Earth's shadow.** The phases are not Earth's shadow, which reaches the Moon only in a lunar eclipse. Supermoons are full moons near the closest point of the orbit. Twelve lunar months make about 354 days, which is why the Islamic calendar moves through the seasons and lunisolar calendars add leap months.

## Words worth knowing

| Term | Meaning |
|---|---|
| **Phase** | The shape of the sunlit part of the Moon as seen from Earth. |
| **Terminator** | The line between day and night on the Moon. |
| **Waxing and waning** | Growing towards full moon, and shrinking back towards new moon. |
| **Gibbous** | More than half lit but not yet full. |
| **Synodic month** | New moon to new moon, about 29.53 days on average. |
| **Sidereal month** | One lap of the Moon against the stars, about 27.32 days. |
| **Tidal locking** | Spinning once per orbit, so the same face always points at the planet. |
| **Libration** | An apparent wobble that shows us about 59% of the Moon's surface over time. |
| **Earthshine** | Sunlight reflected by Earth that faintly lights the Moon's night side. |
| **Lunisolar calendar** | A calendar of lunar months that adds leap months to stay in step with the seasons. |

## A short history

**From notched bones and a bronze sky disc to lunar calendars, telescope maps and landers on the far side.**

- **1600 BCE** · The Nebra sky disc shows a crescent Moon (Bronze Age people of central Europe, Mittelberg hill, near Nebra)
- **450 BCE** · Anaxagoras: the Moon shines with borrowed light (Anaxagoras, Athens, Greece)
- **432 BCE** · The 19-year cycle: 235 months fit 19 years (Meton of Athens, after Babylonian astronomers, Athens, Greece; Babylon)
- **622** · The Hijri calendar follows the Moon alone (Muslim community; era chosen under Caliph Umar, Mecca and Medina)
- **1507** · Leonardo explains the ghostly glow on the dark Moon (Leonardo da Vinci, Florence)
- **1610** · Galileo's Starry Messenger: mountains and earthshine (Galileo Galilei, Venice (where it was published))
- **1651** · Riccioli names the Moon (Giovanni Battista Riccioli and Francesco Grimaldi, Bologna)
- **1935** · Named Lunar Formations: one list for the world (Mary Adela Blagg and Karl Müller, for the IAU, London)

The full story, with 32 moments, charts, people and 56 sources: [glassbox.how/e/moonphasesclear/history](https://glassbox.how/e/moonphasesclear/history/). The data lives in [`history.json`](history.json).

## Privacy

This box has no accounts and no ads, and it ships its own fonts and libraries. When you run it yourself it sends nothing anywhere. On glassbox.how, the site's `/bar.js` also loads Glassbox's analytics: **Google Analytics** to count visits (it asks first in the EU, UK and Switzerland, and stays off when your browser sends Global Privacy Control or Do Not Track) and **ClickTrust** to detect bots.

It remembers a few things **in your own browser only**, and never sends them anywhere:

| Browser storage key | What it holds |
|---|---|
| `moonphasesclear.v1` | Which chapters you have opened, your best quiz scores, and sound on or off. |

Exactly what each one sees is at [glassbox.how/privacy](https://glassbox.how/privacy/).

## Licences

- **Code:** [MIT](LICENSE). Use it, change it, ship it.
- **Explanations, text, images and videos** (`glassbox.json`, `glassbox/`): [CC BY 4.0](LICENSE-CONTENT.md). Credit “Glassbox, glassbox.how/e/moonphasesclear”.
- **Third-party parts** keep their own licences: [three.js](https://threejs.org) (MIT), [Geist, Instrument Serif](https://openfontlicense.org) (SIL OFL 1.1).
- The Glassbox name and logo aren't covered by either licence. See the [terms](https://glassbox.how/terms/).

Found a mistake? [Open an issue](https://github.com/bdeeps/moonphasesclear/issues). Corrections happen in public.
<!-- glassbox:end -->

## Run it

It's plain HTML, CSS and JavaScript. No build step and no dependencies. Run locally, it contacts no other website.

```bash
python3 -m http.server 8000
```

Three.js and the fonts ship in `vendor/` and `fonts/`, so it also works offline.

Then open http://localhost:8000.

## How it's built

| File | What |
|---|---|
| `index.html`, `css/app.css` | The page and its styles |
| `js/app.js`, `js/stage.js`, `js/ui.js`, `js/kit.js` | The shared Glassbox 3D engine: chapters, 3D stage, controls, quiz, video director |
| `js/chapters/*.js` | One file per chapter: the 3D model, controls, text, key terms, quiz and video scenes |
| `glassbox.json` | Title, question, explainer beats, key terms, browser storage and credits shown on glassbox.how |
| `reel` in each chapter | The storyboard the Glassbox studio records into short videos |
| `glassbox/` | The published video, slides, thumbnail and post copy |
| `fonts/`, `vendor/three/` | Self-hosted Geist and Instrument Serif (SIL OFL 1.1) and three.js (MIT) |
