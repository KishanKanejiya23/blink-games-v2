import type { MetadataRoute } from "next";

// Keep in sync with metadataBase in app/layout.tsx.
const SITE_URL = "https://www.blinkgames.fun";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // API routes have nothing to index and shouldn't waste crawl budget.
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
