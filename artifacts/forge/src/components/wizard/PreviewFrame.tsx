import { useEffect, useRef, useState } from "react";
import { useWizard, getWizardState } from "../../lib/store";

export default function PreviewFrame() {
  const wizard = useWizard();
  const ref = useRef<HTMLIFrameElement | null>(null);
  const [doc, setDoc] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const stateKey = JSON.stringify({
    name: wizard.name,
    role: wizard.role,
    tagline: wizard.tagline,
    location: wizard.location,
    preset: wizard.preset,
    palette: wizard.palette,
    darkMode: wizard.darkMode,
    sections: wizard.sections,
    showForgeAttribution: wizard.showForgeAttribution,
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
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const state = {
          ...getWizardState(wizard),
          name: wizard.name || "Your Name",
          role: wizard.role || "Your Role",
          domain: wizard.domain || "yoursite.work",
        };
        const res = await fetch(`/api/forge/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        });
        const html = await res.text();
        setDoc(html);
      } catch {
        setDoc("<html><body style='font-family:monospace;padding:2rem'>Preview unavailable</body></html>");
      } finally {
        setLoading(false);
      }
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
        {loading && <span className="ml-auto opacity-70">updating…</span>}
      </div>
      <iframe
        ref={ref}
        title="Portfolio preview"
        srcDoc={doc}
        className="flex-1 w-full border-0 bg-white"
        sandbox="allow-same-origin"
        data-testid="iframe-preview"
      />
    </div>
  );
}
