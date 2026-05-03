import type { WizardState, Project } from "./schemas";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}

interface PresetFonts {
  display: string;
  body: string;
  mono: string;
  link: string;
}

const PRESET_FONTS: Record<WizardState["preset"], PresetFonts> = {
  editorial: {
    display: "'Instrument Serif', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
  },
  minimalist: {
    display: "'JetBrains Mono', ui-monospace, monospace",
    body: "'JetBrains Mono', ui-monospace, monospace",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  aurora: {
    display: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;700&family=JetBrains+Mono:wght@400&display=swap",
  },
};

function fontLink(state: WizardState): string {
  const fp = PRESET_FONTS[state.preset];
  return `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${fp.link}" rel="stylesheet">`;
}

function tokenCss(state: WizardState): string {
  const p = state.palette;
  const fp = PRESET_FONTS[state.preset];
  const isDark = state.darkMode || state.preset === "aurora";
  return `
:root {
  --color-bg: ${p.bg};
  --color-surface: ${p.surface};
  --color-border: ${p.border};
  --color-text: ${p.text};
  --color-mute: ${p.mute};
  --color-accent: ${p.accent};
  --color-accent-2: ${p.accent2 ?? p.accent};
  --font-display: ${fp.display};
  --font-body: ${fp.body};
  --font-mono: ${fp.mono};
  color-scheme: ${isDark ? "dark" : "light"};
}
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--color-bg); color: var(--color-text); -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
::selection { background: var(--color-accent); color: var(--color-bg); }
`;
}

function defaultProjects(preset: WizardState["preset"]): Project[] {
  if (preset === "minimalist") {
    return [
      {
        id: "ex",
        title: "example-project",
        summary: "add yours in step 5",
        stack: [],
        date: "2026",
      },
    ];
  }
  if (preset === "aurora") {
    return [
      {
        id: "ex",
        title: "Example project",
        summary: "Add your own work in step 5.",
        stack: ["WebGL", "TS"],
      },
    ];
  }
  return [
    {
      id: "ex",
      title: "Example project",
      summary: "Add your own work in step 5.",
      stack: ["Astro", "TS"],
    },
  ];
}

function renderEditorial(state: WizardState): string {
  const projects = state.projects.length > 0 ? state.projects : defaultProjects("editorial");
  const navItems: string[] = [];
  if (state.sections.about) navItems.push(`<a href="/about">About</a>`);
  if (state.sections.projects) navItems.push(`<a href="/projects">Work</a>`);
  if (state.sections.writing) navItems.push(`<a href="/writing">Writing</a>`);
  if (state.sections.now) navItems.push(`<a href="/now">Now</a>`);
  if (state.sections.uses) navItems.push(`<a href="/uses">Uses</a>`);
  if (state.sections.contact) navItems.push(`<a href="/contact">Contact</a>`);
  return `
<style>
  ${tokenCss(state)}
  body { font-family: var(--font-body); }
  h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 400; letter-spacing: -0.02em; line-height: 1.05; text-wrap: balance; margin: 0; }
  p { text-wrap: pretty; line-height: 1.6; margin: 0; }
  main { max-width: 720px; margin: 0 auto; padding: 0 1.5rem; }
  nav { display: flex; align-items: center; justify-content: space-between; padding: 2rem 0; border-bottom: 1px solid var(--color-border); }
  nav .name { font-family: var(--font-display); font-size: 1.25rem; }
  nav .links { display: flex; gap: 1.5rem; font-size: 0.875rem; font-weight: 500; color: var(--color-mute); }
  .eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; font-weight: 600; color: var(--color-accent); font-family: var(--font-body); margin: 0 0 1rem; }
  .hero { padding: 4rem 0 3rem; }
  .hero h1 { font-size: 3.75rem; line-height: 1; margin-bottom: 1.5rem; }
  .tagline { font-size: 1.25rem; color: var(--color-mute); max-width: 36rem; }
  .loc { margin-top: 1rem; font-family: var(--font-mono); font-size: 0.875rem; color: var(--color-mute); }
  .work { margin-top: 4rem; }
  .work .eyebrow { margin-bottom: 1.5rem; }
  .project-card { border-top: 1px solid var(--color-border); padding: 2rem 0; position: relative; transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1); }
  .project-card:hover { transform: translateY(-2px); }
  .project-card::before { content: ""; position: absolute; left: -1rem; top: 2rem; bottom: 2rem; width: 2px; background: var(--color-accent); transform: scaleY(0); transform-origin: top; transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1); }
  .project-card:hover::before { transform: scaleY(1); }
  .project-card .row { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 0.5rem; }
  .project-card h2 { font-size: 1.875rem; }
  .project-card .num { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-mute); }
  .project-card .summary { color: var(--color-mute); margin-bottom: 0.75rem; }
  .project-card .links { margin-top: 1rem; display: flex; gap: 1rem; font-size: 0.875rem; font-weight: 500; color: var(--color-accent); }
  .chip { display: inline-block; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.2rem 0.5rem; border: 1px solid var(--color-border); margin-right: 0.4rem; margin-top: 0.4rem; color: var(--color-mute); }
  footer { margin-top: 6rem; padding: 2.5rem 0; border-top: 1px solid var(--color-border); font-size: 0.875rem; color: var(--color-mute); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001s !important; transition-duration: 0.001s !important; } }
</style>
<main>
  <nav>
    <a href="/" class="name">${escapeHtml(state.name || "Your Name")}</a>
    <div class="links">${navItems.join("")}</div>
  </nav>
  <section class="hero">
    <p class="eyebrow">Currently — ${escapeHtml(state.role || "Your Role")}</p>
    <h1>${escapeHtml(state.name || "Your Name")}</h1>
    ${state.tagline ? `<p class="tagline">${escapeHtml(state.tagline)}</p>` : ""}
    ${state.location ? `<p class="loc">${escapeHtml(state.location)}</p>` : ""}
  </section>
  ${state.sections.projects ? `<section class="work">
    <p class="eyebrow">Selected Work</p>
    <div>${projects.map((p, i) => `<article class="project-card">
        <div class="row">
          <h2>${escapeHtml(p.title)}</h2>
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
        </div>
        <p class="summary">${escapeHtml(p.summary)}</p>
        <div>${(p.stack || []).map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join("")}</div>
        ${(p.liveUrl || p.repoUrl) ? `<div class="links">${p.liveUrl ? `<a href="${escapeAttr(p.liveUrl)}">Live →</a>` : ""}${p.repoUrl ? `<a href="${escapeAttr(p.repoUrl)}">Source →</a>` : ""}</div>` : ""}
      </article>`).join("")}</div>
  </section>` : ""}
  <footer>
    <span>© ${new Date().getFullYear()} ${escapeHtml(state.name || "")}</span>
    ${state.showForgeAttribution ? `<span>Built with <a href="https://forge.zacgibson.work" style="color: var(--color-accent);">Forge</a></span>` : ""}
  </footer>
</main>`;
}

function renderMinimalist(state: WizardState): string {
  const projects = state.projects.length > 0 ? state.projects : defaultProjects("minimalist");
  // Mirror template's literal hardcoded behavior: about has no prefix,
  // every later section is prefixed with " :: " whether or not earlier
  // sections are enabled (matches templates/minimalist.ts index.astro).
  const navHtml =
    (state.sections.about ? `<a href="/about">about</a>` : "") +
    (state.sections.projects ? ` :: <a href="/projects">work</a>` : "") +
    (state.sections.writing ? ` :: <a href="/writing">writing</a>` : "") +
    (state.sections.now ? ` :: <a href="/now">now</a>` : "") +
    (state.sections.uses ? ` :: <a href="/uses">uses</a>` : "") +
    (state.sections.contact ? ` :: <a href="/contact">contact</a>` : "");
  return `
<style>
  ${tokenCss(state)}
  html { font-family: var(--font-mono); font-size: 14px; }
  body { font-family: var(--font-mono); }
  a { color: var(--color-text); text-decoration: underline; text-decoration-color: var(--color-border); text-underline-offset: 3px; }
  a:hover { color: var(--color-accent); text-decoration-color: var(--color-accent); }
  main { max-width: 640px; margin: 0; padding: 4rem 2rem; }
  h1, h2 { font-size: 1rem; font-weight: 700; margin: 0 0 1rem; font-family: var(--font-mono); }
  p { margin: 0; }
  .cursor::after { content: "_"; animation: blink 1.1s steps(2) infinite; color: var(--color-accent); margin-left: 2px; }
  @keyframes blink { 50% { opacity: 0; } }
  .divider { color: var(--color-mute); margin: 1.5rem 0; user-select: none; }
  .mute { color: var(--color-mute); }
  .row { margin-bottom: 0.75rem; }
  footer { color: var(--color-mute); font-size: 0.85rem; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001s !important; transition-duration: 0.001s !important; } .cursor::after { animation: none; } }
</style>
<main>
  <section>
    <h1>==[ ${escapeHtml(state.name || "your-name")} ]==<span class="cursor"></span></h1>
    <p>${escapeHtml(state.role || "your-role")}${state.location ? ` :: ${escapeHtml(state.location)}` : ""}</p>
    ${state.tagline ? `<p class="mute" style="margin-top: 0.5rem;">${escapeHtml(state.tagline)}</p>` : ""}
    ${navHtml ? `<p style="margin-top: 1rem;">${navHtml}</p>` : ""}
  </section>
  ${state.sections.projects ? `<div class="divider">---</div>
  <section>
    <h2># projects</h2>
    ${projects.map((p) => `<div class="row"><span class="mute">${escapeHtml(p.date || "----")} →</span> <strong>${escapeHtml(p.title)}</strong> <span class="mute">:: ${escapeHtml(p.summary)}</span>${p.liveUrl ? ` [<a href="${escapeAttr(p.liveUrl)}">live</a>]` : ""}${p.repoUrl ? ` [<a href="${escapeAttr(p.repoUrl)}">src</a>]` : ""}</div>`).join("")}
  </section>` : ""}
  <div class="divider">---</div>
  <footer>
    <div>built ${new Date().getFullYear()} :: ${escapeHtml(state.name || "")}${state.showForgeAttribution ? ` :: <a href="https://forge.zacgibson.work">forged</a>` : ""}</div>
  </footer>
</main>`;
}

function renderAurora(state: WizardState): string {
  const projects = state.projects.length > 0 ? state.projects : defaultProjects("aurora");
  const navItems: string[] = [];
  if (state.sections.about) navItems.push(`<a href="/about">About</a>`);
  if (state.sections.projects) navItems.push(`<a href="/projects">Work</a>`);
  if (state.sections.writing) navItems.push(`<a href="/writing">Writing</a>`);
  if (state.sections.now) navItems.push(`<a href="/now">Now</a>`);
  if (state.sections.uses) navItems.push(`<a href="/uses">Uses</a>`);
  if (state.sections.contact) navItems.push(`<a href="/contact">Contact</a>`);
  return `
<style>
  ${tokenCss(state)}
  body { font-family: var(--font-body); overflow-x: hidden; }
  h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 200; letter-spacing: -0.04em; line-height: 1; text-wrap: balance; margin: 0; }
  p { margin: 0; }
  .aurora { position: fixed; inset: 0; z-index: -1; background:
    radial-gradient(60% 60% at 20% 30%, var(--color-accent) 0%, transparent 60%),
    radial-gradient(50% 50% at 80% 20%, var(--color-accent-2) 0%, transparent 60%),
    radial-gradient(70% 70% at 50% 90%, var(--color-accent) 0%, transparent 70%),
    var(--color-bg);
    filter: blur(80px) saturate(1.2); opacity: 0.7;
    animation: drift 40s ease-in-out infinite alternate; }
  @keyframes drift { 0% { transform: translate3d(0, 0, 0) scale(1); } 100% { transform: translate3d(-5%, 5%, 0) scale(1.1); } }
  main { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; position: relative; }
  nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 3rem; }
  nav .name { font-size: 1.125rem; font-weight: 500; letter-spacing: -0.02em; }
  nav .links { display: flex; gap: 1.5rem; font-size: 0.875rem; color: var(--color-mute); }
  nav .links a { transition: color 200ms; }
  nav .links a:hover { color: #fff; }
  .eyebrow { font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-accent); margin: 0 0 1.5rem; }
  .hero { padding: 5rem 0; }
  .hero h1 { font-size: 4.5rem; margin-bottom: 2rem; }
  @media (min-width: 768px) { .hero h1 { font-size: 8rem; } }
  .tagline { font-size: 1.5rem; color: var(--color-mute); font-weight: 300; max-width: 42rem; }
  .loc { margin-top: 1.5rem; font-family: var(--font-mono); font-size: 0.875rem; color: var(--color-mute); }
  .work { margin-top: 3rem; }
  .work h2 { font-size: 2.25rem; margin-bottom: 2rem; }
  .grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
  @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
  .bento-card { display: block; background: color-mix(in oklch, var(--color-surface) 60%, transparent); border: 1px solid var(--color-border); border-radius: 1.5rem; padding: 2rem; backdrop-filter: blur(12px); transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms; }
  .bento-card:hover { transform: translateY(-4px); border-color: var(--color-accent); }
  .bento-card .num { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-accent); }
  .bento-card h3 { font-size: 1.5rem; margin: 0.75rem 0 0.5rem; font-weight: 300; }
  .bento-card p { color: var(--color-mute); }
  .bento-card .stack { margin-top: 1rem; }
  .chip { display: inline-block; font-family: var(--font-mono); font-size: 0.7rem; padding: 0.2rem 0.6rem; background: color-mix(in oklch, var(--color-accent) 15%, transparent); color: var(--color-accent); border-radius: 999px; margin-right: 0.4rem; margin-top: 0.4rem; }
  footer { margin-top: 8rem; padding-top: 2rem; border-top: 1px solid var(--color-border); font-size: 0.875rem; color: var(--color-mute); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.001s !important; transition-duration: 0.001s !important; } .aurora { animation: none; } }
  @media (max-width: 768px) { .aurora { filter: blur(40px); opacity: 0.4; } }
</style>
<div class="aurora"></div>
<main>
  <nav>
    <a href="/" class="name">${escapeHtml(state.name || "Your Name")}</a>
    <div class="links">${navItems.join("")}</div>
  </nav>
  <section class="hero">
    <p class="eyebrow">${escapeHtml(state.role || "Your Role")}</p>
    <h1>${escapeHtml(state.name || "Your Name")}</h1>
    ${state.tagline ? `<p class="tagline">${escapeHtml(state.tagline)}</p>` : ""}
    ${state.location ? `<p class="loc">— ${escapeHtml(state.location)}</p>` : ""}
  </section>
  ${state.sections.projects ? `<section class="work">
    <h2>Selected work.</h2>
    <div class="grid">${projects.map((p, i) => `<a href="${escapeAttr(`/projects/${p.id}`)}" class="bento-card">
        <span class="num">${String(i + 1).padStart(2, "0")}</span>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.summary)}</p>
        <div class="stack">${(p.stack || []).slice(0, 4).map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join("")}</div>
      </a>`).join("")}</div>
  </section>` : ""}
  <footer>
    <span>© ${new Date().getFullYear()} ${escapeHtml(state.name || "")}</span>
    ${state.showForgeAttribution ? `<span>Built with <a href="https://forge.zacgibson.work" style="color: var(--color-accent);">Forge</a></span>` : ""}
  </footer>
</main>`;
}

const renderers: Record<WizardState["preset"], (s: WizardState) => string> = {
  editorial: renderEditorial,
  minimalist: renderMinimalist,
  aurora: renderAurora,
};

export function renderPreviewHtml(state: WizardState): string {
  const body = renderers[state.preset](state);
  const isDark = state.darkMode || state.preset === "aurora";
  return `<!doctype html>
<html lang="en"${isDark ? ' data-theme="dark"' : ""}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(state.name || "Preview")} — Preview</title>
  ${fontLink(state)}
</head>
<body>${body}</body>
</html>`;
}
