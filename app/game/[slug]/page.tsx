import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getGameBySlug, getRelated } from "@/lib/games";
import {
  buildMetadata,
  videoGameJsonLd,
  breadcrumbJsonLd,
  jsonLdScript,
} from "@/lib/seo";
import { GameCard } from "@/components/GameCard";
import { AdSlot } from "@/components/AdSlot";

// ISR: game rows barely change after import; serving cached HTML is a big
// TTFB / Core Web Vitals win over hitting Supabase per request.
export const revalidate = 3600;

/** Feed descriptions are often missing or one-liners; pad with a keyword-rich default. */
function gameDescription(title: string, description: string | null) {
  if (description && description.length >= 80) return description;
  const base = `Play ${title} online free at BlinkGames — no download, no sign-up. Works instantly in your browser on mobile, tablet and desktop.`;
  return description ? `${description} ${base}` : base;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game not found" };
  return buildMetadata({
    title: `${game.title} — Play Online Free`,
    description: gameDescription(game.title, game.description),
    path: `/game/${game.slug}`,
    image: game.thumb,
  });
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const [related, categories] = await Promise.all([
    getRelated(game, 12),
    getCategories(),
  ]);
  const category = categories.find((c) => c.id === game.category_id);

  const jsonLd = [
    videoGameJsonLd(game, category?.label),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      ...(category
        ? [{ name: category.label, path: `/category/${category.id}` }]
        : []),
      { name: game.title, path: `/game/${game.slug}` },
    ]),
  ];

  return (
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {category && (
          <>
            {" "}
            <span aria-hidden>›</span>{" "}
            <Link href={`/category/${category.id}`}>{category.label}</Link>
          </>
        )}{" "}
        <span aria-hidden>›</span> <span>{game.title}</span>
      </nav>

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
            {category && (
              <p>
                <Link className="chip" href={`/category/${category.id}`}>
                  {category.label} Games
                </Link>
              </p>
            )}
            <h2 className="section-title">About this game</h2>
            <p>{gameDescription(game.title, game.description)}</p>

            <h2 className="section-title">How to play {game.title}</h2>
            <p>
              {game.title} plays right in your browser — nothing to download or
              install. On desktop, use your mouse and keyboard (arrow keys or
              WASD in most games). On mobile or tablet, use the on-screen touch
              controls. Tap the fullscreen button for the best experience
              {category
                ? `, and check out more free ${category.label.toLowerCase()} games below when you're done.`
                : "."}
            </p>
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
              {category && (
                <p>
                  <Link className="back-link" href={`/category/${category.id}`}>
                    See all {category.label} games →
                  </Link>
                </p>
              )}
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
