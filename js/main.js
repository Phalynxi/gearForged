/**
 * GEARFORGED WORLD — Main JavaScript
 * Shared utilities, navigation, scroll effects, animations
 */

'use strict';

/* ============================================================
   NAVIGATION
   ============================================================ */
const Nav = (() => {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  // Scroll-based nav styling
  const handleScroll = () => {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  // Mobile hamburger toggle
  const initHamburger = () => {
    if (!hamburger || !mobileMenu) return;
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  };

  // Highlight active nav link based on current page
  const setActiveLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link, .nav__mobile .nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  };

  const init = () => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    initHamburger();
    setActiveLink();
  };

  return { init };
})();


/* ============================================================
   REVEAL ON SCROLL (Intersection Observer)
   ============================================================ */
const RevealOnScroll = (() => {
  const init = () => {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children reveals
          entry.target.style.transitionDelay = `${i * 0.05}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  };

  return { init };
})();


/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
const Toast = (() => {
  let toastEl = null;
  let timeout = null;

  const create = () => {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  };

  const show = (message, duration = 2500) => {
    if (!toastEl) create();
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  };

  return { show };
})();


/* ============================================================
   SERVER IP COPY
   ============================================================ */
const ServerIP = (() => {
  const init = () => {
    const ipEls = document.querySelectorAll('[data-copy-ip]');
    ipEls.forEach(el => {
      el.addEventListener('click', () => {
        const ip = el.dataset.copyIp;
        navigator.clipboard.writeText(ip).then(() => {
          Toast.show(`✓ Copied: ${ip}`);
        }).catch(() => {
          Toast.show(`Server IP: ${ip}`);
        });
      });
    });
  };

  return { init };
})();


/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
const CounterAnimation = (() => {
  const animateCounter = (el, target, suffix = '') => {
    const start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const isFloat = target.toString().includes('.');

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat
        ? (start + (target - start) * eased).toFixed(1)
        : Math.round(start + (target - start) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const init = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.counter);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  };

  return { init };
})();


/* ============================================================
   PARALLAX HERO
   ============================================================ */
const HeroParallax = (() => {
  const init = () => {
    const heroGears = document.querySelectorAll('.hero__gear');
    if (!heroGears.length) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroGears.forEach((gear, i) => {
            const speed = (i + 1) * 0.15;
            gear.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  };

  return { init };
})();


/* ============================================================
   SMOOTH SCROLL TO ANCHORS
   ============================================================ */
const SmoothScroll = (() => {
  const init = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  };

  return { init };
})();


/* ============================================================
   RENDER NAV FROM DATA (shared nav builder)
   ============================================================ */
const NavBuilder = (() => {
  const pages = [
    { href: 'index.html',  label: 'Home' },
    { href: 'civs.html',   label: 'Civilisations' },
    { href: 'rules.html',  label: 'Rules' },
    { href: 'guide.html',  label: 'Guide' },
  ];

  const build = (container, mobile = false) => {
    if (!container) return;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    pages.forEach(page => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = page.href;
      a.textContent = page.label;
      a.className = 'nav__link';
      if (page.href === currentPage) a.classList.add('active');
      li.appendChild(a);
      container.appendChild(li);
    });
  };

  return { build };
})();


/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Nav.init();
  RevealOnScroll.init();
  ServerIP.init();
  CounterAnimation.init();
  HeroParallax.init();
  SmoothScroll.init();
});
