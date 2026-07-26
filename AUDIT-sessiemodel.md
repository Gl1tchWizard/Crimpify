# Audit: backlog, sessiemodel en backend-gereedheid

Peildatum 26 juli 2026. Regelnummers verwijzen naar de werkkopie op branch
`fix/session-clock` (commit 6083334, v0.45). Live op crimpify.com staat
`main` (v0.44): alles van gisteren (sessieherstel, skip, wall clock,
sw-update-prompt, recap-correctie) zit in de openstaande PR en is dus NOG
NIET live; waar dat uitmaakt staat het erbij. Er is geen issue-tracker in
gebruik: de backlog leeft volledig in CLAUDE.md (sectie "Backlog").

Overlap-markers: [PERSISTENTIE] sessiestate, [TIJD] tijdregistratie,
[AUTH] accounts of auth, [DELEN] publiceren of delen.

## 1. Backlog met status

### Nu bouwbaar (CLAUDE.md, "Nu bouwbaar")

| # | Item | Status | In de code? |
|---|---|---|---|
| 1 | Klikbare historie [DELEN] | gedeeltelijk, live | De 14-daagse strip-dots openen de recap (`onclick="openRecap(...)"`, app.js:2012) en de recap heeft Share en Again (recapShare app.js:2207). Een klikbare historielijst als zodanig bestaat niet; entries ouder dan de strip zijn onbereikbaar. Oude entries zonder structuur krijgen de melding op app.js:2118. |
| 2 | Export/backup [PERSISTENTIE] [DELEN] | open | Niet aanwezig. Geen export-, backup- of importcode in app.js, index.html of style.css (grep op export/backup/import: nul treffers). |
| 3 | Light mode | open | Niet aanwezig. Geen `prefers-color-scheme` in style.css of elders. |
| 4 | Lege-staat & microtypografie | open | De 10px-ondergrens is niet doorgevoerd: nog 42 voorkomens van `font-size:8px`/`9px` (style.css 22, index.html 11, app.js 9). |
| 5 | Zoek als icoon op de landing | open | Niet aanwezig op de landing. De Choose-catalogus heeft het al (toggleChSearch app.js:3984, `chSearchInput` app.js:4028). |
| 6 | NL code-commentaren naar Engels | open (chore) | Commentaren zijn nog overwegend Nederlands, ook in nieuwe code. |

Nummer 7 bestaat niet in de lijst (nummering springt van 6 naar 8).

### Wacht op de eerste veldtest

| # | Item | Status | In de code? |
|---|---|---|---|
| 8 | Bottom navigation | open | Niet aanwezig. |
| 9 | Climb with intent | open | Niet aanwezig. Let op het gedocumenteerde naamconflict: het bestaande `intent`-veld in favs/draft/customSession (bv. app.js:544) is de sessie-belofte-regel, niet dit concept. |
| 10 | In-session flexibility, uitbreiding [PERSISTENTIE] [TIJD] | gedeeltelijk, alleen op branch | Skip met reden plus inkorten-naar-minimum is gebouwd (skipBlock app.js:1347, shortenRest app.js:1369) maar zit in de openstaande PR, niet op main. Blok wisselen of los inkorten midden in de sessie: niet aanwezig. |
| 11 | Set-based blokstructuur [TIJD] | open | Niet aanwezig. Circuitblokken (Terminator Mode, hangboard-protocollen) hebben een enkel tijdvak. |

### Wacht op een backend

| # | Item | Status | In de code? |
|---|---|---|---|
| 12 | Echte completions [AUTH] [DELEN] | open | "N done" is mock: hardcoded `done:`-waarden in MOCK_CHOOSE (app.js:4067 e.v., bv. `done:342`). |
| 13 | Remix-tellers [AUTH] [DELEN] | open | Niet aanwezig; remix (duplicateSession/basedOn) bestaat, telling niet. |
| 14 | Berekende planken [AUTH] | open | Popular at Apex e.a. zijn handmatige lijsten in MOCK_CHOOSE (app.js:4065 e.v.). |
| 15 | Sessie-datamodel + analytics-funnel [AUTH] [DELEN] | open | Alleen vastgelegd in CLAUDE.md (Choose-flow punt 5); de GoatCounter-events dekken een deel van de funnel al (zie deel 3). |
| 16 | Credibility & coach model [AUTH] | open | Niet aanwezig in code; volledig ontwerp in CLAUDE.md. Badges, maker-lagen en ranking vergen een backend en echte coach-identiteiten: dit is het enige backlog-item dat expliciet identiteit/verificatie raakt. |

