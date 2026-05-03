import { useEffect, useState } from "react";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS: { key: React.ReactNode; label: string; group: string }[] = [
  { group: "Global", key: <><kbd className="cmdk-kbd">⌘</kbd><kbd className="cmdk-kbd">K</kbd></>, label: "Open command palette" },
  { group: "Global", key: <kbd className="cmdk-kbd">?</kbd>, label: "Open this shortcut sheet" },
  { group: "Global", key: <kbd className="cmdk-kbd">esc</kbd>, label: "Close any modal" },
  { group: "Wizard", key: <><kbd className="cmdk-kbd">⌘</kbd><kbd className="cmdk-kbd">↵</kbd></>, label: "Continue to next step" },
  { group: "Wizard", key: <><kbd className="cmdk-kbd">⌘</kbd><kbd className="cmdk-kbd">→</kbd></>, label: "Next step" },
  { group: "Wizard", key: <><kbd className="cmdk-kbd">⌘</kbd><kbd className="cmdk-kbd">←</kbd></>, label: "Previous step" },
  { group: "Projects", key: <kbd className="cmdk-kbd">drag</kbd>, label: "Reorder by dragging the grip handle" },
];

export default function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ignore if user is typing in an input/textarea/contentEditable
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const editing = tag === "input" || tag === "textarea" || target?.isContentEditable;
      if (e.key === "?" && !editing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  const groups: Record<string, typeof SHORTCUTS> = {};
  for (const s of SHORTCUTS) {
    (groups[s.group] ??= []).push(s);
  }

  return (
    <div
      className="cmdk-backdrop"
      style={{ paddingTop: "15vh" }}
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="kbhelp-title"
      data-testid="keyboard-help"
    >
      <div className="cmdk-shell" style={{ width: "min(540px, calc(100vw - 2rem))" }} onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <Keyboard className="w-4 h-4 text-mute" aria-hidden="true" />
          <span id="kbhelp-title" className="text-sm font-medium flex-1">Keyboard shortcuts</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="forge-toast-close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className="cmdk-list" style={{ padding: "0.75rem 0 1rem" }}>
          {Object.entries(groups).map(([name, items]) => (
            <div key={name}>
              <div className="cmdk-group-label">{name}</div>
              {items.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.45rem 1rem",
                  }}
                >
                  <span className="text-sm flex-1">{s.label}</span>
                  <span style={{ display: "inline-flex", gap: 2 }}>{s.key}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="cmdk-footer">
          <span>Press <kbd className="cmdk-kbd">?</kbd> anytime</span>
          <span className="ml-auto"><kbd className="cmdk-kbd">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
