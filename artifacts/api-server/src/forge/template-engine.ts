import Handlebars from "handlebars";
import type { WizardState } from "./schemas";

Handlebars.registerHelper("eq", (a: unknown, b: unknown) => a === b);
Handlebars.registerHelper("lower", (s: string) =>
  typeof s === "string" ? s.toLowerCase() : "",
);
Handlebars.registerHelper("slug", (s: string) =>
  typeof s === "string"
    ? s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "",
);
Handlebars.registerHelper("year", () => new Date().getFullYear());
Handlebars.registerHelper("padIndex", (i: number) =>
  String(i + 1).padStart(2, "0"),
);

function toStr(v: unknown): string {
  return v == null ? "" : String(v);
}

Handlebars.registerHelper("jsonStr", (v: unknown) => {
  return JSON.stringify(toStr(v)).slice(1, -1);
});

Handlebars.registerHelper("yamlStr", (v: unknown) => {
  return toStr(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ");
});

Handlebars.registerHelper("xml", (v: unknown) => {
  return toStr(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
});

const FONT_PAIRS: Record<string, { display: string; body: string; mono: string; link: string }> = {
  editorial: {
    display: "'Instrument Serif', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
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
    link: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap",
  },
  classic: {
    display: "'Fraunces', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    link: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap",
  },
};

Handlebars.registerHelper("font", (id: unknown, key: "display" | "body" | "mono" | "link") => {
  const pair = FONT_PAIRS[toStr(id)] ?? FONT_PAIRS.modern;
  return pair[key] ?? "";
});

function fxVars(state: WizardState): string {
  return `
  --color-accent-2: ${state.palette.accent2 ?? state.palette.accent};
  --fx-glow: ${state.glowIntensity ?? 1};
  --fx-edge: ${state.edgeGlow ?? 1};
  --fx-hover-depth: ${state.hoverDepth ?? 2}px;
  --fx-grain: ${state.grainIntensity ?? 0};
  --fx-glass: ${state.glassBlur ?? 0};
  --fx-marquee-speed: ${state.marqueeSpeed ?? 30}s;`;
}

function fxRules(state: WizardState): string {
  const bg = state.backgroundImage && state.backgroundImage.startsWith("data:image/")
    ? state.backgroundImage.replace(/["\\]/g, "")
    : "";
  const grain = state.grainIntensity ?? 0;
  const bgCss = bg && state.backgroundTreatment !== "none"
    ? `
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  background-image: linear-gradient(color-mix(in oklch, var(--color-bg) 25%, transparent), color-mix(in oklch, var(--color-bg) 76%, transparent)), url("${bg}");
  background-size: cover;
  background-position: center;
  opacity: ${state.backgroundTreatment === "soft" ? "0.20" : "0.34"};
  filter: ${state.backgroundTreatment === "duotone" ? "grayscale(1) contrast(1.1) sepia(.35)" : "none"};
}`
    : "";
  return `
${grain > 0 ? `body::after { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: -1; opacity: ${Math.min(0.04 * grain, 0.14)}; background-image: radial-gradient(circle at 20% 30%, var(--color-text) 0 1px, transparent 1px); background-size: 11px 11px; mix-blend-mode: overlay; }` : ""}
${bgCss}
${state.motionLevel === "none" ? `*, *::before, *::after { animation: none !important; transition-duration: 0.001s !important; }` : ""}`;
}

Handlebars.registerHelper("fxVars", (state: WizardState) => fxVars(state));
Handlebars.registerHelper("fxRules", (state: WizardState) => fxRules(state));
Handlebars.registerHelper("cssFx", (state: WizardState) => {
  return `${fxVars(state)}
${fxRules(state)}`;
});

Handlebars.registerHelper("html", (v: unknown) => {
  return toStr(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
});

const cache = new Map<string, HandlebarsTemplateDelegate>();

export function render(source: string, context: unknown): string {
  let tpl = cache.get(source);
  if (!tpl) {
    tpl = Handlebars.compile(source, { noEscape: true });
    cache.set(source, tpl);
  }
  return tpl(context);
}

export interface RenderContext {
  state: WizardState;
  hasProfilePhoto: boolean;
  hasProjectImages: boolean;
}

export function buildContext(state: WizardState): RenderContext {
  return {
    state,
    hasProfilePhoto: !!state.profilePhoto,
    hasProjectImages: state.projects.some((p) => !!p.coverImage),
  };
}
