/**
 * GEARFORGED WORLD — Rules Page JavaScript
 * - Loads rule categories from server-data.json
 * - Collapsible accordion per category
 * - Live search with inline text highlighting inside rule items
 * - Auto-generated TOC with scroll-spy
 * - Anchor link handling on page load
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
   TEXT HIGHLIGHTER
   Wraps all occurrences of `query` in a rule item's text with
   <mark class="search-match"> spans, preserving original casing.
   ============================================================ */
const highlightText = (text, query) => {
  if (!query) return document.createTextNode(text);

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  const frag = document.createDocumentFragment();
  parts.forEach((part) => {
    if (regex.test(part)) {
      const mark = document.createElement("mark");
      mark.className = "search-match";
      mark.textContent = part;
      frag.appendChild(mark);
    } else {
      frag.appendChild(document.createTextNode(part));
    }
    regex.lastIndex = 0; // reset after test()
  });
  return frag;
};

/* ============================================================
   RENDER RULE ITEM
   Stores original text in data attribute for re-highlighting.
   ============================================================ */
const renderRuleItem = (text) => {
  const li = document.createElement("li");
  li.className = "rule-item";
  li.setAttribute("data-rule-text", text.toLowerCase());

  // Text container — content updated during search
  const span = document.createElement("span");
  span.className = "rule-text";
  span.textContent = text;
  li.appendChild(span);

  return li;
};

/* ============================================================
   RENDER CATEGORY
   ============================================================ */
const renderCategory = (cat) => {
  const section = document.createElement("section");
  section.className = "rules-category";
  section.id = `cat-${cat.id}`;

  // Header
  const header = document.createElement("div");
  header.className = "rules-category__header";
  header.setAttribute("role", "button");
  header.setAttribute("aria-expanded", "false");
  header.setAttribute("tabindex", "0");
  header.innerHTML = `
    <div class="rules-category__header-left">
      <span class="rules-category__icon" aria-hidden="true">${cat.icon}</span>
      <div>
        <div class="rules-category__name">${cat.title}</div>
        ${cat.description ? `<div class="rules-category__desc">${cat.description}</div>` : ""}
      </div>
    </div>
    <span class="rules-category__chevron" aria-hidden="true">▼</span>
  `;

  // Body
  const body = document.createElement("div");
  body.className = "rules-category__body";
  body.setAttribute("role", "region");

  const makeList = (rules) => {
    const ul = document.createElement("ul");
    ul.className = "rules-list";
    rules.forEach((r) => ul.appendChild(renderRuleItem(r)));
    return ul;
  };

  if (cat.rules) {
    body.appendChild(makeList(cat.rules));
  }

  if (cat.subsections) {
    cat.subsections.forEach((sub) => {
      const div = document.createElement("div");
      div.className = "rules-subsection";

      const title = document.createElement("div");
      title.className = "rules-subsection__title";
      title.textContent = sub.title;
      div.appendChild(title);

      if (sub.intro) {
        const p = document.createElement("p");
        p.className = "rules-subsection__intro";
        p.textContent = sub.intro;
        div.appendChild(p);
      }

      div.appendChild(makeList(sub.rules));
      body.appendChild(div);
    });
  }

  // Toggle
  const toggle = () => {
    const open = section.classList.toggle("open");
    header.setAttribute("aria-expanded", open);
  };
  header.addEventListener("click", toggle);
  header.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  section.appendChild(header);
  section.appendChild(body);
  return section;
};

/* ============================================================
   TOC
   ============================================================ */
const buildTOC = (categories) => {
  const list = document.getElementById("toc-list");
  if (!list) return;

  categories.forEach((cat) => {
    const li = document.createElement("li");
    li.className = "rules-toc__item";
    li.innerHTML = `<a href="#cat-${cat.id}"><span class="rules-toc__icon" aria-hidden="true">${cat.icon}</span>${cat.title}</a>`;
    list.appendChild(li);
  });

  // Scroll-spy
  const links = list.querySelectorAll("a");
  const sections = document.querySelectorAll(".rules-category");
  const navH =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--nav-height",
      ),
    ) || 64;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.remove("active"));
        list
          .querySelector(`a[href="#${entry.target.id}"]`)
          ?.classList.add("active");
      });
    },
    { rootMargin: `-${navH + 20}px 0px -60% 0px` },
  );

  sections.forEach((s) => spy.observe(s));
};

/* ============================================================
   SEARCH — with inline text highlighting
   ============================================================ */
