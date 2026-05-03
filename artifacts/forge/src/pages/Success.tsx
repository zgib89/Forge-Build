import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Copy, Check, FileText, Layers, FolderGit2, Globe, ExternalLink, Rocket } from "lucide-react";
import { useWizard } from "../lib/store";
import { PRESETS } from "../lib/presets";
import ThemeToggle from "../components/ThemeToggle";

function CodeBox({ code, testId }: { code: string; testId: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre
        className="font-mono text-xs p-4 rounded-md overflow-x-auto"
        style={{ background: "var(--color-text)", color: "var(--color-bg)" }}
      >
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="absolute top-2 right-2 btn btn-ghost text-xs px-2 py-1"
        data-testid={testId}
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

function Confetti() {
  const [particles] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      angle: Math.random() * Math.PI * 2,
      speed: 100 + Math.random() * 200,
      delay: Math.random() * 200,
      hue: Math.floor(Math.random() * 360),
    })),
  );
  return (
    <>
      <style>{`
        @keyframes burst {
          0% { transform: translate(0,0) rotate(0); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(720deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .confetti-piece { display: none; } }
      `}</style>
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        {particles.map((p) => {
          const dx = Math.cos(p.angle) * p.speed;
          const dy = Math.sin(p.angle) * p.speed - 200;
          return (
            <span
              key={p.id}
              className="confetti-piece absolute w-2 h-2"
              style={{
                left: `${p.x}%`,
                top: "30%",
                background: `oklch(0.7 0.2 ${p.hue})`,
                animation: `burst 1.2s cubic-bezier(0.16,1,0.3,1) ${p.delay}ms forwards`,
                ["--dx" as string]: `${dx}px`,
                ["--dy" as string]: `${dy}px`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}

export default function Success() {
  const name = useWizard((s) => s.name);
  const preset = useWizard((s) => s.preset);
  const projects = useWizard((s) => s.projects);
  const sections = useWizard((s) => s.sections);
  const domain = useWizard((s) => s.domain);
  const deployedUrl = useWizard((s) => s.deployedUrl);
  const reset = useWizard((s) => s.reset);
  const [, navigate] = useLocation();
  const slug =
    (name || "you").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "your";
  const presetName = PRESETS.find((p) => p.id === preset)?.name ?? preset;
  const enabledSections = 1 + Object.values(sections).filter(Boolean).length;

  const inventory = [
    { icon: Layers, label: `${presetName} preset`, sub: "complete visual identity wired up" },
    { icon: FileText, label: `${enabledSections} ${enabledSections === 1 ? "page" : "pages"}`, sub: "Astro routes + layouts" },
    { icon: FolderGit2, label: `${projects.length} ${projects.length === 1 ? "project" : "projects"}`, sub: "Markdown + Zod-validated frontmatter" },
    deployedUrl
      ? { icon: Rocket, label: "Live on Cloudflare Pages", sub: deployedUrl.replace(/^https?:\/\//, "") }
      : { icon: Globe, label: domain || "DEPLOY.md", sub: "Cloudflare-ready, custom domain steps inside" },
  ];

  return (
    <>
      <Confetti />
      <div className="aurora-bg" aria-hidden="true" />
      <header className="px-6 py-6 max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-display text-2xl">Forge</Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => {
              reset();
              navigate("/forge");
            }}
            className="btn btn-ghost text-sm"
            data-testid="button-build-another"
          >
            Build another
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <p className="eyebrow mb-4">Success</p>
        {deployedUrl ? (
          <>
            <h1 className="text-4xl md:text-6xl mb-4">Your portfolio is live.</h1>
            <div className="card p-5 mb-10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="min-w-0">
                <p className="text-xs text-mute m-0 mb-1 font-mono uppercase tracking-wider">Live URL</p>
                <a
                  href={deployedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-base md:text-lg break-all underline"
                  data-testid="link-deployed-url"
                  style={{ color: "var(--color-accent)" }}
                >
                  {deployedUrl}
                </a>
              </div>
              <a
                href={deployedUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary text-sm whitespace-nowrap"
                data-testid="button-open-live"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </a>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl mb-4">Your portfolio is downloaded.</h1>
            <p className="text-mute text-lg mb-10">Here's what's in the zip — and what to do next.</p>
          </>
        )}

        <div className="card p-5 mb-10">
          <p className="font-medium text-sm mb-3">What you got</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 m-0 list-none p-0">
            {inventory.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <item.icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }} />
                <div className="min-w-0">
                  <p className="text-sm font-medium m-0 truncate">{item.label}</p>
                  <p className="text-xs text-mute m-0">{item.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-xs text-mute">01</span>
              <h2 className="text-xl">Unzip & install</h2>
            </div>
            <CodeBox
              code={`cd ~/Downloads && unzip ${slug}-portfolio.zip && cd ${slug}-portfolio && pnpm install`}
              testId="code-install"
            />
          </div>

          <div className="card p-6">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-xs text-mute">02</span>
              <h2 className="text-xl">Run locally</h2>
            </div>
            <CodeBox code="pnpm dev" testId="code-dev" />
            <p className="text-sm text-mute mt-3">Visit <code className="font-mono">http://localhost:4321</code>.</p>
          </div>

          <div className="card p-6">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-mono text-xs text-mute">03</span>
              <h2 className="text-xl">Deploy to Cloudflare</h2>
            </div>
            <CodeBox
              code={`pnpm dlx wrangler login\npnpm build\npnpm wrangler deploy`}
              testId="code-deploy"
            />
            <p className="text-sm text-mute mt-3">
              Full walkthrough — including custom domain setup — lives in{" "}
              <code className="font-mono">DEPLOY.md</code> inside your zip.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center text-sm text-mute">
          Tip: <code className="font-mono">README.md</code> in the zip explains every file. Have fun.
        </div>
      </main>
    </>
  );
}
