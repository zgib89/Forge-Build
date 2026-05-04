import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Download,
  Mail,
  Loader2,
  CheckCircle2,
  Search,
  XCircle,
  AlertCircle,
  Rocket,
  ExternalLink,
  ShoppingCart,
} from "lucide-react";
import { useWizard, getWizardState } from "../../lib/store";
import { WizardStateSchema } from "../../lib/schemas";
import { apiUrl } from "../../lib/api";
import { PRESETS } from "../../lib/presets";
import { FONT_PAIRS, RADIUS_SCALES } from "../../lib/typography";
import { toast } from "../../lib/toast";

const DEPLOY_STAGES = [
  { id: "validate", label: "Validating config" },
  { id: "render", label: "Rendering routes" },
  { id: "upload", label: "Uploading to Cloudflare" },
  { id: "live", label: "Going live" },
] as const;
type DeployStageId = (typeof DEPLOY_STAGES)[number]["id"];

interface RegistrarOption {
  id: string;
  name: string;
  url: string;
  note: string;
}

type DomainCheck =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available"; domain: string; registrars: RegistrarOption[] }
  | { status: "taken"; domain: string }
  | { status: "unknown"; domain: string; reason: string }
  | { status: "invalid"; reason: string };

function makeDeploySlug(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 10);
}

