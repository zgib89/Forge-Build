import { useWizard } from "../../lib/store";

const TOGGLES: { key: keyof ReturnType<typeof useWizard.getState>["sections"]; label: string; desc: string }[] = [
  { key: "projects", label: "Selected work", desc: "Proof, projects, wins, campaigns, jobs, or cases — recommended." },
  { key: "about", label: "About", desc: "Long-form bio, background, and working style." },
  { key: "contact", label: "Contact", desc: "How to reach you." },
  { key: "writing", label: "Writing / Notes", desc: "Articles, updates, research, or process notes." },
  { key: "now", label: "Now page", desc: "What you're working on." },
  { key: "uses", label: "Tools / Resources", desc: "Tools, gear, methods, services, or resources you recommend." },
];

const FOOTER_STYLES: { value: "minimal" | "detailed" | "credits"; label: string; desc: string }[] = [
  { value: "minimal", label: "Minimal", desc: "Just a copyright line." },
  { value: "detailed", label: "Detailed", desc: "Links + nav + copyright." },
  { value: "credits", label: "Credits", desc: "Stack, build info, and thanks." },
];

function Switch({ on, onChange, testId, label }: { on: boolean; onChange: (v: boolean) => void; testId: string; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      data-testid={testId}
      className="forge-switch"
      style={{
        width: 36,
        height: 20,
        borderRadius: 999,
        background: on ? "var(--color-accent)" : "var(--color-border)",
        position: "relative",
        transition: "background 150ms",
        flexShrink: 0,
        cursor: "pointer",
        border: "none",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 18 : 2,
          width: 16,
          height: 16,
          borderRadius: 999,
          background: "white",
          transition: "left 150ms cubic-bezier(0.16,1,0.3,1)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

export default function StepSections() {
  const sections = useWizard((s) => s.sections);
  const showAttribution = useWizard((s) => s.showForgeAttribution);
  const footerStyle = useWizard((s) => s.footerStyle);
  const patch = useWizard((s) => s.patch);

  const enabledCount = 1 + TOGGLES.filter((t) => sections[t.key]).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 4</p>
        <h2 className="text-3xl mb-2">Pick your sections.</h2>
        <p className="text-mute text-sm">
          Toggle on what you want. Hero is always on.{" "}
          <span className="font-mono text-xs" style={{ color: "var(--color-accent)" }}>
            {enabledCount} {enabledCount === 1 ? "page" : "pages"} enabled
          </span>
        </p>
      </div>

      <div className="card divide-y divide-app" style={{ borderColor: "var(--color-border)" }}>
        <div className="p-4 flex items-center justify-between opacity-70">
          <div>
            <p className="font-medium text-sm">Hero</p>
            <p className="text-xs text-mute">Always on.</p>
          </div>
          <span className="font-mono text-xs text-mute">required</span>
        </div>
        {TOGGLES.map((t) => (
          <div key={t.key} className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-sm">{t.label}</p>
              <p className="text-xs text-mute">{t.desc}</p>
            </div>
            <Switch
              on={sections[t.key]}
              onChange={(v) => patch({ sections: { ...sections, [t.key]: v } })}
              testId={`switch-section-${t.key}`}
              label={t.label}
            />
          </div>
        ))}
      </div>

      <div className="pt-4">
        <p className="text-sm font-medium mb-2">Footer style</p>
        <div className="grid grid-cols-3 gap-2">
          {FOOTER_STYLES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => patch({ footerStyle: f.value })}
              className="card p-3 text-left transition-all"
              style={{
                borderColor: footerStyle === f.value ? "var(--color-accent)" : "var(--color-border)",
                background: footerStyle === f.value ? "var(--color-surface)" : "transparent",
                boxShadow: footerStyle === f.value ? "0 0 0 2px color-mix(in oklch, var(--color-accent) 15%, transparent)" : "none",
              }}
              data-testid={`button-footer-${f.value}`}
              aria-pressed={footerStyle === f.value}
            >
              <p className="text-sm font-medium">{f.label}</p>
              <p className="text-xs text-mute mt-1">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium">Show "Built with Forge" in footer</p>
          <p className="text-xs text-mute">Optional. Helps spread the word.</p>
        </div>
        <Switch
          on={showAttribution}
          onChange={(v) => patch({ showForgeAttribution: v })}
          testId="switch-attribution"
          label='Show "Built with Forge" in footer'
        />
      </div>
    </div>
  );
}
