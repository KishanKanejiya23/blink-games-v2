"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <form className="search" onSubmit={submit}>
      🔍
      <input
        type="search"
        placeholder="Search games..."
        aria-label="Search games"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
