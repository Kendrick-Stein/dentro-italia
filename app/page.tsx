"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useState } from "react";
import {
  chapters,
  credits,
  travelers,
  type Chapter,
  type CharacterPlacement,
} from "./story";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetUrl = (path: string) => `${basePath}${path}`;

const journeyIds = [
  "presentarsi",
  "desiderare",
  "capire",
  "sbagliare",
  "viaggiare",
  "coraggio",
  "arrivederci",
] as const;

const journeyChapters = chapters.filter((chapter) =>
  journeyIds.includes(chapter.id as (typeof journeyIds)[number]),
);

const wordSpotPatterns = [
  [{ left: "49%", top: "34%" }, { left: "78%", top: "31%" }],
  [{ left: "18%", top: "43%" }, { left: "51%", top: "36%" }],
  [{ left: "47%", top: "30%" }, { left: "73%", top: "41%" }],
  [{ left: "20%", top: "31%" }, { left: "54%", top: "48%" }],
  [{ left: "48%", top: "39%" }, { left: "75%", top: "29%" }],
  [{ left: "18%", top: "37%" }, { left: "52%", top: "40%" }],
  [{ left: "49%", top: "31%" }, { left: "74%", top: "35%" }],
];

type FoundWords = Record<string, string[]>;
type ActiveWord = { chapterId: string; word: string } | null;

const posePath = (characterId: string, pose: string) =>
  `/characters/poses/${characterId}-${pose}.webp`;

