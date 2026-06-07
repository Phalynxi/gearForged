/**
 * GEARFORGED WORLD — Theme System
 * 6 selectable colour themes. Persisted in localStorage.
 * Overrides CSS custom properties including all rgba-derived accent vars.
 */

"use strict";

/* ============================================================
   THEME DEFINITIONS
   Each entry sets the accent family + background family.
   Derived opacity vars (--accent-05 .. --accent-50) are
   calculated from the raw RGB channels automatically.
   ============================================================ */
const THEMES = {
  brass: {
    label: "Brass",
    icon: "🟡",
    desc: "Classic industrial gold",
    accentRGB: "196,155,69",
    vars: {
      "--brass": "#C49B45",
      "--brass-light": "#E0BC6A",
      "--brass-dark": "#8B6914",
      "--brass-muted": "#9A7A35",
      "--bg-primary": "#0E0F11",
      "--bg-secondary": "#22252B",
      "--bg-card": "#2C3038",
      "--bg-elevated": "#363B44",
      "--bg-nav": "rgba(14,15,17,0.90)",
      "--bg-mobile-nav": "rgba(14,15,17,0.97)",
      "--bg-hero-gradient-from": "rgba(14,15,17,0.00)",
      "--bg-hero-gradient-to": "rgba(14,15,17,0.85)",
      "--bg-hero-vignette": "rgba(14,15,17,0.70)",
    },
  },
  violet: {
    label: "Violet",
    icon: "🟣",
    desc: "Deep arcane purple",
    accentRGB: "155,111,212",
    vars: {
      "--brass": "#9B6FD4",
      "--brass-light": "#BFA0E8",
      "--brass-dark": "#6B3FA8",
      "--brass-muted": "#7D57B8",
      "--bg-primary": "#0C0A12",
      "--bg-secondary": "#1A1626",
      "--bg-card": "#221D33",
      "--bg-elevated": "#2E2745",
      "--bg-nav": "rgba(12,10,18,0.90)",
      "--bg-mobile-nav": "rgba(12,10,18,0.97)",
      "--bg-hero-gradient-from": "rgba(12,10,18,0.00)",
      "--bg-hero-gradient-to": "rgba(12,10,18,0.85)",
      "--bg-hero-vignette": "rgba(12,10,18,0.70)",
    },
  },
  cobalt: {
    label: "Cobalt",
    icon: "🔵",
    desc: "Electric steel blue",
    accentRGB: "74,158,255",
    vars: {
      "--brass": "#4A9EFF",
      "--brass-light": "#80BEFF",
      "--brass-dark": "#1A5FB0",
      "--brass-muted": "#3A7FCC",
      "--bg-primary": "#090D14",
      "--bg-secondary": "#111822",
      "--bg-card": "#182030",
      "--bg-elevated": "#1E2A3E",
      "--bg-nav": "rgba(9,13,20,0.90)",
      "--bg-mobile-nav": "rgba(9,13,20,0.97)",
      "--bg-hero-gradient-from": "rgba(9,13,20,0.00)",
      "--bg-hero-gradient-to": "rgba(9,13,20,0.85)",
      "--bg-hero-vignette": "rgba(9,13,20,0.70)",
    },
  },
  crimson: {
    label: "Crimson",
    icon: "🔴",
    desc: "Forge-fire red",
    accentRGB: "212,82,74",
    vars: {
      "--brass": "#D4524A",
      "--brass-light": "#E88880",
      "--brass-dark": "#8B2A24",
      "--brass-muted": "#AA3D38",
      "--bg-primary": "#120A09",
      "--bg-secondary": "#1E1210",
      "--bg-card": "#271815",
      "--bg-elevated": "#33201C",
      "--bg-nav": "rgba(18,10,9,0.90)",
      "--bg-mobile-nav": "rgba(18,10,9,0.97)",
      "--bg-hero-gradient-from": "rgba(18,10,9,0.00)",
      "--bg-hero-gradient-to": "rgba(18,10,9,0.85)",
      "--bg-hero-vignette": "rgba(18,10,9,0.70)",
    },
  },
  emerald: {
    label: "Emerald",
    icon: "🟢",
    desc: "Oxidised copper green",
    accentRGB: "77,170,122",
    vars: {
      "--brass": "#4DAA7A",
      "--brass-light": "#80C9A8",
      "--brass-dark": "#2A6E50",
      "--brass-muted": "#3D8A62",
      "--bg-primary": "#090E0B",
      "--bg-secondary": "#111A14",
      "--bg-card": "#17231B",
      "--bg-elevated": "#1E2F23",
      "--bg-nav": "rgba(9,14,11,0.90)",
      "--bg-mobile-nav": "rgba(9,14,11,0.97)",
      "--bg-hero-gradient-from": "rgba(9,14,11,0.00)",
      "--bg-hero-gradient-to": "rgba(9,14,11,0.85)",
      "--bg-hero-vignette": "rgba(9,14,11,0.70)",
    },
  },
  void: {
    label: "Void",
    icon: "⚫",
    desc: "High-contrast mono",
    accentRGB: "200,200,200",
    vars: {
      "--brass": "#C8C8C8",
      "--brass-light": "#FFFFFF",
      "--brass-dark": "#888888",
      "--brass-muted": "#AAAAAA",
      "--bg-primary": "#050505",
      "--bg-secondary": "#0E0E0E",
      "--bg-card": "#141414",
      "--bg-elevated": "#1C1C1C",
      "--bg-nav": "rgba(5,5,5,0.90)",
      "--bg-mobile-nav": "rgba(5,5,5,0.97)",
      "--bg-hero-gradient-from": "rgba(5,5,5,0.00)",
      "--bg-hero-gradient-to": "rgba(5,5,5,0.85)",
      "--bg-hero-vignette": "rgba(5,5,5,0.70)",
    },
  },
};

