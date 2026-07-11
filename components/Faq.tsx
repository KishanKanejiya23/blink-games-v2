// Native <details> accordion - no client JS needed, fully crawlable, and the
// answers are always in the DOM for search engines even when collapsed.
export function Faq({
  items,
  heading = "Frequently Asked Questions",
}: {
  items: { q: string; a: string }[];
  heading?: string;
}) {
  return (
    <section className="faq" aria-label="Frequently asked questions">
      <h2 className="section-title">{heading}</h2>
      {items.map((it) => (
        <details key={it.q}>
          <summary>{it.q}</summary>
          <p>{it.a}</p>
        </details>
      ))}
    </section>
  );
}
