"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type AdminGame = {
  id: string;
  slug: string;
  title: string;
  category_id: string | null;
  thumb: string | null;
  embed: string;
  description: string | null;
  featured: boolean;
  plays: number;
  source: string;
};
type Cat = { id: string; label: string };

export default function AdminGames() {
  const [games, setGames] = useState<AdminGame[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<AdminGame | null>(null);

  const pageSize = 20;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  const load = useCallback(async (p: number, query: string, category: string) => {
    setBusy(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (query) params.set("q", query);
      if (category) params.set("cat", category);
      const res = await fetch(`/api/admin/games?${params}`);
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to load");
      const data = await res.json();
      setGames(data.games);
      setTotal(data.total);
      setPage(data.page);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    load(1, "", "");
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCats(d.categories ?? []))
      .catch(() => {});
  }, [load]);

  async function toggleFeatured(g: AdminGame) {
    const res = await fetch(`/api/admin/games/${g.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !g.featured }),
    });
    if (res.ok) {
      setGames((prev) => prev.map((x) => (x.id === g.id ? { ...x, featured: !g.featured } : x)));
    }
  }

  async function remove(g: AdminGame) {
    if (!confirm(`Delete "${g.title}" permanently?`)) return;
    const res = await fetch(`/api/admin/games/${g.id}`, { method: "DELETE" });
    if (res.ok) {
      setGames((prev) => prev.filter((x) => x.id !== g.id));
      setTotal((t) => t - 1);
    }
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const res = await fetch(`/api/admin/games/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editing.title,
        embed: editing.embed,
        thumb: editing.thumb,
        category_id: editing.category_id,
        description: editing.description,
        featured: editing.featured,
      }),
    });
    if (res.ok) {
      setGames((prev) => prev.map((x) => (x.id === editing.id ? editing : x)));
      setEditing(null);
    } else {
      setError((await res.json()).error ?? "Save failed");
    }
  }

  return (
    <>
      <h1>Games</h1>
      <div className="adm-panel">
        <form
          className="adm-toolbar"
          onSubmit={(e) => {
            e.preventDefault();
            load(1, q, cat);
          }}
        >
          <input
            className="adm-input"
            placeholder="Search title…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="adm-input" style={{ maxWidth: 180 }} value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <button className="adm-btn" type="submit" disabled={busy}>
            Search
          </button>
          <span style={{ marginLeft: "auto", fontSize: 13.5, color: "#556" }}>
            {total.toLocaleString()} games
          </span>
        </form>

        {error && <div className="adm-error">{error}</div>}

        {editing && (
          <form className="adm-form" style={{ margin: "16px 0", maxWidth: "100%" }} onSubmit={saveEdit}>
            <strong style={{ color: "#002b50" }}>Editing: {editing.slug}</strong>
            <div>
              <label>Title</label>
              <input className="adm-input" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
            </div>
            <div>
              <label>Embed URL (iframe)</label>
              <input className="adm-input" value={editing.embed} onChange={(e) => setEditing({ ...editing, embed: e.target.value })} required />
            </div>
            <div>
              <label>Thumbnail URL</label>
              <input className="adm-input" value={editing.thumb ?? ""} onChange={(e) => setEditing({ ...editing, thumb: e.target.value || null })} />
            </div>
            <div>
              <label>Category</label>
              <select className="adm-input" value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}>
                <option value="">— none —</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Description</label>
              <textarea className="adm-input" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value || null })} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="adm-btn" type="submit">Save</button>
              <button className="adm-btn ghost" type="button" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        )}

        <table className="adm-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Category</th>
              <th>Source</th>
              <th>Plays</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((g) => (
              <tr key={g.id}>
                <td>{g.thumb ? <img src={g.thumb} alt="" loading="lazy" /> : null}</td>
                <td className="title-cell">
                  <Link href={`/game/${g.slug}`} target="_blank">{g.title}</Link>
                </td>
                <td>{g.category_id ?? "—"}</td>
                <td>{g.source}</td>
                <td>{g.plays.toLocaleString()}</td>
                <td>
                  <button className={"adm-badge " + (g.featured ? "on" : "off")} onClick={() => toggleFeatured(g)} title="Toggle featured (featured games show as big tiles)">
                    {g.featured ? "Featured" : "Normal"}
                  </button>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button className="adm-btn ghost sm" onClick={() => setEditing(g)}>Edit</button>{" "}
                  <button className="adm-btn danger sm" onClick={() => remove(g)}>Delete</button>
                </td>
              </tr>
            ))}
            {!busy && games.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#667", padding: 30 }}>
                  No games found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="adm-pager">
          <button className="adm-btn ghost sm" disabled={busy || page <= 1} onClick={() => load(page - 1, q, cat)}>
            ← Prev
          </button>
          <span>
            Page {page} / {pages.toLocaleString()}
          </span>
          <button className="adm-btn ghost sm" disabled={busy || page >= pages} onClick={() => load(page + 1, q, cat)}>
            Next →
          </button>
          {busy && <span>Loading…</span>}
        </div>
      </div>
    </>
  );
}