### Ideeën

| # | Item | Status | In de code? |
|---|---|---|---|
| 17 | Signatuur-motief | gedeeltelijk | De phalanx bestaat als verwachte-belasting-indicator op kaarten; als voortgangsindicator en het hexagon-C-kadermotief: niet aanwezig. |
| 18 | Shortcuts-rij (acht energiesystemen) | open | Niet aanwezig. |

### Dood (afgewezen, in CLAUDE.md vastgelegd)

Avatar, notificatiebel, voltooiingspercentages, derde bouw-ingang,
Engels/Nederlands-mix. Ook dood: TRY THIS NOW (vervallen juli 2026), de
eigen coach-plank boven de hero (teruggedraaid), phalanx-in-sessiekleur en
phalanx-als-rpe (beide vervangen door vastgelegde beslissingen).

## 2. Sessiemodel en lokale opslag

### Echt voorbeeld van een opgeslagen sessie

Dump uit een headless run van de huidige branch (Five by Five gestart,
blok 2 geskipt wegens energie, gelogd met groen). Dit is
`crimpify_history[0]` letterlijk zoals hij in localStorage staat:

```json
{
  "id": "custom",
  "variant": "Five problems",
  "time": 16,
  "ts": 1785059739110,
  "sig": "green",
  "load": 10,
  "keys": ["fiveWarmup", "wallRamp", "fiveProblems", "slabWork", "squatLat"],
  "name": "Five by Five",
  "color": "lime",
  "blocks": [
    { "name": "Warm-up + pick-ups", "spent": 600, "color": "var(--prepare)" },
    { "name": "Progressive wall warm-up", "spent": 0, "color": "var(--prepare)",
      "status": "skipped", "skipReason": "energy" },
    { "name": "Five problems", "spent": 120, "color": "var(--volume)" },
    { "name": "Slab work", "spent": 120, "color": "var(--skill)" },
    { "name": "Deep squat + lats", "spent": 120, "color": "var(--prepare)" }
  ],
  "wall": 16
}
```

`wall`, `status` en `skipReason` bestaan alleen op de branch; op main (live)
eindigt de entry bij `blocks` met alleen name/spent/color. `time` is
actieve bloktijd in minuten, `spent` per blok in seconden, `load` =
time x intensiteitsfactor (INTENSITY_FACTORS app.js:449, id niet gevonden
= 0.65). Geen schemaversie-veld.

De lopende sessie, zelfde run, `crimpify_active` letterlijk:

```json
{"keys":["fiveWarmup","wallRamp","fiveProblems","slabWork","squatLat"],
 "name":"Five by Five","color":"lime","sessionId":"custom","idx":0,
 "spent":{},"ts":1785059739107,"st":1785058839106,"bs":1785059139106,
 "log":{},"dt":[15,20,50,30,5]}
```

(`st`/`bs`/`log`/`dt`/`cc` alleen op de branch; live bevat alleen
keys/name/color/sessionId/idx/spent/ts.)

De deel-link (het "de link is de data"-model), decoded uit `#s=`:

```json
{"n":"Five by Five","k":["fiveWarmup","wallRamp","fiveProblems","slabWork","squatLat"],
 "t":120,"c":"lime","f":"Govert","d":[15,20,50,30,5]}
```

Opbouw in encodePayload (app.js:2783-2795): `n` naam, `k` blokkeys, `t`
minuten, `c` kleurnaam, optioneel `d` duren per blok, `f` afzender, `m`
maker, en `x` = volledige definities van meereizende eigen `ux_`-blokken
(app.js:2789-2793). Base64url-JSON, geen id, geen versie.

### Alle localStorage-sleutels

IndexedDB: niet aanwezig. Wel `navigator.storage.persist()` (app.js:3702).
Alle regels hieronder geverifieerd in app.js.

