export type FontPairId =
  | "editorial"
  | "modern"
  | "mono"
  | "display"
  | "classic";

export type RadiusScaleId = "sharp" | "soft" | "pill";

export interface FontPair {
  id: FontPairId;
  name: string;
  desc: string;
  display: string;
  body: string;
  mono: string;
  googleHref: string;
  sampleStyle: { fontFamily: string; fontWeight?: number; letterSpacing?: string };
}

export const FONT_PAIRS: FontPair[] = [
  {
    id: "editorial",
    name: "Editorial",
    desc: "Instrument Serif + Inter",
    display: "'Instrument Serif', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap",
    sampleStyle: { fontFamily: "'Instrument Serif', Georgia, serif", letterSpacing: "-0.02em" },
  },
  {
    id: "modern",
    name: "Modern",
    desc: "Inter + JetBrains Mono",
    display: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Inter:wght@200;400;500;600;700&family=JetBrains+Mono:wght@400&display=swap",
    sampleStyle: { fontFamily: "'Inter', sans-serif", fontWeight: 700, letterSpacing: "-0.03em" },
  },
  {
    id: "mono",
    name: "Mono",
    desc: "JetBrains Mono only",
    display: "'JetBrains Mono', ui-monospace, monospace",
    body: "'JetBrains Mono', ui-monospace, monospace",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    googleHref:
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap",
    sampleStyle: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 },
  },
  {
    id: "display",
    name: "Display",
    desc: "Space Grotesk + Inter",
    display: "'Space Grotesk', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400&display=swap",
    sampleStyle: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "-0.02em" },
  },
  {
    id: "classic",
    name: "Classic",
    desc: "Fraunces + Inter",
    display: "'Fraunces', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap",
    sampleStyle: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 600, letterSpacing: "-0.01em" },
  },
];

export const getFontPair = (id: FontPairId): FontPair =>
  FONT_PAIRS.find((f) => f.id === id) ?? FONT_PAIRS[0];

export interface RadiusScale {
  id: RadiusScaleId;
  name: string;
  desc: string;
  sm: string;
  md: string;
  lg: string;
}

export const RADIUS_SCALES: RadiusScale[] = [
  { id: "sharp", name: "Sharp", desc: "Editorial, no-nonsense.", sm: "0", md: "0", lg: "0" },
  { id: "soft", name: "Soft", desc: "Friendly, modern.", sm: "0.375rem", md: "0.75rem", lg: "1.25rem" },
  { id: "pill", name: "Pill", desc: "Playful, expressive.", sm: "0.75rem", md: "1.5rem", lg: "999px" },
];

export const getRadiusScale = (id: RadiusScaleId): RadiusScale =>
  RADIUS_SCALES.find((r) => r.id === id) ?? RADIUS_SCALES[1];

export const PRESET_FONT_DEFAULTS: Record<string, FontPairId> = {
  editorial: "editorial",
  minimalist: "mono",
  aurora: "modern",
};

export const PRESET_RADIUS_DEFAULTS: Record<string, RadiusScaleId> = {
  editorial: "sharp",
  minimalist: "sharp",
  aurora: "pill",
};
