import type { MetadataRoute } from "next";
import { getCategories, getAllGamesForSitemap } from "@/lib/games";

// Keep in sync with metadataBase in app/layout.tsx.
const SITE_URL = "https://www.blinkgames.fun";

// Revalidate the sitemap hourly so newly imported games get picked up without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, games] = await Promise.all([
    getCategories(),
    getAllGamesForSitemap(),
  ]);

  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Category listing pages (home filtered by ?cat=).
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/?cat=${c.id}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // One entry per game detail page.
  const gamePages: MetadataRoute.Sitemap = games.map((g) => ({
    url: `${SITE_URL}/game/${g.slug}`,
    lastModified: g.created_at ? new Date(g.created_at) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...home, ...categoryPages, ...gamePages];
}
