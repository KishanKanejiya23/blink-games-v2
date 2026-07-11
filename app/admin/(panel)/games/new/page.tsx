"use client";

import { useEffect, useState } from "react";

type Cat = { id: string; label: string };

export default function AddGame() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [form, setForm] = useState({
    title: "",
    embed: "",
    thumb: "",
    category_id: "",
    description: "",
    featured: false,
  });
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCats(d.categories ?? []))
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg({});
    try {
      const res = await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ ok: `Added "${data.game.title}" — live at /game/${data.game.slug}` });
        setForm({ title: "", embed: "", thumb: "", category_id: "", description: "", featured: false });
      } else {
        setMsg({ err: data.error ?? "Failed to add game" });
      }
    } catch {
      setMsg({ err: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1>Add Game</h1>
      <div className="adm-panel">
        {msg.ok && <div className="adm-ok">{msg.ok}</div>}
        {msg.err && <div className="adm-error">{msg.err}</div>}
        <form className="adm-form" onSubmit={submit}>
          <div>
            <label>Title *</label>
            <input className="adm-input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label>Embed URL (iframe src) *</label>
            <input className="adm-input" required placeholder="https://html5.gamemonetize.com/…" value={form.embed} onChange={(e) => setForm({ ...form, embed: e.target.value })} />
          </div>
          <div>
            <label>Thumbnail URL</label>
            <input className="adm-input" placeholder="https://…/512x512.jpg" value={form.thumb} onChange={(e) => setForm({ ...form, thumb: e.target.value })} />
          </div>
          <div>
            <label>Category</label>
            <select className="adm-input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
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
            <textarea className="adm-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured (shows as big shiny tile on the homepage)
            </label>
          </div>
          <button className="adm-btn" type="submit" disabled={busy}>
            {busy ? "Adding…" : "Add Game"}
          </button>
        </form>
      </div>
    </>
  );
}
