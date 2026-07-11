"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "📊 Dashboard" },
  { href: "/admin/games", label: "🎮 Games" },
  { href: "/admin/games/new", label: "➕ Add Game" },
  { href: "/admin/categories", label: "🏷️ Categories" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="adm-sidebar">
      <Link className="poko-logo" href="/admin">
        Blink<span className="o">⚡</span> Admin
      </Link>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
          {l.label}
        </Link>
      ))}
      <Link href="/" target="_blank">
        🌐 View Site
      </Link>
      <div className="spacer" />
      <button onClick={logout}>🚪 Logout</button>
    </aside>
  );
}
