# izrah. — Personal Website

A modern, creative, semi-portfolio personal website for **Izrah Vendiola**.
Built with pure HTML5, CSS3 and vanilla JavaScript on top of Bootstrap 5 —
no frameworks, no build step, no jQuery.

## ✨ Features

- **5 pages** — Home, About, Projects, Experience & Education, Contact — sharing one
  design system, navigation, footer and theme.
- **Light & dark mode** with CSS variables, persisted in `localStorage`, falling back
  to the OS preference. Toggling uses a circular reveal via the **View Transitions API**
  (with a graceful fallback everywhere else).
- **Scroll animations** via `IntersectionObserver` — fade-up, slide-left/right, scale-in,
  staggered card groups — all gated behind `prefers-reduced-motion`.
- **Page transitions** — cross-document View Transitions where supported, quick fade-out
  fallback otherwise.
- **Creative details** — editorial typography (Space Grotesk × Instrument Serif ×
  DM Sans × JetBrains Mono), arch-shaped portrait with floating sticker chips, a
  scrolling marquee, sticky-note cards, pointer parallax decorations and a dot-grid
  texture.
- **Working interactions** — mobile navigation, project category filtering, project
  detail modals, contact form validation with toast feedback, copy-to-clipboard email
  chip, animated theme toggle, back-to-top button.
- **Responsive & accessible** — semantic HTML5, skip link, `aria-*` labels, focus
  styles, keyboard-friendly components, fluid type scale.

## 🗂 Project structure

```
personal-websites/
│
├── index.html                 # Home
├── pages/
│   ├── about.html             # About Me
│   ├── projects.html          # Projects (filters + modals)
│   ├── experience.html        # Experience & Education (timelines)
│   └── contact.html           # Contact (form + FAQ)
│
├── assets/
│   ├── css/
│   │   ├── style.css          # Design system, themes, components, animations
│   │   └── responsive.css     # Breakpoint refinements
│   ├── js/
│   │   ├── main.js            # Theme, nav, form, filters, toasts
│   │   └── animations.js      # Scroll reveals, parallax, page transitions
│   └── images/
│       ├── favicon.svg
│       ├── profile.svg        # Portrait placeholder (swap for your photo)
│       ├── projects/          # project-1.svg … project-6.svg placeholders
│       └── backgrounds/       # dot-grid.svg texture
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
| Colors, shadows, radii, motion | `assets/css/style.css` → *Design tokens* section (`:root` / `[data-theme="dark"]`) |
| Fonts | The Google Fonts `<link>` in each page's `<head>` + the `--font-*` variables |
| Theme storage key | `assets/js/main.js` → `THEME_KEY` |
| Portrait photo | Replace `assets/images/profile.svg` with your own image (any ratio ~4:5 works; arch shape comes from CSS) |
| Project thumbnails | Replace files in `assets/images/projects/` |
| Social links | Search each page for `github.com` / `linkedin.com` / `instagram.com` and point them at real profiles |
| Email address | Replace `hello@izrahvendiola.com` everywhere (it's a placeholder) |
| Page copy | Directly in each HTML file — timeline entries, project blurbs and fun facts are all **placeholder content** meant to be edited |

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
- Google Fonts — Space Grotesk, DM Sans, Instrument Serif, JetBrains Mono

## ♿ Accessibility notes

- `prefers-reduced-motion` disables reveals, marquee, parallax and the circle reveal.
- Decorative elements are `aria-hidden`; icon-only links/buttons carry `aria-label`s.
- Color contrast was checked for both themes; `color-scheme` keeps native controls themed.
- All content is reachable without JavaScript (animations simply don't run).

---

© Izrah Vendiola. Made with ♥ & vanilla everything.
