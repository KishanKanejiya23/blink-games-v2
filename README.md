# BlinkGames.fun

Next.js 15 (App Router) HTML5 games portal, backed by **self-hosted Supabase**
(`supabase.kishankanejiiya.tech`). Mobile-first, ad-friendly layout. Games are
bulk-imported from **licensed** HTML5 game feeds into Supabase and rendered from there.

## v2.0.0 — Poko catalog

The purchased **Poko Arcade** package (`poko-games/`, a PHP script — not deployed)
supplied its game database `poko-games/poko/poko.sql`: ~23.5k licensed HTML5 embeds.
`npm run import:poko` parses that dump and upserts into Supabase additively
(`source='poko'`, idempotent, never touches pre-existing rows). Ten new categories
were added in `supabase/migrations/0002_poko_categories.sql`.

## Stack
- **Next.js 15 / React 19** (App Router, Server Components)
- **Supabase** — games + categories tables, read via anon key + RLS
- **Licensed game feeds** — GamePix / GameDistribution → imported, not scraped
- **Google AdSense** — reserved ad slots, no layout shift

## Structure
```
app/
  layout.tsx            header, footer, AdSense loader, sticky mobile ad
  page.tsx              home: hero, category chips, game grid (reads Supabase)
  game/[slug]/page.tsx  player: iframe + ads + related games
  globals.css
components/              GameCard, AdSlot, Header, Footer, SearchBar, CategoryChips
lib/
  supabase.ts           read-only anon client
  games.ts              data access (getGames/getGameBySlug/getRelated/getCategories)
supabase/migrations/
  0001_init.sql         tables, RLS, indexes, seed categories
scripts/import-games.mjs  bulk import from licensed feeds → Supabase
```

## Setup

### 1. Env
```bash
cp .env.local.example .env.local
```
Fill in:
- `NEXT_PUBLIC_SUPABASE_URL=https://supabase.kishankanejiiya.tech`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from your Supabase dashboard → API)
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; used by the import script)
- `GAMEPIX_SID` and/or `GAMEDISTRIBUTION_FEED_URL` (free publisher signups)
- `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...`

### 2. Create the schema (push to your Supabase)
Option A — Supabase CLI:
```bash
supabase db push        # applies supabase/migrations/0001_init.sql
```
Option B — paste `supabase/migrations/0001_init.sql` into the SQL editor at
`https://supabase.kishankanejiiya.tech` and run it.

### 3. Import games (the legal auto-populate)
```bash
npm install
npm run import:games     # pulls the feed(s) → upserts into Supabase
```
Re-run any time to refresh — dedupes on `(source, external_id)`.

### 4. Run
```bash
npm run dev              # http://localhost:3000
```

## Deploy / push
This isn't a git repo yet. To push and deploy:
```bash
git init && git add . && git commit -m "BlinkGames: Next.js + Supabase portal"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
Then import the repo into **Vercel** (recommended for Next.js) or Cloudflare Pages,
set the same env vars in the host dashboard, and point `blinkgames.fun` DNS at it.

## Why feeds, not scraping
Scraping copyrighted iframes gets you DMCA takedowns, Cloudflare blocks, and dead
embeds within weeks. Licensed feeds (GamePix, GameDistribution, GameMonetize) give
you the same thousands of games **legally**, keep themselves fresh, and pay you a
share of the in-game ads on top of your AdSense. The import script already normalizes
both feed formats into the `games` table.

## Ads
Slots are pre-sized (leaderboard 970×90, rectangle 300×250, sidebar 300×600, mobile
anchor) so ads load without shifting the page — important for Core Web Vitals and
AdSense approval. Replace the placeholder markup in `components/AdSlot.tsx` with your
real `<ins class="adsbygoogle">` unit once approved.
