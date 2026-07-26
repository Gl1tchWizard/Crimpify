# Audit: blokkenbibliotheek, ontworpen sessies, service worker

Peildatum 27 juli 2026. Regelnummers verwijzen naar main (commit 40b59a1,
v0.47, live op crimpify.com). Alleen inventarisatie, geen voorstellen.

## Deel 1. Blokkenbibliotheek

Totaal 68 blokken in `BLOCKLIB` (app.js:150). Eigen `ux_`-blokken staan
niet in de code maar in localStorage en komen daar per toestel bij.

### Groepen: hoe de code ze groepeert

De groepering zit niet op de blokken zelf (geen groepsveld) maar in een
aparte lijst `BLOCK_GROUPS` (app.js:2562-2571): acht groepen met elk een
keys-array. De UI-naam is letterlijk de code-naam: de picker rendert
`g.name` als sectiekop (app.js:2671) en de blok-detail-kicker toont
dezelfde naam in kleine letters via `blockGroupName()` (app.js:4664-4668,
weergave app.js:4691). Geen afwijking tussen code en UI. De picker maakt
er twee synthetische groepen bij: `Own` (alle `ux_`-keys, altijd bovenaan)
en `Other` (alles wat in geen enkele groep zit, onderaan), app.js:2630-2636.

| Groep (code = UI) | Aantal | Blokken (keys) |
|---|---|---|
| Warm-up & activation | 14 | dynamic, warmup, warmupFinger, gymWarmup, mobilityOpen, tensionAct, easyTen, noHangsEmil, tendonClimb, tendonFull, fiveWarmup, wallRamp, ownWarmup, activeCurls |
| Technique & skills | 9 | drillsOnly, drillBlocks, drillLibrary, skillLight, slab, boardApply, skillChoice, slabWork, cleanRepeat |
| Capacity · aerobic volume | 8 | volume, boardVolume, easyClimb, sprayLight, mediumTwenty, frontBuild, easyDozen, capacityMix |
| Power endurance | 7 | peFlow, fourByFour, hehe, linked, compStyle, fiveProblems, terminator |
| Max strength & power | 10 | limitBlocks, project, board1, campus, dynos, pyramide, frontGrowth, lockoffs, pullStrength, fourShots |
| Finger strength | 2 | maxHangs, progDeadhangs |
| Antagonist, core & gym | 5 | pushStrength, coreLegs, mini1, mini2, mini3 |
| Recovery & mobility | 8 | stretch, stretchLong, hog, nohangs, frontMaint, squatLat, meditation, yogaFlow |
| (Other, synthetisch) | 5 | mdFinger, mdMaxHangs, mdNoHangs, mdPull, mdCore |

63 blokken gegroepeerd, 5 buiten elke groep (de Minimal Dose-microblokken,
die landen in `Other`). Geen blok zit in meerdere groepen (programmatisch
gecontroleerd: nul dubbelen), geen dode keys in de groepslijsten.

### Klopt vijf per groep?

Nee. De aantallen lopen van 2 (Finger strength) tot 14 (Warm-up &
activation). Waar het is uitgelopen, in volgorde van gewicht:

1. **Gegroeide lijsten, vooral door de vier juli-coach-sessies.** Die
   brachten 15 sessie-specifieke blokken mee die in de algemene groepen
   zijn bijgeschreven: fiveWarmup, wallRamp, ownWarmup (Warm-up),
   skillChoice, slabWork, cleanRepeat (Technique), easyDozen, capacityMix
   (Capacity), fiveProblems, terminator (Power endurance), fourShots (Max
   strength), progDeadhangs (Finger), squatLat, meditation, yogaFlow
   (Recovery). Daarnaast drie tendon-blokken plus activeCurls in Warm-up.
2. **Niet** eigen `ux_`-blokken: die staan apart onder `Own`.
3. **Niet** verborgen blokken die toch tonen: hidden wordt gefilterd
   (app.js:2640) en verschijnt alleen als aparte terugzetlijst onderaan
   (app.js:2680-2686).

### Wat de gebruiker in Build per blok ziet

Een pickerrij (app.js:2655-2663) toont: bloknaam (plus eventueel
BENCHMARK- of YOURS-badge), een microregel `rpe X · base T'`, een
kleuraccent links in de groepskleur, en de knoppen i (detail), ✎ (alleen
ux_), × (verbergen/verwijderen) en +. Niet op de rij: een groepslabel (de
groep is alleen zichtbaar als sectiekop erboven en als kleuraccent), niet
de verwachte belasting (de phalanx bestaat alleen op sessiekaarten,
`chPhalanx`, app.js:4331), en niet de uitleg (het `why`-veld zit achter de
i-knop). Dat laatste is het waarschijnlijke probleem achter "onduidelijk
waar een blok op slaat": met een opengeklapte groep is het een lange lijst
rijen met alleen naam, rpe en basisduur; wat het blok ís staat een tik
dieper.

Openstaat bij openen: alleen `Own` staat open, alle acht groepen zijn
dichtgeklapt met een teller (app.js:2618-2622, `_openGroups = new
Set(['Own'])`). Zoeken forceert alle groepen open (app.js:2666) en
doorzoekt naam plus why-tekst (app.js:2641-2645).

### Sortering

