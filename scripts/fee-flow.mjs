// Drives the fee flow in the running dev build and reports what each stage shows.
//   node scripts/fee-flow.mjs

const CDP = "http://127.0.0.1:9222";
const BASE = (process.env.VERIFY_BASE || "http://localhost:5173");

const versions = await (await fetch(`${CDP}/json/version`)).json();
const socket = new WebSocket(versions.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  socket.addEventListener("open", res, { once: true });
  socket.addEventListener("error", rej, { once: true });
});

let seq = 0;
const pending = new Map();
const errors = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
  } else if (message.sessionId && message.method === "Runtime.exceptionThrown") {
    errors.push(message.params.exceptionDetails?.exception?.description ?? "exception");
  }
});

const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false }, sessionId);

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, sessionId);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? "eval failed");
  return result.result.value;
};

const setText = (selector, value) =>
  evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return "MISSING";
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return "OK";
  })()`);

const clickText = (label) =>
  evaluate(`(() => {
    const nodes = [...document.querySelectorAll("button, a")];
    const el = nodes.find(n => n.innerText.trim().toLowerCase().includes(${JSON.stringify(label.toLowerCase())}));
    if (!el) return "MISSING:" + nodes.map(n=>n.innerText.trim()).filter(Boolean).slice(0,12).join(" | ");
    if (el.disabled) return "DISABLED";
    el.click();
    return "OK";
  })()`);

const waitStage = async (predicate, ms = 4000) => {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (await evaluate(predicate)) return true;
    await sleep(200);
  }
  return false;
};

const step = (n, msg) => console.log(`${String(n).padStart(2)}. ${msg}`);
const shot = async (name) => {
  const { data } = await send("Page.captureScreenshot", { format: "png" }, sessionId);
  await (await import("node:fs")).default.writeFileSync(`.verify/${name}.png`, Buffer.from(data, "base64"));
};

await send("Page.navigate", { url: `${BASE}/pay-fees` }, sessionId);
await sleep(1800);

step(1, "Stage: identify");
step(2, `admission field -> ${await setText('input[name="admission_number"]', "24118")}`);
step(3, `mobile field    -> ${await setText('input[name="mobile_number"]', "9876500000")}`);
await shot("flow-1-identify");

step(4, `Get OTP -> ${await clickText("Get OTP")}`);
const reachedOtp = await waitStage(`/OTP|otp/.test(document.body.innerText) && !!document.querySelector("#otp-0")`);
step(5, `OTP boxes present: ${reachedOtp}`);
const notice = await evaluate(`document.body.innerText.match(/code (\\d{4})/)?.[1] ?? "NONE"`);
step(6, `demo OTP surfaced by adapter: ${notice}`);
await shot("flow-2-otp");

if (!reachedOtp) {
  console.log("\nBLOCKED at OTP. Body was:\n" + (await evaluate("document.body.innerText.slice(0,900)")));
} else {
  for (let i = 0; i < 4; i += 1) {
    await setText(`#otp-${i}`, notice[i]);
  }
  step(7, `Verify OTP -> ${await clickText("Verify OTP")}`);
  const loaded = await waitStage(`/Aarav Sharma/.test(document.body.innerText)`);
  step(8, `student record loaded: ${loaded}`);
  await shot("flow-3-details");

  const readout = await evaluate(`(() => {
    const text = document.body.innerText;
    const money = (label) => {
      const re = new RegExp(label + "[\\\\s\\\\S]{0,80}?₹\\\\s([\\\\d,]+)");
      return text.match(re)?.[1] ?? "?";
    };
    return JSON.stringify({
      name: text.match(/Aarav Sharma/)?.[0] ?? null,
      admission: text.match(/24118/)?.[0] ?? null,
      classRow: text.match(/Class\\s*\\n?\\s*(VI[^\\n]*)/)?.[1] ?? text.match(/VI – B/)?.[0] ?? null,
      totalPayable: money("Total payable"),
      arrearsShown: /Outstanding fee due/i.test(text),
      arrearsAmount: money("Total due"),
      quarters: [...document.querySelectorAll('input[type="checkbox"]')].map(c => c.checked),
      lastPaid: /Last fee paid/i.test(text),
    });
  })()`);
  console.log("\n   readout:", readout);

  const before = await evaluate(`document.body.innerText.match(/Total payable[\\s\\S]{0,60}?₹\\s([\\d,]+)/)?.[1]`);
  await evaluate(`(() => { const c = document.querySelectorAll('input[type="checkbox"]'); c[c.length-1].click(); })()`);
  await sleep(400);
  const after = await evaluate(`document.body.innerText.match(/Total payable[\\s\\S]{0,60}?₹\\s([\\d,]+)/)?.[1]`);
  step(9, `unchecking last quarter changed total: ${before} -> ${after}`);

  await evaluate(`(() => { const c = document.querySelectorAll('input[type="checkbox"]'); c[c.length-1].click(); })()`);
  await sleep(400);
  step(10, `re-checking restored cumulative rule -> ${await evaluate(`document.body.innerText.match(/Total payable[\\s\\S]{0,60}?₹\\s([\\d,]+)/)?.[1]`)}`);

  step(11, `View Fee Receipts -> ${await clickText("View Fee Receipts")}`);
  await sleep(900);
  const receipts = await evaluate(`JSON.stringify([...document.querySelectorAll("tbody tr")].map(r => r.innerText.replace(/\\s+/g," ").trim()).filter(t => /SNPS-/.test(t)))`);
  step(12, `receipt rows: ${receipts}`);
  await shot("flow-4-receipts");

  step(13, `Proceed to Payment -> ${await clickText("Proceed to Payment")}`);
  await sleep(1200);
  const guard = await evaluate(`(() => {
    const alert = document.querySelector('[role="alert"]');
    return JSON.stringify({ url: location.href, message: alert?.innerText?.slice(0, 160) ?? null });
  })()`);
  step(14, `after Proceed: ${guard}`);
  await shot("flow-5-proceed");
}

console.log("\n--- runtime exceptions ---");
console.log(errors.length ? errors.join("\n---\n") : "none");

await send("Target.closeTarget", { targetId });
socket.close();
