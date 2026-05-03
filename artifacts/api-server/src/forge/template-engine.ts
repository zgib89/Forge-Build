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
