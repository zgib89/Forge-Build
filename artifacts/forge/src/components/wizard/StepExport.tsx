import { useState } from "react";
import { useLocation } from "wouter";
import { Download, Mail, Loader2 } from "lucide-react";
import { useWizard, getWizardState } from "../../lib/store";
import { WizardStateSchema } from "../../lib/schemas";

const API_BASE = `${import.meta.env.BASE_URL}api`.replace(/\/+/g, "/");

export default function StepExport() {
  const wizard = useWizard();
  const patch = useWizard((s) => s.patch);
  const [, navigate] = useLocation();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const firstName = wizard.name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const suggestedDomain = firstName ? `${firstName.replace(/[^a-z0-9-]/g, "")}.work` : "yoursite.work";
  const domain = wizard.domain || suggestedDomain;

  const triggerDownload = async (sendEmail: boolean) => {
    setErr(null);
    setBusy(true);
    try {
      const state = { ...getWizardState(wizard), domain };
      const parsed = WizardStateSchema.safeParse(state);
      if (!parsed.success) {
        const flat = parsed.error.flatten().fieldErrors;
        const messages = Object.entries(flat)
          .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
          .join("; ");
        throw new Error(messages || "Invalid wizard state");
      }
      if (sendEmail && wizard.email) {
        await fetch(`/api/forge/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: wizard.email }),
        });
      }
      const res = await fetch(`/api/forge/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(wizard.name || "your").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-portfolio.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      navigate("/success");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 6</p>
        <h2 className="text-3xl mb-2">Generate your portfolio.</h2>
        <p className="text-mute text-sm">
          One click. Real Astro 6 project. Yours forever.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Custom domain (optional)</span>
        <input
          type="text"
          value={wizard.domain || ""}
          onChange={(e) => patch({ domain: e.target.value })}
          placeholder={suggestedDomain}
          maxLength={80}
          data-testid="input-domain"
        />
        <span className="text-xs text-mute mt-1 block">
          We'll prefill DEPLOY.md with this. You can deploy to a .workers.dev URL first.
        </span>
      </label>

      <div className="card p-5 space-y-3">
        <p className="font-medium text-sm">Email yourself the export?</p>
        <p className="text-xs text-mute">
          We'll send the zip plus a 5-minute Cloudflare deploy guide. We don't sell email addresses, ever. Skip if you'd rather just download.
        </p>
        <input
          type="email"
          value={wizard.email ?? ""}
          onChange={(e) => patch({ email: e.target.value })}
          placeholder="you@example.com"
          data-testid="input-email"
        />
      </div>

      {err && (
        <div
          className="text-sm p-3 rounded"
          style={{ background: "color-mix(in oklch, var(--color-danger) 15%, transparent)", color: "var(--color-danger)" }}
          data-testid="text-error"
        >
          {err}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => triggerDownload(false)}
          disabled={busy}
          className="btn btn-primary flex-1 text-base py-3"
          data-testid="button-download"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {busy ? "Generating..." : "Just download"}
        </button>
        {wizard.email && (
          <button
            type="button"
            onClick={() => triggerDownload(true)}
            disabled={busy}
            className="btn btn-ghost flex-1 text-base py-3"
            data-testid="button-email-download"
          >
            <Mail className="w-4 h-4" />
            Email + Download
          </button>
        )}
      </div>
    </div>
  );
}