function SceneCharacter({
  placement,
  active,
  index,
}: {
  placement: CharacterPlacement;
  active: boolean;
  index: number;
}) {
  const traveler = travelers.find((item) => item.id === placement.id);
  if (!traveler) return null;

  const image = placement.pose ? posePath(placement.id, placement.pose) : traveler.image;
  const style = {
    "--character-left": placement.left,
    "--character-bottom": placement.bottom,
    "--character-size": placement.size,
    "--character-delay": placement.delay ?? "0s",
    "--character-float-duration": `${3.8 + index * 0.55}s`,
  } as CSSProperties;

  return (
    <div
      className={`scene-character ${active ? "is-visible" : ""} ${placement.flip ? "is-flipped" : ""}`}
      style={style}
      aria-hidden="true"
    >
      <img src={assetUrl(image)} alt="" />
    </div>
  );
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(journeyChapters[0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [foundWords, setFoundWords] = useState<FoundWords>({});
  const [activeWord, setActiveWord] = useState<ActiveWord>(null);

  const foundTotal = Object.values(foundWords).reduce((total, words) => total + words.length, 0);
  const wordTotal = journeyChapters.reduce((total, chapter) => total + chapter.lesson.words.length, 0);
  const activeChapter = journeyChapters.find((chapter) => chapter.id === activeId) ?? journeyChapters[0];

  useEffect(() => {
    let animationFrame = 0;

    const updateScrollScene = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        const scrollable = document.documentElement.scrollHeight - viewportHeight;
        setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);

        const intro = document.querySelector<HTMLElement>(".parchment-hero");
        if (intro) {
          const rect = intro.getBoundingClientRect();
          const travel = Math.max(1, intro.offsetHeight - viewportHeight);
          const rawProgress = Math.max(0, Math.min(1, -rect.top / travel));
          const openingProgress = Math.max(0, Math.min(1, rawProgress / 0.72));
          const eased = openingProgress * openingProgress * (3 - 2 * openingProgress);
          const reveal = Math.max(0, Math.min(1, (rawProgress - 0.24) / 0.66));

          intro.style.setProperty("--intro-progress", rawProgress.toFixed(3));
          intro.style.setProperty("--intro-ambient-scale", (1 + rawProgress * 0.08).toFixed(3));
          intro.style.setProperty("--intro-art-scale", (1.12 - rawProgress * 0.08).toFixed(3));
          intro.style.setProperty("--parchment-clip", `${49 - eased * 49}%`);
          intro.style.setProperty("--roll-left", `${49 - eased * 49}%`);
          intro.style.setProperty("--roll-right", `${51 + eased * 49}%`);
          intro.style.setProperty("--parchment-radius", `${24 - eased * 22}px`);
          intro.style.setProperty("--intro-art-opacity", reveal.toFixed(3));
          intro.style.setProperty("--intro-saturation", (0.08 + reveal * 0.94).toFixed(3));
          intro.style.setProperty("--intro-sepia", (0.95 - reveal * 0.87).toFixed(3));
          const partyOpacity = Math.max(0, Math.min(1, (rawProgress - 0.58) / 0.24));
          intro.style.setProperty("--intro-party-opacity", partyOpacity.toFixed(3));
          intro.style.setProperty("--intro-party-shift", `${(1 - partyOpacity) * 35}px`);
          intro.style.setProperty("--intro-title-scale", (1 - eased * 0.16).toFixed(3));
          intro.style.setProperty("--intro-cue-opacity", Math.max(0, 1 - rawProgress * 2.2).toFixed(3));
          intro.style.setProperty("--roll-depth", `${24 - eased * 14}px`);
        }

        document.querySelectorAll<HTMLElement>(".story-chapter").forEach((chapter) => {
          const rect = chapter.getBoundingClientRect();
          const sceneProgress = Math.max(
            0,
            Math.min(1, (viewportHeight - rect.top) / (rect.height + viewportHeight)),
          );
          const focus = 1 - Math.min(1, Math.abs(sceneProgress - 0.5) * 2);
          const easedFocus = focus * focus * (3 - 2 * focus);
          const edge = 1 - easedFocus;

          chapter.style.setProperty("--scene-progress", sceneProgress.toFixed(3));
          chapter.style.setProperty("--scene-zoom", (1.035 + sceneProgress * 0.12).toFixed(3));
          chapter.style.setProperty("--scene-shift-y", `${(sceneProgress - 0.5) * -5.5}%`);
          chapter.style.setProperty("--party-drift", `${(sceneProgress - 0.5) * 58}px`);
          chapter.style.setProperty("--frame-inset", `${1.1 + edge * 5.4}%`);
          chapter.style.setProperty("--scene-clip", `${edge * 5.5}%`);
          chapter.style.setProperty("--scene-alpha", Math.min(1, easedFocus * 1.45).toFixed(3));
          chapter.style.setProperty("--transition-opacity", Math.min(0.82, edge * 1.15).toFixed(3));
        });
      });
    };

    updateScrollScene();
    window.addEventListener("scroll", updateScrollScene, { passive: true });
    window.addEventListener("resize", updateScrollScene);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-34% 0px -34% 0px", threshold: [0, 0.12, 0.35, 0.7] },
    );

    document.querySelectorAll<HTMLElement>(".story-chapter").forEach((chapter) => {
      observer.observe(chapter);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateScrollScene);
      window.removeEventListener("resize", updateScrollScene);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActiveWord(null);
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        menuOpen ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "BUTTON" ||
        target?.tagName === "A"
      ) {
        return;
      }

      const currentIndex = journeyChapters.findIndex((chapter) => chapter.id === activeId);
      if ((event.key === "ArrowDown" || event.key === "PageDown") && currentIndex < journeyChapters.length - 1) {
        event.preventDefault();
        document.getElementById(journeyChapters[currentIndex + 1].id)?.scrollIntoView({ behavior: "smooth" });
      }
      if ((event.key === "ArrowUp" || event.key === "PageUp") && currentIndex > 0) {
        event.preventDefault();
        document.getElementById(journeyChapters[currentIndex - 1].id)?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, menuOpen]);

  const scrollToChapter = (id: string) => {
    setMenuOpen(false);
    setActiveWord(null);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const moveLight = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--scene-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--scene-y", `${y.toFixed(2)}%`);
  };

  const discoverWord = (chapter: Chapter, word: string) => {
    setFoundWords((current) => {
      const chapterWords = current[chapter.id] ?? [];
      if (chapterWords.includes(word)) return current;
      return { ...current, [chapter.id]: [...chapterWords, word] };
    });
    setActiveWord({ chapterId: chapter.id, word });
  };

  return (
    <main>
      <a className="skip-link" href="#viaggio">Vai al viaggio</a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Dentro l’Italia, torna all’inizio">
          <span>DENTRO</span>
          <span>L’ITALIA</span>
        </a>
        <div className="header-meta journey-status" aria-live="polite">
          <span>{activeChapter.city}</span>
          <span>PAROLE {foundTotal} / {wordTotal}</span>
        </div>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Apri la mappa">
          <span>MAPPA</span>
          <span className="menu-icon" aria-hidden="true"><i /><i /></span>
        </button>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-value" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      <section id="top" className="parchment-hero">
        <div className="parchment-sticky">
          <div className="parchment-ambient" aria-hidden="true" />
          <div className="parchment-shell">
            <div className="parchment-roll parchment-roll-left" aria-hidden="true" />
            <div className="parchment-roll parchment-roll-right" aria-hidden="true" />
            <div className="parchment-sheet">
              <div className="parchment-art" aria-hidden="true">
                <img src={assetUrl("/artworks/school-of-athens.jpg")} alt="" fetchPriority="high" />
              </div>
              <div className="parchment-veil" aria-hidden="true" />
              <div className="parchment-grain" aria-hidden="true" />

              <div className="parchment-copy">
                <span>UNA STORIA DI LINGUA, ARTE E AMICIZIA</span>
                <h1><strong>DENTRO</strong><em>L’ITALIA</em></h1>
              </div>

              <div className="parchment-party" aria-label="Il maestro e tre studenti">
                {travelers.map((traveler, index) => (
                  <img
                    key={traveler.id}
                    src={assetUrl(posePath(traveler.id, "walk"))}
                    alt={traveler.title}
                    style={{ "--intro-person": index } as CSSProperties}
                  />
                ))}
              </div>

              <button className="parchment-enter" type="button" onClick={() => scrollToChapter(journeyChapters[0].id)}>
                ENTRA NEL VIAGGIO ↓
              </button>
            </div>
          </div>
          <div className="unroll-cue" aria-hidden="true"><span>SCORRI PER APRIRE</span><i /></div>
        </div>
      </section>

      <section id="viaggio" className="story immersive-story" aria-label="Viaggio interattivo in italiano">
        <aside className="route-rail" aria-label="Mappa del viaggio">
          <span className="route-title">IL VIAGGIO</span>
          <div className="route-line" aria-hidden="true" />
          {journeyChapters.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              className={activeId === chapter.id ? "is-active" : ""}
              onClick={() => scrollToChapter(chapter.id)}
              aria-label={`Vai alla scena ${index + 1}: ${chapter.title}`}
            >
              <i aria-hidden="true" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </aside>

        {journeyChapters.map((chapter, chapterIndex) => {
          const isActive = activeId === chapter.id;
          const chapterFound = foundWords[chapter.id] ?? [];
          const isComplete = chapterFound.length === chapter.lesson.words.length;
          const chapterStyle = {
            "--chapter-saturation": (0.24 + chapterIndex * 0.11).toFixed(2),
            "--reveal-saturation": (0.82 + chapterIndex * 0.065).toFixed(2),
            "--chapter-sepia": Math.max(0.08, 0.48 - chapterIndex * 0.06).toFixed(2),
            "--reveal-sepia": Math.max(0.02, 0.14 - chapterIndex * 0.018).toFixed(2),
          } as CSSProperties;

          return (
            <article
              id={chapter.id}
              className={`story-chapter ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
              key={chapter.id}
              style={chapterStyle}
            >
              <div className="chapter-sticky" onPointerMove={moveLight}>
                <div className="chapter-art" aria-hidden="true">
                  <img
                    src={assetUrl(chapter.image)}
                    alt=""
                    loading={chapterIndex === 0 ? "eager" : "lazy"}
                    style={{ objectPosition: chapter.imagePosition ?? "50% 50%" }}
                  />
                </div>
                <div className="chapter-reveal" aria-hidden="true">
                  <img
                    src={assetUrl(chapter.image)}
                    alt=""
                    loading="lazy"
                    style={{ objectPosition: chapter.imagePosition ?? "50% 50%" }}
                  />
                </div>
                <div className="chapter-wash" aria-hidden="true" />
                <div className="chapter-light" aria-hidden="true" />
                <div className="scene-transition" aria-hidden="true" />

                <div className="chapter-topline">
                  <span>{String(chapterIndex + 1).padStart(2, "0")} / {String(journeyChapters.length).padStart(2, "0")}</span>
                  <span>{chapter.city}</span>
                  <span>{isComplete ? "PAROLE TROVATE ✓" : "CERCA 2 PAROLE"}</span>
                </div>

                <div className="artwork-label">
                  <strong>{chapter.artwork}</strong>
                  <span>{chapter.artist} · {chapter.date}</span>
                </div>

                <div className="chapter-copy">
                  <p>{chapter.stage}</p>
                  <h2>{chapter.title}</h2>
                </div>

                <div className="scene-cast">
                  {chapter.characters.map((placement, index) => (
                    <SceneCharacter
                      key={`${chapter.id}-${placement.id}`}
                      placement={placement}
                      active={isActive}
                      index={index}
                    />
                  ))}
                </div>

                <div className="scene-words" aria-label="Parole nascoste nel quadro">
                  {chapter.lesson.words.map(([word], wordIndex) => {
                    const found = chapterFound.includes(word);
                    const position = wordSpotPatterns[chapterIndex][wordIndex];
                    return (
                      <button
                        className={`word-spark ${found ? "is-found" : ""}`}
                        type="button"
                        key={word}
                        style={{ "--word-left": position.left, "--word-top": position.top } as CSSProperties}
                        onClick={() => discoverWord(chapter, word)}
                        aria-label={found ? `Parola trovata: ${word}` : `Trova la parola ${wordIndex + 1}`}
                      >
                        <span className="spark-ring" aria-hidden="true" />
                        <strong>{found ? word : wordIndex + 1}</strong>
                      </button>
                    );
                  })}
                </div>

                {activeWord?.chapterId === chapter.id && (
                  <div className="word-reveal" role="status">
                    <span>PAROLA TROVATA</span>
                    <strong>{activeWord.word}</strong>
                  </div>
                )}

                <div className="scroll-cue" aria-hidden="true"><span>SCORRI</span><i /></div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="journey-finale">
        <div className="finale-echo" aria-hidden="true">ARRIVEDERCI</div>
        <div className="finale-mini-party" aria-hidden="true">
          {travelers.map((traveler, index) => (
            <img
              key={traveler.id}
              src={assetUrl(posePath(traveler.id, "depart"))}
              alt=""
              style={{ "--finale-index": index, "--finale-delay": `${index * 100}ms` } as CSSProperties}
            />
          ))}
        </div>
        <div className="finale-minimal-copy">
          <span>{foundTotal} / {wordTotal} PAROLE TROVATE</span>
          <h2>Grazie per<br /><em>questo viaggio.</em></h2>
          <button type="button" onClick={() => scrollToChapter("top")}>RICOMINCIA ↗</button>
        </div>
      </section>

      <footer className="site-footer compact-footer">
        <div><span>DENTRO L’ITALIA</span><p>Una storia di lingua, arte e amicizia.</p></div>
        <details>
          <summary>CREDITI</summary>
          <div className="credit-list">
            {credits.map((credit) => (
              <a key={credit.url} href={credit.url} target="_blank" rel="noreferrer">{credit.label} ↗</a>
            ))}
          </div>
        </details>
      </footer>

      {menuOpen && (
        <div className="index-overlay" role="dialog" aria-modal="true" aria-label="Mappa del viaggio">
          <div className="index-header">
            <span>MAPPA DEL VIAGGIO</span>
            <button type="button" onClick={() => setMenuOpen(false)} autoFocus>CHIUDI ×</button>
          </div>
          <div className="index-list">
            {journeyChapters.map((chapter, index) => (
              <button type="button" key={chapter.id} onClick={() => scrollToChapter(chapter.id)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{chapter.title}</strong><small>{chapter.city}</small></div>
                <div className="index-thumb" aria-hidden="true"><img src={assetUrl(chapter.image)} alt="" /></div>
                <i aria-hidden="true">→</i>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
