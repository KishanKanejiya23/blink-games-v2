import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "For Game Developers",
  description:
    "Get your HTML5 game on BlinkGames. We publish games from licensed distribution feeds - here's how to submit yours and reach new players.",
  path: "/developers",
});

export default function DevelopersPage() {
  return (
    <main className="container">
      <article className="prose">
        <h1>For Game Developers</h1>
        <p>
          Made an HTML5 game? We&apos;d love to feature it. BlinkGames
          publishes games through licensed distribution networks, which means
          you keep ownership of your game, get credited, and share in the
          revenue your game generates.
        </p>

        <h2>How to get your game on BlinkGames</h2>
        <p>
          We source our catalogue from established HTML5 distribution feeds
          such as GamePix and GameDistribution. The fastest route is to submit
          your game to one of those networks - once it&apos;s in a feed we
          carry, it appears on BlinkGames automatically, usually within a day.
        </p>
        <ul>
          <li>Your game stays yours - we embed, we don&apos;t copy.</li>
          <li>You&apos;re credited as the developer.</li>
          <li>In-game ad revenue is shared through the network.</li>
        </ul>

        <h2>Direct submissions</h2>
        <p>
          Prefer to talk to us directly? <Link href="/contact">Contact us</Link>{" "}
          with a playable link to your game and a short description. If it fits
          the catalogue we&apos;ll help you get it listed.
        </p>

        <h2>What works well here</h2>
        <p>
          Our players are on phones, tablets and school computers, so games
          that load fast, work with touch controls and play well in short
          sessions do best - think{" "}
          <Link href="/category/puzzle">puzzle</Link>,{" "}
          <Link href="/category/arcade">arcade</Link>,{" "}
          <Link href="/category/io">.io</Link> and{" "}
          <Link href="/category/casual">casual</Link> games.
        </p>
      </article>
    </main>
  );
}
