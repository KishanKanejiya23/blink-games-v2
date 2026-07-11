import { getSupabase } from "./supabase";

export type Game = {
  id: string;
  slug: string;
  title: string;
  category_id: string | null;
  thumb: string | null;
  embed: string;
  description: string | null;
  featured: boolean;
  plays: number;
};

export type Category = { id: string; label: string; sort: number };

/** Fallback so the site renders even before Supabase is wired / seeded. */
const FALLBACK_CATEGORIES: Category[] = [
  { id: "action", label: "Action", sort: 1 },
  { id: "puzzle", label: "Puzzle", sort: 2 },
  { id: "arcade", label: "Arcade", sort: 3 },
  { id: "racing", label: "Racing", sort: 5 },
];

const COLS = "id,slug,title,category_id,thumb,embed,description,featured,plays";

export async function getCategories(): Promise<Category[]> {
  const sb = getSupabase();
  if (!sb) return FALLBACK_CATEGORIES;
  try {
    const { data, error } = await sb
      .from("categories")
      .select("id,label,sort")
      .order("sort", { ascending: true });
    if (error || !data?.length) return FALLBACK_CATEGORIES;
    return data as Category[];
  } catch {
    // DB unreachable (e.g. local stack down) — keep the UI alive
    return FALLBACK_CATEGORIES;
  }
}

export const PAGE_SIZE = 60;

export async function getGames(
  opts: { category?: string; q?: string; limit?: number; offset?: number } = {},
): Promise<Game[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const limit = opts.limit ?? PAGE_SIZE;
    const offset = opts.offset ?? 0;
    let query = sb.from("games").select(COLS);

    if (opts.category && opts.category !== "all") query = query.eq("category_id", opts.category);
    if (opts.q) query = query.ilike("title", `%${opts.q}%`);

    // stable ordering is required for correct pagination (id breaks ties)
    const { data, error } = await query
      .order("featured", { ascending: false })
      .order("plays", { ascending: false })
      .order("id", { ascending: true })
      .range(offset, offset + limit - 1);
    if (error || !data) return [];
    return data as Game[];
  } catch {
    return [];
  }
}

/** Newest games, for the search offcanvas "Recently added" strip. */
export async function getRecentGames(limit = 13): Promise<Game[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("games")
      .select(COLS)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as Game[];
  } catch {
    return [];
  }
}

export type CategoryMeta = Category & { count: number; thumb: string | null };

/**
 * Categories enriched with game count + a sample thumbnail, for the Poko
 * category cards row. One count + one row query per category — cheap and
 * cached by the page's ISR window.
 */
export async function getCategoryMeta(): Promise<CategoryMeta[]> {
  const sb = getSupabase();
  const cats = await getCategories();
  if (!sb) return cats.map((c) => ({ ...c, count: 0, thumb: null }));
  try {
    return await Promise.all(
      cats.map(async (c) => {
        const [{ count }, { data }] = await Promise.all([
          sb.from("games").select("id", { count: "exact", head: true }).eq("category_id", c.id),
          sb.from("games").select("thumb").eq("category_id", c.id).not("thumb", "is", null).limit(1),
        ]);
        return { ...c, count: count ?? 0, thumb: data?.[0]?.thumb ?? null };
      }),
    );
  } catch {
    return cats.map((c) => ({ ...c, count: 0, thumb: null }));
  }
}

export type SitemapGame = { slug: string; created_at: string };

/**
 * Every game's slug + created_at, for the sitemap. Pages through in 1000-row
 * chunks so we get all rows past Supabase's default cap. Returns what it has on
 * error so a DB hiccup degrades the sitemap gracefully instead of 500-ing.
 */
export async function getAllGamesForSitemap(): Promise<SitemapGame[]> {
  const sb = getSupabase();
  if (!sb) return [];
  const all: SitemapGame[] = [];
  const CHUNK = 1000;
  try {
    for (let from = 0; ; from += CHUNK) {
      const { data, error } = await sb
        .from("games")
        .select("slug,created_at")
        .order("id", { ascending: true })
        .range(from, from + CHUNK - 1);
      if (error || !data?.length) break;
      all.push(...(data as SitemapGame[]));
      if (data.length < CHUNK) break;
    }
  } catch {
    // return whatever we collected so far
  }
  return all;
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb.from("games").select(COLS).eq("slug", slug).maybeSingle();
    if (error) return null;
    return (data as Game) ?? null;
  } catch {
    return null;
  }
}

export async function getRelated(game: Game, limit = 10): Promise<Game[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("games")
      .select(COLS)
      .neq("slug", game.slug)
      .eq("category_id", game.category_id ?? "")
      .limit(limit);
    return (data as Game[]) ?? [];
  } catch {
    return [];
  }
}
