export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/developers">Developers</a>
          <a href="/privacy">Privacy</a>
          <a href="/contact">Contact</a>
        </div>
        © {new Date().getFullYear()} BlinkGames.fun — All games are property of their respective owners.
      </div>
    </footer>
  );
}
