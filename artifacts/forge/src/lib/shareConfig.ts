import { WizardStateSchema, type WizardState } from "./schemas";

const PARAM = "config";

function base64UrlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(encoded: string): Uint8Array {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (encoded.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export interface EncodeResult {
  param: string;
  url: string;
  encoded: string;
  strippedAssets: boolean;
}

/**
 * Strip embedded asset data URLs (cover images, profile photo) when sharing,
 * so the URL stays under most browser/server limits. Returns whether anything
 * was stripped so we can warn the user.
 */
function sanitizeForShare(state: WizardState): { state: WizardState; strippedAssets: boolean } {
  let stripped = false;
  const projects = state.projects.map((p) => {
    if (p.coverImage) {
      stripped = true;
      const { coverImage: _omit, ...rest } = p;
      return rest;
    }
    return p;
  });
  let profilePhoto = state.profilePhoto;
  if (profilePhoto) {
    stripped = true;
    profilePhoto = undefined;
  }
  let backgroundImage = state.backgroundImage;
  if (backgroundImage) {
    stripped = true;
    backgroundImage = undefined;
  }
  return { state: { ...state, projects, profilePhoto, backgroundImage }, strippedAssets: stripped };
}

export function encodeConfig(state: WizardState, baseUrl?: string): EncodeResult {
  const sanitized = sanitizeForShare(state);
  const json = JSON.stringify(sanitized.state);
  const bytes = new TextEncoder().encode(json);
  const encoded = base64UrlEncode(bytes);
  const origin = baseUrl ?? (typeof window !== "undefined" ? window.location.origin + window.location.pathname : "");
  const sep = origin.includes("?") ? "&" : "?";
  return {
    param: PARAM,
    encoded,
    url: `${origin}${sep}${PARAM}=${encoded}`,
    strippedAssets: sanitized.strippedAssets,
  };
}

export function decodeConfig(encoded: string): WizardState | null {
  try {
    const bytes = base64UrlDecode(encoded);
    const json = new TextDecoder().decode(bytes);
    const obj = JSON.parse(json);
    const parsed = WizardStateSchema.safeParse(obj);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** Read ?config=... from the current URL, strip it, and return the decoded state (or null). */
export function consumeConfigFromUrl(): WizardState | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const raw = url.searchParams.get(PARAM);
  if (!raw) return null;
  url.searchParams.delete(PARAM);
  window.history.replaceState({}, "", url.toString());
  return decodeConfig(raw);
}
