// Dogfood: real-browser A4 print-fidelity check of /studio across the 3 templates (#53, #62).
//
// Drives a Chromium instance over the DevTools Protocol (zero npm deps — uses Node's
// global WebSocket, Node >= 21) to load /studio, switch through each template, and verify
// the EXPORTED (print-media) résumé against the A4 page model (1122px/page, per
// .claude/rules/print.md). Captures screen + print-emulated screenshots per template.
//
// Two checks per template:
//   1. A4 bounds (screen) — rendered `.a4-page-context` height vs `pages * 1122` (overflow).
//   2. PRINT INTEGRITY (emulated print media — what actually exports to PDF), added for #62:
//        a. Content presence — every identity / contact / skill / credential string from the
//           real sample CV must remain VISIBLE in print (`innerText` excludes display:none).
//           This catches print.css silently hiding résumé content (#62 P1/P2).
//        b. No phantom page — printed document height must not exceed the résumé content
//           height by more than a tolerance, i.e. no blank trailing A4 page (#62 P3).
//
// This is the DYNAMIC layer (real DOM) that .claude/rules/print.md describes; pair it with the
// static `auditDocumentData` check in dogfood-a4-static.mjs.
//
// Prerequisites (NOT a CI gate — needs a browser + dev server, which CI does not have):
//   1. npm run dev                         # dev server on :3000
//   2. chromium --headless=new --no-sandbox --remote-debugging-port=9222 --user-data-dir=/tmp/x
//   3. node scripts/fpat/dogfood-a4.mjs    # env: STUDIO_URL, CDP_URL, OUT_DIR
//
// Exit 0 = all templates within A4 bounds AND print-integrity intact; 1 = a regression
// (overflow, hidden résumé content, or blank trailing page) — STOP and fix/report.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const CDP = process.env.CDP_URL ?? "http://localhost:9222";
const STUDIO = process.env.STUDIO_URL ?? "http://localhost:3000/studio";
const OUT = process.env.OUT_DIR ?? "docs/reports/2026-06-05";
// Filename prefix for the artifacts this run writes. The BARE `a4-*` names
// (empty prefix) are the FROZEN #1/#53 release-gate evidence cited by
// docs/reports/2026-06-05/fpat-release-archive.md and fpat-umbrella-dogfood.md —
// do NOT overwrite them from issue work. For an issue-specific run, set
// OUT_PREFIX (e.g. `issue-62-`) so evidence lands under its own filenames.
const PREFIX = process.env.OUT_PREFIX ?? "";
const PAGE_PX = 1122; // A4 height @ 96 DPI (.claude/rules/print.md)
const PHANTOM_TOL = 80; // px slack between content height and printed document height

const TEMPLATES = [
  { id: "dossier", name: "Executive Technical Dossier" },
  { id: "ats", name: "Clean ATS Hybrid" },
  { id: "visual", name: "Visual AI Portfolio" },
];

fs.mkdirSync(OUT, { recursive: true });

// --- Build the expected-content checklist from the REAL sample CV ----------------------------
// Both source files import only the `CVDocument` TYPE (erased on transpile), so the in-repo
// `typescript` compiler can strip types and we import the resulting ESM directly (same pattern
// as dogfood-a4-static.mjs — no new deps, no hard-coded résumé strings to drift).
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fpat-a4-"));
function loadTs(srcPath) {
  const src = fs.readFileSync(srcPath, "utf8");
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const clean = out.replace(/^\s*import\s+[^;]*from\s+['"]@\/[^'"]+['"];?\s*$/gm, "");
  const file = path.join(tmp, path.basename(srcPath).replace(/\.ts$/, ".mjs"));
  fs.writeFileSync(file, clean);
  return file;
}
// pathToFileURL: a bare absolute path is not a valid ESM specifier on every platform
// (notably Windows); import via a file:// URL.
const { sampleCV } = await import(pathToFileURL(loadTs("src/data/sample-cv.ts")).href);
const cv = sampleCV.content;
const EXPECT = [
  { kind: "name", text: cv.candidateIdentity.fullName },
  { kind: "headline", text: cv.candidateIdentity.professionalHeadline },
  ...cv.communicationChannels.map((ch) => ({ kind: `contact:${ch.iconType}`, text: ch.value })),
  ...cv.skillsInventory.map((s) => ({ kind: "skill", text: s.name })),
  ...cv.credentialsLibrary.map((c) => ({ kind: "credential", text: c.title })),
];

