# Crimpify — projectcontext en ontwerpbrief

Sessiegenerator voor boulderaars. Genereer een training op maat, train met timers,
log met één tik hoe het voelde, deel de sessie via een link. Gratis, accountloos,
offline-capable PWA. Live op https://crimpify.com via GitHub Pages.

## Productprincipes (niet onderhandelbaar)

1. **Accountloos en lokaal.** Alle gebruikersdata staat in localStorage op het
   toestel. Er is geen server, geen login, geen tracking. Bouw nooit features die
   stilzwijgend een account of backend veronderstellen (avatars, notificatiebellen,
   cloud-sync). Personalisatie mag, maar lokaal: de naam staat in `crimpify_name`.
2. **De link is de data.** Gedeelde sessies zitten volledig gecodeerd in de URL
   (`#s=` base64url-JSON). Dat blijft het deelmechanisme; geen server-side state.
3. **Autoregulatie boven gamificatie.** Het stoplicht (groen/oranje/rood) is het
   kwaliteitssignaal, nooit voltooiingspercentages. Op tijd stoppen kan een goede
   sessie zijn. Geen scores die afmaken belonen.
4. **Open source.** AGPL-3.0; LICENSE staat in de repo.

## Techniek

- Drie bronbestanden: `index.html` (markup en inline SVG-symbols), `app.js`
  (alle JavaScript) en `style.css` (alle CSS), geladen via gewone script- en
  link-tags. Daarnaast `manifest.json`, `sw.js`, iconen en `og.png`.
  Geen build-stap, geen dependencies.
- **Service worker:** cachenaam is `crimpify-v19`. Bumpen bij elke deploy die
  bestanden wijzigt (`crimpify-v20`, enz.), anders zien bezoekers de oude versie.
- **Deploy:** push naar de Pages-repo root. `CNAME` bevat `crimpify.com`.
- **Logo:** inline SVG-symbols in index.html: `#cf-mark` (viewBox 0 0 362 413) en
  `#cf-word` (viewBox 0 0 2460 476), beide `fill="currentColor"`. Losse bestanden:
  `crimpify-mark.svg` (kleur, voor lichte ondergrond), `crimpify-mono.svg`
  (currentColor, voor donkere ondergrond), `crimpify-wordmark.svg`.

### localStorage-schema (prefix `crimpify_`, migratie vanaf `odyssey_` bestaat al)

| key | inhoud |
|---|---|
| `crimpify_history` | array, nieuwste eerst, max 50: `{id, variant, time, ts, sig, load}` |
| `crimpify_favs` | max 12: `{name, keys, color, rpe, intent, time, basedOn?}` |
| `crimpify_draft` | `{keys, name, color, rpe, intent, locked, owned, basedOn?}` |
| `crimpify_custom_blocks` | eigen oefeningen, keys met `ux_`-prefix |
| `crimpify_hidden_blocks` | verborgen blokken |
| `crimpify_name` | voornaam voor de begroeting |
| `crimpify_active` | onafgemaakte training voor de Continue-kaart: `{keys, name, color, sessionId, idx, spent, ts}`; verloopt na 12 uur |
| `crimpify_seen_news` | array met weggetikte news-ids; een weggetikt item komt niet terug |

`basedOn` is optioneel en additief: `{title, coach}` op kopieën uit de
catalogus; oude entries zonder basedOn blijven geldig.

`sig` is het stoplicht: `'green' | 'orange' | 'red' | null`. `load` = duur ×
intensiteitsfactor (zie `INTENSITY_FACTORS` in de code, Foster/Gabbett-model,
voedt de ACWR-berekening; heeft ~4 weken historie nodig).

## Ontwerptokens

Alle kleuren staan als CSS-variabelen in `:root` (style.css); nergens anders
kleurliterals. Uitzonderingen: de meta theme-color in index.html (kan geen
`var()` lezen, waarde `#0B0C0A`), pure zwart-schaduwen (`rgba(0,0,0,.x)`) en
de legacy-hexes in `nameColor()` (stringvergelijking, geen weergave). Tinten
en gloed via `color-mix(in srgb, var(--x) N%, …)` — vereist browsers van
2023+ (Chrome 111, Safari 16.2); geen fallback, bewuste keuze.

