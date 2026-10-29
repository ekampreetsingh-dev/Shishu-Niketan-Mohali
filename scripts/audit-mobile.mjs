// Mobile alignment audit: finds clipped, overflowing and truncated elements.
//   node scripts/audit-mobile.mjs [width]
const CDP = "http://127.0.0.1:9222";
const W = Number(process.argv[2] || 360);
const ROUTES = ["home", "about", "academics", "infrastructure", "admissions", "gallery", "achievements", "books-list", "mandatory-public-disclosure", "contact", "pay-fees"];

const v = await (await fetch(`${CDP}/json/version`)).json();
const ws = new WebSocket(v.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pend = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) {
    const { res, rej } = pend.get(m.id);
    pend.delete(m.id);
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
  }
});
const send = (method, params = {}, sessionId) =>
  new Promise((res, rej) => {
    const i = ++id;
    pend.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send("Emulation.setDeviceMetricsOverride", { width: W, height: 780, deviceScaleFactor: 2, mobile: true }, sessionId);

const probe = `(() => {
  const vw = innerWidth;
  const out = { docOverflow: document.documentElement.scrollWidth - vw, clipped: [], widerThanParent: [], truncated: [], touchingEdge: [] };
  const label = (el) => {
    const cls = String(el.className || '').trim();
    return el.tagName.toLowerCase() + (cls ? '.' + cls.split(/\\s+/).slice(0, 3).join('.') : '');
  };
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const style = getComputedStyle(el);
    if (style.position === 'fixed') return;
    // sticking out of the viewport horizontally
    if (r.right > vw + 1 || r.left < -1) out.clipped.push({ el: label(el), left: Math.round(r.left), right: Math.round(r.right), text: (el.innerText || '').trim().slice(0, 26) });
    // child overflowing a non-scrolling parent
    const p = el.parentElement;
    if (p) {
      const pr = p.getBoundingClientRect();
      const ps = getComputedStyle(p);
      if (ps.overflowX === 'visible' && r.right > pr.right + 2 && r.width < pr.width) {
        out.widerThanParent.push({ el: label(el), parent: label(p), over: Math.round(r.right - pr.right) });
      }
    }
    // text truncated by its own box
    if (el.innerText && el.innerText.trim() && el.scrollWidth > el.clientWidth + 2 && style.overflowX !== 'auto' && style.overflowX !== 'scroll') {
      out.truncated.push({ el: label(el), scrollW: el.scrollWidth, clientW: el.clientWidth, text: el.innerText.trim().slice(0, 26) });
    }
  });
  out.clipped = out.clipped.slice(0, 12);
  out.widerThanParent = out.widerThanParent.slice(0, 10);
  out.truncated = out.truncated.slice(0, 10);
  return JSON.stringify(out);
})()`;

const fs = await import("node:fs");

for (const route of ROUTES) {
  await send("Page.navigate", { url: `http://localhost:5173/${route === "home" ? "" : route}` }, sessionId);
  await sleep(2000);
  // walk the page so lazy content settles
  for (const frac of [0.25, 0.5, 0.75, 1]) {
    await send("Runtime.evaluate", { expression: `window.scrollTo(0, document.documentElement.scrollHeight * ${frac})` }, sessionId);
    await sleep(350);
  }
  await send("Runtime.evaluate", { expression: "window.scrollTo(0,0)" }, sessionId);
  await sleep(300);
  const r = await send("Runtime.evaluate", { expression: probe, returnByValue: true }, sessionId);
  const d = JSON.parse(r.result.value);
  const issues = [];
  if (d.docOverflow > 1) issues.push(`H-OVERFLOW ${d.docOverflow}px`);
  if (d.clipped.length) issues.push(`clipped x${d.clipped.length}`);
  if (d.widerThanParent.length) issues.push(`overflow-parent x${d.widerThanParent.length}`);
  if (d.truncated.length) issues.push(`truncated x${d.truncated.length}`);
  console.log(`\n### ${route.padEnd(28)} ${issues.length ? issues.join(" | ") : "clean"}`);
  for (const c of d.clipped.slice(0, 6)) console.log(`   clipped   L=${c.left} R=${c.right}  ${c.el}  "${c.text}"`);
  for (const c of d.widerThanParent.slice(0, 5)) console.log(`   overparen +${c.over}px  ${c.el}  inside ${c.parent}`);
  for (const c of d.truncated.slice(0, 5)) console.log(`   truncated ${c.scrollW}>${c.clientW}  ${c.el}  "${c.text}"`);
  const { data } = await send("Page.captureScreenshot", { format: "png" }, sessionId);
  fs.default.writeFileSync(`.verify/m-${W}-${route}.png`, Buffer.from(data, "base64"));
}

await send("Target.closeTarget", { targetId });
ws.close();
console.log(`\nshots in .verify/m-${W}-*.png`);
