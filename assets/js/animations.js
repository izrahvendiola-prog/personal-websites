/* ============================================================
   izrah. — Personal Website
   animations.js · Scroll reveals, stagger, parallax,
   and page transitions (View Transitions API, progressive)
   ============================================================ */
(function () {
  "use strict";

  const doc = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ----------------------------------------------------------
     Scroll reveals
     Elements: [data-animate="fade-up|fade-in|slide-left|slide-right|scale-in"]
     Optional: data-delay="ms" — or auto-stagger inside [data-animate-group]
  ---------------------------------------------------------- */
  function initReveals() {
    const items = document.querySelectorAll("[data-animate]");
    if (!items.length) return;

    const show = (el) => {
      el.classList.add("in-view");
      /* Clear the stagger delay once revealed so hover effects stay snappy */
      const delay = parseFloat(el.dataset.delay || "0", 10);
      const duration = (parseFloat(getComputedStyle(el).transitionDuration, 10) || 0.8) * 1000;
      window.setTimeout(() => el.style.setProperty("--anim-delay", "0ms"), delay + duration);
    };

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }

    /* Auto-stagger children of grouped containers */
    document.querySelectorAll("[data-animate-group]").forEach((group) => {
      group.querySelectorAll("[data-animate]").forEach((el, i) => {
        if (!el.dataset.delay) el.dataset.delay = String(i * 90);
      });
    });

    items.forEach((el) => {
      const delay = parseFloat(el.dataset.delay || "0", 10);
      if (delay) el.style.setProperty("--anim-delay", `${delay}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ----------------------------------------------------------
     Gentle pointer parallax on hero decorations
     Targets: [data-parallax="depth"]
  ---------------------------------------------------------- */
  function initParallax() {
    if (reducedMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;

    const layers = document.querySelectorAll("[data-parallax]");
    if (!layers.length) return;

    let rafId = null;
    window.addEventListener(
      "mousemove",
      (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          layers.forEach((el) => {
            const depth = parseFloat(el.dataset.parallax || "12", 10);
            el.style.translate = `${(x * depth).toFixed(1)}px ${(y * depth).toFixed(1)}px`;
          });
          rafId = null;
        });
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------
     Page transitions
     - Chrome 126+: cross-document View Transitions via CSS
       (@view-transition in style.css) — no JS needed.
     - Everywhere else: quick fade-out fallback before navigating.
  ---------------------------------------------------------- */
  function initPageTransitions() {
    const supportsDocVT = "onpageswap" in document;
    if (supportsDocVT || reducedMotion.matches) return;

    let navigating = false;

    document.addEventListener("click", (e) => {
      if (navigating || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = e.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      let url;
      try {
        url = new URL(link.href, location.href);
      } catch (_err) {
        return;
      }
      if (url.origin !== location.origin) return;
      /* Same-page anchors: let the browser scroll smoothly instead */
      if (url.pathname === location.pathname && url.hash) return;
      if (url.pathname === location.pathname && url.search === location.search) return;

      navigating = true;
      doc.classList.add("page-leaving");
      window.setTimeout(() => {
        location.href = link.href;
      }, 170);
    });
  }

  /* ----------------------------------------------------------
     Boot
  ---------------------------------------------------------- */
  function initAnimations() {
    initReveals();
    initParallax();
    initPageTransitions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnimations);
  } else {
    initAnimations();
  }
})();
