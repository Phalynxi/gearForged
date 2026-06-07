/**
 * GEARFORGED WORLD — Main JavaScript
 * Shared utilities: navigation, scroll effects, reveal animations,
 * toast, IP copy, counter animation, parallax.
 *
 * RevealOnScroll is exposed as window.RevealOnScroll so dynamic
 * content added by civs.js / rules.js can trigger it.
 */

"use strict";

/* ============================================================
   NAVIGATION
   ============================================================ */
const Nav = (() => {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".nav__hamburger");
  const mobile = document.querySelector(".nav__mobile");

  const handleScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 20);
  };

  const initHamburger = () => {
    if (!hamburger || !mobile) return;
    hamburger.addEventListener("click", () => {
      const open = hamburger.classList.toggle("open");
      mobile.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open);
    });
    mobile.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobile.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  };

  const setActiveLink = () => {
    const page = window.location.pathname.split("/").pop() || "index.html";
    document
      .querySelectorAll(".nav__link, .nav__mobile .nav__link")
      .forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === page);
      });
  };

  const init = () => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    initHamburger();
    setActiveLink();
  };

  return { init };
})();

/* ============================================================
   REVEAL ON SCROLL
   Exposed globally so civs.js / rules.js can call
   RevealOnScroll.observe(element) after adding content.
   ============================================================ */
const RevealOnScroll = (() => {
  let observer = null;

  const createObserver = () =>
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

  /** Observe a single element */
  const observe = (el) => {
    if (!observer) observer = createObserver();
    observer.observe(el);
  };

  /** Observe all current .reveal elements */
  const init = () => {
    if (!observer) observer = createObserver();
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  };

  /** Re-scan for newly added .reveal elements */
  const refresh = () => {
    document
      .querySelectorAll(".reveal:not(.visible)")
      .forEach((el) => observe(el));
  };

  return { init, observe, refresh };
})();

// Expose globally
window.RevealOnScroll = RevealOnScroll;

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
const Toast = (() => {
  let el = null;
  let timer = null;

  const ensure = () => {
    if (el) return;
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  };

  const show = (msg, duration = 2500) => {
    ensure();
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove("show"), duration);
  };

  return { show };
})();

window.Toast = Toast;

/* ============================================================
   IP COPY
   ============================================================ */
const ServerIP = (() => {
  const init = () => {
    document.querySelectorAll("[data-copy-ip]").forEach((el) => {
      el.addEventListener("click", () => {
        const ip = el.dataset.copyIp;
        navigator.clipboard
          .writeText(ip)
          .then(() => Toast.show(`✓ Copied: ${ip}`))
          .catch(() => Toast.show(`Server IP: ${ip}`));
      });
    });
  };
  return { init };
})();

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
const CounterAnimation = (() => {
  const animate = (el, target, suffix) => {
    const dur = 1800;
    const t0 = performance.now();
    const isFloat = String(target).includes(".");
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const v = isFloat ? (target * e).toFixed(1) : Math.round(target * e);
      el.textContent = v + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const init = () => {
    const els = document.querySelectorAll("[data-counter]");
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          animate(el, parseFloat(el.dataset.counter), el.dataset.suffix || "");
          obs.unobserve(el);
        });
      },
      { threshold: 0.5 },
    );
    els.forEach((el) => obs.observe(el));
  };

  return { init };
})();

/* ============================================================
   HERO PARALLAX
   ============================================================ */
const HeroParallax = (() => {
  const init = () => {
    const gears = document.querySelectorAll(".hero__gear");
    if (!gears.length) return;
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          gears.forEach((g, i) => {
            g.style.transform = `translateY(${y * (i + 1) * 0.12}px)`;
          });
          ticking = false;
        });
        ticking = true;
      },
      { passive: true },
    );
  };
  return { init };
})();

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
const SmoothScroll = (() => {
  const init = () => {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const offset =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--nav-height",
            ),
          ) || 64;
        window.scrollTo({
          top:
            target.getBoundingClientRect().top + window.scrollY - offset - 16,
          behavior: "smooth",
        });
      });
    });
  };
  return { init };
})();

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  Nav.init();
  RevealOnScroll.init();
  ServerIP.init();
  CounterAnimation.init();
  HeroParallax.init();
  SmoothScroll.init();
});
