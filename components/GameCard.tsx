import Link from "next/link";
import type { Game } from "@/lib/games";

function fallbackThumb(title: string) {
  const initials = title.slice(0, 2).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><rect width='100%' height='100%' fill='#1c2033'/><text x='50%' y='50%' fill='#6c4cff' font-size='72' font-family='sans-serif' font-weight='800' text-anchor='middle' dominant-baseline='central'>${initials}</text></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

export function GameCard({ game, priority = false }: { game: Game; priority?: boolean }) {
  return (
    <Link className="card" href={`/game/${game.slug}`}>
      {game.category_id && <span className="cat-tag">{game.category_id}</span>}
      {/* Plain <img> (not next/image): thumbs come from many external CDNs and
          we want zero-config + graceful fallback. width/height reserve space
          so the grid doesn't shift while thumbs load (CLS). */}
      <img
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        width={240}
        height={240}
        alt={`Play ${game.title} online free`}
        src={game.thumb || fallbackThumb(game.title)}
      />
      <span className="label">{game.title}</span>
    </Link>
  );
}
