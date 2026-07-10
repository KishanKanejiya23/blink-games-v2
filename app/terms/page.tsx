import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "Terms of use for BlinkGames — the free online games site. Play hundreds of browser games with no download and no sign-up.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="container">
      <article className="prose">
        <h1>Terms of Use</h1>
        <p>Last updated: 10 July 2026</p>
        <p>
          Welcome to BlinkGames (blinkgames.fun). By using the site you agree
          to these terms. They&apos;re short, because the deal is simple: play
          free games, be nice, don&apos;t break things.
        </p>

        <h2>The service</h2>
        <p>
          BlinkGames provides free, browser-based games supplied by licensed
          third-party distributors. The service is provided &quot;as is&quot; —
          we work hard to keep everything running, but we can&apos;t guarantee
          any particular game will always be available, since games come and go
          from the upstream feeds.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>Don&apos;t attempt to hack, overload or disrupt the site.</li>
          <li>Don&apos;t scrape or republish the game catalogue.</li>
          <li>
            Don&apos;t use automated tools to generate ad impressions or
            clicks.
          </li>
        </ul>

        <h2>Intellectual property</h2>
        <p>
          All games are the property of their respective developers and
          publishers and are embedded under licence from their distributors.
          The BlinkGames name, logo and site design are ours. If you are a
          rights holder and believe content is embedded in error, please{" "}
          <Link href="/contact">contact us</Link> and we will resolve it
          promptly.
        </p>

        <h2>Advertising</h2>
        <p>
          The site is funded by advertising served by Google AdSense and by ads
          inside some games served by the game distributors. See our{" "}
          <Link href="/privacy">privacy policy</Link> for details on how ads
          use data.
        </p>

        <h2>Liability</h2>
        <p>
          To the maximum extent permitted by law, BlinkGames is not liable for
          any loss or damage arising from use of the site or the embedded
          games. Nothing in these terms affects your statutory rights.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? <Link href="/contact">Contact us</Link>.
        </p>
      </article>
    </main>
  );
}
