import { Link } from "wouter";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Zap,
  Palette,
  Code,
  Globe,
  Sparkles,
  Gauge,
  UserRound,
  Layers,
  SlidersHorizontal,
  ListChecks,
  FolderGit2,
  PackageCheck,
} from "lucide-react";
import { PRESETS } from "../lib/presets";

const HEADLINES = [
  "Build your portfolio.",
  "Build your reputation.",
  "Build your leverage.",
  "Build it once, ship it forever.",
];

function KineticHeadline() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % HEADLINES.length), 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <h1
      key={idx}
      className="font-display text-5xl md:text-7xl lg:text-8xl"
      style={{
        animation: "fadeUp 600ms cubic-bezier(0.16,1,0.3,1)",
        viewTransitionName: "headline",
      }}
    >
      {HEADLINES[idx]}
    </h1>
  );
}

const FEATURES = [
  { icon: Zap, title: "Astro 6 + Cloudflare Workers", desc: "Free hosting, edge-fast worldwide. Your bill is zero dollars." },
  { icon: Palette, title: "Tailwind v4 + OKLCH tokens", desc: "Perceptually uniform color, dark mode for free." },
  { icon: Sparkles, title: "Native View Transitions", desc: "No SPA tax — browser-native page transitions." },
  { icon: Code, title: "Content Collections", desc: "Markdown projects with Zod-validated frontmatter." },
  { icon: Globe, title: "Custom domain in 5 minutes", desc: "DEPLOY.md walks you through Cloudflare." },
  { icon: Gauge, title: "Lighthouse 100 by default", desc: "You don't have to earn it; it's how Forge ships." },
];

const STEPS = [
  { icon: UserRound, title: "Identity", desc: "Name, role, tagline, photo." },
  { icon: Layers, title: "Preset", desc: "Pick the visual identity that fits." },
  { icon: SlidersHorizontal, title: "Make it yours", desc: "Tune palette, fonts, and corners." },
  { icon: ListChecks, title: "Sections", desc: "Toggle the pages you want." },
  { icon: FolderGit2, title: "Projects", desc: "Add up to eight, or fill from examples." },
  { icon: PackageCheck, title: "Export", desc: "Download a real Astro 6 zip — yours forever." },
];

export default function Landing() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="aurora-bg" aria-hidden="true" />
      <header className="px-6 py-6 max-w-6xl mx-auto flex items-center justify-between">
        <div className="font-display text-2xl tracking-tight">Forge</div>
        <Link href="/forge" className="btn btn-ghost text-sm">Open the Forge →</Link>
      </header>

      <main>
        <section className="px-6 max-w-5xl mx-auto pt-16 md:pt-24 pb-16 text-center">
          <p className="eyebrow mb-6">A free portfolio generator</p>
          <div className="min-h-[6rem] md:min-h-[10rem] flex items-center justify-center">
            <KineticHeadline />
          </div>
          <p className="mt-8 text-lg md:text-xl text-mute max-w-2xl mx-auto">
            Built by{" "}
            <a
              href="https://zacgibson.work"
              className="underline"
              style={{ color: "var(--color-accent)" }}
              target="_blank"
              rel="noreferrer"
              data-testid="link-zac-hero"
            >
              Zac Gibson
            </a>
            . Astro 6, Cloudflare Workers, deployed in five minutes. Yours forever.
          </p>
          <p className="mt-3 text-sm text-mute font-mono">
            No login. No subscription. No vendor lock-in. You get the code.
          </p>
          <div className="mt-10">
            <Link
              href="/forge"
              className="btn btn-primary text-base px-7 py-3.5"
              data-testid="link-open-forge"
            >
              Open the Forge <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="px-6 max-w-6xl mx-auto py-20">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="text-4xl md:text-5xl">Six steps. Ninety seconds.</h2>
          </div>
          <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="card p-5 relative">
                <span
                  className="absolute top-3 right-3 font-mono text-[10px] text-mute"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <s.icon className="w-4 h-4 mb-3" style={{ color: "var(--color-accent)" }} />
                <h3 className="font-body font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-body)", letterSpacing: 0 }}>
                  {s.title}
                </h3>
                <p className="text-xs text-mute m-0 leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="px-6 max-w-6xl mx-auto py-20">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Three presets, ready to ship</p>
            <h2 className="text-4xl md:text-5xl">Pick a vibe.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESETS.map((p) => (
              <article
                key={p.id}
                className="card p-7 hover:-translate-y-1 transition-transform"
                data-testid={`card-preset-${p.id}`}
              >
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-2xl">{p.name}</h3>
                  <div className="flex gap-1">
                    {p.palettes.slice(0, 4).map((pal) => (
                      <span
                        key={pal.name}
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ background: pal.accent }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm mb-3">{p.pitch}</p>
                <p className="text-xs text-mute font-mono">{p.useCase}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 max-w-6xl mx-auto py-20">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">What's inside</p>
            <h2 className="text-4xl md:text-5xl">Production-quality, every time.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6">
                <f.icon className="w-5 h-5 mb-3" style={{ color: "var(--color-accent)" }} />
                <h3 className="font-body font-semibold text-base mb-1.5" style={{ fontFamily: "var(--font-body)", letterSpacing: 0 }}>
                  {f.title}
                </h3>
                <p className="text-sm text-mute m-0">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 max-w-3xl mx-auto py-20 text-center">
          <h2 className="text-4xl md:text-5xl mb-6">Your code. Your domain. Your call.</h2>
          <p className="text-mute mb-8">
            Six steps. Ninety seconds. A real Astro 6 project on disk, ready to deploy.
          </p>
          <Link href="/forge" className="btn btn-primary text-base px-7 py-3.5">
            Open the Forge <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <footer className="px-6 max-w-6xl mx-auto py-12 border-t border-app text-sm text-mute">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-display text-lg mb-2" style={{ color: "var(--color-text)" }}>Forge</p>
              <p>An IAM engineer in Tennessee shipping the tools he needs.</p>
            </div>
            <div>
              <p className="eyebrow mb-2">Tools</p>
              <p className="space-x-1">
                <a
                  href="https://jotterdown.com"
                  className="hover:text-app"
                  style={{ color: "var(--color-accent)" }}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-jotterdown"
                >
                  JotterDown
                </a>
                <span>·</span>
                <a
                  href="https://righteousrecon.com"
                  className="hover:text-app"
                  style={{ color: "var(--color-accent)" }}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-righteousrecon"
                >
                  RighteousRecon
                </a>
                <span>·</span>
                <a
                  href="https://zacgibson.work"
                  className="hover:text-app"
                  style={{ color: "var(--color-accent)" }}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-zacgibson"
                >
                  zacgibson.work
                </a>
              </p>
            </div>
            <div>
              <p className="eyebrow mb-2">Built with</p>
              <p>Astro 6 · Cloudflare Workers · Tailwind v4 · React</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
