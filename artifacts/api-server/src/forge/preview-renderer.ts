import type { WizardState } from "./schemas";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

type FontPairId = "editorial" | "modern" | "mono" | "display" | "classic";
type RadiusId = "sharp" | "soft" | "pill";

interface FontPairServer {
  display: string;
  body: string;
  mono: string;
  link: string;
}

const FONT_PAIRS: Record<FontPairId, FontPairServer> = {
  editorial: {
    display: "'Instrument Serif', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap",
  },
  modern: {
    display: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;700&family=JetBrains+Mono:wght@400&display=swap",
  },
  mono: {
    display: "'JetBrains Mono', ui-monospace, monospace",
    body: "'JetBrains Mono', ui-monospace, monospace",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
  display: {
    display: "'Space Grotesk', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap",
  },
  classic: {
    display: "'Fraunces', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap",
  },
};

const RADIUS_SCALES: Record<RadiusId, { sm: string; md: string; lg: string }> = {
  sharp: { sm: "0", md: "0", lg: "0" },
  soft: { sm: "0.375rem", md: "0.75rem", lg: "1.25rem" },
  pill: { sm: "0.75rem", md: "1.5rem", lg: "999px" },
};

function getFontPair(state: WizardState): FontPairServer {
  return FONT_PAIRS[(state.fontPair ?? "modern") as FontPairId] ?? FONT_PAIRS.modern;
}

function getRadius(state: WizardState) {
  return RADIUS_SCALES[(state.radiusScale ?? "soft") as RadiusId] ?? RADIUS_SCALES.soft;
}

function fontLink(state: WizardState): string {
  const fp = getFontPair(state);
  return `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="${fp.link}" rel="stylesheet">`;
}

function tokenCss(state: WizardState): string {
  const p = state.palette;
  const fp = getFontPair(state);
  const r = getRadius(state);
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
  --radius-sm: ${r.sm};
  --radius-md: ${r.md};
  --radius-lg: ${r.lg};
  color-scheme: ${state.darkMode || state.preset === "aurora" ? "dark" : "light"};
}
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--color-bg); color: var(--color-text); -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }
::selection { background: var(--color-accent); color: var(--color-bg); }
`;
}

function navLinks(state: WizardState): string {
  const items: string[] = [];
  if (state.sections.about) items.push(`<a href="#">About</a>`);
  if (state.sections.projects) items.push(`<a href="#">Work</a>`);
  if (state.sections.contact) items.push(`<a href="#">Contact</a>`);
  return items.join("");
}

function renderEditorial(state: WizardState): string {
  const projects = state.projects.length > 0 ? state.projects : [
    { id: "ex", title: "Example project", summary: "Add your own work in step 5.", stack: ["Astro", "TS"], liveUrl: "", repoUrl: "" },
  ];
  return `
