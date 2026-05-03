export const editorialTemplates: Record<string, string> = {
  "src/styles/global.css": `@import "tailwindcss";
@import "tw-animate-css";

@theme {
  --color-bg: {{state.palette.bg}};
  --color-surface: {{state.palette.surface}};
  --color-border: {{state.palette.border}};
  --color-text: {{state.palette.text}};
  --color-mute: {{state.palette.mute}};
  --color-accent: {{state.palette.accent}};

  --font-display: 'Instrument Serif', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

@layer base {
  :root {
    color-scheme: {{#if state.darkMode}}dark{{else}}light{{/if}};
  }
  html {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }
  body { margin: 0; }
  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 400;
    letter-spacing: -0.02em;
    text-wrap: balance;
    line-height: 1.05;
  }
  p { text-wrap: pretty; line-height: 1.6; }
  a { color: inherit; text-decoration: none; }
  ::selection { background: var(--color-accent); color: var(--color-bg); }
}

@view-transition { navigation: auto; }

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent);
  font-family: var(--font-body);
}

.dropcap::first-letter {
  font-family: var(--font-display);
  font-size: 5rem;
  float: left;
  line-height: 0.85;
  padding: 0.5rem 0.5rem 0 0;
  color: var(--color-accent);
}

.project-card {
  border-top: 1px solid var(--color-border);
  padding: 2rem 0;
  position: relative;
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.project-card:hover { transform: translateY(-2px); }
.project-card::before {
  content: "";
  position: absolute;
  left: -1rem;
  top: 2rem;
  bottom: 2rem;
  width: 2px;
  background: var(--color-accent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.project-card:hover::before { transform: scaleY(1); }

.chip {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.2rem 0.5rem;
  border: 1px solid var(--color-border);
  margin-right: 0.4rem;
  margin-top: 0.4rem;
  color: var(--color-mute);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001s !important;
    transition-duration: 0.001s !important;
  }
}
`,

  "src/layouts/Layout.astro": `---
import "../styles/global.css";
interface Props { title?: string; description?: string; }
const { title = "{{jsonStr state.name}} — {{jsonStr state.role}}", description = "{{jsonStr state.tagline}}" } = Astro.props;
---
<!doctype html>
<html lang="en"{{#if state.darkMode}} data-theme="dark"{{/if}}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
  </head>
  <body>
    <main class="mx-auto px-6" style="max-width: 720px;">
      <nav class="flex items-center justify-between py-8 border-b" style="border-color: var(--color-border);">
        <a href="/" class="font-display text-xl">{{state.name}}</a>
        <div class="flex gap-6 text-sm font-medium" style="color: var(--color-mute);">
          {{#if state.sections.about}}<a href="/about">About</a>{{/if}}
          {{#if state.sections.projects}}<a href="/projects">Work</a>{{/if}}
          {{#if state.sections.writing}}<a href="/writing">Writing</a>{{/if}}
          {{#if state.sections.now}}<a href="/now">Now</a>{{/if}}
          {{#if state.sections.uses}}<a href="/uses">Uses</a>{{/if}}
          {{#if state.sections.contact}}<a href="/contact">Contact</a>{{/if}}
        </div>
      </nav>
      <slot />
      <footer class="mt-24 py-10 border-t text-sm" style="border-color: var(--color-border); color: var(--color-mute);">
        <div class="flex justify-between items-center flex-wrap gap-2">
          <span>© {{year}} {{state.name}}</span>
          {{#if state.showForgeAttribution}}<span>Built with <a href="https://forge.zacgibson.work" style="color: var(--color-accent);">Forge</a></span>{{/if}}
        </div>
      </footer>
    </main>
  </body>
</html>
`,

  "src/pages/index.astro": `---
import Layout from "../layouts/Layout.astro";
import { getCollection } from "astro:content";
{{#if state.sections.projects}}
const projects = (await getCollection("projects")).sort((a, b) => a.data.order - b.data.order);
{{/if}}
---
<Layout>
  <section class="pt-16 pb-12">
    <p class="eyebrow mb-4">Currently — {{state.role}}</p>
    <h1 class="text-6xl mb-6" style="line-height: 1;">{{state.name}}</h1>
    {{#if state.tagline}}<p class="text-xl" style="color: var(--color-mute); max-width: 36rem;">{{state.tagline}}</p>{{/if}}
    {{#if state.location}}<p class="mt-4 text-sm font-mono" style="color: var(--color-mute);">{{state.location}}</p>{{/if}}
  </section>

  {{#if state.sections.projects}}
  <section class="mt-16">
    <p class="eyebrow mb-6">Selected Work</p>
    <div>
      {projects.map((p, i) => (
        <article class="project-card">
          <div class="flex items-baseline justify-between mb-2">
            <h2 class="text-3xl">{p.data.title}</h2>
            <span class="font-mono text-xs" style="color: var(--color-mute);">{String(i + 1).padStart(2, '0')}</span>
          </div>
          <p class="mb-3" style="color: var(--color-mute);">{p.data.summary}</p>
          <div>{p.data.stack.map((s) => <span class="chip">{s}</span>)}</div>
          {(p.data.liveUrl || p.data.repoUrl) && (
            <div class="mt-4 flex gap-4 text-sm font-medium" style="color: var(--color-accent);">
              {p.data.liveUrl && <a href={p.data.liveUrl}>Live →</a>}
              {p.data.repoUrl && <a href={p.data.repoUrl}>Source →</a>}
            </div>
          )}
        </article>
      ))}
    </div>
  </section>
  {{/if}}
</Layout>
`,

  "src/pages/about.astro": `---
import Layout from "../layouts/Layout.astro";
---
<Layout title={"About — " + "{{jsonStr state.name}}"}>
  <section class="pt-16">
    <p class="eyebrow mb-4">About</p>
    <h1 class="text-5xl mb-8">{{state.name}}</h1>
    <p class="dropcap text-lg leading-relaxed mb-6">
      {{#if state.tagline}}{{state.tagline}}{{else}}I'm {{state.name}}, working as a {{state.role}}{{#if state.location}} from {{state.location}}{{/if}}.{{/if}}
    </p>
    <p class="text-lg leading-relaxed" style="color: var(--color-mute);">
      Edit <code class="font-mono text-sm" style="color: var(--color-accent);">src/pages/about.astro</code> to tell your story.
    </p>
  </section>
</Layout>
`,

  "src/pages/contact.astro": `---
import Layout from "../layouts/Layout.astro";
---
<Layout title={"Contact — " + "{{jsonStr state.name}}"}>
  <section class="pt-16">
    <p class="eyebrow mb-4">Get in touch</p>
    <h1 class="text-5xl mb-8">Say hello.</h1>
    <p class="text-lg" style="color: var(--color-mute);">
      The fastest way to reach me is email. Edit this page in <code class="font-mono text-sm">src/pages/contact.astro</code>.
    </p>
  </section>
</Layout>
`,

  "src/pages/projects/index.astro": `---
import Layout from "../../layouts/Layout.astro";
import { getCollection } from "astro:content";
const projects = (await getCollection("projects")).sort((a, b) => a.data.order - b.data.order);
---
<Layout title={"Work — " + "{{jsonStr state.name}}"}>
  <section class="pt-16">
    <p class="eyebrow mb-4">Work</p>
    <h1 class="text-5xl mb-12">Selected projects.</h1>
    {projects.map((p, i) => (
      <article class="project-card">
        <div class="flex items-baseline justify-between mb-2">
          <h2 class="text-3xl"><a href={\`/projects/\${p.id}\`}>{p.data.title}</a></h2>
          <span class="font-mono text-xs" style="color: var(--color-mute);">{String(i + 1).padStart(2, '0')}</span>
        </div>
        <p style="color: var(--color-mute);">{p.data.summary}</p>
      </article>
    ))}
  </section>
</Layout>
`,

  "src/pages/projects/[...slug].astro": `---
import Layout from "../../layouts/Layout.astro";
import { getCollection, render } from "astro:content";
export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((p) => ({ params: { slug: p.id }, props: { entry: p } }));
}
const { entry } = Astro.props;
const { Content } = await render(entry);
---
<Layout title={entry.data.title}>
  <section class="pt-16">
    <p class="eyebrow mb-4">Project</p>
    <h1 class="text-5xl mb-4">{entry.data.title}</h1>
    <p class="text-xl mb-8" style="color: var(--color-mute);">{entry.data.summary}</p>
    <div>{entry.data.stack.map((s) => <span class="chip">{s}</span>)}</div>
    <div class="mt-10 prose">
      <Content />
    </div>
  </section>
</Layout>
`,
};