export default function StepExport() {
  const wizard = useWizard();
  const patch = useWizard((s) => s.patch);
  const [, navigate] = useLocation();
  const [busy, setBusy] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [deployErr, setDeployErr] = useState<string | null>(null);
  const [domainCheck, setDomainCheck] = useState<DomainCheck>({ status: "idle" });
  const [cfConfigured, setCfConfigured] = useState<boolean | null>(null);
  const [deployStage, setDeployStage] = useState<DeployStageId | null>(null);

  const firstName = wizard.name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const suggestedDomain = firstName ? `${firstName.replace(/[^a-z0-9-]/g, "")}.work` : "yoursite.work";
  const domain = wizard.domain || suggestedDomain;

  const presetName = PRESETS.find((p) => p.id === wizard.preset)?.name ?? wizard.preset;
  const fontName = FONT_PAIRS.find((f) => f.id === wizard.fontPair)?.name ?? wizard.fontPair;
  const radiusName = RADIUS_SCALES.find((r) => r.id === wizard.radiusScale)?.name ?? wizard.radiusScale;
  const exportProjects = wizard.projects.filter((p) => !p.draft);
  const enabledSections =
    1 + (Object.values(wizard.sections).filter(Boolean).length);

  const summary: { label: string; value: string }[] = [
    { label: "Identity", value: `${wizard.name || "—"} · ${wizard.role || "—"}` },
    { label: "Preset", value: presetName },
    { label: "Palette", value: `${wizard.paletteName} · ${wizard.darkMode ? "Dark" : "Light"}` },
    { label: "Type / corners", value: `${fontName} · ${radiusName}` },
    { label: "Pages", value: `${enabledSections} ${enabledSections === 1 ? "page" : "pages"}` },
    { label: "Projects", value: `${exportProjects.length} of 8` },
  ];

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl("/api/forge/deploy/cloudflare/status"))
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled) setCfConfigured(!!j.configured);
      })
      .catch(() => {
        if (!cancelled) setCfConfigured(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const checkDomain = async () => {
    const target = (wizard.domain || suggestedDomain).trim();
    if (!target) return;
    setDomainCheck({ status: "checking" });
    try {
      const res = await fetch(apiUrl("/api/forge/domain/check"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: target }),
      });
      const j = await res.json();
      if (!j.ok) {
        setDomainCheck({ status: "invalid", reason: j.error || "Lookup failed" });
        return;
      }
      if (j.valid === false) {
        setDomainCheck({ status: "invalid", reason: j.reason || "Invalid domain" });
        return;
      }
      if (j.available === true) {
        setDomainCheck({
          status: "available",
          domain: j.domain,
          registrars: Array.isArray(j.registrars) ? j.registrars : [],
        });
      } else if (j.available === false) {
        setDomainCheck({ status: "taken", domain: j.domain });
      } else {
        setDomainCheck({ status: "unknown", domain: j.domain, reason: j.reason || "Couldn't determine availability." });
      }
    } catch (e) {
      setDomainCheck({
        status: "invalid",
        reason: e instanceof Error ? e.message : "Lookup failed",
      });
    }
  };

  const buildAndValidateState = () => {
    const state = { ...getWizardState(wizard), domain, projects: exportProjects };
    const parsed = WizardStateSchema.safeParse(state);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const messages = Object.entries(flat)
        .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
        .join("; ");
      throw new Error(messages || "Invalid wizard state");
    }
    return parsed.data;
  };

  const triggerDownload = async (sendEmail: boolean) => {
    setErr(null);
    setBusy(true);
    try {
      const data = buildAndValidateState();
      if (sendEmail && wizard.email) {
        await fetch(apiUrl(`/api/forge/email`), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: wizard.email, state: data }),
        });
      }
      const res = await fetch(apiUrl(`/api/forge/export`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  const triggerDeploy = async () => {
    setDeployErr(null);
    setDeploying(true);
    setDeployStage("validate");
    try {
      const data = buildAndValidateState();
      const slug = wizard.deploySlug && /^[a-z0-9]{6,16}$/.test(wizard.deploySlug)
        ? wizard.deploySlug
        : makeDeploySlug();
      if (slug !== wizard.deploySlug) patch({ deploySlug: slug });
      // Visual progression — stages 1 & 2 are local, stage 3 covers the network round-trip,
      // stage 4 fires once Cloudflare returns.
      await new Promise((r) => setTimeout(r, 300));
      setDeployStage("render");
      await new Promise((r) => setTimeout(r, 350));
      setDeployStage("upload");
      const res = await fetch(apiUrl(`/api/forge/deploy/cloudflare`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, deploySlug: slug }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        throw new Error(j.error || `Deploy failed (${res.status})`);
      }
      setDeployStage("live");
      patch({ deployedUrl: j.url });
      toast.success("Live on Cloudflare", j.url.replace(/^https?:\/\//, ""));
      // Tiny pause so users see the final checkmark before nav.
      await new Promise((r) => setTimeout(r, 450));
      navigate("/success");
    } catch (e) {
      setDeployErr(e instanceof Error ? e.message : "Deploy failed");
      toast.error("Deploy failed", e instanceof Error ? e.message : undefined);
    } finally {
      setDeploying(false);
      setDeployStage(null);
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

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          <p className="font-medium text-sm m-0">Your build summary</p>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {summary.map((row) => (
            <div key={row.label} className="flex justify-between gap-3 border-b border-app py-1.5 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
              <dt className="text-mute font-mono text-xs uppercase tracking-wider">{row.label}</dt>
              <dd className="text-right font-medium truncate" style={{ color: "var(--color-text)" }}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-2">
        <label className="block">
          <span className="text-sm font-medium mb-1.5 block">Custom domain (optional)</span>
          <div className="flex gap-2">
            <input
              type="text"
              value={wizard.domain || ""}
              onChange={(e) => {
                patch({ domain: e.target.value });
                if (domainCheck.status !== "idle") setDomainCheck({ status: "idle" });
              }}
              placeholder={suggestedDomain}
              maxLength={80}
              data-testid="input-domain"
              className="flex-1"
            />
            <button
              type="button"
              onClick={checkDomain}
              disabled={domainCheck.status === "checking" || !(wizard.domain || suggestedDomain).trim()}
              className="btn btn-ghost text-sm whitespace-nowrap"
              data-testid="button-check-domain"
            >
              {domainCheck.status === "checking" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              Check
            </button>
          </div>
        </label>

        {domainCheck.status === "available" && (
          <div
            className="p-3 rounded space-y-3"
            style={{ background: "color-mix(in oklch, var(--color-accent) 10%, transparent)" }}
            data-testid="text-domain-available"
          >
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-accent)" }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                <code className="font-mono">{domainCheck.domain}</code> is available. Register it now:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {domainCheck.registrars.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost text-xs justify-start text-left"
                  data-testid={`link-registrar-${r.id}`}
                  title={r.note}
                >
                  <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{r.name}</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-60 shrink-0" />
                </a>
              ))}
            </div>
            <p className="text-xs text-mute m-0">
              After purchase, add your domain in the Cloudflare Pages dashboard for your deployment — DNS steps are in <code className="font-mono">DEPLOY.md</code>.
            </p>
          </div>
        )}
        {domainCheck.status === "taken" && (
          <div
            className="text-xs flex items-center gap-2 p-2 rounded"
            style={{ background: "color-mix(in oklch, var(--color-danger) 12%, transparent)", color: "var(--color-danger)" }}
            data-testid="text-domain-taken"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>
              <code className="font-mono">{domainCheck.domain}</code> is already registered. Try a different name.
            </span>
          </div>
        )}
        {domainCheck.status === "unknown" && (
          <div className="text-xs flex items-center gap-2 p-2 rounded text-mute" data-testid="text-domain-unknown">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{domainCheck.reason}</span>
          </div>
        )}
        {domainCheck.status === "invalid" && (
          <div className="text-xs flex items-center gap-2 p-2 rounded text-mute" data-testid="text-domain-invalid">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{domainCheck.reason}</span>
          </div>
        )}
        {domainCheck.status === "idle" && (
          <span className="text-xs text-mute block">
            We'll prefill <code className="font-mono">DEPLOY.md</code> with this. You can deploy to a free <code className="font-mono">.pages.dev</code> URL first.
          </span>
        )}
      </div>

      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          <p className="font-medium text-sm m-0">Deploy to Cloudflare in one click</p>
        </div>
        <p className="text-xs text-mute">
          Pushes a live, hosted version of your portfolio to Cloudflare Pages. You get a free{" "}
          <code className="font-mono">*.pages.dev</code> URL immediately — no wrangler login, no zip
          to unpack.
        </p>
        {cfConfigured === false && (
          <div className="text-xs text-mute flex items-center gap-2" data-testid="text-deploy-unconfigured">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              One-click deploy isn't enabled on this server. Use the download below — full
              instructions are in <code className="font-mono">DEPLOY.md</code>.
            </span>
          </div>
        )}
        {deployErr && (
          <div
            className="text-xs p-2 rounded"
            style={{ background: "color-mix(in oklch, var(--color-danger) 15%, transparent)", color: "var(--color-danger)" }}
            data-testid="text-deploy-error"
          >
            {deployErr}
          </div>
        )}
        {wizard.deployedUrl && !deploying && (
          <div className="text-xs flex items-center gap-2" data-testid="text-deploy-success">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
            <span>
              Live at{" "}
              <a
                href={wizard.deployedUrl}
                target="_blank"
                rel="noreferrer"
                className="underline font-mono"
              >
                {wizard.deployedUrl.replace(/^https?:\/\//, "")}
              </a>
            </span>
          </div>
        )}
        {deploying && deployStage && (
          <ol
            className="space-y-2 text-xs"
            data-testid="deploy-progress"
            aria-live="polite"
          >
            {DEPLOY_STAGES.map((stage, i) => {
              const currentIdx = DEPLOY_STAGES.findIndex((s) => s.id === deployStage);
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <li
                  key={stage.id}
                  className="flex items-center gap-2.5"
                  style={{
                    color: done ? "var(--color-accent)" : active ? "var(--color-text)" : "var(--color-text-mute)",
                    opacity: done || active ? 1 : 0.55,
                    transition: "opacity 200ms, color 200ms",
                  }}
                  data-testid={`deploy-stage-${stage.id}`}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      display: "inline-grid",
                      placeItems: "center",
                      background: done
                        ? "var(--color-accent)"
                        : active
                          ? "color-mix(in oklch, var(--color-accent) 20%, transparent)"
                          : "var(--color-surface-2, var(--color-surface))",
                      border: `1px solid ${done || active ? "var(--color-accent)" : "var(--color-border)"}`,
                      flexShrink: 0,
                    }}
                  >
                    {done ? (
                      <CheckCircle2 className="w-3 h-3" style={{ color: "var(--color-bg)" }} />
                    ) : active ? (
                      <Loader2 className="w-3 h-3 animate-spin" style={{ color: "var(--color-accent)" }} />
                    ) : (
                      <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--color-border)" }} />
                    )}
                  </span>
                  <span>{stage.label}</span>
                </li>
              );
            })}
          </ol>
        )}
        <button
          type="button"
          onClick={triggerDeploy}
          disabled={deploying || busy || cfConfigured === false}
          className="btn btn-primary w-full text-base py-3"
          data-testid="button-deploy-cloudflare"
          title={cfConfigured === false ? "Server isn't configured for one-click deploy" : undefined}
        >
          {deploying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Rocket className="w-4 h-4" />
          )}
          {deploying ? "Deploying to Cloudflare..." : "Deploy to Cloudflare"}
        </button>
      </div>

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
          disabled={busy || deploying}
          className="btn btn-ghost flex-1 text-base py-3"
          data-testid="button-download"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {busy ? "Generating..." : "Just download the zip"}
        </button>
        <button
          type="button"
          onClick={() => triggerDownload(true)}
          disabled={busy || deploying || !wizard.email}
          className="btn btn-ghost flex-1 text-base py-3"
          data-testid="button-email-download"
          title={!wizard.email ? "Enter an email above to enable" : undefined}
        >
          <Mail className="w-4 h-4" />
          Email + Download
        </button>
        {wizard.deployedUrl && (
          <a
            href={wizard.deployedUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost flex-1 text-base py-3"
            data-testid="link-open-deployed"
          >
            <ExternalLink className="w-4 h-4" />
            Open live site
          </a>
        )}
      </div>
    </div>
  );
}
