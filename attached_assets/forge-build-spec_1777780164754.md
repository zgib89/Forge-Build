# FORGE — Build Spec for Replit Agent

**Product name (working):** Forge
**Tagline:** Generate a real, deployable portfolio in 90 seconds. Astro 6, Cloudflare Workers, your aesthetic.
**Hosted at:** `forge.zacgibson.work`
**Built by:** Zac Gibson — single-dad builder, IAM engineer, brand owner of zacgibson.work / RighteousRecon / WESTFALL / JotterDown.
**Spec version:** 1.0 — May 2, 2026

---

## How to use this document

Paste this entire file into Replit Agent as the project brief. The Agent should treat every section as a hard requirement unless explicitly marked **OPTIONAL**.

A companion document — **`astro-6-pattern-library.md`** — must be uploaded to the Replit project as a reference. The generator's output templates inherit directly from that library. Do not re-derive Astro 6 patterns; reference the library.

---

## 1. Product overview

### 1.1 What Forge does

Forge is a free web app that generates production-ready personal portfolio websites. A visitor:

1. Lands on `forge.zacgibson.work`.
2. Walks through a 5-step wizard (identity → preset → palette → sections → projects).
3. Sees a live preview rendered in an embedded iframe as they make choices.
4. Optionally provides email to receive the export + Cloudflare deploy guide.
5. Downloads a zip containing a complete Astro 6.1.x project, pinned versions, plus a `DEPLOY.md` with copy-paste commands for Cloudflare Workers deployment to a custom domain.

### 1.2 Why this exists

Forge is a brand-asset and lead-magnet for `zacgibson.work`. It demonstrates Zac's actual technical chops (Astro 6 mastery, design systems, full-stack), drives traffic to his portfolio, and builds an email list of people who care about ownership-grade personal sites — a population overlapping with the IAM/defense audience and the indie-hacker audience he's building toward.

The output quality bar is **high enough that Zac would deploy any of these presets for himself.** No exceptions. Forge represents his taste publicly.

### 1.3 What Forge is NOT

- Not a website builder with a visual canvas (no Webflow/Framer-style drag-drop).
- Not a hosted-site product (no SaaS subscription, no "claim your subdomain on forge.zacgibson.work/yourname"). The user owns the code, deploys it themselves.
- Not a clone of Lovable/Bolt/v0. Those are AI-prompt-to-app generic builders. Forge is opinionated, presets-only, ships real Astro 6 code with locked patterns.
- Not a place to learn web dev. Generated code is production-quality, not tutorial-quality.

---

## 2. Tech stack — pinned versions

These versions are locked as of May 2026. Replit Agent must not substitute alternatives without explicit approval.

### 2.1 Generator app (the Forge tool itself)

| Tool | Pin | Notes |
|---|---|---|
| Next.js | `^15.0.0` | App Router only. No Pages Router code. |
| React | `^19.0.0` | |
| TypeScript | `^5.5.0` | Strict mode. No `any` outside type assertion lines. |
| Tailwind CSS | `^4.0.0` | Vite plugin path, not PostCSS. |
| shadcn/ui | latest | Sera preset. |
| Framer Motion | `^12.0.0` | For UI motion in the generator. |
| Motion One | latest | For SVG path animations. |
| Lenis | `^1.1.0` | Smooth scrolling on the marketing surface (not the wizard). |
| JSZip | `^3.10.0` | Server-side zip building. |
| Zod | `^4.0.0` | Form schema + server validation. |
| react-hook-form | `^7.x` | Wizard state. |
| Lucide React | latest | Icons only. |
| Resend | `^4.0.0` | Email-the-zip handler. |
| Plausible | (script) | Analytics, no cookies. |
| Node | `>=22.0.0` | |
| pnpm | `^9.0.0` | Package manager. |

### 2.2 Generated portfolio output (what the zip contains)

| Tool | Pin |
|---|---|
| Astro | `^6.1.9` |
| `@astrojs/cloudflare` | `^13.0.0` |
| `@astrojs/react` | latest 6-compat |
| `@astrojs/mdx` | latest 6-compat |
| `@astrojs/sitemap` | latest 6-compat |
| `@tailwindcss/vite` | `^4.0.0` |
| `tailwindcss` | `^4.0.0` |
| `tw-animate-css` | latest |
| React | `^19.0.0` |

These match the Astro 6 Pattern Library exactly. Do not drift.

---

## 3. File structure — generator app

```
forge/
├── public/
│   ├── favicon.svg
│   ├── og-default.png
│   └── presets/                     # Static thumbnails of each preset
│       ├── editorial.png
│       ├── minimalist.png
│       ├── brutalist.png
│       ├── aurora.png
│       └── botanical.png
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with Plausible
│   │   ├── page.tsx                 # Marketing landing
│   │   ├── globals.css              # Tailwind v4 + tokens
│   │   ├── forge/                   # The wizard route
│   │   │   ├── page.tsx
│   │   │   ├── components/
│   │   │   │   ├── WizardShell.tsx
│   │   │   │   ├── StepIdentity.tsx
│   │   │   │   ├── StepPreset.tsx
│   │   │   │   ├── StepPalette.tsx
│   │   │   │   ├── StepSections.tsx
│   │   │   │   ├── StepProjects.tsx
│   │   │   │   ├── PreviewFrame.tsx
│   │   │   │   ├── PaletteSwatch.tsx
│   │   │   │   ├── PresetCard.tsx
│   │   │   │   └── ProjectForm.tsx
│   │   │   └── store.ts             # Zustand store for wizard state
│   │   ├── export/
│   │   │   └── route.ts             # POST → returns zip Blob
│   │   ├── preview/
│   │   │   └── route.ts             # Renders preview HTML
│   │   ├── email/
│   │   │   └── route.ts             # POST → sends zip via Resend
│   │   └── api/
│   │       └── og/
│   │           └── route.ts         # Dynamic OG image for marketing
│   ├── components/
│   │   ├── ui/                      # shadcn Sera components
│   │   ├── marketing/
│   │   │   ├── Hero.tsx
│   │   │   ├── PresetShowcase.tsx
│   │   │   ├── FeatureGrid.tsx
│   │   │   ├── DemoVideo.tsx
│   │   │   └── Footer.tsx
│   │   ├── motion/
│   │   │   ├── AuroraBackground.tsx # WebGL gradient mesh
│   │   │   ├── MagneticButton.tsx
│   │   │   ├── KineticHeadline.tsx
│   │   │   ├── SpotlightCursor.tsx
│   │   │   └── ScrambleText.tsx
│   │   └── shared/
│   │       ├── CodeBlock.tsx        # Copy-able code box
│   │       └── EmailGate.tsx
│   ├── lib/
│   │   ├── utils.ts                 # cn() helper
│   │   ├── presets.ts               # Preset definitions
│   │   ├── palettes.ts              # Curated color palettes
│   │   ├── schemas.ts               # Zod schemas
│   │   ├── zip-builder.ts           # Core zip generation logic
│   │   ├── template-engine.ts       # Token substitution
│   │   └── analytics.ts             # Plausible event helpers
│   └── templates/                   # Source-of-truth template files
│       ├── _shared/                 # Files shared across all presets
│       │   ├── package.json.tmpl
│       │   ├── astro.config.ts.tmpl
│       │   ├── tsconfig.json.tmpl
│       │   ├── biome.jsonc.tmpl
│       │   ├── wrangler.jsonc.tmpl
│       │   ├── .gitignore
│       │   ├── .assetsignore
│       │   ├── DEPLOY.md.tmpl
│       │   └── README.md.tmpl
│       ├── editorial/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── layouts/
│       │   ├── styles/
│       │   └── content/
│       ├── minimalist/
│       ├── brutalist/
│       ├── aurora/
│       └── botanical/
├── package.json
├── tsconfig.json
├── tailwind.config.css              # Tailwind v4 config-as-CSS
├── next.config.ts
├── biome.jsonc
├── README.md
└── pnpm-lock.yaml
```

