import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToastStore, type ToastTone } from "../lib/toast";

const TONE_COLORS: Record<ToastTone, string> = {
  default: "var(--color-text)",
  success: "var(--color-success)",
  error: "var(--color-danger)",
  info: "var(--color-accent)",
};

function ToneIcon({ tone }: { tone: ToastTone }) {
  const cls = "w-4 h-4 shrink-0 mt-0.5";
  if (tone === "success") return <CheckCircle2 className={cls} style={{ color: TONE_COLORS.success }} />;
  if (tone === "error") return <AlertCircle className={cls} style={{ color: TONE_COLORS.error }} />;
  if (tone === "info") return <Info className={cls} style={{ color: TONE_COLORS.info }} />;
  return <CheckCircle2 className={cls} style={{ color: TONE_COLORS.default }} />;
}

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="forge-toaster"
      data-testid="toaster"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="forge-toast glass-card"
          style={{ borderLeft: `3px solid ${TONE_COLORS[t.tone]}` }}
          data-testid={`toast-${t.tone}`}
        >
          <ToneIcon tone={t.tone} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium m-0">{t.title}</p>
            {t.description && <p className="text-xs text-mute m-0 mt-0.5">{t.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Dismiss"
            className="forge-toast-close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
