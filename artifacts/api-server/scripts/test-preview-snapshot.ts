import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPreviewHtml } from "../src/forge/preview-renderer";
import {
  WizardStateSchema,
  type WizardState,
  type Palette,
} from "../src/forge/schemas";
import { editorialTemplates } from "../src/forge/templates/editorial";
import { minimalistTemplates } from "../src/forge/templates/minimalist";
import { auroraTemplates } from "../src/forge/templates/aurora";

type PresetId = WizardState["preset"];

// Parity markers extracted from the Astro template source strings. If a
// marker appears in the template, it MUST appear in the preview, and
// vice versa. This guards against preview/export drift on either side.
type ParityCheck = { name: string; marker: string };

const PARITY: Record<PresetId, ParityCheck[]> = {
  editorial: [
    { name: "max-width 720px wrap", marker: "max-width: 720px" },
    { name: "project-card hover accent line", marker: ".project-card::before" },
    { name: "project-card scale-in hover", marker: ".project-card:hover::before" },
    { name: "Instrument Serif font", marker: "Instrument Serif" },
    { name: "chip border", marker: "border: 1px solid var(--color-border)" },
  ],
  minimalist: [
    { name: "max-width 640px wrap", marker: "max-width: 640px" },
    { name: "JetBrains Mono font", marker: "JetBrains Mono" },
    { name: "blink cursor animation", marker: "@keyframes blink" },
    { name: "literal :: separator", marker: " :: <a href=\"/projects\"" },
    { name: "footer 'forged' link", marker: ">forged</a>" },
  ],
  aurora: [
    { name: "max-width 1100px wrap", marker: "max-width: 1100px" },
    { name: "bento-card hover lift", marker: "border-radius: 1.5rem" },
    { name: "cubic-bezier hover transition", marker: "cubic-bezier(0.16, 1, 0.3, 1)" },
    { name: "aurora gradient layer", marker: "radial-gradient(60% 60% at 20% 30%" },
    { name: "drift keyframes", marker: "@keyframes drift" },
    { name: "Inter display font", marker: "Inter" },
  ],
};

function templateBundleFor(preset: PresetId): Record<string, string> {
  if (preset === "editorial") return editorialTemplates;
  if (preset === "minimalist") return minimalistTemplates;
  return auroraTemplates;
}

function templateText(preset: PresetId): string {
  return Object.values(templateBundleFor(preset)).join("\n");
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = path.join(__dirname, "__snapshots__");

const PALETTES: Record<PresetId, Palette> = {
  editorial: {
    bg: "#fbfaf7",
    surface: "#ffffff",
    border: "#e5e1d8",
    text: "#1a1a1a",
    mute: "#6b6b6b",
    accent: "#b8431a",
  },
  minimalist: {
    bg: "#0a0a0a",
    surface: "#111111",
    border: "#222222",
    text: "#e5e5e5",
    mute: "#888888",
    accent: "#7dd3fc",
  },
  aurora: {
    bg: "#06070d",
    surface: "#0e1122",
    border: "#1f2540",
    text: "#f4f5ff",
    mute: "#9aa1c4",
    accent: "#7c5cff",
    accent2: "#22d3ee",
  },
};

function makeFixture(preset: PresetId): WizardState {
  return WizardStateSchema.parse({
    name: "Test User",
    role: "Software Designer",
    tagline: "I build small, sharp software for people who care about craft.",
    location: "Brooklyn, NY",
    preset,
    palette: PALETTES[preset],
    paletteName: "default",
    darkMode: preset !== "editorial",
    fontPair: "modern",
    radiusScale: "soft",
    sections: {
      projects: true,
      writing: false,
      about: true,
      contact: true,
      now: false,
      uses: false,
    },
    githubUsername: "testuser",
    footerStyle: "minimal",
    showForgeAttribution: true,
    projects: [
      {
        id: "atlas",
        title: "Atlas",
        summary: "A map of every public dataset on the open web.",
        stack: ["TypeScript", "Postgres", "Cloudflare"],
        role: "Engineer",
        date: "2024",
        liveUrl: "https://example.com/atlas",
        repoUrl: "https://github.com/example/atlas",
      },
      {
        id: "ember",
        title: "Ember",
        summary: "A note-taking app that remembers what matters.",
        stack: ["Swift", "CoreData"],
        date: "2023",
      },
    ],
    domain: "testuser.example",
    email: "test@example.com",
  });
}

// Stabilize anything time-dependent so snapshots are deterministic.
function normalize(html: string): string {
  return html.replace(/© \d{4} /g, "© YYYY ").replace(/built \d{4}/g, "built YYYY");
}

async function readIfExists(file: string): Promise<string | null> {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

async function main() {
  const presets: PresetId[] = ["editorial", "minimalist", "aurora"];
  const update = process.env.UPDATE_SNAPSHOTS === "1";
  await mkdir(SNAP_DIR, { recursive: true });

  let failures = 0;
  for (const preset of presets) {
    const html = normalize(renderPreviewHtml(makeFixture(preset)));

    // Parity check: each marker must appear in BOTH the preview and the
    // exported template source. This catches drift on either side.
    const tpl = templateText(preset);
    for (const check of PARITY[preset]) {
      const inPreview = html.includes(check.marker);
      const inTemplate = tpl.includes(check.marker);
      if (!inPreview || !inTemplate) {
        failures++;
        console.error(
          `  ✗ ${preset} parity drift — "${check.name}" missing from ${
            !inPreview && !inTemplate
              ? "preview AND template"
              : !inPreview
                ? "preview"
                : "template"
          } (marker: ${JSON.stringify(check.marker)})`,
        );
      }
    }

    const snapFile = path.join(SNAP_DIR, `preview-${preset}.html`);
    const existing = await readIfExists(snapFile);

    if (update || existing === null) {
      await writeFile(snapFile, html, "utf8");
      console.log(`  ${existing === null ? "+" : "↻"} wrote ${path.relative(process.cwd(), snapFile)}`);
      continue;
    }

    if (existing === html) {
      console.log(`  ✓ ${preset} matches snapshot`);
    } else {
      failures++;
      console.error(`  ✗ ${preset} preview HTML drifted from snapshot`);
      console.error(`    Snapshot:   ${snapFile}`);
      console.error(`    To update:  UPDATE_SNAPSHOTS=1 pnpm --filter @workspace/api-server run test:preview-snapshot`);
      // Print a small diff hint: first differing line
      const a = existing.split("\n");
      const b = html.split("\n");
      const max = Math.max(a.length, b.length);
      for (let i = 0; i < max; i++) {
        if (a[i] !== b[i]) {
          console.error(`    First diff at line ${i + 1}:`);
          console.error(`      expected: ${(a[i] ?? "<eof>").slice(0, 200)}`);
          console.error(`      actual:   ${(b[i] ?? "<eof>").slice(0, 200)}`);
          break;
        }
      }
    }
  }

  if (failures > 0) {
    process.exit(1);
  }
  console.log("\nAll preview snapshots OK.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