### 3.1 Why Zustand for wizard state

The wizard has deep state (5 steps, ~30 fields, derived preview state). React Hook Form alone is awkward across step boundaries. Zustand + RHF per-step is clean: form state lives in Zustand, each step uses RHF for its slice and writes back on `onChange`.

### 3.2 Why templates as real files (not strings in code)

Reading template files at request-time keeps the generator code clean and the templates themselves editable, lintable, and testable as real Astro projects. Add `.tmpl` extension to anything with substitution tokens so they don't break Astro's build if Replit accidentally tries to dev-serve them.

---

## 4. UI/UX flow

### 4.1 Marketing landing — `/`

**Above the fold:**

- **Hero:** Animated kinetic typography. Phrase rotates: "Build your portfolio." → "Build your reputation." → "Build your leverage." → "Build it once, ship it forever." Each rotation uses a smooth character-by-character reveal (Motion One stagger, ~30ms per char, 3s hold, fade transition).
- **Aurora background:** Subtle WebGL gradient mesh — 3 blobs in OKLCH stone+teal, very low opacity, animated noise displacement. Disabled on `prefers-reduced-motion` and on viewports under 768px.
- **CTA:** Single primary button — "Open the Forge →". Magnetic effect on hover (cursor pulls the button ~6px toward it within a 60px radius).
- **Subhead:** "A free portfolio generator built by Zac Gibson. Astro 6, Cloudflare Workers, deployed in five minutes. Yours forever."
- **Trust line:** "No login. No subscription. No vendor lock-in. You get the code."

**Mid-page:**

- **5 preset showcase grid.** Bento layout. Each preset card is a 16:10 mock browser window with a live mini-preview rendered in an iframe (sandboxed, throttled). Hover state: card lifts, preview animates a scroll-down sequence over 1.5s, accent border glow.
- **"What's inside" section:** 6-up grid of features:
  1. Astro 6 + Cloudflare Workers — "your site costs zero dollars to host"
  2. Tailwind v4 + OKLCH tokens — "perceptually uniform color, dark mode for free"
  3. Native View Transitions — "no SPA tax, browser-native transitions"
  4. Content Collections — "Markdown projects, Zod-validated frontmatter"
  5. Dynamic OG images — "every page generates its own social card"
  6. Lighthouse 100 by default — "you didn't have to earn it; it's how Forge ships"
- **Live demo video:** 30-second screen recording of a full wizard run. Autoplaying, muted, looped. Hosted as a `<video>` with `poster` and `preload="metadata"`.

**Footer:**

- **About row:** "Forge is built by Zac Gibson — an IAM engineer in Tennessee shipping the tools he needs. See more at zacgibson.work, RighteousRecon.com."
- **Tools row:** Links to JotterDown, RighteousRecon, the WESTFALL announcement when relevant.
- **Built-with row:** Astro 6 / Cloudflare / shadcn Sera / Tailwind v4 attribution.

### 4.2 The wizard — `/forge`

**Layout:** Two-pane on desktop (≥1024px), tabs on mobile.

- **Left pane (40%):** Wizard steps. Sticky progress indicator at top. Step content animates in with `framer-motion`'s `AnimatePresence`, slide+fade, 200ms.
- **Right pane (60%):** Live preview iframe. Updates within 300ms of any input change (debounced). The iframe itself is the `/preview` route rendered with current wizard state passed as encoded URL params or via `postMessage`.

**Step 1 — Identity:**
- Full name (required, 2–60 chars)
- Role (required, e.g. "IAM Engineer", "Designer", "Writer")
- Tagline (optional, 0–120 chars, shown under the name in hero)
- Location (optional, e.g. "Murfreesboro, TN")
- Profile photo (optional, drag-drop or paste, gets stored as base64 in state, processed to 800x800 webp on export)

**Step 2 — Preset:**
- 5 cards. Click to select. Each card shows a mini-preview animation on hover.
- Brief description under each: who it's for, what it conveys.

**Step 3 — Palette:**
- 6 curated palettes per preset (each preset has its own palettes — Editorial uses warm/serif-friendly, Brutalist uses high-contrast, etc.).
- Plus a custom palette mode: 3 OKLCH sliders (background, surface, accent). Live preview reflects every change.
- "Dark mode default" toggle.

