import type { Metadata } from "next";
import type { Category, Game } from "./games";

/** Single source of truth for the canonical origin (also used by sitemap/robots). */
export const SITE_URL = "https://www.blinkgames.fun";
export const SITE_NAME = "BlinkGames";

/**
 * Hand-written landing copy per category. Titles/descriptions target the
 * highest-volume queries for each genre; the intro renders as crawlable copy
 * above the grid. Categories missing here fall back to a generated variant.
 */
export const CATEGORY_SEO: Record<
  string,
  { title: string; description: string; intro: string }
> = {
  action: {
    title: "Free Action Games Online - Play Instantly",
    description:
      "Play free action games online - shooting, fighting and battle games with no download. Instant play on mobile, tablet and desktop at BlinkGames.",
    intro:
      "Jump straight into the best free action games on the web. Shoot, fight, dodge and battle your way through fast-paced levels - no downloads, no installs, no sign-up. Every game runs instantly in your browser on any device, whether you have five minutes at school or a whole evening at home.",
  },
  puzzle: {
    title: "Free Puzzle Games Online - Brain Games, No Download",
    description:
      "Play free puzzle games online - match-3, logic, word and brain games with no download. Instant play in your browser at BlinkGames.",
    intro:
      "Give your brain a workout with our free puzzle games. From match-3 and block puzzles to logic challenges and word games, everything here plays instantly in your browser - perfect for a quick break at school, on the bus, or whenever you fancy a mental challenge.",
  },
  arcade: {
    title: "Free Arcade Games Online - Classic & New, Play Instantly",
    description:
      "Play free arcade games online - jumping, running and classic-style arcade games with no download. Instant browser play at BlinkGames.",
    intro:
      "Relive the golden age of gaming and discover new favourites with our free arcade games. Run, jump, dodge and chase high scores in games that load in seconds and play on any device - no downloads or sign-ups needed.",
  },
  sports: {
    title: "Free Sports Games Online - Football, Basketball & More",
    description:
      "Play free sports games online - football, basketball, pool and more with no download. Instant play on any device at BlinkGames.",
    intro:
      "Score goals, sink baskets and win championships in our free sports games. Football, basketball, pool, golf and more - all playable instantly in your browser with nothing to install. Great for quick matches with friends or solo tournaments.",
  },
  racing: {
    title: "Free Racing Games Online - Car & Driving Games, No Download",
    description:
      "Play free racing games online - car racing, drifting and driving games with no download. Instant browser play at BlinkGames.",
    intro:
      "Start your engines with the best free racing games online. Drift around corners, dodge traffic and race to the finish line in car, bike and kart games that run instantly in your browser on mobile, tablet or desktop.",
  },
  girls: {
    title: "Free Girls Games Online - Dress Up, Makeover & More",
    description:
      "Play free girls games online - dress up, makeover, salon and cooking games with no download. Instant play at BlinkGames.",
    intro:
      "Explore our collection of free dress up, makeover, salon and cooking games. Style outfits, run your own beauty salon and create amazing looks - every game plays instantly in your browser with no download needed.",
  },
  io: {
    title: "Free .io Games Online - Multiplayer Games, No Download",
    description:
      "Play free .io games online - multiplayer arena and survival games with no download. Instant play in your browser at BlinkGames.",
    intro:
      "Battle players from around the world in our free .io games. Grow, survive and climb the leaderboard in multiplayer arenas that load in seconds - no download, no account, just instant multiplayer fun on any device.",
  },
  casual: {
    title: "Free Casual Games Online - Easy, Fun, Instant Play",
    description:
      "Play free casual games online - simple, fun games for everyone with no download. Instant play on mobile and desktop at BlinkGames.",
    intro:
      "Sometimes you just want a fun, easy game you can pick up in seconds. Our casual games are perfect for short breaks - simple to learn, hard to put down, and playable instantly in your browser on any device.",
  },
};

export function categorySeo(cat: Category) {
  return (
    CATEGORY_SEO[cat.id] ?? {
      title: `Free ${cat.label} Games Online - Play Instantly`,
      description: `Play free ${cat.label.toLowerCase()} games online with no download. Instant play on mobile, tablet and desktop at BlinkGames.`,
      intro: `Play the best free ${cat.label.toLowerCase()} games online. No downloads, no sign-ups - every game runs instantly in your browser on any device.`,
    }
  );
}

/** Consistent canonical + Open Graph + Twitter metadata for a page. */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noindex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${opts.path}`;
  const images = opts.image ? [{ url: opts.image }] : undefined;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_GB",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: opts.image ? "summary_large_image" : "summary",
      title: opts.title,
      description: opts.description,
      ...(images ? { images: [opts.image as string] } : {}),
    },
  };
}

// ---------- JSON-LD builders ----------

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: "kanejiyakishan@gmail.com",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function videoGameJsonLd(game: Game, categoryLabel?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    url: `${SITE_URL}/game/${game.slug}`,
    ...(game.thumb ? { image: game.thumb } : {}),
    ...(game.description ? { description: game.description } : {}),
    ...(categoryLabel ? { genre: categoryLabel } : {}),
    playMode: "SinglePlayer",
    applicationCategory: "Game",
    gamePlatform: ["Web Browser", "Mobile", "Desktop"],
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
    },
  };
}

export function collectionPageJsonLd(cat: Category, gameCount: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: categorySeo(cat).title,
    url: `${SITE_URL}/category/${cat.id}`,
    description: categorySeo(cat).description,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    ...(gameCount ? { numberOfItems: gameCount } : {}),
  };
}

/**
 * Homepage FAQ - targets high-volume "unblocked games / games at school"
 * queries (our school + teen audience). Rendered as an accordion and emitted
 * as FAQPage structured data for rich results.
 */
export const HOME_FAQ: { q: string; a: string }[] = [
  {
    q: "What is BlinkGames?",
    a: "BlinkGames is a free online games website with hundreds of browser games - puzzle, action, racing, sports, arcade and .io games. Every game plays instantly in your browser with no download and no sign-up.",
  },
  {
    q: "Are the games really free?",
    a: "Yes. Every game on BlinkGames is completely free to play. The site is supported by minimal, non-intrusive advertising, so we never charge you and never ask for payment details.",
  },
  {
    q: "Do I need to download or install anything?",
    a: "No. All BlinkGames games are HTML5 games that run straight in your web browser. There is nothing to download or install - just click a game and play on your phone, tablet, laptop or school computer.",
  },
  {
    q: "Can I play BlinkGames at school?",
    a: "BlinkGames is built to be fast and lightweight so it loads quickly on school and home networks. Games play right in the browser with no install needed. Always follow your school's network rules and use the site responsibly.",
  },
  {
    q: "Do I need an account to play?",
    a: "No account is required. You can start playing any game instantly - no registration, no email, no personal details.",
  },
  {
    q: "How often are new games added?",
    a: "The catalogue is updated regularly from licensed HTML5 game feeds, so new games appear automatically and older ones stay fresh.",
  },
];

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

/** Render helper: serialize JSON-LD for a <script type="application/ld+json"> tag. */
export function jsonLdScript(data: object | object[]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