<style>
  ${tokenCss(state)}
  body { font-family: var(--font-body); }
  h1, h2, h3 { font-family: var(--font-display); font-weight: 400; letter-spacing: -0.02em; line-height: 1.05; text-wrap: balance; margin: 0; }
  .wrap { max-width: 720px; margin: 0 auto; padding: 0 1.5rem; }
  nav { display: flex; justify-content: space-between; align-items: center; padding: 2rem 0; border-bottom: 1px solid var(--color-border); }
  nav .name { font-family: var(--font-display); font-size: 1.25rem; }
  nav .links { display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--color-mute); font-weight: 500; }
  .eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.72rem; font-weight: 600; color: var(--color-accent); }
  .hero { padding-top: 3rem; padding-bottom: 2rem; }
  .hero h1 { font-size: clamp(2.5rem, 6vw, 3.75rem); margin: 1rem 0 1.25rem; line-height: 1; }
  .tagline { font-size: 1.125rem; color: var(--color-mute); max-width: 36rem; }
  .loc { margin-top: 1rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-mute); }
  .work { margin-top: 4rem; }
  .pcard { border-top: 1px solid var(--color-border); padding: 2rem 0; position: relative; transition: transform 200ms; border-radius: var(--radius-sm); }
  .pcard:hover { transform: translateY(-2px); }
  .pcard h2 { font-size: 1.75rem; }
  .pcard .row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem; }
  .pcard .num { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-mute); }
  .summary { color: var(--color-mute); margin: 0; }
  .chip { display: inline-block; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.2rem 0.5rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); margin: 0.5rem 0.4rem 0 0; color: var(--color-mute); }
  footer { margin-top: 4rem; padding: 2.5rem 0; border-top: 1px solid var(--color-border); font-size: 0.85rem; color: var(--color-mute); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
</style>
<div class="wrap">
  <nav>
    <span class="name">${escapeHtml(state.name || "Your Name")}</span>
    <div class="links">${navLinks(state)}</div>
  </nav>
  <section class="hero">
    <p class="eyebrow">Currently — ${escapeHtml(state.role || "Your Role")}</p>
    <h1>${escapeHtml(state.name || "Your Name")}</h1>
    ${state.tagline ? `<p class="tagline">${escapeHtml(state.tagline)}</p>` : ""}
    ${state.location ? `<p class="loc">${escapeHtml(state.location)}</p>` : ""}
  </section>
  ${state.sections.projects ? `
  <section class="work">
    <p class="eyebrow" style="margin-bottom: 1.5rem;">Selected Work</p>
    ${projects.map((p, i) => `
      <article class="pcard">
        <div class="row">
          <h2>${escapeHtml(p.title)}</h2>
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
        </div>
        <p class="summary">${escapeHtml(p.summary)}</p>
        <div>${(p.stack || []).map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join("")}</div>
      </article>`).join("")}
  </section>` : ""}
  <footer>
    <span>© ${new Date().getFullYear()} ${escapeHtml(state.name || "")}</span>
    ${state.showForgeAttribution ? `<span>Built with <a href="https://forge.zacgibson.work" style="color: var(--color-accent);">Forge</a></span>` : ""}
  </footer>
</div>`;
}

function renderMinimalist(state: WizardState): string {
  const projects = state.projects.length > 0 ? state.projects : [
    { id: "ex", title: "example-project", summary: "add yours in step 5", stack: [], date: "2026", liveUrl: "", repoUrl: "" },
  ];
  return `
<style>
  ${tokenCss(state)}
  body { font-family: var(--font-body); font-size: 14px; padding: 4rem 2rem; max-width: 640px; }
  a { text-decoration: underline; text-decoration-color: var(--color-border); text-underline-offset: 3px; }
  a:hover { color: var(--color-accent); text-decoration-color: var(--color-accent); }
  h1 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; margin: 0 0 1rem; }
  h2 { font-family: var(--font-display); font-size: 1rem; font-weight: 700; margin: 0 0 1rem; }
  .cursor::after { content: "_"; animation: blink 1.1s steps(2) infinite; color: var(--color-accent); margin-left: 2px; }
  @keyframes blink { 50% { opacity: 0; } }
  .divider { color: var(--color-mute); margin: 1.5rem 0; user-select: none; }
  p { margin: 0.4rem 0; }
  .mute { color: var(--color-mute); }
  @media (prefers-reduced-motion: reduce) { .cursor::after { animation: none; } * { transition: none !important; animation: none !important; } }
</style>
<section>
  <h1>==[ ${escapeHtml(state.name || "your-name")} ]==<span class="cursor"></span></h1>
  <p>${escapeHtml(state.role || "your-role")}${state.location ? ` :: ${escapeHtml(state.location)}` : ""}</p>
  ${state.tagline ? `<p class="mute">${escapeHtml(state.tagline)}</p>` : ""}
  <p style="margin-top: 1rem;">${navLinks(state).replace(/<\/a>/g, "</a> :: ").replace(/ :: $/, "")}</p>
</section>
${state.sections.projects ? `
<div class="divider">---</div>
<section>
  <h2># projects</h2>
  ${projects.map((p) => `
    <div style="margin-bottom: 0.5rem;">
      <span class="mute">${escapeHtml(p.date || "----")} →</span>
      <strong>${escapeHtml(p.title)}</strong>
      <span class="mute">:: ${escapeHtml(p.summary)}</span>
      ${p.liveUrl ? ` [<a href="#">live</a>]` : ""}
      ${p.repoUrl ? ` [<a href="#">src</a>]` : ""}
    </div>`).join("")}
</section>` : ""}
<div class="divider">---</div>
<footer class="mute" style="font-size: 0.8rem;">
  built ${new Date().getFullYear()} :: ${escapeHtml(state.name || "")}${state.showForgeAttribution ? ` :: <a href="#">forged</a>` : ""}
</footer>`;
}

function renderAurora(state: WizardState): string {
  const projects = state.projects.length > 0 ? state.projects : [
    { id: "ex", title: "Example project", summary: "Add your own work in step 5.", stack: ["WebGL", "TS"], liveUrl: "", repoUrl: "" },
  ];
  return `
