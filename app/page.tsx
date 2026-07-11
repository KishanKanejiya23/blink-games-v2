import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryMeta, getGames } from "@/lib/games";
import {
  buildMetadata,
  websiteJsonLd,
  organizationJsonLd,
  faqJsonLd,
  jsonLdScript,
  HOME_FAQ,
} from "@/lib/seo";
import { PokoGrid } from "@/components/PokoGrid";
import { AdSlot } from "@/components/AdSlot";
import { Faq } from "@/components/Faq";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return buildMetadata({
    title: "BlinkGames - Play Free Online Games. Always On.",
    description:
      "Play thousands of free online games at BlinkGames - puzzle, arcade, action, racing, sports and .io games. No downloads, no sign-up. Instant play on mobile and desktop.",
    path: "/",
    noindex: Boolean(q),
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { cat = "all", q } = await searchParams;
  const [categories, games] = await Promise.all([
    getCategoryMeta(),
    getGames({ category: cat, q }),
  ]);

  return (
    <div className="poko-grid-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            websiteJsonLd(),
            organizationJsonLd(),
            faqJsonLd(HOME_FAQ),
          ]),
        }}
      />

      <main className="container">
        <h1 className="sr-only" style={{ position: "absolute", left: -9999 }}>
          BlinkGames - Free Online Games
        </h1>

        {games.length === 0 ? (
          <div className="notice">
            No games yet. Add your Supabase keys to <code>.env.local</code> and run{" "}
            <code>npm run import:poko</code> to load the game catalog.
          </div>
        ) : (
          <PokoGrid initial={games} category={cat} q={q} />
        )}

        <div className="m-category-grid">
          {categories.map((c) => (
            <Link key={c.id} href={`/category/${c.id}`}>
              <div className="m-category-card">
                {c.thumb && <img src={c.thumb} alt={`${c.label} games`} loading="lazy" />}
                <div className="text">
                  <strong>{c.label}</strong>
                  <p>{c.count.toLocaleString()} Games</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <AdSlot variant="leaderboard" />

        <section className="poko-card" aria-label="About BlinkGames">
          <span className="kicker">About BlinkGames</span>
          <h2>Play Free Online Games at School and Home</h2>
          <p>
            BlinkGames is your hub for free <strong>unblocked games</strong>: action, puzzle,
            sports, platformers, racing and more. Every game plays instantly in your browser
            with nothing to install and no account needed, so it works just as well on a school
            computer as it does on your phone at home. Browse by category to find your next
            favourite:
          </p>
          <p>
            {categories.map((c, i) => (
              <span key={c.id}>
                {i > 0 && " · "}
                <Link href={`/category/${c.id}`}>Free {c.label} Games</Link>
              </span>
            ))}
          </p>
        </section>

        <Faq items={HOME_FAQ} />
      </main>
    </div>
  );
}
