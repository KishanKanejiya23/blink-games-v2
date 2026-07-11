"use client";

import { useRef } from "react";

/**
 * Poko gameplay tile: white card spanning 8x6 in the dense grid, iframe on
 * top, control bar below with the game name and a fullscreen toggle.
 */
export function GameplayFrame({ title, embed }: { title: string; embed: string }) {
  const box = useRef<HTMLDivElement>(null);

  function toggleFullscreen() {
    const el = box.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      el.classList.remove("full");
    } else {
      el.requestFullscreen?.().catch(() => {});
      el.classList.add("full");
    }
  }

  return (
    <div className="gameplay-container" ref={box}>
      <iframe
        src={embed}
        title={title}
        allow="autoplay; fullscreen; gamepad; microphone"
        allowFullScreen
        scrolling="no"
      />
      <div className="game-details">
        <span className="poko-logo" style={{ fontSize: 18 }}>
          Blink<span className="o">⚡</span>
        </span>
        <span className="game-title">{title}</span>
        <div className="icon-group">
          <button aria-label="Fullscreen" onClick={toggleFullscreen}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3H5C3.89543 3 3 3.89543 3 5V9M15 3H19C20.1046 3 21 3.89543 21 5V9M9 21H5C3.89543 21 3 20.1046 3 19V15M15 21H19C20.1046 21 21 20.1046 21 19V15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <label>Full</label>
        </div>
      </div>
    </div>
  );
}
