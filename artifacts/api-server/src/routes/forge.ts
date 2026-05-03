import { Router, type IRouter } from "express";
import { WizardStateSchema } from "../forge/schemas";
import { buildPortfolioZip } from "../forge/zip-builder";
import { renderPreviewHtml } from "../forge/preview-renderer";
import { logger } from "../lib/logger";

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

router.post("/forge/preview", (req, res) => {
  const parsed = WizardStateSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .send(
        `<!doctype html><html><body style="font-family:monospace;padding:2rem;color:#888;">Invalid preview state</body></html>`,
      );
    return;
  }
  const html = renderPreviewHtml(parsed.data);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.send(html);
});

router.post("/forge/email", (req, res) => {
  const email =
    typeof req.body?.email === "string" ? req.body.email : undefined;
  logger.info({ email: email ? "captured" : "skipped" }, "forge email");
  res.json({ ok: true });
});

export default router;
