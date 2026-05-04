import { Plus, Trash2, ArrowUp, ArrowDown, Sparkles, GripVertical } from "lucide-react";
import { useState } from "react";
import { useWizard } from "../../lib/store";
import { getCareerProfile } from "../../lib/professions";

export default function StepProjects() {
  const projects = useWizard((s) => s.projects);
  const careerCategory = useWizard((s) => s.careerCategory);
  const addProject = useWizard((s) => s.addProject);
  const addExampleProjects = useWizard((s) => s.addExampleProjects);
  const updateProject = useWizard((s) => s.updateProject);
  const removeProject = useWizard((s) => s.removeProject);
  const moveProject = useWizard((s) => s.moveProject);
  const reorderProjects = useWizard((s) => s.reorderProjects);

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const profile = getCareerProfile(careerCategory);
  const firstExample = profile.examples[0];

  const onCover = (id: string, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProject(id, { coverImage: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 5</p>
        <h2 className="text-3xl mb-2">Add your {profile.workLabel.toLowerCase()}.</h2>
        <p className="text-mute text-sm">
          Up to 8. These can be projects, client wins, campaigns, lessons, field jobs,
          credentials, research, or anything that proves the work.
        </p>
      </div>

      {projects.length === 0 && (
        <div className="card p-8 text-center space-y-4">
          <p className="text-sm text-mute m-0">
            No work samples yet. Add up to 8, or add role-aware draft rows and type over them.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={addProject}
              className="btn btn-primary"
              data-testid="button-add-first-project"
            >
              <Plus className="w-4 h-4" /> Add {profile.workItemLabel.toLowerCase()}
            </button>
            <button
              type="button"
              onClick={addExampleProjects}
              className="btn btn-ghost"
              data-testid="button-add-examples"
            >
              <Sparkles className="w-4 h-4" /> Add draft examples
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {projects.map((p, i) => {
          const isDragging = dragIdx === i;
          const isOver = overIdx === i && dragIdx !== null && dragIdx !== i;
          return (
            <div
              key={p.id}
              className="card p-5 space-y-3"
              data-testid={`project-${i}`}
              draggable={false}
              onDragOver={(e) => {
                if (dragIdx === null) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overIdx !== i) setOverIdx(i);
              }}
              onDragLeave={() => {
                if (overIdx === i) setOverIdx(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIdx !== null) reorderProjects(dragIdx, i);
                setDragIdx(null);
                setOverIdx(null);
              }}
              style={{
                opacity: isDragging ? 0.4 : 1,
                borderColor: isOver ? "var(--color-accent)" : undefined,
                boxShadow: isOver ? "0 0 0 3px color-mix(in oklch, var(--color-accent) 25%, transparent)" : undefined,
                transition: "opacity 150ms, box-shadow 150ms, border-color 150ms",
              }}
            >
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Drag to reorder"
                    title="Drag to reorder"
                    draggable
                    onDragStart={(e) => {
                      setDragIdx(i);
                      e.dataTransfer.effectAllowed = "move";
                      try {
                        e.dataTransfer.setData("text/plain", String(i));
                      } catch {}
                    }}
                    onDragEnd={() => {
                      setDragIdx(null);
                      setOverIdx(null);
                    }}
                    className="text-mute"
                    style={{
                      cursor: "grab",
                      padding: "2px 4px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 4,
                    }}
                    data-testid={`drag-handle-${i}`}
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs text-mute">
                    {profile.workItemLabel} {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveProject(p.id, -1)}
                    disabled={i === 0}
                    className="btn btn-ghost text-xs px-2 py-1"
                    data-testid={`button-move-up-${i}`}
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveProject(p.id, 1)}
                    disabled={i === projects.length - 1}
                    className="btn btn-ghost text-xs px-2 py-1"
                    data-testid={`button-move-down-${i}`}
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProject(p.id)}
                    className="btn btn-ghost text-xs px-2 py-1"
                    data-testid={`button-remove-project-${i}`}
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
                <label className="block">
                <span className="text-xs font-medium mb-1 block">
                  Title * {p.draft && <span className="text-mute font-normal">(draft placeholder)</span>}
                </span>
                <input
                  type="text"
                  value={p.title}
                  onFocus={(e) => {
                    if (p.draft) e.currentTarget.select();
                  }}
                  onChange={(e) => updateProject(p.id, { title: e.target.value, draft: false })}
                  placeholder={firstExample.workTitle}
                  maxLength={80}
                  data-testid={`input-project-title-${i}`}
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium mb-1 block">Summary *</span>
                <textarea
                  value={p.summary}
                  onFocus={(e) => {
                    if (p.draft) e.currentTarget.select();
                  }}
                  onChange={(e) => updateProject(p.id, { summary: e.target.value, draft: false })}
                  placeholder={firstExample.workSummary}
                  maxLength={160}
                  rows={2}
                  data-testid={`input-project-summary-${i}`}
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium mb-1 block">{profile.skillLabel} (comma-separated)</span>
                <input
                  type="text"
                  value={(p.stack || []).join(", ")}
                  onFocus={(e) => {
                    if (p.draft) e.currentTarget.select();
                  }}
                  onChange={(e) =>
                    updateProject(p.id, {
                      draft: false,
                      stack: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder={firstExample.skills.join(", ")}
                  data-testid={`input-project-stack-${i}`}
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium mb-1 block">Primary link</span>
                  <input
                    type="url"
                    value={p.liveUrl ?? ""}
                    onFocus={(e) => {
                      if (p.draft) e.currentTarget.select();
                    }}
                    onChange={(e) => updateProject(p.id, { liveUrl: e.target.value, draft: false })}
                    placeholder={firstExample.proofPlaceholder}
                    data-testid={`input-project-live-${i}`}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium mb-1 block">{profile.proofLabel}</span>
                  <input
                    type="url"
                    value={p.repoUrl ?? ""}
                    onFocus={(e) => {
                      if (p.draft) e.currentTarget.select();
                    }}
                    onChange={(e) => updateProject(p.id, { repoUrl: e.target.value, draft: false })}
                    placeholder="https://..."
                    data-testid={`input-project-repo-${i}`}
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium mb-1 block">Contribution</span>
                  <input
                    type="text"
                    value={p.role ?? ""}
                    onFocus={(e) => {
                      if (p.draft) e.currentTarget.select();
                    }}
                    onChange={(e) => updateProject(p.id, { role: e.target.value, draft: false })}
                    placeholder={firstExample.contribution}
                    maxLength={60}
                    data-testid={`input-project-role-${i}`}
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium mb-1 block">Date</span>
                  <input
                    type="text"
                    value={p.date ?? ""}
                    onFocus={(e) => {
                      if (p.draft) e.currentTarget.select();
                    }}
                    onChange={(e) => updateProject(p.id, { date: e.target.value, draft: false })}
                    placeholder="2026"
                    data-testid={`input-project-date-${i}`}
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-medium mb-1 block">Cover image</span>
                <div className="flex items-center gap-3">
                  {p.coverImage ? (
                    <img
                      src={p.coverImage}
                      alt=""
                      className="w-20 h-14 object-cover border border-app rounded"
                    />
                  ) : (
                    <div className="w-20 h-14 surface border border-app rounded flex items-center justify-center text-xs text-mute">
                      none
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onCover(p.id, e.target.files?.[0])}
                    className="text-xs"
                    data-testid={`input-project-cover-${i}`}
                  />
                  {p.coverImage && (
                    <button
                      type="button"
                      onClick={() => updateProject(p.id, { coverImage: undefined })}
                      className="btn btn-ghost text-xs px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {projects.length < 8 && (
        <button
          type="button"
          onClick={addProject}
          className="btn btn-ghost w-full"
          data-testid="button-add-project"
        >
          <Plus className="w-4 h-4" /> Add {profile.workItemLabel.toLowerCase()}
        </button>
      )}
    </div>
  );
}
