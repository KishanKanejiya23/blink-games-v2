import Link from "next/link";
import type { Category } from "@/lib/games";

export function CategoryChips({
  categories,
  active,
}: {
  categories: Category[];
  active: string;
}) {
  const all = [{ id: "all", label: "All Games", sort: 0 }, ...categories];
  return (
    <nav className="chips" aria-label="Categories">
      {all.map((c) => (
        <Link
          key={c.id}
          href={c.id === "all" ? "/" : `/category/${c.id}`}
          className={"chip" + (c.id === active ? " active" : "")}
        >
          {c.label}
        </Link>
      ))}
    </nav>
  );
}
