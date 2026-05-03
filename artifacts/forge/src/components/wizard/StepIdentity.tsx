import { useWizard } from "../../lib/store";

export default function StepIdentity() {
  const name = useWizard((s) => s.name);
  const role = useWizard((s) => s.role);
  const tagline = useWizard((s) => s.tagline);
  const location = useWizard((s) => s.location);
  const githubUsername = useWizard((s) => s.githubUsername);
  const profilePhoto = useWizard((s) => s.profilePhoto);
  const patch = useWizard((s) => s.patch);

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patch({ profilePhoto: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-md">
      <div>
        <p className="eyebrow mb-2">Step 1</p>
        <h2 className="text-3xl mb-2">Who are you?</h2>
        <p className="text-mute text-sm">
          The basics. We'll thread these through every page.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Full name *</span>
        <input
          type="text"
          value={name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="Zac Gibson"
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
          placeholder="IAM Engineer"
          maxLength={60}
          data-testid="input-role"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Tagline</span>
        <textarea
          value={tagline ?? ""}
          onChange={(e) => patch({ tagline: e.target.value })}
          placeholder="Identity engineer building the tools I need."
          maxLength={120}
          rows={2}
          data-testid="input-tagline"
        />
        <span className="text-xs text-mute mt-1 block">{(tagline ?? "").length}/120</span>
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">Location</span>
        <input
          type="text"
          value={location ?? ""}
          onChange={(e) => patch({ location: e.target.value })}
          placeholder="Murfreesboro, TN"
          maxLength={60}
          data-testid="input-location"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium mb-1.5 block">GitHub username</span>
        <input
          type="text"
          value={githubUsername ?? ""}
          onChange={(e) => patch({ githubUsername: e.target.value })}
          placeholder="zacgibson"
          maxLength={40}
          data-testid="input-github"
        />
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
