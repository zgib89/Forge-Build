import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Zap,
  Code,
  Sparkles,
  Gauge,
  UserRound,
  Layers,
  SlidersHorizontal,
  ListChecks,
  FolderGit2,
  PackageCheck,
  Github,
  CloudLightning,
  PaintBucket,
  BookOpen,
} from "lucide-react";
import { PRESETS } from "../lib/presets";
import LivePreview from "../components/LivePreview";
import Marquee from "../components/Marquee";
import Reveal from "../components/Reveal";
import ThemeToggle from "../components/ThemeToggle";

const HEADLINES = [
  "your portfolio.",
  "your reputation.",
  "your leverage.",
  "it once. Ship it forever.",
];

function KineticHeadline() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % HEADLINES.length), 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-block relative align-baseline" style={{ minWidth: "1ch" }}>
      <span
        key={idx}
        className="font-fraunces italic"
        style={{
          background: "linear-gradient(120deg, var(--color-accent) 0%, oklch(0.60 0.22 295) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "kinetic 700ms cubic-bezier(0.16,1,0.3,1)",
          display: "inline-block",
        }}
      >
        {HEADLINES[idx]}
      </span>
    </span>
  );
}

const FEATURES = [
  {
    icon: Zap,
    title: "Real site, not a rented profile",
    desc: "A production Astro 6 portfolio you can download, host, edit, and keep.",
    tone: "tall" as const,
  },
  {
    icon: PaintBucket,
    title: "Seven visual systems",
    desc: "Signal, glass, archive, IAM, recon, quiet studio, and terminal looks.",
  },
  {
    icon: Sparkles,
    title: "Effects with guardrails",
    desc: "Glow, edge light, grain, hover depth, glass blur, and motion controls.",
  },
  {
    icon: Code,
    title: "Any career lane",
    desc: "Software, design, writing, sales, healthcare, trades, education, ops, and more.",
  },
  {
    icon: Gauge,
    title: "Background upload ready",
    desc: "Bring your own image or use Pexels materials, studios, and abstract surfaces.",
  },
  {
    icon: CloudLightning,
    title: "Multiple deploy paths",
    desc: "One-click Cloudflare when enabled, ZIP download always, CLI if you want it.",
    tone: "wide" as const,
  },
];

const STEPS = [
  { icon: UserRound, title: "Identity", desc: "Career lane, name, role, tagline, photo." },
  { icon: Layers, title: "Preset", desc: "Pick the visual identity that fits." },
  { icon: SlidersHorizontal, title: "Customize", desc: "Tune colors, type, effects, backgrounds." },
  { icon: ListChecks, title: "Sections", desc: "Toggle the pages you want." },
  { icon: FolderGit2, title: "Selected work", desc: "Add proof for any profession." },
  { icon: PackageCheck, title: "Export", desc: "Real Astro 6 zip — yours forever." },
];

const STATS = [
  { num: "90s", label: "median time to a real, deployable portfolio" },
  { num: "$0", label: "to host on Cloudflare. Forever." },
  { num: "100", label: "Lighthouse score, every build, every page" },
];

const COMPARE = [
  { name: "Hosted SaaS portfolio sites", price: "$15–$30/mo", lock: "you rent your URL", code: "—" },
  { name: "AI website generators", price: "$20+/mo", lock: "platform-locked HTML", code: "scattered" },
  { name: "Hand-rolling Astro", price: "free", lock: "you own everything", code: "weekend project" },
  { name: "Forge", price: "free", lock: "you own everything", code: "ninety seconds" },
];

const MARQUEE_ITEMS = [
  "Astro 6",
  "Cloudflare Workers",
  "Tailwind v4",
  "OKLCH color",
  "View Transitions",
  "Content Collections",
  "Lighthouse 100",
  "Edge-deployed",
  "MIT licensed",
  "Yours forever",
];