const THEME_KEY = "gearforged_theme";
const DEFAULT_THEME = "brass";

/* ============================================================
   DERIVE OPACITY VARIANTS from RGB channels
   Produces --accent-05, --accent-08, --accent-10 ... --accent-50
   These are used throughout the CSS to replace bare rgba() calls.
   ============================================================ */
const deriveAccentVars = (rgb) => ({
  "--accent": `rgb(${rgb})`,
  "--accent-glow": `rgba(${rgb},0.35)`,
  "--accent-glow-strong": `rgba(${rgb},0.6)`,
  "--border": `rgba(${rgb},0.2)`,
  "--border-strong": `rgba(${rgb},0.5)`,
  "--shadow-brass": `0 0 20px rgba(${rgb},0.25), 0 0 60px rgba(${rgb},0.08)`,
  "--accent-glow-card": `rgba(${rgb},0.08)`,
  "--accent-05": `rgba(${rgb},0.05)`,
  "--accent-08": `rgba(${rgb},0.08)`,
  "--accent-10": `rgba(${rgb},0.10)`,
  "--accent-15": `rgba(${rgb},0.15)`,
  "--accent-20": `rgba(${rgb},0.20)`,
  "--accent-30": `rgba(${rgb},0.30)`,
  "--accent-40": `rgba(${rgb},0.40)`,
  "--accent-50": `rgba(${rgb},0.50)`,
  "--shadow-card": `0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(${rgb},0.10) inset`,
});

/* ============================================================
   APPLY THEME
   ============================================================ */
const applyTheme = (themeId) => {
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];
  const root = document.documentElement;

  // 1. Set derived accent opacity vars from RGB
  const derived = deriveAccentVars(theme.accentRGB);
  Object.entries(derived).forEach(([p, v]) => root.style.setProperty(p, v));

  // 2. Set theme-specific vars
  Object.entries(theme.vars).forEach(([p, v]) => root.style.setProperty(p, v));

  // 3. Update button active states
  document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
    const active = btn.dataset.themeBtn === themeId;
    btn.classList.toggle("theme-btn--active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });

  // 4. Persist
  try {
    localStorage.setItem(THEME_KEY, themeId);
  } catch (_) {}

  document.dispatchEvent(
    new CustomEvent("themechange", { detail: { themeId, theme } }),
  );
};

/* ============================================================
   LOAD SAVED THEME  (runs synchronously before paint)
   ============================================================ */
const loadTheme = () => {
  let saved = DEFAULT_THEME;
  try {
    saved = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  } catch (_) {}
  if (!THEMES[saved]) saved = DEFAULT_THEME;
  applyTheme(saved);
  return saved;
};

/* ============================================================
   BUILD PICKER UI
   ============================================================ */
