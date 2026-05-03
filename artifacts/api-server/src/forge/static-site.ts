import type { WizardState } from "./schemas";
import type { DeployFile } from "./cloudflare";
import { renderAllRoutes } from "./multi-route-renderer";

export function buildStaticSiteFiles(state: WizardState): DeployFile[] {
  const routes = renderAllRoutes(state);
  const files: DeployFile[] = routes.map((r) => ({
    path: r.path,
    content: Buffer.from(r.html, "utf8"),
    contentType: "text/html; charset=utf-8",
  }));
  files.push({
    path: "/_redirects",
    content: Buffer.from("/*  /404.html  404\n", "utf8"),
    contentType: "text/plain; charset=utf-8",
  });
  files.push({
    path: "/robots.txt",
    content: Buffer.from("User-agent: *\nAllow: /\n", "utf8"),
    contentType: "text/plain; charset=utf-8",
  });
  return files;
}
