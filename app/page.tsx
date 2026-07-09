import { getCategories, getGames } from "@/lib/games";
import { CategoryChips } from "@/components/CategoryChips";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { AdSlot } from "@/components/AdSlot";

export const dynamic = "force-dynamic"; // always reflect the latest Supabase data

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
      <section className="hero">
        <h1>
          Your <em>Game Zone</em>. Always On.
        </h1>
        <p>Hundreds of free games. No downloads. Instant play on any device.</p>
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
    </main>
  );
}
