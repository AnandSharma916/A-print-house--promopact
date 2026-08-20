/**
 * smoke-test.mjs — drives headless Chrome over CDP to check that every route
 * actually boots: vendor globals present, legacy engine ran, no console errors.
 *
 * Static markup checks live in verify-fidelity.mjs; this covers the half of the
 * conversion that only shows up at runtime.
 *
 * Usage: node scripts/smoke-test.mjs   (needs the server running)
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.env.BASE_URL || 'http://localhost:3111';
const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;

const ROUTES = [
  '/', '/about-us', '/contact-us',
  '/premium-playing-cards', '/promotional-playing-cards',
  '/advertisement-playing-cards', '/card-games', '/corporate-playing-cards',
  '/souvenir-playing-cards', '/branded-playing-cards', '/poker-cards',
  '/educational-cards', '/flash-cards',
];

/* Globals each engine's code dereferences without a typeof guard. */
const EXPECTED_GLOBALS = {
  home: ['gsap', 'ScrollTrigger', 'CustomEase', 'Lenis', 'Swiper'],
  product: ['gsap', 'ScrollTrigger', 'Lenis', 'anime', 'Atropos', 'LocomotiveScroll'],
};
const HOME_ROUTES = new Set(['/', '/contact-us']);

/**
 * Pre-existing breakage carried over from the static site — reported, but not
 * counted as a conversion failure.
 *
 * style.css:2025 sets a section background to an image that has never existed
 * in this project (it 404s on the original site too; the section renders flat
 * dark because of the near-opaque gradient layered over it). Fixing it means
 * either supplying the artwork or dropping the rule, which is a design call.
 */
const KNOWN_ISSUES = [/imgi_11_621440636/];

const userDataDir = mkdtempSync(join(tmpdir(), 'aiph-smoke-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--disable-gpu',
  '--window-size=1440,900',
  'about:blank',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cdpEndpoint() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      return (await r.json()).webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  throw new Error('Chrome did not expose a debugging port');
}

/* Minimal CDP client: send(method, params) -> Promise<result>. */
function connect(url) {
  const ws = new WebSocket(url);
  const pending = new Map();
  const listeners = [];
  let id = 0;

  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) {
      listeners.forEach((fn) => fn(msg));
    }
  });

  const ready = new Promise((resolve) => ws.addEventListener('open', resolve));

  return {
    ready,
    on: (fn) => listeners.push(fn),
    send(method, params = {}, sessionId) {
      const msgId = ++id;
      return new Promise((resolve, reject) => {
        pending.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
      });
    },
    close: () => ws.close(),
  };
}

let failures = 0;