- **Surfaces:** `--ink #0B0C0A` (achtergrond), `--carbon #11120F`
  (kaarten/oppervlakken), `--graphite #292B25` (randen en dimme vlakken).
- **Typografie-kleuren:** `--chalk #F4F2EA` (tekst, nooit puur wit),
  `--dust #92968B` (gedempte tekst), `--disabled #55594F` (microlabels,
  uit-staat).
- **Merk: `--acid #E6F557`** met `--acid-text #0B0C0A` als tekst erop.
  De oude `#E8FF47` is overal vervangen; nooit terug laten sluipen.
- **Fingerprint (wat het traint):** `--prepare #72A7F2` (warm-up & activation,
  antagonist/core/gym, recovery & mobility, stretching, cooldown),
  `--volume #42D6A4` (capacity/aeroob volume, power endurance),
  `--max-effort #FF861F` (max strength & power, finger strength),
  `--skill #A58BFA` (technique & skills). Eigen oefeningen (`ux_`) = graphite
  met YOURS-badge. In `app.js` blijven de oude kleur-*namen* (green/lime/
  amber/red/blue/purple) bestaan als sleutels — localStorage, favorieten en
  deel-links slaan namen op — maar ze wijzen naar de vier tokens.
- **Load:** `--load-filled #E6F557` / `--load-empty #30332B`.
- **Stoplicht (aparte familie):** `--sig-green #4ADE80`,
  `--sig-orange #FB923C`, `--sig-red #F87171`.
- **States:** `--danger #F87171` (destructieve acties), `--success`
  (= chalk: done/success is neutraal, het vinkje draagt de betekenis).

### Kleurregels
1. Eén betekenis per kleur. Acid = merk, interactie, selectie en load; nooit
   een fingerprint-kleur, nooit decoratie. Eén vastgelegde uitzondering: de
   kleine NEW-marker in News (bewust besloten, juli 2026).
2. Load-indicatoren (phalanx) altijd `--load-filled`/`--load-empty`. Dit
   corrigeert de eerdere beslissing "phalanx in de dominante sessiekleur".
3. Stoplichtkleuren zijn exclusief het autoregulatiesignaal. Done/success =
   `--success`; destructief = `--danger`; tijd-cues (over/onder schema) zijn
   neutraal dust, geen kleursignaal.
4. Max 3 kleuren per sessiekaart; dominante prikkel 60–80%, prepare 10–25%
   (richtlijn voor sessiemakers; bestaande sessies niet herbalanceren).
   Fresh First is een bewuste uitzondering: drie gelijke fase-derden zijn
   daar het ontwerp (front-load-principe).
5. Tekst chalk, nooit puur wit. Gedempt = dust. Randen = graphite.
6. Geen willekeurige kleuren in sessiekaarten; alleen semantische tokens.

- **Typografie:** Barlow Condensed 800/900 voor koppen (uppercase mag), Barlow voor
  lopende tekst, DM Mono uitsluitend voor datawaardes en microlabels.
  **Ondergrens 10px**; de bestaande 7–9px labels bij aanraking opschonen.
- **Logo plat.** Geen glow, geen 3D, geen schaduwen op het mark. Kleine subtiele
  gloed op de splash is het maximum.
- **Light mode (later, zie backlog):** acid werkt op licht alleen als vulling met
  donkere tekst erop, nooit als tekst- of lijnkleur. Alles wat op donker acid-tekst
  is wordt op licht inkt (bijna-zwart). Geen derde accentkleur introduceren; het
  violet uit de concept-mocks is expliciet afgewezen.
- **Signatuur-motief (kans):** de vier vingerkootjes van de crimp als
  voortgangsindicator (vier vullende blokken), de hexagon-C als lege-staat- en
  kadermotief. Merkherkenning uit vorm, niet alleen kleur.

## Taalregel

