import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getGames } from "@/lib/games";
import {
  buildMetadata,
  websiteJsonLd,
  organizationJsonLd,
  jsonLdScript,
} from "@/lib/seo";
import { CategoryChips } from "@/components/CategoryChips";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { AdSlot } from "@/components/AdSlot";

// Reading searchParams (?q= search, legacy ?cat=) opts this page into dynamic
// rendering automatically; no force-dynamic needed.

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
    // Search result pages are thin duplicates — keep them out of the index.
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
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([websiteJsonLd(), organizationJsonLd()]),
        }}
      />

      <section className="hero">
        <h1>
          Play Free Online Games. <em>No Downloads.</em> Always On.
        </h1>
        <p>
          Hundreds of free games that play instantly in your browser — puzzle,
          action, racing, sports, arcade and .io games. No downloads, no
          sign-ups, no waiting. Works on your phone, tablet, laptop or school
          computer.
        </p>
      </section>

      <AdSlot variant="leaderboard" />

      <CategoryChips categories={categories} active={cat} />

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

      <section className="hero">
        <h2 className="section-title">Why play at BlinkGames?</h2>
        <p>
          BlinkGames is your free game zone — a hand-picked collection of
          browser games you can play anywhere, any time. Every game loads in
          seconds with nothing to install and no account needed. Whether you
          want a quick puzzle on a break, a multiplayer .io battle, or a racing
          game after school, there&apos;s always something new to play. Browse
          by category to find your next favourite:
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
    </main>
  );
}
