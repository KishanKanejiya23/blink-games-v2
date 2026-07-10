"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Game } from "@/lib/games";
import { GameCard } from "./GameCard";

const PAGE_SIZE = 60;

export function InfiniteGrid({
  initial,
  category,
  q,
}: {
  initial: Game[];
  category: string;
  q?: string;
}) {
  const [games, setGames] = useState<Game[]>(initial);
  const [offset, setOffset] = useState(initial.length);
  const [done, setDone] = useState(initial.length < PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set(initial.map((g) => g.id)));

  // Reset when the filter (category/search) changes
  useEffect(() => {
    setGames(initial);
    setOffset(initial.length);
    setDone(initial.length < PAGE_SIZE);
    seen.current = new Set(initial.map((g) => g.id));
  }, [initial, category, q]);

  const loadMore = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ cat: category, offset: String(offset) });
      if (q) params.set("q", q);
      const res = await fetch(`/api/games?${params.toString()}`);
      const data = (await res.json()) as { games: Game[]; nextOffset: number; done: boolean };
      const fresh = data.games.filter((g) => !seen.current.has(g.id));
      fresh.forEach((g) => seen.current.add(g.id));
      setGames((prev) => [...prev, ...fresh]);
      setOffset(data.nextOffset);
      setDone(data.done);
    } catch {
      // keep the button/sentinel; user can scroll again to retry
    } finally {
      setLoading(false);
    }
  }, [loading, done, category, q, offset]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || done) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "600px" }, // start loading before it's visible
    );
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore, done]);

  return (
    <>
      <div className="grid">
        {games.map((g, i) => (
          // First rows are above the fold — load those thumbs eagerly (LCP).
          <GameCard key={g.id} game={g} priority={i < 8} />
        ))}
      </div>
      {!done && <div ref={sentinel} className="empty">{loading ? "Loading more games…" : "Scroll for more"}</div>}
      {done && games.length > 0 && <div className="empty">You&apos;ve reached the end — {games.length} games.</div>}
    </>
  );
}
