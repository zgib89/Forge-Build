import { useEffect, useMemo, useState } from "react";
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
    title: "Selected work sample",
    summary: "A short proof point, project, client result, service transformation, or case study.",
    stack: ["Skill", "Method", "Outcome"],
    role: "Your contribution",
    date: "2026",
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: "p2",
    title: "Client or team win",
    summary: "Explain the problem, what you did, and the result in one clean sentence.",
    stack: ["Service", "Tool", "Result"],
    role: "Owner",
    date: "2025",
    liveUrl: "",
    repoUrl: "",
  },
  {
    id: "p3",
    title: "Signature experience",
    summary: "Use this slot for a credential, gallery, campaign, job, lesson, article, or product.",
    stack: ["Proof", "Context", "Impact"],
    role: "Contributor",
    date: "2026",
    liveUrl: "",
    repoUrl: "",
  },
];

function buildState(presetId: PresetId) {
  const preset = PRESETS.find((p) => p.id === presetId)!;
  const palette = preset.palettes[0];
  return {
    name: "Your Name",
    role: presetId === "minimalist" ? "Your Role" : presetId === "aurora" ? "Your Creative Role" : "Your Professional Role",
    tagline:
      presetId === "minimalist"
        ? "A concise line about the outcomes you create."
        : presetId === "aurora"
          ? "A concise line about your style, service, or specialty."
          : "A concise line about your work, audience, and proof.",
    location: "Your City",
    careerCategory: "general",
    preset: presetId,
    palette,
    paletteName: palette.name,
    darkMode: presetId === "aurora",
    fontPair: PRESET_FONT_DEFAULTS[presetId] as FontPairId,
    radiusScale: PRESET_RADIUS_DEFAULTS[presetId] as RadiusScaleId,
    visualStyle: presetId === "aurora" ? "forge-glass" : presetId === "minimalist" ? "terminal-minimal" : "signal-dossier",
    cardStyle: presetId === "aurora" ? "forge-glass" : "border-line",
    backgroundTreatment: presetId === "aurora" ? "spotlight" : "grain",
    glowIntensity: presetId === "aurora" ? 3 : 1,
    edgeGlow: presetId === "aurora" ? 3 : 1,
    motionLevel: presetId === "minimalist" ? "calm" : "standard",
    marqueeSpeed: 30,
    hoverDepth: presetId === "minimalist" ? 1 : 3,
    grainIntensity: presetId === "aurora" ? 1 : 2,
    glassBlur: presetId === "aurora" ? 2 : 0,
    sections: { projects: true, writing: false, about: true, contact: true, now: false, uses: false },
    githubUsername: "",
    footerStyle: "minimal",
    showForgeAttribution: false,
    projects: DEMO_PROJECTS,
    domain: "your-site.work",
  };
}

function makePreviewHtmlSafe(raw: string): string {
  if (typeof DOMParser === "undefined") return raw;
  const doc = new DOMParser().parseFromString(raw, "text/html");
  doc.querySelectorAll("a[href]").forEach((anchor) => {
    const href = anchor.getAttribute("href") ?? "";
    anchor.setAttribute("data-preview-href", href);
    anchor.setAttribute("aria-disabled", "true");
    anchor.setAttribute("tabindex", "-1");
    anchor.removeAttribute("href");
  });
  const style = doc.createElement("style");
  style.textContent = "a[data-preview-href]{pointer-events:none!important;cursor:default!important}";
  doc.head.appendChild(style);
  return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

interface Props {
  initial?: PresetId;
  showSwitcher?: boolean;
  height?: number;
  className?: string;
}

export default function LivePreview({ initial = "aurora", showSwitcher = true, height = 520, className }: Props) {
  const [active, setActive] = useState<PresetId>(initial);
  const [html, setHtml] = useState<string>(
    '<!doctype html><html><body style="font-family:monospace;padding:2rem;color:#888;">Loading preview...</body></html>',
  );

  const state = useMemo(() => {
    return buildState(active);
  }, [active]);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl("/api/forge/preview"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Preview failed (${r.status})`);
        return r.text();
      })
      .then((text) => {
        if (!cancelled) setHtml(makePreviewHtmlSafe(text));
      })
      .catch((err) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Preview failed";
          setHtml(
            `<!doctype html><html><body style="font-family:monospace;padding:2rem;color:#888;">${message}</body></html>`,
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [state]);

  return (
    <div className={`live-preview-shell ${className ?? ""}`}>
      <div className="live-preview-chrome">
        <div className="live-preview-dots">
          <span style={{ background: "#ff5f56" }} />
          <span style={{ background: "#ffbd2e" }} />
          <span style={{ background: "#27c93f" }} />
        </div>
        <div className="live-preview-url font-mono">
          your-site.work / <span style={{ color: "var(--color-accent)" }}>{active}</span>
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
        srcDoc={html}
        sandbox="allow-same-origin"
        loading="lazy"
        className="live-preview-iframe"
        style={{ height }}
        data-testid={`live-preview-iframe-${active}`}
      />
    </div>
  );
}
