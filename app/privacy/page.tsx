import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "BlinkGames privacy policy - how we use cookies, Google Analytics and Google AdSense, and your rights under UK GDPR.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="container">
      <article className="prose">
        <h1>Privacy Policy</h1>
        <p>Last updated: 10 July 2026</p>
        <p>
          BlinkGames (&quot;we&quot;, &quot;us&quot;), operated from London,
          United Kingdom, runs the website blinkgames.fun. This policy explains
          what data is collected when you use the site, how it is used, and the
          choices you have. We keep it deliberately simple because the site
          itself is simple: you don&apos;t need an account, and we never ask
          for your name, email or any personal details to play.
        </p>

        <h2>Data we collect</h2>
        <ul>
          <li>
            <strong>Analytics.</strong> We use Google Analytics 4 (and Google
            Tag Manager) to understand how the site is used - pages visited,
            approximate location (country/city level), device type and browser.
            This data is aggregated and does not identify you personally.
          </li>
          <li>
            <strong>Advertising.</strong> We use Google AdSense to show ads,
            which keeps the site free. Google and its partners may use cookies
            or device identifiers to show ads based on your visits to this and
            other websites (personalised advertising), or non-personalised ads
            based on context.
          </li>
          <li>
            <strong>Server logs.</strong> Like almost every website, our
            hosting provider records standard technical logs (IP address,
            request time, user agent) for security and reliability.
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Cookies are small files stored by your browser. On BlinkGames they
          are used by Google Analytics (to measure visits) and Google AdSense
          (to serve and measure ads). You can block or delete cookies at any
          time in your browser settings; the site will keep working. You can
          also opt out of personalised advertising at{" "}
          <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
            Google Ads Settings
          </a>{" "}
          and learn how Google uses data at{" "}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer" target="_blank">
            policies.google.com
          </a>
          .
        </p>

        <h2>Third-party games</h2>
        <p>
          Games on BlinkGames are provided by licensed third-party distributors
          (such as GamePix and GameDistribution) and load inside an embedded
          frame. Those providers may set their own cookies and collect their
          own analytics inside the game, governed by their own privacy
          policies.
        </p>

        <h2>Children</h2>
        <p>
          BlinkGames is a general-audience site. We do not knowingly collect
          personal information from children, and no part of the site requires
          anyone to submit personal information. Ads served to users we have
          reason to believe are children are non-personalised in accordance
          with Google&apos;s policies.
        </p>

        <h2>Your rights</h2>
        <p>
          Under UK GDPR you have the right to access, correct or erase personal
          data held about you, and to object to processing. Since we hold no
          accounts or profiles, in practice this mostly concerns analytics and
          advertising cookies, which you control via your browser and the
          Google links above. For anything else,{" "}
          <Link href="/contact">contact us</Link> and we&apos;ll help.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes we&apos;ll update this page and the date at
          the top. Questions? <Link href="/contact">Get in touch</Link>.
        </p>
      </article>
    </main>
  );
}
