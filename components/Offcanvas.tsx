"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Category, Game } from "@/lib/games";
import { PokoTile } from "./PokoTile";

/**
 * Poko's slide-in search panel: teal drawer with live search, category pills
 * and recently added games. Opened by the navbar search button (adds .active).
 */
export function Offcanvas({
  categories,
  recent,
}: {
  categories: Category[];
  recent: Game[];
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Game[] | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/games?q=${encodeURIComponent(q.trim())}`);
        const data = (await res.json()) as { games: Game[] };
        setResults(data.games.slice(0, 24));
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(debounce.current);
  }, [q]);

  function close() {
    panel.current?.closest(".offcanvas")?.classList.remove("active");
  }

  return (
    <div
      className="offcanvas"
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest(".offcanvas-menu")) close();
      }}
    >
      <div className="offcanvas-menu" ref={panel}>
        <form className="live-search" onSubmit={(e) => e.preventDefault()}>
          <button type="button" className="mini-logo" onClick={close} aria-label="Close search">
            ‹ Blink⚡
          </button>
          <input
            type="text"
            placeholder="What are you playing today?"
            aria-label="Search games"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="button"
            aria-label={q ? "Clear search" : "Search"}
            onClick={() => setQ("")}
            disabled={!q}
          >
            {q ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 17L21 21" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>

        {results !== null ? (
          results.length === 0 ? (
            <div className="search-error">
              <h5>Hmm, nothing’s coming up for that.</h5>
              <p>Try searching for something else or play one of these great games.</p>
            </div>
          ) : (
            <div className="m-grid-start" onClick={close}>
              {results.map((g) => (
                <PokoTile key={g.id} game={g} size="" />
              ))}
            </div>
          )
        ) : (
          <>
            <div className="cat-pills" onClick={close}>
              {categories.map((c) => (
                <Link key={c.id} href={`/category/${c.id}`}>
                  {c.label}
                </Link>
              ))}
            </div>
            <h3>Recently added games</h3>
            <div className="m-grid-start" onClick={close}>
              {recent.map((g) => (
                <PokoTile key={g.id} game={g} size="" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
