/**
 * GEARFORGED WORLD — Theme System
 * Selectable colour themes stored in localStorage.
 * Each theme overrides CSS custom properties on :root.
 */

"use strict";

/* ============================================================
   THEME DEFINITIONS
   Each theme overrides the accent/brass variables + bg tints.
   ============================================================ */
const THEMES = {
  brass: {
    label: "Brass",
    icon: "🟡",
    desc: "Classic industrial gold",
    vars: {
      "--accent": "#C49B45",
      "--accent-glow": "rgba(196,155,69,0.35)",
      "--accent-glow-strong": "rgba(196,155,69,0.6)",
      "--brass": "#C49B45",
      "--brass-light": "#E0BC6A",
      "--brass-dark": "#8B6914",
      "--brass-muted": "#9A7A35",
      "--border": "rgba(196,155,69,0.2)",
      "--border-strong": "rgba(196,155,69,0.5)",
      "--shadow-brass":
        "0 0 20px rgba(196,155,69,0.25), 0 0 60px rgba(196,155,69,0.08)",
      "--accent-glow-card": "rgba(196,155,69,0.08)",
      "--bg-primary": "#0E0F11",
      "--bg-secondary": "#22252B",
      "--bg-card": "#2C3038",
      "--bg-elevated": "#363B44",
    },
  },

  violet: {
    label: "Violet",
    icon: "🟣",
    desc: "Deep arcane purple",
    vars: {
      "--accent": "#9B6FD4",
      "--accent-glow": "rgba(155,111,212,0.35)",
      "--accent-glow-strong": "rgba(155,111,212,0.6)",
      "--brass": "#9B6FD4",
      "--brass-light": "#BFA0E8",
      "--brass-dark": "#6B3FA8",
      "--brass-muted": "#7D57B8",
      "--border": "rgba(155,111,212,0.2)",
      "--border-strong": "rgba(155,111,212,0.5)",
      "--shadow-brass":
        "0 0 20px rgba(155,111,212,0.25), 0 0 60px rgba(155,111,212,0.08)",
      "--accent-glow-card": "rgba(155,111,212,0.08)",
      "--bg-primary": "#0C0A12",
      "--bg-secondary": "#1A1626",
      "--bg-card": "#221D33",
      "--bg-elevated": "#2E2745",
    },
  },

  cobalt: {
    label: "Cobalt",
    icon: "🔵",
    desc: "Electric steel blue",
    vars: {
      "--accent": "#4A9EFF",
      "--accent-glow": "rgba(74,158,255,0.35)",
      "--accent-glow-strong": "rgba(74,158,255,0.6)",
      "--brass": "#4A9EFF",
      "--brass-light": "#80BEFF",
      "--brass-dark": "#1A5FB0",
      "--brass-muted": "#3A7FCC",
      "--border": "rgba(74,158,255,0.2)",
      "--border-strong": "rgba(74,158,255,0.5)",
      "--shadow-brass":
        "0 0 20px rgba(74,158,255,0.25), 0 0 60px rgba(74,158,255,0.08)",
      "--accent-glow-card": "rgba(74,158,255,0.08)",
      "--bg-primary": "#090D14",
      "--bg-secondary": "#111822",
      "--bg-card": "#182030",
      "--bg-elevated": "#1E2A3E",
    },
  },

  crimson: {
    label: "Crimson",
    icon: "🔴",
    desc: "Forge-fire red",
    vars: {
      "--accent": "#D4524A",
      "--accent-glow": "rgba(212,82,74,0.35)",
      "--accent-glow-strong": "rgba(212,82,74,0.6)",
      "--brass": "#D4524A",
      "--brass-light": "#E88880",
      "--brass-dark": "#8B2A24",
      "--brass-muted": "#AA3D38",
      "--border": "rgba(212,82,74,0.2)",
      "--border-strong": "rgba(212,82,74,0.5)",
      "--shadow-brass":
        "0 0 20px rgba(212,82,74,0.25), 0 0 60px rgba(212,82,74,0.08)",
      "--accent-glow-card": "rgba(212,82,74,0.08)",
      "--bg-primary": "#120A09",
      "--bg-secondary": "#1E1210",
      "--bg-card": "#271815",
      "--bg-elevated": "#33201C",
    },
  },

  emerald: {
    label: "Emerald",
    icon: "🟢",
    desc: "Oxidised copper green",
    vars: {
      "--accent": "#4DAA7A",
      "--accent-glow": "rgba(77,170,122,0.35)",
      "--accent-glow-strong": "rgba(77,170,122,0.6)",
      "--brass": "#4DAA7A",
      "--brass-light": "#80C9A8",
      "--brass-dark": "#2A6E50",
      "--brass-muted": "#3D8A62",
      "--border": "rgba(77,170,122,0.2)",
      "--border-strong": "rgba(77,170,122,0.5)",
      "--shadow-brass":
        "0 0 20px rgba(77,170,122,0.25), 0 0 60px rgba(77,170,122,0.08)",
      "--accent-glow-card": "rgba(77,170,122,0.08)",
      "--bg-primary": "#090E0B",
      "--bg-secondary": "#111A14",
      "--bg-card": "#17231B",
      "--bg-elevated": "#1E2F23",
    },
  },

  void: {
    label: "Void",
    icon: "⚫",
    desc: "High-contrast monochrome",
    vars: {
      "--accent": "#C8C8C8",
      "--accent-glow": "rgba(200,200,200,0.2)",
      "--accent-glow-strong": "rgba(200,200,200,0.4)",
      "--brass": "#C8C8C8",
      "--brass-light": "#FFFFFF",
      "--brass-dark": "#888888",
      "--brass-muted": "#AAAAAA",
      "--border": "rgba(200,200,200,0.15)",
      "--border-strong": "rgba(200,200,200,0.4)",
      "--shadow-brass":
        "0 0 20px rgba(200,200,200,0.15), 0 0 60px rgba(200,200,200,0.05)",
      "--accent-glow-card": "rgba(200,200,200,0.05)",
      "--bg-primary": "#050505",
      "--bg-secondary": "#0E0E0E",
      "--bg-card": "#141414",
      "--bg-elevated": "#1C1C1C",
    },
  },
};

