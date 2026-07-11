import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminAuth";

/**
 * 1. Legacy /?cat= filter URLs → real category pages (301) so link equity
 *    consolidates on one indexable URL per category.
 * 2. /admin and /api/admin are gated by the signed admin session cookie
 *    (login endpoints excepted).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
    if (!isLogin) {
      const ok = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
      if (!ok) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
    return NextResponse.next();
  }

  const cat = req.nextUrl.searchParams.get("cat");
  if (cat && cat !== "all" && !req.nextUrl.searchParams.get("q")) {
    return NextResponse.redirect(new URL(`/category/${cat}`, req.url), 301);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/admin/:path*", "/api/admin/:path*"] };