<style>
  ${tokenCss(state)}
  body { font-family: var(--font-body); overflow-x: hidden; min-height: 100vh; }
  h1, h2, h3 { font-family: var(--font-display); font-weight: 200; letter-spacing: -0.04em; line-height: 1; text-wrap: balance; margin: 0; }
  .aurora { position: fixed; inset: 0; z-index: -1; background:
    radial-gradient(60% 60% at 20% 30%, var(--color-accent) 0%, transparent 60%),
    radial-gradient(50% 50% at 80% 20%, var(--color-accent-2) 0%, transparent 60%),
    radial-gradient(70% 70% at 50% 90%, var(--color-accent) 0%, transparent 70%),
    var(--color-bg);
    filter: blur(80px) saturate(1.2); opacity: 0.6;
    animation: drift 40s ease-in-out infinite alternate; }
  @keyframes drift { 0% { transform: translate3d(0, 0, 0) scale(1); } 100% { transform: translate3d(-5%, 5%, 0) scale(1.1); } }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem 4rem; position: relative; }
  nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
  nav .name { font-size: 1.125rem; font-weight: 500; letter-spacing: -0.02em; }
  nav .links { display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--color-mute); }
  nav .links a { transition: color 200ms; }
  nav .links a:hover { color: #fff; }
  .eyebrow { font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-accent); margin: 0 0 1.5rem; }
  .hero { padding: 4rem 0 2rem; }
  .hero h1 { font-size: clamp(3.5rem, 12vw, 7rem); margin-bottom: 2rem; }
  .tagline { font-size: 1.5rem; color: var(--color-mute); font-weight: 300; max-width: 36rem; margin: 0; }
  .loc { margin-top: 1.5rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--color-mute); }
  .work { margin-top: 3rem; }
  .work h2 { font-size: 2.25rem; margin-bottom: 2rem; }
  .grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
  @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
  .card { background: color-mix(in oklch, var(--color-surface) 60%, transparent); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.75rem; backdrop-filter: blur(12px); transition: transform 300ms, border-color 300ms; }
  .card:hover { transform: translateY(-4px); border-color: var(--color-accent); }
  .card .num { font-family: var(--font-mono); font-size: 0.7rem; color: var(--color-accent); }
  .card h3 { font-size: 1.5rem; margin: 0.5rem 0; font-weight: 300; }
  .card p { color: var(--color-mute); margin: 0; }
  .chip { display: inline-block; font-family: var(--font-mono); font-size: 0.7rem; padding: 0.2rem 0.6rem; background: color-mix(in oklch, var(--color-accent) 15%, transparent); color: var(--color-accent); border-radius: 999px; margin: 0.5rem 0.4rem 0 0; }
  footer { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--color-border); font-size: 0.85rem; color: var(--color-mute); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
  @media (prefers-reduced-motion: reduce) { .aurora { animation: none; } * { transition: none !important; } }
  @media (max-width: 768px) { .aurora { filter: blur(40px); opacity: 0.4; } }
</style>
<div class="aurora"></div>
<div class="wrap">
  <nav>
    <span class="name">${escapeHtml(state.name || "Your Name")}</span>
    <div class="links">${navLinks(state)}</div>
  </nav>
  <section class="hero">
    <p class="eyebrow">${escapeHtml(state.role || "Your Role")}</p>
    <h1>${escapeHtml(state.name || "Your Name")}</h1>
    ${state.tagline ? `<p class="tagline">${escapeHtml(state.tagline)}</p>` : ""}
    ${state.location ? `<p class="loc">— ${escapeHtml(state.location)}</p>` : ""}
  </section>
  ${state.sections.projects ? `
  <section class="work">
    <h2>Selected work.</h2>
    <div class="grid">
      ${projects.map((p, i) => `
        <div class="card">
          <span class="num">${String(i + 1).padStart(2, "0")}</span>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.summary)}</p>
          <div>${(p.stack || []).slice(0, 4).map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join("")}</div>
        </div>`).join("")}
    </div>
  </section>` : ""}
  <footer>
    <span>© ${new Date().getFullYear()} ${escapeHtml(state.name || "")}</span>
    ${state.showForgeAttribution ? `<span>Built with <a href="https://forge.zacgibson.work" style="color: var(--color-accent);">Forge</a></span>` : ""}
  </footer>
</div>`;
}

const renderers: Record<WizardState["preset"], (s: WizardState) => string> = {
  editorial: renderEditorial,
  minimalist: renderMinimalist,
  aurora: renderAurora,
};

export function renderPreviewHtml(state: WizardState): string {
  const body = renderers[state.preset](state);
  return `<!doctype html>
<html lang="en"${state.darkMode || state.preset === "aurora" ? ' data-theme="dark"' : ""}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(state.name || "Preview")} — Preview</title>
  ${fontLink(state)}
</head>
<body>${body}</body>
</html>`;
}
