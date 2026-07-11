"use client";

import { useCallback, useEffect, useState } from "react";

type Cat = { id: string; label: string; sort: number; count: number };

export default function AdminCategories() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [label, setLabel] = useState("");
  const [msg, setMsg] = useState<{ ok?: string; err?: string }>({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCats(data.categories ?? []);
    } catch {
      setMsg({ err: "Failed to load categories" });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg({});
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg({ ok: `Category "${label}" added` });
      setLabel("");
      load();
    } else {
      setMsg({ err: data.error ?? "Failed to add" });
    }
    setBusy(false);
  }

  async function remove(c: Cat) {
    if (
      !confirm(
        `Delete category "${c.label}"? Its ${c.count} games stay on the site but become uncategorised.`,
      )
    )
      return;
    const res = await fetch(`/api/admin/categories?id=${encodeURIComponent(c.id)}`, {
      method: "DELETE",
    });
    if (res.ok) load();
    else setMsg({ err: (await res.json()).error ?? "Failed to delete" });
  }

  return (
    <>
      <h1>Categories</h1>
      <div className="adm-panel">
        {msg.ok && <div className="adm-ok">{msg.ok}</div>}
        {msg.err && <div className="adm-error">{msg.err}</div>}
        <form className="adm-toolbar" onSubmit={add}>
          <input
            className="adm-input"
            placeholder="New category name…"
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button className="adm-btn" type="submit" disabled={busy}>
            Add Category
          </button>
        </form>
        <table className="adm-table">
          <thead>
            <tr>
              <th>ID (slug)</th>
              <th>Label</th>
              <th>Games</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td style={{ fontWeight: 600 }}>{c.label}</td>
                <td>{c.count.toLocaleString()}</td>
                <td>
                  <button className="adm-btn danger sm" onClick={() => remove(c)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
