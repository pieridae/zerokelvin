(() => {
  const STORAGE_KEY = "grh-site-language";
  const languages = ["en", "ko"];
  const pageLabels = {
    en: {
      "": "About",
      "index.html": "About",
      "research.html": "Research",
      "publications.html": "Publications",
      "projects.html": "Projects"
    },
    ko: {
      "": "소개",
      "index.html": "소개",
      "research.html": "연구",
      "publications.html": "논문",
      "projects.html": "프로젝트"
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
    localStorage.setItem(STORAGE_KEY, next);
    document.querySelectorAll(".language-switch button").forEach((button) => {
      const active = button.dataset.language === next;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updateNavigation(next);
    document.dispatchEvent(new CustomEvent("languagechange", { detail: { language: next } }));
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
      button.addEventListener("click", () => applyLanguage(button.dataset.language));
    });
    navbar.appendChild(switcher);
  }

  document.addEventListener("DOMContentLoaded", () => {
    mountSwitch();
    applyLanguage(currentLanguage());
  });
})();
