import { z } from "zod";

export const CareerCategorySchema = z.enum([
  "general",
  "beauty-wellness",
  "software-it",
  "design-creative",
  "writing-research",
  "operations-admin",
  "sales-marketing",
  "hospitality-food",
  "retail-customer-service",
  "education-training",
  "healthcare-care",
  "trades-field",
  "real-estate-property",
  "logistics-transportation",
  "manufacturing-warehouse",
  "finance-legal",
  "public-service-nonprofit",
  "fitness-coaching",
  "arts-events",
  "agriculture-outdoor",
  "student-early-career",
]);

export const VisualStyleSchema = z.enum([
  "custom",
  "signal-dossier",
  "forge-glass",
  "westfall-archive",
  "northbridge-horizon",
  "righteous-recon",
  "quiet-studio",
  "terminal-minimal",
]);

export const CardStyleSchema = z.enum([
  "flat-editorial",
  "border-line",
  "soft-bubble",
  "forge-glass",
  "archive-evidence",
  "recon-stat",
  "app-icon",
]);

export const BackgroundTreatmentSchema = z.enum(["none", "soft", "duotone", "grain", "spotlight"]);
export const MotionLevelSchema = z.enum(["none", "calm", "standard", "expressive"]);

export const ProjectSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9][a-z0-9-]*$/, "id must be a slug: [a-z0-9-]"),
  title: z.string().min(1).max(80),
  summary: z.string().min(1).max(160),
  stack: z.array(z.string()).default([]),
  role: z.string().max(60).optional(),
  date: z.string().optional(),
  liveUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  coverImage: z.string().optional(),
  draft: z.boolean().optional(),
});

const CSS_COLOR_RE =
  /^(#[0-9a-fA-F]{3,8}|rgb\(\s*[\d.\s,/%]+\)|rgba\(\s*[\d.\s,/%]+\)|hsl\(\s*[\d.\s,/%deg]+\)|hsla\(\s*[\d.\s,/%deg]+\)|oklch\(\s*[\d.\s%]+(?:\s*\/\s*[\d.%]+)?\)|oklab\(\s*[-\d.\s%]+(?:\s*\/\s*[\d.%]+)?\)|[a-zA-Z]{3,30})$/;
const cssColor = z
  .string()
  .max(80)
  .regex(CSS_COLOR_RE, "must be a safe CSS color (hex/rgb/hsl/oklch/named)");

export const PaletteSchema = z.object({
  bg: cssColor,
  surface: cssColor,
  border: cssColor,
  text: cssColor,
  mute: cssColor,
  accent: cssColor,
  accent2: cssColor.optional(),
});

export const WizardStateSchema = z.object({
  name: z.string().min(2).max(60),
  role: z.string().min(1).max(60),
  tagline: z.string().max(120).optional().default(""),
  location: z.string().max(60).optional().default(""),
  profilePhoto: z.string().optional(),
  careerCategory: CareerCategorySchema.default("general"),

  preset: z.enum(["editorial", "minimalist", "aurora"]),
  palette: PaletteSchema,
  paletteName: z.string().max(40),
  darkMode: z.boolean().default(false),
  fontPair: z
    .enum(["editorial", "modern", "mono", "display", "classic"])
    .default("modern"),
  radiusScale: z.enum(["sharp", "soft", "pill"]).default("soft"),
  visualStyle: VisualStyleSchema.default("forge-glass"),
  cardStyle: CardStyleSchema.default("border-line"),
  backgroundTreatment: BackgroundTreatmentSchema.default("none"),
  backgroundImage: z.string().max(2_500_000).optional(),
  backgroundImageName: z.string().max(120).optional(),
  glowIntensity: z.number().min(0).max(4).default(1),
  edgeGlow: z.number().min(0).max(4).default(1),
  motionLevel: MotionLevelSchema.default("standard"),
  marqueeSpeed: z.number().min(12).max(90).default(30),
  hoverDepth: z.number().min(0).max(8).default(2),
  grainIntensity: z.number().min(0).max(3).default(0),
  glassBlur: z.number().min(0).max(3).default(0),

  sections: z.object({
    projects: z.boolean().default(true),
    writing: z.boolean().default(false),
    about: z.boolean().default(true),
    contact: z.boolean().default(true),
    now: z.boolean().default(false),
    uses: z.boolean().default(false),
  }),
  githubUsername: z
    .string()
    .max(40)
    .regex(/^[A-Za-z0-9-]*$/, "github username must be alphanumeric/hyphen")
    .optional()
    .default(""),
  footerStyle: z.enum(["minimal", "detailed", "credits"]).default("minimal"),
  showForgeAttribution: z.boolean().default(false),

  projects: z.array(ProjectSchema).max(8).default([]),

  domain: z.string().min(3).max(80),
  email: z.string().optional(),
  deployedUrl: z.string().max(500).optional(),
  deploySlug: z.string().max(32).optional(),
});

export type WizardState = z.infer<typeof WizardStateSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Palette = z.infer<typeof PaletteSchema>;
