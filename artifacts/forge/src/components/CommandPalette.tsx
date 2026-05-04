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
import { useWizard, getWizardState } from "../lib/store";
import { useTheme } from "../hooks/useTheme";
import { toast } from "../lib/toast";
import { confirmDialog } from "../lib/confirm";
import { encodeConfig } from "../lib/shareConfig";
import { Link2, Keyboard } from "lucide-react";

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
  const name = useWizard((s) => s.name);
  const role = useWizard((s) => s.role);
  const { toggle: toggleTheme, theme } = useTheme();
  const identityComplete = name.trim().length >= 2 && role.trim().length >= 1;
  const maxJumpStep = identityComplete ? stepNow : 0;

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
      ...STEP_META.filter((s) => s.idx <= maxJumpStep).map((s) => ({
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
        id: "share-link",
        group: "Actions",
        title: "Copy shareable config link",
        icon: Link2,
        keywords: "share copy url link config",
        run: async () => {
          try {
            const state = getWizardState(useWizard.getState());
            const enc = encodeConfig(state);
            await navigator.clipboard.writeText(enc.url);
            toast.success(
              "Link copied",
              enc.strippedAssets
                ? "Cover images excluded — recipients will see your text config."
                : "Anyone with this link will land on a pre-filled wizard.",
            );
          } catch (e) {
            toast.error("Couldn't copy link", e instanceof Error ? e.message : "clipboard blocked");
          }
        },
      },
      {
        id: "show-shortcuts",
        group: "Actions",
        title: "Show keyboard shortcuts",
        icon: Keyboard,
        keywords: "shortcuts help kbd keyboard",
        run: () => {
          // Defer so palette can fully close before help opens
          setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }));
          }, 50);
        },
      },
      {
        id: "reset",
        group: "Actions",
        title: "Reset wizard (clear all data)",
        icon: Trash2,
        keywords: "reset clear delete restart",
        run: async () => {
          const ok = await confirmDialog({
            title: "Reset the wizard?",
            description: "Your in-progress data will be cleared. This can't be undone.",
            confirmText: "Reset everything",
            danger: true,
          });
          if (ok) {
            reset();
            navigate("/forge");
            toast.info("Wizard reset");
          }
        },
      },
    ],
    [maxJumpStep, stepNow, theme, setStep, navigate, reset, addExampleProjects, toggleTheme],
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
  const activeOptionId = filtered[activeIdx]?.id ? `cmdk-option-${filtered[activeIdx].id}` : undefined;

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
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={activeOptionId}
            aria-autocomplete="list"
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
        <div className="cmdk-list" role="listbox" id="cmdk-list">
          {filtered.length === 0 && (
            <div className="cmdk-empty">No matching commands.</div>
          )}
          {groups.map((g) => (
            <div key={g.name}>
              <div className="cmdk-group-label">{g.name}</div>
              {g.items.map((c) => {
                runningIdx += 1;
                const optionIndex = runningIdx;
                const isActive = optionIndex === activeIdx;
                return (
                  <button
                    type="button"
                    key={c.id}
                    role="option"
                    id={`cmdk-option-${c.id}`}
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIdx(optionIndex)}
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
