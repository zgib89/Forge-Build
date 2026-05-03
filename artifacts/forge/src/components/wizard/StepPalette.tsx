import { getPreset } from "../../lib/presets";
import { useWizard } from "../../lib/store";

export default function StepPalette() {
  const presetId = useWizard((s) => s.preset);
  const paletteName = useWizard((s) => s.paletteName);
  const darkMode = useWizard((s) => s.darkMode);
  const setPalette = useWizard((s) => s.setPalette);
  const patch = useWizard((s) => s.patch);
  const preset = getPreset(presetId);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 3</p>
        <h2 className="text-3xl mb-2">Pick a palette.</h2>
        <p className="text-mute text-sm">
          {preset.name} · 4 curated combinations. The preview updates as you click.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {preset.palettes.map((pal) => {
          const active = pal.name === paletteName;
          return (
            <button
              key={pal.name}
              type="button"
              onClick={() => setPalette(pal)}
              className="text-left p-4 rounded-lg transition-all"
              style={{
                border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                background: active ? "var(--color-surface)" : "transparent",
                boxShadow: active ? "0 0 0 3px color-mix(in oklch, var(--color-accent) 15%, transparent)" : "none",
              }}
              data-testid={`button-palette-${pal.name.toLowerCase().replace(/\W+/g, "-")}`}
            >
              <div
                className="rounded-md mb-3 h-16 flex"
                style={{ border: "1px solid var(--color-border)", overflow: "hidden" }}
              >
                <span style={{ flex: 1, background: pal.bg }} />
                <span style={{ flex: 1, background: pal.surface }} />
                <span style={{ flex: 1, background: pal.text }} />
                <span style={{ flex: 1, background: pal.accent }} />
                {pal.accent2 && <span style={{ flex: 1, background: pal.accent2 }} />}
              </div>
              <p className="text-sm font-medium">{pal.name}</p>
            </button>
          );
        })}
      </div>

      <label className="flex items-center gap-3 cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => patch({ darkMode: e.target.checked })}
          className="w-4 h-4 m-0"
          style={{ width: "1rem", padding: 0 }}
          data-testid="checkbox-darkmode"
        />
        <span className="text-sm">Default to dark mode</span>
      </label>
    </div>
  );
}
