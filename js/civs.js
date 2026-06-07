/**
 * GEARFORGED WORLD — Civilisations Page JavaScript
 * Loads and renders civ cards from server-data.json.
 * Management portal exists in the DOM but is hidden pending Discord bot.
 */

"use strict";

/* ============================================================
   FETCH
   ============================================================ */
const fetchData = async () => {
  const r = await fetch("data/server-data.json");
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
};

/* ============================================================
   CIV CARD RENDERER
   ============================================================ */
const renderCivCard = (civ) => {
  const article = document.createElement("article");
  article.className = "civ-card reveal";
  article.id = `civ-${civ.id}`;

  const fpHtml = civ.foreignPolicy.map((p) => `<li>${p}</li>`).join("");
  const tagsHtml = (civ.tags || [])
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");
  const leaderHtml = civ.leader
    ? `<div class="civ-meta-item"><span class="civ-meta-label">Leader</span><span class="civ-meta-value">${civ.leader}</span></div>`
    : "";
  const discordHtml = civ.discord
    ? `<a href="${civ.discord}" class="btn btn--secondary" target="_blank" rel="noopener"
          style="margin-top:var(--space-md);font-size:0.72rem;padding:0.45rem 1rem">
         Join Discord
       </a>`
    : "";

  article.innerHTML = `
    <div class="civ-card__accent-bar"
         style="background:linear-gradient(90deg,${civ.accentColor},${civ.color},${civ.accentColor})">
    </div>
    <div class="civ-card__inner">

      <aside class="civ-card__sidebar">
        <span class="civ-card__emblem" role="img" aria-label="${civ.name} emblem">${civ.emblem}</span>
        <h2 class="civ-card__name" style="color:${civ.color}">${civ.name}</h2>
        <p class="civ-card__tagline">${civ.tagline}</p>
        <div class="civ-card__meta">
          <div class="civ-meta-item">
            <span class="civ-meta-label">Government</span>
            <span class="civ-meta-value">${civ.government}</span>
          </div>
          <div class="civ-meta-item">
            <span class="civ-meta-label">Military Doctrine</span>
            <span class="civ-meta-value">${civ.militaryDoctrine}</span>
          </div>
          ${leaderHtml}
        </div>
        <div class="civ-tags">${tagsHtml}</div>
        ${discordHtml}
      </aside>

      <div class="civ-card__content">
        <h3>Overview</h3>
        <p>${civ.overview}</p>

        <h3>Economy & Society</h3>
        <p>${civ.economy}</p>

        <h3>Foreign Policy</h3>
        <ul class="civ-fp-list">${fpHtml}</ul>

        <h3>Doctrine</h3>
        <blockquote class="civ-doctrine">${civ.nuclearDoctrine}</blockquote>

        <h3>Joining ${civ.name}</h3>
        <p>${civ.recruitment}</p>
      </div>
    </div>
  `;

  // Style the foreign-policy list after insertion
  requestAnimationFrame(() => {
    const ul = article.querySelector(".civ-fp-list");
    if (!ul) return;
    Object.assign(ul.style, {
      listStyle: "none",
      padding: "0",
      display: "flex",
      flexDirection: "column",
      gap: "0.4rem",
    });
    ul.querySelectorAll("li").forEach((li) => {
      li.style.cssText =
        "display:flex;gap:0.5rem;align-items:flex-start;font-size:0.95rem;color:var(--text-secondary)";
      const dot = document.createElement("span");
      dot.textContent = "▸";
      dot.style.cssText =
        "color:var(--brass);flex-shrink:0;margin-top:0.15em;font-size:0.8rem";
      li.prepend(dot);
    });
  });

  return article;
};

/* ============================================================
   FILTER BAR
   ============================================================ */