const buildThemePicker = () => {
  let current = DEFAULT_THEME;
  try {
    current = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
  } catch (_) {}
  if (!THEMES[current]) current = DEFAULT_THEME;

  const wrapper = document.createElement("div");
  wrapper.id = "theme-picker-widget";
  wrapper.innerHTML = `
    <button class="theme-toggle-btn" id="theme-toggle-btn"
            aria-label="Toggle theme picker" aria-expanded="false">
      <span class="theme-toggle-icon" aria-hidden="true">🎨</span>
    </button>
    <div class="theme-panel" id="theme-panel"
         role="dialog" aria-label="Theme selector" hidden>
      <div class="theme-panel__header">
        <span class="theme-panel__title">Site Theme</span>
        <button class="theme-panel__close" id="theme-panel-close"
                aria-label="Close theme picker">✕</button>
      </div>
      <div class="theme-panel__grid" role="list">
        ${Object.entries(THEMES)
          .map(
            ([id, t]) => `
          <button class="theme-btn ${id === current ? "theme-btn--active" : ""}"
                  data-theme-btn="${id}"
                  aria-pressed="${id === current ? "true" : "false"}"
                  aria-label="Apply ${t.label} theme"
                  title="${t.desc}">
            <span class="theme-btn__icon" aria-hidden="true">${t.icon}</span>
            <span class="theme-btn__label">${t.label}</span>
            <span class="theme-btn__desc">${t.desc}</span>
          </button>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  // Inject widget CSS
  const style = document.createElement("style");
  style.textContent = `
    #theme-picker-widget {
      position: fixed; bottom: 1.5rem; right: 1.5rem;
      z-index: 9000; display: flex; flex-direction: column;
      align-items: flex-end; gap: 0.75rem;
    }
    .theme-toggle-btn {
      width: 48px; height: 48px; border-radius: 50%;
      border: 1px solid var(--border-strong);
      background: var(--bg-elevated); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
      transition: all 0.25s ease; backdrop-filter: blur(12px);
    }
    .theme-toggle-btn:hover {
      border-color: var(--brass);
      box-shadow: 0 4px 24px rgba(0,0,0,0.5), 0 0 16px var(--accent-glow);
      transform: rotate(20deg) scale(1.05);
    }
    .theme-panel {
      background: var(--bg-elevated); border: 1px solid var(--border-strong);
      border-radius: 12px; padding: 1rem; width: 264px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.6), 0 0 32px var(--accent-glow);
      backdrop-filter: blur(20px);
      animation: panelIn 0.2s ease both;
    }
    .theme-panel[hidden] { display: none !important; }
    @keyframes panelIn {
      from { opacity:0; transform: translateY(12px) scale(0.97); }
      to   { opacity:1; transform: translateY(0) scale(1); }
    }
    .theme-panel__header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 0.75rem; padding-bottom: 0.6rem;
      border-bottom: 1px solid var(--border);
    }
    .theme-panel__title {
      font-family: var(--font-mono, monospace); font-size: 0.7rem;
      letter-spacing: 0.2em; text-transform: uppercase; color: var(--brass);
    }
    .theme-panel__close {
      background: none; border: none; color: var(--text-muted);
      cursor: pointer; font-size: 0.85rem; padding: 0.15rem 0.35rem;
      border-radius: 4px; transition: color 0.15s; line-height: 1;
    }
    .theme-panel__close:hover { color: var(--text-primary); }
    .theme-panel__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
    .theme-btn {
      display: flex; flex-direction: column; align-items: center;
      gap: 0.2rem; padding: 0.65rem 0.5rem;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: 8px; cursor: pointer; transition: all 0.2s ease; text-align: center;
    }
    .theme-btn:hover { border-color: var(--brass); background: var(--accent-glow-card); }
    .theme-btn--active {
      border-color: var(--brass) !important;
      background: var(--accent-glow-card) !important;
      box-shadow: 0 0 12px var(--accent-glow);
    }
    .theme-btn__icon  { font-size: 1.3rem; line-height: 1; }
    .theme-btn__label {
      font-family: var(--font-heading, serif); font-size: 0.7rem; font-weight: 700;
      letter-spacing: 0.06em; color: var(--text-primary); text-transform: uppercase;
    }
    .theme-btn__desc  { font-size: 0.6rem; color: var(--text-muted); line-height: 1.2; }
    @media (max-width: 600px) {
      #theme-picker-widget { bottom: 1rem; right: 1rem; }
      .theme-panel { width: 234px; }
    }
  `;
  document.head.appendChild(style);

  // Interactions
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const panel = document.getElementById("theme-panel");
  const closeBtn = document.getElementById("theme-panel-close");

  const open = () => {
    panel.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
  };
  const close = () => {
    panel.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.focus();
  };

  toggleBtn.addEventListener("click", () => (panel.hidden ? open() : close()));
  closeBtn.addEventListener("click", close);
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) close();
  });

  wrapper.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-btn]");
    if (!btn) return;
    applyTheme(btn.dataset.themeBtn);
    setTimeout(close, 280);
  });
};

/* ============================================================
   BOOTSTRAP — apply theme immediately (no flash)
   ============================================================ */
loadTheme();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", buildThemePicker);
} else {
  buildThemePicker();
}

window.ThemeSystem = { applyTheme, loadTheme, THEMES };
