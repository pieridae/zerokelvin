(() => {
  const STORAGE_KEY = "grh-site-language";
  const languages = ["en", "ko"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let languageTransition = null;
  let refreshReveals = () => {};
  const pageLabels = {
    en: {
      "": "About",
      "index.html": "About",
      "research.html": "Research",
      "setup.html": "Setup",
      "publications.html": "Publications",
      "namecard.html": "Namecard",
      "game.html": "Game",
      "projects.html": "Research"
    },
    ko: {
      "": "소개",
      "index.html": "소개",
      "research.html": "연구",
      "setup.html": "Setup",
      "publications.html": "논문",
      "namecard.html": "명함",
      "game.html": "Game",
      "projects.html": "연구"
    }
  };

  function currentLanguage() {
    const value = document.documentElement.dataset.siteLanguage;
    return languages.includes(value) ? value : "en";
  }

  function updateNavigation(language) {
    document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
      const path = new URL(link.href, window.location.href).pathname.split("/").pop() || "";
      if (pageLabels[language][path]) link.textContent = pageLabels[language][path];
    });
    const page = window.location.pathname.split("/").pop() || "index.html";
    const pageName = pageLabels[language][page] || pageLabels[language]["index.html"];
    document.title = page === "" || page === "index.html"
      ? (language === "ko" ? "한기림" : "Gi Rim Han")
      : `${pageName} · ${language === "ko" ? "한기림" : "Gi Rim Han"}`;
  }

  function applyLanguage(language) {
    const next = languages.includes(language) ? language : "en";
    document.documentElement.dataset.siteLanguage = next;
    document.documentElement.lang = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Storage is optional. */ }
    document.querySelectorAll(".language-switch button").forEach((button) => {
      const active = button.dataset.language === next;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updateNavigation(next);
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { language: next } }));
    refreshReveals(true);
  }

  async function switchLanguage(language) {
    if (language === currentLanguage()) return;
    if (languageTransition) {
      languageTransition.skipTransition();
      await languageTransition.finished.catch(() => {});
    }
    if (!reducedMotion.matches && document.startViewTransition) {
      const transition = document.startViewTransition(() => applyLanguage(language));
      languageTransition = transition;
      await transition.finished.catch(() => {});
      if (languageTransition === transition) languageTransition = null;
    } else {
      applyLanguage(language);
    }
  }

  function mountSwitch() {
    const navbar = document.querySelector(".navbar-container");
    if (!navbar || navbar.querySelector(".language-switch")) return;
    const switcher = document.createElement("div");
    switcher.className = "language-switch";
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", "Language");
    switcher.innerHTML = `
      <button type="button" data-language="en" aria-label="English">EN</button>
      <span aria-hidden="true">/</span>
      <button type="button" data-language="ko" aria-label="한국어">한글</button>
    `;
    switcher.querySelectorAll("button[data-language]").forEach((button) => {
      button.addEventListener("click", () => switchLanguage(button.dataset.language));
    });
    navbar.appendChild(switcher);
  }

  function mountEmailText() {
    const address = atob("emVyb2tlbHZpbkBrb3JlYS5hYy5rcg==");
    document.querySelectorAll("[data-email-slot]").forEach((slot) => {
      const label = document.createElement("span");
      const [mailbox, domain] = address.split("@");
      label.setAttribute("aria-label", address);
      label.innerHTML = `${mailbox}<span class="visually-hidden" aria-hidden="true">@</span><svg class="email-at-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>${domain}`;
      label.className = "profile-email-text";
      slot.replaceChildren(label);
    });
  }

  function mountReveals() {
    if (!("IntersectionObserver" in window)) return;
    const selector = [
      ".research-hero-inner",
      ".profile-summary", ".profile-content > h1", ".profile-role", ".profile-description",
      ".profile-content > p", ".profile-content > div:not(.cv-list)",
      ".profile-content > section", ".research-topic", ".capability-column",
      ".standard-page > h1", ".standard-page > p", ".standard-page > section.level2",
      ".standard-page > section > h1", ".standard-page > section > p",
      ".standard-page > section > section", ".publications-page h1",
      ".publications-page > [data-lang] > section > p", ".publication-section > h2", ".publication-entry"
    ].join(", ");
    const seen = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add("is-visible");
        observer.unobserve(target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    refreshReveals = (immediate = false) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (!element.getClientRects().length) return;
        // Avoid animating a section and its nested content at the same time.
        if (element.parentElement.closest(".motion-reveal")) return;
        const bounds = element.getBoundingClientRect();
        if (reducedMotion.matches || (immediate && bounds.top < innerHeight)) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
        if (seen.has(element)) return;
        seen.add(element);
        element.classList.add("motion-reveal");
        if (!element.classList.contains("is-visible")) observer.observe(element);
      });
    };
    // Content already on screen appears immediately; only scrolling reveals more.
    refreshReveals(true);
    // Publication cards are replaced when the language changes.
    const main = document.querySelector("main");
    if (main) new MutationObserver(() => refreshReveals()).observe(main, { childList: true, subtree: true });
    reducedMotion.addEventListener("change", () => refreshReveals(true));
    document.addEventListener("focusin", (event) => {
      const block = event.target.closest(".motion-reveal");
      if (block) { block.classList.add("is-visible"); observer.unobserve(block); }
    });
    window.addEventListener("pageshow", (event) => { if (event.persisted) refreshReveals(true); });
  }

  // Every diagram stops rendering when offscreen, paused, or in a hidden tab.
  function runVisibleAnimation(element, render) {
    let inView = false;
    let elapsed = 0;
    let previous = null;
    let frameId = null;
    let lastPaint = -Infinity;
    const group = element.closest(".hero-visuals");
    const canRun = () => inView && !document.hidden && !reducedMotion.matches && group?.dataset.paused !== "true";
    function frame(now) {
      frameId = null;
      if (!canRun()) { previous = null; return; }
      if (previous !== null) elapsed += Math.min(now - previous, 100);
      previous = now;
      if (now - lastPaint >= 1000 / 30) { render(elapsed / 1000); lastPaint = now; }
      frameId = requestAnimationFrame(frame);
    }
    function sync() {
      if (canRun() && frameId === null) frameId = requestAnimationFrame(frame);
      else if (!canRun()) { cancelAnimationFrame(frameId); frameId = null; previous = null; }
    }
    render(0);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }).observe(element);
    } else { inView = true; sync(); }
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    group?.addEventListener("motiontoggle", sync);
  }

  function mountMotionControls() {
    document.querySelectorAll(".motion-toggle").forEach((button) => {
      const group = button.closest(".hero-visuals");
      button.hidden = reducedMotion.matches;
      reducedMotion.addEventListener("change", () => { button.hidden = reducedMotion.matches; });
      button.addEventListener("click", () => {
        const paused = group.dataset.paused !== "true";
        group.dataset.paused = String(paused);
        button.setAttribute("aria-pressed", String(paused));
        button.querySelector('[data-lang="en"]').textContent = paused ? "Resume animation" : "Pause animation";
        button.querySelector('[data-lang="ko"]').textContent = paused ? "애니메이션 재생" : "애니메이션 일시정지";
        group.dispatchEvent(new Event("motiontoggle"));
      });
    });
  }

  function animateInterference() {
    // Identical Gaussian analytic fields: E(t) = exp(-t² / 2σ²) exp(iωt).
    // The normalized, DC-subtracted linear interferogram is
    // ΔI(τ) = exp(-τ² / 4σ²) cos(ωτ). This is not an SHG autocorrelation.
    const sigma = 0.68;
    const omega = 13;
    const signal = (delay) => Math.exp(-delay * delay / (4 * sigma * sigma)) * Math.cos(omega * delay);
    function pathFor(fn, baseline, amplitude, from = -5, to = 5) {
      const steps = Math.max(1, Math.ceil((to - from) * 64));
      const points = [];
      for (let i = 0; i <= steps; i++) {
        const t = from + (to - from) * i / steps;
        points.push(`${i ? "L" : "M"}${(280 + 48 * t).toFixed(2)},${(baseline - amplitude * fn(t)).toFixed(2)}`);
      }
      return points.join(" ");
    }
    document.querySelectorAll(".interference-visual svg").forEach((svg) => {
      const envelope = (t) => Math.exp(-t * t / (2 * sigma * sigma));
      const field = (t) => envelope(t) * Math.cos(omega * t);
      const pulseTwo = svg.querySelector('[data-pulse-field="two"]');
      const envelopeTwo = svg.querySelector('[data-pulse-envelope="two"]');
      const forwardTrace = svg.querySelector(".interferogram-forward");
      const returnTrace = svg.querySelector(".interferogram-return");
      const cursor = svg.querySelector(".delay-cursor");
      const point = svg.querySelector(".interferogram-point");
      svg.querySelector('[data-pulse-field="one"]').setAttribute("d", pathFor(field, 88, 30));
      svg.querySelector('[data-pulse-envelope="one"]').setAttribute("d", pathFor(envelope, 88, 30));
      const movingField = pathFor(field, 184, 30, -2.1, 2.1);
      const movingEnvelope = pathFor(envelope, 184, 30, -2.1, 2.1);
      pulseTwo.setAttribute("d", movingField);
      envelopeTwo.setAttribute("d", movingEnvelope);
      runVisibleAnimation(svg, (seconds) => {
        // Smooth 14-second round trip; packet and signal use the same delay.
        const delay = reducedMotion.matches ? 0 : -2.9 * Math.cos(seconds * Math.PI / 7);
        const shift = 48 * delay;
        pulseTwo.setAttribute("transform", `translate(${shift} 0)`);
        envelopeTwo.setAttribute("transform", `translate(${shift} 0)`);
        // Both segments stay fully visible. Forward paints white; return paints
        // blue over the previous pass, so reversing never erases the signal.
        forwardTrace.setAttribute("d", pathFor(signal, 282, 30, -5, delay));
        returnTrace.setAttribute("d", pathFor(signal, 282, 30, delay, 5));
        cursor.setAttribute("d", `M${280 + shift} 242V316`);
        point.setAttribute("cx", String(280 + shift));
        point.setAttribute("cy", String(282 - 30 * signal(delay)));
      });
    });
  }

  function mountPulseFlow() {
    const diagrams = [...document.querySelectorAll(".spectroscopy-visual svg")];
    const visible = new Set();
    const update = () => diagrams.forEach((svg) => {
      svg.dataset.flowRunning = String(visible.has(svg) && !document.hidden);
    });
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) visible.add(target); else visible.delete(target);
        });
        update();
      });
      diagrams.forEach((svg) => observer.observe(svg));
    } else {
      diagrams.forEach((svg) => visible.add(svg));
      update();
    }
    document.addEventListener("visibilitychange", update);
  }

  function mountResponsiveGraphics() {
    const mobile = window.matchMedia("(max-width: 760px)");
    const diagrams = [...document.querySelectorAll("svg[data-mobile-view-box]")];
    diagrams.forEach((svg) => { svg.dataset.desktopViewBox = svg.getAttribute("viewBox"); });
    const labels = [...document.querySelectorAll("[data-mobile-x]")];
    labels.forEach((label) => { label.dataset.desktopX = label.getAttribute("x"); });
    const update = () => {
      diagrams.forEach((svg) => svg.setAttribute("viewBox", mobile.matches ? svg.dataset.mobileViewBox : svg.dataset.desktopViewBox));
      labels.forEach((label) => label.setAttribute("x", mobile.matches ? label.dataset.mobileX : label.dataset.desktopX));
    };
    mobile.addEventListener("change", update);
    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    mountSwitch();
    mountEmailText();
    applyLanguage(currentLanguage());
    mountReveals();
    mountMotionControls();
    mountResponsiveGraphics();
    mountPulseFlow();
    animateInterference();
  });
})();
