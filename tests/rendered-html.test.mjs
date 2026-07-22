import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("exports the finished Italian journey as static HTML", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>Dentro l’Italia — 我们的意大利语旅程<\/title>/i);
  assert.match(html, /DENTRO/);
  assert.match(html, /SCORRI · ESPLORA · ASCOLTA/);
  assert.match(html, /ENTRA NEL QUADRO/);
  assert.match(html, /Mi chiamo… Piacere!/);
  assert.match(html, /Grazie per questo viaggio/);
  assert.doesNotMatch(html, /ARCHIVIO \/ OPERE INCONTRATE/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("ships interaction, accessibility, and social assets", async () => {
  const [page, layout, css, story, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/story.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /speechSynthesis/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /className="skip-link"/);
  assert.match(page, /className={`word-spark/);
  assert.match(page, /className="chapter-reveal"/);
  assert.match(page, /setFoundWords/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /twitter/);
  assert.match(layout, /\/og\.png/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.equal((story.match(/number: "\d\d"/g) ?? []).length, 11);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../out/og.png", import.meta.url)),
    access(new URL("../out/characters/teacher.webp", import.meta.url)),
    access(new URL("../out/characters/knight.webp", import.meta.url)),
    access(new URL("../out/artworks/school-of-athens.jpg", import.meta.url)),
  ]);
});
