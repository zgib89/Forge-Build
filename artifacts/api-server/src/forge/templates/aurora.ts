export const auroraTemplates: Record<string, string> = {
  "src/styles/global.css": `@import "tailwindcss";
@import "tw-animate-css";

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
  :root { color-scheme: dark; }
  html {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }
  body { margin: 0; overflow-x: hidden; }
  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 200;
    letter-spacing: -0.04em;
    line-height: 1;
    text-wrap: balance;
  }
  a { color: inherit; text-decoration: none; }
  ::selection { background: var(--color-accent); color: var(--color-bg); }
}

@view-transition { navigation: auto; }
{{fxRules state}}

.aurora {
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(60% 60% at 20% 30%, var(--color-accent) 0%, transparent 60%),
    radial-gradient(50% 50% at 80% 20%, var(--color-accent-2) 0%, transparent 60%),
    radial-gradient(70% 70% at 50% 90%, var(--color-accent) 0%, transparent 70%),
    var(--color-bg);
  filter: blur(calc(52px + var(--fx-glow) * 10px)) saturate(calc(1 + var(--fx-glow) * .08));
  opacity: calc(.42 + var(--fx-glow) * .08);
  animation: drift 40s ease-in-out infinite alternate;
}
@keyframes drift {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  100% { transform: translate3d(-5%, 5%, 0) scale(1.1); }
}

.bento-card {
  background: color-mix(in oklch, var(--color-surface) 60%, transparent);
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  padding: 2rem;
  backdrop-filter: blur(calc(8px + var(--fx-glass) * 5px));
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms, box-shadow 300ms;
  box-shadow: 0 0 calc(var(--fx-edge) * 8px) color-mix(in oklch, var(--color-accent) calc(var(--fx-glow) * 5%), transparent);
}
.bento-card:hover {
  transform: translateY(calc(-1 * var(--fx-hover-depth)));
  border-color: var(--color-accent);
}

.chip {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  background: color-mix(in oklch, var(--color-accent) 15%, transparent);
  color: var(--color-accent);
  border-radius: 999px;
  margin-right: 0.4rem;
  margin-top: 0.4rem;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001s !important;
    transition-duration: 0.001s !important;
  }
  .aurora { animation: none; }
}

@media (max-width: 768px) {
  .aurora { filter: blur(40px); opacity: 0.4; }
}
`,

  "src/layouts/Layout.astro": `---
import "../styles/global.css";
interface Props { title?: string; description?: string; }
const { title = "{{jsonStr state.name}} — {{jsonStr state.role}}", description = "{{jsonStr state.tagline}}" } = Astro.props;
---
<!doctype html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="{{font state.fontPair "link"}}" rel="stylesheet" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
  </head>
  <body>
    <div class="aurora"></div>
    <main class="mx-auto px-6 py-8" style="max-width: 1100px; position: relative;">
      <nav class="flex items-center justify-between mb-12">
        <a href="/" class="text-lg font-medium tracking-tight">{{state.name}}</a>
        <div class="flex gap-6 text-sm" style="color: var(--color-mute);">
          {{#if state.sections.about}}<a href="/about" class="hover:text-white transition">About</a>{{/if}}
          {{#if state.sections.projects}}<a href="/projects" class="hover:text-white transition">Work</a>{{/if}}
          {{#if state.sections.writing}}<a href="/writing" class="hover:text-white transition">Writing</a>{{/if}}
          {{#if state.sections.now}}<a href="/now" class="hover:text-white transition">Now</a>{{/if}}
          {{#if state.sections.uses}}<a href="/uses" class="hover:text-white transition">Uses</a>{{/if}}
          {{#if state.sections.contact}}<a href="/contact" class="hover:text-white transition">Contact</a>{{/if}}
        </div>
      </nav>
      <slot />
      <footer class="mt-32 pt-8 text-sm" style="color: var(--color-mute); border-top: 1px solid var(--color-border);">
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
  <section class="py-20">
    <p class="font-mono text-xs uppercase tracking-widest mb-6" style="color: var(--color-accent);">{{state.role}}</p>
    <h1 class="text-7xl md:text-9xl mb-8" style="font-weight: 200;">{{state.name}}</h1>
    {{#if state.tagline}}<p class="text-2xl max-w-2xl" style="color: var(--color-mute); font-weight: 300;">{{state.tagline}}</p>{{/if}}
    {{#if state.location}}<p class="mt-6 font-mono text-sm" style="color: var(--color-mute);">— {{state.location}}</p>{{/if}}
  </section>

  {{#if state.sections.projects}}
  <section class="mt-12">
    <h2 class="text-4xl mb-8">Selected work.</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((p, i) => (
        <a href={\`/projects/\${p.id}\`} class="bento-card block">
          <span class="font-mono text-xs" style="color: var(--color-accent);">{String(i + 1).padStart(2, '0')}</span>
          <h3 class="text-2xl mt-3 mb-2" style="font-weight: 300;">{p.data.title}</h3>
          <p style="color: var(--color-mute);">{p.data.summary}</p>
          <div class="mt-4">{p.data.stack.slice(0, 4).map((s) => <span class="chip">{s}</span>)}</div>
        </a>
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
  <section class="py-20">
    <p class="font-mono text-xs uppercase tracking-widest mb-6" style="color: var(--color-accent);">About</p>
    <h1 class="text-6xl mb-10" style="font-weight: 200;">{{state.name}}</h1>
    <p class="text-2xl max-w-3xl leading-relaxed" style="color: var(--color-mute); font-weight: 300;">
      {{#if state.tagline}}{{state.tagline}}{{else}}I'm {{state.name}}, working as a {{state.role}}{{#if state.location}} from {{state.location}}{{/if}}.{{/if}}
    </p>
    <p class="mt-6 max-w-3xl" style="color: var(--color-mute);">
      Edit <code class="font-mono text-sm" style="color: var(--color-accent);">src/pages/about.astro</code> to tell your story.
    </p>
  </section>
</Layout>
`,

  "src/pages/contact.astro": `---
import Layout from "../layouts/Layout.astro";
---
<Layout title={"Contact — " + "{{jsonStr state.name}}"}>
  <section class="py-20">
    <p class="font-mono text-xs uppercase tracking-widest mb-6" style="color: var(--color-accent);">Contact</p>
    <h1 class="text-6xl mb-10" style="font-weight: 200;">Let's talk.</h1>
    <p class="text-2xl max-w-3xl" style="color: var(--color-mute); font-weight: 300;">
      The fastest way to reach me is email. Edit <code class="font-mono text-sm">src/pages/contact.astro</code>.
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
  <section class="py-20">
    <h1 class="text-6xl mb-12" style="font-weight: 200;">Work.</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((p, i) => (
        <a href={\`/projects/\${p.id}\`} class="bento-card block">
          <span class="font-mono text-xs" style="color: var(--color-accent);">{String(i + 1).padStart(2, '0')}</span>
          <h3 class="text-2xl mt-3 mb-2" style="font-weight: 300;">{p.data.title}</h3>
          <p style="color: var(--color-mute);">{p.data.summary}</p>
        </a>
      ))}
    </div>
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
  <section class="py-20">
    <p class="font-mono text-xs uppercase tracking-widest mb-6" style="color: var(--color-accent);">Project</p>
    <h1 class="text-6xl mb-6" style="font-weight: 200;">{entry.data.title}</h1>
    <p class="text-2xl mb-8" style="color: var(--color-mute); font-weight: 300;">{entry.data.summary}</p>
    <div class="mb-12">{entry.data.stack.map((s) => <span class="chip">{s}</span>)}</div>
    <div class="prose prose-invert"><Content /></div>
  </section>
</Layout>
`,
};
