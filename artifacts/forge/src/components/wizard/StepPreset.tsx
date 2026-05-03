import { PRESETS } from "../../lib/presets";
import { useWizard } from "../../lib/store";

export default function StepPreset() {
  const preset = useWizard((s) => s.preset);
  const setPreset = useWizard((s) => s.setPreset);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 2</p>
        <h2 className="text-3xl mb-2">Pick a preset.</h2>
        <p className="text-mute text-sm">Each is a complete visual identity. You can change palette next.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PRESETS.map((p) => {
          const active = p.id === preset;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              className="text-left p-5 rounded-lg transition-all"
              style={{
                background: active ? "var(--color-surface)" : "transparent",
                border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                boxShadow: active ? "0 0 0 3px color-mix(in oklch, var(--color-accent) 15%, transparent)" : "none",
              }}
              data-testid={`button-preset-${p.id}`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-xl">{p.name}</h3>
                <div className="flex gap-1">
                  {p.palettes.slice(0, 4).map((pal) => (
                    <span
                      key={pal.name}
                      className="w-3 h-3 rounded-full"
                      style={{ background: pal.accent, border: "1px solid var(--color-border)" }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm mb-2">{p.pitch}</p>
              <p className="text-xs text-mute font-mono">{p.useCase}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
