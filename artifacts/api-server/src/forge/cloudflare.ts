import { createHash } from "node:crypto";
import { logger } from "../lib/logger";

const CF_API = "https://api.cloudflare.com/client/v4";

export interface DeployFile {
  path: string;
  content: Buffer;
  contentType: string;
}

export interface DeployResult {
  url: string;
  projectName: string;
  deploymentId: string;
}

export class CloudflareDeployError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = "CloudflareDeployError";
  }
}

function hashFile(content: Buffer, filename: string): string {
  const ext = filename.includes(".") ? filename.split(".").pop()! : "";
  const base64 = content.toString("base64");
  return createHash("sha256")
    .update(base64 + ext)
    .digest("hex")
    .slice(0, 32);
}

export function sanitizeProjectName(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.[a-z0-9.]+$/, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54);
  return base || "forge-portfolio";
}

interface CfEnv {
  apiToken: string;
  accountId: string;
}

function getCfEnv(): CfEnv {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!apiToken || !accountId) {
    throw new CloudflareDeployError(
      "Cloudflare deploy is not configured. Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID in this server's environment.",
      503,
    );
  }
  return { apiToken, accountId };
}

export function isCloudflareConfigured(): boolean {
  return !!(process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID);
}

async function cfFetch(
  url: string,
  init: RequestInit,
  context: string,
): Promise<unknown> {
  const res = await fetch(url, init);
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const errMsg =
      typeof body === "object" && body !== null && "errors" in body
        ? JSON.stringify((body as { errors: unknown }).errors)
        : typeof body === "string"
          ? body
          : `status ${res.status}`;
    throw new CloudflareDeployError(
      `Cloudflare ${context} failed: ${errMsg}`,
      res.status >= 400 && res.status < 500 ? 400 : 502,
    );
  }
  return body;
}

async function ensureProject(
  cf: CfEnv,
  projectName: string,
): Promise<void> {
  const getRes = await fetch(
    `${CF_API}/accounts/${cf.accountId}/pages/projects/${projectName}`,
    { headers: { Authorization: `Bearer ${cf.apiToken}` } },
  );
  if (getRes.ok) return;
  if (getRes.status !== 404) {
    const text = await getRes.text();
    throw new CloudflareDeployError(
      `Cloudflare project lookup failed: ${text}`,
      502,
    );
  }
  await cfFetch(
    `${CF_API}/accounts/${cf.accountId}/pages/projects`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cf.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        production_branch: "main",
      }),
    },
    "create project",
  );
}

async function getUploadJwt(
  cf: CfEnv,
  projectName: string,
): Promise<string> {
  const body = (await cfFetch(
    `${CF_API}/accounts/${cf.accountId}/pages/projects/${projectName}/upload-token`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${cf.apiToken}` },
    },
    "get upload token",
  )) as { result?: { jwt?: string } };
  const jwt = body?.result?.jwt;
  if (!jwt) {
    throw new CloudflareDeployError("Cloudflare did not return upload JWT", 502);
  }
  return jwt;
}

async function checkMissing(
  jwt: string,
  hashes: string[],
): Promise<string[]> {
  const body = (await cfFetch(
    `${CF_API}/pages/assets/check-missing`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hashes }),
    },
    "check missing assets",
  )) as { result?: string[] };
  return body?.result ?? hashes;
}

interface UploadPayload {
  key: string;
  value: string;
  metadata: { contentType: string };
  base64: true;
}

async function uploadAssets(
  jwt: string,
  payloads: UploadPayload[],
): Promise<void> {
  if (payloads.length === 0) return;
  await cfFetch(
    `${CF_API}/pages/assets/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloads),
    },
    "upload assets",
  );
}

async function createDeployment(
  cf: CfEnv,
  projectName: string,
  manifest: Record<string, string>,
): Promise<{ url: string; id: string }> {
  const form = new FormData();
  form.append("manifest", JSON.stringify(manifest));
  const body = (await cfFetch(
    `${CF_API}/accounts/${cf.accountId}/pages/projects/${projectName}/deployments`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${cf.apiToken}` },
      body: form,
    },
    "create deployment",
  )) as { result?: { url?: string; id?: string } };
  const url = body?.result?.url;
  const id = body?.result?.id;
  if (!url || !id) {
    throw new CloudflareDeployError(
      "Cloudflare deployment response missing url/id",
      502,
    );
  }
  return { url, id };
}

export async function deployToCloudflarePages(
  rawProjectName: string,
  files: DeployFile[],
): Promise<DeployResult> {
  const cf = getCfEnv();
  const projectName = sanitizeProjectName(rawProjectName);

  await ensureProject(cf, projectName);

  const manifest: Record<string, string> = {};
  const payloadByHash = new Map<string, UploadPayload>();
  for (const file of files) {
    const hash = hashFile(file.content, file.path);
    const path = file.path.startsWith("/") ? file.path : `/${file.path}`;
    manifest[path] = hash;
    if (!payloadByHash.has(hash)) {
      payloadByHash.set(hash, {
        key: hash,
        value: file.content.toString("base64"),
        metadata: { contentType: file.contentType },
        base64: true,
      });
    }
  }

  const jwt = await getUploadJwt(cf, projectName);
  const hashes = Array.from(payloadByHash.keys());
  const missing = await checkMissing(jwt, hashes);
  const missingPayloads = missing
    .map((h) => payloadByHash.get(h))
    .filter((p): p is UploadPayload => !!p);

  for (let i = 0; i < missingPayloads.length; i += 50) {
    await uploadAssets(jwt, missingPayloads.slice(i, i + 50));
  }

  const deployment = await createDeployment(cf, projectName, manifest);
  logger.info(
    { projectName, deploymentId: deployment.id, fileCount: files.length },
    "cloudflare pages deploy succeeded",
  );
  return {
    url: deployment.url,
    projectName,
    deploymentId: deployment.id,
  };
}
