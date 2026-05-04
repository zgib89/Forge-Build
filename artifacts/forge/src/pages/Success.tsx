import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Copy, Check, FileText, Layers, FolderGit2, Globe, ExternalLink, Rocket, Server, ChevronDown, MousePointerClick, Github, Terminal } from "lucide-react";
import { useWizard } from "../lib/store";
import { PRESETS } from "../lib/presets";
import ThemeToggle from "../components/ThemeToggle";

function CodeBox({ code, testId }: { code: string; testId: string }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
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
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopyError(false);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          } catch {
            setCopied(false);
            setCopyError(true);
            setTimeout(() => setCopyError(false), 1800);
          }
        }}
        className="absolute top-2 right-2 btn btn-ghost text-xs px-2 py-1"
        aria-label={`Copy command: ${testId.replace(/^code-/, "")}`}
        title="Copy command"
        data-testid={testId}
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      </button>
      {copyError && (
        <span
          className="absolute right-2 bottom-2 text-[10px] font-mono"
          style={{ color: "var(--color-bg)" }}
          role="status"
        >
          copy blocked
        </span>
      )}
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

function DeployGuide({ slug }: { slug: string }) {
  const [path, setPath] = useState<"github" | "cli">("github");
  return (
    <div className="space-y-5">
      <div className="card p-5">
        <p className="font-medium text-sm mb-1">Get your portfolio online — pick a path</p>
        <p className="text-xs text-mute m-0">
          Both paths are free. Both end with a real URL (like <code className="font-mono">your-name.pages.dev</code>) you can share.
        </p>
        <div className="flex gap-2 mt-4" role="tablist" aria-label="Deployment path">
          <button
            type="button"
            role="tab"
            aria-selected={path === "github"}
            aria-controls="deploy-path-github"
            onClick={() => setPath("github")}
            className="btn text-sm flex-1"
            style={{
              background: path === "github" ? "var(--color-text)" : "transparent",
              color: path === "github" ? "var(--color-bg)" : "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
            data-testid="tab-path-github"
          >
            <MousePointerClick className="w-4 h-4" />
            <span className="ml-1.5">No coding (GitHub + Cloudflare)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={path === "cli"}
            aria-controls="deploy-path-cli"
            onClick={() => setPath("cli")}
            className="btn text-sm flex-1"
            style={{
              background: path === "cli" ? "var(--color-text)" : "transparent",
              color: path === "cli" ? "var(--color-bg)" : "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
            data-testid="tab-path-cli"
          >
            <Terminal className="w-4 h-4" />
            <span className="ml-1.5">Command line (faster if you've done it before)</span>
          </button>
        </div>
      </div>

      {path === "github" && (
        <div className="space-y-4" id="deploy-path-github" role="tabpanel" data-testid="deploy-path-github">
          <DeployStep n="01" title="Unzip the file you just downloaded">
            <p className="text-sm text-mute m-0">
              Find <code className="font-mono">{slug}-portfolio.zip</code> in your Downloads folder.
              Double-click it (Mac) or right-click → "Extract All" (Windows).
            </p>
            <p className="text-sm text-mute mt-2 m-0">
              You'll get a folder called <code className="font-mono">{slug}-portfolio</code>.
            </p>
          </DeployStep>

          <DeployStep n="02" title="Make a free GitHub account (skip if you have one)">
            <p className="text-sm text-mute m-0">
              GitHub is where your portfolio's code will live.{" "}
              <a
                href="https://github.com/signup"
                target="_blank"
                rel="noreferrer"
                className="underline"
                style={{ color: "var(--color-accent)" }}
              >
                Sign up here →
              </a>
            </p>
          </DeployStep>

          <DeployStep n="03" title="Upload your folder to GitHub">
            <p className="text-sm text-mute m-0 mb-3">
              Easiest way: download <strong>GitHub Desktop</strong> (free, no command line needed).
            </p>
            <ol className="text-sm text-mute space-y-1.5 m-0 pl-5 list-decimal">
              <li>
                Get GitHub Desktop:{" "}
                <a
                  href="https://desktop.github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  desktop.github.com
                </a>
              </li>
              <li>Open it and sign in with your GitHub account.</li>
              <li>
                File → <strong>Add Local Repository</strong> → pick the <code className="font-mono">{slug}-portfolio</code> folder.
              </li>
              <li>It'll say "this isn't a Git repo, want to create one?" → Yes.</li>
              <li>Type a commit message (e.g. "first commit") → click <strong>Commit to main</strong>.</li>
              <li>
                Click <strong>Publish repository</strong> (top right). Uncheck "Keep this code private" if you want others to see it. Click Publish.
              </li>
            </ol>
          </DeployStep>

          <DeployStep n="04" title="Make a free Cloudflare account">
            <p className="text-sm text-mute m-0">
              Cloudflare hosts your portfolio for free.{" "}
              <a
                href="https://dash.cloudflare.com/sign-up"
                target="_blank"
                rel="noreferrer"
                className="underline"
                style={{ color: "var(--color-accent)" }}
              >
                Sign up here →
              </a>
            </p>
          </DeployStep>

          <DeployStep n="05" title="Connect your repo to Cloudflare Pages">
            <p className="text-sm text-mute m-0 mb-3">
              Once signed in:
            </p>
            <ol className="text-sm text-mute space-y-1.5 m-0 pl-5 list-decimal">
              <li>Left sidebar → <strong>Workers &amp; Pages</strong>.</li>
              <li>
                Click <strong>Create</strong> → <strong>Pages</strong> tab → <strong>Connect to Git</strong>.
              </li>
              <li>Authorize Cloudflare to read GitHub. Pick the repo you just published.</li>
              <li>
                Build settings: pick the <strong>Astro</strong> framework preset. Build command:{" "}
                <code className="font-mono">npm run build</code>. Output:{" "}
                <code className="font-mono">dist</code>.
              </li>
              <li>
                Click <strong>Save and Deploy</strong>. Wait ~2 minutes. You're live.
              </li>
            </ol>
            <p className="text-sm mt-3 m-0" style={{ color: "var(--color-accent)" }}>
              You'll get a URL like <code className="font-mono">your-portfolio.pages.dev</code>. Share it.
            </p>
          </DeployStep>

          <div className="card p-4 text-xs text-mute">
            Want to use your own domain (like <code className="font-mono">yourname.com</code>)? In the Cloudflare Pages
            dashboard for your project → <strong>Custom domains</strong> → <strong>Set up a custom domain</strong>. Cloudflare walks you through it.
          </div>
        </div>
      )}

      {path === "cli" && (
        <div className="space-y-4" id="deploy-path-cli" role="tabpanel" data-testid="deploy-path-cli">
          <p className="text-xs text-mute">
            Requires Node.js 22+ and a Cloudflare account.
          </p>
          <DeployStep n="01" title="Unzip & install">
            <CodeBox
              code={`cd ~/Downloads && unzip ${slug}-portfolio.zip && cd ${slug}-portfolio && pnpm install`}
              testId="code-install"
            />
          </DeployStep>
          <DeployStep n="02" title="Run locally to preview">
            <CodeBox code="pnpm dev" testId="code-dev" />
            <p className="text-sm text-mute mt-3 m-0">Visit <code className="font-mono">http://localhost:4321</code>.</p>
          </DeployStep>
          <DeployStep n="03" title="Deploy to Cloudflare">
            <CodeBox
              code={`pnpm dlx wrangler login\npnpm build\npnpm wrangler deploy`}
              testId="code-deploy"
            />
            <p className="text-sm text-mute mt-3 m-0">
              Full walkthrough including custom domains lives in{" "}
              <code className="font-mono">DEPLOY.md</code> inside your zip.
            </p>
          </DeployStep>
        </div>
      )}
    </div>
  );
}

function DeployStep({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-mono text-xs text-mute">{n}</span>
        <h3 className="text-base m-0 font-medium">{title}</h3>
      </div>
      {children}
    </div>
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

        {!deployedUrl && <DeployGuide slug={slug} />}

        {domain && !domain.endsWith(".pages.dev") && (
          <div className="card p-6 mt-8" data-testid="card-dns-guidance">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
              <h2 className="text-xl m-0">Point <span className="font-mono">{domain}</span> at your site</h2>
            </div>
            <p className="text-sm text-mute mb-5 m-0">
              After your registrar finishes propagating, add these two records in your DNS provider
              (or, easier: transfer DNS to Cloudflare and they'll do it automatically when you add the
              custom domain in the Pages dashboard).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr className="text-left text-xs text-mute font-mono uppercase tracking-wider">
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Value</th>
                    <th className="py-2">TTL</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-t border-app">
                    <td className="py-2 pr-4">CNAME</td>
                    <td className="py-2 pr-4">@ (or {domain.split(".")[0]})</td>
                    <td className="py-2 pr-4">
                      {deployedUrl ? deployedUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : "your-site.pages.dev"}
                    </td>
                    <td className="py-2">Auto</td>
                  </tr>
                  <tr className="border-t border-app">
                    <td className="py-2 pr-4">CNAME</td>
                    <td className="py-2 pr-4">www</td>
                    <td className="py-2 pr-4">
                      {deployedUrl ? deployedUrl.replace(/^https?:\/\//, "").replace(/\/$/, "") : "your-site.pages.dev"}
                    </td>
                    <td className="py-2">Auto</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-mute mt-4 m-0">
              In Cloudflare Pages → your project → <strong>Custom domains</strong> → <strong>Set up a custom domain</strong>,
              enter <span className="font-mono">{domain}</span>. Cloudflare auto-provisions SSL within ~60 seconds.
            </p>
          </div>
        )}

        <div className="mt-16 text-center text-sm text-mute">
          Tip: <code className="font-mono">README.md</code> in the zip explains every file. Have fun.
        </div>
      </main>
    </>
  );
}
