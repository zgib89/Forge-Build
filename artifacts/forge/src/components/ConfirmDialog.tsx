import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { useConfirmStore } from "../lib/confirm";

export default function ConfirmDialog() {
  const pending = useConfirmStore((s) => s.pending);
  const resolve = useConfirmStore((s) => s.resolve);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const confirmRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!pending) return;
    requestAnimationFrame(() => {
      (pending.danger ? cancelRef.current : confirmRef.current)?.focus();
    });
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        resolve(false);
      } else if (e.key === "Enter") {
        // Don't submit if user is intentionally on cancel
        if (document.activeElement === cancelRef.current) {
          e.preventDefault();
          resolve(false);
        } else {
          e.preventDefault();
          resolve(true);
        }
      } else if (e.key === "Tab") {
        // Trap focus between the two buttons
        e.preventDefault();
        const focusables = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLButtonElement[];
        const idx = focusables.findIndex((b) => b === document.activeElement);
        const nextIdx = e.shiftKey
          ? (idx <= 0 ? focusables.length - 1 : idx - 1)
          : (idx + 1) % focusables.length;
        focusables[nextIdx]?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, resolve]);

  if (!pending) return null;

  return (
    <div
      className="cmdk-backdrop"
      style={{ paddingTop: "20vh" }}
      onClick={() => resolve(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      data-testid="confirm-dialog"
    >
      <div
        className="cmdk-shell"
        style={{ width: "min(440px, calc(100vw - 2rem))", maxHeight: "none", padding: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "1.5rem" }}>
          <div className="flex items-start gap-3 mb-4">
            {pending.danger && (
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: "color-mix(in oklch, var(--color-danger) 15%, transparent)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle className="w-5 h-5" style={{ color: "var(--color-danger)" }} />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h3 id="confirm-title" className="text-lg font-medium m-0">{pending.title}</h3>
              {pending.description && (
                <p className="text-sm text-mute m-0 mt-1">{pending.description}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              ref={cancelRef}
              type="button"
              onClick={() => resolve(false)}
              className="btn btn-ghost"
              data-testid="confirm-cancel"
            >
              {pending.cancelText ?? "Cancel"}
            </button>
            <button
              ref={confirmRef}
              type="button"
              onClick={() => resolve(true)}
              className={pending.danger ? "btn btn-danger" : "btn btn-primary"}
              data-testid="confirm-ok"
              style={
                pending.danger
                  ? {
                      background: "var(--color-danger)",
                      color: "white",
                      border: "1px solid var(--color-danger)",
                    }
                  : undefined
              }
            >
              {pending.confirmText ?? "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
