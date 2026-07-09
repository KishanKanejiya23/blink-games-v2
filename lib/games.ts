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
