// Injects the server-rendered App markup into dist/index.html.
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);
const html = await readFile(path.join(dist, "index.html"), "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error("Root marker not found in dist/index.html");

const appHtml = render();
await writeFile(
  path.join(dist, "index.html"),
  html.replace(marker, `<div id="root">${appHtml}</div>`),
);
await rm(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${Math.round(appHtml.length / 1024)} KB of HTML into dist/index.html`);
