# izrah. — Personal Website

A modern, creative, semi-portfolio personal website for **Izrah Vendiola** —
a third-year student focused on graphics and photography who is also learning
front-end development (HTML, CSS, JavaScript and Bootstrap).
Built with pure HTML5, CSS3 and vanilla JavaScript on top of Bootstrap 5 —
no frameworks, no build step, no jQuery.

## ✨ Features

- **One scrolling page** — Home, About, Projects, Experience and Contact now live on
  `index.html` as stacked sections. A sticky header links straight to `#about`,
  `#projects`, `#experience` and `#contact`, with an active-section indicator.
  The old subpage URLs (`pages/about.html`, …) redirect to those anchors.
- **Light & dark mode** with CSS variables, persisted in `localStorage`, falling back
  to the OS preference. Toggling uses a circular reveal via the **View Transitions API**
  (with a graceful fallback everywhere else).
- **Scroll animations** via `IntersectionObserver` — fade-up, slide-left/right, scale-in,
  staggered card groups — all gated behind `prefers-reduced-motion`.
- **Anchor transitions** — smooth in-page jumps that stop just below the sticky header;
  cross-document View Transitions still cover the redirect stubs.
- **Creative details** — a brutalist-editorial design system adapted from the
  Finguard reference: full-bleed full-width layout, a
  consistent solid dark header bar, alternating dark/light full-bleed bands, huge
  condensed uppercase display type (Anton × DM Sans × JetBrains Mono), numbered
  feature rows with an overlapping "Currently" card, an arch portrait card,
  a numbered steps rail, flat sparkle accents, static project image tiles and a
  wine CTA band and dark footer with giant brand text. Izrah's palette throughout:
  deep wine `#5B1B32` for the CTA band, deep purple `#6B21A8` / amber `#F4C66A`
  accents on black & white — flat colors only. The portrait card is the one
  exception: a diagonal violet gradient with SVG HUD details.
- **Blueprint dot grid** — a 24px dot field with larger 96px major dots spans the
  full page, tinted purple on light surfaces and inverted to white on the dark
  header, wine CTA and footer bands. Tokens: `--grid-cell`, `--grid-dot*`.
- **Portrait card** — an arch-shaped viewfinder: a diagonal violet gradient
  (`#b45eff → #541caa`) with a soft crown glow and a faint dot grid over it.
  A 2px gold (`#f2c14e`) keyline arch sits just behind and down-right of the
  card; the cutout sits inside the arch and fades into the panel at the bottom.
  The HUD is drawn in SVG (aperture ring, thirds grid, corner brackets, REC/RAW,
  `f/1.8 · 1/250 · ISO 100` readout) alongside a pen-tool bezier. On load the
  frame and overlays fade in, the photo rises 60px, the pen draws itself and REC
  blinks; everything is skipped for `prefers-reduced-motion`. Width is a
  `clamp(230px, 26vw, 315px)` with a fixed `aspect-ratio`, so it scales cleanly
  at every breakpoint. Both the Home and About instances animate independently.
- **Working interactions** — mobile navigation, project category filtering, project
  detail modals, contact form validation with toast feedback, copy-to-clipboard email
  chip, animated theme toggle, back-to-top button.
- **Responsive & accessible** — semantic HTML5, skip link, `aria-*` labels, focus
  styles, keyboard-friendly components, fluid type scale.

## 🗂 Project structure

```
personal-websites/
│
├── index.html                 # The whole site — one scrolling page
├── pages/                     # Legacy URLs → redirect to index.html#<section>
│   ├── about.html             #   → #about
│   ├── projects.html          #   → #projects
│   ├── experience.html        #   → #experience
│   └── contact.html           #   → #contact
│
├── assets/
│   ├── css/
│   │   ├── style.css          # Design system, themes, components, animations
│   │   └── responsive.css     # Breakpoint refinements
│   ├── js/
│   │   ├── main.js            # Theme, sticky nav + scroll spy, form, filters, toasts
│   │   └── animations.js      # Scroll reveals, hero cards, parallax, page transitions
│   └── images/
│       ├── favicon.svg
│       ├── profile-cutout.webp # Portrait cutout (transparent background)
│       └── projects/          # project-1.svg … project-6.svg placeholders
│
└── README.md
```

## 🚀 Running it

No build step required. Either:

- **Open directly** — double-click `index.html`, or
- **Serve locally** (recommended, enables clipboard API etc.):

  ```bash
  # from the project root
  python -m http.server 8080
  # then visit http://localhost:8080
  ```

## 🎨 Customizing

| What | Where |
|------|-------|
| Colors (deep wine band, purple / amber accents), radii, motion | `assets/css/style.css` → *Design tokens* section (`:root` / `[data-theme="dark"]`) |
| Fonts | The Google Fonts `<link>` in `index.html`'s `<head>` + the `--font-*` variables |
| Theme storage key | `assets/js/main.js` → `THEME_KEY` |
| Portrait cutout | Replace `assets/images/profile-cutout.webp` with your own transparent PNG/WebP (the layout scales it by height and drops the shadow automatically). If you swap in a new background-removed PNG, trim it to the alpha bounding box and re-pad it so the subject stays centred inside the arch |
| Project thumbnails | Replace files in `assets/images/projects/` |
| Social links | Search `index.html` for `github.com` / `linkedin.com` / `instagram.com` and point them at real profiles |
| Email address | Replace `hello@izrahvendiola.com` everywhere (it's a placeholder) |
| Page copy | Directly in `index.html` — timeline entries, project blurbs and fun facts are all **placeholder content** meant to be edited |

### Hooking up the contact form

`assets/js/main.js` currently simulates a successful send (validation + toast work;
nothing is transmitted). To make it real, point the submit handler at a form service
such as [Formspree](https://formspree.io/) or your own backend:

```js
// inside initContactForm(), after validation passes:
await fetch("https://formspree.io/f/yourFormId", {
  method: "POST",
  body: new FormData(form),
  headers: { Accept: "application/json" },
});
```

## 🧰 Tech stack

- HTML5, CSS3, vanilla JavaScript (ES2017+, no dependencies)
- [Bootstrap 5.3](https://getbootstrap.com/) — grid, collapse, modal, accordion, toast
- [Bootstrap Icons](https://icons.getbootstrap.com/) 1.11
- Google Fonts — Anton, DM Sans, JetBrains Mono

## ♿ Accessibility notes

- `prefers-reduced-motion` disables reveals, floating sparkles and the circle reveal.
- Decorative elements are `aria-hidden`; icon-only links/buttons carry `aria-label`s.
- Color contrast was checked for both themes; `color-scheme` keeps native controls themed.
- All content is reachable without JavaScript (animations simply don't run).

---

© Izrah Vendiola. Made with ♥ & vanilla everything.
