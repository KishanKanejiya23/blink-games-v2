import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const sb = getSupabaseAdmin();
  const [games, featured, categories, poko, manual, recent] = await Promise.all([
    sb.from("games").select("id", { count: "exact", head: true }),
    sb.from("games").select("id", { count: "exact", head: true }).eq("featured", true),
    sb.from("categories").select("id", { count: "exact", head: true }),
    sb.from("games").select("id", { count: "exact", head: true }).eq("source", "poko"),
    sb.from("games").select("id", { count: "exact", head: true }).eq("source", "manual"),
    sb
      .from("games")
      .select("id,title,slug,category_id,thumb,created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const stats = [
    { lbl: "Total Games", num: games.count ?? 0 },
    { lbl: "Featured", num: featured.count ?? 0 },
    { lbl: "Categories", num: categories.count ?? 0 },
    { lbl: "Poko Catalog", num: poko.count ?? 0 },
    { lbl: "Added Manually", num: manual.count ?? 0 },
  ];

  return (
    <>
      <h1>Dashboard</h1>
      <div className="adm-cards">
        {stats.map((s) => (
          <div className="adm-stat" key={s.lbl}>
            <div className="num">{s.num.toLocaleString()}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="adm-panel">
        <h2 style={{ marginBottom: 10, color: "#002b50" }}>Recently added</h2>
        <table className="adm-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Category</th>
              <th>Added</th>
            </tr>
          </thead>
          <tbody>
            {(recent.data ?? []).map((g) => (
              <tr key={g.id}>
                <td>{g.thumb ? <img src={g.thumb} alt="" /> : null}</td>
                <td className="title-cell">
                  <Link href={`/game/${g.slug}`} target="_blank">
                    {g.title}
                  </Link>
                </td>
                <td>{g.category_id ?? "-"}</td>
                <td>{new Date(g.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
