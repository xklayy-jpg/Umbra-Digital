/* ═══════════════════════════════════════════════════
   UMBRA DIGITAL — script.js
   Animations, interactions, scroll behaviour
   ═══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────
   1. STICKY HEADER — adds .scrolled class on scroll
   ───────────────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); // run on load in case page is already scrolled
})();


/* ─────────────────────────────────────────────────
   2. MOBILE NAVIGATION TOGGLE
   ───────────────────────────────────────────────── */
(function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');

    if (isOpen) {
      // Close
      menu.classList.add('hidden');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      // Open
      menu.classList.remove('hidden');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  // Close mobile menu when a link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add('hidden');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ─────────────────────────────────────────────────
   3. SMOOTH SCROLL for anchor links
      (native CSS scroll-behavior covers most cases,
       this adds an offset for the fixed header)
   ───────────────────────────────────────────────── */
(function initSmoothScroll() {
  const HEADER_OFFSET = 80; // px — height of fixed header

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    });
  });
})();


/* ─────────────────────────────────────────────────
   4. SCROLL REVEAL — IntersectionObserver
      Adds .visible to .reveal-up / .reveal-left / .reveal-right
      elements as they enter the viewport.
   ───────────────────────────────────────────────── */
(function initScrollReveal() {
  const THRESHOLD = 0.15; // % of element visible to trigger
  const ROOT_MARGIN = '0px 0px -60px 0px'; // trigger slightly before edge

  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  if (!revealEls.length) return;

  // If IntersectionObserver not supported, just show everything
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold:  THRESHOLD,
      rootMargin: ROOT_MARGIN,
    }
  );

  revealEls.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────────
   5. ACTIVE NAV LINK — highlights current section
      as user scrolls through the page.
   ───────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function setActive() {
    let current = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) {
        link.style.color = 'rgba(255,255,255,0.95)';
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


/* ─────────────────────────────────────────────────
   6. BUTTON RIPPLE EFFECT
      Adds a subtle ripple on click for primary buttons.
   ───────────────────────────────────────────────── */
(function initRipple() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Don't create ripple if it's just a regular nav link click
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      Object.assign(ripple.style, {
        position:     'absolute',
        width:        size + 'px',
        height:       size + 'px',
        left:         x + 'px',
        top:          y + 'px',
        borderRadius: '50%',
        background:   'rgba(110,231,255,0.15)',
        transform:    'scale(0)',
        animation:    'rippleEffect 0.6s ease-out forwards',
        pointerEvents:'none',
      });

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleEffect {
        to { transform: scale(2.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ─────────────────────────────────────────────────
   7. SUBTLE CURSOR GLOW (desktop only)
      Follows mouse with a soft cyan/violet dot
      that floats slightly behind the cursor.
   ───────────────────────────────────────────────── */
(function initCursorGlow() {
  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = document.createElement('div');
  Object.assign(cursor.style, {
    position:     'fixed',
    width:        '300px',
    height:       '300px',
    borderRadius: '50%',
    background:   'radial-gradient(circle, rgba(110,231,255,0.04) 0%, transparent 60%)',
    pointerEvents:'none',
    zIndex:       '9998',
    transform:    'translate(-50%,-50%)',
    transition:   'left 0.08s ease, top 0.08s ease',
    willChange:   'left, top',
  });
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
})();


/* ─────────────────────────────────────────────────
   8. PAGE LOAD ENTRANCE
      Hero elements appear with a staggered fade-in
      on first page load (no scroll needed).
   ───────────────────────────────────────────────── */
(function initPageLoad() {
  // Make hero elements visible immediately on load
  // (they are in the viewport and won't be caught by IntersectionObserver
  //  if the observer fires before they're registered)
  window.addEventListener('DOMContentLoaded', () => {
    const heroElements = document.querySelectorAll(
      '#home .reveal-left, #home .reveal-right'
    );

    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 100 + i * 200);
    });
  });
})();
