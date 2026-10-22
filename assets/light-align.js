(() => {
  "use strict";
  const app = document.getElementById("light-align");
  if (!app) return;
  const { SIZE, at, piece, levels, trace, createPulse, advancePulse, polarizationAxis, hasCompletedAllStages } = window.LightAlignEngine;
  const PROGRESS_KEY = "light-align-sample-stages-v2";
  const PULSE_SPACING = 1; // Grid cells between emitted pulses at any speed.
  const $ = id => document.getElementById(`la-${id}`);
  const ns = "http://www.w3.org/2000/svg";
  const copy = {
    "polarizer": [
      "Polarizer",
      "편광판"
    ],
    "polarizerHelp": [
      "Tap again to switch H/V. H passes horizontal lines; V passes vertical lines. Dots acquire the selected polarization.",
      "다시 누르면 H/V가 바뀝니다. H는 가로, V는 세로 편광선을 통과시켜요. 공은 선택한 편광으로 바뀝니다."
    ],
    "polarizerBlocked": [
      "The polarizer is blocking this polarization. Switch H/V or change the incoming light.",
      "편광판이 빛을 막고 있어요. H/V 또는 입사 편광을 바꿔보세요."
    ],
    "hwp": [
      "HWP",
      "반파장판"
    ],
    "hwpHelp": [
      "The HWP lies at 45 degrees to the table! s-polarization dots become p-polarization lines. Tap again to rotate it.",
      "바닥에 45도 각도로 놓여있어요! s-polarization dots become p-polarization lines. 다시 누르면 가로·세로가 바뀝니다."
    ],
    "sample": [
      "Sample",
      "샘플"
    ],
    "sampleHelp": [
      "Tap an empty square to move the sample. Light must pass through it before reaching the detector.",
      "빈 칸을 눌러 샘플을 옮기세요. 빛이 샘플을 지난 뒤 검출기에 도착해야 해요."
    ],
    "table": [
      "OPTICAL TABLE",
      "광학 테이블"
    ],
    "speed": [
      "Speed",
      "속도"
    ],
    "showPath": [
      "Show path",
      "경로 보기"
    ],
    "puzzles": [
      "Puzzles",
      "퍼즐"
    ],
    "sandbox": [
      "Free play",
      "자유 배치"
    ],
    "mission": [
      "YOUR MISSION",
      "이번 목표"
    ],
    "received": [
      "Pulses received",
      "도착한 빛"
    ],
    "mirrors": [
      "Mirrors",
      "사용한 거울"
    ],
    "next": [
      "Next puzzle →",
      "다음 퍼즐 →"
    ],
    "toolbox": [
      "ELEMENTS",
      "광학 요소"
    ],
    "help": [
      "Choose an element, then tap a square. Tap it again to rotate or switch H/V. Use Erase to remove it.",
      "요소를 고르고 칸을 터치하세요. 다시 누르면 회전하거나 H/V가 바뀌어요. 삭제 도구로 지울 수 있어요."
    ],
    "undo": [
      "↶ Undo",
      "↶ 되돌리기"
    ],
    "reset": [
      "Reset table",
      "처음으로"
    ],
    "hint": [
      "Need a hint?",
      "힌트 보기"
    ],
    "laser": [
      "Laser",
      "레이저"
    ],
    "detector": [
      "Detector",
      "검출기"
    ],
    "wall": [
      "Block",
      "장벽"
    ],
    "mirror": [
      "Mirror",
      "거울"
    ],
    "erase": [
      "Erase",
      "삭제"
    ],
    "pause": [
      "Ⅱ Pause",
      "Ⅱ 일시정지"
    ],
    "play": [
      "▶ Play",
      "▶ 시작"
    ],
    "escape": [
      "Guide the light through the sample and into the detector.",
      "빛이 샘플을 거쳐 검출기로 가도록 안내하세요."
    ],
    "wallHit": [
      "A block is stopping the light. Find another route.",
      "장벽이 빛을 막고 있어요. 다른 길을 찾아보세요."
    ],
    "loop": [
      "The light is circling. Change a mirror to open a way out.",
      "빛이 순환하고 있어요. 거울 방향을 바꿔보세요."
    ],
    "missed": [
      "The light reached the detector without passing through the sample.",
      "빛이 샘플을 거치지 않고 검출기에 도착하고 있어요."
    ],
    "aligned": [
      "Aligned through the sample. Waiting for the light to arrive…",
      "샘플을 거쳐 얼라인 완료! 빛이 도착하기를 기다리고 있어요…"
    ],
    "success": [
      "✓ Sample → detector complete!",
      "✓ 샘플 → 검출기 연결 성공!"
    ],
    "allDone": [
      "✓ All puzzles complete! Build your own path in Free play.",
      "✓ 모든 퍼즐 성공! 자유 배치에서 나만의 경로를 만들어보세요."
    ],
    "locked": [
      "This element is fixed. Try an empty square.",
      "고정된 요소예요. 빈 칸에 놓아보세요."
    ],
    "limit": [
      "All mirrors are in use. Rotate or erase one first.",
      "거울을 모두 썼어요. 기존 거울을 회전하거나 지워보세요."
    ],
    "freeTitle": [
      "Sample → detector",
      "샘플 → 검출기"
    ],
    "freeGoal": [
      "Guide light through the sample, then into the detector. You can move the laser, sample and detector.",
      "빛이 샘플을 지난 뒤 검출기로 가도록 배치하세요. 레이저·샘플·검출기를 옮길 수 있어요."
    ],
    "freeHint": [
      "Choose Laser, Sample or Detector, then tap an empty square to move it.",
      "레이저·샘플·검출기 도구를 고른 뒤 빈 칸을 누르면 위치를 옮길 수 있어요."
    ],
    "empty": [
      "Empty",
      "빈 칸"
    ],
    "fixed": [
      "fixed",
      "고정"
    ],
    "ready": [
      "The light is returning to its source. Change a mirror.",
      "빛이 광원으로 돌아왔어요. 거울 방향을 바꿔보세요."
    ],
    "celebrationMessage": [
      "All stages complete. Beautifully aligned!",
      "모든 스테이지를 완료했어요. 멋진 얼라인이에요!"
    ],
    "celebrationContinue": [
      "Keep playing",
      "계속하기"
    ]
  };
  let lang = document.documentElement.dataset.siteLanguage === "ko" ? 1 : 0;
  const t = key => copy[key][lang];
  let mode = "puzzle", level = 0, tool = "mirror", elements = [], history = [], route;
  let boardCells = new Map();
  let hits = 0, won = false, pulses = [], clock = 0, spawn = 0, last = 0, frame = 0;
  let running = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let inView = true, focusIndex = at(2, 11), notice = "";
  let completed = [];
  let celebrating = false, celebrationShown = false;
  try { const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]"); if (Array.isArray(saved)) completed = saved.filter(n => Number.isInteger(n) && n >= 0 && n < levels.length); } catch { /* Optional storage. */ }
  const svg = (name, attributes = {}) => {
    const el = document.createElementNS(ns, name);
    Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  };
  const add = (parent, name, attrs) => { const el = svg(name, attrs); parent.appendChild(el); return el; };
  const cells = [];
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    const cell = document.createElement("button");
    cell.type = "button"; cell.className = "la-cell"; cell.dataset.x = x; cell.dataset.y = y;
    cell.addEventListener("click", () => interact(x, y));
    cell.addEventListener("contextmenu", event => { event.preventDefault(); interact(x, y, "erase"); });
    cell.addEventListener("pointerenter", () => { $("coordinate").textContent = `X ${x + 1} / Y ${y + 1}`; });
    cell.addEventListener("focus", () => {
      cells[focusIndex].tabIndex = -1; focusIndex = at(x, y); cell.tabIndex = 0;
      $("coordinate").textContent = `X ${x + 1} / Y ${y + 1}`;
    });
    cell.addEventListener("keydown", event => {
      const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
      if (delta) { event.preventDefault(); cells[at(Math.max(0, Math.min(14, x + delta[0])), Math.max(0, Math.min(14, y + delta[1])))].focus(); }
      if (event.key === "Delete" || event.key === "Backspace") { event.preventDefault(); interact(x, y, "erase"); }
    });
    cells.push(cell); $("cells").appendChild(cell);
  }
  function saveUndo() { history.push(elements.map(p => ({ ...p }))); if (history.length > 100) history.shift(); }
  function interact(x, y, action = tool) {
    const p = elements.find(p => p.x === x && p.y === y);
    notice = "";
    if ((p?.fixed && !(p.adjustable && p.type === "polarizer" && action === "polarizer")) || (action === "erase" && p && ["laser", "sample", "detector"].includes(p.type))) { notice = "locked"; updateStatus(); return; }
    if (action === "erase") { if (!p) return; saveUndo(); elements = elements.filter(el => el !== p); }
    else if (action === "mirror" && p?.type === "mirror") { saveUndo(); p.slash = !p.slash; }
    else if (action === "hwp" && p?.type === "hwp") { saveUndo(); p.horizontal = !p.horizontal; }
    else if (action === "polarizer" && p?.type === "polarizer") { saveUndo(); p.axis = p.axis === "v" ? "h" : "v"; }
    else if (mode === "sandbox" && action === "laser" && p?.type === "laser") { saveUndo(); p.dir = (p.dir + 1) % 4; }
    else {
      if (p) { notice = "locked"; updateStatus(); return; }
      if (action === "mirror" && mode === "puzzle" && mirrorCount() >= levels[level].limit) { notice = "limit"; updateStatus(); return; }
      saveUndo();
      if (["laser", "sample", "detector"].includes(action)) elements = elements.filter(el => el.type !== action);
      elements.push(piece(x, y, action, action === "mirror" ? { slash: true } : action === "hwp" ? { horizontal: false } : action === "polarizer" ? { axis: "h" } : action === "laser" ? { dir: 0 } : {}));
    }
    rebuild();
  }
  function mirrorCount() { return elements.filter(p => p.type === "mirror" && !p.fixed).length; }
  function load() {
    elements = mode === "puzzle" ? levels[level].pieces.map(p => ({ ...p, fixed: true })) : [piece(2, 11, "laser", { dir: 0 }), piece(7, 7, "sample"), piece(11, 3, "detector")];
    history = []; notice = ""; $("hint").hidden = true; tool = mode === "puzzle" ? (levels[level].initialTool || "mirror") : "mirror";
    translate(); rebuild(true);
  }
  function rebuild(reset = false) {
    route = trace(elements);
    boardCells = new Map(elements.map(p => [at(p.x, p.y), p]));
    if (reset) { hits = 0; won = false; pulses = []; clock = 0; spawn = 0; }
    notice = "";
    drawTable(); updateStats(); updateStatus();
  }
  function drawTable() {
    const root = $("svg"); root.replaceChildren();
    const defs = add(root, "defs");
    const pattern = add(defs, "pattern", { id: "la-grid", width: 40, height: 40, patternUnits: "userSpaceOnUse" });
    add(pattern, "path", { d: "M 40 0 L 0 0 0 40", fill: "none", stroke: "var(--la-grid)", "stroke-width": 1 });
    add(pattern, "circle", { cx: 20, cy: 20, r: 1.4, fill: "#b9cfe3" });
    add(root, "rect", { width: 600, height: 600, fill: "url(#la-grid)" });
    if ($("show-path").checked) add(root, "polyline", { points: route.points.map(p => `${p.x * 40},${p.y * 40}`).join(" "), fill: "none", stroke: "var(--la-laser)", "stroke-width": 2, "stroke-dasharray": "4 6", opacity: .45 });
    const laserLayer = svg("g", { id: "la-laser-layer" });
    for (const p of elements) {
      const g = add(p.type === "laser" ? laserLayer : root, "g", { transform: `translate(${p.x * 40 + 20} ${p.y * 40 + 20})` });
      if (p.type === "mirror") {
        add(g, "circle", { r: 15, fill: p.fixed ? "#e2e9f2" : "#e3f0fb", stroke: p.fixed ? "#9baec6" : "#9dbbd7", "stroke-width": 1 });
        add(g, "line", { x1: -11, y1: p.slash ? 11 : -11, x2: 11, y2: p.slash ? -11 : 11, stroke: "#245da2", "stroke-width": 5, "stroke-linecap": "round" });
        add(g, "line", { x1: -10, y1: p.slash ? 9 : -12, x2: 9, y2: p.slash ? -10 : 7, stroke: "#b6dff6", "stroke-width": 1.5 });
        if (p.fixed) add(g, "rect", { x: 8, y: 8, width: 6, height: 6, rx: 1, fill: "#526b8a" });
      } else if (p.type === "polarizer") {
        add(g, "rect", { x: -15, y: -15, width: 30, height: 30, rx: 2, fill: "#e1f2fc", stroke: "#245da2", "stroke-width": 2 });
        add(g, "text", { x: 0, y: 1, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": 19, "font-weight": 700, "font-family": "inherit", fill: "#245da2" }).textContent = (p.axis || "h").toUpperCase();
      } else if (p.type === "hwp") {
        add(g, "line", { x1: p.horizontal ? -14 : 0, y1: p.horizontal ? 0 : -14, x2: p.horizontal ? 14 : 0, y2: p.horizontal ? 0 : 14, stroke: "#245da2", "stroke-width": 4 });
      } else if (p.type === "laser") {
        g.setAttribute("transform", `${g.getAttribute("transform")} rotate(${p.dir * 90})`);
        add(g, "rect", { x: -16, y: -10, width: 27, height: 20, rx: 5, fill: "var(--la-laser)", stroke: "#b83345", "stroke-width": 1.5 });
        add(g, "rect", { x: 9, y: -6, width: 6, height: 12, rx: 1, fill: "#9e2d40" });
        add(g, "path", { d: "M -7 -4 L 0 0 -7 4", fill: "none", stroke: "#fff5f6", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" });
      } else if (p.type === "detector") {
        add(g, "circle", { r: 15, fill: "#e1f2fc", stroke: "var(--la-blue)", "stroke-width": 2 });
        add(g, "circle", { r: 9, fill: "var(--la-blue)" });
        add(g, "circle", { r: 3, fill: "#d5f0ff" });
        add(g, "circle", { id: "la-detector-glow", r: 19, fill: "none", stroke: "#2788bd", "stroke-width": 3, opacity: 0 });
      } else if (p.type === "sample") {
        add(g, "rect", { x: -12, y: -15, width: 24, height: 30, rx: 1, fill: "#fff8ee", stroke: "var(--la-sample)", "stroke-width": 2 });
        add(g, "rect", { x: -7, y: -10, width: 14, height: 20, fill: "#ffc27a", opacity: .75 });
        add(g, "line", { x1: -12, y1: -11, x2: 12, y2: -11, stroke: "var(--la-sample)", "stroke-width": 1 });
      } else if (p.type === "wall") {
        add(g, "rect", { x: -17, y: -17, width: 34, height: 34, rx: 4, fill: "#91a3ae" });
        add(g, "path", { d: "M -11 9 L 9 -11 M -3 13 L 13 -3 M -13 3 L 3 -13", stroke: "#c8d4db", "stroke-width": 2 });
      }
    }
    add(root, "g", { id: "la-pulses" });
    root.appendChild(laserLayer);
    updateCellLabels();
    renderPulses();
  }
  function updateCellLabels() {
    const map = new Map(elements.map(p => [at(p.x, p.y), p]));
    cells.forEach((cell, i) => {
      const p = map.get(i);
      cell.tabIndex = i === focusIndex ? 0 : -1;
      cell.setAttribute("aria-label", `X${i % SIZE + 1}, Y${Math.floor(i / SIZE) + 1}: ${p ? t(p.type) + (p.type === "polarizer" ? " " + (p.axis || "h").toUpperCase() : "") + (p.type === "hwp" ? (p.horizontal ? " \u2500" : " \u2502") : "") + (p.type === "mirror" ? (p.slash ? " /" : " \\") : "") + (p.fixed ? ` (${t("fixed")})` : "") : t("empty")}`);
    });
  }
  function updateStats() {
    $("hits").textContent = `${hits} / 5`;
    $("count").textContent = `${mirrorCount()}${mode === "puzzle" ? ` / ${levels[level].limit}` : ""}`;
    $("undo").disabled = !history.length;
    $("next").hidden = !(won && mode === "puzzle" && level < levels.length - 1);
  }
  function updateStatus() {
    const key = notice || (won ? (mode === "puzzle" && hasCompletedAllStages(completed) ? "allDone" : "success") : route?.valid ? "aligned" : route?.end === "detector" ? "missed" : route?.end === "polarizer" ? "polarizerBlocked" : route?.end === "wall" ? "wallHit" : route?.end === "laser" ? "ready" : route?.end || "escape");
    $("status").textContent = t(key);
    $("status").dataset.state = won ? "success" : "playing";
  }
  function finishPulse(pulse) {
    if (pulse.end !== "detector" || won || !pulse.samples.size) return;
    hits = Math.min(5, hits + 1);
    if (hits === 5) {
      won = true;
      if (mode === "puzzle" && !completed.includes(level)) {
        completed.push(level);
        try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed)); } catch { /* Optional storage. */ }
        updateLevelOptions();
      }
      if (mode === "puzzle" && hasCompletedAllStages(completed) && !celebrationShown) {
        celebrationShown = true; celebrating = true;
        window.LightAlignCelebration.show();
        schedule();
      }
    }
    updateStats(); updateStatus();
  }
  function animate(time) {
    frame = 0;
    const dt = last ? Math.min((time - last) / 1000, .06) : 0; last = time;
    clock += dt;
    const speed = Number($("speed").value);
    pulses = pulses.filter(p => {
      advancePulse(p, dt * speed, boardCells);
      if (p.end) { finishPulse(p); return false; }
      return true;
    });
    spawn -= dt;
    const source = elements.find(p => p.type === "laser");
    while (source && spawn <= 0) {
      const pulse = createPulse(source);
      // Account for the part of this frame after the pulse's emission time.
      advancePulse(pulse, Math.max(0, -spawn) * speed, boardCells);
      if (pulse.end) finishPulse(pulse); else pulses.push(pulse);
      spawn += PULSE_SPACING / speed;
    }
    renderPulses();
    schedule();
  }
  function renderPulses() {
    const group = document.getElementById("la-pulses"); group.replaceChildren();
    for (const point of pulses) {
      if (point.polarization !== null) {
        const vertical = polarizationAxis(point.polarization, point.dir) === "v";
        const line = { x1: point.x * 40 - (vertical ? 0 : 7), y1: point.y * 40 - (vertical ? 7 : 0), x2: point.x * 40 + (vertical ? 0 : 7), y2: point.y * 40 + (vertical ? 7 : 0), stroke: "var(--la-laser)", "stroke-linecap": "round" };
        add(group, "line", { ...line, "stroke-width": 7, opacity: .13 });
        add(group, "line", { ...line, "stroke-width": 3 });
      } else {
        add(group, "circle", { cx: point.x * 40, cy: point.y * 40, r: 8, fill: "var(--la-laser)", opacity: .13 });
        add(group, "circle", { cx: point.x * 40, cy: point.y * 40, r: 4.1, fill: "var(--la-laser)", stroke: "#fff5f6", "stroke-width": 1.3 });
      }
    }
    const glow = document.getElementById("la-detector-glow");
    if (glow) glow.setAttribute("opacity", hits ? (won ? .7 : .3 + .2 * Math.sin(clock * 7)) : 0);
  }
  function schedule() {
    if (running && !celebrating && inView && !document.hidden) { if (!frame) frame = requestAnimationFrame(animate); }
    else { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }
  }
  function updateLevelOptions() {
    $("level").replaceChildren(...levels.map((item, i) => {
      const option = document.createElement("option"); option.value = i;
      option.textContent = `${String(i + 1).padStart(2, "0")} · ${item.title[lang]}${completed.includes(i) ? " ✓" : ""}`; return option;
    }));
    $("level").value = level;
  }
  function translate() {
    app.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    $("play").textContent = t(running ? "pause" : "play");
    $("mission-title").textContent = mode === "puzzle" ? levels[level].title[lang] : t("freeTitle");
    $("objective").textContent = mode === "puzzle" ? levels[level].objective[lang] : t("freeGoal");
    $("hint").textContent = mode === "puzzle" ? levels[level].hint[lang] : t("freeHint");
    $("level").hidden = mode === "sandbox";
    $("hint-toggle").hidden = mode === "sandbox";
    updateLevelOptions(); renderTools(); if (route) { updateCellLabels(); updateStatus(); }
    $("board").setAttribute("aria-label", lang ? "15 × 15 광학 테이블" : "15 by 15 optical table");
    $("speed").setAttribute("aria-label", lang ? "공의 속도" : "Pulse speed");
  }
  function renderTools() {
    $("help").textContent = t(tool === "sample" ? "sampleHelp" : tool === "polarizer" ? "polarizerHelp" : tool === "hwp" ? "hwpHelp" : "help");
    const icons = { sample: "S", polarizer: "H/V", hwp: "\u2502", mirror: "╱", erase: "×", laser: "➜", detector: "◎", wall: "▧" };
    $("tools").replaceChildren(...(mode === "puzzle" ? ["mirror", "hwp", "polarizer", "erase"] : ["mirror", "hwp", "polarizer", "erase", "laser", "sample", "detector", "wall"]).map(name => {
      const button = document.createElement("button"); button.type = "button"; button.dataset.tool = name;
      button.setAttribute("aria-pressed", String(tool === name));
      if (name === "hwp") button.title = lang ? "\uBC18\uD30C\uC7A5\uD310" : "Half-wave plate";
      const icon = document.createElement("span"); icon.className = "la-tool-icon"; icon.textContent = icons[name]; icon.setAttribute("aria-hidden", "true");
      button.append(icon, document.createTextNode(t(name)));
      button.addEventListener("click", () => { tool = name; notice = ""; renderTools(); updateStatus(); }); return button;
    }));
  }
  $("play").addEventListener("click", () => { running = !running; $("play").textContent = t(running ? "pause" : "play"); schedule(); });
  $("show-path").addEventListener("change", drawTable);
  $("level").addEventListener("change", () => { level = Number($("level").value); load(); });
  $("reset").addEventListener("click", load);
  $("undo").addEventListener("click", () => { if (history.length) { elements = history.pop(); rebuild(); } });
  $("hint-toggle").addEventListener("click", () => { $("hint").hidden = !$("hint").hidden; });
  $("next").addEventListener("click", () => { if (level < levels.length - 1) { level++; load(); } });
  app.querySelectorAll("[data-mode]").forEach(button => button.addEventListener("click", () => {
    mode = button.dataset.mode;
    app.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String(b === button)));
    load();
  }));
  document.addEventListener("languagechange", event => { lang = event.detail.language === "ko" ? 1 : 0; translate(); });
  document.addEventListener("visibilitychange", schedule);
  document.addEventListener("light-align-celebration-close", () => { celebrating = false; schedule(); });
  if ("IntersectionObserver" in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }).observe($("board"));
  load(); schedule();
})();
