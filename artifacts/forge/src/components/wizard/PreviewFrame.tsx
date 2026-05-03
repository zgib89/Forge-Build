import { useEffect, useRef, useState } from "react";
import { useWizard, getWizardState } from "../../lib/store";

export default function PreviewFrame() {
  const wizard = useWizard();
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [src, setSrc] = useState<string>("about:blank");

  const stateKey = JSON.stringify({
    name: wizard.name,
    role: wizard.role,
    tagline: wizard.tagline,
    location: wizard.location,
    preset: wizard.preset,
    palette: wizard.palette,
    darkMode: wizard.darkMode,
    sections: wizard.sections,
    footerStyle: wizard.footerStyle,
    showForgeAttribution: wizard.showForgeAttribution,
    githubUsername: wizard.githubUsername,
    projects: wizard.projects.map((p) => ({
      id: p.id,
      title: p.title,
      summary: p.summary,
      stack: p.stack,
      date: p.date,
      liveUrl: p.liveUrl,
      repoUrl: p.repoUrl,
    })),
  });

  useEffect(() => {
    const handle = setTimeout(() => {
      const state = {
        ...getWizardState(wizard),
        name: wizard.name || "Your Name",
        role: wizard.role || "Your Role",
        domain: wizard.domain || "yoursite.work",
        profilePhoto: undefined,
        projects: wizard.projects.map((p) => ({ ...p, coverImage: undefined })),
      };
      const encoded = encodeURIComponent(JSON.stringify(state));
      setSrc(`/api/forge/preview?state=${encoded}`);
    }, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-app flex items-center gap-2 text-xs text-mute font-mono">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-danger)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-warn)" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--color-success)" }} />
        <span className="ml-3">preview · {wizard.preset} · {wizard.paletteName}</span>
      </div>
      <iframe
        ref={ref}
        title="Portfolio preview"
        src={src}
        className="flex-1 w-full border-0 bg-white"
        sandbox="allow-same-origin"
        data-testid="iframe-preview"
      />
    </div>
  );
}
