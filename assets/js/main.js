/* ============================================================
   izrah. — Personal Website
   main.js · Theme management, navigation, forms, filters
   ============================================================ */
(function () {
  "use strict";

  const doc = document.documentElement;
  const THEME_KEY = "izrah-theme";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  /* ----------------------------------------------------------
     Theme
  ---------------------------------------------------------- */
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (_err) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_err) {
      /* private mode — preference simply won't persist */
    }
  }

  function getSystemTheme() {
    return darkQuery.matches ? "dark" : "light";
  }

  function currentTheme() {
    return doc.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    doc.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0B0D0B" : "#F4F3EE");
    const toggle = document.getElementById("themeToggle");
    if (toggle) toggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  function initTheme() {
    applyTheme(getStoredTheme() || getSystemTheme());

    /* Follow the OS when the user hasn't chosen a theme yet */
    darkQuery.addEventListener("change", (e) => {
      if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
    });

    const toggle = document.getElementById("themeToggle");
    if (toggle) toggle.addEventListener("click", toggleTheme);
  }

  /* Toggle with a circular reveal (View Transitions API, progressive) */
  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";

    if (document.startViewTransition && !reducedMotion.matches) {
      const toggleEl = document.getElementById("themeToggle");
      let cx = window.innerWidth / 2;
      let cy = 0;
      if (toggleEl) {
        const r = toggleEl.getBoundingClientRect();
        cx = r.left + r.width / 2;
        cy = r.top + r.height / 2;
      }
      const radius = Math.hypot(
        Math.max(cx, window.innerWidth - cx),
        Math.max(cy, window.innerHeight - cy)
      );

      doc.classList.add("theme-transitioning", "no-anim");
      const transition = document.startViewTransition(() => {
        storeTheme(next);
        applyTheme(next);
      });

      transition.ready
        .then(() => {
          doc.animate(
            {
              clipPath: [
                `circle(0px at ${cx}px ${cy}px)`,
                `circle(${radius}px at ${cx}px ${cy}px)`,
              ],
            },
            {
              duration: 550,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        })
        .catch(() => {})
        .finally(() => doc.classList.remove("no-anim"));

      transition.finished.finally(() => doc.classList.remove("theme-transitioning"));
    } else {
      storeTheme(next);
      applyTheme(next);
    }
  }

  /* ----------------------------------------------------------
     Navigation
  ---------------------------------------------------------- */
  function initNavbar() {
    const nav = document.getElementById("siteNav");
    if (!nav) return;

    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* Close the mobile menu after choosing a destination */
    const collapseEl = nav.querySelector(".navbar-collapse");
    if (collapseEl && window.bootstrap) {
      collapseEl.addEventListener("click", (e) => {
        if (!e.target.closest("a")) return;
        const instance =
          window.bootstrap.Collapse.getInstance(collapseEl) ||
          window.bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
        if (collapseEl.classList.contains("show")) instance.hide();
      });
    }
  }

  /* ----------------------------------------------------------
     Back to top
  ---------------------------------------------------------- */
  function initBackTop() {
    const btn = document.querySelector(".back-top");
    if (!btn) return;

    const onScroll = () => btn.classList.toggle("show", window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" })
    );
  }

  /* ----------------------------------------------------------
     Toasts
  ---------------------------------------------------------- */
  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[ch]);
  }

  function showToast(title, message) {
    if (!window.bootstrap) return;
    const region = document.getElementById("toastRegion");
    if (!region) return;

    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
      '<div class="toast-header">' +
      '<i class="bi bi-stars me-2" aria-hidden="true"></i>' +
      "<strong class=\"me-auto\">" + escapeHtml(title) + "</strong>" +
      '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
      "</div>" +
      '<div class="toast-body">' + escapeHtml(message) + "</div>";

    region.appendChild(el);
    const toast = new window.bootstrap.Toast(el, { delay: 4500 });
    toast.show();
    el.addEventListener("hidden.bs.toast", () => el.remove());
  }

  /* ----------------------------------------------------------
     Copy-to-clipboard chips
  ---------------------------------------------------------- */
  function initCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const text = btn.getAttribute("data-copy");
        try {
          await navigator.clipboard.writeText(text);
          showToast("Copied to clipboard!", `${text} is ready to paste.`);
        } catch (_err) {
          showToast("Hmm, clipboard is shy", "Copying was blocked here — feel free to select it manually.");
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Contact form (front-end validation + feedback)
  ---------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const nameInput = form.elements.name;
      const firstName = ((nameInput && nameInput.value) || "").trim().split(/\s+/)[0] || "friend";
      const btn = form.querySelector('button[type="submit"]');
      const originalHtml = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = 'Sending <span class="dots-sending" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>';

      /* Simulated delivery — see README to wire a real backend. */
      window.setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
        form.classList.remove("was-validated");
        form.reset();
        showToast("Message sent!", `Thanks, ${firstName} — I'll get back to you within a couple of days.`);
      }, 950);
    });
  }

  /* ----------------------------------------------------------
     Project filtering
  ---------------------------------------------------------- */
  function initProjectFilter() {
    const bar = document.getElementById("filterBar");
    const grid = document.getElementById("projectGrid");
    if (!bar || !grid) return;

    const cards = Array.from(grid.querySelectorAll(".project-item"));

    const applyFilter = (filter) => {
      let visibleIndex = 0;
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.remove("pop");
        if (show) {
          card.classList.remove("is-hidden");
          card.style.animationDelay = `${Math.min(visibleIndex * 65, 320)}ms`;
          void card.offsetWidth; /* restart the pop animation */
          card.classList.add("pop");
          visibleIndex += 1;
        } else {
          card.classList.add("is-hidden");
        }
      });
    };

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      bar.querySelectorAll(".filter-chip").forEach((chip) => {
        const active = chip === btn;
        chip.classList.toggle("active", active);
        chip.setAttribute("aria-pressed", String(active));
      });
      applyFilter(btn.dataset.filter);
    });
  }

  /* ----------------------------------------------------------
     Footer year
  ---------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ----------------------------------------------------------
     Boot
  ---------------------------------------------------------- */
  function init() {
    initTheme();
    initNavbar();
    initBackTop();
    initCopyButtons();
    initContactForm();
    initProjectFilter();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