export default function Landing() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Magnetic-ish parallax for hero (subtle, no library)
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--mx", `${x * 6}px`);
      el.style.setProperty("--my", `${y * 6}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <style>{`
        @keyframes kinetic {
          from { opacity: 0; transform: translateY(0.18em) skewX(-2deg); }
          to   { opacity: 1; transform: translateY(0) skewX(0); }
        }
        @keyframes blink { 50% { opacity: 0; } }
        .caret { display: inline-block; width: 0.06em; height: 0.85em; vertical-align: -0.08em; background: currentColor; margin-left: 0.04em; animation: blink 1.1s step-end infinite; }
      `}</style>

      <header
        className="sticky top-0 z-50 transition-all"
        style={{
          background: scrolled ? "color-mix(in oklch, var(--color-bg) 75%, transparent)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid var(--color-border)" : "1px solid transparent",
          transition: "background 250ms, border-color 250ms, backdrop-filter 250ms",
        }}
      >
        <div className="px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              style={{
                width: 28, height: 28, borderRadius: 8,
                background: "linear-gradient(135deg, var(--color-accent) 0%, oklch(0.60 0.22 295) 100%)",
                display: "grid", placeItems: "center", color: "white",
                fontFamily: "var(--font-display)", fontSize: 18, lineHeight: 1,
              }}
            >F</span>
            <span className="font-display text-xl tracking-tight">Forge</span>
          </div>
          <nav className="flex items-center gap-2">
            <a
              href="#how-it-works"
              className="hidden md:inline-block btn btn-ghost text-sm"
              data-testid="nav-how"
            >
              How it works
            </a>
            <a
              href="#presets"
              className="hidden md:inline-block btn btn-ghost text-sm"
              data-testid="nav-presets"
            >
              Presets
            </a>
            <a
              href="#instructions"
              className="hidden md:inline-block btn btn-ghost text-sm"
              data-testid="nav-instructions"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Instructions
            </a>
            <ThemeToggle />
            <Link
              href="/forge"
              className="btn btn-primary text-sm"
              data-testid="nav-open"
            >
              Open the Forge <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section
          ref={heroRef}
          className="relative px-6 max-w-7xl mx-auto pt-12 md:pt-20 pb-12 md:pb-24"
          style={{
            transform: "translate3d(var(--mx,0), var(--my,0), 0)",
            transition: "transform 200ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="hero-mesh" aria-hidden="true" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
            <Reveal y={20}>
              <p className="eyebrow mb-6">A free portfolio generator · v1.0</p>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 0.96,
                }}
              >
                Build <KineticHeadline />
              </h1>
              <p className="mt-7 text-base md:text-lg text-mute max-w-xl leading-relaxed">
                Forge generates a real portfolio for any profession, not just a developer
                profile. Pick a career lane, choose a visual system, tune the details, and
                export a site you own.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/forge"
                  className="btn btn-primary text-base px-6 py-3"
                  data-testid="link-open-forge"
                >
                  Open the Forge <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#presets"
                  className="btn btn-outline text-base px-6 py-3"
                  data-testid="link-see-presets"
                >
                  See it live
                </a>
              </div>
              <div className="mt-8 flex items-center gap-4 text-xs text-mute font-mono">
                <span className="inline-flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--color-success)" }} />
                  No login
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--color-success)" }} />
                  No subscription
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--color-success)" }} />
                  You get the code
                </span>
              </div>
            </Reveal>

            <Reveal delay={120} y={28}>
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-4 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 50% 0%, color-mix(in oklch, var(--color-accent) 25%, transparent) 0%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
                <LivePreview initial="aurora" height={480} />
              </div>
              <p className="mt-3 text-xs text-mute font-mono text-center">
                Live preview · click a tab to switch presets <span className="caret" />
              </p>
            </Reveal>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="border-y border-app py-5 surface-2">
          <Marquee
            items={MARQUEE_ITEMS.map((m, i) => (
              <span key={i}>
                <span style={{ color: "var(--color-accent)" }}>◆</span> {m}
              </span>
            ))}
            speed={30}
          />
        </section>

        {/* STATS */}
        <section className="px-6 max-w-7xl mx-auto py-20 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div>
                  <div className="stat-num mb-2">{s.num}</div>
                  <p className="text-sm text-mute m-0 max-w-xs leading-relaxed">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="px-6 max-w-7xl mx-auto py-20">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <p className="eyebrow mb-3">How it works</p>
              <h2 className="text-4xl md:text-5xl">Six steps. Ninety seconds.</h2>
              <p className="text-mute mt-4 text-base">
                A guided wizard with a live preview that updates as you type. Skip ahead, go
                back, your work is saved automatically.
              </p>
            </div>
          </Reveal>
          <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 60} as="li">
                <div className="bento h-full">
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
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={200}>
            <div id="instructions" className="mt-16 mb-10 max-w-2xl scroll-mt-24">
              <p className="eyebrow mb-3">Instructions</p>
              <h2 className="text-4xl md:text-5xl">Export, publish, or keep building.</h2>
              <p className="text-mute mt-4 text-base">
                The install path is not hidden at the end anymore. Use one-click deploy
                when it is enabled, download the ZIP if you want total ownership, or follow
                the guided no-code route with GitHub Desktop and Cloudflare.
              </p>
            </div>
          </Reveal>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "One-click deploy", desc: "If enabled, Forge publishes straight to Cloudflare and returns a live URL." },
              { title: "Download the ZIP", desc: "You get the full Astro project, content files, styles, and deployment guide." },
              { title: "No-code route", desc: "Use GitHub Desktop to publish the folder without touching a terminal." },
              { title: "Cloudflare route", desc: "Connect the repo or deploy with Wrangler. Free hosting works for most portfolios." },
              { title: "Custom domain", desc: "Start on a free URL, then point your own domain when you are ready." },
            ].map((step, i) => (
              <Reveal key={step.title} delay={i * 60} as="li">
                <div className="bento h-full">
                  <span
                    className="absolute top-3 right-3 font-mono text-[10px] text-mute"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-body font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-body)", letterSpacing: 0 }}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-mute m-0 leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={200}>
            <p className="text-xs text-mute font-mono mt-6 text-center">
              Detailed walkthrough with the exact buttons to click still appears after export.
            </p>
          </Reveal>
        </section>

        {/* PRESETS — live, switchable */}
        <section id="presets" className="px-6 max-w-7xl mx-auto py-20">
          <Reveal>
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="eyebrow mb-3">Three presets, ready to ship</p>
                <h2 className="text-4xl md:text-5xl">Pick a vibe.</h2>
                <p className="text-mute mt-4">
                  Each preset is a starting point. Inside the builder you can go much further:
                  full visual systems, role-aware examples, background images, and effect sliders.
                </p>
              </div>
              <Link
                href="/forge"
                className="btn btn-ghost text-sm self-start md:self-end"
                data-testid="link-customize"
              >
                Customize one <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <LivePreview initial="editorial" height={580} />
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {PRESETS.map((p) => (
                <article
                  key={p.id}
                  className="bento"
                  data-testid={`card-preset-${p.id}`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-xl">{p.name}</h3>
                    <div className="flex gap-1">
                      {p.palettes.slice(0, 4).map((pal) => (
                        <span
                          key={pal.name}
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ background: pal.accent }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm mb-2 leading-relaxed">{p.pitch}</p>
                  <p className="text-xs text-mute font-mono leading-snug">{p.useCase}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        {/* BENTO FEATURES */}
        <section className="px-6 max-w-7xl mx-auto py-20">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <p className="eyebrow mb-3">What's inside</p>
              <h2 className="text-4xl md:text-5xl">Production-quality, every time.</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
            {FEATURES.map((f, i) => {
              const cls =
                f.tone === "tall"
                  ? "md:col-span-1 md:row-span-2"
                  : f.tone === "wide"
                    ? "md:col-span-2"
                    : "";
              return (
                <Reveal key={f.title} delay={i * 50} className={cls}>
                  <div
                    className="bento h-full flex flex-col"
                    onMouseMove={(e) => {
                      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      (e.currentTarget as HTMLElement).style.setProperty("--mx", `${e.clientX - r.left}px`);
                      (e.currentTarget as HTMLElement).style.setProperty("--my", `${e.clientY - r.top}px`);
                    }}
                  >
                    <f.icon className="w-5 h-5 mb-4" style={{ color: "var(--color-accent)" }} />
                    <h3
                      className="font-body font-semibold text-base mb-1.5"
                      style={{ fontFamily: "var(--font-body)", letterSpacing: 0 }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-sm text-mute m-0 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: f.desc }}
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* COMPARE */}
        <section className="px-6 max-w-5xl mx-auto py-20">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow mb-3">Why Forge</p>
              <h2 className="text-4xl md:text-5xl">You shouldn't have to rent your portfolio.</h2>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-mute">Option</th>
                    <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-mute">Cost</th>
                    <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-mute">Ownership</th>
                    <th className="text-left p-4 font-mono text-xs uppercase tracking-wider text-mute">Time to ship</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE.map((row) => {
                    const isMe = row.name === "Forge";
                    return (
                      <tr
                        key={row.name}
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                          background: isMe ? "color-mix(in oklch, var(--color-accent) 8%, transparent)" : "transparent",
                        }}
                      >
                        <td className="p-4">
                          <span className={isMe ? "font-display text-lg" : ""}>{row.name}</span>
                          {isMe && (
                            <span
                              className="ml-2 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded"
                              style={{ background: "var(--color-accent)", color: "white", letterSpacing: "0.08em" }}
                            >
                              You are here
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-mono text-xs">{row.price}</td>
                        <td className="p-4 text-mute">{row.lock}</td>
                        <td className="p-4 font-mono text-xs">{row.code}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 max-w-5xl mx-auto py-24 text-center relative">
          <Reveal>
            <p className="eyebrow mb-4">Ready when you are</p>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1.0,
              }}
            >
              Your code. Your domain. <em className="font-fraunces" style={{ color: "var(--color-accent)" }}>Your call.</em>
            </h2>
            <p className="text-mute mt-5 mb-9 text-lg max-w-xl mx-auto">
              Six steps. Ninety seconds. A real Astro 6 project on disk, ready to deploy.
            </p>
            <Link href="/forge" className="btn btn-primary text-base px-7 py-3.5">
              Open the Forge <ArrowRight className="w-4 h-4" />
            </Link>
          </Reveal>
        </section>

        {/* WORDMARK */}
        <section className="px-6 max-w-7xl mx-auto pt-12 pb-6 overflow-hidden">
          <div className="wordmark text-center" style={{ fontSize: "clamp(5rem, 22vw, 18rem)" }}>
            FORGE
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 max-w-7xl mx-auto pb-12 border-t border-app pt-10 text-sm text-mute">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <p className="font-display text-2xl mb-2" style={{ color: "var(--color-text)" }}>Forge</p>
              <p className="max-w-md">
                A free portfolio builder for people who want ownership, taste, and enough
                customization to stop looking like everyone else.
              </p>
            </div>
            <div>
              <p className="eyebrow mb-3">Best for</p>
              <ul className="space-y-1.5 list-none p-0">
                <li>Career switchers</li>
                <li>Independent pros</li>
                <li>Service businesses</li>
                <li>Creative portfolios</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-3">Built with</p>
              <ul className="space-y-1.5 list-none p-0 font-mono text-xs">
                <li>Astro 6</li>
                <li>Cloudflare Workers</li>
                <li>Tailwind v4</li>
                <li>React</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-app flex flex-col md:flex-row gap-3 items-start md:items-center justify-between text-xs font-mono">
            <p>© {new Date().getFullYear()} Forge. MIT licensed. Built for portable, personal portfolio ownership.</p>
            <div className="flex items-center gap-2">
              <Github className="w-3.5 h-3.5" />
              <span>Open source · yours forever</span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
