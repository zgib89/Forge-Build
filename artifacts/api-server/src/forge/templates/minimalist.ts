export const minimalistTemplates: Record<string, string> = {
  "src/styles/global.css": `@import "tailwindcss";

@theme {
  --color-bg: {{state.palette.bg}};
  --color-surface: {{state.palette.surface}};
  --color-border: {{state.palette.border}};
  --color-text: {{state.palette.text}};
  --color-mute: {{state.palette.mute}};
  --color-accent: {{state.palette.accent}};
  --color-accent-2: {{#if state.palette.accent2}}{{state.palette.accent2}}{{else}}{{state.palette.accent}}{{/if}};
  --font-display: {{font state.fontPair "display"}};
  --font-body: {{font state.fontPair "body"}};
  --font-mono: {{font state.fontPair "mono"}};
{{fxVars state}}
}

@layer base {
  :root { color-scheme: {{#if state.darkMode}}dark{{else}}light{{/if}}; }
  html {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }
  body { margin: 0; }
  a { color: var(--color-text); text-decoration: underline; text-decoration-color: var(--color-border); text-underline-offset: 3px; }
  a:hover { color: var(--color-accent); text-decoration-color: var(--color-accent); }
  ::selection { background: var(--color-accent); color: var(--color-bg); }
}

@view-transition { navigation: auto; }
{{fxRules state}}

.cursor::after {
  content: "_";
  animation: blink 1.1s steps(2) infinite;
  color: var(--color-accent);
  margin-left: 2px;
}
@keyframes blink { 50% { opacity: 0; } }
.divider { color: var(--color-mute); margin: 1.5rem 0; user-select: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001s !important;
    transition-duration: 0.001s !important;
  }
  .cursor::after { animation: none; }
}
`,

  "src/layouts/Layout.astro": `---
import "../styles/global.css";
interface Props { title?: string; description?: string; }
const { title = "{{jsonStr state.name}}", description = "{{jsonStr state.tagline}}" } = Astro.props;
---
<!doctype html>
<html lang="en"{{#if state.darkMode}} data-theme="dark"{{/if}}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="{{font state.fontPair "link"}}" rel="stylesheet" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <main style="max-width: 640px; margin: 0; padding: 4rem 2rem;">
      <slot />
      <div class="divider">---</div>
      <footer style="color: var(--color-mute); font-size: 0.85rem;">
        <div>built {{year}} :: {{state.name}}{{#if state.showForgeAttribution}} :: <a href="https://forge.zacgibson.work">forged</a>{{/if}}</div>
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
  <section>
    <h1 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">==[ {{state.name}} ]==<span class="cursor"></span></h1>
    <p>{{state.role}}{{#if state.location}} :: {{state.location}}{{/if}}</p>
    {{#if state.tagline}}<p style="color: var(--color-mute); margin-top: 0.5rem;">{{state.tagline}}</p>{{/if}}
    <p style="margin-top: 1rem;">
      {{#if state.sections.about}}<a href="/about">about</a>{{/if}}
      {{#if state.sections.projects}} :: <a href="/projects">work</a>{{/if}}
      {{#if state.sections.writing}} :: <a href="/writing">writing</a>{{/if}}
      {{#if state.sections.now}} :: <a href="/now">now</a>{{/if}}
      {{#if state.sections.uses}} :: <a href="/uses">uses</a>{{/if}}
      {{#if state.sections.contact}} :: <a href="/contact">contact</a>{{/if}}
    </p>
  </section>

  {{#if state.sections.projects}}
  <div class="divider">---</div>
  <section>
    <h2 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;"># projects</h2>
    {projects.map((p) => (
      <div style="margin-bottom: 0.75rem;">
        <span style="color: var(--color-mute);">{p.data.date || '----'} →</span>{' '}
        <strong>{p.data.title}</strong>{' '}
        <span style="color: var(--color-mute);">:: {p.data.summary}</span>
        {p.data.liveUrl && <> [<a href={p.data.liveUrl}>live</a>]</>}
        {p.data.repoUrl && <> [<a href={p.data.repoUrl}>src</a>]</>}
      </div>
    ))}
  </section>
  {{/if}}
</Layout>
`,

  "src/pages/about.astro": `---
import Layout from "../layouts/Layout.astro";
---
<Layout title={"about :: " + "{{jsonStr state.name}}"}>
  <section>
    <h1 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;"># about</h1>
    <p>{{#if state.tagline}}{{state.tagline}}{{else}}{{state.name}}, {{state.role}}.{{/if}}</p>
    <p style="margin-top: 1rem; color: var(--color-mute);">// edit src/pages/about.astro</p>
  </section>
</Layout>
`,

  "src/pages/contact.astro": `---
import Layout from "../layouts/Layout.astro";
---
<Layout title={"contact :: " + "{{jsonStr state.name}}"}>
  <section>
    <h1 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;"># contact</h1>
    <p>find me by email or on the network of your choice.</p>
    <p style="margin-top: 1rem; color: var(--color-mute);">// edit src/pages/contact.astro</p>
  </section>
</Layout>
`,

  "src/pages/projects/index.astro": `---
import Layout from "../../layouts/Layout.astro";
import { getCollection } from "astro:content";
const projects = (await getCollection("projects")).sort((a, b) => a.data.order - b.data.order);
---
<Layout title={"work :: " + "{{jsonStr state.name}}"}>
  <h1 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;"># work</h1>
  {projects.map((p) => (
    <div style="margin-bottom: 0.5rem;">
      <span style="color: var(--color-mute);">{p.data.date || '----'} →</span>{' '}
      <a href={\`/projects/\${p.id}\`}>{p.data.title}</a>{' '}
      <span style="color: var(--color-mute);">:: {p.data.summary}</span>
    </div>
  ))}
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
  <h1 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem;"># {entry.data.title}</h1>
  <p style="color: var(--color-mute); margin-bottom: 1rem;">{entry.data.summary}</p>
  <p style="color: var(--color-mute); margin-bottom: 1.5rem;">stack :: {entry.data.stack.join(', ')}</p>
  <div class="divider">---</div>
  <Content />
</Layout>
`,
};
