import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// Middleware already gates /api/admin/*, these routes only run authenticated.

export const dynamic = "force-dynamic";

const PAGE = 20;
const COLS = "id,slug,title,category_id,thumb,embed,description,featured,plays,source,created_at";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

// GET /api/admin/games?q=&cat=&page=1 — paged list + total for the table
export async function GET(req: NextRequest) {
  const sb = getSupabaseAdmin();
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim();
  const cat = searchParams.get("cat");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  let query = sb.from("games").select(COLS, { count: "exact" });
  if (q) query = query.ilike("title", `%${q}%`);
  if (cat) query = query.eq("category_id", cat);
  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .range((page - 1) * PAGE, page * PAGE - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ games: data, total: count ?? 0, page, pageSize: PAGE });
}

// POST /api/admin/games — add a game
export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin();
  const body = await req.json().catch(() => null);
  if (!body?.title || !/^https?:\/\//.test(body?.embed ?? "")) {
    return NextResponse.json({ error: "Title and a valid embed URL are required" }, { status: 400 });
  }

  let slug = slugify(body.title);
  // suffix on collision, same policy as the importers
  for (let k = 2; ; k++) {
    const { data } = await sb.from("games").select("id").eq("slug", slug).maybeSingle();
    if (!data) break;
    slug = `${slugify(body.title)}-${k}`;
  }

  const { data, error } = await sb
    .from("games")
    .insert({
      slug,
      title: body.title,
      embed: body.embed,
      thumb: body.thumb || null,
      category_id: body.category_id || null,
      description: body.description || null,
      featured: Boolean(body.featured),
      source: "manual",
    })
    .select(COLS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ game: data });
}
