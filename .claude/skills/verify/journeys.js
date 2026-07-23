// Crimpify reistests: vier complete gebruikersreizen (A-D) die na elke
// wijziging volledig gelopen worden. Elke reis eindigt met nul console- en
// page-errors en de assertie dat elke tik deed wat het interactiemodel zegt.
// Draaien: server op 8317 (python -m http.server vanuit de repo), dan
//   node <repo>\.claude\skills\verify\journeys.js
// vanuit een map met playwright-core in node_modules (bv. de scratchpad).
let chromium;
try { ({ chromium } = require('playwright-core')); }
catch { ({ chromium } = require(require('path').join(process.cwd(), 'node_modules', 'playwright-core'))); }
const URL0 = process.env.CRIMPIFY_URL || 'http://127.0.0.1:8317/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const failures = [];
function assert(cond, msg) { console.log((cond ? '  PASS ' : '  FAIL ') + msg); if (!cond) failures.push(msg); }

async function newCtx(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => localStorage.setItem('crimpify_name', 'Test'));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { const t = m.text(); if (m.type() === 'error' && !/goatcounter|gc\.zgo\.at|count\.js/i.test(t)) errors.push('console: ' + t); });
  await page.goto(URL0, { waitUntil: 'load' });
  await page.waitForSelector('#splash', { state: 'detached', timeout: 15000 });
  return { ctx, page, errors };
}
const dlgOpen = (p, id) => p.evaluate(x => { const el = document.getElementById(x); return !!el && el.style.display === 'flex'; }, id);
const view = p => p.evaluate(() => activeView());
const inPlayer = v => ['v-detail','v-guided','v-drills','v-drillfocus','v-check'].includes(v);

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  // ── REIS A: Nieuws → blok-detail → APPEARS IN → preview → START → speler → terug ──
  console.log('REIS A');
  const A = await newCtx(browser);
  await A.page.evaluate(() => openBlockDetail('fiveProblems'));   // vers blok, staat ook in News
  assert(await dlgOpen(A.page, 'blockDetail'), 'A blok-detail open');
  assert(await A.page.evaluate(() => !document.getElementById('bdTryBtn')), 'A geen TRY THIS NOW meer');
  await A.page.click('#blockDetailBody .ch-shelf .ch-card');       // appears-in kaart
  await sleep(300);
  assert(await dlgOpen(A.page, 'previewView'), 'A preview open via appears-in');
  assert(!(await dlgOpen(A.page, 'blockDetail')), 'A blok-detail netjes gesloten (geen wees-overlay)');
  const pvBlocks = await A.page.evaluate(() => document.querySelectorAll('#previewBody .pv-block').length);
  assert(pvBlocks >= 4, `A preview toont blokken (${pvBlocks})`);
  await A.page.click('#previewView .start-btn');                   // Start session → slab
  await A.page.waitForSelector('#v-session.active', { timeout: 10000 });
  assert(!(await dlgOpen(A.page, 'blockDetail')) && !(await dlgOpen(A.page, 'previewView')), 'A geen overlays boven de slab');
  await A.page.click('#startBtn');                                 // START → speler
  await sleep(500);
  assert(inPlayer(await view(A.page)), `A speler open (${await view(A.page)})`);
  await A.page.click('.view.active .back-btn');                    // terug (exit-guard laat direct door)
  await sleep(400);
  assert(await view(A.page) === 'v-session', 'A terug landt op de slab');
  assert(A.errors.length === 0, 'A nul errors' + (A.errors.length ? ': ' + A.errors.join(' | ') : ''));
  await A.ctx.close();

  // ── REIS B: Nieuws → blok-detail → ADD TO SESSION → builder → tik → duur → LOCK IN → START ──
  console.log('REIS B');
  const B = await newCtx(browser);
  await B.page.evaluate(() => openBlockDetail('fiveProblems'));
  await B.page.click('#bdAddBtn');                                 // ADD TO SESSION (primair)
  await B.page.waitForSelector('#v-session.active', { timeout: 10000 });
  assert(await B.page.evaluate(() => activeSessionId === 'custom' && !sessionLocked && sessionOwned), 'B landt in eigen bewerkbare builder');
  const bIdx = await B.page.evaluate(() => currentBlocks.findIndex(b => b._key === 'fiveProblems'));
  await B.page.click(`#slabBlocks .slab-real[data-idx="${bIdx}"]`);
  await sleep(200);
  assert(await dlgOpen(B.page, 'blockEditDialog'), 'B tik opent het bewerkpaneel');
  assert(await B.page.evaluate(() => document.querySelectorAll('#blockEditBody .step-btn').length) === 2, 'B paneel is bewerkbaar (steppers)');
  const tBefore = await B.page.evaluate(i => currentBlocks[i].t, bIdx);
  await B.page.evaluate(() => beAdjust(5));
  assert(await B.page.evaluate(i => currentBlocks[i].t, bIdx) === tBefore + 5, 'B duur +5 via paneel');
  await B.page.evaluate(() => closeBlockEdit());
  await B.page.click('#saveBigBtn');
  await B.page.click('#saveFavDialog button:has-text("Lock in")');
  await B.page.click('#startBtn');
  await sleep(500);
  assert(inPlayer(await view(B.page)), `B LOCK IN → START → speler (${await view(B.page)})`);
  assert(B.errors.length === 0, 'B nul errors' + (B.errors.length ? ': ' + B.errors.join(' | ') : ''));
  await B.ctx.close();

  // ── REIS C: Choose → By Govert → preview (tik = info, kop = som) → BACK-stap → REMIX → bewerken → LOCK IN → START ──
  console.log('REIS C');
  const C = await newCtx(browser);
  await C.page.evaluate(() => { openChoose ? openChoose() : goTo('v-choose'); });
  await sleep(300);
  const placement = await C.page.evaluate(() => {
    const titles = [...document.querySelectorAll('#chooseBody .ch-shelf-title')].map(e => e.textContent);
    const apex = APEX_PICKS.includes('Five by Five');
    const sarah = MOCK_CHOOSE.find(s => s.name === 'Sarah Connor');
    return { titles, apex, sarahNew: sarah && sarah.cat === 'new' };
  });
  assert(!placement.titles.includes('By Glitch') && placement.apex && placement.sarahNew,
    `C coach-sessies in de gecureerde planken, geen eigen plank (${placement.titles.join(' · ')})`);
  // hero-BACK-stap: preview open en dicht moet op v-choose landen, niet op de landing
  await C.page.click('.ch-view-btn');
  await sleep(200);
  await C.page.click('#previewView .back-btn');
  await sleep(200);
  assert(await view(C.page) === 'v-choose' && !(await dlgOpen(C.page, 'previewView')), 'C BACK vanaf preview landt één stap terug (v-choose)');
  // By Govert-kaart → preview
  await C.page.click('#chooseBody .ch-shelf .ch-card');
  await sleep(300);
  assert(await dlgOpen(C.page, 'previewView'), 'C preview open vanaf coach-plank');
  const sums = await C.page.evaluate(() => {
    const s = MOCK_CHOOSE[_previewIdx];
    const head = document.querySelector('#previewBody .pv-meta span').textContent;
    const sum = s.keys.filter(k=>BLOCKLIB[k]).reduce((t,k)=>t+BLOCKLIB[k].t,0);
    return { head, sum, mins: sessionMins(s) };
  });
  assert(sums.head === `${sums.sum} min` && sums.mins === sums.sum, `C kop = som (${sums.head} == ${sums.sum})`);
  await C.page.click('#previewBody .pv-block');                    // tik op blok in preview
  await sleep(200);
  assert(await dlgOpen(C.page, 'blockEditDialog'), 'C preview-blok-tik geeft info, geen speler');
  assert(await C.page.evaluate(() => document.querySelectorAll('#blockEditBody .step-btn').length) === 0, 'C paneel is alleen-lezen');
  assert(await C.page.evaluate(() => /read only/i.test(document.querySelector('.be-hint').textContent)), 'C read-only hint zichtbaar');
  await C.page.evaluate(() => closeBlockEdit());
  await C.page.click('#previewView .pv-act:has-text("Remix")');    // REMIX prominent
  await C.page.waitForSelector('#v-session.active', { timeout: 10000 });
  assert(await C.page.evaluate(() => !sessionLocked && sessionOwned && customSession.basedOn), 'C remix geeft eigen bewerkbaar concept met attributie');
  await C.page.click('#slabBlocks .slab-real[data-idx="0"]');
  await sleep(200);
  const cEditable = await C.page.evaluate(() => document.querySelectorAll('#blockEditBody .step-btn').length);
  assert(await dlgOpen(C.page, 'blockEditDialog'), 'C tik in eigen concept opent paneel');
  await C.page.evaluate(() => closeBlockEdit());
  await C.page.click('#saveBigBtn');
  await C.page.click('#saveFavDialog button:has-text("Lock in")');
  await C.page.click('#startBtn');
  await sleep(500);
  assert(inPlayer(await view(C.page)), `C LOCK IN → START → speler (${await view(C.page)})`);
  assert(C.errors.length === 0, 'C nul errors' + (C.errors.length ? ': ' + C.errors.join(' | ') : ''));
  await C.ctx.close();

  // ── REIS D: deel-link → preview/slab (tik = alleen-lezen) → START → systeem-back → link OPNIEUW openen ──
  console.log('REIS D');
  const D0 = await newCtx(browser);
  const link = await D0.page.evaluate(() => {
    const i = MOCK_CHOOSE.findIndex(s => s.name === 'Five by Five');
    const keys = MOCK_CHOOSE[i].keys.filter(k => BLOCKLIB[k]);
    return encodePayload(MOCK_CHOOSE[i].name, keys, sessionMins(MOCK_CHOOSE[i]), MOCK_CHOOSE[i].color, keys.map(k => BLOCKLIB[k].t));
  });
  await D0.ctx.close();
  // echte eerste opening = page-load met hash (zoals een ontvangen link)
  const Dctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await Dctx.addInitScript(() => localStorage.setItem('crimpify_name', 'Test'));
  const Dpage = await Dctx.newPage();
  const Derrors = [];
  Dpage.on('pageerror', e => Derrors.push('pageerror: ' + e.message));
  Dpage.on('console', m => { const t = m.text(); if (m.type() === 'error' && !/goatcounter|gc\.zgo\.at|count\.js/i.test(t)) Derrors.push('console: ' + t); });
  const D = { ctx: Dctx, page: Dpage, errors: Derrors };
  await D.page.goto(URL0 + '#s=' + link, { waitUntil: 'load' });
  await D.page.waitForSelector('#v-session.active', { timeout: 15000 });
  assert(await D.page.evaluate(() => sessionLocked && !sessionOwned), 'D gedeelde sessie gelockt en niet owned');
  await D.page.click('#slabBlocks .slab-real[data-idx="0"]');
  await sleep(200);
  assert(await dlgOpen(D.page, 'blockEditDialog'), 'D tik op gedeeld blok geeft info, geen speler');
  assert(await D.page.evaluate(() => document.querySelectorAll('#blockEditBody .step-btn').length) === 0
      && await D.page.evaluate(() => /remix/i.test(document.querySelector('.be-hint').textContent)), 'D alleen-lezen met remix-hint');
  await D.page.evaluate(() => closeBlockEdit());
  await D.page.click('#startBtn');
  await sleep(500);
  assert(inPlayer(await view(D.page)), `D START → speler (${await view(D.page)})`);
  // systeem-back: één stap terug in-app, de app blijft staan
  await D.page.evaluate(() => history.back());
  await sleep(500);
  assert(await view(D.page) === 'v-session', 'D systeem-back gaat één stap terug (speler → slab)');
  assert((await D.page.url()).indexOf('#s=') === -1, 'D geen hash-resten in de URL na navigatie');
  // dezelfde link OPNIEUW openen in dezelfde tab (hashchange, geen page-load)
  await D.page.evaluate(() => { goTo('v-browse'); });
  await D.page.evaluate(h => { location.hash = h; }, '#s=' + link);
  await sleep(600);
  const reopened = await D.page.evaluate(() => ({ v: activeView(), n: currentBlocks.length, name: customSession && customSession.name }));
  assert(reopened.v === 'v-session' && reopened.n === 5 && reopened.name === 'Five by Five', `D link opnieuw openen werkt (${reopened.name}, ${reopened.n} blokken)`);
  assert(D.errors.length === 0, 'D nul errors' + (D.errors.length ? ': ' + D.errors.join(' | ') : ''));
  await D.ctx.close();

  // ── REIS E: verse bezoeker via deel-link → sessie doen → stoplicht → installatieprompt ──
  console.log('REIS E');
  const E0ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await E0ctx.addInitScript(() => localStorage.setItem('crimpify_name', 'Test'));
  const E0 = await E0ctx.newPage();
  await E0.goto(URL0, { waitUntil: 'load' });
  await E0.waitForSelector('#splash', { state: 'detached', timeout: 15000 });
  const eLink = await E0.evaluate(() => {
    const i = MOCK_CHOOSE.findIndex(s => s.name === 'Five by Five');
    const keys = MOCK_CHOOSE[i].keys.filter(k => BLOCKLIB[k]);
    return encodePayload(MOCK_CHOOSE[i].name, keys, sessionMins(MOCK_CHOOSE[i]), MOCK_CHOOSE[i].color, keys.map(k => BLOCKLIB[k].t));
  });
  await E0ctx.close();
  // verse bezoeker: GEEN naam vooraf, iPhone-UA (instructie-variant), GoatCounter-stub
  const Ectx = await browser.newContext({ viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' });
  await Ectx.addInitScript(() => {
    // stub die het echte count.js niet kan overschrijven of patchen:
    // object en count-methode achter accessors, assignments stil negeren
    const counts = [];
    const fn = o => counts.push((o && o.path) || 'pageview');
    const stub = {};
    Object.defineProperty(stub, 'counts', { get: () => counts });
    Object.defineProperty(stub, 'count', { get: () => fn, set: () => {} });
    Object.defineProperty(window, 'goatcounter', { get: () => stub, set: () => {} });
  });
  const E = await Ectx.newPage();
  const eErrors = [];
  E.on('pageerror', e => eErrors.push('pageerror: ' + e.message));
  E.on('console', m => { const t = m.text(); if (m.type() === 'error' && !/goatcounter|gc\.zgo\.at|count\.js/i.test(t)) eErrors.push('console: ' + t); });
  await E.goto(URL0 + '#s=' + eLink, { waitUntil: 'load' });
  await E.waitForSelector('#v-session.active', { timeout: 15000 });
  assert(await E.evaluate(() => activeView() === 'v-session'), 'E verse bezoeker ziet meteen de sessie, geen naamvraag ervoor');
  assert(await E.evaluate(() => window.goatcounter.counts.includes('shared-open-five-by-five')), 'E event: shared-open met sessienaam');
  // landing tonen: nog geen naamvraag (niets te personaliseren)
  await E.evaluate(() => goTo('v-browse'));
  assert(await E.evaluate(() => !document.querySelector('#greetEl input')), 'E landing zonder naamvraag voor de eerste sessie');
  assert(await E.evaluate(() => /This is the app/.test((document.getElementById('appLine') || {}).textContent || '')), 'E passieve app-regel staat laag op de landing');
  // sessie doen: start, samenvatting, stoplicht groen
  await E.evaluate(() => { goTo('v-session'); });
  await E.click('#startBtn');
  await sleep(400);
  assert(await E.evaluate(() => window.goatcounter.counts.includes('session-start')), 'E event: session-start');
  await E.evaluate(() => { goTo('v-session'); showSessionSummary(); });
  await E.click('#signalAsk button:first-child');   // groen
  await sleep(400);
  assert(await E.evaluate(() => window.goatcounter.counts.includes('session-done-green')), 'E event: session-done-green');
  // de prompt komt pas na het sluiten van de samenvatting, niet eronder
  assert(await E.evaluate(() => document.getElementById('installSheet').style.display !== 'flex'), 'E prompt wacht tot de samenvatting dicht is');
  await E.evaluate(() => closeSummary());
  await sleep(300);
  // piekmoment: installatieprompt, een keer, iOS-instructies
  const sheet = await E.evaluate(() => ({
    open: document.getElementById('installSheet').style.display === 'flex',
    ios: /Add to Home Screen/.test(document.getElementById('installSheetBody').textContent),
    tracked: window.goatcounter.counts.includes('install-prompt-shown'),
    flag: localStorage.getItem('crimpify_install_prompt')
  }));
  assert(sheet.open && sheet.ios, 'E installatieprompt met iOS-instructies op het piekmoment');
  assert(sheet.tracked && sheet.flag === 'shown', 'E event + keuze onthouden in localStorage');
  await E.click('#installSheetBody .be-done');
  assert(await E.evaluate(() => { maybeOfferInstall(); return document.getElementById('installSheet').style.display !== 'flex'; }), 'E prompt verschijnt nooit een tweede keer');
  // na de eerste sessie is er iets te personaliseren: naamvraag verschijnt
  await E.evaluate(() => { goTo('v-browse'); renderGreeting(); });
  assert(await E.evaluate(() => !!document.querySelector('#greetEl input')), 'E naamvraag verschijnt na de eerste gelogde sessie');
  await E.evaluate(() => { const i = document.querySelector('#greetEl input'); i.value = 'Fresh'; i.nextSibling.click(); });
  assert(await E.evaluate(() => /Fresh/.test(document.getElementById('greetEl').textContent)), 'E naam gezet, begroeting gepersonaliseerd');
  assert(eErrors.length === 0, 'E nul errors' + (eErrors.length ? ': ' + eErrors.join(' | ') : ''));
  await Ectx.close();

  await browser.close();
  console.log(failures.length ? '\nFAILURES: ' + failures.length : '\nALLE REIZEN GROEN');
  process.exit(failures.length ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR:', e); process.exit(2); });
