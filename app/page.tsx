import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getGames } from "@/lib/games";
import {
  buildMetadata,
  websiteJsonLd,
  organizationJsonLd,
  faqJsonLd,
  jsonLdScript,
  HOME_FAQ,
} from "@/lib/seo";
import { CategoryChips } from "@/components/CategoryChips";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { AdSlot } from "@/components/AdSlot";
import { Faq } from "@/components/Faq";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return buildMetadata({
    title: "BlinkGames — Play Free Online Games. Always On.",
    description:
      "Play hundreds of free online games at BlinkGames — puzzle, arcade, action, racing, sports and .io games. No downloads, no sign-up. Instant play on mobile and desktop.",
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
    getCategories(),
    getGames({ category: cat, q }),
  ]);

  const title = q
    ? `Results for "${q}"`
    : cat === "all"
      ? "All Games"
      : categories.find((c) => c.id === cat)?.label ?? "Games";

  return (
    <div className="blink-home">
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

      <header className="blink-hero" role="banner">
        <div className="blink-hero-inner">
          <span className="blink-brand">
            <span className="blink-brand-mark">⚡</span> BlinkGames
          </span>
          <h1 className="blink-hero-title">Free Unblocked Games For School</h1>
          <p className="blink-hero-subtitle">
            Hundreds of free browser games. Fast. Clean. No downloads.
          </p>
          <div className="blink-hero-ctas">
            <a className="blink-btn-primary" href="#games">
              Play now!
            </a>
            <Link className="blink-btn-tertiary" href="/about">
              About
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <AdSlot variant="leaderboard" />

        <div id="games" className="blink-sorter">
          <CategoryChips categories={categories} active={cat} />
        </div>

        <h2 className="section-title">{title}</h2>

        {games.length === 0 ? (
          <div className="notice">
            No games yet. Add your Supabase keys to <code>.env.local</code> and run{" "}
            <code>npm run import:games</code> to pull a licensed game feed into the database.
          </div>
        ) : (
          <InfiniteGrid initial={games} category={cat} q={q} />
        )}

        <AdSlot variant="rectangle" />

        <section className="blink-features" aria-label="Why BlinkGames">
          <div className="blink-feature">
            <span className="blink-feature-icon">⚡</span>
            <h3>Instant Play</h3>
            <p>
              Lightweight pages and instant search — games load in seconds with
              no download, so they work on your school computer or phone.
            </p>
          </div>
          <div className="blink-feature">
            <span className="blink-feature-icon">🆓</span>
            <h3>Always Free</h3>
            <p>
              Every game is free forever. No account, no payment, no catch —
              just click and play, on any device.
            </p>
          </div>
          <div className="blink-feature">
            <span className="blink-feature-icon">🎮</span>
            <h3>Best Game Selection</h3>
            <p>
              Hand-picked hits across action, puzzle, sports, racing and .io —
              curated for performance and updated regularly.
            </p>
          </div>
        </section>

        <section className="blink-seo-copy" aria-label="About BlinkGames">
          <h2>Play Free Unblocked Games at School and Home</h2>
          <p>
            BlinkGames is your hub for free{" "}
            <strong>unblocked games</strong>: action, puzzle, sports,
            platformers, racing and more. Every game plays instantly in your
            browser with nothing to install and no account needed, so it works
            just as well on a school computer as it does on your phone at home.
            Browse by category to find your next favourite:
          </p>
          <p className="blink-cat-links">
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
