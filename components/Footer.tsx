import Link from "next/link";

// Static category links for site-wide internal linking (matches seeded categories).
const CATEGORY_LINKS = [
  { id: "action", label: "Action Games" },
  { id: "puzzle", label: "Puzzle Games" },
  { id: "arcade", label: "Arcade Games" },
  { id: "sports", label: "Sports Games" },
  { id: "racing", label: "Racing Games" },
  { id: "adventure", label: "Adventure Games" },
  { id: "io", label: ".io Games" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="poko-logo">
            Blink<span className="o">⚡</span>
          </span>
          <h3>Let the world play</h3>
        </div>
        <div className="links">
          {CATEGORY_LINKS.map((c) => (
            <Link key={c.id} href={`/category/${c.id}`}>
              {c.label}
            </Link>
          ))}
          <Link href="/about">About</Link>
          <Link href="/developers">Developers</Link>
          <Link href="/advertise">Advertise</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} BlinkGames.fun — All games are property of their respective owners.
        </div>
      </div>
    </footer>
  );
}
