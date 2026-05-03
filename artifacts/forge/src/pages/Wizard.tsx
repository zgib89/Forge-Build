import { Link } from "wouter";
import { useMemo, useState } from "react";
import { useWizard } from "../lib/store";
import StepIdentity from "../components/wizard/StepIdentity";
import StepPreset from "../components/wizard/StepPreset";
import StepPalette from "../components/wizard/StepPalette";
import StepSections from "../components/wizard/StepSections";
import StepProjects from "../components/wizard/StepProjects";
import StepExport from "../components/wizard/StepExport";
import PreviewFrame from "../components/wizard/PreviewFrame";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const STEPS = [
  { label: "Identity", component: StepIdentity },
  { label: "Preset", component: StepPreset },
  { label: "Palette", component: StepPalette },
  { label: "Sections", component: StepSections },
  { label: "Projects", component: StepProjects },
  { label: "Export", component: StepExport },
];

export default function Wizard() {
  const step = useWizard((s) => s.step);
  const setStep = useWizard((s) => s.setStep);
  const next = useWizard((s) => s.next);
  const prev = useWizard((s) => s.prev);
  const name = useWizard((s) => s.name);
  const role = useWizard((s) => s.role);

  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const StepComp = STEPS[step].component;

  const canAdvance = useMemo(() => {
    if (step === 0) return name.trim().length >= 2 && role.trim().length >= 1;
    return true;
  }, [step, name, role]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-app">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl">Forge</Link>
          <div className="text-sm text-mute font-mono">
            Step {step + 1} of {STEPS.length} · {STEPS[step].label}
          </div>
        </div>
        <div
          aria-hidden="true"
          style={{
            height: 2,
            background: "var(--color-border)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${((step + 1) / STEPS.length) * 100}%`,
              background: "var(--color-accent)",
              transition: "width 300ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>
      </header>

      <div className="lg:hidden flex border-b border-app">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className="flex-1 py-3 text-sm font-medium"
          style={{
            color: mobileTab === "edit" ? "var(--color-accent)" : "var(--color-text-mute)",
            borderBottom: mobileTab === "edit" ? "2px solid var(--color-accent)" : "2px solid transparent",
          }}
          data-testid="tab-edit"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className="flex-1 py-3 text-sm font-medium"
          style={{
            color: mobileTab === "preview" ? "var(--color-accent)" : "var(--color-text-mute)",
            borderBottom: mobileTab === "preview" ? "2px solid var(--color-accent)" : "2px solid transparent",
          }}
          data-testid="tab-preview"
        >
          Preview
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[40%_60%]">
        <section
          className={`border-r border-app flex flex-col ${mobileTab === "edit" ? "flex" : "hidden"} lg:flex`}
          data-testid="wizard-pane"
        >
          <nav className="px-6 py-4 border-b border-app">
            <ol className="flex items-center gap-2 overflow-x-auto" aria-label="Wizard progress">
              {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <li key={s.label} className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => i <= step && setStep(i)}
                      disabled={i > step}
                      className="flex items-center gap-2 text-sm"
                      style={{
                        color: active ? "var(--color-accent)" : done ? "var(--color-text)" : "var(--color-text-mute)",
                        cursor: i <= step ? "pointer" : "not-allowed",
                      }}
                      data-testid={`step-nav-${i}`}
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono"
                        style={{
                          background: active ? "var(--color-accent)" : done ? "var(--color-text)" : "var(--color-surface)",
                          color: active || done ? "var(--color-bg)" : "var(--color-text-mute)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {done ? <Check className="w-3 h-3" /> : i + 1}
                      </span>
                      <span className="hidden md:inline">{s.label}</span>
                    </button>
                    {i < STEPS.length - 1 && <span className="text-mute">/</span>}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div
            className="flex-1 px-6 py-8 overflow-y-auto"
            style={{ animation: "stepIn 200ms cubic-bezier(0.16,1,0.3,1)" }}
            key={step}
          >
            <StepComp />
          </div>

          {step < STEPS.length - 1 && (
            <div className="px-6 py-4 border-t border-app flex justify-between items-center surface">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className="btn btn-ghost"
                data-testid="button-prev"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!canAdvance}
                className="btn btn-primary"
                data-testid="button-next"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>

        <section
          className={`bg-surface ${mobileTab === "preview" ? "block" : "hidden"} lg:block`}
          style={{ background: "var(--color-surface)" }}
        >
          <PreviewFrame />
        </section>
      </div>

      <style>{`@keyframes stepIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
