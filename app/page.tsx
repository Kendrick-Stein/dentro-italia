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
  [{ left: "26%", top: "34%" }, { left: "73%", top: "31%" }],
  [{ left: "18%", top: "43%" }, { left: "78%", top: "36%" }],
  [{ left: "34%", top: "30%" }, { left: "67%", top: "41%" }],
  [{ left: "22%", top: "31%" }, { left: "76%", top: "48%" }],
  [{ left: "28%", top: "39%" }, { left: "69%", top: "29%" }],
  [{ left: "20%", top: "37%" }, { left: "77%", top: "40%" }],
  [{ left: "31%", top: "31%" }, { left: "70%", top: "35%" }],
];

type FoundWords = Record<string, string[]>;
type ActiveWord = { chapterId: string; word: string; meaning: string } | null;

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

  const style = {
    "--character-left": placement.left,
    "--character-bottom": placement.bottom,
    "--character-size": placement.size,
    "--character-delay": placement.delay ?? "0s",
    "--character-index": index,
    "--character-float-duration": `${3.8 + index * 0.55}s`,
  } as CSSProperties;

  return (
    <div
      className={`scene-character ${active ? "is-visible" : ""} ${placement.flip ? "is-flipped" : ""}`}
      style={style}
      aria-hidden="true"
    >
      <img src={assetUrl(traveler.image)} alt="" />
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
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);

        document.querySelectorAll<HTMLElement>(".story-chapter").forEach((chapter) => {
          const rect = chapter.getBoundingClientRect();
          const sceneProgress = Math.max(
            0,
            Math.min(1, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)),
          );
          const focus = 1 - Math.min(1, Math.abs(sceneProgress - 0.5) * 2);

          chapter.style.setProperty("--scene-progress", sceneProgress.toFixed(3));
          chapter.style.setProperty("--scene-zoom", (1.04 + sceneProgress * 0.15).toFixed(3));
          chapter.style.setProperty("--scene-shift-y", `${(sceneProgress - 0.5) * -7}%`);
          chapter.style.setProperty("--party-drift", `${(sceneProgress - 0.5) * 68}px`);
          chapter.style.setProperty("--frame-inset", `${1.2 + (1 - focus) * 6.5}%`);
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

  const handleHeroPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--pointer-x", `${x * 18}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${y * 12}px`);
  };

  const speakItalian = (phrase: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "it-IT";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };

  const discoverWord = (chapter: Chapter, word: string, meaning: string) => {
    setFoundWords((current) => {
      const chapterWords = current[chapter.id] ?? [];
      if (chapterWords.includes(word)) return current;
      return { ...current, [chapter.id]: [...chapterWords, word] };
    });
    setActiveWord({ chapterId: chapter.id, word, meaning });
    speakItalian(word);
  };

  return (
    <main>
      <a className="skip-link" href="#viaggio">
        Salta al viaggio
      </a>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Dentro l’Italia, torna all’inizio">
          <span>DENTRO</span>
          <span>L’ITALIA</span>
        </a>
        <div className="header-meta journey-status" aria-live="polite">
          <span>{activeChapter.city}</span>
          <span>PAROLE {foundTotal} / {wordTotal}</span>
        </div>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)}>
          <span>MAPPA</span>
          <span className="menu-icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-value" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      <section id="top" className="hero interactive-hero" onPointerMove={handleHeroPointer}>
        <div className="hero-art" aria-hidden="true">
          <img src={assetUrl("/artworks/school-of-athens.jpg")} alt="" fetchPriority="high" />
        </div>
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-kicker">
          <span>SCORRI · ESPLORA · ASCOLTA</span>
        </div>

        <div className="hero-copy">
          <p className="hero-overline">Una lingua dentro l’arte</p>
          <h1>
            <span>DENTRO</span>
            <span className="serif-line">l’Italia.</span>
          </h1>
          <p className="hero-deck">滚动穿行，点击画中的光点，听见意大利语。</p>
        </div>

        <div className="hero-party" aria-label="一位男老师和三位同学">
          {travelers.map((traveler, index) => (
            <div className="hero-person" key={traveler.id} style={{ "--person-index": index } as CSSProperties}>
              <img src={assetUrl(traveler.image)} alt={traveler.titleZh} />
            </div>
          ))}
        </div>

        <button className="enter-button" type="button" onClick={() => scrollToChapter(journeyChapters[0].id)}>
          <span>ENTRA NEL QUADRO</span>
          <span aria-hidden="true">↓</span>
        </button>

        <div className="hero-caption">
          <span>THE SCHOOL OF ATHENS</span>
          <span>RAPHAEL · 1509—1511</span>
        </div>
      </section>

      <section id="viaggio" className="story immersive-story" aria-label="意大利语互动旅程">
        <aside className="route-rail" aria-label="旅程地图">
          <span className="route-title">IL VIAGGIO</span>
          <div className="route-line" aria-hidden="true" />
          {journeyChapters.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              className={activeId === chapter.id ? "is-active" : ""}
              onClick={() => scrollToChapter(chapter.id)}
              aria-label={`前往第 ${index + 1} 幕：${chapter.title}`}
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

          return (
            <article
              id={chapter.id}
              className={`story-chapter ${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
              key={chapter.id}
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
                <div className="portal-frame" aria-hidden="true" />

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
                  <h3>{chapter.titleZh}</h3>
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

                <div className="scene-words" aria-label="画中的意大利语词语">
                  {chapter.lesson.words.map(([word, meaning], wordIndex) => {
                    const found = chapterFound.includes(word);
                    const position = wordSpotPatterns[chapterIndex][wordIndex];
                    return (
                      <button
                        className={`word-spark ${found ? "is-found" : ""}`}
                        type="button"
                        key={word}
                        style={{ "--word-left": position.left, "--word-top": position.top } as CSSProperties}
                        onClick={() => discoverWord(chapter, word, meaning)}
                        aria-label={found ? `${word}：${meaning}，再次朗读` : `发现第 ${wordIndex + 1} 个词语`}
                      >
                        <span className="spark-ring" aria-hidden="true" />
                        <strong>{found ? word : wordIndex + 1}</strong>
                        {found && <small>{meaning}</small>}
                      </button>
                    );
                  })}
                </div>

                {activeWord?.chapterId === chapter.id && (
                  <div className="word-reveal" role="status">
                    <span>PAROLA TROVATA</span>
                    <strong>{activeWord.word}</strong>
                    <small>{activeWord.meaning}</small>
                  </div>
                )}

                <button
                  className="scene-phrase"
                  type="button"
                  onClick={() => speakItalian(chapter.lesson.phrase)}
                  aria-label={`朗读：${chapter.lesson.phrase}`}
                >
                  <span className="sound-mark" aria-hidden="true">◖))</span>
                  <span>
                    <small>ASCOLTA</small>
                    <strong>{chapter.lesson.phrase}</strong>
                    <em>{chapter.lesson.translation}</em>
                  </span>
                </button>

                <div className="scroll-cue" aria-hidden="true">
                  <span>SCORRI</span>
                  <i />
                </div>
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
              src={assetUrl(traveler.image)}
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
        <div>
          <span>DENTRO L’ITALIA</span>
          <p>Una storia di lingua, arte e amicizia.</p>
        </div>
        <details>
          <summary>CREDITS / 作品来源</summary>
          <div className="credit-list">
            {credits.map((credit) => (
              <a key={credit.url} href={credit.url} target="_blank" rel="noreferrer">
                {credit.label} ↗
              </a>
            ))}
          </div>
        </details>
      </footer>

      {menuOpen && (
        <div className="index-overlay" role="dialog" aria-modal="true" aria-label="旅程地图">
          <div className="index-header">
            <span>MAPPA DEL VIAGGIO</span>
            <button type="button" onClick={() => setMenuOpen(false)} autoFocus>
              CHIUDI ×
            </button>
          </div>
          <div className="index-list">
            {journeyChapters.map((chapter, index) => (
              <button type="button" key={chapter.id} onClick={() => scrollToChapter(chapter.id)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{chapter.title}</strong>
                  <small>{chapter.city}</small>
                </div>
                <div className="index-thumb" aria-hidden="true">
                  <img src={assetUrl(chapter.image)} alt="" />
                </div>
                <i aria-hidden="true">→</i>
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
