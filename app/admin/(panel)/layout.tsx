import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminAuth";
import { AdminNav } from "./AdminNav";

// Middleware gates /admin already; this is defense in depth for direct renders.
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!(await verifySessionToken(token))) redirect("/admin/login");

  return (
    <div className="adm-shell">
      <AdminNav />
      <main className="adm-main">{children}</main>
    </div>
  );
}
