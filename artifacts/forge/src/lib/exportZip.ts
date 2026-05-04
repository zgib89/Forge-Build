import type { WizardState } from "./schemas";
import type JSZip from "jszip";
import { getFontPair } from "./typography";

function removePath(zip: JSZip, path: string) {
  zip.remove(path);
}

function removePrefix(zip: JSZip, prefix: string) {
  for (const name of Object.keys(zip.files)) {
    if (name === prefix || name.startsWith(prefix)) zip.remove(name);
  }
}

function upsertCssVar(css: string, name: string, value: string): string {
  const safeValue = value.replace(/[{};]/g, "");
  const re = new RegExp(`--${name}:\\s*[^;]+;`);
  if (re.test(css)) return css.replace(re, `--${name}: ${safeValue};`);
  return css.replace(/(--color-accent:\s*[^;]+;)/, `$1\n  --${name}: ${safeValue};`);
}

async function patchTextFile(
  zip: JSZip,
  path: string,
  patcher: (source: string) => string,
) {
  const file = zip.file(path);
  if (!file) return;
  zip.file(path, patcher(await file.async("string")));
}

function patchGlobalCss(css: string, state: WizardState): string {
  const font = getFontPair(state.fontPair);
  const vars: Record<string, string> = {
    "font-display": font.display,
    "font-body": font.body,
    "font-mono": font.mono,
    "color-accent-2": state.palette.accent2 ?? state.palette.accent,
    "fx-glow": String(state.glowIntensity ?? 1),
    "fx-edge": String(state.edgeGlow ?? 1),
    "fx-hover-depth": `${state.hoverDepth ?? 2}px`,
    "fx-grain": String(state.grainIntensity ?? 0),
    "fx-glass": String(state.glassBlur ?? 0),
    "fx-marquee-speed": `${state.marqueeSpeed ?? 30}s`,
  };
  let next = css;
  for (const [name, value] of Object.entries(vars)) {
    next = upsertCssVar(next, name, value);
  }
  return next;
}

function patchLayoutFonts(source: string, state: WizardState): string {
  const font = getFontPair(state.fontPair);
  return source.replace(
    /<link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet" \/>/,
    `<link href="${font.googleHref}" rel="stylesheet" />`,
  );
}

export async function postProcessExportZip(blob: Blob, state: WizardState): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());

  if (!state.sections.about) removePath(zip, "src/pages/about.astro");
  if (!state.sections.contact) removePath(zip, "src/pages/contact.astro");
  if (!state.sections.writing) removePath(zip, "src/pages/writing.astro");
  if (!state.sections.now) removePath(zip, "src/pages/now.astro");
  if (!state.sections.uses) removePath(zip, "src/pages/uses.astro");

  if (!state.sections.projects) {
    removePrefix(zip, "src/pages/projects");
    removePrefix(zip, "src/content/projects");
    removePrefix(zip, "public/projects");
  } else {
    const projectIds = new Set(state.projects.filter((p) => !p.draft).map((p) => p.id));
    for (const name of Object.keys(zip.files)) {
      const match = /^src\/content\/projects\/(.+)\.md$/.exec(name);
      if (match && !projectIds.has(match[1])) zip.remove(name);
    }
  }

  await patchTextFile(zip, "src/styles/global.css", (source) => patchGlobalCss(source, state));
  await patchTextFile(zip, "src/layouts/Layout.astro", (source) => patchLayoutFonts(source, state));

  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
