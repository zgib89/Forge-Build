import type { WizardState, Project } from "./schemas";
import { renderPreviewHtml } from "./preview-renderer";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
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
html, body { margin: 0; background: var(--color-bg); color: var(--color-text); -webkit-font-smoothing: antialiased; font-family: var(--font-body); line-height: 1.6; }
a { color: inherit; text-decoration: none; }
::selection { background: var(--color-accent); color: var(--color-bg); }
main { max-width: 720px; margin: 0 auto; padding: 0 1.5rem; }
nav { display: flex; align-items: center; justify-content: space-between; padding: 2rem 0; border-bottom: 1px solid var(--color-border); }
nav .name { font-family: var(--font-display); font-size: 1.25rem; }
nav .links { display: flex; gap: 1.5rem; font-size: 0.875rem; font-weight: 500; color: var(--color-mute); flex-wrap: wrap; }
nav .links a:hover { color: var(--color-accent); }
h1, h2, h3 { font-family: var(--font-display); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 1rem; }
.page { padding: 4rem 0 6rem; }
.page h1 { font-size: 3rem; margin-bottom: 2rem; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; font-weight: 600; color: var(--color-accent); margin: 0 0 1rem; }
.muted { color: var(--color-mute); }
.lede { font-size: 1.25rem; color: var(--color-mute); max-width: 36rem; margin-bottom: 1.5rem; }
.project-list { list-style: none; padding: 0; margin: 0; }
.project-list li { border-top: 1px solid var(--color-border); padding: 1.5rem 0; }
.project-list li:last-child { border-bottom: 1px solid var(--color-border); }
.project-list h2 { font-size: 1.5rem; margin-bottom: 0.25rem; }
.project-list .meta { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-mute); margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.06em; }
.project-list .summary { color: var(--color-mute); margin: 0 0 0.5rem; }
.project-list .links { display: flex; gap: 1rem; font-size: 0.875rem; color: var(--color-accent); margin-top: 0.75rem; }
.chip { display: inline-block; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.2rem 0.5rem; border: 1px solid var(--color-border); margin-right: 0.4rem; margin-top: 0.4rem; color: var(--color-mute); }
footer { padding: 2.5rem 0; border-top: 1px solid var(--color-border); font-size: 0.875rem; color: var(--color-mute); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
.contact-list { list-style: none; padding: 0; margin: 1.5rem 0; }
.contact-list li { padding: 0.5rem 0; }
.contact-list a { color: var(--color-accent); }
`;
}

function navItems(state: WizardState): string {
  const items: string[] = [];
  if (state.sections.about) items.push(`<a href="/about/">About</a>`);
  if (state.sections.projects) items.push(`<a href="/projects/">Work</a>`);
  if (state.sections.writing) items.push(`<a href="/writing/">Writing</a>`);
  if (state.sections.now) items.push(`<a href="/now/">Now</a>`);
  if (state.sections.uses) items.push(`<a href="/uses/">Uses</a>`);
  if (state.sections.contact) items.push(`<a href="/contact/">Contact</a>`);
  return items.join("");
}

function pageShell(state: WizardState, title: string, body: string): string {
  const fp = PRESET_FONTS[state.preset];
  const isDark = state.darkMode || state.preset === "aurora";
  const name = escapeHtml(state.name || "Portfolio");
  return `<!doctype html>
<html lang="en"${isDark ? ' data-theme="dark"' : ""}>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)} · ${name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fp.link}" rel="stylesheet">
<style>${tokenCss(state)}</style>
</head>
<body>
<main>
  <nav>
    <a href="/" class="name">${name}</a>
    <div class="links">${navItems(state)}</div>
  </nav>
  ${body}
  <footer>
    <span>© ${new Date().getFullYear()} ${name}</span>
    ${state.showForgeAttribution ? `<span>Built with <a href="https://forge.zacgibson.work" style="color: var(--color-accent);">Forge</a></span>` : ""}
  </footer>