// --- CDP plumbing ----------------------------------------------------------------------------
const target = (await (await fetch(`${CDP}/json`)).json()).find((t) => t.type === "page");
if (!target) throw new Error("no CDP page target — is chromium running with --remote-debugging-port?");
const ws = new WebSocket(target.webSocketDebuggerUrl);
let msgId = 0;
const pending = new Map();
const send = (method, params = {}) => {
  const id = ++msgId;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((res) => pending.set(id, res));
};
await new Promise((r) => ws.addEventListener("open", r));
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m.result);
    pending.delete(m.id);
  }
});

const eval_ = async (expr) =>
  (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.value;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const setMedia = (media) => send("Emulation.setEmulatedMedia", { media });

await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: STUDIO });
await sleep(5500);

// Click a template card by the centre of the element carrying its human name.
// MUST run in screen media — the template cards are chrome and are display:none in print.
async function selectTemplate(name) {
  const box = await eval_(`(() => {
    const el = Array.from(document.querySelectorAll('div,button,[role=button]'))
      .filter(e => e.textContent && e.textContent.includes(${JSON.stringify(name)}) && e.textContent.length < 80)
      .sort((a,b)=>a.textContent.length-b.textContent.length)[0];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return JSON.stringify({ x: r.x + r.width/2, y: r.y + r.height/2 });
  })()`);
  if (!box) throw new Error(`template card not found: ${name}`);
  const { x, y } = JSON.parse(box);
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
  await sleep(1600);
}

// Read active page count (the page button whose class carries an active bg-) + a4 height (screen).
async function measureScreen() {
  const raw = await eval_(`(() => {
    const a = document.querySelector('.a4-page-context');
    const pages = Array.from(document.querySelectorAll('button'))
      .filter(b => /\\d+\\s*Page/.test(b.textContent));
    const active = pages.find(b => /\\bbg-/.test(b.className)) || pages[0];
    const count = active ? parseInt(active.textContent) : 1;
    return JSON.stringify({ scrollHeight: a.scrollHeight, offsetHeight: a.offsetHeight, pages: count });
  })()`);
  return JSON.parse(raw);
}

// Read the printed (emulated print media) résumé and check, per expected string, that it is
// actually PAINTED ON the A4 page. Two independent signals are required (logical AND), because
// each catches a failure mode the other misses:
//   • present  — the string is in `.a4-page-context`.innerText. innerText excludes
//                `display:none` / `visibility:hidden` subtrees, so this reliably catches the
//                #62 P1/P2 failure (print.css hiding <header>/<aside>).
//   • painted  — its smallest containing element is rendered (offsetParent set), of non-zero
//                area, within the `.a4-page-context` bounds, and not clipped out by an
//                overflow/clip ancestor. This catches the case CodeRabbit raised: text still in
//                the DOM (so it survives innerText) but visually clipped or translated off the
//                A4 viewport, which the exported PDF would not show.
// A string counts as visible only if BOTH hold — strictly stronger than an innerText check alone.
async function measurePrint(expect) {
  const NEEDLES = JSON.stringify(expect);
  const raw = await eval_(`(() => {
    const page = document.querySelector('.a4-page-context');
    const norm = (s) => (s || '').toLowerCase().replace(/\\s+/g, ' ').trim();
    const out = {
      a4Height: page ? page.scrollHeight : 0,
      docHeight: document.documentElement.scrollHeight,
      bodyHeight: document.body.scrollHeight,
      found: [],
    };
    if (!page) { out.found = ${NEEDLES}.map((n) => ({ ...n, ok: false, reason: 'no-page' })); return JSON.stringify(out); }
    const printedText = norm(page.innerText);            // display:none / visibility:hidden excluded
    const pr = page.getBoundingClientRect();
    const all = Array.from(page.querySelectorAll('*'));
    const clippedOut = (el) => {
      const r = el.getBoundingClientRect();
      let p = el.parentElement;
      while (p && p !== document.body) {
        const cs = getComputedStyle(p);
        if (/hidden|clip|scroll|auto/.test(cs.overflow + cs.overflowX + cs.overflowY)) {
          const q = p.getBoundingClientRect();
          if (r.right <= q.left + 0.5 || r.left >= q.right - 0.5 || r.bottom <= q.top + 0.5 || r.top >= q.bottom - 0.5) return true;
        }
        p = p.parentElement;
      }
      return false;
    };
    // Is the string rendered on-page somewhere (geometry signal)?
    const paintedOnPage = (nn) => {
      const cands = all
        .filter((e) => norm(e.textContent).includes(nn))   // textContent = pre-transform source text
        .sort((a, b) => a.textContent.length - b.textContent.length);
      for (const el of cands.slice(0, 12)) {
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || parseFloat(cs.opacity || '1') === 0) continue;
        if (el.offsetParent === null && cs.position !== 'fixed') continue; // display:none on el or an ancestor
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const inPage = r.left >= pr.left - 2 && r.right <= pr.right + 2 && r.bottom >= pr.top - 2 && r.top <= pr.bottom + 2;
        if (!inPage) continue;
        if (clippedOut(el)) continue;
        return true;
      }
      return false;
    };
    out.found = ${NEEDLES}.map((needle) => {
      const nn = norm(needle.text);
      const present = printedText.includes(nn);
      const painted = paintedOnPage(nn);
      const ok = present && painted;
      return { ...needle, ok, reason: ok ? '' : !present ? 'hidden-or-absent' : 'clipped-or-offscreen' };
    });
    return JSON.stringify(out);
  })()`);
  return JSON.parse(raw);
}

