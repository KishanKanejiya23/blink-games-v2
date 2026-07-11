import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About BlinkGames",
  description:
    "BlinkGames is a free online games site based in London, UK. Hundreds of browser games - puzzle, action, racing, sports and .io - with no downloads and no sign-up.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="container">
      <article className="prose">
        <h1>About BlinkGames</h1>
        <p>
          BlinkGames is a free online gaming site built in London, UK, with one
          simple idea: great games should be a click away. No downloads, no
          installs, no accounts - every game on BlinkGames plays instantly in
          your browser on any device, from your phone on the bus to a laptop at
          home.
        </p>

        <h2>What you&apos;ll find here</h2>
        <p>
          We host hundreds of licensed HTML5 games across every genre -{" "}
          <Link href="/category/puzzle">puzzle</Link>,{" "}
          <Link href="/category/action">action</Link>,{" "}
          <Link href="/category/racing">racing</Link>,{" "}
          <Link href="/category/sports">sports</Link>,{" "}
          <Link href="/category/arcade">arcade</Link> and multiplayer{" "}
          <Link href="/category/io">.io games</Link>. The catalogue is updated
          regularly, so there&apos;s always something new to play.
        </p>

        <h2>Licensed and legal</h2>
        <p>
          Every game on BlinkGames comes from licensed HTML5 game distribution
          feeds. That means the developers who made the games are credited and
          compensated, and the games stay fresh - dead games drop out and new
          releases appear automatically.
        </p>

        <h2>Free forever</h2>
        <p>
          BlinkGames is free to play and supported by advertising. We never
          charge for games, never require an account, and never ask for
          personal information to play.
        </p>

        <h2>Get in touch</h2>
        <p>
          Questions, feedback or a game request? Head over to our{" "}
          <Link href="/contact">contact page</Link> - we read everything.
        </p>
      </article>
    </main>
  );
}
