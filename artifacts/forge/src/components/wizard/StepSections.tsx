import { useWizard } from "../../lib/store";

const TOGGLES: { key: keyof ReturnType<typeof useWizard.getState>["sections"]; label: string; desc: string; locked?: boolean }[] = [
  { key: "projects", label: "Projects", desc: "Showcase your work — recommended." },
  { key: "about", label: "About", desc: "Long-form bio page." },
  { key: "contact", label: "Contact", desc: "How to reach you." },
  { key: "writing", label: "Writing / Notes", desc: "Markdown notes index." },
  { key: "now", label: "Now page", desc: "What you're working on." },
  { key: "uses", label: "Uses page", desc: "Tools and gear." },
];

const FOOTER_STYLES: { value: "minimal" | "detailed" | "credits"; label: string; desc: string }[] = [
  { value: "minimal", label: "Minimal", desc: "Just a copyright line." },
  { value: "detailed", label: "Detailed", desc: "Links + nav + copyright." },
  { value: "credits", label: "Credits", desc: "Stack, build info, and thanks." },
];

export default function StepSections() {
  const sections = useWizard((s) => s.sections);
  const showAttribution = useWizard((s) => s.showForgeAttribution);
  const footerStyle = useWizard((s) => s.footerStyle);
  const patch = useWizard((s) => s.patch);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 4</p>
        <h2 className="text-3xl mb-2">Pick your sections.</h2>
        <p className="text-mute text-sm">Toggle on what you want. Hero is always on.</p>
      </div>

      <div className="card divide-y divide-app" style={{ borderColor: "var(--color-border)" }}>
        <div className="p-4 flex items-start justify-between opacity-60">
          <div>
            <p className="font-medium text-sm">Hero</p>
            <p className="text-xs text-mute">Always on.</p>
          </div>
          <span className="font-mono text-xs text-mute">required</span>
        </div>
        {TOGGLES.map((t) => (
          <label
            key={t.key}
            className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-surface"
            style={{ background: "transparent" }}
          >
            <div>
              <p className="font-medium text-sm">{t.label}</p>
              <p className="text-xs text-mute">{t.desc}</p>
            </div>
            <input
              type="checkbox"
              checked={sections[t.key]}
              onChange={(e) =>
                patch({ sections: { ...sections, [t.key]: e.target.checked } })
              }
              className="w-4 h-4 mt-1"
              style={{ width: "1rem", padding: 0 }}
              data-testid={`checkbox-section-${t.key}`}
            />
          </label>
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
              className="card p-3 text-left"
              style={{
                borderColor: footerStyle === f.value ? "var(--color-accent)" : "var(--color-border)",
                background: footerStyle === f.value ? "var(--color-surface)" : "transparent",
              }}
              data-testid={`button-footer-${f.value}`}
            >
              <p className="text-sm font-medium">{f.label}</p>
              <p className="text-xs text-mute mt-1">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={showAttribution}
          onChange={(e) => patch({ showForgeAttribution: e.target.checked })}
          className="w-4 h-4 mt-1"
          style={{ width: "1rem", padding: 0 }}
          data-testid="checkbox-attribution"
        />
        <div>
          <p className="text-sm font-medium">Show "Built with Forge" in footer</p>
          <p className="text-xs text-mute">Optional. Helps spread the word.</p>
        </div>
      </label>
    </div>
  );
}