try {
  const client = connect(await cdpEndpoint());
  await client.ready;

  const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await client.send('Target.attachToTarget', { targetId, flatten: true });

  await client.send('Runtime.enable', {}, sessionId);
  await client.send('Log.enable', {}, sessionId);
  await client.send('Page.enable', {}, sessionId);
  await client.send('Network.enable', {}, sessionId);

  let problems = [];
  client.on((msg) => {
    if (msg.sessionId !== sessionId) return;
    if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails;
      problems.push(`uncaught: ${d.exception?.description || d.text}`);
    }
    /* Name the URL — "Failed to load resource" on its own is undebuggable. */
    if (msg.method === 'Network.responseReceived' && msg.params.response.status >= 400) {
      problems.push(`HTTP ${msg.params.response.status}: ${msg.params.response.url}`);
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      if (/Failed to load resource/.test(msg.params.entry.text)) return; // covered above
      problems.push(`console.error: ${msg.params.entry.text}`);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      const text = msg.params.args.map((a) => a.description || a.value).join(' ');
      problems.push(`console.error: ${text}`);
    }
  });

  const evaluate = async (expression) => {
    const r = await client.send(
      'Runtime.evaluate',
      { expression, returnByValue: true, awaitPromise: true },
      sessionId
    );
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  };

  for (const route of ROUTES) {
    problems = [];
    await client.send('Page.navigate', { url: BASE + route }, sessionId);
    /* Vendor scripts load in series off a CDN; give them room. */
    await sleep(4500);

    const variant = HOME_ROUTES.has(route) ? 'home' : 'product';
    const missingGlobals = await evaluate(
      `(${JSON.stringify(EXPECTED_GLOBALS[variant])}).filter(g => typeof window[g] === 'undefined')`
    );

    /* The engines add these to the DOM; their presence proves the engine ran. */
    const state = await evaluate(`({
      header: !!document.getElementById('site-header'),
      scrollTriggers: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : -1,
      lenisAttr: !!document.documentElement.className.match(/lenis/),
      brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth === 0)
        .map(i => i.getAttribute('src')).slice(0, 5),
    })`);

    const issues = [];
    if (missingGlobals.length) issues.push(`missing globals: ${missingGlobals.join(', ')}`);
    if (!state.header) issues.push('no #site-header');
    if (state.scrollTriggers === 0) issues.push('engine created no ScrollTriggers');
    if (state.brokenImgs.length) issues.push(`broken images: ${state.brokenImgs.join(', ')}`);

    const known = [];
    problems.forEach((p) => {
      (KNOWN_ISSUES.some((re) => re.test(p)) ? known : issues).push(p);
    });

    if (issues.length) failures++;
    console.log(
      `${issues.length ? 'FAIL' : 'ok  '} ${route.padEnd(30)} ` +
        `triggers=${state.scrollTriggers}`
    );
    issues.forEach((i) => console.log(`       ${i}`));
    known.forEach((i) => console.log(`       (known, pre-existing) ${i}`));
  }

  /* Client-side navigation is the case the old static site never had. The
     legacy engines rewrite React's DOM, so an unmount can throw and blank the
     route; assert the soft-navigated page ends up equivalent to a fresh load. */
  console.log('\n-- client-side navigation --');
  const PROBE = `({
    path: location.pathname,
    triggers: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : -1,
    sections: document.querySelectorAll('section').length,
    imgs: document.images.length,
    decks: document.querySelectorAll('.deck-card').length,
    headings: [...document.querySelectorAll('h2')].map(h => h.textContent.trim()).join('|'),
  })`;

  problems = [];
  await client.send('Page.navigate', { url: BASE + '/premium-playing-cards' }, sessionId);
  await sleep(4500);
  const direct = await evaluate(PROBE);

  problems = [];
  await client.send('Page.navigate', { url: BASE + '/' }, sessionId);
  await sleep(4500);
  const homeTriggers = await evaluate('window.ScrollTrigger.getAll().length');
  await evaluate(`document.querySelector('a[href="/premium-playing-cards"]').click()`);
  await sleep(4500);
  const soft = await evaluate(PROBE);

  const navIssues = [];
  if (soft.path !== '/premium-playing-cards') navIssues.push(`landed on ${soft.path}`);
  if (soft.headings !== direct.headings) navIssues.push('page content differs from a fresh load');
  if (soft.sections !== direct.sections) navIssues.push(`sections ${soft.sections} vs ${direct.sections}`);
  if (soft.decks !== direct.decks) navIssues.push(`decks ${soft.decks} vs ${direct.decks}`);
  if (soft.triggers === 0) navIssues.push('engine did not re-initialise');
  if (soft.triggers > direct.triggers * 1.5) navIssues.push(`triggers leaked: ${soft.triggers} vs ${direct.triggers} fresh`);
  problems.filter((p) => /uncaught|removeChild/.test(p)).forEach((p) => navIssues.push(p));

  if (navIssues.length) failures++;
  console.log(
    `${navIssues.length ? 'FAIL' : 'ok  '} / -> /premium-playing-cards  ` +
      `triggers ${homeTriggers}->${soft.triggers} (fresh load ${direct.triggers})  ` +
      `sections=${soft.sections} decks=${soft.decks}`
  );
  navIssues.forEach((i) => console.log(`       ${i}`));

  client.close();
} finally {
  chrome.kill();
  try { rmSync(userDataDir, { recursive: true, force: true }); } catch { /* locked */ }
}

console.log(failures ? `\n${failures} check(s) failed` : '\nAll routes boot cleanly');
process.exit(failures ? 1 : 0);
