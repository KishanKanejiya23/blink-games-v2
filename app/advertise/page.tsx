import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Advertise With Us",
  description:
    "Advertise with BlinkGames and reach an engaged audience of teens, students and casual gamers in the UK and worldwide. Banner, sidebar and sponsored placements available.",
  path: "/advertise",
});

const FORMATS = [
  {
    icon: "🖼️",
    title: "Display banners",
    body: "Leaderboard, rectangle and sidebar placements across the homepage, category pages and every game page.",
  },
  {
    icon: "🎮",
    title: "In-game & interstitial",
    body: "High-visibility placements shown around gameplay, where attention and dwell time are highest.",
  },
  {
    icon: "⭐",
    title: "Sponsored games & features",
    body: "Feature your game or brand in a promoted slot on the homepage and category listings.",
  },
];

export default function AdvertisePage() {
  return (
    <main className="container">
      <article className="prose">
        <h1>Advertise with BlinkGames</h1>
        <p className="lead">
          Reach an engaged, hard-to-target audience of teenagers, students and
          casual gamers - in the UK and around the world.
        </p>
        <p>
          BlinkGames is a fast-growing free games platform. Our visitors are
          young, mobile-first and highly engaged, spending real time playing
          session after session. That makes BlinkGames a great fit for brands
          trying to reach a youth and family gaming audience that&apos;s
          notoriously difficult to reach through traditional channels.
        </p>

        <h2>Ad formats</h2>
        <div className="ad-formats">
          {FORMATS.map((f) => (
            <div className="ad-format" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>

        <h2>Why BlinkGames</h2>
        <ul>
          <li>
            <strong>Engaged sessions.</strong> Players come to play, not to
            bounce - meaning longer time on site and more impressions per visit.
          </li>
          <li>
            <strong>Youth & family reach.</strong> A predominantly teen and
            student audience across mobile, tablet and desktop.
          </li>
          <li>
            <strong>UK-based, global traffic.</strong> Run at London hours with
            a worldwide English-speaking audience.
          </li>
          <li>
            <strong>Brand-safe.</strong> Licensed games only and a clean,
            no-nonsense experience.
          </li>
        </ul>

        <h2>Get in touch</h2>
        <p>
          Tell us your goals and budget and we&apos;ll put together a
          placement plan. Email{" "}
          <a href="mailto:kanejiyakishan@gmail.com?subject=Advertising%20enquiry">
            kanejiyakishan@gmail.com
          </a>{" "}
          with &quot;Advertising&quot; in the subject line, or use our{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </main>
  );
}
