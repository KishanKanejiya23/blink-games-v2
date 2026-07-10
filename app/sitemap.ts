import type { MetadataRoute } from "next";
import { getCategories, getAllGamesForSitemap } from "@/lib/games";
import { SITE_URL } from "@/lib/seo";

// Revalidate the sitemap hourly so newly imported games get picked up without a redeploy.
export const revalidate = 3600;

const STATIC_PAGES = ["/about", "/developers", "/privacy", "/terms", "/contact"];

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

  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.3,
  }));

  // Real category landing pages (indexable, unlike the old /?cat= URLs).
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/category/${c.id}`,
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

  return [...home, ...categoryPages, ...gamePages, ...staticPages];
}