</main>
</body>
</html>`;
}

function renderAbout(state: WizardState): string {
  const body = `<section class="page">
    <p class="eyebrow">About</p>
    <h1>${escapeHtml(state.name || "About me")}</h1>
    ${state.tagline ? `<p class="lede">${escapeHtml(state.tagline)}</p>` : ""}
    <p class="muted">${escapeHtml(state.role || "")}${state.location ? ` · ${escapeHtml(state.location)}` : ""}</p>
    <p style="margin-top: 1.5rem;">Edit <code style="font-family: var(--font-mono);">src/pages/about.astro</code> in your generated project to tell your full story.</p>
  </section>`;
  return pageShell(state, "About", body);
}

function renderContact(state: WizardState): string {
  const body = `<section class="page">
    <p class="eyebrow">Contact</p>
    <h1>Get in touch</h1>
    <p class="lede">The fastest way to reach ${escapeHtml(state.name || "me")} is below.</p>
    <ul class="contact-list">
      ${state.email ? `<li>Email · <a href="mailto:${escapeHtml(state.email)}">${escapeHtml(state.email)}</a></li>` : ""}
      ${state.githubUsername ? `<li>GitHub · <a href="https://github.com/${escapeHtml(state.githubUsername)}" rel="noopener">@${escapeHtml(state.githubUsername)}</a></li>` : ""}
    </ul>
    <p class="muted">Edit <code style="font-family: var(--font-mono);">src/pages/contact.astro</code> to add more channels.</p>
  </section>`;
  return pageShell(state, "Contact", body);
}

function renderProjectsIndex(state: WizardState): string {
  const projects = state.projects;
  const list = projects.length
    ? `<ul class="project-list">${projects
        .map(
          (p) => `<li>
        <p class="meta">${escapeHtml(p.date || "")}${p.role ? ` · ${escapeHtml(p.role)}` : ""}</p>
        <h2><a href="/projects/${encodeURIComponent(p.id)}/">${escapeHtml(p.title)}</a></h2>
        <p class="summary">${escapeHtml(p.summary)}</p>
        <div>${(p.stack || []).map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join("")}</div>
      </li>`,
        )
        .join("")}</ul>`
    : `<p class="muted">No projects yet — add them in step 5 and re-deploy.</p>`;
  const body = `<section class="page">
    <p class="eyebrow">Selected work</p>
    <h1>Projects</h1>
    ${list}
  </section>`;
  return pageShell(state, "Projects", body);
}

function renderProjectDetail(state: WizardState, p: Project): string {
  const links: string[] = [];
  if (p.liveUrl) links.push(`<a href="${escapeHtml(p.liveUrl)}" rel="noopener">Live →</a>`);
  if (p.repoUrl) links.push(`<a href="${escapeHtml(p.repoUrl)}" rel="noopener">Source →</a>`);
  const body = `<section class="page">
    <p class="eyebrow"><a href="/projects/" style="color: var(--color-accent);">← All projects</a></p>
    <h1>${escapeHtml(p.title)}</h1>
    <p class="lede">${escapeHtml(p.summary)}</p>
    <p class="muted">${escapeHtml(p.date || "")}${p.role ? ` · ${escapeHtml(p.role)}` : ""}</p>
    <div style="margin: 1rem 0;">${(p.stack || []).map((s) => `<span class="chip">${escapeHtml(s)}</span>`).join("")}</div>
    ${links.length ? `<div class="links" style="display:flex; gap:1rem; margin-top:1.5rem;">${links.join("")}</div>` : ""}
    <p class="muted" style="margin-top:2rem;">Add a longer write-up in your generated project at <code style="font-family: var(--font-mono);">src/content/projects/${escapeHtml(p.id)}.md</code>.</p>
  </section>`;
  return pageShell(state, p.title, body);
}

function renderSimplePage(state: WizardState, eyebrow: string, title: string, blurb: string, slug: string): string {
  const body = `<section class="page">
    <p class="eyebrow">${escapeHtml(eyebrow)}</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="lede">${escapeHtml(blurb)}</p>
    <p class="muted">Edit <code style="font-family: var(--font-mono);">src/pages/${slug}.astro</code> in your generated project to flesh this page out.</p>
  </section>`;
  return pageShell(state, title, body);
}

function render404(state: WizardState): string {
  const body = `<section class="page">
    <p class="eyebrow">404</p>
    <h1>Page not found</h1>
    <p class="lede">That page doesn't exist (or moved).</p>
    <p><a href="/" style="color: var(--color-accent);">← Back to home</a></p>
  </section>`;
  return pageShell(state, "Not found", body);
}

export interface RouteFile {
  path: string;
  html: string;
}

export function renderAllRoutes(state: WizardState): RouteFile[] {
  const files: RouteFile[] = [];
  files.push({ path: "/index.html", html: renderPreviewHtml(state) });
  if (state.sections.about) files.push({ path: "/about/index.html", html: renderAbout(state) });
  if (state.sections.contact) files.push({ path: "/contact/index.html", html: renderContact(state) });
  if (state.sections.projects) {
    files.push({ path: "/projects/index.html", html: renderProjectsIndex(state) });
    for (const p of state.projects) {
      files.push({
        path: `/projects/${p.id}/index.html`,
        html: renderProjectDetail(state, p),
      });
    }
  }
  if (state.sections.writing) {
    files.push({
      path: "/writing/index.html",
      html: renderSimplePage(state, "Writing", "Writing", "Notes, essays, and field reports.", "writing"),
    });
  }
  if (state.sections.now) {
    files.push({
      path: "/now/index.html",
      html: renderSimplePage(state, "Now", "What I'm doing now", "A snapshot of current focus, inspired by /now.", "now"),
    });
  }
  if (state.sections.uses) {
    files.push({
      path: "/uses/index.html",
      html: renderSimplePage(state, "Uses", "What I use", "Hardware, software, and everyday tools I rely on.", "uses"),
    });
  }
  files.push({ path: "/404.html", html: render404(state) });
  return files;
}
