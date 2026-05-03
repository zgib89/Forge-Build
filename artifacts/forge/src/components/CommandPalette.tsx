import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  Search,
  Home,
  ArrowRight,
  Moon,
  Sparkles,
  Trash2,
  UserRound,
  Layers,
  Palette,
  ListChecks,
  FolderGit2,
  PackageCheck,
  ExternalLink,
} from "lucide-react";
import { useWizard } from "../lib/store";
import { useTheme } from "../hooks/useTheme";
import { toast } from "../lib/toast";

interface Command {
  id: string;
  group: string;
  title: string;
  hint?: string;
  icon: typeof Home;
  run: () => void;
  keywords?: string;
}

const STEP_META = [
  { idx: 0, label: "Identity", icon: UserRound },
  { idx: 1, label: "Preset", icon: Layers },
  { idx: 2, label: "Palette", icon: Palette },
  { idx: 3, label: "Sections", icon: ListChecks },
  { idx: 4, label: "Projects", icon: FolderGit2 },
  { idx: 5, label: "Export", icon: PackageCheck },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [, navigate] = useLocation();
  const setStep = useWizard((s) => s.setStep);
  const stepNow = useWizard((s) => s.step);
  const reset = useWizard((s) => s.reset);
  const addExampleProjects = useWizard((s) => s.addExampleProjects);
  const { toggle: toggleTheme, theme } = useTheme();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const commands: Command[] = useMemo(
    () => [
      ...STEP_META.map((s) => ({
        id: `step-${s.idx}`,
        group: "Jump to step",
        title: `Step ${s.idx + 1} · ${s.label}`,
        hint: stepNow === s.idx ? "current" : undefined,
        icon: s.icon,
        keywords: `step ${s.idx + 1} ${s.label.toLowerCase()}`,
        run: () => {
          setStep(s.idx);
          navigate("/forge");
        },
      })),
      {
        id: "go-home",
        group: "Navigate",
        title: "Go to landing page",
        icon: Home,
        keywords: "home landing main",
        run: () => navigate("/"),
      },
      {
        id: "go-forge",
        group: "Navigate",
        title: "Open the wizard",
        icon: ArrowRight,
        keywords: "wizard build start",
        run: () => navigate("/forge"),
      },
      {
        id: "fill-examples",
        group: "Actions",
        title: "Fill projects with examples",
        icon: Sparkles,
        keywords: "examples sample seed projects",
        run: () => {
          addExampleProjects();
          toast.success("Filled with examples", "Three sample projects added.");
          navigate("/forge");
          setStep(4);
        },
      },
      {
        id: "toggle-theme",
        group: "Actions",
        title: `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
        icon: Moon,
        keywords: "theme dark light mode",
        run: () => {
          toggleTheme();
          toast.info(`Theme: ${theme === "dark" ? "light" : "dark"}`);
        },
      },
      {
        id: "reset",
        group: "Actions",
        title: "Reset wizard (clear all data)",
        icon: Trash2,
        keywords: "reset clear delete restart",
        run: () => {
          if (window.confirm("Reset the wizard? Your in-progress data will be cleared.")) {
            reset();
            navigate("/forge");
            toast.info("Wizard reset");
          }
        },
      },
      {
        id: "external-zac",
        group: "External",
        title: "zacgibson.work",
        icon: ExternalLink,
        keywords: "author zac",
        run: () => window.open("https://zacgibson.work", "_blank"),
      },
      {
        id: "external-jotter",
        group: "External",
        title: "JotterDown",
        icon: ExternalLink,
        keywords: "jotter notes",
        run: () => window.open("https://jotterdown.com", "_blank"),
      },
    ],
    [stepNow, theme, setStep, navigate, reset, addExampleProjects, toggleTheme],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        (c.keywords ?? "").toLowerCase().includes(q),
    );
  }, [commands, query]);

  useEffect(() => setActiveIdx(0), [query]);

  function runActive() {
    const cmd = filtered[activeIdx];
    if (cmd) {
      setOpen(false);
      cmd.run();
    }
  }

  if (!open) return null;

  // Group output preserving order
  const groups: { name: string; items: Command[] }[] = [];
  for (const c of filtered) {
    const last = groups[groups.length - 1];
    if (last && last.name === c.group) last.items.push(c);
    else groups.push({ name: c.group, items: [c] });
  }

  let runningIdx = -1;

  return (
    <div
      className="cmdk-backdrop"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      data-testid="command-palette"
    >
      <div className="cmdk-shell" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input-row">
          <Search className="w-4 h-4 text-mute" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIdx((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                runActive();
              }
            }}
            className="cmdk-input"
            data-testid="command-input"
          />
          <kbd className="cmdk-kbd">esc</kbd>
        </div>
        <div className="cmdk-list" role="listbox">
          {filtered.length === 0 && (
            <div className="cmdk-empty">No matching commands.</div>
          )}
          {groups.map((g) => (
            <div key={g.name}>
              <div className="cmdk-group-label">{g.name}</div>
              {g.items.map((c) => {
                runningIdx += 1;
                const isActive = runningIdx === activeIdx;
                return (
                  <button
                    type="button"
                    key={c.id}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIdx(runningIdx)}
                    onClick={() => {
                      setOpen(false);
                      c.run();
                    }}
                    className="cmdk-item"
                    style={{
                      background: isActive ? "color-mix(in oklch, var(--color-accent) 14%, transparent)" : "transparent",
                    }}
                    data-testid={`command-${c.id}`}
                  >
                    <c.icon className="w-4 h-4 shrink-0" style={{ color: isActive ? "var(--color-accent)" : "var(--color-text-mute)" }} />
                    <span className="flex-1 text-left text-sm">{c.title}</span>
                    {c.hint && <span className="text-xs text-mute font-mono">{c.hint}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="cmdk-footer">
          <span><kbd className="cmdk-kbd">↑</kbd><kbd className="cmdk-kbd">↓</kbd> navigate</span>
          <span><kbd className="cmdk-kbd">↵</kbd> select</span>
          <span className="ml-auto"><kbd className="cmdk-kbd">⌘</kbd><kbd className="cmdk-kbd">K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}
