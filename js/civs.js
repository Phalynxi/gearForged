/**
 * GEARFORGED WORLD — Civilisations Page JavaScript
 * Dynamically renders civilization cards from server-data.json
 * Civilization management system is present but locked pending Discord bot integration.
 */

"use strict";

/* ============================================================
   DATA FETCHER
   ============================================================ */
const fetchServerData = async () => {
  const response = await fetch("data/server-data.json");
  if (!response.ok)
    throw new Error(`Failed to load server data: ${response.status}`);
  return response.json();
};

/* ============================================================
   CIV CARD RENDERER (Preview Grid)
   ============================================================ */
const renderCivPreviewCard = (civ, index) => {
  const tagsHtml = (civ.tags || [])
    .slice(0, 3)
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  const card = document.createElement("a");
  card.href = `civs.html#civ-${civ.id}`;
  card.className = "civ-preview-card reveal";
  card.style.transitionDelay = `${index * 0.1}s`;
  card.style.textDecoration = "none";
  card.innerHTML = `
    <div class="civ-preview-card__glow" style="background:linear-gradient(90deg,${civ.accentColor},${civ.color})"></div>
    <span class="civ-preview-card__emblem" aria-hidden="true">${civ.emblem}</span>
    <div class="civ-preview-card__name">${civ.name}</div>
    <div class="civ-preview-card__tagline">${civ.tagline}</div>
    <div class="civ-preview-card__tags">${tagsHtml}</div>
  `;
  return card;
};

/* ============================================================
   CIV DETAIL RENDERER
   ============================================================ */
const renderCivDetail = (civ) => {
  const article = document.createElement("article");
  article.className = "civ-card reveal";
  article.id = `civ-${civ.id}`;

  // Foreign policy list
  const fpItems = (civ.foreignPolicy || [])
    .map((fp) => `<li>${fp}</li>`)
    .join("");

  // Tags
  const tagsHtml = (civ.tags || [])
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  // Optional leader
  const leaderHtml = civ.leader
    ? `<div class="civ-meta-item">
        <span class="civ-meta-label">Leader</span>
        <span class="civ-meta-value">${civ.leader}</span>
       </div>`
    : "";

  // Optional discord link
  const discordHtml = civ.discord
    ? `<a href="${civ.discord}" class="btn btn--secondary" target="_blank" rel="noopener" style="margin-top:var(--space-md);font-size:0.75rem;padding:0.5rem 1rem">
        Join Discord
       </a>`
    : "";

  article.innerHTML = `
    <div class="civ-card__accent-bar"
         style="background: linear-gradient(90deg, ${civ.accentColor}, ${civ.color}, ${civ.accentColor});"></div>
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
        <ul class="civ-policy-list">
          ${fpItems}
        </ul>

        <h3>Military Doctrine</h3>
        <blockquote class="civ-doctrine">${civ.nuclearDoctrine}</blockquote>

        <h3>Joining ${civ.name}</h3>
        <p>${civ.recruitment}</p>
      </div>
    </div>
  `;

  // Style the civ policy list items
  const policyList = article.querySelector(".civ-policy-list");
  if (policyList) {
    policyList.style.listStyle = "none";
    policyList.style.padding = "0";
    policyList.style.display = "flex";
    policyList.style.flexDirection = "column";
    policyList.style.gap = "0.35rem";
    policyList.querySelectorAll("li").forEach((li) => {
      li.style.display = "flex";
      li.style.gap = "0.5rem";
      li.style.fontSize = "0.95rem";
      li.style.color = "var(--text-secondary)";
    });
  }

  return article;
};

/* ============================================================
   MANAGEMENT PORTAL — LOCKED
   Placeholder for future Minecraft account integration.
   Will be made public once the Discord bot is ready.
   ============================================================ */
const renderManagementLocked = () => {
  const section = document.createElement("div");
  section.className = "civ-management-locked";
  section.style.display = "none";
  section.id = "civ-management";

  section.innerHTML = `
    <span class="civ-management-locked__icon">🔧</span>
    <h2 class="civ-management-locked__title">Civilisation Management Portal</h2>
    <p class="civ-management-locked__desc">
      Linked to your Minecraft account, the management portal lets you view your civilisation's
      stats, submit diplomatic proposals, and manage membership — all without touching Discord.
      <br><br>
      <strong>Coming soon.</strong> Pending Discord bot integration.
    </p>
    <button class="btn btn--secondary" disabled style="opacity:0.5;cursor:not-allowed">
      🔒 Link Minecraft Account
    </button>
    <p style="font-size:0.75rem;color:var(--text-muted);margin-top:1rem;font-family:var(--font-mono);letter-spacing:0.05em">
      SYSTEM_STATUS: PENDING_BOT_INTEGRATION
    </p>
  `;

  return section;
};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  const previewContainer = document.getElementById("civs-preview");
  const detailContainer = document.getElementById("civs-container");

  if (!previewContainer && !detailContainer) return;

  try {
    const data = await fetchServerData();
    const civs = data.civilizations;

    // Check if we're on the detail view (has hash)
    const hash = window.location.hash;

    if (hash && detailContainer) {
      // Detail view
      detailContainer.style.display = "block";
      previewContainer.style.display = "none";

      const civId = hash.replace("#civ-", "");
      const civ = civs.find((c) => c.id === civId);

      if (civ) {
        detailContainer.innerHTML = "";
        detailContainer.appendChild(renderCivDetail(civ));
        detailContainer.appendChild(renderManagementLocked());

        // Scroll to section
        setTimeout(() => {
          const navH = 64 + 20;
          const top =
            detailContainer.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: "smooth" });
        }, 100);
      }
    } else {
      // 2. PREVIEW GRID MODE
      if (previewContainer) {
        previewContainer.style.display = "grid";

        // Hide the full-detail element container if it's currently showing deep data
        const activeDetailCard = detailContainer
          ? detailContainer.querySelector(".civ-card")
          : null;
        if (activeDetailCard) {
          activeDetailCard.remove();
        }

        previewContainer.innerHTML = "";
        civs.forEach((civ, i) => {
          previewContainer.appendChild(renderCivPreviewCard(civ, i));
        });

        // Fail-safe manual loader removal once cards append successfully
        const loadingSpinner = document.getElementById("civs-loading");
        if (loadingSpinner) loadingSpinner.remove();
      }
    }

    // Trigger reveal animation
    if (typeof RevealOnScroll !== "undefined") {
      RevealOnScroll.init();
    }
  } catch (err) {
    console.error("Failed to load civilization data:", err);
    if (previewContainer) {
      previewContainer.innerHTML = `
        <div style="text-align:center;padding:4rem;color:var(--text-muted);font-family:var(--font-mono)">
          <p>⚠️ Failed to load civilisation data.</p>
          <p style="font-size:0.8rem;margin-top:0.5rem">${err.message}</p>
        </div>
      `;
    }
    if (detailContainer) {
      detailContainer.innerHTML = `
        <div style="text-align:center;padding:4rem;color:var(--text-muted);font-family:var(--font-mono)">
          <p>⚠️ Failed to load civilisation data.</p>
          <p style="font-size:0.8rem;margin-top:0.5rem">${err.message}</p>
        </div>
      `;
    }
  }
});
