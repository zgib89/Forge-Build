import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(80),
  summary: z.string().min(1).max(160),
  stack: z.array(z.string()).default([]),
  role: z.string().max(60).optional(),
  date: z.string().optional(),
  liveUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  coverImage: z.string().optional(),
});

export const PaletteSchema = z.object({
  bg: z.string(),
  surface: z.string(),
  border: z.string(),
  text: z.string(),
  mute: z.string(),
  accent: z.string(),
  accent2: z.string().optional(),
});

export const WizardStateSchema = z.object({
  name: z.string().min(2).max(60),
  role: z.string().min(1).max(60),
  tagline: z.string().max(120).optional(),
  location: z.string().max(60).optional(),
  profilePhoto: z.string().optional(),

  preset: z.enum(["editorial", "minimalist", "aurora"]),
  palette: PaletteSchema,
  paletteName: z.string(),
  darkMode: z.boolean().default(false),

  sections: z.object({
    projects: z.boolean(),
    writing: z.boolean(),
    about: z.boolean(),
    contact: z.boolean(),
    now: z.boolean(),
    uses: z.boolean(),
  }),
  githubUsername: z.string().optional(),
  footerStyle: z.string(),
  showForgeAttribution: z.boolean(),

  projects: z.array(ProjectSchema).max(8),

  domain: z.string().min(3).max(80),
  email: z.string().optional(),
});

export type WizardState = z.infer<typeof WizardStateSchema>;
export type Project = z.infer<typeof ProjectSchema>;