const THEME_KEY = "gearforged_theme";
const DEFAULT_THEME = "brass";

/* ============================================================
   APPLY THEME
   ============================================================ */
const applyTheme = (themeId) => {
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];
  const root = document.documentElement;

  Object.entries(theme.vars).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });

  // Update active state on buttons
  document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
    const isActive = btn.dataset.themeBtn === themeId;
    btn.classList.toggle("theme-btn--active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  // Persist choice
  try {
    localStorage.setItem(THEME_KEY, themeId);
  } catch (_) {}

  // Dispatch event so other modules can react
  document.dispatchEvent(
    new CustomEvent("themechange", { detail: { themeId, theme } }),
  );
};

/* ============================================================
   LOAD SAVED THEME
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
   BUILD THEME PICKER UI
   Injects a floating theme picker button + panel into the page.
   ============================================================ */
const buildThemePicker = () => {
  const current = (() => {
    try {
      return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    } catch (_) {
      return DEFAULT_THEME;
    }
  })();

  // Wrapper
  const wrapper = document.createElement("div");
  wrapper.id = "theme-picker-widget";
  wrapper.innerHTML = `
    <button class="theme-toggle-btn" id="theme-toggle-btn" aria-label="Toggle theme picker" aria-expanded="false">
      <span class="theme-toggle-icon" aria-hidden="true">🎨</span>
    </button>
    <div class="theme-panel" id="theme-panel" role="dialog" aria-label="Theme selector" hidden>
      <div class="theme-panel__header">
        <span class="theme-panel__title">Choose Theme</span>
        <button class="theme-panel__close" id="theme-panel-close" aria-label="Close theme picker">✕</button>
      </div>
      <div class="theme-panel__grid" role="list">
        ${Object.entries(THEMES)
          .map(
            ([id, t]) => `
          <button
            class="theme-btn ${id === current ? "theme-btn--active" : ""}"
            data-theme-btn="${id}"
            aria-pressed="${id === current ? "true" : "false"}"
            aria-label="Apply ${t.label} theme"
            title="${t.desc}"
          >
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

  // CSS for the widget (injected directly so it's always present)
  const style = document.createElement("style");
  style.textContent = `
    /* ---- Theme Picker Widget ---- */
    #theme-picker-widget {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.75rem;
    }

    .theme-toggle-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid var(--border-strong);
      background: var(--bg-elevated);
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px var(--border);
      transition: all 0.25s ease;
      backdrop-filter: blur(12px);
    }

    .theme-toggle-btn:hover {
      border-color: var(--brass);
      box-shadow: 0 4px 24px rgba(0,0,0,0.5), 0 0 16px var(--accent-glow);
      transform: rotate(20deg) scale(1.05);
    }

    .theme-toggle-icon { line-height: 1; }

    .theme-panel {
      background: var(--bg-elevated);
      border: 1px solid var(--border-strong);
      border-radius: 12px;
      padding: 1rem;
      width: 260px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.6), 0 0 32px var(--accent-glow);
      backdrop-filter: blur(20px);
      animation: panelSlideIn 0.2s ease both;
    }

    .theme-panel[hidden] { display: none !important; }

    @keyframes panelSlideIn {
      from { opacity: 0; transform: translateY(12px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .theme-panel__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      padding-bottom: 0.6rem;
      border-bottom: 1px solid var(--border);
    }

    .theme-panel__title {
      font-family: var(--font-mono, monospace);
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--brass);
    }

    .theme-panel__close {
      background: none;
      border: none;
      color: var(--text-muted, #888);
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      transition: color 0.15s;
      line-height: 1;
    }

    .theme-panel__close:hover { color: var(--text-primary, #ccc); }

    .theme-panel__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }

    .theme-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      padding: 0.65rem 0.5rem;
      background: var(--bg-card, #222);
      border: 1px solid var(--border, rgba(255,255,255,0.1));
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .theme-btn:hover {
      border-color: var(--brass, #aaa);
      background: var(--accent-glow-card, rgba(255,255,255,0.05));
    }

    .theme-btn--active {
      border-color: var(--brass, #aaa) !important;
      background: var(--accent-glow-card, rgba(255,255,255,0.08)) !important;
      box-shadow: 0 0 12px var(--accent-glow, rgba(255,255,255,0.2));
    }

    .theme-btn__icon { font-size: 1.3rem; line-height: 1; }

    .theme-btn__label {
      font-family: var(--font-heading, serif);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--text-primary, #ddd);
      text-transform: uppercase;
    }

    .theme-btn__desc {
      font-size: 0.6rem;
      color: var(--text-muted, #888);
      line-height: 1.2;
    }

    @media (max-width: 600px) {
      #theme-picker-widget {
        bottom: 1rem;
        right: 1rem;
      }

      .theme-panel { width: 230px; }
    }
  `;
  document.head.appendChild(style);

  // Toggle panel
  const toggleBtn = document.getElementById("theme-toggle-btn");
  const panel = document.getElementById("theme-panel");
  const closeBtn = document.getElementById("theme-panel-close");

  const openPanel = () => {
    panel.hidden = false;
    toggleBtn.setAttribute("aria-expanded", "true");
    panel.querySelector(".theme-btn--active")?.focus();
  };

  const closePanel = () => {
    panel.hidden = true;
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.focus();
  };

  toggleBtn.addEventListener("click", () => {
    panel.hidden ? openPanel() : closePanel();
  });

  closeBtn.addEventListener("click", closePanel);

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) closePanel();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) closePanel();
  });

  // Theme button clicks
  wrapper.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-btn]");
    if (!btn) return;
    applyTheme(btn.dataset.themeBtn);
    // Briefly show feedback, then close
    setTimeout(closePanel, 300);
  });
};

/* ============================================================
   INIT — runs immediately on script load (before DOMContentLoaded)
   so there's no flash of wrong theme.
   ============================================================ */
const ThemeSystem = (() => {
  // Apply theme immediately (no flash)
  loadTheme();

  // Build picker UI after DOM ready
  const init = () => {
    buildThemePicker();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { applyTheme, loadTheme, THEMES };
})();

// Expose globally for other scripts
window.ThemeSystem = ThemeSystem;