const results = [];
for (const t of TEMPLATES) {
  // --- screen pass: select template, screenshot, A4-bounds check ---
  await setMedia(""); // screen
  await selectTemplate(t.name);
  const m = await measureScreen();
  const budget = m.pages * PAGE_PX;
  const overflow = Math.max(0, m.scrollHeight - budget);
  const screenShot = await send("Page.captureScreenshot", { format: "png" });
  const screenFile = `${OUT}/${PREFIX}a4-${t.id}.png`;
  fs.writeFileSync(screenFile, Buffer.from(screenShot.data, "base64"));

  // --- print pass: emulate print media (what exports to PDF), screenshot, integrity check ---
  await setMedia("print");
  await sleep(500);
  const p = await measurePrint(EXPECT);
  const printShot = await send("Page.captureScreenshot", { format: "png" });
  const printFile = `${OUT}/${PREFIX}a4-${t.id}-print.png`;
  fs.writeFileSync(printFile, Buffer.from(printShot.data, "base64"));
  await setMedia(""); // restore screen for next selectTemplate

  const missing = p.found.filter((f) => !f.ok); // visible-on-page check failed (absent OR hidden/clipped)
  const phantomPage = p.docHeight > p.a4Height + PHANTOM_TOL; // blank trailing page
  const printOverflow = Math.max(0, p.a4Height - budget);
  const compliant = overflow === 0 && missing.length === 0 && !phantomPage && printOverflow === 0;

  results.push({
    ...t,
    screen: { ...m, budget, overflow },
    print: {
      a4Height: p.a4Height,
      docHeight: p.docHeight,
      printOverflow,
      phantomPage,
      missing: missing.map((x) => `${x.kind}:${x.text} (${x.reason})`),
    },
    compliant,
    screenShot: screenFile,
    printShot: printFile,
  });

  console.log(
    `${t.id.padEnd(8)} screenH=${m.scrollHeight} budget=${budget} overflow=${overflow} | ` +
      `printA4=${p.a4Height} printDoc=${p.docHeight} phantom=${phantomPage} missing=${missing.length} ` +
      `${compliant ? "OK" : "FAIL"}`,
  );
  if (missing.length) {
    for (const x of missing) console.log(`           NOT VISIBLE IN PRINT [${x.kind}] (${x.reason}): "${x.text}"`);
  }
  if (phantomPage) {
    console.log(`           BLANK PAGE: printed doc ${p.docHeight}px >> content ${p.a4Height}px`);
  }
}
ws.close();

fs.writeFileSync(`${OUT}/${PREFIX}a4-dogfood-results.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.compliant);
if (failed.length) {
  console.error(
    `\nA4 dogfood FAILED: ${failed.map((f) => f.id).join(", ")} — overflow, hidden résumé content, or blank trailing page.`,
  );
  process.exit(1);
}
console.log("\nA4 dogfood passed: all 3 templates within A4 bounds, full content prints, no blank page.");
