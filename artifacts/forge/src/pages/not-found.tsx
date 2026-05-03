import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <div className="aurora-bg" aria-hidden="true" />
      <p className="eyebrow mb-4">Error 404</p>
      <h1
        className="font-display"
        style={{
          fontSize: "clamp(5rem, 22vw, 14rem)",
          lineHeight: 0.9,
          letterSpacing: "-0.05em",
          background: "linear-gradient(180deg, var(--color-text) 0%, color-mix(in oklch, var(--color-text) 50%, transparent) 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Off the path.
      </h1>
      <p className="text-mute mt-4 max-w-md text-lg">
        This page isn't in the build. But the Forge is, and it's right here.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/" className="btn btn-primary">
          Back to Forge <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/forge" className="btn btn-outline">
          Open the wizard
        </Link>
      </div>
      <p className="mt-12 text-xs text-mute font-mono">
        Press <kbd className="cmdk-kbd">⌘</kbd><kbd className="cmdk-kbd">K</kbd> for commands.
      </p>
    </div>
  );
}
