"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  archiveWorks,
  chapters,
  credits,
  travelers,
  type Chapter,
  type CharacterPlacement,
} from "./story";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetUrl = (path: string) => `${basePath}${path}`;

function SceneCharacter({
  placement,
  active,
}: {
  placement: CharacterPlacement;
  active: boolean;
}) {
  const traveler = travelers.find((item) => item.id === placement.id);
  if (!traveler) return null;

  const style = {
    "--character-left": placement.left,
    "--character-bottom": placement.bottom,
    "--character-size": placement.size,
    "--character-delay": placement.delay ?? "0s",
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
  const [activeId, setActiveId] = useState(chapters[0].id);
  const [activeLesson, setActiveLesson] = useState<Chapter | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const travelerMap = useMemo(
    () => Object.fromEntries(travelers.map((traveler) => [traveler.id, traveler])),
    [],
  );

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-36% 0px -36% 0px", threshold: [0, 0.1, 0.35, 0.7] },
    );

    document.querySelectorAll<HTMLElement>(".story-chapter").forEach((chapter) => {
      observer.observe(chapter);
    });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveLesson(null);
        setMenuOpen(false);
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        activeLesson ||
        menuOpen ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "BUTTON" ||
        target?.tagName === "A"
      ) {
        return;
      }

      const currentIndex = chapters.findIndex((chapter) => chapter.id === activeId);
      if ((event.key === "ArrowDown" || event.key === "PageDown") && currentIndex < chapters.length - 1) {
        event.preventDefault();
        document.getElementById(chapters[currentIndex + 1].id)?.scrollIntoView({ behavior: "smooth" });
      }
      if ((event.key === "ArrowUp" || event.key === "PageUp") && currentIndex > 0) {
        event.preventDefault();
        document.getElementById(chapters[currentIndex - 1].id)?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, activeLesson, menuOpen]);

  const scrollToChapter = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
        <div className="header-meta" aria-hidden="true">
          <span>UNA LINGUA</span>
          <span>QUATTRO PERSONE</span>
          <span>UN VIAGGIO</span>
        </div>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)}>
          <span>INDICE</span>
          <span className="menu-icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-value" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      <section id="top" className="hero" onPointerMove={handleHeroPointer}>
        <div className="hero-art" aria-hidden="true">
          <img src={assetUrl("/artworks/school-of-athens.jpg")} alt="" fetchPriority="high" />
        </div>
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-kicker">
          <span>UN CORSO D’ITALIANO</span>
          <span>DIVENTATO UN’AVVENTURA</span>
        </div>

        <div className="hero-copy">
          <p className="hero-overline">Una storia di lingua, arte e amicizia</p>
          <h1>
            <span>DENTRO</span>
            <span className="serif-line">l’Italia.</span>
          </h1>
          <p className="hero-deck">
            一位老师，三位学生。我们本来只是来学一门语言，
            <br />
            却一路走进了意大利。
          </p>
        </div>

        <div className="hero-party" aria-label="四位旅伴">
          {travelers.map((traveler, index) => (
            <div className="hero-person" key={traveler.id} style={{ "--person-index": index } as CSSProperties}>
              <img src={assetUrl(traveler.image)} alt={traveler.titleZh} />
            </div>
          ))}
        </div>

        <button className="enter-button" type="button" onClick={() => scrollToChapter("compagnia")}>
          <span>ENTRA NELLA STORIA</span>
          <span aria-hidden="true">↓</span>
        </button>

        <div className="hero-caption">
          <span>THE SCHOOL OF ATHENS</span>
          <span>RAPHAEL · 1509—1511</span>
        </div>
      </section>

      <section id="compagnia" className="company-section">
        <div className="section-intro">
          <span className="section-number">PROLOGO / 00</span>
          <p>四个角色，一支队伍。</p>
          <h2>
            La nostra piccola
            <br />
            <em>compagnia.</em>
          </h2>
          <p className="section-description">
            老师是词语魔法师。两位女同学分别成为骑士和制图师；男同学带着电脑，在每一幅画里调试语法。
          </p>
        </div>

        <div className="traveler-list">
          {travelers.map((traveler) => (
            <article className="traveler-row" key={traveler.id} style={{ "--traveler-color": traveler.color } as CSSProperties}>
              <span className="traveler-index">{traveler.index}</span>
              <div className="traveler-name">
                <p>{traveler.name}</p>
                <h3>{traveler.title}</h3>
                <span>{traveler.titleZh}</span>
              </div>
              <p className="traveler-line">“{traveler.line}”</p>
              <div className="traveler-portrait" aria-hidden="true">
                <img src={assetUrl(traveler.image)} alt="" />
              </div>
            </article>
          ))}
        </div>

        <button className="begin-journey" type="button" onClick={() => scrollToChapter(chapters[0].id)}>
          <span>开始穿行</span>
          <span>COMINCIA IL VIAGGIO →</span>
        </button>
      </section>

      <section id="viaggio" className="story" aria-label="意大利语学习旅程">
        <aside className="route-rail" aria-label="章节导航">
          <span className="route-title">IL VIAGGIO</span>
          <div className="route-line" aria-hidden="true" />
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              className={activeId === chapter.id ? "is-active" : ""}
              onClick={() => scrollToChapter(chapter.id)}
              aria-label={`前往章节 ${chapter.number}: ${chapter.title}`}
            >
              <i aria-hidden="true" />
              <span>{chapter.number}</span>
            </button>
          ))}
        </aside>

        {chapters.map((chapter) => {
          const isActive = activeId === chapter.id;
          return (
            <article id={chapter.id} className={`story-chapter ${isActive ? "is-active" : ""}`} key={chapter.id}>
              <div className="chapter-sticky">
                <div className="chapter-art" aria-hidden="true">
                  <img
                    src={assetUrl(chapter.image)}
                    alt=""
                    loading={chapter.number === "00" ? "eager" : "lazy"}
                    style={{ objectPosition: chapter.imagePosition ?? "50% 50%" }}
                  />
                </div>
                <div className="chapter-wash" aria-hidden="true" />
                <div className="chapter-border" aria-hidden="true" />

                <div className="chapter-topline">
                  <span>{chapter.number} / 10</span>
                  <span>{chapter.city}</span>
                  <span>{chapter.stage}</span>
                </div>

                <div className="artwork-label">
                  <span>OPERA</span>
                  <strong>{chapter.artwork}</strong>
                  <span>
                    {chapter.artist} · {chapter.date}
                  </span>
                </div>

                <div className="chapter-copy">
                  <p>{chapter.stage}</p>
                  <h2>{chapter.title}</h2>
                  <h3>{chapter.titleZh}</h3>
                  <div className="chapter-narrative">
                    <span aria-hidden="true">✦</span>
                    <p>{chapter.narrative}</p>
                  </div>
                  <button className="lesson-button" type="button" onClick={() => setActiveLesson(chapter)}>
                    <span>打开这一课</span>
                    <span>APRI LA LEZIONE</span>
                    <i aria-hidden="true">+</i>
                  </button>
                </div>

                <div className="scene-cast">
                  {chapter.characters.map((placement) => (
                    <SceneCharacter
                      key={`${chapter.id}-${placement.id}`}
                      placement={placement}
                      active={isActive}
                    />
                  ))}
                </div>

                <div className="chapter-step" aria-hidden="true">
                  <span>{chapter.number}</span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="archive-section" aria-labelledby="archive-title">
        <div className="archive-heading">
          <span>ARCHIVIO / OPERE INCONTRATE</span>
          <h2 id="archive-title">
            Le opere che
            <br />
            ci hanno <em>accompagnato.</em>
          </h2>
          <p>旅程的主线之外，还有更多画作与雕塑在走廊里等待。把鼠标或手指停在作品上，看看它是谁。</p>
        </div>

        <div className="archive-grid">
          {archiveWorks.map((work, index) => (
            <figure className={`archive-work archive-work-${index + 1}`} key={`${work.title}-${index}`}>
              <div className="archive-image">
                <img src={assetUrl(work.image)} alt={`${work.title}, ${work.artist}`} loading="lazy" />
              </div>
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>
                  <strong>{work.title}</strong>
                  <br />
                  {work.artist}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="finale-section">
        <div className="finale-art" aria-hidden="true">
          <img src={assetUrl("/artworks/primavera.jpg")} alt="" loading="lazy" />
        </div>
        <div className="finale-wash" aria-hidden="true" />
        <div className="finale-copy">
          <span>EPILOGO</span>
          <h2>
            Siamo venuti per
            <br />
            imparare <em>l’italiano.</em>
          </h2>
          <p>
            Siamo usciti con un viaggio intero.
            <br />
            我们带走的，是一整段共同旅行。
          </p>
          <button type="button" onClick={() => scrollToChapter("top")}>
            RICOMINCIA IL VIAGGIO ↗
          </button>
        </div>
        <div className="finale-party" aria-hidden="true">
          {travelers.map((traveler, index) => (
            <img
              key={traveler.id}
              src={assetUrl(traveler.image)}
              alt=""
              style={{ "--finale-index": index } as CSSProperties}
            />
          ))}
        </div>
        <p className="finale-line">ARRIVEDERCI, MA NON ADDIO.</p>
      </section>

      <footer className="site-footer">
        <div>
          <span>DENTRO L’ITALIA</span>
          <p>A story of us learning Italian — through art, mistakes, and friendship.</p>
        </div>
        <details>
          <summary>ARTWORK CREDITS / 作品来源</summary>
          <div className="credit-list">
            {credits.map((credit) => (
              <a key={credit.url} href={credit.url} target="_blank" rel="noreferrer">
                {credit.label} ↗
              </a>
            ))}
          </div>
        </details>
        <p>Character illustrations created for this project. Artwork images sourced from Wikimedia Commons.</p>
      </footer>

      {menuOpen && (
        <div className="index-overlay" role="dialog" aria-modal="true" aria-label="章节目录">
          <div className="index-header">
            <span>INDICE DEL VIAGGIO</span>
            <button type="button" onClick={() => setMenuOpen(false)} autoFocus>
              CHIUDI ×
            </button>
          </div>
          <div className="index-list">
            {chapters.map((chapter) => (
              <button type="button" key={chapter.id} onClick={() => scrollToChapter(chapter.id)}>
                <span>{chapter.number}</span>
                <div>
                  <strong>{chapter.title}</strong>
                  <small>{chapter.titleZh}</small>
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

      {activeLesson && (
        <div className="lesson-overlay" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
          <button className="lesson-backdrop" type="button" onClick={() => setActiveLesson(null)} aria-label="关闭课程" />
          <div className="lesson-panel">
            <div className="lesson-panel-header">
              <span>{activeLesson.lesson.eyebrow}</span>
              <button type="button" onClick={() => setActiveLesson(null)} autoFocus>
                CHIUDI ×
              </button>
            </div>
            <div className="lesson-number">LEZIONE {activeLesson.number}</div>
            <h2 id="lesson-title">{activeLesson.lesson.phrase}</h2>
            <p className="lesson-translation">{activeLesson.lesson.translation}</p>
            <p className="lesson-note">{activeLesson.lesson.note}</p>
            <div className="lesson-words">
              {activeLesson.lesson.words.map(([word, meaning]) => (
                <div key={word}>
                  <strong>{word}</strong>
                  <span>{meaning}</span>
                </div>
              ))}
            </div>
            <button className="speak-button" type="button" onClick={() => speakItalian(activeLesson.lesson.phrase)}>
              <span aria-hidden="true">◖))</span>
              ASCOLTA LA FRASE
            </button>
            <div className="lesson-character" aria-hidden="true">
              <img src={assetUrl(travelerMap.teacher.image)} alt="" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
