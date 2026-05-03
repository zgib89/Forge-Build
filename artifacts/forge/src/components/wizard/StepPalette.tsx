import { useMemo, useState } from "react";
import { getPreset, type PaletteDef } from "../../lib/presets";
import { useWizard } from "../../lib/store";
import {
  FONT_PAIRS,
  RADIUS_SCALES,
  type FontPairId,
  type RadiusScaleId,
} from "../../lib/typography";
import {
  cssColorToHex,
  deriveFromBrand,
  normalizeHex,
  randomBrandHex,
} from "../../lib/colorMath";
import { Shuffle, RotateCcw, Wand2, Moon, Sun } from "lucide-react";

type TokenKey = "bg" | "surface" | "border" | "text" | "mute" | "accent" | "accent2";

const TOKENS: { key: TokenKey; label: string; hint: string }[] = [
  { key: "bg", label: "Background", hint: "Page canvas" },
  { key: "surface", label: "Surface", hint: "Cards & panels" },
  { key: "border", label: "Border", hint: "Hairlines & dividers" },
  { key: "text", label: "Text", hint: "Body copy" },
  { key: "mute", label: "Muted", hint: "Captions, secondary" },
  { key: "accent", label: "Accent", hint: "Brand color, links" },
  { key: "accent2", label: "Accent 2", hint: "Aurora gradient (optional)" },
];

function TokenSwatch({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string | undefined;
  onChange: (hex: string) => void;
}) {
  const display = value ?? "transparent";
  const hex = useMemo(() => (value ? cssColorToHex(value) : "#888888"), [value]);
  return (
    <label className="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--color-surface)] cursor-pointer relative">
      <span
        className="w-10 h-10 rounded-md flex-shrink-0"
        style={{
          background: display,
          border: "1px solid var(--color-border)",
          backgroundImage:
            !value
              ? "linear-gradient(45deg, var(--color-border) 25%, transparent 25%, transparent 75%, var(--color-border) 75%), linear-gradient(45deg, var(--color-border) 25%, transparent 25%, transparent 75%, var(--color-border) 75%)"
              : undefined,
          backgroundSize: !value ? "8px 8px" : undefined,
          backgroundPosition: !value ? "0 0, 4px 4px" : undefined,
        }}
      />
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        className="absolute left-2 top-2 w-10 h-10 opacity-0 cursor-pointer"
        aria-label={`${label} color`}
        data-testid={`color-${label.toLowerCase().replace(/\s+/g, "-")}`}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-mute font-mono truncate">{value ?? "— not set"}</div>
      </div>
      <span className="text-[10px] text-mute hidden sm:block">{hint}</span>
    </label>
  );
}

