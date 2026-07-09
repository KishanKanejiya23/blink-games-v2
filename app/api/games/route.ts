import { NextRequest, NextResponse } from "next/server";
import { getGames, PAGE_SIZE } from "@/lib/games";

export const dynamic = "force-dynamic";

// GET /api/games?cat=puzzle&q=car&offset=60  -> next page of games as JSON
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("cat") ?? "all";
  const q = searchParams.get("q") ?? undefined;
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10) || 0);

  const games = await getGames({ category, q, offset, limit: PAGE_SIZE });
  return NextResponse.json({ games, nextOffset: offset + games.length, done: games.length < PAGE_SIZE });
}
