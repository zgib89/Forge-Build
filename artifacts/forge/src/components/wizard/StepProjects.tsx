import { Plus, Trash2 } from "lucide-react";
import { useWizard } from "../../lib/store";

export default function StepProjects() {
  const projects = useWizard((s) => s.projects);
  const addProject = useWizard((s) => s.addProject);
  const updateProject = useWizard((s) => s.updateProject);
  const removeProject = useWizard((s) => s.removeProject);

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 5</p>
        <h2 className="text-3xl mb-2">Add your projects.</h2>
        <p className="text-mute text-sm">
          Up to 8. You can also skip and add them in markdown later.
        </p>
      </div>

      {projects.length === 0 && (
        <div className="card p-6 text-center text-sm text-mute">
          No projects yet. Add up to 8, or skip — your zip will include an example you can edit.
        </div>
      )}

      <div className="space-y-4">
        {projects.map((p, i) => (
          <div key={p.id} className="card p-5 space-y-3" data-testid={`project-${i}`}>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs text-mute">Project {String(i + 1).padStart(2, "0")}</span>
              <button
                type="button"
                onClick={() => removeProject(p.id)}
                className="btn btn-ghost text-xs px-2 py-1"
                data-testid={`button-remove-project-${i}`}
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
            <label className="block">
              <span className="text-xs font-medium mb-1 block">Title *</span>
              <input
                type="text"
                value={p.title}
                onChange={(e) => updateProject(p.id, { title: e.target.value })}
                placeholder="JotterDown"
                maxLength={80}
                data-testid={`input-project-title-${i}`}
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium mb-1 block">Summary *</span>
              <textarea
                value={p.summary}
                onChange={(e) => updateProject(p.id, { summary: e.target.value })}
                placeholder="A writing OS for builders."
                maxLength={160}
                rows={2}
                data-testid={`input-project-summary-${i}`}
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium mb-1 block">Stack (comma-separated)</span>
              <input
                type="text"
                value={(p.stack || []).join(", ")}
                onChange={(e) =>
                  updateProject(p.id, {
                    stack: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Astro, TypeScript, Cloudflare"
                data-testid={`input-project-stack-${i}`}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium mb-1 block">Live URL</span>
                <input
                  type="url"
                  value={p.liveUrl ?? ""}
                  onChange={(e) => updateProject(p.id, { liveUrl: e.target.value })}
                  placeholder="https://..."
                  data-testid={`input-project-live-${i}`}
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium mb-1 block">Repo URL</span>
                <input
                  type="url"
                  value={p.repoUrl ?? ""}
                  onChange={(e) => updateProject(p.id, { repoUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  data-testid={`input-project-repo-${i}`}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium mb-1 block">Role</span>
                <input
                  type="text"
                  value={p.role ?? ""}
                  onChange={(e) => updateProject(p.id, { role: e.target.value })}
                  placeholder="Solo build"
                  maxLength={60}
                  data-testid={`input-project-role-${i}`}
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium mb-1 block">Date</span>
                <input
                  type="text"
                  value={p.date ?? ""}
                  onChange={(e) => updateProject(p.id, { date: e.target.value })}
                  placeholder="2026"
                  data-testid={`input-project-date-${i}`}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {projects.length < 8 && (
        <button
          type="button"
          onClick={addProject}
          className="btn btn-ghost w-full"
          data-testid="button-add-project"
        >
          <Plus className="w-4 h-4" /> Add project
        </button>
      )}
    </div>
  );
}
