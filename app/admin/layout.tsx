import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin | BlinkGames",
  robots: { index: false, follow: false },
};

// Shared shell for /admin/* (login included) - just the stylesheet; the
// authenticated sidebar chrome lives in the (panel) group layout.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
