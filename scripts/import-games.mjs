#!/usr/bin/env node
/**
 * Bulk-import games into Supabase from LICENSED HTML5 game feeds.
 *
 * Why feeds and not a scraper:
 *  - You get a legal right to embed each game (no DMCA / Cloudflare blocks).
 *  - The feed stays fresh: dead games drop out, new ones appear.
 *  - The network revenue-shares the in-game ads with you on top of AdSense.
 *
 * Supported out of the box:
 *  - GamePix Games Feed API  (free; set GAMEPIX_SID, or uses the public demo feed)
 *  - GameDistribution/GameMonetize feed (set GAMEDISTRIBUTION_FEED_URL to your JSON feed)
 *
 * Usage:
 *   cp .env.local.example .env.local   # fill in the values
 *   npm run import:games
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// --- tiny .env.local loader (no dependency) ---
try {
  for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* no .env.local — rely on real env */
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

const KNOWN_CATEGORIES = new Set([
  "action", "puzzle", "arcade", "sports", "racing", "girls", "io", "casual",
]);

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

function normalizeCategory(raw) {
  const c = (raw || "").toLowerCase();
  if (KNOWN_CATEGORIES.has(c)) return c;
  if (/puzzle|match|brain|word/.test(c)) return "puzzle";
  if (/race|racing|car|drift|drive/.test(c)) return "racing";
  if (/sport|soccer|football|basket|pool/.test(c)) return "sports";
  if (/girl|dress|makeup|salon/.test(c)) return "girls";
  if (/shoot|fight|action|war|gun/.test(c)) return "action";
  if (/\.?io\b/.test(c)) return "io";
  if (/arcade|jump|run|platform/.test(c)) return "arcade";
  return "casual";
}

// ---------- source: GamePix ----------
async function fromGamePix() {
  const sid = process.env.GAMEPIX_SID || "demo";
  const url = `https://feeds.gamepix.com/v2/json?sid=${encodeURIComponent(sid)}`;
  console.log(`→ GamePix feed: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  GamePix feed returned ${res.status}; skipping.`);
    return [];
  }
  const data = await res.json();
  const items = data.items || data.data || [];
  return items.map((it) => ({
    external_id: String(it.id ?? it.namespace ?? it.url),
    title: it.title,
    description: it.description || null,
    category_id: normalizeCategory(it.category),
    thumb: it.banner_image || it.image || it.thumbnailUrl || null,
    embed: it.url, // GamePix "url" is the embeddable game URL
    width: it.width || null,
    height: it.height || null,
    source: "gamepix",
  }));
}

// ---------- source: GameMonetize public feed (no key needed) ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPageWithRetry(url, page, maxRetries = 5) {
  let wait = 4000;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 BlinkGames/1.0" } });
    if (res.status === 429) {
      console.warn(`  page ${page}: 429 (rate limited), backing off ${wait / 1000}s (attempt ${attempt}/${maxRetries})`);
      await sleep(wait);
      wait = Math.min(wait * 2, 30000); // exponential backoff, cap 30s
      continue;
    }
    if (!res.ok) return { status: res.status, items: null };
    try {
      return { status: 200, items: await res.json() };
    } catch {
      return { status: res.status, items: null };
    }
  }
  return { status: 429, items: null }; // gave up after retries
}

async function fromGameMonetize({ pages = 5, perPage = 100 } = {}) {
  const out = [];
  const seen = new Set();
  let emptyStreak = 0;
  for (let page = 1; page <= pages; page++) {
    const url = `https://gamemonetize.com/feed.php?format=0&num=${perPage}&page=${page}`;
    const { status, items } = await fetchPageWithRetry(url, page);
    if (status === 429) {
      console.warn(`  GameMonetize page ${page}: still rate-limited after retries; stopping here.`);
      break;
    }
    if (!Array.isArray(items) || items.length === 0) {
      console.warn(`  GameMonetize page ${page}: empty (status ${status}); stopping.`);
      break;
    }
    let fresh = 0;
    for (const it of items) {
      const id = String(it.id);
      if (seen.has(id)) continue; // feed sometimes repeats the tail; skip dupes
      seen.add(id);
      fresh++;
      out.push({
        external_id: id,
        title: it.title,
        description: it.description ? String(it.description).replace(/&[a-z]+;|<[^>]+>/gi, " ").trim() : null,
        category_id: normalizeCategory(it.category),
        thumb: it.thumb || null,
        embed: it.url,
        width: it.width ? parseInt(it.width, 10) : null,
        height: it.height ? parseInt(it.height, 10) : null,
        source: "gamemonetize",
      });
    }
    console.log(`  GameMonetize page ${page}: ${items.length} games (${fresh} new, ${out.length} total)`);
    // if the feed stops giving anything new, it has looped back — stop
    if (fresh === 0) {
      if (++emptyStreak >= 2) {
        console.log("  GameMonetize: no new games for 2 pages; reached catalog end.");
        break;
      }
    } else emptyStreak = 0;
    await sleep(3500); // gentle pacing to avoid 429
  }
  return out;
}

// ---------- source: GameDistribution / GameMonetize JSON feed ----------
async function fromGameDistribution() {
  const url = process.env.GAMEDISTRIBUTION_FEED_URL;
  if (!url) return [];
  console.log(`→ GameDistribution feed: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  GD feed returned ${res.status}; skipping.`);
    return [];
  }
  const data = await res.json();
  const items = Array.isArray(data) ? data : data.items || [];
  return items.map((it) => ({
    external_id: String(it.md5 || it.id),
    title: it.title,
    description: it.description || null,
    category_id: normalizeCategory(Array.isArray(it.category) ? it.category[0] : it.category),
    thumb: it.thumb || it.image || null,
    embed: it.url || `https://html5.gamedistribution.com/${it.md5 || it.id}/`,
    width: it.width || null,
    height: it.height || null,
    source: "gamedistribution",
  }));
}

async function main() {
  console.log("→ GameMonetize public feed");
  const raw = [
    ...(await fromGameMonetize({ pages: 60, perPage: 100 })),
    ...(await fromGamePix()),
    ...(await fromGameDistribution()),
  ];

  // keep only usable rows + assign unique slugs
  const seenSlug = new Set();
  const rows = [];
  for (const g of raw) {
    if (!g.title || !g.embed) continue;
    let slug = slugify(g.title);
    if (!slug) continue;
    while (seenSlug.has(slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
    seenSlug.add(slug);
    rows.push({ ...g, slug });
  }

  if (!rows.length) {
    console.error("No games fetched. Check your feed sid / URL in .env.local.");
    process.exit(1);
  }

  console.log(`Upserting ${rows.length} games...`);
  // upsert in chunks; dedupe on (source, external_id)
  const CHUNK = 500;
  let done = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error } = await sb
      .from("games")
      .upsert(chunk, { onConflict: "source,external_id", ignoreDuplicates: false });
    if (error) {
      console.error("Upsert error:", error.message);
      process.exit(1);
    }
    done += chunk.length;
    console.log(`  ${done}/${rows.length}`);
  }
  console.log("✅ Import complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
