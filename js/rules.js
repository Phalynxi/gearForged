/**
 * GEARFORGED WORLD — Rules Page JavaScript
 * Renders rules from server-data.json with search and filter functionality
 */

"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const content = document.getElementById("rules-content");
  const searchInput = document.getElementById("rules-search");
  if (!content) return;

  try {
    const res = await fetch("data/server-data.json");
    const data = await res.json();
    const categories = data.ruleCategories;

    // Render all categories
    const renderCategories = (filter = "") => {
      content.innerHTML = "";
      categories.forEach((cat, i) => {
        const hasSubsections = cat.subsections && cat.subsections.length > 0;
        const rulesHtml = hasSubsections
          ? cat.subsections
              .map(
                (sub) => `
            <div class="rules-subsection">
              <h4 class="rules-subsection__title">${sub.title}</h4>
              ${sub.intro ? `<p class="rules-subsection__intro">${sub.intro}</p>` : ""}
              <ul class="rules-list">
                ${sub.rules.map((r) => `<li class="rule-item">${r}</li>`).join("")}
              </ul>
            </div>
          `,
              )
              .join("")
          : `
            <ul class="rules-list">
              ${(cat.rules || []).map((r) => `<li class="rule-item">${r}</li>`).join("")}
            </ul>
          `;

        const category = document.createElement("div");
        category.className = "rules-category";
        category.id = `cat-${cat.id}`;
        category.style.transitionDelay = `${i * 0.05}s`;
        category.innerHTML = `
          <div class="rules-category__header">
            <div class="rules-category__header-left">
              <span class="rules-category__icon">${cat.icon}</span>
              <span class="rules-category__name">${cat.title}</span>
            </div>
            <span class="rules-category__chevron">▼</span>
          </div>
          <div class="rules-category__body">
            ${cat.description ? `<p>${cat.description}</p>` : ""}
            ${rulesHtml}
          </div>
        `;
        content.appendChild(category);
      });

      // Add expand/collapse functionality
      document.querySelectorAll(".rules-category__header").forEach((header) => {
        header.addEventListener("click", () => {
          header.parentElement.classList.toggle("open");
        });
      });

      // Hide all by default except first
      const cats = document.querySelectorAll(".rules-category");
      cats.forEach((cat, idx) => {
        if (idx > 0) cat.classList.add("hidden");
      });
      if (cats.length > 0) cats[0].classList.remove("hidden");
    };

    // Search functionality
    const filterCategories = (searchTerm) => {
      const term = searchTerm.toLowerCase();
      categories.forEach((cat, i) => {
        const matches =
          cat.title.toLowerCase().includes(term) ||
          (cat.description || "").toLowerCase().includes(term) ||
          (cat.rules || []).some((r) => r.toLowerCase().includes(term)) ||
          (cat.subsections || []).some(
            (sub) =>
              sub.title.toLowerCase().includes(term) ||
              (sub.intro || "").toLowerCase().includes(term) ||
              (sub.rules || []).some((r) => r.toLowerCase().includes(term)),
          );

        const catEl = document.getElementById(`cat-${cat.id}`);
        if (catEl) {
          catEl.classList.toggle("hidden", !matches && term !== "");
        }
      });
    };

    // Init
    renderCategories();

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        filterCategories(e.target.value);
      });
    }

    // Handle anchor navigation
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.classList.add("open");
        target.classList.remove("hidden");
        setTimeout(() => {
          const navH = 64 + 20;
          const top =
            target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: "smooth" });
        }, 300);
      }
    }
  } catch (err) {
    console.error("Failed to load rules:", err);
    content.innerHTML = `
      <div style="text-align:center;padding:4rem;color:var(--text-muted);font-family:var(--font-mono)">
        <p>⚠️ Failed to load rules.</p>
        <p style="font-size:0.8rem;margin-top:0.5rem">${err.message}</p>
      </div>
    `;
  }
});
