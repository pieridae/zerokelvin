// Exercise the real controller with an in-memory DOM and animation clock.
// This checks interaction/state wiring; it does not replace visual browser QA.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const engine = require("../assets/light-align-engine.js");
const html = fs.readFileSync(path.join(__dirname, "../game.qmd"), "utf8");
const ids = new Map();
class Element {
  constructor() { this.children = []; this.attributes = {}; this.dataset = {}; this.listeners = {}; this.textContent = ""; this.value = ""; this.checked = false; }
  setAttribute(name, value) { this.attributes[name] = String(value); if (name === "id") ids.set(value, this); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  appendChild(node) { this.children.push(node); return node; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); }
  dispatchEvent(event) { for (const fn of this.listeners[event.type] || []) fn(event); }
  click() { this.dispatchEvent({ type: "click" }); }
  querySelectorAll(selector) { return selector === "[data-mode]" ? modes : []; }
  focus() {}
}
for (const tag of html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)) {
  const element = new Element();
  element.hidden = /\bhidden(?:\s|=|>)/.test(tag[0]);
  ids.set(tag[1], element);
}
const modes = ["puzzle", "sandbox"].map(mode => { const el = new Element(); el.dataset.mode = mode; return el; });
const document = new Element();
document.documentElement = { dataset: { siteLanguage: "en" } };
document.getElementById = id => ids.get(id) || null;
document.createElement = () => new Element();
document.createElementNS = () => new Element();
document.createTextNode = text => ({ textContent: text });
document.hidden = false;
ids.get("la-speed").value = html.match(/<option value="([^"]+)" selected>/)[1];
const frames = new Map(), storage = new Map();
let frameId = 0, time = 0, celebrations = 0;
const context = {
  document,
  window: { LightAlignEngine: engine, matchMedia: () => ({ matches: false }), LightAlignCelebration: { show() { celebrations++; } } },
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  requestAnimationFrame: fn => { frames.set(++frameId, fn); return frameId; },
  cancelAnimationFrame: id => frames.delete(id),
  CustomEvent: class { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../assets/light-align.js"), "utf8"), context);
assert.equal(frames.size, 0, "No animation runs before Start");
assert.equal(ids.get("la-game").hidden, true, "The table is hidden on arrival");
assert.equal(ids.get("la-welcome").hidden, false, "The one-line goal and Start screen are visible");
assert.equal(ids.get("la-svg").children.length, 0, "The game is initialized only after Start");
ids.get("la-start").click();
assert.equal(ids.get("la-game").hidden, false);
assert.equal(ids.get("la-welcome").hidden, true);
assert.equal(frames.size, 1, "Start launches the game");
assert(ids.get("la-level").children.every(option => !option.textContent.includes("✓")), "New runs must not inherit old completion checkmarks");
const tool = name => ids.get("la-tools").children.find(button => button.dataset.tool === name);
const cell = (x, y) => ids.get("la-cells").children[engine.at(x, y)];
const pulseSnapshot = () => JSON.stringify(ids.get("la-pulses").children.map(node => node.attributes));
for (let level = 0; level < engine.levels.length; level++) {
  ids.get("la-level").value = String(level);
  ids.get("la-level").dispatchEvent({ type: "change" });
  const puzzle = engine.levels[level];
  if (puzzle.solution.length) {
    tool("mirror").click();
    for (const p of puzzle.solution) {
      cell(p.x, p.y).click();
      if (!p.slash) cell(p.x, p.y).click();
    }
  }
  for (const adjustment of puzzle.adjustments || []) {
    tool("erase").click();
    cell(adjustment.x, adjustment.y).click();
    assert.match(ids.get("la-status").textContent, /fixed/, "The fixed polarizer cannot be erased");
    tool("polarizer").click();
    cell(adjustment.x, adjustment.y).click();
  }
  if (level === 2) {
    assert.match(ids.get("la-status").textContent, /Aligned/, "Changing the polarizer remains a valid solution");
    ids.get("la-undo").click();
    assert.match(ids.get("la-status").textContent, /blocking/, "Undo restores the original polarization problem");
    tool("hwp").click();
    cell(5, 11).click();
    assert.match(cell(9,11).getAttribute("aria-label"), /Polarizer H/, "Keep the original H polarizer unchanged");
    assert.match(ids.get("la-status").textContent, /Aligned/, "Adding another HWP is also a valid solution");
  }
  for (let tick = 0; ids.get("la-hits").textContent !== "5 / 5" && tick < 2000; tick++) {
    assert(frames.size, "Animation must continue until the stage is won");
    const [id, fn] = frames.entries().next().value;
    frames.delete(id); fn(time += 1000 / 60);
  }
  assert.equal(ids.get("la-hits").textContent, "5 / 5", `Stage ${level + 1} must be playable through the actual controls`);
  assert.equal(celebrations, level === engine.levels.length - 1 ? 1 : 0);
  assert.equal(ids.get("la-level").children.filter(option => option.textContent.includes("✓")).length, level + 1, "Checkmarks reflect this run only");
  if (level === 2) {
    assert(ids.get("la-pulses").children.some(node => Number(node.attributes.cx)>240 && Number(node.attributes.cx)<360 && Number(node.attributes.cy)===460), "Pulses beyond the second HWP must render as s dots");
    assert(ids.get("la-pulses").children.some(node => node.attributes.x1!==undefined), "p lines must still render between the two HWPs");
  }
  if (level === 0) {
    const before = pulseSnapshot();
    tool("hwp").click();
    assert.match(ids.get("la-help").textContent, /s-polarization dots become p-polarization lines/);
    cell(0, 0).click();
    assert.equal(pulseSnapshot(), before, "Installing an element preserves visible in-flight pulses");
    ids.get("la-undo").click();
    assert.equal(pulseSnapshot(), before, "Undo preserves visible in-flight pulses");
  }
}
assert.equal(frames.size, 0, "The game pauses behind the all-stage celebration");
document.dispatchEvent({ type: "light-align-celebration-close" });
assert.equal(frames.size, 1, "Closing the celebration resumes the game");
assert.equal(JSON.parse(storage.get("light-align-sample-stages-v2")).length, 5);
const top = html.match(/class="la-top-actions"[^>]*>([\s\S]*?)<\/div>/)[1];
assert.deepEqual([...top.matchAll(/id="([^"]+)"/g)].map(m => m[1]), ["la-play", "la-undo", "la-reset", "la-hint-toggle"]);
assert(html.indexOf('class="la-toolbox"') > html.indexOf('id="la-board"'));
assert(!html.includes("Checkpoint"));
assert(html.includes('data-i18n="congratulations">Congratulations!</h2>'), "Default celebration heading is English");
assert(!html.includes('id="la-count"'), "Mirror counter is removed");
assert(/id="la-board"[\s\S]*?id="la-celebration"[\s\S]*?<\/dialog>\s*<\/div>/.test(html), "Celebration belongs inside the table");
assert.equal(ids.get("la-speed").value, "3.2");
console.log("Light Align controls: all 5 stages won, fixed polarizer toggled, pulses preserved, progress saved, celebration and button order verified.");

// Run the celebration's own animation loop with a recording canvas context.
const dialog = new Element(), close = new Element(), fireworks = new Element(), board = new Element();
board.clientWidth = 340; board.clientHeight = 340;
const fireworksFrames = new Map();
let strokes = 0, closeEvents = 0, fireworksFrameId = 0;
const ctx = { setTransform() {}, clearRect() {}, fillRect() {}, beginPath() {}, moveTo() {}, lineTo() {}, stroke() { strokes++; } };
fireworks.getContext = () => ctx;
dialog.show = () => { dialog.open = true; };
dialog.close = () => { dialog.open = false; dialog.dispatchEvent({ type: "close" }); };
const fireworksDocument = new Element();
fireworksDocument.getElementById = id => ({ "la-celebration": dialog, "la-celebration-close": close, "la-fireworks": fireworks, "la-board": board })[id];
fireworksDocument.addEventListener("light-align-celebration-close", () => { closeEvents++; });
const fireworksWindow = { innerWidth: 390, innerHeight: 844, devicePixelRatio: 2, matchMedia: () => ({ matches: false }), addEventListener() {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../assets/light-align-celebration.js"), "utf8"), {
  window: fireworksWindow, document: fireworksDocument,
  requestAnimationFrame: fn => { fireworksFrames.set(++fireworksFrameId, fn); return fireworksFrameId; },
  cancelAnimationFrame: id => fireworksFrames.delete(id),
  CustomEvent: class { constructor(type) { this.type = type; } }
});
fireworksWindow.LightAlignCelebration.show();
assert.equal(dialog.open, true);
assert.equal(fireworks.width, 680, "Canvas width matches the table, not the viewport");
assert.equal(fireworks.height, 680, "Canvas height matches the table, not the viewport");
for (let tick = 1; fireworksFrames.size && tick < 1000; tick++) {
  const [id, fn] = fireworksFrames.entries().next().value;
  fireworksFrames.delete(id); fn(tick * 1000 / 60);
}
assert(strokes > 1000, "Full-screen celebration must actually draw fireworks");
assert.equal(fireworksFrames.size, 0, "Animation must finish rather than run forever");
close.click();
assert.equal(dialog.open, false);
assert.equal(closeEvents, 1);
console.log("Fireworks: animation stays inside the table, stops and dismisses cleanly.");
