import { NextRequest, NextResponse } from "next/server";

/**
 * Legacy /?cat= filter URLs → real category pages (301, clean URL) so link
 * equity consolidates on one indexable URL per category. Search (?q=) and
 * ?cat=all keep rendering the homepage.
 */
export function middleware(req: NextRequest) {
  const cat = req.nextUrl.searchParams.get("cat");
  if (cat && cat !== "all" && !req.nextUrl.searchParams.get("q")) {
    return NextResponse.redirect(new URL(`/category/${cat}`, req.url), 301);
  }
  return NextResponse.next();
}

export const config = { matcher: "/" };
