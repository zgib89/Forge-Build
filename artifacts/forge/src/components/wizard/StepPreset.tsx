import { PRESETS, type PresetId } from "../../lib/presets";
import { useWizard } from "../../lib/store";

function PresetThumb({ id }: { id: PresetId }) {
  const preset = PRESETS.find((p) => p.id === id)!;
  const pal = preset.palettes[0];
  if (id === "editorial") {
    return (
      <div
        className="w-full h-24 rounded-md overflow-hidden border"
        style={{ background: pal.bg, borderColor: pal.border }}
      >
        <div className="px-3 py-2 h-full flex flex-col justify-between">
          <div
            className="text-[14px] leading-tight"
            style={{
              color: pal.text,
              fontFamily: "Georgia, 'Instrument Serif', serif",
              letterSpacing: "-0.02em",
            }}
          >
            Build your portfolio.
          </div>
          <div className="flex gap-1.5 items-center">
            <span className="h-1 w-10 rounded" style={{ background: pal.accent }} />
            <span className="h-1 w-6 rounded opacity-60" style={{ background: pal.mute }} />
          </div>
        </div>
      </div>
    );
  }
  if (id === "minimalist") {
    return (
      <div
        className="w-full h-24 rounded-md overflow-hidden border font-mono"
        style={{ background: pal.bg, borderColor: pal.border }}
      >
        <div className="px-3 py-2 h-full flex flex-col gap-1">
          <div className="text-[10px]" style={{ color: pal.mute }}>~/portfolio $</div>
          <div className="text-[11px]" style={{ color: pal.text }}>./build --ship</div>
          <div className="text-[10px] mt-auto" style={{ color: pal.accent }}>● ready in 92ms</div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="w-full h-24 rounded-md overflow-hidden border relative"
      style={{ background: pal.bg, borderColor: pal.border }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(60% 80% at 30% 30%, ${pal.accent}66 0%, transparent 60%), radial-gradient(50% 80% at 80% 70%, ${pal.accent2 ?? pal.accent}55 0%, transparent 60%)`,
          filter: "blur(8px)",
        }}
      />
      <div className="relative h-full px-3 py-2 flex flex-col justify-between">
        <div
          className="text-[14px] leading-tight"
          style={{ color: pal.text, fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
        >
          Aurora.
        </div>
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: pal.accent }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: pal.accent2 ?? pal.accent }} />
        </div>
      </div>
    </div>
  );
}

export default function StepPreset() {
  const preset = useWizard((s) => s.preset);
  const setPreset = useWizard((s) => s.setPreset);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 2</p>
        <h2 className="text-3xl mb-2">Pick a preset.</h2>
        <p className="text-mute text-sm">Each is a complete visual identity. You can fine-tune everything in the next step.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESETS.map((p) => {
          const active = p.id === preset;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id)}
              className="text-left p-4 rounded-lg transition-all flex flex-col gap-3 hover:-translate-y-0.5"
              style={{
                background: active ? "var(--color-surface)" : "transparent",
                border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                boxShadow: active ? "0 0 0 3px color-mix(in oklch, var(--color-accent) 15%, transparent)" : "none",
              }}
              data-testid={`button-preset-${p.id}`}
              aria-pressed={active}
            >
              <PresetThumb id={p.id} />
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <h3 className="text-lg">{p.name}</h3>
                  <div className="flex gap-1">
                    {p.palettes.slice(0, 4).map((pal) => (
                      <span
                        key={pal.name}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: pal.accent, border: "1px solid var(--color-border)" }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs mb-2 leading-relaxed">{p.pitch}</p>
                <p className="text-[11px] text-mute font-mono leading-snug">{p.useCase}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
