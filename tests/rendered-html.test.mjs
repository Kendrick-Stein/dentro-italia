import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("exports the finished Italian journey as static HTML", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>Dentro l’Italia — Un viaggio nella lingua e nell’arte<\/title>/i);
  assert.match(html, /DENTRO/);
  assert.match(html, /SCORRI PER ENTRARE/);
  assert.match(html, /UNA STORIA DI LINGUA, ARTE E AMICIZIA/);
  assert.match(html, /La porta nel dipinto/);
  assert.match(html, /Il drago nella tempesta/);
  assert.match(html, /Quella creatura non appartiene al paesaggio/);
  assert.match(html, /Grazie per/);
  assert.match(html, /questo viaggio/);
  assert.match(html, /\/characters\/quests\/teacher-portal-open\.webp/);
  assert.match(html, /\/characters\/quests\/knight-dragon\.webp/);
  assert.doesNotMatch(html, /Mi chiamo|Ora capisco|Vorrei/);
  assert.doesNotMatch(html, /[\u3400-\u9fff]/);
  assert.doesNotMatch(html, /ASCOLTA|speechSynthesis/);
  assert.doesNotMatch(html, /class="scene-phrase|class="word-spark|class="word-reveal|class="route-rail/);
  assert.doesNotMatch(html, /PAROLA TROVATA|CERCA 2 PAROLE|PAROLE TROVATE/);
  assert.match(html, /class="opening-art"/);
  assert.match(html, /class="chapter-next-art/);
  assert.match(html, /class="scene-entry-party"/);
  assert.match(html, /class="passage-party"/);
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

  assert.doesNotMatch(page, /speechSynthesis|SpeechSynthesis|speakItalian/);
  assert.match(page, /aria-modal="true"/);
  assert.match(page, /className="skip-link"/);
  assert.match(page, /className="chapter-reveal"/);
  assert.match(page, /className="journey-opening"/);
  assert.match(page, /className={`chapter-next-art/);
  assert.match(page, /className="passage-party"/);
  assert.match(page, /className="scene-entry-party"/);
  assert.match(page, /painting-voice/);
  assert.match(page, /quest-opacity/);
  assert.match(page, /moveLight/);
  assert.match(page, /posePath/);
  assert.doesNotMatch(page, /word-spark|word-reveal|scene-phrase|route-rail|parchment-hero|setFoundWords/);
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
    access(new URL("../out/characters/poses/teacher-action.webp", import.meta.url)),
    access(new URL("../out/characters/poses/knight-walk.webp", import.meta.url)),
    access(new URL("../out/characters/poses/cartographer-study.webp", import.meta.url)),
    access(new URL("../out/characters/poses/programmer-depart.webp", import.meta.url)),
    access(new URL("../out/characters/quests/teacher-portal-open.webp", import.meta.url)),
    access(new URL("../out/characters/quests/cartographer-route.webp", import.meta.url)),
    access(new URL("../out/characters/quests/knight-dragon.webp", import.meta.url)),
    access(new URL("../out/characters/quests/programmer-spark.webp", import.meta.url)),
    access(new URL("../out/artworks/school-of-athens.jpg", import.meta.url)),
  ]);
});
