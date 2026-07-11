import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Contact BlinkGames - questions, feedback, game requests, business enquiries or content issues. We read everything.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="container">
      <article className="prose">
        <h1>Contact BlinkGames</h1>
        <p>
          We&apos;d love to hear from you - whether it&apos;s feedback about
          the site, a game you&apos;d like to see added, a bug report, a
          business enquiry, or a question about content.
        </p>

        <h2>Email</h2>
        <p>
          <a href="mailto:kanejiyakishan@gmail.com">kanejiyakishan@gmail.com</a>
        </p>
        <p>We aim to reply within a couple of working days.</p>

        <h2>Rights holders</h2>
        <p>
          All games on BlinkGames are embedded under licence from HTML5 game
          distribution networks. If you are a developer or publisher and
          believe a game is listed in error, email us with the game&apos;s URL
          and we&apos;ll investigate straight away.
        </p>

        <h2>Advertising &amp; partnerships</h2>
        <p>
          For advertising, sponsorship or partnership enquiries, use the same
          email with &quot;Business&quot; in the subject line.
        </p>
      </article>
    </main>
  );
}