De hele interface is Engels (sinds v0.11), inclusief drills, blokuitleg, coach en
deel-teksten. Nederlandse strings mogen nergens terugkeren in user-facing tekst.
De code-commentaren zijn deels nog Nederlands; die mogen bij gelegenheid mee,
maar nooit ten koste van werkende code. De "Dynamic warm-up" heet "Charlie
warm-up" (inside joke, bewust).

## Landing-hiërarchie (herbouwd juli 2026: één sterk moment, bewaken)

1. **Header**: mark + wordmark, weekteller rechts. Klein, stil, geen avatar.
2. **Begroeting + tijd op één regel**: "Welcome back, [naam] · 60 MIN ⌄".
   Tijd is context, geen formulier; tik opent de compacte chip-rij (alle
   waarden 30…150 + ∞, geen "min"-labels) die na een keuze weer dichtklapt.
   Tijd wijzigen ververst Today's Pick live.
3. **Recommended today** (hernoemd van Today's Pick) — het primaire moment,
   één grote kaart: fingerprint-band (echte bloksequentie), titel,
   doel/duur/materiaal/load-pips (acid), één causale coachregel uit de
   bestaande coach/ACWR-logica (`coachSuggest` + `adaptCoachToTime`), een
   kleine "WHY THIS? →" die de volledige redenering uitklapt (`coachDetail`;
   de causale regel blijft staan, advies niet oordeel — productprincipe 3),
   grote acid START SESSION (opent de slab, nooit blind starten). De losse
   coach-kaart bestaat niet meer; rustadvies wordt een "Rest day"-variant met
   ghost-CTA. Lege staat: starterspick met "A good first session to get you
   going."
4. **Actieladder eronder** (bladeren is geen gedegradeerde nooduitgang meer):
   niveau 2 = een gevulde carbon-kaart "⌕ BROWSE SESSIONS · Find by goal, time
   or equipment" (opent Choose, géén acid-vulling); niveau 3 = een outline-knop
   "+ BUILD A SESSION" (opent Build). Eén acid-knop op het scherm: START
   SESSION (niveau 1) > BROWSE (gevuld, niveau 2) > BUILD (outline, niveau 3).
   De oude losse monospace-links zijn weg (lazen als metadata, niet als route).
5. **Continue** (alleen bij onafgemaakte training): eigen kaart boven Saved,
   "Block X of N · ~M min remaining", Resume hervat op blokgrens.
   Persistentie in `crimpify_active` (verloopt na 12 uur); lopende timers
   overleven een reload niet, blokvoortgang wel.
6. **Saved** (hernoemd van My sessions): alleen draft + favorieten, compacte
   rij, stoplicht-dot van de jongste gelijknamige sessie, geen
   history-kaarten meer (recaps lopen via de strip).
7. **Training rhythm**: 14-daagse strip met dag-letters en één dot per dag.
   Dot = stoplichtsignaal, neutraal gevuld zonder signaal, leeg zonder
   training — nooit sessietype-kleuren (vastgelegde beslissing: de strip
   toont hoe het gaat, niet wat je trainde). Eronder één regel
   "N sessions · load balanced" (ACWR-zone in één woord); tik opent het
   bestaande ACWR-paneel. Dots tikbaar naar de recap.
8. **News**: rustige plank net boven Discover, mag Recommended today nooit
   beconcurreren (kleine DM Mono-rijen, gedempte kop, acid alleen op de
   NEW-marker en de pijl). Twee bronnen: automatische "Freshly added: [naam]"
   uit een `addedDate`-veld op blokken/sessies (binnen 14 dagen, verloopt
   vanzelf, geen onderhoud) en handmatige `ANNOUNCEMENTS` in app.js
   (`{id, title, body, date, link?}`; link = `{type:'session', name}` |
   `{type:'block', key}` | url-string). Announcements boven auto-items, nieuwste
   eerst, hoogstens een paar zichtbaar. Elk item is wegtikbaar; weggetikte ids
   staan in `crimpify_seen_news` en komen niet terug. Is er niets zichtbaar,
   dan verbergt de sectie zich (geen lege huls). Een block-link opent de
   blok-detail-view, een session-link de preview.
9. **Discover**: één plank "Popular at Apex this week →" met de bestaande
   Choose-kaarten, blijft onderaan; inspiratie, geen navigatie (niet omhoog
   halen). De catalogus is een etalage, geen deur.

### Blok-detail-view (lezen → doen)
Elke blok heeft een detail-overlay, bereikbaar vanuit News en via de ⓘ in de
blok-bibliotheek (de + van de picker blijft de quick-add voor de builder).
Header: groepskicker in de categoriekleur, bloknaam, metaregel met rpe-tekst
als intensiteit (géén phalanx: pips = verwachte belasting, nooit rpe), basis-
duur en vormhint (guided/counted/sets). Daaronder de volledige uitleg mét
attributie en eventuele links. "Appears in" toont tikbare catalogus-kaarten
van sessies die het blok bevatten; geen matches = sectie weg. Twee acties:
TRY THIS NOW (acid, primair) genereert een minimale wrapper-sessie (Charlie
warm-up + dit blok) en opent de slab startklaar; ADD TO SESSION voegt het blok
toe aan de bestaande draft (of start een verse) en landt zichtbaar in de
builder. Nooit een stille add.

### Bottom navigation (gepland, uitgesteld)
De structurele oplossing voor navigatie is een vaste bottom-nav
(HOME · SESSIONS · BUILD · SAVED). Bewust uitgesteld tot na de eerste
veldtest; de actieladder op de landing (START > BROWSE > BUILD) overbrugt tot
dan. Nu bouwen zou voortijdig zijn.

### Climb with intent (uitgesteld tot na de eerste veldtest)
Intent-tracking op sessieniveau, nog niet bouwen. Gefundeerd op drie
onderzoekslijnen:

1. **Attentional focus** (Wulf, 15-jaars review): een EXTERNE focus (op het
   effect van de beweging) verslaat een interne focus (op lichaamsdelen) voor
   zowel prestatie als leren, over leeftijden en niveaus heen. Daarom worden
   alle intents geformuleerd als externe effecten, nooit als
   lichaamsinstructies: "no sound on the footholds", niet "focus on
   footwork"; "push the hold away", niet "straighten your arms"; "touch the
   hold where you aimed", niet "commit".
2. **OPTIMAL-theorie** (Wulf & Lewthwaite): autonomie versnelt motorisch
   leren. Intents worden altijd GEKOZEN door de klimmer uit een aangeboden
   set, nooit toegewezen. Consistent met productprincipe 3 (autoregulatie).
3. **Deliberate practice** (Ericsson): een goede intent beantwoordt "wat
   houdt me tegen", gekoppeld aan een zwakte of doel, met feedback op de
   uitvoeringskwaliteit.

Ontwerp bij bouwen:
- Vóór een sessie: optioneel 1-2 intents kiezen uit een kleine bibliotheek.
- Tijdens: de gekozen intent blijft zichtbaar als rustig label.
- Na afloop: één micro-reflectie naast het bestaande stoplicht: hield het
  effect stand? Eén tik, geen huiswerk.
- Intent-bibliotheek in vier categorieën: movement (silent feet, skeleton
  hang), effort (true tries: visualise twice, climb as visualised), process
  (no pulling on before a complete plan), head (falling is data).
- Let op: het schema heeft al een `intent`-veld in favs/draft — dat is nu de
  sessie-belofte-regel (één zin marketing-achtige omschrijving), niet dit
  concept. Vóór het bouwen checken of hergebruik kan of dat het botst; een
  naamconflict ligt voor de hand.
- Geen score, geen streaks, geen voltooiingspercentages: bewustzijn, geen
  gamification.

### Broadcast zonder backend
`ANNOUNCEMENTS` is het kanaal om alle gebruikers tegelijk iets te vertellen:
voeg een array-entry toe en deploy (GitHub Pages deployt vanaf main). Geen
server, geen backend — consistent met productprincipe 1. Het `addedDate`-veld
(ISO, bv. `'2026-07-16'`) is additief: blokken/sessies zonder dat veld doen
gewoon niet mee, entries ouder dan 14 dagen verdwijnen vanzelf uit News.

Visueel: drie niveaus (ink-achtergrond, gevulde carbon-kaarten, één primaire
kaart met het kleurmoment en de acid-CTA); weinig randen; display-font alleen
voor titels en primaire CTA's; metadata in DM Mono ≥10px in dust. Zoekbalk
blijft verborgen; mag terug als icoon, niet als balk bovenaan.

## Choose-flow (ontwerpbeslissingen uit de verkenning, juli 2026)

1. **Phalanx = verwachte belasting.** De vier vingerkootjes op een kaart tonen
   de verwachte belasting (vier standen), vastgesteld door de sessiemaker,
   zichtbaar vóór de sessie. Dit vervangt de eerdere beslissing "phalanx = rpe".
   RPE blijft een 1-10 gevoelde-inspanningsscore die de gebruiker ná een sessie
   geeft en staat nooit op discovery-kaarten. Verwachte belasting voedt het
   ACWR-model, consistent met het bestaande `load`-veld.
2. **Sociale maat = completions, geen likes.** Kaarten tonen voltooiingen in de
   stijl "184 done"; opslaan is de secundaire actie. Likes verdwijnen overal.
   Echt tellen vraagt een backend: tot die er is zijn de aantallen mock.
3. **Drie lagen kijkdiepte.** Discovery-kaart (kort: naam, vingerafdruk/tape,
   load, coach, één metaregel) → tik → preview (blokken, materiaal, niveau,
   volledige coachregel, why-this-session) → Start session opent de volledige
   sessie met alle opties. De primaire CTA op kaarten en hero is View session;
   Start session bestaat alleen op preview/detailniveau. Nooit rechtstreeks
   starten vanuit de catalogus.
4. **Planken, hybride strategie tot er een backend is.**
   - "30 minutes or less" (of passend bij de gekozen tijd): live berekend uit
     de lokale tijd-slider. Echt, geen mock.
   - "For you": client-side berekend uit de localStorage-historie (recente
     energiesystemen, signalen). Personalisatie zonder account, op het toestel,
     consistent met productprincipe 1.
   - "Popular at Apex": gecureerde plank, handmatig samengestelde lijst in
     afstemming met de Apex-gym, voorlopig hardcoded. Curatie in plaats van
     berekening; wordt berekend zodra er een backend is. Featured/New mogen
     blijven als redactionele planken.
   Als we groot gaan worden gecureerde planken berekende planken; het ontwerp
   blijft gelijk, alleen de bron verandert.
5. **Vastleggen, niet bouwen:** het vollere sessie-datamodel (title, creator,
   duration, primary_goal, skills[], energy_blocks[], equipment[],
   recommended_level, expected_load, completion_count, save_count) en de
   analytics-funnel (impression → opened → started → completed → repeated).
6. **Ster = opslaan, nooit sociaal.** De ster op kaarten, resultaatkaarten en
   preview bewaart de sessie lokaal via het bestaande favorietenmechanisme
   (`crimpify_favs`, dedupe op naam, max 12). Geen likes, geen tellers aan de
   ster. Opslaan geeft de toast "Saved on this device"; opgeslagen sessies
   verschijnen vanzelf bij Saved op de landing. Alleen in de Choose-view;
   de landing-Discover-plank blijft bewust sterloos (één sterk moment).
7. **Customize = lokale kopie.** Originelen in de catalogus zijn read-only en
   worden nooit gemuteerd. Customize opent de bestaande builder met een
   bewerkbare kopie die `basedOn: {title, coach}` draagt; boven de slab staat
   "BASED ON [origineel] by [coach]". Standaardtitel:
   `[origineel] · [naam] version` (fallback `your version`, middot, geen
   em-dash), aanpasbaar bij het vastleggen. basedOn reist mee door draft en
   favorieten maar nooit door deel-links. Gewone ster-saves krijgen géén
   basedOn; attributie markeert afleiding, niet bezit.
8. **Zoeken = icoon.** Het zoekicoon (⌕) in de v-choose-topbar klapt uit tot
   zoekveld + vijf single-select filterchips (time, goal, equipment, load,
   level). Zolang tekst of een chip actief is vervangen verticale
   resultaatkaarten (coach prominent) de planken; leegmaken of dichtklappen
   herstelt de planken. Actieve chips = acid outline; clear all alleen
   zichtbaar bij actieve filters. Guest-first: alle opslag en kopieën blijven
   op het toestel (productprincipe 1).
9. **Fase 2 (backend): remix-tellers en echte completions.** Een remix telt
   pas wanneer de kopie wordt opgeslagen; een completion pas wanneer een
   sessie is afgemaakt. Tot die tijd blijft "N done" het enige mock-getal;
   geen nieuwe nepgetallen introduceren.

## Backlog in volgorde

1. **Deelbare eindkaart.** Canvas-gegenereerde afbeelding bij "Sessie klaar":
   sessienaam, blokken, tijd, stoplicht, mark, en altijd de sessie-link (de
   identiteitsloop moet terugvoeren naar de rekruteringsloop). Web Share API met
   afbeelding, fallback download.
2. **Klikbare historie.** Sessies bij "Mijn sessies" zijn aanklikbaar en openen
   de recap-overlay. Staat hier omdat het punt 1 versterkt: de recap (met
   eindkaart en sessie-link) wordt zo ook achteraf bereikbaar, dus delen is niet
   langer beperkt tot het moment direct na de sessie.
3. **Export/backup.** Historie + favorieten serialiseren naar bestand of link,
   met import. Zelfde codeertruc als de deel-links. Dit is de derde
   verdedigingslinie voor dataverlies (naast `storage.persist()` en PWA-installatie,
   die er al zijn).
4. **Light mode.** De token-refactor is gedaan (juli 2026, palette-overhaul);
   light mode kan nu als alternatieve variabelenset achter
   `prefers-color-scheme`.
5. **Lege-staat-verfijning en microtypografie-opschoning** (10px-ondergrens,
   contrastfloor: geen #4A4A46-tekst op #0A0A0A voor kleine labels).
6. **Zoek als icoon** in de topbar, bibliotheek als eigen weergave. (Voor de
   Choose-catalogus gedaan, juli 2026; dit punt betreft nog de landing.)
7. Later, uit de concept-mocks over te nemen skelet-ideeën: vaste bottom-nav,
   shortcuts-rij (horizontaal scrollend, acht energiesystemen, geen "Mobility"
   als categorie). Afgewezen uit die mocks: avatar, notificatiebel,
   voltooiingspercentages, derde bouw-ingang, Engels/Nederlands-mix.

## Werkafspraken

- Eén wijziging per commit-onderwerp, sw-cache bumpen bij deploy.
- Sober Engels in UI-copy, geen consultant-taal, geen em-dashes in teksten.
- Versienummer op de splash (nu v0.25) bij elke release ophogen, samen met de sw-cache.
- Test na elke wijziging: splash met zichtbaar logo, naamvraag en herladen,
  sessie genereren en starten, deel-link openen in incognito, stoplicht loggen
  en dot terugzien bij Mijn sessies.

## Werkregels voor Claude Code

- Nooit rechtstreeks op `main` committen. GitHub Pages deployt vanaf main,
  dus main is live op crimpify.com. Eén branch per taak.
- Begin niet-triviale taken in plan mode: eerst een plan, geen bestandswijzigingen.
- Houd wijzigingen klein en reviewbaar. Geen ongevraagde refactors.
- Verwijder nooit bestaande functionaliteit om een implementatie te versimpelen.
- Bump de sw-cachenaam bij elke deploy die bestanden wijzigt.
- Draai na elke wijziging de testronde uit "Werkafspraken" voor je klaar meldt.
- Rapporteer bij afronding: gewijzigde bestanden, uitgevoerde tests, resterende
  risico's, beslissingen die menselijke goedkeuring nodig hebben.
