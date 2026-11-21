/* Motion: scroll reveals, hero card effects, parallax and page transitions. */

(function () {
  "use strict";

  const doc = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function initReveals() {
    const items = document.querySelectorAll("[data-animate]");
    if (!items.length) return;

    const show = (el) => {
      el.classList.add("in-view");

      const delay = parseFloat(el.dataset.delay || "0", 10);
      const duration = (parseFloat(getComputedStyle(el).transitionDuration, 10) || 0.8) * 1000;
      window.setTimeout(() => el.style.setProperty("--anim-delay", "0ms"), delay + duration);
    };

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }

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

  function initPrefetch() {
    const conn = navigator.connection;
    if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""))) return;

    const done = new Set();

    const prefetch = (link) => {
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      let url;
      try {
        url = new URL(link.href, location.href);
      } catch (_err) {
        return;
      }
      if (url.origin !== location.origin) return;
      if (!/\.html?$/i.test(url.pathname) && url.pathname.charAt(url.pathname.length - 1) !== "/") return;
      if (url.pathname === location.pathname && url.search === location.search) return;
      if (done.has(url.href)) return;
      done.add(url.href);

      const tag = document.createElement("link");
      tag.rel = "prefetch";
      tag.href = url.href;
      document.head.appendChild(tag);
    };

    const onIntent = (e) => {
      const target = e.target;
      const link = target && target.closest ? target.closest("a[href]") : null;
      if (link) prefetch(link);
    };

    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("pointerdown", onIntent, { passive: true });
    document.addEventListener("focusin", onIntent);
  }

  function initPageTransitions() {
    const supportsDocVT = "onpageswap" in window;
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

      if (url.pathname === location.pathname && url.hash) return;
      if (url.pathname === location.pathname && url.search === location.search) return;

      navigating = true;
      doc.classList.add("page-leaving");
      window.setTimeout(() => {
        location.href = link.href;
      }, 110);
    });
  }

  function initHeroCard() {
    const cards = document.querySelectorAll(".hero-card");
    if (!cards.length) return;

    const allIn = () => cards.forEach((card) => card.classList.add("in"));

    if (!("IntersectionObserver" in window) || reducedMotion.matches) {
      allIn();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach((card) => observer.observe(card));
  }

  function initAnimations() {
    initReveals();
    initHeroCard();
    initParallax();
    initPrefetch();
    initPageTransitions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAnimations);
  } else {
    initAnimations();
  }
})();
