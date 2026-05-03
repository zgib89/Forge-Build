import { useMemo, useState } from "react";
import { apiUrl } from "../lib/api";
import { PRESETS, type PresetId } from "../lib/presets";
import {
  PRESET_FONT_DEFAULTS,
  PRESET_RADIUS_DEFAULTS,
  type FontPairId,
  type RadiusScaleId,
} from "../lib/typography";

const DEMO_PROJECTS = [
  {
    id: "p1",
    title: "JotterDown",
    summary: "A writing OS for builders. Markdown-first notes, instant publishing.",
    stack: ["Astro", "TypeScript", "Cloudflare"],
    role: "Solo build",
    date: "2026",
    liveUrl: "https://jotterdown.com",
    repoUrl: "",
  },
  {
    id: "p2",
    title: "RighteousRecon",
    summary: "OSINT tooling for indie investigators. Fast, private, opinionated.",
    stack: ["Next.js", "Postgres", "Tailwind"],
    role: "Solo build",
    date: "2025",
    liveUrl: "https://righteousrecon.com",
    repoUrl: "",
  },
  {
    id: "p3",
    title: "Forge",
    summary: "The portfolio generator you're looking at. Yours forever.",
    stack: ["React", "Astro", "Cloudflare Workers"],
    role: "Solo build",
    date: "2026",
    liveUrl: "",
    repoUrl: "",
  },
];

function buildState(presetId: PresetId) {
  const preset = PRESETS.find((p) => p.id === presetId)!;
  const palette = preset.palettes[0];
  return {
    name: "Ada Lovelace",
    role: presetId === "minimalist" ? "Infrastructure Engineer" : presetId === "aurora" ? "Creative Technologist" : "Independent Engineer",
    tagline:
      presetId === "minimalist"
        ? "Shipping infrastructure that disappears."
        : presetId === "aurora"
          ? "Where code becomes light."
          : "Building the tools I wish existed.",
    location: "Murfreesboro, TN",
    preset: presetId,
    palette,
    paletteName: palette.name,
    darkMode: presetId === "aurora",
    fontPair: PRESET_FONT_DEFAULTS[presetId] as FontPairId,
    radiusScale: PRESET_RADIUS_DEFAULTS[presetId] as RadiusScaleId,
    sections: { projects: true, writing: false, about: true, contact: true, now: false, uses: false },
    githubUsername: "",
    footerStyle: "minimal",
    showForgeAttribution: true,
    projects: DEMO_PROJECTS,
    domain: "ada.work",
  };
}

interface Props {
  initial?: PresetId;
  showSwitcher?: boolean;
  height?: number;
  className?: string;
}

export default function LivePreview({ initial = "aurora", showSwitcher = true, height = 520, className }: Props) {
  const [active, setActive] = useState<PresetId>(initial);

  const src = useMemo(() => {
    const state = buildState(active);
    const encoded = encodeURIComponent(JSON.stringify(state));
    return `${apiUrl("/api/forge/preview")}?state=${encoded}`;
  }, [active]);

  return (
    <div className={`live-preview-shell ${className ?? ""}`}>
      <div className="live-preview-chrome">
        <div className="live-preview-dots">
          <span style={{ background: "#ff5f56" }} />
          <span style={{ background: "#ffbd2e" }} />
          <span style={{ background: "#27c93f" }} />
        </div>
        <div className="live-preview-url font-mono">
          ada.work / <span style={{ color: "var(--color-accent)" }}>{active}</span>
        </div>
        {showSwitcher && (
          <div className="live-preview-tabs" role="tablist" aria-label="Preset preview">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={active === p.id}
                onClick={() => setActive(p.id)}
                className="live-preview-tab"
                style={{
                  color: active === p.id ? "var(--color-bg)" : "var(--color-text-mute)",
                  background: active === p.id ? "var(--color-text)" : "transparent",
                }}
                data-testid={`live-preview-tab-${p.id}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <iframe
        title={`Live preview · ${active}`}
        src={src}
        sandbox="allow-same-origin"
        loading="lazy"
        className="live-preview-iframe"
        style={{ height }}
        data-testid={`live-preview-iframe-${active}`}
      />
    </div>
  );
}
