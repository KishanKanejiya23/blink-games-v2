/**
 * Generate unique, SEO-friendly descriptions for games whose description is
 * missing or a thin one-liner, using the Claude Message Batches API (50% of
 * standard price, results within ~1 hour).
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-ant-... node scripts/generate-descriptions.mjs [limit]
 *
 * - Reads env from .env.local (SUPABASE url + service role key).
 * - Picks the top [limit] games by plays (default 200) with description
 *   shorter than 120 chars, so the most-visited pages get real copy first.
 * - Run it repeatedly to work through the catalog in slices.
 *
 * Requires: npm i @anthropic-ai/sdk   and an Anthropic API key
 * (https://platform.claude.com). Model: claude-opus-4-8 — swap MODEL for
 * "claude-haiku-4-5" if you want cheaper bulk generation at lower quality.
 */
import { readFileSync } from "node:fs";
import Anthropic from "@anthropic-ai/sdk";

// ---- env from .env.local (same convention as import-games.mjs) ----
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MODEL = "claude-opus-4-8";
const LIMIT = Number(process.argv[2] ?? 200);

if (!SB || !KEY) throw new Error("Missing Supabase env in .env.local");
if (!process.env.ANTHROPIC_API_KEY) throw new Error("Set ANTHROPIC_API_KEY to run this script");

const sbHeaders = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function fetchGames() {
  // description is null OR shorter than ~120 chars → thin content worth replacing
  const url =
    `${SB}/rest/v1/games?select=id,slug,title,category_id,description` +
    `&source=in.(poko,manual)&order=plays.desc&limit=${LIMIT * 3}`;
  const res = await fetch(url, { headers: sbHeaders });
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status}`);
  const rows = await res.json();
  return rows.filter((g) => !g.description || g.description.length < 120).slice(0, LIMIT);
}

async function updateGame(id, description) {
  const res = await fetch(`${SB}/rest/v1/games?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...sbHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) console.warn(`  update failed for ${id}: ${res.status}`);
}

const client = new Anthropic();

const games = await fetchGames();
if (!games.length) {
  console.log("No games with thin descriptions found — nothing to do.");
  process.exit(0);
}
console.log(`Generating descriptions for ${games.length} games via Batch API (model: ${MODEL})…`);

const batch = await client.messages.batches.create({
  requests: games.map((g) => ({
    custom_id: g.id,
    params: {
      model: MODEL,
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content:
            `Write a unique 60-90 word description for the free browser game "${g.title}"` +
            (g.category_id ? ` (category: ${g.category_id})` : "") +
            (g.description ? `. Existing short blurb for context: "${g.description}"` : "") +
            `. It appears on the game's page at BlinkGames, a free online games site. ` +
            `Natural, engaging tone for players; mention it plays free in the browser with no download. ` +
            `Do not invent specific mechanics you can't know from the title; keep claims generic but vivid. ` +
            `Return only the description text, no quotes or headings.`,
        },
      ],
    },
  })),
});
console.log(`Batch ${batch.id} submitted. Polling…`);

let b;
for (;;) {
  b = await client.messages.batches.retrieve(batch.id);
  if (b.processing_status === "ended") break;
  console.log(`  status: ${b.processing_status} (${b.request_counts.processing} processing)`);
  await new Promise((r) => setTimeout(r, 60_000));
}

let ok = 0, failed = 0;
for await (const result of await client.messages.batches.results(batch.id)) {
  if (result.result.type === "succeeded") {
    const msg = result.result.message;
    if (msg.stop_reason === "refusal") { failed++; continue; }
    const text = msg.content.find((c) => c.type === "text")?.text?.trim();
    if (text) { await updateGame(result.custom_id, text); ok++; } else failed++;
  } else {
    failed++;
  }
}
console.log(`Done: ${ok} descriptions written, ${failed} failed/skipped.`);
console.log("Tip: run scripts/indexnow-submit.mjs afterwards so engines re-crawl the updated pages.");
