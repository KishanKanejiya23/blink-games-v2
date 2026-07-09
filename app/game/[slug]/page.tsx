import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameBySlug, getRelated } from "@/lib/games";
import { GameCard } from "@/components/GameCard";
import { AdSlot } from "@/components/AdSlot";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game not found — BlinkGames" };
  return {
    title: `${game.title} — BlinkGames`,
    description: game.description ?? `Play ${game.title} free online at BlinkGames.`,
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const related = await getRelated(game);

  return (
    <main className="container">
      <AdSlot variant="leaderboard" />

      <div className="player-layout">
        <div>
          <div className="player-frame">
            <iframe
              src={game.embed}
              title={game.title}
              allow="autoplay; fullscreen; gamepad; microphone"
              allowFullScreen
              scrolling="no"
            />
          </div>

          <div className="game-meta">
            <h1>{game.title}</h1>
            {game.description && <p>{game.description}</p>}
          </div>

          <Link className="back-link" href="/">
            ← Back to all games
          </Link>

          <AdSlot variant="rectangle" />

          {related.length > 0 && (
            <>
              <h2 className="section-title">More games you&apos;ll like</h2>
              <div className="grid">
                {related.map((g) => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            </>
          )}
        </div>

        <aside>
          <AdSlot variant="sidebar" />
        </aside>
      </div>
    </main>
  );
}