| Sleutel | Inhoud | Geschreven wanneer | Opgeruimd? |
|---|---|---|---|
| `crimpify_history` | array van sessie-entries zoals hierboven, nieuwste eerst | saveHistory (app.js:441) via logSessionDone (app.js:465) bij stoplicht-tik, skip van het stoplicht of sluiten van de summary; bewerkt door recapToggleEdit (app.js:2134) | gecapt op 50 entries (`slice(0,50)`), nooit verwijderd |
| `crimpify_favs` | favorieten, `{name, keys, color, rpe, intent, time, d?, basedOn?}` | saveFavs (app.js:1925) bij ster/opslaan; dedupe op naam | gecapt op 12; individueel verwijderbaar via ontsterren |
| `crimpify_draft` | het eigen concept `{keys, name, color, rpe, intent, locked, owned, ov?, basedOn?}` | saveDraft (app.js:547) bij builderwijzigingen en bij flushState (app.js:3746, visibility hidden/pagehide) | nooit; wordt overschreven |
| `crimpify_active` | lopende training, zie dump hierboven | saveActive (app.js:1224, setItem 1232) op elke blokgrens, elke boulder-tik en (branch) elke 5 s via heartbeat (app.js:1246) | ja: clearActive (app.js:1248-1250) bij summary/log, en loadActive (app.js:1253) verwijdert entries ouder dan 12 uur |
| `crimpify_resume` | `{mode:'run'\|'build', ts}`: kom-terug-marker | saveResumeMarker (app.js:3743) bij visibility hidden/pagehide als de gebruiker in de flow zit; verwijderd als hij dat niet zit (app.js:3742) | ja: geconsumeerd en verwijderd bij init (app.js:3849-3850), venster 30 min |
| `crimpify_custom_blocks` | eigen oefeningen, keys met `ux_`-prefix | app.js:2638 bij aanmaken/bewerken | nooit als geheel; per blok verwijderbaar (deleteCustomBlock app.js:3316) |
| `crimpify_hidden_blocks` | verborgen blokkeys | saveHidden (app.js:2534) via hideBlock (app.js:2535) | nooit als geheel; restoreBlock (app.js:2544) haalt keys uit de lijst |
| `crimpify_name` | voornaam | app.js:2844 (begroeting) en app.js:3692 (nameSheet bij delen) | nooit |
| `crimpify_seen_news` | weggetikte news-ids | app.js:4536 | nooit |
| `crimpify_install_prompt` | `'shown'` of `'accepted'` | app.js:3775 (appinstalled), 3792/3833 (prompt getoond/geaccepteerd) | nooit (bewust: uitnodiging is eenmalig) |
| `odyssey_history` e.a. (5 stuks) | legacy-data van de oude appnaam | niet meer geschreven | nooit: de migratie (app.js:419-429) kopieert naar `crimpify_*` maar laat de oude keys staan |

### ID-generatie en stabiliteit

- Catalogus-sessies: hardcoded string-ids in de code (`'strength'`,
  `'gym'`, enz., app.js:387-416). Stabiel over apparaten omdat ze in de
  code staan.
- Elke eigen, gedeelde, geremixte of hervatte sessie krijgt id `'custom'`
  (app.js:1282, 2221, 2434, 2906 e.v.). Er bestaat dus geen uniek
  sessie-id; de identiteit is feitelijk de naam plus de key-lijst.
- Historie-entries: identiteit is `ts` = `Date.now()` bij het loggen
  (app.js:467). Device-lokaal, niet stabiel over apparaten.
- Eigen blokken: `'ux_' + Date.now().toString(36)` (app.js:2686).
  Device-lokaal; een ontvanger van een deel-link krijgt de definitie via
  het `x`-veld onder dezelfde key, dus dezelfde key kan op twee apparaten
  onafhankelijk ontstaan.
- Favorieten: geen id, dedupe op naam (CLAUDE.md en saveFavs-pad).
- MOCK_CHOOSE-sessies: geen id-veld, identificatie op naam (app.js:4065 e.v.).

### Waar tijd wordt vastgelegd tijdens een sessie

- `sessionStartTime` (app.js:529): absolute epoch-ms, gezet in
  startSession (app.js:1311); op de branch hersteld uit `crimpify_active.st`.
- `blockClockStart` (app.js:531): absolute epoch-ms per blok, gezet in
  openBlock (app.js:1385). `blockClockElapsed()` (app.js:532) is het enige
  dat gelogde bloktijd bepaalt: wall-clock verschil, geen teller.
