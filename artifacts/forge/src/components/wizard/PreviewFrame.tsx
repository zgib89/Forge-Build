import { useEffect, useRef, useState } from "react";
import { useWizard, getWizardState } from "../../lib/store";
import { apiUrl } from "../../lib/api";

export default function PreviewFrame() {
  const wizard = useWizard();
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [html, setHtml] = useState<string>(
    '<!doctype html><html><body style="font-family:monospace;padding:2rem;color:#888;">Loading preview...</body></html>',
  );

  const stateKey = JSON.stringify({
    name: wizard.name,
    role: wizard.role,
    tagline: wizard.tagline,
    location: wizard.location,
    careerCategory: wizard.careerCategory,
    preset: wizard.preset,
    palette: wizard.palette,
    darkMode: wizard.darkMode,
    fontPair: wizard.fontPair,
    radiusScale: wizard.radiusScale,
    visualStyle: wizard.visualStyle,
    cardStyle: wizard.cardStyle,
    backgroundTreatment: wizard.backgroundTreatment,
    backgroundImage: wizard.backgroundImage,
    glowIntensity: wizard.glowIntensity,
    edgeGlow: wizard.edgeGlow,
    motionLevel: wizard.motionLevel,
    marqueeSpeed: wizard.marqueeSpeed,
    hoverDepth: wizard.hoverDepth,
    grainIntensity: wizard.grainIntensity,
    glassBlur: wizard.glassBlur,
    sections: wizard.sections,
    footerStyle: wizard.footerStyle,
    showForgeAttribution: wizard.showForgeAttribution,
    githubUsername: wizard.githubUsername,
    projects: wizard.projects
      .filter((p) => !p.draft)
      .map((p) => ({
        id: p.id,
        title: p.title,
        summary: p.summary,
        stack: p.stack,
        date: p.date,
        liveUrl: p.liveUrl,
        repoUrl: p.repoUrl,
      })),
  });

  const makePreviewHtmlSafe = (raw: string): string => {
    if (typeof DOMParser === "undefined") return raw;
    const doc = new DOMParser().parseFromString(raw, "text/html");
    doc.querySelectorAll("a[href]").forEach((anchor) => {
      const href = anchor.getAttribute("href") ?? "";
      anchor.setAttribute("data-preview-href", href);
      anchor.setAttribute("aria-disabled", "true");
      anchor.setAttribute("tabindex", "-1");
      anchor.removeAttribute("href");
    });
    const style = doc.createElement("style");
    style.textContent = "a[data-preview-href]{pointer-events:none!important;cursor:default!important}";
    doc.head.appendChild(style);
    return "<!doctype html>\n" + doc.documentElement.outerHTML;
  };

  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(() => {
      const state = {
        ...getWizardState(wizard),
        name: wizard.name || "Your Name",
        role: wizard.role || "Your Role",
        domain: wizard.domain || "yoursite.work",
        profilePhoto: undefined,
        projects: wizard.projects
          .filter((p) => !p.draft)
          .map((p) => ({ ...p, coverImage: undefined })),
      };
      fetch(apiUrl("/api/forge/preview"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      })
        .then((r) => {
          if (!r.ok) throw new Error(`Preview failed (${r.status})`);
          return r.text();
        })
        .then((text) => {
          if (!cancelled) setHtml(makePreviewHtmlSafe(text));
        })
        .catch((err) => {
          if (!cancelled) {
            const message = err instanceof Error ? err.message : "Preview failed";
            setHtml(
              `<!doctype html><html><body style="font-family:monospace;padding:2rem;color:#888;">${message}</body></html>`,
            );
          }
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-app flex items-center gap-2 text-xs text-mute font-mono">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-danger)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-warn)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-success)" }} />
        <span className="ml-3">preview · {wizard.preset} · {wizard.paletteName} · {wizard.fontPair} · {wizard.cardStyle}{wizard.darkMode ? " · dark" : ""}</span>
      </div>
      <iframe
        ref={ref}
        title="Portfolio preview"
        srcDoc={html}
        className="flex-1 w-full border-0 bg-white"
        sandbox="allow-same-origin"
        data-testid="iframe-preview"
      />
    </div>
  );
}