**Step 4 — Sections:**
- Checklist of available sections per preset:
  - Hero (always on, can't disable)
  - Projects (recommended, can disable)
  - Writing/Notes (toggle)
  - About (toggle)
  - Contact (toggle)
  - Now page (toggle)
  - Uses page (toggle)
- Footer style: Minimal / Editorial / Brutalist matrix / etc. (preset-dependent)
- Optional GitHub feed via Server Island (toggle, takes username)

**Step 5 — Projects:**
- Add 0–8 projects.
- Each project: title (required), summary (required, 0–160 chars), stack (chip input, comma-separated tags), role (optional), date (optional), live URL (optional), repo URL (optional), cover image (optional drag-drop).
- Reorderable via drag handle.
- "Skip this for now — I'll add them in markdown later" button.

**Step 6 — Export:**
- Custom domain field: defaults to `[firstname-lowercase].work`. User can edit to anything.
- Email gate (OPTIONAL but recommended):
  - Headline: "Email yourself the export?"
  - Body: "We'll send the zip plus a 5-minute Cloudflare deploy guide. We don't sell email addresses, ever. Skip if you'd rather just download."
  - Two buttons: "Email + Download" and "Just Download".
- "Generate" button — primary, magnetic, with subtle shimmer on hover.
- Click triggers POST to `/export/route.ts`, returns a Blob, browser downloads `[firstname]-portfolio.zip`.

### 4.3 Post-export screen

After successful generation:

- Confetti animation (Motion One particle burst, 1.2s, respects `prefers-reduced-motion`).
- "Your portfolio is downloaded. Here's what to do next."
- Three large cards:
  1. **Unzip & install** — copy-code box: `cd ~/Downloads && unzip yourname-portfolio.zip && cd portfolio && pnpm install`
  2. **Run locally** — copy-code box: `pnpm dev` → "Visit http://localhost:4321"
  3. **Deploy to Cloudflare** — copy-code box with full deploy command sequence. Link to expanded `DEPLOY.md` walkthrough.
- "Need help?" footer linking to a YouTube walkthrough video (Zac records once, 8-min, evergreen).

---

## 5. Visual design system — the generator app

### 5.1 Color tokens

```css
/* src/app/globals.css */
@import 'tailwindcss';

@theme {
  /* Forge brand — distinct from any preset, so the tool itself has identity */
  --color-bg:        oklch(0.98 0.005 85);
  --color-surface:   oklch(0.96 0.008 85);
  --color-border:    oklch(0.90 0.012 80);
  --color-text:      oklch(0.18 0.010 70);
  --color-text-mute: oklch(0.42 0.014 75);

  --color-accent:    oklch(0.55 0.18 245); /* electric indigo — Forge's identity */
  --color-accent-hi: oklch(0.42 0.18 245);

  --color-success:   oklch(0.65 0.15 145);
  --color-warn:      oklch(0.72 0.15 70);
  --color-danger:    oklch(0.55 0.20 25);

  /* Typography */
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, monospace;

  --radius: 0.5rem;
  --radius-lg: 0.75rem;
}

@layer base {
  [data-theme='dark'] {
    --color-bg:        oklch(0.14 0.010 70);
    --color-surface:   oklch(0.18 0.012 70);
    --color-border:    oklch(0.28 0.012 70);
    --color-text:      oklch(0.96 0.005 85);
    --color-text-mute: oklch(0.72 0.014 75);
    --color-accent:    oklch(0.72 0.15 245);
  }
}

@view-transition { navigation: auto; }
```

### 5.2 Typography rules

- Headlines use Instrument Serif. `font-weight: 400` everywhere; weight is conveyed by size.
- Body uses Inter, `font-weight: 400` body / `500` emphasis / `600` UI labels.
- Monospace for code, technical input fields, and trust-signal data ("100/100 Lighthouse", "0 dependencies bloated").
- Headlines use `text-wrap: balance`. Body uses `text-wrap: pretty`.
- Line heights: 1.05 for display, 1.4 for short body, 1.6 for long-form.
- Tracking: -0.02em on display, normal on body, +0.06em uppercase eyebrows.

### 5.3 Motion language

Motion in Forge follows three rules:

1. **Purposeful, not decorative.** Every animation either reveals state (step transition) or directs attention (CTA, success).
2. **300ms feels right.** Default duration. Use `cubic-bezier(0.16, 1, 0.3, 1)` (smooth out-quart) for entrances, `cubic-bezier(0.7, 0, 0.84, 0)` (in-quart) for exits.
3. **Reduced motion is a hard constraint.** Every animation must have a `prefers-reduced-motion: reduce` fallback that either disables or replaces with a 60ms opacity-only crossfade.

### 5.4 Sound (OPTIONAL — Phase 2)

Subtle UI sounds via Tone.js, opt-in via toggle in footer ("Sound: Off / On"). Sounds:

- Step transition: low-frequency soft tap, 50ms.
- Successful generation: ascending three-note arpeggio, 600ms, gentle.
- Error: single descending tone, 200ms.

If implementing Phase 1, skip sound entirely. It's not worth shipping if not exceptional.

### 5.5 Layout system

- Marketing surface: 12-column grid, 1280px max width, 24px gutter. Container queries for component-level responsiveness.
- Wizard surface: 2-pane split-flex, 40/60 ratio above 1024px, stacked tabs below.
- Section vertical rhythm: 96px between major sections on marketing, 48px between wizard groups.

---

## 6. The 5 portfolio presets

Each preset is a complete visual identity. Generated portfolios for any preset must look intentional and earned, never templated.

### 6.1 Preset A — Editorial

**Pitch:** Print-magazine inspired. Serif headlines, square corners, uppercase metadata, generous whitespace. The portfolio you'd see if a New York Times feature designer freelanced for a software engineer.

**Use case:** Writers, IAM engineers, consultants, anyone who wants gravitas.

**Typography:** Instrument Serif (display), Inter (body), JetBrains Mono (code).

**Color tokens (default palette):**
```
--color-bg:      oklch(0.98 0.005 85)   /* warm stone 50 */
--color-surface: oklch(0.96 0.008 85)
--color-border:  oklch(0.90 0.012 80)
--color-text:    oklch(0.18 0.010 70)
--color-mute:    oklch(0.42 0.014 75)
--color-accent:  oklch(0.48 0.10 195)   /* surgical teal */
```

**Hero:** Large display headline with `text-wrap: balance`. Eyebrow in uppercase teal. Subhead in mute. No image — just typography. Optional kicker chip at top: "Currently: [role]".

**Layout:** Single-column flow on the homepage. 720px max content width. Asymmetric breakouts for project cards (full-bleed at 1024px+).

**Project cards:** Editorial style. Title in serif, summary in body, stack chips below, metadata row (date, role, link icon). Hover: card lifts 4px, accent left-border slides in.

**Notes/Writing index:** Dated list, no thumbnails. Author signature mark at top.

**Distinctive touches:**
- Drop caps on the about page (CSS `:first-letter`).
- Footnote-style internal links (`<sup>` numerals that reveal context on hover).
- Page numbers in the footer ("Page 02 of 04" — actually computed from collection length).

**Inherits directly from:** Astro 6 Pattern Library §7.2 (Hero), §7.3 (Sticky Rail), §7.7 (Tag chip), §7.4 (ScreenshotFrame).

**6 palette variants:**
1. **Stone + Teal** (default) — warm neutrals, surgical teal accent.
2. **Ivory + Oxblood** — cream background, deep oxblood accent for editorial gravitas.
3. **Charcoal + Brass** — dark mode native, near-black with warm brass accent.
4. **Newsprint + Indigo** — high-warmth ivory, indigo accent, faint paper texture.
5. **Bone + Forest** — bone white, deep forest green accent.
6. **Slate + Coral** — cool slate, vivid coral accent for younger feel.

### 6.2 Preset B — Minimalist

**Pitch:** What the homepage of a senior staff engineer at Vercel might look like. JetBrains Mono everywhere. No decoration. Maximum information density without clutter.

**Use case:** Developers, infrastructure engineers, security specialists, anyone whose work speaks for itself and doesn't need design to vouch for it.

**Typography:** JetBrains Mono everywhere. Single font, three sizes. That's the look.

**Color tokens (default):**
```
--color-bg:      oklch(0.99 0 0)
--color-surface: oklch(0.99 0 0)
--color-border:  oklch(0.88 0 0)
--color-text:    oklch(0.18 0 0)
--color-mute:    oklch(0.55 0 0)
--color-accent:  oklch(0.55 0.20 145)   /* terminal green */
```

**Hero:** ASCII-style header line ("==[ name ]==="). Two-line bio. Three inline links. That's the entire hero.

**Layout:** 640px max width, single column, fixed at left margin (no centering). Reads like a `cat name.txt` output.

**Project list:** Plain text list with year prefix. `2026 → project name :: one-line summary [link]`.

**Notes:** Same format. Plain, dated, monospace.

**Distinctive touches:**
- Cursor blink on the headline.
- Color flash on link hover (terminal-green).
- ASCII dividers between sections (`---`).
- Footer has uptime/build-time stamp.

**6 palette variants:**
1. **Mono + Terminal Green** (default) — pure white, terminal green accent.
2. **Mono + Amber** — phosphor-amber accent (CRT terminal vibe).
3. **Mono + Magenta** — bold magenta on white, code-conscious.
4. **Carbon + Cyan** — dark mode default, electric cyan accent.
5. **Solarized Light** — solarized palette, full set.
6. **Solarized Dark** — solarized dark, full set.

### 6.3 Preset C — Brutalist

**Pitch:** Swiss-grid concrete. Helvetica/Inter, no rounded corners anywhere, hard borders, primary colors used surgically. The website equivalent of a Massimo Vignelli book cover.

**Use case:** Designers, art directors, creative directors, anyone whose work IS the visual.

**Typography:** Inter Tight (display), Inter (body), JetBrains Mono (code).

**Color tokens (default):**
```
--color-bg:      oklch(1 0 0)           /* pure white */
--color-surface: oklch(0.95 0 0)
--color-border:  oklch(0.18 0 0)        /* near-black borders */
--color-text:    oklch(0.18 0 0)
--color-mute:    oklch(0.55 0 0)
--color-accent:  oklch(0.55 0.30 25)    /* vermillion red */
```

**Hero:** Massive name, set in 144px display weight, hard left-aligned, no ornament. Role below in 24px regular, with uppercase tracking. Three-up numbered list of "what I do" — each numbered, hard-bordered.

**Layout:** Hard 12-column grid. Visible grid hints in background (1px hairlines). Asymmetric blocks. Black 2px borders everywhere; no rounded corners.

**Project cards:** Photo + title + index number. Hover: photo desaturates and shifts 4px diagonally, hard border replaces with red accent border.

**Distinctive touches:**
- Visible grid system on hover (toggle key: `g`).
- Numbered everything. "Project 01 / 06."
- Black underline on links, replaced with red on hover.
- Footer: massive page index ("0/4") in 200px display weight.

**6 palette variants:**
1. **White + Vermillion** (default) — pure white, vermillion red accent, black borders.
2. **Black + Vermillion** — pure black BG, vermillion accent.
3. **White + Cobalt** — pure white, cobalt blue accent.
4. **Cream + Terracotta** — warm cream BG, terracotta accent (less aggressive).
5. **White + Highlighter Yellow** — neon yellow accent, very loud.
6. **Black + White only** — no accent color at all, pure typography.

### 6.4 Preset D — Aurora

**Pitch:** WebGL-driven, color-saturated, motion-rich. Aurora gradient mesh hero, 3D card hovers, particle effects. The "wow factor" preset for portfolios where the visual is the point.

**Use case:** Frontend engineers, motion designers, creative technologists, anyone who needs to immediately demonstrate visual taste.

**Typography:** Inter Display (Variable, weight 100–900), Inter (body), JetBrains Mono (code).

**Color tokens (default):**
```
--color-bg:      oklch(0.10 0.020 280)   /* deep cosmic */
--color-surface: oklch(0.14 0.025 280)
--color-border:  oklch(0.30 0.040 280)
--color-text:    oklch(0.96 0.005 85)
--color-mute:    oklch(0.72 0.014 75)
--color-accent:  oklch(0.65 0.25 295)    /* aurora purple */
--color-accent-2: oklch(0.70 0.20 195)   /* aurora teal */
--color-accent-3: oklch(0.65 0.25 25)    /* aurora coral */
```

**Hero:** WebGL aurora mesh occupying full viewport. Three points of color (from accent tokens) animated with simplex noise displacement, very slow (~40s loop). Headline overlaid with `mix-blend-mode: difference` — automatically legible against any aurora state.

**Layout:** Bento grid for projects (Pattern Library §7.1). Cards have 3D tilt on hover via `transform-style: preserve-3d` with CSS variables tied to `mousemove` events. Subtle parallax on scroll using CSS `animation-timeline: scroll()`.

**Project cards:** Cover image with custom cursor (replaces system cursor with a `view project →` pill). Hover: card tilts up to 8° on each axis based on cursor position. Inner image scales 1.05.

**Distinctive touches:**
- Custom cursor on `[data-cursor]` elements.
- Spotlight effect — radial gradient that follows cursor on the about/contact pages.
- Scroll-triggered character reveals on long-form text.
- Page transitions animate via View Transitions with shared element morphs (project cover → project hero).

**6 palette variants:**
1. **Cosmic Aurora** (default) — deep purple/teal/coral.
2. **Sunset Aurora** — warm orange/pink/amber on charcoal.
3. **Ocean Aurora** — teal/cyan/electric-blue on deep navy.
4. **Forest Aurora** — emerald/lime/gold on near-black.
5. **Rose Aurora** — pink/coral/magenta on plum.
6. **Mono Aurora** — grayscale aurora, white only on black, very minimal.

**Performance note:** WebGL must be disabled below 768px width and on `prefers-reduced-motion`. Fall back to a static gradient mesh exported as a 1x WebP at build time.

### 6.5 Preset E — Botanical

**Pitch:** Garden-tended personal site. Hand-drawn SVG illustrations, organic shapes, warm greens/creams, irregular borders. Less "designer" more "person who makes things." Reads as authentic and approachable.

**Use case:** Writers, indie hackers, hobbyist developers, people building "in public" who want warmth not authority.

**Typography:** Fraunces (display, with optical-sizing axis), Inter (body), JetBrains Mono (code).

**Color tokens (default):**
```
--color-bg:      oklch(0.96 0.018 95)    /* warm cream */
--color-surface: oklch(0.93 0.022 95)
--color-border:  oklch(0.78 0.030 110)   /* faded sage */
--color-text:    oklch(0.22 0.025 110)   /* near-black with green warmth */
--color-mute:    oklch(0.45 0.030 110)
--color-accent:  oklch(0.50 0.12 145)    /* deep botanical green */
--color-accent-2: oklch(0.65 0.18 70)    /* warm ochre */
```

**Hero:** Large Fraunces headline with handwritten SVG underline (slight wobble path) animated to draw on load (Motion One stroke-dashoffset, 1.2s). Small SVG botanical illustration in the corner — fern frond, simple ink line, hand-drawn feel.

**Layout:** Single-column, 680px max. Sections separated by botanical SVG dividers (different leaf/branch each section). Irregular polaroid-style project cards rotated 1–2° randomly.

**Project cards:** Polaroid frame with handwritten-style date below. Hover: card straightens to 0° rotation, lifts.

**Notes:** Garden journal style. Each note has a small SVG icon (sprout, sun, leaf, mushroom) chosen by tag.

**Distinctive touches:**
- SVG underlines on every link, drawn-on with sketchy stroke.
- "Currently growing" section instead of "Now."
- Footer has hand-drawn signature SVG.
- Small SVG illustrations in the page margins (not too much — three or four per page max).

**6 palette variants:**
1. **Sage + Ochre** (default).
2. **Moss + Plum** — deeper greens, plum accents.
3. **Honey + Cream** — yellow/gold dominant on cream.
4. **Lavender + Sage** — soft purple and green, very gentle.
5. **Rust + Cream** — warm orange-rust on cream, autumnal.
6. **Sea Glass + Sand** — pale blue-green and sand, coastal.

---

## 7. Zip generation pipeline

### 7.1 The flow

```
User clicks Generate
   ↓
POST /export with WizardState (Zod-validated)
   ↓
Server: zip-builder.ts
   ↓
1. Load template files for chosen preset (fs.readFile from /src/templates/{preset}/)
2. Run template-engine.ts substitution on .tmpl files
3. Process user-uploaded images (sharp resize → webp 80 quality)
4. Generate dynamic README.md and DEPLOY.md from templates
5. Build zip in memory with JSZip
6. Return Response with Blob, Content-Type: application/zip
   ↓
Client receives Blob → triggers download
```

### 7.2 The Zod schema (canonical)

```ts
// src/lib/schemas.ts
import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(80),
  summary: z.string().min(1).max(160),
  stack: z.array(z.string()).default([]),
  role: z.string().max(60).optional(),
  date: z.string().optional(),
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().optional(), // base64 data URL
});

export const PaletteSchema = z.object({
  bg: z.string(),
  surface: z.string(),
  border: z.string(),
  text: z.string(),
  mute: z.string(),
  accent: z.string(),
  accent2: z.string().optional(),
});

export const WizardStateSchema = z.object({
  // Identity
  name: z.string().min(2).max(60),
  role: z.string().min(1).max(60),
  tagline: z.string().max(120).optional(),
  location: z.string().max(60).optional(),
  profilePhoto: z.string().optional(),

  // Preset & palette
  preset: z.enum(['editorial', 'minimalist', 'brutalist', 'aurora', 'botanical']),
  palette: PaletteSchema,
  paletteName: z.string(),
  darkMode: z.boolean().default(false),

  // Sections
  sections: z.object({
    projects: z.boolean().default(true),
    writing: z.boolean().default(false),
    about: z.boolean().default(true),
    contact: z.boolean().default(true),
    now: z.boolean().default(false),
    uses: z.boolean().default(false),
  }),
  githubUsername: z.string().optional(),
  footerStyle: z.string().default('minimal'),

  // Projects
  projects: z.array(ProjectSchema).max(8),

  // Export
  domain: z.string().min(3).max(80),
  email: z.string().email().optional(),
});

export type WizardState = z.infer<typeof WizardStateSchema>;
```

### 7.3 zip-builder.ts (core)

```ts
// src/lib/zip-builder.ts
import JSZip from 'jszip';
import { readFile } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { WizardState } from './schemas';
import { renderTemplate } from './template-engine';

const TEMPLATES_ROOT = path.join(process.cwd(), 'src/templates');

export async function buildPortfolioZip(state: WizardState): Promise<Buffer> {
  const zip = new JSZip();

  // 1. Load shared files
  await addTemplateDirectory(zip, '_shared', '', state);

  // 2. Load preset-specific files
  await addTemplateDirectory(zip, state.preset, '', state);

  // 3. Process user images
  if (state.profilePhoto) {
    const buf = dataUrlToBuffer(state.profilePhoto);
    const optimized = await sharp(buf)
      .resize(800, 800, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();
    zip.file('src/assets/images/profile.webp', optimized);
  }

  for (const [i, project] of state.projects.entries()) {
    if (project.coverImage) {
      const buf = dataUrlToBuffer(project.coverImage);
      const optimized = await sharp(buf)
        .resize(1600, 900, { fit: 'cover' })
        .webp({ quality: 85 })
        .toBuffer();
      zip.file(`src/assets/images/projects/${project.id}.webp`, optimized);
    }

    // Generate the markdown file for each project
    const projectMd = await renderTemplate(
      path.join(TEMPLATES_ROOT, state.preset, 'content/projects/_template.md.tmpl'),
      { project, state, hasImage: !!project.coverImage, index: i }
    );
    zip.file(`src/content/projects/${project.id}.md`, projectMd);
  }

  // 4. Render dynamic README and DEPLOY
  const readme = await renderTemplate(
    path.join(TEMPLATES_ROOT, '_shared/README.md.tmpl'),
    { state }
  );
  zip.file('README.md', readme);

  const deployMd = await renderTemplate(
    path.join(TEMPLATES_ROOT, '_shared/DEPLOY.md.tmpl'),
    { state }
  );
  zip.file('DEPLOY.md', deployMd);

  // 5. Generate zip buffer
  return zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

async function addTemplateDirectory(
  zip: JSZip,
  templateDir: string,
  zipPath: string,
  state: WizardState
) {
  // Walk the directory recursively, render .tmpl files, copy non-template files as-is
  // Implementation: use fs.readdir with { recursive: true, withFileTypes: true }
  // ... (see full implementation below)
}

function dataUrlToBuffer(dataUrl: string): Buffer {
  const base64 = dataUrl.split(',')[1];
  return Buffer.from(base64, 'base64');
}
```

### 7.4 template-engine.ts

Use a deterministic template engine with Handlebars-like syntax. Don't write your own — use Handlebars or Eta.

```ts
// src/lib/template-engine.ts
import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';

// Register helpers
Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('ifSection', function(this: any, section: string, options: any) {
  return this.state.sections[section] ? options.fn(this) : options.inverse(this);
});

export async function renderTemplate(filepath: string, context: any): Promise<string> {
  const source = await readFile(filepath, 'utf-8');
  const template = Handlebars.compile(source);
  return template(context);
}
```

### 7.5 The export route

```ts
// src/app/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WizardStateSchema } from '@/lib/schemas';
import { buildPortfolioZip } from '@/lib/zip-builder';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = WizardStateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const zip = await buildPortfolioZip(parsed.data);
    const filename = `${parsed.data.name.toLowerCase().replace(/\s+/g, '-')}-portfolio.zip`;

    return new NextResponse(zip, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': zip.length.toString(),
      },
    });
  } catch (err) {
    console.error('Export failed', err);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
```

---

## 8. Generated `DEPLOY.md` template

This is what the user sees after unzipping. Every block must be copy-paste correct.

```markdown
# Deploy your portfolio to Cloudflare Workers

This guide takes you from zip → live site at `https://{{state.domain}}` in about 5 minutes.

## Prerequisites

- A Cloudflare account (free tier works) — sign up at https://dash.cloudflare.com/sign-up
- Node.js 22+ installed — https://nodejs.org
- pnpm installed — `npm install -g pnpm`
- A custom domain (optional — you can deploy to a `.workers.dev` URL first)

## Step 1 — Install dependencies

```bash
cd portfolio
pnpm install
```

## Step 2 — Run locally

```bash
pnpm dev
```

Visit http://localhost:4321. Edit content in `src/content/` and pages in `src/pages/` — changes hot-reload.

## Step 3 — Sign in to Cloudflare via Wrangler

```bash
pnpm dlx wrangler login
```

A browser window opens. Authorize Wrangler to access your Cloudflare account. Close the window when done.

## Step 4 — Build and deploy

```bash
pnpm build
pnpm wrangler deploy
```

Wrangler outputs your live URL — looks like `https://your-portfolio.your-account.workers.dev`. Visit it. You're live.

## Step 5 (OPTIONAL) — Connect your custom domain

If you own `{{state.domain}}` and have it on Cloudflare:

1. Go to your Worker in the Cloudflare dashboard → Settings → Domains & Routes.
2. Click **Add → Custom Domain**.
3. Enter `{{state.domain}}` and click Add.
4. Cloudflare auto-configures DNS. Wait ~30 seconds.
5. Visit `https://{{state.domain}}` — it's live with a free SSL certificate.

If your domain isn't on Cloudflare:

1. In Cloudflare dashboard, click **Add a Site** and enter `{{state.domain}}`.
2. Cloudflare gives you two nameservers — copy them.
3. Go to your domain registrar (Namecheap, GoDaddy, Porkbun, etc.) and replace the nameservers with Cloudflare's.
4. Wait for propagation (up to 24 hours, usually under 1 hour).
5. Once Cloudflare shows the site as Active, follow the steps above.

## Step 6 — Set up automatic deploys (RECOMMENDED)

Connect your repo to GitHub Actions for auto-deploy on every push:

1. Push your project to a new GitHub repo:
   ```bash
   cd portfolio
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create my-portfolio --public --source=. --push
   ```

2. The included `.github/workflows/deploy.yml` runs on every push to main. You need two GitHub secrets:
   - `CLOUDFLARE_API_TOKEN` — create at https://dash.cloudflare.com/profile/api-tokens with **Edit Workers** template.
   - `CLOUDFLARE_ACCOUNT_ID` — find in any Cloudflare dashboard URL.

3. Add the secrets at GitHub → your repo → Settings → Secrets and variables → Actions.

4. Push any change. Watch it deploy automatically.

## Editing your content

| What | Where |
|---|---|
| Hero text | `src/pages/index.astro` |
| Projects | `src/content/projects/*.md` (one file per project) |
| Notes/writing | `src/content/notes/*.md` |
| About page | `src/pages/about.astro` |
| Site config | `astro.config.ts` |
| Color tokens | `src/styles/global.css` (under `@theme`) |
| Fonts | `astro.config.ts` (under `fonts:`) |

## Troubleshooting

**Build fails with "Cannot find module 'sharp'"** — Cloudflare Workers don't bundle sharp. Astro 6 handles image optimization at build time, so this shouldn't appear in production. If it does, ensure `imageService: 'compile'` is set in `astro.config.ts`.

**Custom domain stays "Not Active"** — wait 30 minutes after DNS change before contacting Cloudflare support. Most issues self-resolve.

**Lighthouse score below 95** — make sure you're testing the production deploy, not local dev. Local dev includes hot-module-reload code that costs ~10 points.

---

Generated by Forge — https://forge.zacgibson.work
```

---

## 9. Generated `README.md` template

Lighter than DEPLOY.md. Surfaced in the GitHub repo when they push.

```markdown
# {{state.name}} — Portfolio

Personal portfolio site for {{state.name}}, {{state.role}}{{#if state.location}}, based in {{state.location}}{{/if}}.

Built with Astro 6, Tailwind v4, and Cloudflare Workers. Generated with [Forge](https://forge.zacgibson.work).

## Quick start

```bash
pnpm install
pnpm dev
```

## Deployment

See [DEPLOY.md](./DEPLOY.md) for full Cloudflare deploy instructions.

## Stack

- [Astro 6](https://astro.build) — framework
- [Cloudflare Workers](https://workers.cloudflare.com) — hosting
- [Tailwind CSS v4](https://tailwindcss.com) — styling
- [shadcn Sera](https://ui.shadcn.com) — components
- Native View Transitions — page transitions
- Content Collections — Markdown-driven content

## License

The code in this repository was generated by Forge and is licensed to you, the owner, under the MIT License. The Forge generator itself is closed-source.

---

Built by Zac Gibson — https://zacgibson.work
```

---

## 10. Next-level visual features catalog

These are the visual moves that separate Forge's output from generic portfolio generators. Each feature includes the implementation approach.

### 10.1 In the Forge marketing surface itself

| Feature | Implementation |
|---|---|
| Aurora WebGL hero | OGL library (lighter than Three.js); 3 color points + simplex noise; ~2KB shader. Disable on `prefers-reduced-motion` and below 768px. |
| Magnetic CTA buttons | Listen `mousemove` within 60px radius; translate button via CSS variable; spring physics via Framer Motion `useSpring`. |
| Kinetic headline rotation | Motion One stagger + character splitting (`split-type` library or manual span wrap). |
| Spotlight cursor | Radial-gradient overlay tied to cursor position via CSS variables. CSS-only, no JS animation loop. |
| Custom cursor on cards | Replace cursor with pill: `cursor: none` + JS-positioned div with `pointer-events: none`. |
| Page transitions | Native View Transitions API. Add `view-transition-name` to hero text → continues on next page. |
| Scroll-driven progress bar | CSS `animation-timeline: scroll(root)`. No JS. |
| Reveal-on-scroll | CSS `animation-timeline: view()` with `view-timeline-name`. Fallback to IntersectionObserver. |
| Smooth scroll | Lenis library, init once on root. Respects `prefers-reduced-motion`. |
| Confetti on success | Motion One particle emitter, 60 particles, physics-based, 1.2s duration. |
| Sound effects (Phase 2) | Tone.js, opt-in, user-gesture-triggered. |

### 10.2 In generated portfolios (each preset enables a different subset)

| Feature | Applies to |
|---|---|
| Native View Transitions (CSP-safe) | All presets. CSS-only. |
| Bento grid project layout | Aurora, Botanical (variants). |
| 3D card tilt on hover | Aurora only. |
| WebGL aurora background | Aurora only. |
| Hand-drawn SVG illustrations | Botanical only. |
| ASCII dividers | Minimalist only. |
| Visible grid system | Brutalist only. |
| Drop caps | Editorial only. |
| Sticky table-of-contents rail | Editorial, Aurora (project pages). |
| Scroll-driven reveals | All presets, level-of-aggression varies. |
| Dynamic OG images per page | All presets. Satori + getFontData. |
| Server Island for GitHub feed | All presets when user opts in. |
| Dark mode toggle with view transition | All presets. |
| Lighthouse 100 default | All presets. Non-negotiable. |

### 10.3 What to NOT build (resist the urge)

- **Page-load skeleton screens.** Astro 6 ships server-rendered HTML; skeletons are an SPA pattern with no place here.
- **Lottie animations in hero.** Heavy, unnecessary; use SVG with stroke-dashoffset instead.
- **Cursor trails.** Played out by 2024.
- **Particle field backgrounds.** Aurora preset uses gradient mesh, not particles. Particles look like 2018 Bootstrap themes.
- **Auto-playing video heroes.** Bandwidth tax, accessibility tax, performance tax. Use static animated SVG or WebGL gradient.
- **Cookie banners.** Plausible is cookieless. Don't add a banner you don't need.
- **3D scenes (Three.js with models).** Resist. Aurora gets the "3D" feeling from gradient mesh + tilt — that's enough. Real 3D scenes are 200KB+ and add nothing.

---

## 11. Replit setup — bootstrap commands

When Replit Agent runs the initial scaffold:

```bash
# 1. Create Next.js with App Router
pnpm create next-app@latest forge \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-eslint \
  --turbopack

cd forge

# 2. Install Tailwind v4 (override the default v3 install from create-next-app)
pnpm remove tailwindcss postcss
pnpm add -D tailwindcss@^4 @tailwindcss/postcss@^4

# 3. Install runtime deps
pnpm add framer-motion@^12 motion@latest lenis@^1 \
  zustand@^5 react-hook-form@^7 zod@^4 \
  jszip@^3 sharp@^0.33 handlebars@^4 \
  resend@^4 lucide-react@latest \
  ogl@^1 split-type@^0.3

# 4. Install shadcn with Sera preset
pnpm dlx shadcn@latest init --preset sera

# 5. Add core shadcn components
pnpm dlx shadcn@latest add button card input textarea label dialog separator tabs select switch toggle

# 6. Install dev deps
pnpm add -D @biomejs/biome@^1.9 @types/jszip

# 7. Configure Biome
pnpm dlx @biomejs/biome init
```

**`tailwind.config.css` (Tailwind v4 config-as-CSS):**

```css
@import 'tailwindcss';

@theme {
  /* see Section 5.1 for full token block */
}
```

**`next.config.ts`:**

```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // for image uploads in zip generation
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(md|tmpl)$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default config;
```

**Replit deploy config:**

Use Replit's Next.js deployment template. Set the environment variables:

- `RESEND_API_KEY` — for email-the-zip flow
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — set to `forge.zacgibson.work`

For custom domain in Replit: connect `forge.zacgibson.work` via the deployment settings.

---

## 12. Phase scope

### Phase 1 MVP (ships first, target 4 weekend-sprints)

**Must:**
- 3 presets: Editorial, Minimalist, Aurora (these cover 80% of taste profiles)
- 4 palettes per preset
- All 5 wizard steps functional
- Live preview iframe
- Zip export with full Astro 6 project
- DEPLOY.md generation
- Email gate (optional, default off, no email-send wired yet)
- Basic analytics events
- Marketing landing page (hero + preset showcase + CTA)

**Skip in Phase 1:**
- Brutalist and Botanical presets
- Custom palette mode (3 sliders)
- Sound effects
- Server Island GitHub feed
- Dynamic OG image generation
- Auto-deploy GitHub Actions in generated zip
- Resend integration (capture emails to a no-op endpoint, ship later)

**Definition of done:** Zac generates a portfolio with each of the 3 presets, deploys all 3 to test domains, gets Lighthouse 100/100/100/100 on all 3, and would publicly use any of them on his actual zacgibson.work.

### Phase 2 (after Phase 1 is shipped and traffic exists)

- Brutalist and Botanical presets (the higher-personality options)
- Custom palette mode with OKLCH sliders
- Server Island GitHub feed integration
- Dynamic OG image route in generated portfolios
- Auto-deploy via GitHub Actions in zip
- Resend wired up — actual email send
- Optional sound design (low priority)
- Featured-portfolios gallery on `forge.zacgibson.work/showcase` — opt-in submission flow for users who want to be featured

### Phase 3 (much later, only if traffic justifies)

- Theme marketplace — users submit presets, top 3/year pinned
- Pro tier (yes, eventually): custom domain handled by Forge, password protection, contact-form-to-email, analytics dashboard. $5–10/mo.
- AI-assisted copywriting in the wizard ("write my hero from these notes")
- Live collaboration (multi-user editing)

Don't build Phase 3 features in Phase 1 even if the temptation is strong. Phase 1 traffic is the prerequisite.

---

## 13. Brand integration — funnel and lifecycle

### 13.1 Where Forge sits in the brand stack

```
zacgibson.work (the portfolio — story, work, hire-me)
   │
   ├─→ forge.zacgibson.work (this app — proof of taste, lead-gen, traffic)
   ├─→ righteousrecon.com (review platform — methodology proof, revenue)
   ├─→ jotterdown.com (writing OS — flagship product)
   └─→ [WESTFALL announcement when relevant]
```

Forge sits in the second tier — it's not a flagship product, it's **a free brand asset that proves Zac ships and that Zac has taste.**

### 13.2 Conversion funnel

```
Twitter/HN/Reddit traffic →
  forge.zacgibson.work landing →
    Open Forge button (event: forge_opened) →
      Wizard step 1 completed (event: step_1_done) →
        ... through step 6 →
          Generate clicked (event: generate_clicked) →
            Zip downloaded (event: zip_downloaded) →
              [optional] Email captured (event: email_captured) →
                [optional] DEPLOY.md viewed in repo (event: deploy_viewed) →
                  [optional] Custom domain ping (event: domain_ping)
```

Track every event in Plausible. Set goals on `email_captured` and `domain_ping`. Optimize hard for `generate_clicked → zip_downloaded` (don't break that step) and `zip_downloaded → email_captured` (the lead-gen goal).

### 13.3 Footer attribution on generated portfolios

Each preset's footer template includes:

```
Built with Forge by Zac Gibson — forge.zacgibson.work
```

This is **OPTIONAL** (a checkbox in step 6, default ON). Users can disable it. About 60–70% will leave it on out of inertia. That's the long-tail referral engine.

### 13.4 What this builds for Zac

- **Email list:** people who care about owning their portfolio code = developers, IAM/defense candidates, indie hackers. Adjacent to RighteousRecon's audience and Zac's hire-me audience.
- **Public proof of Astro 6 / Cloudflare / design taste:** every Forge-built portfolio in the wild is a passive ad for Zac's technical chops.
- **Search authority:** "Astro 6 portfolio generator" / "free portfolio Cloudflare" / ".work domain portfolio" — high-intent niche keywords.
- **Recruitment:** defense IAM hiring managers who land on Forge see a builder, not just a healthcare-IAM analyst with a resume. That story matters for the SAIC/Leidos/Booz tier.

---

## 14. Quality gates — before launch

Forge must pass these before public launch on `forge.zacgibson.work`:

| Gate | Requirement |
|---|---|
| Lighthouse on Forge marketing | 100/100/100/100 mobile + desktop |
| Lighthouse on each generated preset | 100/100/100/100 mobile + desktop |
| Zip integrity | All 3 presets unzip cleanly, `pnpm install` succeeds, `pnpm build` succeeds, `pnpm wrangler deploy` succeeds on a fresh CF account |
| DEPLOY.md walkthrough | Followed end-to-end on a fresh CF account by someone who's never used CF — works without external help |
| Reduced motion | All animations respect `prefers-reduced-motion: reduce` |
| Mobile usability | Wizard is usable on a 375px viewport (iPhone SE) |
| Copy editing | All copy reviewed for brand voice — direct, useful, no fluff |
| Privacy | No analytics on the wizard inputs themselves; only on event hits |
| Email send | If email gate is on, Resend integration tested with real send |

---

## 15. Stretch — high-leverage features for Phase 2+

### 15.1 "Inherit from your existing site"

Power user feature: paste a URL. Forge fetches, parses, and pre-fills the wizard with detected name, role, projects (from `<article>` tags or `<h2>` patterns), color palette (extracted from CSS). User edits and exports a fresh Astro 6 version of their existing site.

This is a strong differentiator. Lovable/v0 don't do migration. Forge can.

### 15.2 "Forge a fork of zacgibson.work"

Special preset E: a preset that's literally Zac's actual portfolio styling, opened to the public as a sixth option. "Want what Zac has? One click." This signals confidence and gives away the design as a commodity — which raises Zac's brand because the design isn't the moat; the work is.

### 15.3 Showcase gallery

Submission flow at `forge.zacgibson.work/showcase`. Users opt-in to featuring their generated portfolio. Curated by Zac. Each featured site links back. Compounding traffic.

### 15.4 Newsletter — "Forge Notes"

Bi-weekly email to the captured list. Topics: portfolio teardowns ("what makes this one work"), Astro 6 tips, Cloudflare cost-optimization, IAM career notes if Zac wants to thread that audience.

Three paid tiers far down the line: free / $5 essential / $15 deep dives. Zac controls his own list, his own pricing, his own publishing cadence. This is where Forge becomes a small but real revenue stream — *eventually*, not at launch.

---

## 16. The Replit Agent prompt

When pasting this spec into Replit Agent, lead with:

```
Build the project specified in the attached `forge-build-spec.md` document.
Reference the attached `astro-6-pattern-library.md` document for all generated portfolio output patterns.

Honor the following hard rules:
- Pin every version exactly as specified in Section 2.
- Build Phase 1 MVP scope (Section 12) only. Do not build Phase 2 or 3 features.
- Do not substitute libraries (no Tanstack Form for react-hook-form, no class-variance-authority unless shadcn requires it, etc.).
- Do not introduce ESLint — Biome only.
- Do not write Pages Router code — App Router only.
- Do not generate any tests. Tests come in a follow-up task.
- Generated portfolio output must use Astro 6 patterns from the pattern library exactly. Do not invent your own Astro 6 syntax.
- All copy must use Zac Gibson's voice profile: direct, no hedging, no marketing fluff, technical confidence without bragging.
- The generator UI must respect `prefers-reduced-motion: reduce`. Every animation needs a fallback.

Begin with Section 11 (Replit setup commands), then build the file structure in Section 3 in this order:
1. Generator app shell + landing page
2. Wizard steps 1–5
3. Live preview iframe
4. Templates for the 3 Phase 1 presets (Editorial, Minimalist, Aurora)
5. Zip generation pipeline
6. Export route
7. DEPLOY.md generation
8. Polish + Lighthouse pass

Pause and surface decisions whenever you encounter ambiguity in the spec. Do not invent answers to ambiguous requirements.
```

---

## End of spec

**Version:** 1.0 — May 2, 2026
**Stack pin date:** May 2026 (re-verify quarterly)
**Author:** Zac Gibson, with build-spec assist from Claude
**License of generated output (default in zip):** MIT to the user
**License of Forge generator code itself:** Zac's choice — recommend keeping closed-source for now

If anything in this document conflicts with the Astro 6 Pattern Library, the Pattern Library wins for output code, and this spec wins for generator architecture.