export default function StepPalette() {
  const presetId = useWizard((s) => s.preset);
  const paletteName = useWizard((s) => s.paletteName);
  const palette = useWizard((s) => s.palette);
  const darkMode = useWizard((s) => s.darkMode);
  const fontPair = useWizard((s) => s.fontPair);
  const radiusScale = useWizard((s) => s.radiusScale);
  const setPalette = useWizard((s) => s.setPalette);
  const patch = useWizard((s) => s.patch);
  const preset = getPreset(presetId);

  const [brandHex, setBrandHex] = useState<string>(() => cssColorToHex(palette.accent));
  const brandHexValid = normalizeHex(brandHex) !== null;

  const updateToken = (key: TokenKey, hex: string) => {
    const next = { ...palette, [key]: hex };
    patch({ palette: next, paletteName: "Custom" });
  };

  const applyBrand = (hex: string) => {
    const normalized = normalizeHex(hex);
    if (!normalized) return;
    const derived = deriveFromBrand(normalized, darkMode);
    patch({
      palette: {
        bg: derived.bg,
        surface: derived.surface,
        border: derived.border,
        text: derived.text,
        mute: derived.mute,
        accent: derived.accent,
        accent2: derived.accent2,
      },
      paletteName: "Custom",
    });
  };

  const randomize = () => {
    const hex = randomBrandHex();
    setBrandHex(hex);
    applyBrand(hex);
  };

  const resetToPresetPalette = () => {
    const first = preset.palettes[0];
    setPalette(first);
  };

  return (
    <div className="space-y-7">
      <div>
        <p className="eyebrow mb-2">Step 3</p>
        <h2 className="text-3xl mb-2">Make it yours.</h2>
        <p className="text-mute text-sm">
          Start with a curated palette, generate from a brand color, or tune every token by
          hand. Live preview updates as you go.
        </p>
      </div>

      {/* Curated palettes */}
      <section>
        <header className="flex items-baseline justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-mute">
            Curated palettes
          </h3>
          <span className="text-xs text-mute">{preset.name} · 4 starters</span>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {preset.palettes.map((pal: PaletteDef) => {
            const active = pal.name === paletteName;
            return (
              <button
                key={pal.name}
                type="button"
                onClick={() => setPalette(pal)}
                className="text-left p-2 rounded-lg transition-all"
                style={{
                  border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: active ? "var(--color-surface)" : "transparent",
                  boxShadow: active
                    ? "0 0 0 2px color-mix(in oklch, var(--color-accent) 25%, transparent)"
                    : "none",
                }}
                data-testid={`button-palette-${pal.name.toLowerCase().replace(/\W+/g, "-")}`}
              >
                <div
                  className="rounded-md mb-2 h-12 flex"
                  style={{ border: "1px solid var(--color-border)", overflow: "hidden" }}
                >
                  <span style={{ flex: 1, background: pal.bg }} />
                  <span style={{ flex: 1, background: pal.surface }} />
                  <span style={{ flex: 1, background: pal.text }} />
                  <span style={{ flex: 1, background: pal.accent }} />
                  {pal.accent2 && <span style={{ flex: 1, background: pal.accent2 }} />}
                </div>
                <p className="text-xs font-medium truncate">{pal.name}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Brand color generator */}
      <section
        className="p-4 rounded-lg"
        style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
      >
        <header className="flex items-baseline gap-2 mb-3">
          <Wand2 className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          <h3 className="text-sm font-semibold">Generate from a brand color</h3>
        </header>
        <p className="text-xs text-mute mb-3">
          Pick one color — we'll derive a balanced palette around it.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <span
              className="block w-12 h-12 rounded-md"
              style={{ background: brandHex, border: "1px solid var(--color-border)" }}
            />
            <input
              type="color"
              value={brandHex}
              onChange={(e) => setBrandHex(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
              aria-label="Brand color"
              data-testid="color-brand"
            />
          </div>
          <input
            type="text"
            value={brandHex}
            onChange={(e) => setBrandHex(e.target.value)}
            className="font-mono text-sm w-28"
            style={{
              borderColor: brandHexValid
                ? "var(--color-border)"
                : "var(--color-danger, #c33)",
            }}
            data-testid="input-brand-hex"
          />
          <button
            type="button"
            onClick={() => applyBrand(brandHex)}
            disabled={!brandHexValid}
            className="btn btn-primary text-sm"
            data-testid="button-apply-brand"
            title={brandHexValid ? undefined : "Enter a valid hex like #ff5500"}
          >
            Apply
          </button>
          <button
            type="button"
            onClick={randomize}
            className="btn btn-ghost text-sm"
            data-testid="button-randomize"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Surprise me
          </button>
        </div>
      </section>

      {/* Per-token editor */}
      <section>
        <header className="flex items-baseline justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-mute">
            Color tokens
          </h3>
          <button
            type="button"
            onClick={resetToPresetPalette}
            className="text-xs text-mute hover:text-app inline-flex items-center gap-1"
            data-testid="button-reset-palette"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </header>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-1 rounded-lg p-1"
          style={{ border: "1px solid var(--color-border)" }}
        >
          {TOKENS.map((t) => (
            <TokenSwatch
              key={t.key}
              label={t.label}
              hint={t.hint}
              value={palette[t.key]}
              onChange={(hex) => updateToken(t.key, hex)}
            />
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-mute mb-3">
          Typography
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {FONT_PAIRS.map((fp) => {
            const active = fp.id === fontPair;
            return (
              <button
                key={fp.id}
                type="button"
                onClick={() => patch({ fontPair: fp.id as FontPairId })}
                className="text-left p-3 rounded-lg transition-all"
                style={{
                  border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: active ? "var(--color-surface)" : "transparent",
                  boxShadow: active
                    ? "0 0 0 2px color-mix(in oklch, var(--color-accent) 25%, transparent)"
                    : "none",
                }}
                data-testid={`button-fontpair-${fp.id}`}
              >
                <div className="text-xl mb-1 leading-none" style={fp.sampleStyle}>
                  Aa
                </div>
                <div className="text-xs font-medium">{fp.name}</div>
                <div className="text-[10px] text-mute mt-0.5 truncate">{fp.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Corners */}
      <section>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-mute mb-3">
          Corners
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {RADIUS_SCALES.map((rs) => {
            const active = rs.id === radiusScale;
            return (
              <button
                key={rs.id}
                type="button"
                onClick={() => patch({ radiusScale: rs.id as RadiusScaleId })}
                className="text-left p-3 transition-all"
                style={{
                  border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: active ? "var(--color-surface)" : "transparent",
                  borderRadius: rs.md,
                  boxShadow: active
                    ? "0 0 0 2px color-mix(in oklch, var(--color-accent) 25%, transparent)"
                    : "none",
                }}
                data-testid={`button-radius-${rs.id}`}
              >
                <div
                  className="h-8 w-full mb-2"
                  style={{
                    background: "var(--color-accent)",
                    borderRadius: rs.md,
                    opacity: 0.85,
                  }}
                />
                <div className="text-xs font-medium">{rs.name}</div>
                <div className="text-[10px] text-mute mt-0.5">{rs.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dark mode */}
      <section>
        <button
          type="button"
          onClick={() => patch({ darkMode: !darkMode })}
          className="w-full p-3 rounded-lg flex items-center gap-3 transition-all"
          style={{
            border: "1px solid var(--color-border)",
            background: darkMode ? "var(--color-surface)" : "transparent",
          }}
          data-testid="button-darkmode"
        >
          {darkMode ? (
            <Moon className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          ) : (
            <Sun className="w-4 h-4 text-mute" />
          )}
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">
              {darkMode ? "Dark mode" : "Light mode"}
            </div>
            <div className="text-xs text-mute">
              {darkMode
                ? "Generated site defaults to dark."
                : "Generated site defaults to light."}
            </div>
          </div>
          <span
            className="w-9 h-5 rounded-full relative transition-colors"
            style={{
              background: darkMode ? "var(--color-accent)" : "var(--color-border)",
            }}
          >
            <span
              className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
              style={{ transform: darkMode ? "translateX(18px)" : "translateX(2px)" }}
            />
          </span>
        </button>
      </section>
    </div>
  );
}
