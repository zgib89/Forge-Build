import { Router, type IRouter } from "express";
import { z } from "zod";
import { WizardStateSchema } from "../forge/schemas";
import { buildPortfolioZip } from "../forge/zip-builder";
import { renderPreviewHtml } from "../forge/preview-renderer";
import {
  CloudflareDeployError,
  deployToCloudflarePages,
  isCloudflareConfigured,
} from "../forge/cloudflare";
import { buildStaticSiteFiles } from "../forge/static-site";
import { buildRegistrarOptions } from "../forge/registrars";
import { consume as rateLimitConsume } from "../forge/rate-limit";
import { logger } from "../lib/logger";

const DOMAIN_RE = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;

const router: IRouter = Router();

router.post("/forge/export", async (req, res) => {
  const parsed = WizardStateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const zip = await buildPortfolioZip(parsed.data);
    const filename = `${parsed.data.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}-portfolio.zip`;
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );
    res.setHeader("Content-Length", zip.length.toString());
    res.send(zip);
  } catch (err) {
    logger.error({ err }, "forge export failed");
    res.status(500).json({ error: "Export failed" });
  }
});

router.get("/forge/preview", (req, res) => {
  const stateParam =
    typeof req.query.state === "string" ? req.query.state : undefined;
  if (!stateParam) {
    res.status(400).send("missing ?state= query param");
    return;
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(stateParam);
  } catch {
    res.status(400).send("invalid state JSON");
    return;
  }
  const parsed = WizardStateSchema.safeParse(parsedJson);
  if (!parsed.success) {
    logger.warn({ err: parsed.error.flatten() }, "preview validation failed");
    res
      .status(400)
      .send(
        `<!doctype html><html><body style="font-family:monospace;padding:2rem;color:#888;">Invalid preview state</body></html>`,
      );
    return;
  }
  const html = renderPreviewHtml(parsed.data, { linkMode: "inert" });
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(html);
});

router.post("/forge/preview", (req, res) => {
  const parsed = WizardStateSchema.safeParse(req.body);
  if (!parsed.success) {
    logger.warn({ err: parsed.error.flatten() }, "preview validation failed");
    res
      .status(400)
      .send(
        `<!doctype html><html><body style="font-family:monospace;padding:2rem;color:#888;">Invalid preview state</body></html>`,
      );
    return;
  }
  const html = renderPreviewHtml(parsed.data, { linkMode: "inert" });
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(html);
});

const EmailPayloadSchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(40).optional(),
  state: WizardStateSchema.optional(),
});

const DomainCheckSchema = z.object({
  domain: z.string().min(3).max(253),
});

router.post("/forge/domain/check", async (req, res) => {
  const parsed = DomainCheckSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: "Invalid domain payload" });
    return;
  }
  const domain = parsed.data.domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!DOMAIN_RE.test(domain)) {
    res.json({
      ok: true,
      domain,
      valid: false,
      available: null,
      reason: "Not a valid domain (need something like name.com).",
    });
    return;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const rdap = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      signal: controller.signal,
      headers: { Accept: "application/rdap+json" },
    });
    clearTimeout(timeout);
    if (rdap.status === 404) {
      res.json({
        ok: true,
        domain,
        valid: true,
        available: true,
        registrars: buildRegistrarOptions(domain),
      });
      return;
    }
    if (rdap.status === 200) {
      res.json({ ok: true, domain, valid: true, available: false });
      return;
    }
    if (rdap.status === 400) {
      res.json({
        ok: true,
        domain,
        valid: true,
        available: null,
        reason: "Registry doesn't support availability lookup for this TLD.",
      });
      return;
    }
    res.json({
      ok: true,
      domain,
      valid: true,
      available: null,
      reason: `Lookup returned status ${rdap.status}.`,
    });
  } catch (err) {
    logger.warn({ err, domain }, "rdap lookup failed");
    res.json({
      ok: true,
      domain,
      valid: true,
      available: null,
      reason: "Couldn't reach the domain registry. Try again in a moment.",
    });
  }
});

router.get("/forge/deploy/cloudflare/status", (_req, res) => {
  res.json({ configured: isCloudflareConfigured() });
});

const DEPLOY_SLUG_RE = /^[a-z0-9]{6,16}$/;

function clientKey(req: import("express").Request): string {
  const fwd = req.headers["x-forwarded-for"];
  const first = Array.isArray(fwd) ? fwd[0] : fwd?.split(",")[0]?.trim();
  return (first || req.ip || req.socket.remoteAddress || "unknown").toString();
}

router.post("/forge/deploy/cloudflare", async (req, res) => {
  const parsed = WizardStateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.flatten() });
    return;
  }
  if (!isCloudflareConfigured()) {
    res.status(503).json({
      ok: false,
      error:
        "Cloudflare deploy isn't configured on this server. The site owner needs to add CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.",
    });
    return;
  }

  const ipKey = clientKey(req);
  const perIp = rateLimitConsume(`deploy:ip:${ipKey}`, {
    windowMs: 60 * 60 * 1000,
    max: 5,
  });
  if (!perIp.allowed) {
    const retryIn = Math.max(1, Math.ceil((perIp.resetAt - Date.now()) / 1000));
    res
      .status(429)
      .setHeader("Retry-After", retryIn.toString())
      .json({
        ok: false,
        error: `Too many deploys from this network. Try again in ${Math.ceil(retryIn / 60)} minute(s).`,
      });
    return;
  }
  const global = rateLimitConsume(`deploy:global`, {
    windowMs: 60 * 60 * 1000,
    max: 60,
  });
  if (!global.allowed) {
    res.status(429).json({
      ok: false,
      error: "Server-wide deploy limit reached for this hour. Try again later.",
    });
    return;
  }

  const slug = typeof req.body?.deploySlug === "string" ? req.body.deploySlug : "";
  if (!DEPLOY_SLUG_RE.test(slug)) {
    res.status(400).json({
      ok: false,
      error: "Missing or invalid deploySlug (browser should generate one).",
    });
    return;
  }

  try {
    const files = buildStaticSiteFiles(parsed.data);
    const projectSeed = `${parsed.data.domain || parsed.data.name}-${slug}`;
    const result = await deployToCloudflarePages(projectSeed, files);
    res.json({
      ok: true,
      url: result.url,
      projectName: result.projectName,
      deploymentId: result.deploymentId,
    });
  } catch (err) {
    if (err instanceof CloudflareDeployError) {
      logger.warn({ err: err.message }, "cloudflare deploy failed");
      res.status(err.status).json({ ok: false, error: err.message });
      return;
    }
    logger.error({ err }, "cloudflare deploy failed unexpectedly");
    res.status(500).json({ ok: false, error: "Deploy failed unexpectedly." });
  }
});

router.post("/forge/email", (req, res) => {
  const parsed = EmailPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.flatten() });
    return;
  }
  const { email, state } = parsed.data;
  logger.info(
    { email: "captured", preset: state?.preset, hasState: !!state },
    "forge email",
  );
  res.json({ ok: true });
});

export default router;
