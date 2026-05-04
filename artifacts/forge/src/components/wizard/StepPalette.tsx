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
  generateRandomPalette,
  normalizeHex,
  randomBrandHex,
} from "../../lib/colorMath";
import {
  VISUAL_STYLES,
  type BackgroundTreatment,
  type CardStyleId,
  type MotionLevel,
  type VisualStyleId,
} from "../../lib/professions";
import { ImagePlus, Moon, RotateCcw, Shuffle, SlidersHorizontal, Sun, Wand2, X } from "lucide-react";

type TokenKey = "bg" | "surface" | "border" | "text" | "mute" | "accent" | "accent2";
type TabId = "quick" | "colors" | "type" | "effects" | "background";

const TABS: { id: TabId; label: string }[] = [
  { id: "quick", label: "Quick" },
  { id: "colors", label: "Colors" },
  { id: "type", label: "Type" },
  { id: "effects", label: "Effects" },
  { id: "background", label: "Background" },
];

const TOKENS: { key: TokenKey; label: string; hint: string }[] = [
  { key: "bg", label: "Background", hint: "Page canvas" },
  { key: "surface", label: "Surface", hint: "Cards and panels" },
  { key: "border", label: "Border", hint: "Hairlines and dividers" },
  { key: "text", label: "Text", hint: "Body copy" },
  { key: "mute", label: "Muted", hint: "Captions, secondary" },
  { key: "accent", label: "Accent", hint: "Brand color, links" },
  { key: "accent2", label: "Accent 2", hint: "Gradients and glow" },
];

const CARD_STYLES: { id: CardStyleId; label: string; desc: string }[] = [
  { id: "flat-editorial", label: "Flat Editorial", desc: "Clean paper and lines" },
  { id: "border-line", label: "Border Line", desc: "Precise and universal" },
  { id: "soft-bubble", label: "Soft Bubble", desc: "Friendly and approachable" },
  { id: "forge-glass", label: "Forge Glass", desc: "Gloss, blur, edge light" },
  { id: "archive-evidence", label: "Archive Evidence", desc: "Noir case-file energy" },
  { id: "recon-stat", label: "Recon Stat", desc: "Bold tiles and metrics" },
  { id: "app-icon", label: "App Icon", desc: "Rounded glossy surfaces" },
];

const MOTION_LEVELS: { id: MotionLevel; label: string }[] = [
  { id: "none", label: "None" },
  { id: "calm", label: "Calm" },
  { id: "standard", label: "Standard" },
  { id: "expressive", label: "Expressive" },
];

