#!/usr/bin/env node
/**
 * Import the purchased Poko Arcade catalog (poko-games/poko/poko.sql) into Supabase.
 *
 * Strictly additive:
 *  - rows are upserted with source='poko' / external_id=<poko id>, so re-runs are
 *    idempotent and can only ever touch rows this script created;
 *  - poko rows whose embed URL already exists on the site are skipped;
 *  - slug collisions with existing games get a numeric suffix — the existing row
 *    is never modified.
 *
 * Usage: npm run import:poko
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

const SQL_PATH = new URL("../poko-games/poko/poko.sql", import.meta.url);

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

// poko category slug -> site category id (see supabase/migrations/0002_poko_categories.sql)
const CATEGORY_MAP = {
  puzzles: "puzzle", puzzle: "puzzle", bejeweled: "puzzle", "match-3": "puzzle",
  trivia: "puzzle", memory: "puzzle", math: "puzzle",
  arcade: "arcade", retro: "arcade",
  girls: "girls",
  hypercasual: "casual", "hyper-casual": "casual", mobile: "casual", fun: "casual",
  casual: "casual", "3d": "casual",
  adventure: "adventure", "fantasy-flight": "adventure",
  racing: "racing",
  shooting: "shooting", shooter: "shooting", tanks: "shooting",
  action: "action", boys: "action", robots: "action",
  sports: "sports", soccer: "sports", ball: "sports", skateboard: "sports",
  clicker: "clicker",
  cooking: "cooking",
  fighting: "fighting",
  multiplayer: "multiplayer", "2 player": "multiplayer",
  ".io": "io",
  kids: "kids", animal: "kids", monster: "kids", drawing: "kids", scary: "kids",
  strategy: "strategy", board: "board", card: "card",
};

/**
 * Parse every `INSERT INTO \`zon_games\` ... VALUES (...),(...);` tuple in the dump.
 * Quote-aware: handles \' and '' escapes plus commas/newlines inside strings.
 */
function parsePokoRows(sql) {
  const start = sql.indexOf("INSERT INTO `zon_games`");
  const end = sql.indexOf("-- Table structure for table `zon_likes`");
  if (start === -1 || end === -1) throw new Error("zon_games section not found in poko.sql");
  const s = sql.slice(start, end);

  const rows = [];
  let i = 0;
  const n = s.length;
  while (true) {
    const j = s.indexOf("VALUES", i);
    if (j === -1) break;
    i = j + 6;
    while (i < n) {
      while (i < n && " \n\r\t,".includes(s[i])) i++;
      if (s[i] !== "(") break;
      i++;
      const vals = [];
      let cur = "";
      let inStr = false;
      while (i < n) {
        const c = s[i];
        if (inStr) {
          if (c === "\\") { cur += s[i + 1]; i += 2; continue; }
          if (c === "'") {
            if (s[i + 1] === "'") { cur += "'"; i += 2; continue; }
            inStr = false; i++; continue;
          }
          cur += c; i++;
        } else if (c === "'") { inStr = true; i++; }
        else if (c === ",") { vals.push(cur); cur = ""; i++; }
        else if (c === ")") { vals.push(cur); i++; rows.push(vals); break; }
        else { cur += c; i++; }
      }
      if (s[i] === ";") { i++; break; }
    }
  }
  return rows;
}

async function fetchExisting() {
  const slugs = new Set();
  const embeds = new Set();
  const CHUNK = 1000;
  for (let from = 0; ; from += CHUNK) {
    const { data, error } = await sb
      .from("games")
      .select("slug,embed")
      .order("id", { ascending: true })
      .range(from, from + CHUNK - 1);
    if (error) throw new Error(`fetching existing games: ${error.message}`);
    for (const g of data ?? []) { slugs.add(g.slug); embeds.add(g.embed); }
    if (!data || data.length < CHUNK) break;
  }
  return { slugs, embeds };
}

async function main() {
  const raw = parsePokoRows(readFileSync(SQL_PATH, "utf8"));
  console.log(`Parsed ${raw.length} rows from poko.sql`);

  const { slugs, embeds } = await fetchExisting();
  console.log(`Existing on site: ${slugs.size} games (protected — never modified)`);

  const games = [];
  const perCategory = {};
  let skippedDupEmbed = 0, skippedInvalid = 0, suffixedSlugs = 0;

  for (const r of raw) {
    const [id, name, description, image, url, , category, status] = r.map((v) => v.trim());
    const plays = parseInt(r[8], 10) || 0;

    if (!/^https?:\/\//.test(url) || !name || status !== "0") { skippedInvalid++; continue; }
    if (embeds.has(url)) { skippedDupEmbed++; continue; }
    embeds.add(url); // also dedupes repeats inside the dump itself

    let slug = slugify(name);
    if (!slug) { skippedInvalid++; continue; }
    if (slugs.has(slug)) {
      let k = 2;
      while (slugs.has(`${slug}-${k}`)) k++;
      slug = `${slug}-${k}`;
      suffixedSlugs++;
    }
    slugs.add(slug);

    const category_id = CATEGORY_MAP[category.toLowerCase()] ?? "casual";
    perCategory[category_id] = (perCategory[category_id] ?? 0) + 1;

    games.push({
      slug,
      title: name,
      category_id,
      thumb: image.startsWith("http") ? image : null,
      embed: url,
      description: description || null,
      source: "poko",
      external_id: id,
      plays,
      featured: false, // don't reshuffle the existing homepage ordering
    });
  }

  console.log(
    `To upsert: ${games.length}  (skipped ${skippedDupEmbed} already-on-site/duplicate embeds, ` +
    `${skippedInvalid} invalid, ${suffixedSlugs} slugs suffixed to avoid collisions)`,
  );

  const BATCH = 500;
  let done = 0;
  for (let i = 0; i < games.length; i += BATCH) {
    const batch = games.slice(i, i + BATCH);
    const { error } = await sb.from("games").upsert(batch, { onConflict: "source,external_id" });
    if (error) {
      console.error(`Batch ${i / BATCH + 1} failed: ${error.message}`);
      process.exit(1);
    }
    done += batch.length;
    process.stdout.write(`\rUpserted ${done}/${games.length}`);
  }
  console.log("\nPer-category totals:", perCategory);
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
