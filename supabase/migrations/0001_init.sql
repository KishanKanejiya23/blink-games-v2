-- BlinkGames schema
-- Run against supabase.kishankanejiiya.tech (SQL editor or `supabase db push`).

-- ---------- categories ----------
create table if not exists public.categories (
  id    text primary key,          -- slug e.g. 'puzzle'
  label text not null,             -- display e.g. 'Puzzle'
  sort  int  not null default 0
);

-- ---------- games ----------
create table if not exists public.games (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  category_id text references public.categories(id) on delete set null,
  thumb       text,
  embed       text not null,               -- licensed iframe URL
  description text,
  source      text default 'manual',       -- 'gamepix' | 'gamedistribution' | 'manual'
  external_id text,                         -- id from the source feed (for dedupe)
  width       int,
  height      int,
  plays       int  not null default 0,
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists games_category_idx on public.games (category_id);
create index if not exists games_title_idx     on public.games using gin (to_tsvector('simple', title));
-- full unique index so bulk upsert can use ON CONFLICT (source, external_id)
create unique index if not exists games_source_extid_idx
  on public.games (source, external_id);

-- ---------- Row Level Security ----------
-- Public site only ever READS. Writes happen via the service-role key in the import script,
-- which bypasses RLS. So we expose read-only to anon and lock writes.
alter table public.games      enable row level security;
alter table public.categories enable row level security;

drop policy if exists "public read games" on public.games;
create policy "public read games" on public.games
  for select using (true);

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories
  for select using (true);

-- ---------- atomic play counter (optional, for "popular" sorting) ----------
create or replace function public.increment_plays(game_slug text)
returns void language sql as $$
  update public.games set plays = plays + 1 where slug = game_slug;
$$;

-- ---------- seed categories ----------
insert into public.categories (id, label, sort) values
  ('action',  'Action',  1),
  ('puzzle',  'Puzzle',  2),
  ('arcade',  'Arcade',  3),
  ('sports',  'Sports',  4),
  ('racing',  'Racing',  5),
  ('girls',   'Girls',   6),
  ('io',      '.io',     7),
  ('casual',  'Casual',  8)
on conflict (id) do nothing;