const initFilters = (civs) => {
  const bar = document.getElementById("civ-filters");
  if (!bar) return;

  const allTags = [...new Set(civs.flatMap((c) => c.tags || []))].sort();

  const makeBtn = (label, filter, active = false) => {
    const btn = document.createElement("button");
    btn.className = `btn btn--secondary civ-filter-btn${active ? " active" : ""}`;
    btn.dataset.filter = filter;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
    btn.textContent = label;
    return btn;
  };

  bar.appendChild(makeBtn("All", "all", true));
  allTags.forEach((tag) => bar.appendChild(makeBtn(tag, tag)));

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".civ-filter-btn");
    if (!btn) return;

    bar.querySelectorAll(".civ-filter-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");

    const f = btn.dataset.filter;
    document.querySelectorAll(".civ-card").forEach((card) => {
      const id = card.id.replace("civ-", "");
      const civ = civs.find((c) => c.id === id);
      const show = f === "all" || (civ?.tags || []).includes(f);
      card.style.display = show ? "" : "none";
    });
  });
};

/* ============================================================
   MANAGEMENT PORTAL — hidden until Discord bot ready
   ============================================================ */
const buildManagementPortal = () => {
  const el = document.createElement("div");
  el.id = "civ-management";
  el.style.display = "none"; // ← remove this line once bot is integrated
  el.innerHTML = `
    <div style="background:var(--bg-card);border:2px dashed var(--border);border-radius:var(--radius-lg);
                padding:var(--space-2xl);text-align:center;margin-top:var(--space-2xl)">
      <span style="font-size:3rem;display:block;margin-bottom:var(--space-md)">🔧</span>
      <h2 style="font-family:var(--font-heading);color:var(--text-muted);margin-bottom:var(--space-sm)">
        Civilisation Management Portal
      </h2>
      <p style="color:var(--text-muted);font-size:0.95rem;max-width:50ch;margin:0 auto var(--space-lg)">
        Link your Minecraft account to manage your civilisation's membership, view stats,
        and submit diplomatic proposals — all without leaving the browser.
        <br><br><strong>Coming soon.</strong> Pending Discord bot integration.
      </p>
      <button class="btn btn--secondary" disabled
              style="opacity:0.5;cursor:not-allowed">
        🔒 Link Minecraft Account
      </button>
      <p style="font-family:var(--font-mono);font-size:0.68rem;color:var(--brass-dark);
                letter-spacing:0.1em;margin-top:var(--space-lg)">
        SYSTEM_STATUS: PENDING_BOT_INTEGRATION
      </p>
    </div>
  `;
  return el;
};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("civs-container");
  const loading = document.getElementById("civs-loading");
  if (!container) return;

  try {
    const data = await fetchData();
    const civs = data.civilizations;

    // Remove loading state
    if (loading) loading.remove();

    // Build filter bar
    initFilters(civs);

    // Render civ cards
    civs.forEach((civ) => container.appendChild(renderCivCard(civ)));

    // Append hidden management portal
    container.appendChild(buildManagementPortal());

    // Wire up reveal animations — use global from main.js
    requestAnimationFrame(() => {
      if (window.RevealOnScroll) window.RevealOnScroll.refresh();
    });

    // Scroll to hash if present
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const target = document.querySelector(hash);
        if (!target) return;
        const navH =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--nav-height",
            ),
          ) || 64;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH - 16,
          behavior: "smooth",
        });
      }, 300);
    }
  } catch (err) {
    console.error("Civs load failed:", err);
    if (loading) loading.remove();
    container.innerHTML = `
      <div style="text-align:center;padding:4rem;color:var(--text-muted);font-family:var(--font-mono)">
        <p style="font-size:2rem">⚠️</p>
        <p style="margin-top:1rem">Failed to load civilisations.</p>
        <p style="font-size:0.8rem;opacity:0.6;margin-top:0.5rem">${err.message}</p>
        <p style="font-size:0.8rem;opacity:0.6;margin-top:0.5rem">
          Make sure you're running via a local server, not file://<br>
          Try: <code>npx serve .</code> in the project folder
        </p>
      </div>`;
  }
});
