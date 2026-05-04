import { mkdtemp, mkdir, rm, writeFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import JSZip from "jszip";
import { buildPortfolioZip } from "../src/forge/zip-builder";
import {
  WizardStateSchema,
  type WizardState,
  type Palette,
} from "../src/forge/schemas";

type PresetId = WizardState["preset"];
const PNPM_BIN = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

const PALETTES: Record<PresetId, Palette> = {
  editorial: {
    bg: "#fbfaf7",
    surface: "#ffffff",
    border: "#e5e1d8",
    text: "#1a1a1a",
    mute: "#6b6b6b",
    accent: "#b8431a",
  },
  minimalist: {
    bg: "#0a0a0a",
    surface: "#111111",
    border: "#222222",
    text: "#e5e5e5",
    mute: "#888888",
    accent: "#7dd3fc",
  },
  aurora: {
    bg: "#06070d",
    surface: "#0e1122",
    border: "#1f2540",
    text: "#f4f5ff",
    mute: "#9aa1c4",
    accent: "#7c5cff",
    accent2: "#22d3ee",
  },
};

function makeFixture(preset: PresetId): WizardState {
  return WizardStateSchema.parse({
    name: "Test User",
    role: "Software Designer",
    tagline: "I build small, sharp software for people who care about craft.",
    location: "Brooklyn, NY",
    preset,
    palette: PALETTES[preset],
    paletteName: "default",
    darkMode: preset !== "editorial",
    fontPair: "modern",
    radiusScale: "soft",
    sections: {
      projects: true,
      writing: true,
      about: true,
      contact: true,
      now: true,
      uses: true,
    },
    githubUsername: "testuser",
    footerStyle: "minimal",
    showForgeAttribution: true,
    projects: [
      {
        id: "atlas",
        title: "Atlas",
        summary: "A map of every public dataset on the open web.",
        stack: ["TypeScript", "Postgres", "Cloudflare"],
        role: "Engineer",
        date: "2024",
        liveUrl: "https://example.com/atlas",
        repoUrl: "https://github.com/example/atlas",
      },
      {
        id: "ember",
        title: "Ember",
        summary: "A note-taking app that remembers what matters.",
        stack: ["Swift", "CoreData"],
        date: "2023",
      },
    ],
    domain: "testuser.example",
    email: "test@example.com",
  });
}

function run(
  cmd: string,
  args: string[],
  cwd: string,
  label: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
      env: {
        ...process.env,
        // Generated portfolio is standalone; pretend we are not in a workspace.
        npm_config_workspace_root: "",
        CI: "1",
      },
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => {
      const s = d.toString();
      out += s;
      process.stdout.write(`  [${label}] ${s}`);
    });
    child.stderr.on("data", (d) => {
      const s = d.toString();
      err += s;
      process.stderr.write(`  [${label}] ${s}`);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${label} exited with code ${code}\n${err || out}`));
    });
  });
}

async function extractZip(buf: Buffer, dest: string): Promise<void> {
  const zip = await JSZip.loadAsync(buf);
  const entries = Object.values(zip.files);
  for (const entry of entries) {
    const target = path.join(dest, entry.name);
    if (entry.dir) {
      await mkdir(target, { recursive: true });
      continue;
    }
    await mkdir(path.dirname(target), { recursive: true });
    const data = await entry.async("nodebuffer");
    await writeFile(target, data);
  }
}

async function testPreset(preset: PresetId): Promise<void> {
  console.log(`\n=== Testing preset: ${preset} ===`);
  const state = makeFixture(preset);
  const zip = await buildPortfolioZip(state);

  const root = await mkdtemp(path.join(tmpdir(), `forge-${preset}-`));
  console.log(`  Working dir: ${root}`);

  try {
    await extractZip(zip, root);

    // Generated portfolio is standalone; isolate it from the workspace.
    await writeFile(path.join(root, "pnpm-workspace.yaml"), "packages: []\n");
    await writeFile(
      path.join(root, ".npmrc"),
      "minimum-release-age=0\nignore-workspace=true\n",
    );

    console.log(`  Installing dependencies...`);
    await run(
      PNPM_BIN,
      ["install", "--ignore-workspace", "--config.minimum-release-age=0"],
      root,
      `${preset}:install`,
    );

    console.log(`  Building...`);
    await run(PNPM_BIN, ["run", "build"], root, `${preset}:build`);

    const distStat = await stat(path.join(root, "dist"));
    if (!distStat.isDirectory()) {
      throw new Error(`dist/ was not created for ${preset}`);
    }
    console.log(`  ✓ ${preset} built successfully`);
  } finally {
    if (!process.env.KEEP_TMP) {
      await rm(root, { recursive: true, force: true });
    } else {
      console.log(`  KEEP_TMP set — leaving ${root}`);
    }
  }
}

async function main() {
  const presets: PresetId[] = ["editorial", "minimalist", "aurora"];
  const only = process.env.PRESET as PresetId | undefined;
  const list = only ? [only] : presets;

  const failures: Array<{ preset: PresetId; error: Error }> = [];
  for (const preset of list) {
    try {
      await testPreset(preset);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      console.error(`✗ ${preset} FAILED: ${e.message}`);
      failures.push({ preset, error: e });
    }
  }

  console.log("\n=== Summary ===");
  for (const p of list) {
    const f = failures.find((x) => x.preset === p);
    console.log(`  ${f ? "✗" : "✓"} ${p}`);
  }

  if (failures.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
