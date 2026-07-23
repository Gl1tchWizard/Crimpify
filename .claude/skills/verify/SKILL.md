---
name: verify
description: Crimpify end-to-end verifiëren — statische server + headless Edge via Playwright, geen build-stap.
---

# Crimpify verifiëren

Statische PWA (index.html + app.js + style.css), geen build. Verificatie =
de echte app driven in een headless browser en screenshots vastleggen.

## Recept dat werkt

1. Server: `Start-Process python -ArgumentList "-m","http.server","8317","--bind","127.0.0.1" -WorkingDirectory <repo> -WindowStyle Hidden`
   Stoppen na afloop: PID via `Get-NetTCPConnection -LocalPort 8317 -State Listen`.
2. Playwright zonder browser-download: `npm i playwright-core` in de scratchpad en
   `chromium.launch({ channel: 'msedge', headless: true })` (Edge zit op elke
   Windows 11-machine). Viewport 360×780 (mobile first) of 390×844.
3. Verse context = verse localStorage. Naamvraag overslaan met
   `page.addInitScript(() => localStorage.setItem('crimpify_name', 'Test'))`,
   of de prompt invullen: `input[placeholder="What should we call you?"]` + knop `OK`.
4. `page.on('pageerror')` en console-errors verzamelen; nul errors is de eis.

## Flows die je meestal drivet

- Landing → "Choose another →" → `#v-choose`; kaarten `.ch-card` openen de
  preview (`#previewView`), "Start session" → `#v-session` (slab).
- Slabblokken: `.slab-block:has-text("...")` tikken opent het blok
  (checklist-blokken → `#v-check`).
- Lock-in-dialog: `#saveFavDialog`, bevestigknop heet **"Lock in"** (niet "Save").
- Exit-guard: `#confirmExit`, knoppen "Stay"/"Leave" — selecteer binnen
  `#confirmExit` (losse `text=Leave` matcht ook verborgen catalogusteksten).

## Reistests (verplicht na elke wijziging)

Vier complete gebruikersreizen in `journeys.js` (deze map), te draaien in
plaats van losse padchecks. Server op 8317, dan vanuit een map met
playwright-core: `node <repo>\.claude\skills\verify\journeys.js`.

- **A** Nieuws → blok-detail → APPEARS IN → sessie-preview → START → speler
  → terug. Asserteert ook: preview toont blokken, blok-detail sluit netjes
  (geen wees-overlay), geen TRY THIS NOW.
- **B** Nieuws → blok-detail → ADD TO SESSION → builder → blok tikken →
  duur aanpassen → LOCK IN → START → speler.
- **C** Choose → gecureerde plank (coach-sessies verdeeld: Five by Five in
  Popular at Apex, Sarah Connor in New; geen eigen coach-plank) → preview →
  blok tikken (info, geen speler; alleen-lezen) → REMIX → eigen concept →
  blok tikken (bewerken) → LOCK IN → START. Plus: BACK vanaf de preview
  landt één stap terug, en kop-minuten == som van de blokduren.
- **D** Gedeelde link openen → gelockte slab → blok tikken (alleen-lezen,
  remix-hint) → START → systeem-back (één stap terug in-app) → dezelfde
  link opnieuw openen in dezelfde tab (hashchange-import) werkt.
- **E** Verse bezoeker (geen naam vooraf) via deel-link → sessie meteen
  zichtbaar, geen naamvraag → sessie doen → stoplicht loggen →
  installatieprompt op het piekmoment (een keer, keuze onthouden) →
  daarna pas de naamvraag op de landing. Asserteert ook de
  GoatCounter-events (shared-open, session-start, session-done-sig,
  install-prompt-shown) via een stub.

Let op: de naamvraag verschijnt sinds v0.41 pas na de eerste gelogde
sessie; `crimpify_name` vooraf zetten blijft de manier om hem in tests te
omzeilen.

Elke reis eindigt met: nul console/page-errors, en elke tik deed wat het
interactiemodel zegt (CLAUDE.md, "Interactiemodel: blok-tik en de ladder").

## Gotcha's

- **Verse Playwright-contexten verhullen de service worker.** Elke nieuwe
  context heeft geen SW en geen HTTP-cache, dus je test altijd de nieuwste
  code — terwijl een echte bezoeker door de SW-cache één of meer versies
  achterloopt. Test bij SW-gerelateerde wijzigingen óók de tweede load in
  DEZELFDE context (`navigator.serviceWorker.ready`, cache-inhoud checken,
  dan reload en de flow driven). De install gebruikt `cache:'reload'` zodat
  de named cache nooit oude bytes uit de HTTP-cache krijgt (sinds v18).

- Headless klikt zó snel dat de toast (1.8 s) nog in beeld staat op latere
  screenshots; dat is timing, geen bug. Meet met `performance.now()` als je twijfelt.
- De splash duurt ~2,3 s; wacht op een selector, niet op tijd.
- Testronde uit CLAUDE.md Werkafspraken: splash + versienummer, naamvraag,
  sessie genereren en starten, deel-link (`#s=`) in verse context, stoplicht
  loggen. sw-cache en splashversie horen bij elke deploy gebumpt te zijn.
