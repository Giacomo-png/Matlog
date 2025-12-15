"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MOVES } from "./moves";

export default function MovesPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = MOVES.slice().sort((a, b) => a.name.localeCompare(b.name));

    if (!query) return list;
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query) ||
        m.slug.toLowerCase().includes(query)
    );
  }, [q]);

  return (
    <main className="p-6 space-y-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Moves</h1>
        <Link href="/" className="underline">
          ← Zurück
        </Link>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Suchen… (z.B. triangle, pass, sweep)"
        className="border border-slate-700 bg-slate-900/70 rounded px-3 py-2 w-full text-slate-50 placeholder-slate-400"
      />

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p>Keine Moves gefunden.</p>
        ) : (
          filtered.map((m) => (
            <Link
              key={m.slug}
              href={`/moves/${m.slug}`}
              className="block border border-slate-700 bg-slate-900/70 rounded p-3 hover:bg-slate-800/80"
            >
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm opacity-80">{m.category}</div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
