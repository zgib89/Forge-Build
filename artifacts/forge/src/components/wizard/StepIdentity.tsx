import { useWizard } from "../../lib/store";
import { CAREER_CATEGORIES, getCareerProfile, type CareerCategory } from "../../lib/professions";

export default function StepIdentity() {
  const name = useWizard((s) => s.name);
  const role = useWizard((s) => s.role);
  const tagline = useWizard((s) => s.tagline);
  const location = useWizard((s) => s.location);
  const careerCategory = useWizard((s) => s.careerCategory);
  const githubUsername = useWizard((s) => s.githubUsername);
  const profilePhoto = useWizard((s) => s.profilePhoto);
  const patch = useWizard((s) => s.patch);
  const profile = getCareerProfile(careerCategory);

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ profilePhoto: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="eyebrow mb-2">Step 1 of 6</p>
        <h2 className="text-3xl mb-2">Who are you building for?</h2>
        <p className="text-mute text-sm">
          Pick a career lane so the examples, labels, and starter copy stop assuming
          everyone is a developer.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Career / audience</span>
        <select
          value={careerCategory ?? "general"}
          onChange={(e) => patch({ careerCategory: e.target.value as CareerCategory })}
          data-testid="select-career-category"
        >
          {CAREER_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-mute mt-1 block">{profile.description}</span>
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Full name *</span>
        <input
          type="text"
          value={name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="Your Name"
          maxLength={60}
          data-testid="input-name"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Role *</span>
        <input
          type="text"
          value={role}
          onChange={(e) => patch({ role: e.target.value })}
          placeholder={profile.rolePlaceholder}
          maxLength={60}
          data-testid="input-role"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Tagline</span>
        <textarea
          value={tagline ?? ""}
          onChange={(e) => patch({ tagline: e.target.value })}
          placeholder={profile.taglinePlaceholder}
          maxLength={120}
          rows={2}
          data-testid="input-tagline"
        />
        <span className="text-xs text-mute mt-1 block">{(tagline ?? "").length}/120</span>
      </label>

      <div
        className="rounded-lg p-3"
        style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)" }}
      >
        <p className="text-xs font-mono uppercase tracking-wider text-mute mb-2">Starter lines</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {profile.examples.map((ex) => (
            <button
              key={ex.role}
              type="button"
              onClick={() => patch({ role: ex.role, tagline: ex.tagline })}
              className="text-left p-3 rounded-md transition-all"
              style={{ border: "1px solid var(--color-border)", background: "transparent" }}
              data-testid={`button-career-example-${ex.role.toLowerCase().replace(/\W+/g, "-")}`}
            >
              <span className="text-sm font-medium block">{ex.role}</span>
              <span className="text-xs text-mute leading-relaxed block mt-1">{ex.tagline}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Location</span>
        <input
          type="text"
          value={location ?? ""}
          onChange={(e) => patch({ location: e.target.value })}
          placeholder="Your city or remote"
          maxLength={60}
          data-testid="input-location"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">GitHub username (optional)</span>
        <input
          type="text"
          value={githubUsername ?? ""}
          onChange={(e) => patch({ githubUsername: e.target.value })}
          placeholder="yourusername"
          maxLength={40}
          data-testid="input-github"
        />
        <span className="text-xs text-mute mt-1 block">
          Only use this if GitHub is relevant. LinkedIn, gallery links, and case links go in selected work.
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Profile photo</span>
        <div className="flex items-center gap-4">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt=""
              className="w-16 h-16 rounded-full object-cover border border-app"
            />
          ) : (
            <div className="w-16 h-16 rounded-full surface border border-app flex items-center justify-center text-mute text-xs">
              none
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onPhoto(e.target.files?.[0])}
            className="text-xs"
            data-testid="input-photo"
          />
          {profilePhoto && (
            <button
              type="button"
              className="btn btn-ghost text-xs"
              onClick={() => patch({ profilePhoto: undefined })}
              data-testid="button-remove-photo"
            >
              Remove
            </button>
          )}
        </div>
      </label>
    </div>
  );
}
