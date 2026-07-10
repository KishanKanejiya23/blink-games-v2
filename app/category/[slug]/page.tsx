import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getGames } from "@/lib/games";
import {
  buildMetadata,
  categorySeo,
  collectionPageJsonLd,
  breadcrumbJsonLd,
  jsonLdScript,
} from "@/lib/seo";
import { CategoryChips } from "@/components/CategoryChips";
import { InfiniteGrid } from "@/components/InfiniteGrid";
import { AdSlot } from "@/components/AdSlot";

// ISR: category listings can be an hour stale; keeps TTFB fast for crawlers.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = (await getCategories()).find((c) => c.id === slug);
  if (!cat) return { title: "Category not found" };
  const seo = categorySeo(cat);
  return buildMetadata({
    title: seo.title,
    description: seo.description,
    path: `/category/${cat.id}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, games] = await Promise.all([
    getCategories(),
    getGames({ category: slug }),
  ]);
  const cat = categories.find((c) => c.id === slug);
  if (!cat) notFound();

  const seo = categorySeo(cat);
  const jsonLd = [
    collectionPageJsonLd(cat, games.length),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: cat.label, path: `/category/${cat.id}` },
    ]),
  ];

  return (
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span aria-hidden>›</span> <span>{cat.label}</span>
      </nav>

      <section className="hero">
        <h1>
          Free <em>{cat.label}</em> Games Online
        </h1>
        <p>{seo.intro}</p>
      </section>

      <AdSlot variant="leaderboard" />

      <CategoryChips categories={categories} active={cat.id} />

      <h2 className="section-title">All {cat.label} Games</h2>

      {games.length === 0 ? (
        <div className="notice">No games in this category yet — check back soon.</div>
      ) : (
        <InfiniteGrid initial={games} category={cat.id} />
      )}

      <AdSlot variant="rectangle" />
    </main>
  );
}