const BACKGROUND_TREATMENTS: { id: BackgroundTreatment; label: string; desc: string }[] = [
  { id: "none", label: "None", desc: "Solid page canvas" },
  { id: "soft", label: "Soft wash", desc: "Subtle image underlay" },
  { id: "duotone", label: "Duotone", desc: "Image pulled into your palette" },
  { id: "grain", label: "Grain", desc: "Editorial texture and depth" },
  { id: "spotlight", label: "Spotlight", desc: "Focused glow behind the hero" },
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
        <div className="text-xs text-mute font-mono truncate">{value ?? "not set"}</div>
      </div>
      <span className="text-[10px] text-mute hidden sm:block">{hint}</span>
    </label>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="px-3 py-2 text-xs font-medium rounded-md"
      style={{
        background: active ? "var(--color-text)" : "transparent",
        color: active ? "var(--color-bg)" : "var(--color-text-mute)",
        border: "1px solid var(--color-border)",
      }}
    >
      {label}
    </button>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block p-3 rounded-lg" style={{ border: "1px solid var(--color-border)" }}>
      <span className="flex items-center justify-between gap-3 text-sm font-medium">
        <span>{label}</span>
        <span className="font-mono text-xs text-mute">
          {value}
          {unit ?? ""}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-3"
      />
    </label>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string; desc?: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className="text-left p-3 rounded-lg transition-all"
              style={{
                border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                background: active ? "var(--color-surface)" : "transparent",
                boxShadow: active ? "0 0 0 2px color-mix(in oklch, var(--color-accent) 14%, transparent)" : "none",
              }}
            >
              <span className="text-xs font-medium block">{option.label}</span>
              {option.desc && <span className="text-[10px] text-mute block mt-1">{option.desc}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function StepPalette() {
  const presetId = useWizard((s) => s.preset);
  const paletteName = useWizard((s) => s.paletteName);
  const palette = useWizard((s) => s.palette);
  const darkMode = useWizard((s) => s.darkMode);
  const fontPair = useWizard((s) => s.fontPair);
  const radiusScale = useWizard((s) => s.radiusScale);
  const visualStyle = useWizard((s) => s.visualStyle);
  const cardStyle = useWizard((s) => s.cardStyle);
  const backgroundTreatment = useWizard((s) => s.backgroundTreatment);
  const backgroundImage = useWizard((s) => s.backgroundImage);
  const backgroundImageName = useWizard((s) => s.backgroundImageName);
  const glowIntensity = useWizard((s) => s.glowIntensity);
  const edgeGlow = useWizard((s) => s.edgeGlow);
  const motionLevel = useWizard((s) => s.motionLevel);
  const marqueeSpeed = useWizard((s) => s.marqueeSpeed);
  const hoverDepth = useWizard((s) => s.hoverDepth);
  const grainIntensity = useWizard((s) => s.grainIntensity);
  const glassBlur = useWizard((s) => s.glassBlur);
  const setPalette = useWizard((s) => s.setPalette);
  const patch = useWizard((s) => s.patch);
  const preset = getPreset(presetId);

  const [tab, setTab] = useState<TabId>("quick");
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
    const next = generateRandomPalette(darkMode);
    setBrandHex(cssColorToHex(next.accent));
    patch({
      palette: {
        bg: next.bg,
        surface: next.surface,
        border: next.border,
        text: next.text,
        mute: next.mute,
        accent: next.accent,
        accent2: next.accent2,
      },
      paletteName: next.name,
      visualStyle: "custom",
    });
  };

  const resetToPresetPalette = () => {
    const first = preset.palettes[0];
    setPalette(first);
  };

  const applyVisualStyle = (id: VisualStyleId) => {
    const style = VISUAL_STYLES.find((s) => s.id === id);
    if (!style) return;
    patch({
      visualStyle: style.id,
      paletteName: style.palette.name,
      palette: style.palette,
      darkMode: style.darkMode,
      fontPair: style.fontPair,
      radiusScale: style.radiusScale,
      cardStyle: style.cardStyle,
      backgroundTreatment: style.backgroundTreatment,
      glowIntensity: style.effects.glowIntensity,
      edgeGlow: style.effects.edgeGlow,
      motionLevel: style.effects.motionLevel,
      marqueeSpeed: style.effects.marqueeSpeed,
      hoverDepth: style.effects.hoverDepth,
      grainIntensity: style.effects.grainIntensity,
      glassBlur: style.effects.glassBlur,
    });
  };

  const onBackground = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      patch({
        backgroundImage: String(reader.result),
        backgroundImageName: file.name,
        backgroundTreatment: backgroundTreatment === "none" ? "soft" : backgroundTreatment,
      });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-7">
      <div>
        <p className="eyebrow mb-2">Step 3</p>
        <h2 className="text-3xl mb-2">Customize the whole system.</h2>
        <p className="text-mute text-sm">
          Start with a complete visual style, then tune colors, type, backgrounds, card
          behavior, glow, motion, and image treatment without touching code.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Customization areas">
        {TABS.map((t) => (
          <TabButton key={t.id} active={tab === t.id} label={t.label} onClick={() => setTab(t.id)} />
        ))}
      </div>

      {tab === "quick" && (
        <section className="space-y-4">
          <header className="flex items-baseline justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mute">Visual systems</h3>
            <span className="text-xs text-mute">Start broad, then tune the details</span>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VISUAL_STYLES.map((style) => {
              const active = style.id === visualStyle;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => applyVisualStyle(style.id)}
                  className="text-left p-3 rounded-lg transition-all"
                  style={{
                    border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                    background: active ? "var(--color-surface)" : "transparent",
                    boxShadow: active ? "0 0 0 2px color-mix(in oklch, var(--color-accent) 18%, transparent)" : "none",
                  }}
                  data-testid={`button-visual-style-${style.id}`}
                >
                  <div className="rounded-md mb-3 h-12 flex overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
                    <span style={{ flex: 1, background: style.palette.bg }} />
                    <span style={{ flex: 1, background: style.palette.surface }} />
                    <span style={{ flex: 1, background: style.palette.accent }} />
                    <span style={{ flex: 1, background: style.palette.accent2 ?? style.palette.text }} />
                  </div>
                  <span className="text-sm font-medium block">{style.label}</span>
                  <span className="text-xs text-mute leading-relaxed block mt-1">{style.description}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {tab === "colors" && (
        <section className="space-y-5">
          <section>
            <header className="flex items-baseline justify-between mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-mute">Curated palettes</h3>
              <span className="text-xs text-mute">{preset.name} starters</span>
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
                      boxShadow: active ? "0 0 0 2px color-mix(in oklch, var(--color-accent) 25%, transparent)" : "none",
                    }}
                    data-testid={`button-palette-${pal.name.toLowerCase().replace(/\W+/g, "-")}`}
                  >
                    <div className="rounded-md mb-2 h-12 flex overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
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

          <section className="p-4 rounded-lg" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
            <header className="flex items-baseline gap-2 mb-3">
              <Wand2 className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
              <h3 className="text-sm font-semibold">Generate from a brand color</h3>
            </header>
          <p className="text-xs text-mute mb-3">Pick one color, generate from that color, or roll a complete accessible palette.</p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <span className="block w-12 h-12 rounded-md" style={{ background: brandHex, border: "1px solid var(--color-border)" }} />
                <input type="color" value={brandHex} onChange={(e) => setBrandHex(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" aria-label="Brand color" data-testid="color-brand" />
              </div>
              <input
                type="text"
                value={brandHex}
                onChange={(e) => setBrandHex(e.target.value)}
                className="font-mono text-sm w-28"
                style={{ borderColor: brandHexValid ? "var(--color-border)" : "var(--color-danger, #c33)" }}
                data-testid="input-brand-hex"
              />
              <button type="button" onClick={() => applyBrand(brandHex)} disabled={!brandHexValid} className="btn btn-primary text-sm" data-testid="button-apply-brand">
                Apply
              </button>
              <button type="button" onClick={randomize} className="btn btn-ghost text-sm" data-testid="button-randomize">
                <Shuffle className="w-3.5 h-3.5" />
                Generate palette
              </button>
            </div>
          </section>

          <section>
            <header className="flex items-baseline justify-between mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-mute">Color tokens</h3>
              <button type="button" onClick={resetToPresetPalette} className="text-xs text-mute hover:text-app inline-flex items-center gap-1" data-testid="button-reset-palette">
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 rounded-lg p-1" style={{ border: "1px solid var(--color-border)" }}>
              {TOKENS.map((t) => (
                <TokenSwatch key={t.key} label={t.label} hint={t.hint} value={palette[t.key]} onChange={(hex) => updateToken(t.key, hex)} />
              ))}
            </div>
          </section>
        </section>
      )}

      {tab === "type" && (
        <section className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mute mb-3">Font pairing</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      boxShadow: active ? "0 0 0 2px color-mix(in oklch, var(--color-accent) 25%, transparent)" : "none",
                    }}
                    data-testid={`button-fontpair-${fp.id}`}
                  >
                    <div className="text-2xl mb-1 leading-none" style={fp.sampleStyle}>
                      Your Name
                    </div>
                    <div className="text-sm font-medium">{fp.name}</div>
                    <div className="text-xs text-mute mt-0.5">{fp.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mute mb-3">Corners</h3>
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
                      boxShadow: active ? "0 0 0 2px color-mix(in oklch, var(--color-accent) 25%, transparent)" : "none",
                    }}
                    data-testid={`button-radius-${rs.id}`}
                  >
                    <div className="h-8 w-full mb-2" style={{ background: "var(--color-accent)", borderRadius: rs.md, opacity: 0.85 }} />
                    <div className="text-xs font-medium">{rs.name}</div>
                    <div className="text-[10px] text-mute mt-0.5">{rs.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => patch({ darkMode: !darkMode })}
            className="w-full p-3 rounded-lg flex items-center gap-3 transition-all"
            style={{ border: "1px solid var(--color-border)", background: darkMode ? "var(--color-surface)" : "transparent" }}
            data-testid="button-darkmode"
          >
            {darkMode ? <Moon className="w-4 h-4" style={{ color: "var(--color-accent)" }} /> : <Sun className="w-4 h-4 text-mute" />}
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{darkMode ? "Dark mode" : "Light mode"}</div>
              <div className="text-xs text-mute">{darkMode ? "Generated site defaults to dark." : "Generated site defaults to light."}</div>
            </div>
          </button>
        </section>
      )}

      {tab === "effects" && (
        <section className="space-y-5">
          <Segmented label="Card style" value={cardStyle as CardStyleId} options={CARD_STYLES} onChange={(value) => patch({ cardStyle: value })} />
          <Segmented label="Motion level" value={motionLevel as MotionLevel} options={MOTION_LEVELS} onChange={(value) => patch({ motionLevel: value })} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SliderField label="Glow intensity" value={glowIntensity ?? 1} min={0} max={4} onChange={(value) => patch({ glowIntensity: value })} />
            <SliderField label="Card edge glow" value={edgeGlow ?? 1} min={0} max={4} onChange={(value) => patch({ edgeGlow: value })} />
            <SliderField label="Hover lift" value={hoverDepth ?? 2} min={0} max={8} unit="px" onChange={(value) => patch({ hoverDepth: value })} />
            <SliderField label="Glass blur" value={glassBlur ?? 0} min={0} max={3} onChange={(value) => patch({ glassBlur: value })} />
            <SliderField label="Texture grain" value={grainIntensity ?? 0} min={0} max={3} onChange={(value) => patch({ grainIntensity: value })} />
            <SliderField label="Conveyor speed" value={marqueeSpeed ?? 30} min={12} max={90} unit="s" onChange={(value) => patch({ marqueeSpeed: value })} />
          </div>
          <div className="rounded-lg p-3 text-xs text-mute flex items-start gap-2" style={{ border: "1px solid var(--color-border)" }}>
            <SlidersHorizontal className="w-4 h-4 mt-0.5" style={{ color: "var(--color-accent)" }} />
            <p className="m-0">
              These controls are bounded so the site can look expressive without becoming unreadable.
              Reduced-motion visitors still get a calm version automatically.
            </p>
          </div>
        </section>
      )}

      {tab === "background" && (
        <section className="space-y-5">
          <Segmented label="Background treatment" value={backgroundTreatment as BackgroundTreatment} options={BACKGROUND_TREATMENTS} onChange={(value) => patch({ backgroundTreatment: value })} />

          <div className="rounded-lg p-4 space-y-3" style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
            <div className="flex items-center gap-2">
              <ImagePlus className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
              <h3 className="text-sm font-semibold m-0">Upload a background image</h3>
            </div>
            <p className="text-xs text-mute m-0">
              Use a wide image with calm negative space. Pexels works well for materials,
              studios, city detail, product shots, landscapes, and abstract surfaces.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                ["Pexels materials", "https://www.pexels.com/search/texture%20background/"],
                ["Pexels studio", "https://www.pexels.com/search/studio%20desk/"],
                ["Pexels abstract", "https://www.pexels.com/search/abstract%20background/"],
              ].map(([label, href]) => (
                <a key={href} href={href} target="_blank" rel="noreferrer" className="btn btn-ghost text-xs">
                  {label}
                </a>
              ))}
            </div>
            <input type="file" accept="image/*" onChange={(e) => onBackground(e.target.files?.[0])} className="text-xs" data-testid="input-background-image" />
            {backgroundImage && (
              <div className="flex items-center gap-3">
                <img src={backgroundImage} alt="" className="w-20 h-14 object-cover rounded border border-app" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium m-0 truncate">{backgroundImageName ?? "Uploaded image"}</p>
                  <p className="text-[10px] text-mute m-0">Stored locally in this browser and stripped from share links.</p>
                </div>
                <button type="button" className="btn btn-ghost text-xs" onClick={() => patch({ backgroundImage: undefined, backgroundImageName: undefined })}>
                  <X className="w-3 h-3" />
                  Remove
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
