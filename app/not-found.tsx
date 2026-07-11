import Link from "next/link";
import { getGames } from "@/lib/games";
import { GameCard } from "@/components/GameCard";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  // Show popular games so lost visitors (and crawlers) have somewhere to go.
  const popular = await getGames({ limit: 12 });

  return (
    <main className="container">
      <section className="hero">
        <h1>
          Oops - that page is <em>missing</em>.
        </h1>
        <p>
          The game or page you&apos;re looking for doesn&apos;t exist or has
          been removed. But don&apos;t leave empty-handed - try one of these:
        </p>
        <p>
          <Link className="chip" href="/">
            ← Back to all games
          </Link>
        </p>
      </section>

      {popular.length > 0 && (
        <>
          <h2 className="section-title">Popular right now</h2>
          <div className="grid">
            {popular.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
