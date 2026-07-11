"use client";

import Link from "next/link";

/** White rounded nav card from the Poko theme: logo + home + search trigger. */
export function PokoNavbar({ tile = false }: { tile?: boolean }) {
  const nav = (
    <nav className="poko-navbar" aria-label="Main">
      <Link className="poko-logo" href="/" aria-label="BlinkGames home">
        Blink<span className="o">⚡</span>
      </Link>
      <div className="poko-nav-actions">
        <Link aria-label="Home" href="/">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 21H7C4.79086 21 3 19.2091 3 17V10.7076C3 9.30887 3.73061 8.01175 4.92679 7.28679L9.92679 4.25649C11.2011 3.48421 12.7989 3.48421 14.0732 4.25649L19.0732 7.28679C20.2694 8.01175 21 9.30887 21 10.7076V17C21 19.2091 19.2091 21 17 21H15M9 21V17C9 15.3431 10.3431 14 12 14V14C13.6569 14 15 15.3431 15 17V21M9 21H15"
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"
            />
          </svg>
        </Link>
        <button
          aria-label="Search games"
          onClick={() => document.querySelector(".offcanvas")?.classList.add("active")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 17L21 21" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
            <path
              d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"
            />
          </svg>
        </button>
      </div>
    </nav>
  );

  return tile ? <div className="nav-tile">{nav}</div> : nav;
}
