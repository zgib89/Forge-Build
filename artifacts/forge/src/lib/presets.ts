export type PresetId = "editorial" | "minimalist" | "aurora";

export interface PaletteDef {
  name: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  mute: string;
  accent: string;
  accent2?: string;
}

export interface PresetDef {
  id: PresetId;
  name: string;
  pitch: string;
  useCase: string;
  palettes: PaletteDef[];
}

export const PRESETS: PresetDef[] = [
  {
    id: "editorial",
    name: "Editorial",
    pitch: "Print-magazine inspired. Serif headlines, generous whitespace.",
    useCase: "Writers, IAM engineers, consultants — anyone who wants gravitas.",
    palettes: [
      {
        name: "Stone + Teal",
        bg: "oklch(0.98 0.005 85)",
        surface: "oklch(0.96 0.008 85)",
        border: "oklch(0.90 0.012 80)",
        text: "oklch(0.18 0.010 70)",
        mute: "oklch(0.42 0.014 75)",
        accent: "oklch(0.48 0.10 195)",
      },
      {
        name: "Ivory + Oxblood",
        bg: "oklch(0.97 0.012 85)",
        surface: "oklch(0.94 0.015 85)",
        border: "oklch(0.88 0.018 80)",
        text: "oklch(0.20 0.012 30)",
        mute: "oklch(0.45 0.020 30)",
        accent: "oklch(0.40 0.15 25)",
      },
      {
        name: "Charcoal + Brass",
        bg: "oklch(0.16 0.010 70)",
        surface: "oklch(0.20 0.012 70)",
        border: "oklch(0.30 0.014 70)",
        text: "oklch(0.96 0.005 85)",
        mute: "oklch(0.70 0.014 75)",
        accent: "oklch(0.70 0.13 70)",
      },
      {
        name: "Bone + Forest",
        bg: "oklch(0.97 0.008 100)",
        surface: "oklch(0.94 0.010 100)",
        border: "oklch(0.88 0.014 110)",
        text: "oklch(0.18 0.012 110)",
        mute: "oklch(0.45 0.016 110)",
        accent: "oklch(0.42 0.10 145)",
      },
    ],
  },
  {
    id: "minimalist",
    name: "Minimalist",
    pitch: "JetBrains Mono everywhere. Maximum density, zero decoration.",
    useCase: "Developers, infra engineers, security specialists.",
    palettes: [
      {
        name: "Mono + Terminal Green",
        bg: "oklch(0.99 0 0)",
        surface: "oklch(0.99 0 0)",
        border: "oklch(0.88 0 0)",
        text: "oklch(0.18 0 0)",
        mute: "oklch(0.55 0 0)",
        accent: "oklch(0.55 0.20 145)",
      },
      {
        name: "Mono + Amber",
        bg: "oklch(0.99 0 0)",
        surface: "oklch(0.99 0 0)",
        border: "oklch(0.88 0 0)",
        text: "oklch(0.18 0 0)",
        mute: "oklch(0.55 0 0)",
        accent: "oklch(0.65 0.18 75)",
      },
      {
        name: "Carbon + Cyan",
        bg: "oklch(0.14 0 0)",
        surface: "oklch(0.18 0 0)",
        border: "oklch(0.28 0 0)",
        text: "oklch(0.96 0 0)",
        mute: "oklch(0.65 0 0)",
        accent: "oklch(0.75 0.18 215)",
      },
      {
        name: "Solarized Light",
        bg: "oklch(0.96 0.018 95)",
        surface: "oklch(0.93 0.022 95)",
        border: "oklch(0.85 0.024 95)",
        text: "oklch(0.40 0.025 220)",
        mute: "oklch(0.55 0.030 220)",
        accent: "oklch(0.60 0.18 30)",
      },
    ],
  },
  {
    id: "aurora",
    name: "Aurora",
    pitch: "WebGL gradient mesh. Color-saturated, motion-rich.",
    useCase: "Frontend engineers, motion designers, creative technologists.",
    palettes: [
      {
        name: "Cosmic Aurora",
        bg: "oklch(0.10 0.020 280)",
        surface: "oklch(0.14 0.025 280)",
        border: "oklch(0.30 0.040 280)",
        text: "oklch(0.96 0.005 85)",
        mute: "oklch(0.72 0.014 75)",
        accent: "oklch(0.65 0.25 295)",
        accent2: "oklch(0.70 0.20 195)",
      },
      {
        name: "Sunset Aurora",
        bg: "oklch(0.10 0.020 30)",
        surface: "oklch(0.14 0.025 30)",
        border: "oklch(0.30 0.040 30)",
        text: "oklch(0.96 0.005 85)",
        mute: "oklch(0.72 0.014 75)",
        accent: "oklch(0.65 0.25 30)",
        accent2: "oklch(0.70 0.22 70)",
      },
      {
        name: "Ocean Aurora",
        bg: "oklch(0.10 0.030 240)",
        surface: "oklch(0.14 0.035 240)",
        border: "oklch(0.30 0.045 240)",
        text: "oklch(0.96 0.005 85)",
        mute: "oklch(0.72 0.014 75)",
        accent: "oklch(0.70 0.20 215)",
        accent2: "oklch(0.72 0.18 195)",
      },
      {
        name: "Rose Aurora",
        bg: "oklch(0.12 0.030 340)",
        surface: "oklch(0.16 0.035 340)",
        border: "oklch(0.30 0.045 340)",
        text: "oklch(0.96 0.005 85)",
        mute: "oklch(0.72 0.014 75)",
        accent: "oklch(0.70 0.25 350)",
        accent2: "oklch(0.72 0.22 20)",
      },
    ],
  },
];

export function getPreset(id: PresetId): PresetDef {
  const p = PRESETS.find((x) => x.id === id);
  if (!p) throw new Error(`unknown preset ${id}`);
  return p;
}
