import { z } from "zod";

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

  preset: z.enum(["editorial", "minimalist", "aurora"]),
  palette: PaletteSchema,
  paletteName: z.string().max(40),
  darkMode: z.boolean().default(false),

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
  showForgeAttribution: z.boolean().default(true),

  projects: z.array(ProjectSchema).max(8).default([]),

  domain: z.string().min(3).max(80),
  email: z.string().optional(),
});

export type WizardState = z.infer<typeof WizardStateSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Palette = z.infer<typeof PaletteSchema>;
