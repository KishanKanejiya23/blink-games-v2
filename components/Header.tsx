import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="logo" href="/">
          <span className="logo-mark">⚡</span> Blink<em>Games</em>
        </Link>
        {/* useSearchParams must be inside Suspense so static pages (404) can prerender */}
        <Suspense fallback={<div className="search" />}>
          <SearchBar />
        </Suspense>
      </div>
    </header>
  );
}
