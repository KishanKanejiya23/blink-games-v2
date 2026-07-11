import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// Middleware already gates /api/admin/*, these routes only run authenticated.

export const dynamic = "force-dynamic";

// GET - categories with game counts
export async function GET() {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb.from("categories").select("id,label,sort").order("sort");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const withCounts = await Promise.all(
    (data ?? []).map(async (c) => {
      const { count } = await sb
        .from("games")
        .select("id", { count: "exact", head: true })
        .eq("category_id", c.id);
      return { ...c, count: count ?? 0 };
    }),
  );
  return NextResponse.json({ categories: withCounts });
}

// POST - add category { id?, label }
export async function POST(req: NextRequest) {
  const sb = getSupabaseAdmin();
  const body = await req.json().catch(() => null);
  if (!body?.label) return NextResponse.json({ error: "Label required" }, { status: 400 });
  const id: string =
    body.id?.trim() || body.label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  const { data: max } = await sb
    .from("categories")
    .select("sort")
    .order("sort", { ascending: false })
    .limit(1);
  const { error } = await sb
    .from("categories")
    .insert({ id, label: body.label, sort: (max?.[0]?.sort ?? 0) + 1 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id });
}

// DELETE ?id= - remove a category (games keep existing via ON DELETE SET NULL)
export async function DELETE(req: NextRequest) {
  const sb = getSupabaseAdmin();
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const { error } = await sb.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