const initSearch = () => {
  const input = document.getElementById("rules-search");
  const noResult = document.getElementById("rules-no-results");
  const countEl = document.getElementById("rules-count");
  if (!input) return;

  // Debounce helper
  let timer;
  const debounce =
    (fn, ms) =>
    (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };

  // Re-highlight a single rule item's text span
  const rehighlight = (li, query) => {
    const span = li.querySelector(".rule-text");
    if (!span) return;
    const originalText = li.getAttribute("data-rule-text"); // lower-case version
    // We need the original casing — store it separately
    const rawText = li.getAttribute("data-rule-raw") || span.textContent;
    if (!li.getAttribute("data-rule-raw"))
      li.setAttribute("data-rule-raw", rawText);

    span.textContent = "";
    span.appendChild(highlightText(rawText, query));
  };

  const doSearch = (query) => {
    const q = query.toLowerCase().trim();
    const categories = document.querySelectorAll(".rules-category");
    let totalVisible = 0;
    let totalAll = 0;

    categories.forEach((catEl) => {
      const catName =
        catEl
          .querySelector(".rules-category__name")
          ?.textContent.toLowerCase() || "";
      const items = catEl.querySelectorAll(".rule-item");
      let catMatches = 0;

      items.forEach((li) => {
        totalAll++;
        const ruleText = li.getAttribute("data-rule-text") || "";
        const matches = !q || ruleText.includes(q) || catName.includes(q);

        li.style.display = matches ? "" : "none";
        li.classList.toggle("highlight", matches && !!q);

        // Re-render text with highlight spans
        rehighlight(li, q);

        if (matches) {
          catMatches++;
          totalVisible++;
        }
      });

      // Show/hide subsections
      catEl.querySelectorAll(".rules-subsection").forEach((sub) => {
        const anyVisible = [...sub.querySelectorAll(".rule-item")].some(
          (i) => i.style.display !== "none",
        );
        sub.style.display = anyVisible || !q ? "" : "none";
      });

      const show = !q || catMatches > 0 || catName.includes(q);
      catEl.classList.toggle("hidden", !show);
      if (q && show) catEl.classList.add("open");
      if (!q) catEl.classList.remove("open");
    });

    if (!q) {
      // Restore first-open state
      const first = document.querySelector(".rules-category:not(.hidden)");
      if (first) first.classList.add("open");
    }

    if (noResult)
      noResult.classList.toggle("visible", totalVisible === 0 && !!q);
    if (countEl) {
      countEl.textContent = q
        ? `${totalVisible} of ${totalAll} rules match`
        : `${totalAll} rules total`;
    }
  };

  input.addEventListener(
    "input",
    debounce((e) => doSearch(e.target.value), 180),
  );

  // Clear button
  const clearBtn = document.getElementById("search-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      input.value = "";
      doSearch("");
      input.focus();
    });
    input.addEventListener("input", () => {
      clearBtn.classList.toggle("visible", input.value.length > 0);
    });
  }

  // Initial count
  setTimeout(() => doSearch(""), 100);
};

/* ============================================================
   EXPAND / COLLAPSE ALL
   ============================================================ */
const initExpandCollapse = () => {
  document.getElementById("expand-all")?.addEventListener("click", () => {
    document.querySelectorAll(".rules-category:not(.hidden)").forEach((c) => {
      c.classList.add("open");
      c.querySelector(".rules-category__header")?.setAttribute(
        "aria-expanded",
        "true",
      );
    });
  });
  document.getElementById("collapse-all")?.addEventListener("click", () => {
    document.querySelectorAll(".rules-category").forEach((c) => {
      c.classList.remove("open");
      c.querySelector(".rules-category__header")?.setAttribute(
        "aria-expanded",
        "false",
      );
    });
  });
};

/* ============================================================
   ANCHOR ON LOAD
   ============================================================ */
const handleAnchor = () => {
  const hash = window.location.hash;
  if (!hash) return;
  setTimeout(() => {
    const target = document.querySelector(hash);
    if (!target) return;
    target.classList.add("open");
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
  }, 250);
};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("rules-container");
  const loading = document.getElementById("rules-loading");
  if (!container) return;

  try {
    const data = await fetchData();
    const categories = data.ruleCategories;

    // Clear loading state
    if (loading) loading.remove();

    // Render all categories
    categories.forEach((cat) => container.appendChild(renderCategory(cat)));

    // Open first by default
    container.querySelector(".rules-category")?.classList.add("open");

    // Wire up features
    buildTOC(categories);
    initSearch();
    initExpandCollapse();
    handleAnchor();
  } catch (err) {
    console.error("Rules load failed:", err);
    if (loading) loading.remove();
    container.innerHTML = `
      <div style="text-align:center;padding:4rem;color:var(--text-muted);font-family:var(--font-mono)">
        <p style="font-size:2rem">⚠️</p>
        <p style="margin-top:1rem">Failed to load rules.</p>
        <p style="font-size:0.8rem;opacity:0.6;margin-top:0.5rem">${err.message}</p>
        <p style="font-size:0.8rem;opacity:0.6;margin-top:0.5rem">
          Make sure you're running the site via a local server, not file://<br>
          Try: <code>npx serve .</code> in the project folder
        </p>
      </div>`;
  }
});
