// Dogfood: real-browser A4 print-fidelity check of /studio across the 3 templates (#53).
//
// Drives a Chromium instance over the DevTools Protocol (zero npm deps — uses Node's
// global WebSocket, Node >= 21) to load /studio, switch through each template, and measure
// the real rendered height of `.a4-page-context` against the A4 page model (1122px/page,
// per .claude/rules/print.md). Captures a screenshot per template.
//
// This is the DYNAMIC layer (real DOM scrollHeight) that .claude/rules/print.md describes;
// pair it with the static `auditDocumentData` check in dogfood-a4-static.mjs.
//
// Prerequisites (NOT a CI gate — needs a browser + dev server, which CI does not have):
//   1. npm run dev                         # dev server on :3000
//   2. chromium --headless=new --no-sandbox --remote-debugging-port=9222 --user-data-dir=/tmp/x
//   3. node scripts/fpat/dogfood-a4.mjs    # env: STUDIO_URL, CDP_URL, OUT_DIR
//
// Exit 0 = all templates within A4 bounds; 1 = overflow detected (STOP and fix/report).

import fs from "node:fs";

const CDP = process.env.CDP_URL ?? "http://localhost:9222";
const STUDIO = process.env.STUDIO_URL ?? "http://localhost:3000/studio";
const OUT = process.env.OUT_DIR ?? "docs/reports/2026-06-05";
const PAGE_PX = 1122; // A4 height @ 96 DPI (.claude/rules/print.md)

const TEMPLATES = [
  { id: "dossier", name: "Executive Technical Dossier" },
  { id: "ats", name: "Clean ATS Hybrid" },
  { id: "visual", name: "Visual AI Portfolio" },
];

fs.mkdirSync(OUT, { recursive: true });

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

await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: STUDIO });
await sleep(5500);

// Click a template card by the centre of the element carrying its human name.
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

// Read active page count (the page button whose class carries an active bg-) + a4 height.
async function measure() {
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

const results = [];
for (const t of TEMPLATES) {
  await selectTemplate(t.name);
  const m = await measure();
  const budget = m.pages * PAGE_PX;
  const overflow = Math.max(0, m.scrollHeight - budget);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  const file = `${OUT}/a4-${t.id}.png`;
  fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
  results.push({ ...t, ...m, budget, overflow, compliant: overflow === 0, shot: file });
  console.log(
    `${t.id.padEnd(8)} pages=${m.pages} scrollH=${m.scrollHeight} budget=${budget} overflow=${overflow} ${overflow === 0 ? "OK" : "OVERFLOW"}  -> ${file}`,
  );
}
ws.close();

fs.writeFileSync(`${OUT}/a4-dogfood-results.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.compliant);
if (failed.length) {
  console.error(`\nA4 dogfood FAILED: ${failed.map((f) => f.id).join(", ")} overflow A4 bounds.`);
  process.exit(1);
}
console.log("\nA4 dogfood passed: all 3 templates within A4 bounds.");
