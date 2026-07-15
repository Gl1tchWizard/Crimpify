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
- **Service worker:** cachenaam is `crimpify-v4`. Bumpen bij elke deploy die
  bestanden wijzigt (`crimpify-v5`, enz.), anders zien bezoekers de oude versie.
- **Deploy:** push naar de Pages-repo root. `CNAME` bevat `crimpify.com`.
- **Logo:** inline SVG-symbols in index.html: `#cf-mark` (viewBox 0 0 362 413) en
  `#cf-word` (viewBox 0 0 2460 476), beide `fill="currentColor"`. Losse bestanden:
  `crimpify-mark.svg` (kleur, voor lichte ondergrond), `crimpify-mono.svg`
  (currentColor, voor donkere ondergrond), `crimpify-wordmark.svg`.

### localStorage-schema (prefix `crimpify_`, migratie vanaf `odyssey_` bestaat al)

| key | inhoud |
|---|---|
| `crimpify_history` | array, nieuwste eerst, max 50: `{id, variant, time, ts, sig, load}` |
| `crimpify_favs` | max 12: `{name, keys, color, rpe, intent, time}` |
| `crimpify_draft` | `{keys, name, color, rpe, intent, locked, owned}` |
| `crimpify_custom_blocks` | eigen oefeningen, keys met `ux_`-prefix |
| `crimpify_hidden_blocks` | verborgen blokken |
| `crimpify_name` | voornaam voor de begroeting |

`sig` is het stoplicht: `'green' | 'orange' | 'red' | null`. `load` = duur ×
intensiteitsfactor (zie `INTENSITY_FACTORS` in de code, Foster/Gabbett-model,
voedt de ACWR-berekening; heeft ~4 weken historie nodig).

## Ontwerptokens

- **Acid (enige accentkleur): `#E6F557`.** De oude `#E8FF47` is overal vervangen;
  nooit terug laten sluipen. Achtergrond `#0A0A0A`, oppervlakken `#111110`/`#161614`,
  randen `#1E1E1C`/`#252523`, tekst `#F5F5F2`, subtekst `#9A9A96`.
- **Typografie:** Barlow Condensed 800/900 voor koppen (uppercase mag), Barlow voor
  lopende tekst, DM Mono uitsluitend voor datawaardes en microlabels.
  **Ondergrens 10px**; de bestaande 7–9px labels bij aanraking opschonen.
- **Kleur betekent iets of is er niet.** Op de landing is acid de enige accentkleur
  en betekent "actie". De semantische energiesysteemkleuren (blauw HoG, groen
  capacity, paars drills, amber, enz.) verschijnen alleen binnen sessies en de
  bibliotheek, waar ze informatie coderen. Stoplichtkleuren: `#4ADE80` groen,
  `#FB923C` oranje, `#F87171` rood.
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

## Landing-hiërarchie (staat sinds 0.1 zo, bewaken)

begroeting → weekteller/fase-regel → tijdchips (altijd zichtbaar) → minimal-dose-regel
(stil, grijs) → coach-kaart (alleen met data, met reden erbij) → Genereer/Bouw →
Mijn sessies (alleen met inhoud, met stoplicht-dots) → rest. Zoekbalk staat verborgen;
mag terug als icoon, niet als balk bovenaan. Lege staat toont vrijwel niets behalve
begroeting, tijd en Genereer.

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
4. **Token-refactor.** Inline kleuren naar CSS-variabelen. Pas daarná light mode
   als alternatieve variabelenset achter `prefers-color-scheme`.
5. **Lege-staat-verfijning en microtypografie-opschoning** (10px-ondergrens,
   contrastfloor: geen #4A4A46-tekst op #0A0A0A voor kleine labels).
6. **Zoek als icoon** in de topbar, bibliotheek als eigen weergave.
7. Later, uit de concept-mocks over te nemen skelet-ideeën: vaste bottom-nav,
   shortcuts-rij (horizontaal scrollend, acht energiesystemen, geen "Mobility"
   als categorie). Afgewezen uit die mocks: avatar, notificatiebel,
   voltooiingspercentages, derde bouw-ingang, Engels/Nederlands-mix.

## Werkafspraken

- Eén wijziging per commit-onderwerp, sw-cache bumpen bij deploy.
- Sober Engels in UI-copy, geen consultant-taal, geen em-dashes in teksten.
- Versienummer op de splash (nu v0.11) bij elke release ophogen, samen met de sw-cache.
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