Betekenisvol als ontwerp, aangroei in de staart. De groepsvolgorde volgt
de opbouw van een sessie (commentaar app.js:2560-2561: warm-up, techniek,
energiesysteem-werk, vingers, antagonist, herstel). Binnen een groep is de
volgorde de letterlijke volgorde van de keys-array; de kop van elke array
is geordend, de staart is feitelijk toevoegvolgorde (de juli-blokken
staan achteraan). Er is geen sortering op naam, duur of rpe.

## Deel 2. Ontworpen sessies

Twee hardcoded lijsten, met verschillende rollen:

1. **`sessions`/SESSIONS (app.js:387-416):** tien generator-systemen met
   ids `strength`, `power`, `pe`, `capacity`, `gym`, `skill`, `perf`,
   `recovery`, `minidose`, `drills`. Dit zijn slot-recepten voor Generate,
   geen ontworpen sessies.
2. **`MOCK_CHOOSE` (app.js:4135-4195):** achttien kaart-entries voor de
   Choose-catalogus. De banner erboven (app.js:4013) zegt letterlijk dat
   alles eronder nep is: verzonnen sessies, verzonnen coaches, verzonnen
   tellers, verwijderen na de test.

### Zijn het er vier?

Ja en nee. De vier echte ontworpen sessies (juli 2026) bestaan en heten:

| Naam | Coach | cat | Blokken | Som (getoond) | Statisch mins-veld |
|---|---|---|---|---|---|
| Five by Five | Guru | coach | fiveWarmup, wallRamp, fiveProblems, slabWork, squatLat | 120 min | 120 |
| Four Shots | Glitch | coach | dynamic, activeCurls, skillChoice x3, fourShots, cleanRepeat, meditation | 94 min | 120 |
| Sarah Connor | Sarah | new | ownWarmup, skillChoice, easyDozen, terminator, yogaFlow | 105 min | 120 |
| Summer Capacity | Magnus W | coach | ownWarmup, progDeadhangs, skillChoice x2, capacityMix, stretch | 110 min | 120 |

Alle keys van alle vier bestaan in BLOCKLIB; sterker, geen van de achttien
entries verwijst naar een niet-bestaand blok (programmatisch
gecontroleerd). De getoonde duur is altijd de som van de blok-basisduren
(`sessionMins`, app.js:4196-4201); het statische mins-veld is alleen
fallback en wijkt bij drie van de vier af (94, 105 en 110 tegenover 120).
Bij oude mock-entries wijkt het veld nog forser af (Crimp Factory: veld
75, som 123), maar dat veld wordt dus niet getoond.

Het verschil tussen wat er staat en wat er zou moeten staan:

- De vier echte sessies leven **binnen de mocklaag**, tussen veertien
  verzonnen entries, zonder enig veld dat echt van nep onderscheidt. Drie
  mock-entries dragen bovendien echte namen of de huismethode: Crimp
  Factory (Jaap dJ), Easy Thirty (Vincent) en Fresh First (Crimpify);
  de overige elf hebben verzonnen coaches (Teo Marchetti, Ana Kovač,
  Ines Fujimoto, Mila Berg, Jonas Steen) en verzonnen done-tellers.
- **Vindbaarheid:** de Choose-view bouwt hero + vier planken
  (app.js:4340-4345): hero = `MOCK_CHOOSE[0]` = Crimp Factory
  (app.js:4311-4312), For you (berekend), tijdplank (berekend), Popular
  at Apex = `APEX_PICKS` (app.js:4305: Five by Five, The Grinder, Send
  Day, Easy Does It, Board Blitz) en New = cat `new` (app.js:4338: Board
  Blitz, Flow State, Silent Feet, Sarah Connor). Er is geen plank voor
  cat `coach`, `featured` of `popular` als zodanig. Gevolg: **Four Shots
  en Summer Capacity staan op geen enkele vaste plank** en verschijnen
  alleen via de berekende For you- en tijdplanken of via zoeken.

## Deel 3. Service worker en navigatie

- **Fetch-handler bij een navigatie naar bijvoorbeeld /why**
  (sw.js:44-50): navigaties zijn network-first. Online geeft de sw
  gewoon het netwerkantwoord terug, wat het ook is, en zet een kopie in
  de cache; er is geen `res.ok`-check in de navigatietak, dus ook een
  404-antwoord wordt gecachet. Pas als het netwerk faalt probeert hij
  `caches.match(e.request)` en valt daarna terug op
  `caches.match('index.html')`. Dus: /why offline en nooit eerder
  bezocht = de app-shell (index.html); /why online = wat GitHub Pages
  ervoor teruggeeft.
- **Losse statische pagina bereikbaar zonder sw-wijziging: ja.** Reden:
  navigaties gaan network-first, de sw hoeft het pad niet te kennen.
  Kanttekening: dat geldt online; het pad staat niet in de precache, dus
  offline voor het eerste bezoek valt het terug op index.html. Na een
  eerste online bezoek zit de pagina in de runtime-cache en werkt hij ook
  offline.
- **Precache** (`CORE`, sw.js:3-15): `./`, index.html, app.js, style.css,
  manifest.json, icon-192.png, icon-512.png, icon-maskable-512.png,
  apple-touch-icon.png, favicon.svg, og.png.
- **Manifest** (manifest.json:5-6): `start_url` is `"."`, `scope` is `"."`.
