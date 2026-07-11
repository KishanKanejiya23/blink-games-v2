import Link from "next/link";
import type { Game } from "@/lib/games";

/**
 * Deterministic Poko tile size: featured games get the big 3x3 "lg" tile with
 * the shine sweep; roughly one in six gets the 2x2 "md" tile; the rest are 1x1.
 * Hash off the slug so sizes are stable across pagination and renders.
 */
export function tileSize(game: Game): "" | "md" | "lg" {
  if (game.featured) return "lg";
  let h = 0;
  for (let i = 0; i < game.slug.length; i++) h = (h * 31 + game.slug.charCodeAt(i)) | 0;
  return Math.abs(h) % 6 === 0 ? "md" : "";
}

export function PokoTile({ game, size }: { game: Game; size?: "" | "md" | "lg" }) {
  const cls = size ?? tileSize(game);
  return (
    <div className={"m-game-card" + (cls ? ` ${cls}` : "")}>
      <Link className="m-game-link" href={`/game/${game.slug}`} title={`Play ${game.title} online free`}>
        <picture style={game.thumb ? { backgroundImage: `url('${game.thumb}')` } : undefined}>
          <div className="m-game-details">
            <p>{game.title}</p>
          </div>
        </picture>
      </Link>
    </div>
  );
}
