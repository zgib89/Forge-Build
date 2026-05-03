import { create } from "zustand";
import { PRESETS, type PresetId, type PaletteDef } from "./presets";
import type { Project, WizardState } from "./schemas";

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
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
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

export const useWizard = create<WizardStore>((set) => ({
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
  updateProject: (id, patch) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),
  removeProject: (id) =>
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
  reset: () => set({ ...initial, step: 0 }),
}));

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
    updateProject,
    removeProject,
    reset,
    ...state
  } = s;
  return state;
}
