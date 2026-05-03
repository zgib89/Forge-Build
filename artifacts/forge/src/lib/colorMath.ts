export interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hexToHsl(hex: string): HSL {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean.padEnd(6, "0").slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hsl(h: number, s: number, l: number): string {
  const hh = ((Math.round(h) % 360) + 360) % 360;
  const ss = Math.max(0, Math.min(100, Math.round(s)));
  const ll = Math.max(0, Math.min(100, Math.round(l)));
  return `hsl(${hh} ${ss}% ${ll}%)`;
}

export interface DerivedPalette {
  bg: string;
  surface: string;
  border: string;
  text: string;
  mute: string;
  accent: string;
  accent2?: string;
}

export function deriveFromBrand(hex: string, dark: boolean): DerivedPalette {
  const { h, s, l } = hexToHsl(hex);
  const accent2Hue = (h + 40) % 360;
  // Clamp accent lightness so it stays readable on the derived bg/surface.
  // In light mode bg is ~98% L → accent must be dark enough (35-60).
  // In dark mode bg is ~8% L → accent must be light enough (55-78).
  const accentL = dark
    ? Math.max(55, Math.min(78, l))
    : Math.max(35, Math.min(60, l));
  const accentS = Math.max(s, 35);
  const accentColor = hsl(h, accentS, accentL);
  if (dark) {
    return {
      bg: hsl(h, Math.min(s, 30), 8),
      surface: hsl(h, Math.min(s, 25), 12),
      border: hsl(h, Math.min(s, 22), 22),
      text: hsl(h, Math.min(s, 8), 96),
      mute: hsl(h, Math.min(s, 14), 65),
      accent: accentColor,
      accent2: hsl(accent2Hue, Math.max(s, 50), 65),
    };
  }
  return {
    bg: hsl(h, Math.min(s, 12), 98),
    surface: hsl(h, Math.min(s, 16), 96),
    border: hsl(h, Math.min(s, 20), 88),
    text: hsl(h, Math.min(s, 14), 14),
    mute: hsl(h, Math.min(s, 18), 42),
    accent: accentColor,
    accent2: hsl(accent2Hue, Math.max(s - 10, 40), 50),
  };
}

export function normalizeHex(input: string): string | null {
  const m = input.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(m)) return m;
  if (/^#[0-9a-f]{3}$/.test(m)) {
    return (
      "#" +
      m
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")
    );
  }
  if (/^[0-9a-f]{6}$/.test(m)) return "#" + m;
  if (/^[0-9a-f]{3}$/.test(m)) {
    return "#" + m.split("").map((c) => c + c).join("");
  }
  return null;
}

export function randomBrandHex(): string {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 30);
  const l = 45 + Math.floor(Math.random() * 15);
  return hslStringToHex(`hsl(${h} ${s}% ${l}%)`);
}

export function cssColorToHex(cssColor: string): string {
  const trimmed = cssColor.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const c = trimmed.slice(1);
    return (
      "#" +
      c
        .split("")
        .map((ch) => ch + ch)
        .join("")
        .toLowerCase()
    );
  }
  if (typeof document === "undefined") return "#888888";
  const probe = document.createElement("div");
  probe.style.color = trimmed;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  document.body.removeChild(probe);
  const m = computed.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return "#888888";
  const [r, g, b] = m.slice(0, 3).map((n) => Math.round(Number(n)));
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function hslStringToHex(hslStr: string): string {
  const m = hslStr.match(/(\d+(?:\.\d+)?)/g);
  if (!m || m.length < 3) return "#000000";
  const h = Number(m[0]);
  const s = Number(m[1]) / 100;
  const l = Number(m[2]) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) =>
    Math.round((v + mm) * 255)
      .toString(16)
      .padStart(2, "0");
  return "#" + to(r) + to(g) + to(b);
}
