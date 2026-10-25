(() => {
  "use strict";
  const dialog = document.getElementById("la-celebration");
  if (!dialog) return;
  const board = document.getElementById("la-board");
  const canvas = document.getElementById("la-fireworks");
  const ctx = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const colors = ["#67ccff", "#ffc27a", "#ff7089", "#bda0ff", "#ffffff"];
  let particles = [], frame = 0, last = 0, elapsed = 0, nextBurst = 0;
  let width = 0, height = 0, previousFocus = null;

  function resize() {
    width = Math.max(1, board.clientWidth); height = Math.max(1, board.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  function burst(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const scale = Math.min(width, height);
    for (let i = 0; i < 110; i++) {
      const angle = Math.PI * 2 * i / 110 + Math.random() * .04;
      const speed = scale * (.16 + Math.random() * .38);
      const life = 1.6 + Math.random() * 1.1;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life, total: life, color, size: 1 + Math.random() * 1.8 });
    }
  }
  function draw(dt) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,.22)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    particles = particles.filter(p => {
      p.life -= dt;
      if (p.life <= 0) return false;
      const x = p.x, y = p.y;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const drag = Math.pow(.985, dt * 60);
      p.vx *= drag; p.vy = p.vy * drag + dt * 75;
      ctx.globalAlpha = Math.min(1, p.life / p.total * 1.5);
      ctx.strokeStyle = p.color; ctx.lineWidth = p.size;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(p.x, p.y); ctx.stroke();
      return true;
    });
    ctx.globalAlpha = 1;
  }
  function animate(time) {
    frame = 0;
    if (!dialog.open || document.hidden) { last = 0; return; }
    const dt = last ? Math.min((time - last) / 1000, .06) : 1 / 60;
    last = time; elapsed += dt;
    if (elapsed < 5.5 && elapsed >= nextBurst) {
      burst(width * (.15 + Math.random() * .7), height * (.15 + Math.random() * .5));
      nextBurst = elapsed + .3 + Math.random() * .2;
    }
    draw(dt);
    if (elapsed < 8.3) frame = requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, width, height);
  }
  function show() {
    if (dialog.open) return;
    previousFocus = document.activeElement;
    particles = []; elapsed = 0; last = 0; nextBurst = .15;
    dialog.show();
    resize();
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    burst(width * .28, height * .3);
    burst(width * .75, height * .35);
    if (reducedMotion.matches) {
      // A still burst preserves the celebration without continuous motion.
      draw(.5);
    } else frame = requestAnimationFrame(animate);
  }
  function cleanup() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0; particles = [];
    if (ctx) ctx.clearRect(0, 0, width, height);
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent("light-align-celebration-close"));
  }
  function close() { if (dialog.open) dialog.close(); }
  document.getElementById("la-celebration-close").addEventListener("click", close);
  dialog.addEventListener("keydown", event => { if (event.key === "Escape") { event.preventDefault(); close(); } });
  dialog.addEventListener("close", cleanup);
  window.addEventListener("resize", () => { if (dialog.open) resize(); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }
    else if (ctx && dialog.open && !frame && elapsed < 8.3 && !reducedMotion.matches) frame = requestAnimationFrame(animate);
  });
  window.LightAlignCelebration = { show, close };
})();