- `timerElapsed`/`timerSeconds` (app.js:527): tellende 1s-setInterval,
  alleen weergave in de detail-timer; gaat nooit naar opslag. Zelfde geldt
  voor de guided/drill-intervals.
- `sessionLog` (in-memory object `{idx: {name, planned, spent, color,
  status?, skipReason?, count?}}`): gevuld in nextBlock (app.js:1320),
  finishBlock en skipBlock (app.js:1347).
- Naar opslag: `crimpify_active` bij elke blokgrens, elke boulder-tik en
  elke 5 s (heartbeat, branch); `crimpify_history` pas bij de
  stoplicht-tik of het sluiten van de summary (signalTap app.js:990,
  logSessionDone app.js:465). Live (main) is het schrijfmoment alleen de
  blokgrens plus visibility hidden/pagehide, en gaan sessiestart en
  lopende blokklok bij een reload verloren.

### Versionering en migratie

- Eenmalige naam-migratie `odyssey_*` naar `crimpify_*` (app.js:419-429),
  copy-if-absent, oude keys blijven staan.
- Verder geen versienummer of migratielogica in de opgeslagen data. De
  conventie is additieve velden: oude entries missen velden en elke lezer
  heeft fallbacks (`e.wall != null`, `b.status === ...`, `a.st ||
  Date.now()`). Data van een oudere appversie blijft geldig; het enige
  zichtbare gevolg is de recap-melding voor entries zonder structuur
  (app.js:2118).
- De sw-cacheversie (`crimpify-v39`, sw.js:2) versioneert assets, niet data.

## 3. Bestaande auth of backend

- Auth, accounts, login, tokens, wachtwoorden, databases, env-vars:
  niet aanwezig. Grep op token/login/account/password/api/supabase/firebase
  levert alleen UI-copy op ("works without an account", index.html:125,
  475, 530; app.js:3060 e.v.) en de testscripts.
- Netwerkverzoeken, volledig overzicht:
  1. GoatCounter: extern script `//gc.zgo.at/count.js` met endpoint
     `https://crimpify.goatcounter.com/count` (index.html:630-631);
     events via trackEvent (app.js:3763-3764), no-op zonder count.js.
     Geen sleutel: de sitecode zit in het publieke data-attribuut.
  2. Service worker: fetch-passthrough voor de eigen assets
     (sw.js:46, 57), zelfde origin.
  3. `fetch('crimpify-mono.svg')` (app.js:1134) voor de eindkaart,
     eigen origin.
  4. Google Fonts (index.html, link-tags) en `navigator.share` naar het
     OS-deelvenster.
- Dode of gevlagde backend-code: niet aanwezig. Het dichtstbijzijnde is
  de mock-laag MOCK_CHOOSE (app.js:4065 e.v.), expliciet gemarkeerd als
  throwaway zonder opslag.

## Breekpunten zodra er een server achter komt

1. Geen sessie-identiteit: alles eigen of gedeeld heet id `'custom'`; tellen, dedupliceren of refereren kan alleen op naam.
2. Historie-identiteit is `Date.now()`: botst bij sync tussen apparaten en is niet globaal uniek.
3. Favorieten dedupliceren op naam: twee verschillende sessies met dezelfde naam zijn nu al een conflict, met meerdere gebruikers zeker.
4. De deel-link bevat geen id of schemaversie: een server kan opens en remixes niet aan een canonieke sessie koppelen.
5. `ux_`-blokkeys ontstaan device-lokaal en reizen via `x` mee: dezelfde key kan op verschillende apparaten iets anders betekenen.
6. Opgeslagen data heeft geen versieveld: server-side migratie moet op veldaanwezigheid raden.
7. Alle timestamps zijn client-klok zonder timezone: ACWR en historie zijn niet te reconcilen met een serverklok.
8. localStorage is de enige waarheid, zonder merge- of conflictstrategie: een tweede apparaat mid-sessie forkt onzichtbaar.
9. Load en ACWR worden client-side uit lokale historie berekend: een server die ranking op completions bouwt krijgt een tweede, afwijkend model.
10. Mock (done-tellers, MOCK_CHOOSE) en echte data delen dezelfde structuren zonder markering per record.
