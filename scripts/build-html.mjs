/*
 * Builds the whole prototype as ONE self-contained HTML file (arni-mvp-prototype.html) that opens
 * from disk with no server: the screens are bundled with Vite, the stylesheet is the exact CSS from
 * the Next.js build, and fonts, logo and favicon are embedded as data URIs.
 *
 * Run with `npm run build:html` (it runs `next build` first).
 */
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { build } from "vite";

const root = path.resolve(import.meta.dirname, "..");
const nextDir = path.join(root, ".next");
const output = path.join(root, "arni-mvp-prototype.html");

/* ---------- 1. Stylesheet from the Next.js build ---------- */

const builtPage = path.join(nextDir, "server/app/index.html");
if (!existsSync(builtPage)) throw new Error("Run `next build` first (npm run build:html does this).");
const cssHrefs = [...readFileSync(builtPage, "utf8").matchAll(/href="\/_next\/(static\/[^"]+\.css)"/g)].map((m) => m[1]);
if (cssHrefs.length === 0) throw new Error("No stylesheet found in the Next.js build output.");
let css = [...new Set(cssHrefs)].map((href) => readFileSync(path.join(nextDir, href), "utf8")).join("\n");

const dataUri = (file, type) => `data:${type};base64,${readFileSync(file).toString("base64")}`;

// Keep only the Latin font subsets (next/font marks them as preloaded: "*.p.*.woff2"), one face per file.
const faces = new Map();
css = css.replace(/@font-face\{([^}]*)\}/g, (rule, body) => {
  const file = body.match(/url\(\.\.\/media\/([^)]+\.woff2)\)/)?.[1];
  if (!file) return rule; // metric-adjusted local() fallbacks stay as they are
  if (!file.includes(".p.")) return "";
  const family = body.match(/font-family:([^;]+);/)[1];
  const weights = body.match(/font-weight:([^;]+);/)[1].split(" ").map(Number);
  const face = faces.get(file) ?? { family, min: Infinity, max: -Infinity };
  face.min = Math.min(face.min, ...weights);
  face.max = Math.max(face.max, ...weights);
  faces.set(file, face);
  return "";
});
const fontFaces = [...faces].map(
  ([file, f]) =>
    `@font-face{font-family:${f.family};font-style:normal;font-weight:${f.min} ${f.max};font-display:swap;` +
    `src:url(${dataUri(path.join(nextDir, "static/media", file), "font/woff2")})format("woff2")}`,
);
// next/font scopes the font variables to hashed classes on <html>; here they apply to the document.
css = css.replace(/\.[\w-]+_variable\{(--font-(?:inter|lora):)/g, ":root{$1");
css = fontFaces.join("") + css;

/* ---------- 2. Script bundle ---------- */

const outDir = mkdtempSync(path.join(tmpdir(), "arni-html-"));
const shim = (file) => path.join(root, "standalone/shims", file);
await build({
  configFile: false,
  root: path.join(root, "standalone"),
  base: "./",
  logLevel: "warn",
  resolve: {
    alias: [
      { find: /^next\/link$/, replacement: shim("link.tsx") },
      { find: /^next\/navigation$/, replacement: shim("navigation.ts") },
      { find: /^next\/image$/, replacement: shim("image.tsx") },
      { find: /^@\//, replacement: `${path.join(root, "src")}/` },
    ],
  },
  build: {
    outDir,
    emptyOutDir: true,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    modulePreload: false,
    reportCompressedSize: false,
    rolldownOptions: {
      onwarn(warning, warn) {
        // Next's "use client" directives are meaningless in a plain client bundle.
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});

const assetsDir = path.join(outDir, "assets");
const scripts = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
if (scripts.length !== 1) throw new Error(`Expected one script bundle, found ${scripts.length}.`);
const js = readFileSync(path.join(assetsDir, scripts[0]), "utf8").replace(/<\/script/gi, "<\\/script");
rmSync(outDir, { recursive: true, force: true });

/* ---------- 3. One file ---------- */

const icon = dataUri(path.join(root, "src/app/icon.svg"), "image/svg+xml");
const html = `<!doctype html>
<html lang="en-GB" class="h-full antialiased">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#ffffff">
<title>Arni — Guided Business Setup | Arnifi</title>
<meta name="description" content="Prototype: describe your business and let Arni guide you to suitable UAE company setup options.">
<link rel="icon" href="${icon}" type="image/svg+xml">
<style>${css}</style>
</head>
<body class="flex min-h-full flex-col">
<div id="root" style="display:contents"></div>
<noscript><p style="padding:24px;font-family:sans-serif">This prototype needs JavaScript.</p></noscript>
<script type="module">${js}</script>
</body>
</html>
`;
writeFileSync(output, html);
console.log(`Wrote ${path.relative(root, output)} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
