import { PokoNavbar } from "./PokoNavbar";

/**
 * Standalone Poko nav card for pages without a tile grid (about, privacy, …).
 * Grid pages render the navbar as a tile and hide this via CSS
 * (body:has(.poko-grid-page) .site-header).
 */
export function Header() {
  return (
    <header className="site-header">
      <PokoNavbar />
    </header>
  );
}
