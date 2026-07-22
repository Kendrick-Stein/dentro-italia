"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useState } from "react";
import {
  chapters,
  credits,
  travelers,
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

  const activeChapter = journeyChapters.find((chapter) => chapter.id === activeId) ?? journeyChapters[0];
  const activeIndex = journeyChapters.findIndex((chapter) => chapter.id === activeChapter.id);

  useEffect(() => {
    let animationFrame = 0;

    const updateScrollScene = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        const scrollable = document.documentElement.scrollHeight - viewportHeight;
        setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);

        const intro = document.querySelector<HTMLElement>(".journey-opening");
        if (intro) {
          const rect = intro.getBoundingClientRect();
          const travel = Math.max(1, intro.offsetHeight - viewportHeight);
          const rawProgress = Math.max(0, Math.min(1, -rect.top / travel));
          const transition = Math.max(0, Math.min(1, (rawProgress - 0.38) / 0.5));
          const eased = transition * transition * (3 - 2 * transition);
          const titleExit = Math.max(0, Math.min(1, (rawProgress - 0.12) / 0.38));
          const partyEntry = Math.max(0, Math.min(1, rawProgress / 0.16));
          const partyExit = Math.max(0, Math.min(1, (rawProgress - 0.78) / 0.16));

          intro.style.setProperty("--opening-current-x", `${eased * -9}%`);
          intro.style.setProperty("--opening-current-opacity", (1 - eased * 0.72).toFixed(3));
          intro.style.setProperty("--opening-next-clip", `${100 - eased * 100}%`);
          intro.style.setProperty("--opening-next-x", `${(1 - eased) * 9}%`);
          intro.style.setProperty("--opening-title-opacity", (1 - titleExit).toFixed(3));
          intro.style.setProperty("--opening-title-y", `${titleExit * -42}px`);
          intro.style.setProperty("--opening-party-x", `${-9 + eased * 76}vw`);
          intro.style.setProperty("--opening-party-opacity", (partyEntry * (1 - partyExit)).toFixed(3));
          intro.style.setProperty("--opening-cue-opacity", Math.max(0, 1 - rawProgress * 2.6).toFixed(3));
        }

        document.querySelectorAll<HTMLElement>(".story-chapter").forEach((chapter) => {
          const rect = chapter.getBoundingClientRect();
          const sceneProgress = Math.max(
            0,
            Math.min(1, (viewportHeight - rect.top) / (rect.height + viewportHeight)),
          );
          const hasNext = chapter.dataset.hasNext === "true";
          const exitProgress = hasNext
            ? Math.max(0, Math.min(1, (sceneProgress - 0.67) / 0.28))
            : 0;
          const easedExit = exitProgress * exitProgress * (3 - 2 * exitProgress);
          const passageOpacity = Math.min(1, exitProgress * 5) * Math.min(1, (1 - exitProgress) * 5);

          chapter.style.setProperty("--scene-progress", sceneProgress.toFixed(3));
          chapter.style.setProperty("--scene-zoom", (1.018 + sceneProgress * 0.055).toFixed(3));
          chapter.style.setProperty("--scene-shift-y", `${(sceneProgress - 0.5) * -2.2}%`);
          chapter.style.setProperty("--party-drift", `${(sceneProgress - 0.5) * 22}px`);
          chapter.style.setProperty("--current-x", `${easedExit * -8}%`);
          chapter.style.setProperty("--next-clip", `${100 - easedExit * 100}%`);
          chapter.style.setProperty("--next-x", `${(1 - easedExit) * 8}%`);
          chapter.style.setProperty("--content-opacity", Math.max(0, 1 - exitProgress * 1.5).toFixed(3));
          chapter.style.setProperty("--passage-opacity", passageOpacity.toFixed(3));
          chapter.style.setProperty("--passage-x", `${-18 + easedExit * 128}vw`);
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const moveLight = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty("--scene-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--scene-y", `${y.toFixed(2)}%`);
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
          <span>SCENA {String(activeIndex + 1).padStart(2, "0")} / {String(journeyChapters.length).padStart(2, "0")}</span>
        </div>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Apri la mappa">
          <span>MAPPA</span>
          <span className="menu-icon" aria-hidden="true"><i /><i /></span>
        </button>
        <div className="progress-track" aria-hidden="true">
          <div className="progress-value" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </header>

      <section id="top" className="journey-opening">
        <div className="opening-sticky">
          <div className="opening-art" aria-hidden="true">
            <img src={assetUrl("/artworks/school-of-athens.jpg")} alt="" fetchPriority="high" />
          </div>
          <div className="opening-next-art" aria-hidden="true">
            <img
              src={assetUrl(journeyChapters[0].image)}
              alt=""
              style={{ objectPosition: journeyChapters[0].imagePosition ?? "50% 50%" }}
            />
          </div>
          <div className="opening-shade" aria-hidden="true" />
          <div className="opening-copy">
            <span>UNA STORIA DI LINGUA, ARTE E AMICIZIA</span>
            <h1><strong>DENTRO</strong><em>L’ITALIA</em></h1>
          </div>
          <div className="opening-party" aria-label="Il maestro e tre studenti">
            {travelers.map((traveler, index) => (
              <img
                key={traveler.id}
                src={assetUrl(posePath(traveler.id, "walk"))}
                alt={traveler.title}
                style={{ "--opening-person": index } as CSSProperties}
              />
            ))}
          </div>
          <div className="opening-cue" aria-hidden="true"><span>SCORRI PER ENTRARE</span><i /></div>
        </div>
      </section>

      <section id="viaggio" className="story immersive-story" aria-label="Viaggio interattivo in italiano">
        {journeyChapters.map((chapter, chapterIndex) => {
          const isActive = activeId === chapter.id;
          const nextChapter = journeyChapters[chapterIndex + 1];
          const chapterStyle = {
            "--chapter-saturation": (0.24 + chapterIndex * 0.11).toFixed(2),
            "--reveal-saturation": (0.82 + chapterIndex * 0.065).toFixed(2),
            "--chapter-sepia": Math.max(0.08, 0.48 - chapterIndex * 0.06).toFixed(2),
            "--reveal-sepia": Math.max(0.02, 0.14 - chapterIndex * 0.018).toFixed(2),
          } as CSSProperties;

          return (
            <article
              id={chapter.id}
              className={`story-chapter ${isActive ? "is-active" : ""}`}
              key={chapter.id}
              style={chapterStyle}
              data-has-next={Boolean(nextChapter)}
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
                {nextChapter && (
                  <div
                    className={`chapter-next-art ${chapterIndex % 2 === 0 ? "next-left" : "next-right"}`}
                    aria-hidden="true"
                  >
                    <img
                      src={assetUrl(nextChapter.image)}
                      alt=""
                      loading="lazy"
                      style={{ objectPosition: nextChapter.imagePosition ?? "50% 50%" }}
                    />
                  </div>
                )}
                <div className="chapter-wash" aria-hidden="true" />
                <div className="chapter-light" aria-hidden="true" />

                <div className="chapter-topline">
                  <span>{String(chapterIndex + 1).padStart(2, "0")} / {String(journeyChapters.length).padStart(2, "0")}</span>
                  <span>{chapter.city}</span>
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

                {nextChapter && (
                  <div className="scene-passage" aria-hidden="true">
                    <div className="passage-route">
                      <span>{chapter.city}</span><i>→</i><span>{nextChapter.city}</span>
                    </div>
                    <div className="passage-party">
                      {chapter.characters.map((placement, index) => (
                        <img
                          key={`${chapter.id}-passage-${placement.id}`}
                          src={assetUrl(posePath(placement.id, "walk"))}
                          alt=""
                          style={{ "--passage-person": index } as CSSProperties}
                        />
                      ))}
                    </div>
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
          <span>IL VIAGGIO CONTINUA</span>
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
