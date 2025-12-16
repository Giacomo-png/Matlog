"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MOVES } from "./moves";

export default function MovesPage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = [...MOVES].sort((a, b) => a.name.localeCompare(b.name));

    if (!query) return list;
    return list.filter((m) =>
      [m.name, m.category, m.slug]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [q]);

  const resultCount = filtered.length;
  const totalCount = MOVES.length;

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hintergrundbild wie Stats */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/bjjback.png"
          alt="BJJ Hintergrund"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dunkler Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 -z-0" />

      {/* Inhalt */}
      <div className="relative z-10 min-h-screen px-4 py-6 text-slate-50 flex justify-center">
        <div className="w-full max-w-2xl space-y-5">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Moves</h1>
              <p className="text-xs text-slate-300">
                Durchsuche dein BJJ‑Repertoire nach Namen, Kategorien & Slugs.
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-blue-400 underline hover:text-blue-300"
            >
              ← Zurück
            </Link>
          </header>

          {/* Search + Info */}
          <section className="border border-slate-800 bg-slate-900/70 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">
                Suche
              </span>
              <span className="text-[11px] text-slate-400">
                {resultCount} von {totalCount} Moves
              </span>
            </div>
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Suchen… (z.B. triangle, pass, sweep)"
                className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                ⌕
              </span>
            </div>
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                Filter zurücksetzen
              </button>
            )}
          </section>

          {/* Move‑Liste */}
          <section className="border border-slate-800 bg-slate-900/70 rounded-xl p-3 sm:p-4 space-y-2 shadow-lg mb-4">
            {filtered.length === 0 ? (
              <p className="text-sm text-slate-200">
                Keine Moves gefunden. Suchbegriff anpassen.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {filtered.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/moves/${m.slug}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2.5 hover:border-purple-500/80 hover:bg-slate-900 transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-50">
                          {m.name}
                        </span>
                        <span className="text-[11px] uppercase tracking-wide text-slate-400">
                          {m.category}
                        </span>
                      </div>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
                        {m.slug}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
