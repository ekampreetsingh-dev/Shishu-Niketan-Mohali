// Screenshot + console check against the CDP Chrome on :9222.
//   node scripts/verify.mjs [route ...]
// Writes shots to .verify/<name>-<width>.png and prints console errors.

import fs from "node:fs";
import path from "node:path";

const CDP = "http://127.0.0.1:9222";
const BASE = (process.env.VERIFY_BASE || "http://localhost:5173");
const OUT = ".verify";
fs.mkdirSync(OUT, { recursive: true });

const versions = await (await fetch(`${CDP}/json/version`)).json();
const socket = new WebSocket(versions.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const waiting = new Map();
const events = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && waiting.has(message.id)) {
    const { resolve, reject } = waiting.get(message.id);
    waiting.delete(message.id);
    message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
  } else if (message.sessionId) {
    events.push({ session: message.sessionId, method: message.method, params: message.params });
  }
});

const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const requestId = ++id;
    waiting.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Git Bash expands a bare "/route" argv into a Windows path, so accept plain
// names and rebuild the route ourselves.
const normalise = (arg) => {
  if (["home", ".", "/", ""].includes(arg)) return "/";
  const tail = arg.replace(/^[A-Za-z]:[\\/].*[\\/]/, "").replace(/^\/+/, "");
  return `/${tail}`;
};
const routes = process.argv.length > 2 ? process.argv.slice(2).map(normalise) : ["/", "/pay-fees", "/admissions", "/gallery"];
const widths = [1440, 360];

const report = [];

for (const route of routes) {
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  await send("Log.enable", {}, sessionId);

  for (const width of widths) {
    await send(
      "Emulation.setDeviceMetricsOverride",
      { width, height: width === 360 ? 780 : 900, deviceScaleFactor: 1, mobile: width < 500 },
      sessionId
    );
    await send("Page.navigate", { url: `${BASE}${route}` }, sessionId);
    await sleep(1500);
    // let reveal animations settle
    await send("Runtime.evaluate", { expression: "window.scrollTo(0, document.body.scrollHeight * 0.35)" }, sessionId);
    await sleep(700);
    await send("Runtime.evaluate", { expression: "window.scrollTo(0, 0)" }, sessionId);
    await sleep(400);

    const name = `${route === "/" ? "home" : route.replace(/\//g, "_")}-${width}`.replace(/^_/, "");
    const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false }, sessionId);
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(shot.data, "base64"));

    const metrics = await send(
      "Runtime.evaluate",
      {
        expression: `JSON.stringify({
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          bodyText: document.body.innerText.length,
          brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute("src")),
          totalImages: document.images.length,
          heading: document.querySelector("h1,h2")?.innerText?.slice(0, 60) ?? null,
        })`,
        returnByValue: true,
      },
      sessionId
    );
    report.push({ name, ...JSON.parse(metrics.result.value) });
  }

  await send("Target.closeTarget", { targetId });
}

const bad = events.filter(
  (e) =>
    e.method === "Runtime.exceptionThrown" ||
    (e.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(e.params.type)) ||
    (e.method === "Log.entryAdded" && e.params.entry.level === "error")
);

console.log("\n--- PAGE METRICS ---");
for (const row of report) {
  const flags = [];
  if (row.horizontalOverflow) flags.push(`H-OVERFLOW ${row.scrollWidth}>${row.innerWidth}`);
  if (row.brokenImages.length) flags.push(`BROKEN ${row.brokenImages.length}: ${row.brokenImages.slice(0, 3).join(", ")}`);
  if (row.bodyText < 200) flags.push("NEARLY EMPTY");
  console.log(
    `${row.name.padEnd(24)} imgs=${String(row.totalImages).padStart(3)} chars=${String(row.bodyText).padStart(5)} ${flags.length ? "⚠ " + flags.join(" | ") : "ok"}`
  );
}

console.log("\n--- CONSOLE / PAGE ERRORS ---");
if (!bad.length) console.log("none");
for (const e of bad) {
  const text =
    e.method === "Runtime.exceptionThrown"
      ? e.params.exceptionDetails?.exception?.description ?? e.params.exceptionDetails?.text
      : e.params.entry?.text ?? e.params.args?.map((a) => a.value ?? a.description ?? "").join(" ");
  console.log(`• [${e.method}] ${String(text).slice(0, 220)}`);
}

console.log(`\nShots in ${OUT}/`);
socket.close();
