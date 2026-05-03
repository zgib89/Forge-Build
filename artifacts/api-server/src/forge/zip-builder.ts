import JSZip from "jszip";
import { sharedTemplates, projectMarkdownTemplate } from "./templates/shared";
import { editorialTemplates } from "./templates/editorial";
import { minimalistTemplates } from "./templates/minimalist";
import { auroraTemplates } from "./templates/aurora";
import { render, buildContext } from "./template-engine";
import type { WizardState } from "./schemas";

const presetTemplateMap: Record<WizardState["preset"], Record<string, string>> = {
  editorial: editorialTemplates,
  minimalist: minimalistTemplates,
  aurora: auroraTemplates,
};

function dataUrlToBuffer(dataUrl: string): Buffer | null {
  const idx = dataUrl.indexOf(",");
  if (idx === -1) return null;
  return Buffer.from(dataUrl.slice(idx + 1), "base64");
}

function dataUrlExt(dataUrl: string): string {
  const m = /^data:image\/([a-z0-9+]+);/i.exec(dataUrl);
  if (!m) return "png";
  const t = m[1].toLowerCase();
  if (t === "jpeg") return "jpg";
  return t;
}

export async function buildPortfolioZip(state: WizardState): Promise<Buffer> {
  const zip = new JSZip();
  const ctx = buildContext(state);

  for (const [path, source] of Object.entries(sharedTemplates)) {
    zip.file(path, render(source, ctx));
  }

  const presetFiles = presetTemplateMap[state.preset];
  for (const [path, source] of Object.entries(presetFiles)) {
    zip.file(path, render(source, ctx));
  }

  const optionalPages: Array<[keyof WizardState["sections"], string, string]> = [
    ["writing", "writing", "Writing"],
    ["now", "now", "Now"],
    ["uses", "uses", "Uses"],
  ];
  for (const [key, slug, title] of optionalPages) {
    if (state.sections[key]) {
      const page = `---
import Layout from "../layouts/Layout.astro";
---
<Layout title={"${title} — " + ${JSON.stringify(state.name)}}>
  <section style="padding: 4rem 0;">
    <p style="text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.75rem; color: var(--color-accent); margin-bottom: 1rem;">${title}</p>
    <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem;">${title}.</h1>
    <p style="color: var(--color-mute); line-height: 1.6; max-width: 36rem;">
      Edit <code>src/pages/${slug}.astro</code> to customize this page.
    </p>
  </section>
</Layout>
`;
      zip.file(`src/pages/${slug}.astro`, page);
    }
  }

  if (state.profilePhoto) {
    const buf = dataUrlToBuffer(state.profilePhoto);
    if (buf) {
      const ext = dataUrlExt(state.profilePhoto);
      zip.file(`public/profile.${ext}`, buf);
    }
  }

  for (let i = 0; i < state.projects.length; i++) {
    const p = state.projects[i];
    let coverPath: string | undefined;
    if (p.coverImage) {
      const buf = dataUrlToBuffer(p.coverImage);
      if (buf) {
        const ext = dataUrlExt(p.coverImage);
        const name = `${p.id}.${ext}`;
        zip.file(`public/projects/${name}`, buf);
        coverPath = `/projects/${name}`;
      }
    }
    const md = render(projectMarkdownTemplate, {
      title: p.title,
      summary: p.summary,
      stack: p.stack,
      role: p.role,
      date: p.date,
      liveUrl: p.liveUrl,
      repoUrl: p.repoUrl,
      cover: coverPath,
      order: i,
    });
    zip.file(`src/content/projects/${p.id}.md`, md);
  }

  if (state.projects.length === 0) {
    const example = render(projectMarkdownTemplate, {
      title: "Example project",
      summary: "Replace this file with your own work in src/content/projects/.",
      stack: ["Astro", "Cloudflare"],
      order: 0,
    });
    zip.file("src/content/projects/example.md", example);
  }

  return zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
