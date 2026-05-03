import { Link } from "wouter";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWizard, getWizardState } from "../lib/store";
import StepIdentity from "../components/wizard/StepIdentity";
import StepPreset from "../components/wizard/StepPreset";
import StepPalette from "../components/wizard/StepPalette";
import StepSections from "../components/wizard/StepSections";
import StepProjects from "../components/wizard/StepProjects";
import StepExport from "../components/wizard/StepExport";
import PreviewFrame from "../components/wizard/PreviewFrame";
import ThemeToggle from "../components/ThemeToggle";
import { ArrowLeft, ArrowRight, Check, Command, Share2 } from "lucide-react";
import { encodeConfig } from "../lib/shareConfig";
import { toast } from "../lib/toast";

const STEPS = [
  { label: "Identity", component: StepIdentity },
  { label: "Preset", component: StepPreset },
  { label: "Palette", component: StepPalette },
  { label: "Sections", component: StepSections },
  { label: "Projects", component: StepProjects },
  { label: "Export", component: StepExport },
];

function SavedPulse() {
  // Subscribe to wizard state changes; flash a "Saved" pill briefly.
  const [show, setShow] = useState(false);
  const firstRun = useRef(true);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return useWizard.subscribe((state, prev) => {
      // Ignore step-only changes (those aren't really "edits")
      if (state === prev) return;
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      setShow(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShow(false), 1500);
    });
  }, []);

  return (
    <span
      className="font-mono text-[10px] uppercase tracking-wider"
      style={{
        opacity: show ? 1 : 0,
        color: "var(--color-success)",
        transition: "opacity 250ms",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
      data-testid="saved-pulse"
      aria-live="polite"
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: "var(--color-success)",
          boxShadow: show ? "0 0 0 4px color-mix(in oklch, var(--color-success) 25%, transparent)" : "none",
          transition: "box-shadow 400ms",
        }}
      />
      Saved
    </span>
  );
}

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

  // Keyboard shortcuts: cmd/ctrl + arrow keys or cmd/ctrl + enter
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (!isMeta) return;
      // Don't interfere with text inputs unless modifier is held
      if (e.key === "Enter" && canAdvance && step < STEPS.length - 1) {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowRight" && canAdvance && step < STEPS.length - 1) {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" && step > 0) {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canAdvance, step, next, prev]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-app">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-xl flex items-center gap-2">
            <span
              aria-hidden
              style={{
                width: 24, height: 24, borderRadius: 6,
                background: "linear-gradient(135deg, var(--color-accent) 0%, oklch(0.60 0.22 295) 100%)",
                display: "grid", placeItems: "center", color: "white",
                fontFamily: "var(--font-display)", fontSize: 15, lineHeight: 1,
              }}
            >F</span>
            Forge
          </Link>
          <div className="flex items-center gap-4">
            <SavedPulse />
            <span className="text-sm text-mute font-mono hidden md:inline">
              Step {step + 1} of {STEPS.length} · {STEPS[step].label}
            </span>
            <button
              type="button"
              onClick={async () => {
                try {
                  const enc = encodeConfig(getWizardState(useWizard.getState()));
                  await navigator.clipboard.writeText(enc.url);
                  toast.success(
                    "Share link copied",
                    enc.strippedAssets
                      ? "Cover images excluded so the URL stays small."
                      : "Anyone with this link gets a pre-filled wizard.",
                  );
                } catch (e) {
                  toast.error("Couldn't copy link", e instanceof Error ? e.message : "clipboard blocked");
                }
              }}
              className="btn btn-ghost text-xs hidden md:inline-flex"
              title="Copy shareable config link"
              aria-label="Copy shareable config link"
              data-testid="button-share"
            >
              <Share2 className="w-3 h-3" /> <span>Share</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const ev = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
                window.dispatchEvent(ev);
              }}
              className="btn btn-ghost text-xs hidden md:inline-flex"
              title="Open command palette"
              aria-label="Open command palette"
              data-testid="button-cmdk"
            >
              <Command className="w-3 h-3" /> <span className="font-mono">⌘K</span>
            </button>
            <ThemeToggle />
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
              background: "linear-gradient(90deg, var(--color-accent) 0%, oklch(0.60 0.22 295) 100%)",
              transition: "width 400ms cubic-bezier(0.16,1,0.3,1)",
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
            style={{ animation: "stepIn 280ms cubic-bezier(0.16,1,0.3,1)" }}
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
                title="Back (⌘ ←)"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="text-xs text-mute font-mono hidden md:flex items-center gap-2">
                <kbd className="cmdk-kbd">⌘</kbd>
                <kbd className="cmdk-kbd">↵</kbd>
                <span>continue</span>
              </div>
              <button
                type="button"
                onClick={next}
                disabled={!canAdvance}
                className="btn btn-primary"
                data-testid="button-next"
                title="Continue (⌘ ↵)"
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

      <style>{`@keyframes stepIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
