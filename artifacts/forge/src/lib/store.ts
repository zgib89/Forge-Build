import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRESETS, type PresetId, type PaletteDef } from "./presets";
import type { Project, WizardState } from "./schemas";
import {
  PRESET_FONT_DEFAULTS,
  PRESET_RADIUS_DEFAULTS,
  type FontPairId,
  type RadiusScaleId,
} from "./typography";

const defaultPreset = PRESETS[0];
const defaultPalette = defaultPreset.palettes[0];

export interface WizardStore extends WizardState {
  step: number;
  setStep: (n: number) => void;
  next: () => void;
  prev: () => void;
  patch: (p: Partial<WizardState>) => void;
  setPreset: (id: PresetId) => void;
  setPalette: (p: PaletteDef) => void;
  addProject: () => void;
  addExampleProjects: () => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  moveProject: (id: string, dir: -1 | 1) => void;
  reorderProjects: (fromIdx: number, toIdx: number) => void;
  reset: () => void;
}

const initial: WizardState = {
  name: "",
  role: "",
  tagline: "",
  location: "",
  preset: defaultPreset.id,
  palette: {
    bg: defaultPalette.bg,
    surface: defaultPalette.surface,
    border: defaultPalette.border,
    text: defaultPalette.text,
    mute: defaultPalette.mute,
    accent: defaultPalette.accent,
    accent2: defaultPalette.accent2,
  },
  paletteName: defaultPalette.name,
  darkMode: false,
  fontPair: PRESET_FONT_DEFAULTS[defaultPreset.id] as FontPairId,
  radiusScale: PRESET_RADIUS_DEFAULTS[defaultPreset.id] as RadiusScaleId,
  sections: {
    projects: true,
    writing: false,
    about: true,
    contact: true,
    now: false,
    uses: false,
  },
  githubUsername: "",
  footerStyle: "minimal",
  showForgeAttribution: true,
  projects: [],
  domain: "",
};

const EXAMPLE_PROJECTS: Omit<Project, "id">[] = [
  {
    title: "JotterDown",
    summary: "A writing OS for builders. Markdown-first notes, instant publishing.",
    stack: ["Astro", "TypeScript", "Cloudflare"],
    role: "Solo build",
    date: "2026",
    liveUrl: "https://jotterdown.com",
    repoUrl: "",
  },
  {
    title: "RighteousRecon",
    summary: "OSINT tooling for indie investigators. Fast, private, opinionated.",
    stack: ["Next.js", "Postgres", "Tailwind"],
    role: "Solo build",
    date: "2025",
    liveUrl: "https://righteousrecon.com",
    repoUrl: "",
  },
  {
    title: "Forge",
    summary: "The portfolio generator you're using right now. Yours forever.",
    stack: ["React", "Astro", "Cloudflare Workers"],
    role: "Solo build",
    date: "2026",
    liveUrl: "",
    repoUrl: "",
  },
];

export const useWizard = create<WizardStore>()(
  persist(
    (set) => ({
      ...initial,
      step: 0,
      setStep: (step) => set({ step }),
      next: () => set((s) => ({ step: Math.min(5, s.step + 1) })),
      prev: () => set((s) => ({ step: Math.max(0, s.step - 1) })),
      patch: (p) => set(p as WizardState),
      setPreset: (id) => {
        const preset = PRESETS.find((x) => x.id === id);
        if (!preset) return;
        const palette = preset.palettes[0];
        set({
          preset: id,
          paletteName: palette.name,
          palette: {
            bg: palette.bg,
            surface: palette.surface,
            border: palette.border,
            text: palette.text,
            mute: palette.mute,
            accent: palette.accent,
            accent2: palette.accent2,
          },
          fontPair: PRESET_FONT_DEFAULTS[id] as FontPairId,
          radiusScale: PRESET_RADIUS_DEFAULTS[id] as RadiusScaleId,
        });
      },
      setPalette: (p) =>
        set({
          paletteName: p.name,
          palette: {
            bg: p.bg,
            surface: p.surface,
            border: p.border,
            text: p.text,
            mute: p.mute,
            accent: p.accent,
            accent2: p.accent2,
          },
        }),
      addProject: () =>
        set((s) =>
          s.projects.length >= 8
            ? s
            : {
                projects: [
                  ...s.projects,
                  {
                    id: `p-${Date.now().toString(36)}`,
                    title: "",
                    summary: "",
                    stack: [],
                    role: "",
                    date: "",
                    liveUrl: "",
                    repoUrl: "",
                  },
                ],
              },
        ),
      addExampleProjects: () =>
        set((s) => {
          if (s.projects.length > 0) return s;
          return {
            projects: EXAMPLE_PROJECTS.map((p, i) => ({
              ...p,
              id: `p-ex-${i}-${Date.now().toString(36)}`,
            })),
          };
        }),
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removeProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
      moveProject: (id, dir) =>
        set((s) => {
          const idx = s.projects.findIndex((p) => p.id === id);
          const target = idx + dir;
          if (idx < 0 || target < 0 || target >= s.projects.length) return s;
          const next = [...s.projects];
          const [m] = next.splice(idx, 1);
          next.splice(target, 0, m);
          return { projects: next };
        }),
      reorderProjects: (fromIdx, toIdx) =>
        set((s) => {
          if (
            fromIdx < 0 ||
            toIdx < 0 ||
            fromIdx >= s.projects.length ||
            toIdx >= s.projects.length ||
            fromIdx === toIdx
          )
            return s;
          const next = [...s.projects];
          const [m] = next.splice(fromIdx, 1);
          next.splice(toIdx, 0, m);
          return { projects: next };
        }),
      reset: () => set({ ...initial, step: 0 }),
    }),
    {
      name: "forge-wizard-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const {
          setStep,
          next,
          prev,
          patch,
          setPreset,
          setPalette,
          addProject,
          addExampleProjects,
          updateProject,
          removeProject,
          moveProject,
          reorderProjects,
          reset,
          ...rest
        } = s;
        return rest;
      },
    },
  ),
);

export function getWizardState(s: WizardStore): WizardState {
  const {
    step,
    setStep,
    next,
    prev,
    patch,
    setPreset,
    setPalette,
    addProject,
    addExampleProjects,
    updateProject,
    removeProject,
    moveProject,
    reorderProjects,
    reset,
    ...state
  } = s;
  return state;
}
