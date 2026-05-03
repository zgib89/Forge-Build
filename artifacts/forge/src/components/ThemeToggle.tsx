import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`btn btn-ghost ${className ?? ""}`}
      style={{
        width: 38,
        height: 38,
        padding: 0,
        borderRadius: 999,
        position: "relative",
      }}
      data-testid="theme-toggle"
    >
      <span
        aria-hidden="true"
        style={{
          display: "inline-flex",
          width: 16,
          height: 16,
          alignItems: "center",
          justifyContent: "center",
          transform: isDark ? "rotate(0deg)" : "rotate(-30deg)",
          transition: "transform 300ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </span>
    </button>
  );
}
