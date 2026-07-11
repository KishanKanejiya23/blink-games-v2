-- Poko catalog integration (v2): new categories for the ~23.5k imported games.
-- Additive only — existing categories/games are untouched.

insert into public.categories (id, label, sort) values
  ('adventure',   'Adventure',   9),
  ('shooting',    'Shooting',    10),
  ('strategy',    'Strategy',    11),
  ('kids',        'Kids',        12),
  ('board',       'Board',       13),
  ('card',        'Card',        14),
  ('clicker',     'Clicker',     15),
  ('cooking',     'Cooking',     16),
  ('fighting',    'Fighting',    17),
  ('multiplayer', 'Multiplayer', 18)
on conflict (id) do nothing;
