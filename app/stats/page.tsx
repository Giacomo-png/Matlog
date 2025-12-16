"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { MOVES } from "../moves/moves";

type TrainingMoveResult = {
  slug: string;
  success: boolean;
};

type Training = {
  id: string;
  date: string;
  workedWell: string;
  workedBad: string;
  createdAt: number;
  moves?: TrainingMoveResult[];
};

const STORAGE_KEY = "bjj_journal_trainings_v1";
type RangeKey = "7d" | "30d" | "1y" | "all";

// Backup-Export-Funktion
function exportTrainingsToFile() {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem(STORAGE_KEY) ?? "[]";

  const blob = new Blob([raw], {
    type: "application/json;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  a.href = url;
  a.download = `matlog-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function StatsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [range, setRange] = useState<RangeKey>("30d");
  const [rangeOpen, setRangeOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setTrainings([]);
        return;
      }
      const parsed = JSON.parse(raw) as Training[];
      setTrainings(Array.isArray(parsed) ? parsed : []);
    } catch {
      setTrainings([]);
    }
  }, []);

  const now = useMemo(() => new Date(), []);
  const oneWeekAgo = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }, [now]);
  const oneMonthAgo = useMemo(() => {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 1);
    return d;
  }, [now]);
  const oneYearAgo = useMemo(() => {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() - 1);
    return d;
  }, [now]);

  function inRange(t: Training, key: RangeKey): boolean {
    const d = new Date(t.date);
    if (key === "7d") return d >= oneWeekAgo;
    if (key === "30d") return d >= oneMonthAgo;
    if (key === "1y") return d >= oneYearAgo;
    return true;
  }

  const total = trainings.length;
  const countByRange: Record<RangeKey, number> = {
    "7d": trainings.filter((t) => inRange(t, "7d")).length,
    "30d": trainings.filter((t) => inRange(t, "30d")).length,
    "1y": trainings.filter((t) => inRange(t, "1y")).length,
    all: total,
  };

  const filteredTrainings = trainings.filter((t) => inRange(t, range));

  const moveCounts: Record<string, number> = {};
  const moveSuccess: Record<string, { success: number; fail: number }> = {};

  for (const t of filteredTrainings) {
    for (const m of t.moves ?? []) {
      moveCounts[m.slug] = (moveCounts[m.slug] || 0) + 1;

      if (!moveSuccess[m.slug]) {
        moveSuccess[m.slug] = { success: 0, fail: 0 };
      }
      if (m.success) moveSuccess[m.slug].success += 1;
      else moveSuccess[m.slug].fail += 1;
    }
  }

  const movesWithStats = Object.entries(moveSuccess)
    .map(([slug, { success, fail }]) => {
      const move = MOVES.find((m) => m.slug === slug);
      const total = success + fail;
      const rate = total > 0 ? Math.round((success / total) * 100) : 0;
      return {
        slug,
        name: move?.name ?? slug,
        category: move?.category ?? "Unknown",
        success,
        fail,
        total,
        rate,
      };
    })
    .sort((a, b) => b.total - a.total || b.rate - a.rate);

  // Problem-Moves (Fehlschläge)
  const badMoveCounts: Record<string, { fail: number; success: number }> = {};
  for (const t of filteredTrainings) {
    for (const m of t.moves ?? []) {
      const entry = (badMoveCounts[m.slug] ||= { fail: 0, success: 0 });
      if (m.success) entry.success += 1;
      else entry.fail += 1;
    }
  }

  let focusSlug: string | null = null;
  let focusCount = 0;
  for (const [slug, data] of Object.entries(badMoveCounts)) {
    if (data.fail > focusCount) {
      focusCount = data.fail;
      focusSlug = slug;
    }
  }

  const focusMoveName =
    focusSlug ? MOVES.find((m) => m.slug === focusSlug)?.name ?? focusSlug : null;

  // Top-3 Problem-Moves (nach Fehlschlägen, mind. 1 Fail)
  const problemMoves = Object.entries(badMoveCounts)
    .filter(([, data]) => data.fail > 0)
    .map(([slug, data]) => {
      const move = MOVES.find((m) => m.slug === slug);
      const total = data.success + data.fail;
      const rate = total > 0 ? Math.round((data.success / total) * 100) : 0;
      return {
        slug,
        name: move?.name ?? slug,
        category: move?.category ?? "Unknown",
        fail: data.fail,
        success: data.success,
        total,
        rate,
      };
    })
    .sort((a, b) => b.fail - a.fail || a.rate - b.rate)
    .slice(0, 3);

  // Problem-Kategorie (meiste Fehlschläge)
  const failByCategory: Record<string, number> = {};
  for (const [slug, data] of Object.entries(badMoveCounts)) {
    if (data.fail === 0) continue;
    const move = MOVES.find((m) => m.slug === slug);
    const cat = move?.category ?? "Unbekannt";
    failByCategory[cat] = (failByCategory[cat] || 0) + data.fail;
  }

  let problemCategory: { category: string; fail: number } | null = null;
  for (const [cat, fail] of Object.entries(failByCategory)) {
    if (!problemCategory || fail > problemCategory.fail) {
      problemCategory = { category: cat, fail };
    }
  }

  function rangeLabel(key: RangeKey) {
    if (key === "7d") return "Letzte 7 Tage";
    if (key === "30d") return "Letzte 30 Tage";
    if (key === "1y") return "Letztes Jahr";
    return "Gesamte Zeit";
  }

  const rangeOrder: RangeKey[] = ["7d", "30d", "1y", "all"];

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hintergrundbild */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bjjback.png"
          alt="BJJ Hintergrund"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Dunkler Overlay */}
      <div className="absolute inset-0 bg-slate-950/70 -z-0" />

      {/* Inhalt */}
      <div className="relative z-10 min-h-screen px-4 py-6 text-slate-50 flex justify-center">
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Auswertung</h1>
              <p className="text-xs text-slate-300">
                Dein Matlog Dashboard – Moves & Problem-Zonen.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={exportTrainingsToFile}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800"
              >
                Backup exportieren
              </button>
              <Link href="/" className="text-sm text-blue-400 underline">
                ← Zurück
              </Link>
            </div>
          </header>

          {/* Zeitraum-Selector */}
          <section className="border border-slate-800 bg-slate-900/70 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Zeitraum für Analyse
                </h2>
                <p className="text-xs text-slate-400">
                  Steuert die Move-Statistik und die Problem-Zonen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRangeOpen((o) => !o)}
                className="text-xs px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-slate-800 flex items-center gap-2"
              >
                <span>{rangeLabel(range)}</span>
                <span>{rangeOpen ? "▲" : "▼"}</span>
              </button>
            </div>

            {rangeOpen && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {rangeOrder.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setRange(key);
                      setRangeOpen(false);
                    }}
                    className={
                      "flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2 transition " +
                      (range === key
                        ? "bg-blue-600 text-white border-blue-500"
                        : "bg-slate-900/70 text-slate-200 border-slate-700 hover:bg-slate-800")
                    }
                  >
                    <span className="font-medium">{rangeLabel(key)}</span>
                    <span className="text-[11px] opacity-80">
                      {countByRange[key]} Trainings
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Moves-Stats */}
          <section className="border border-slate-800 bg-slate-900/70 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Meist genutzte Moves ({rangeLabel(range)})
              </h2>
              <span className="text-[11px] text-slate-400">
                Top 5 nach Häufigkeit
              </span>
            </div>

            {movesWithStats.length === 0 ? (
              <p className="text-sm text-slate-200">
                Noch keine Moves in Trainings ausgewählt (für diesen Zeitraum).
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {movesWithStats.slice(0, 5).map((m) => (
                  <li
                    key={m.slug}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {m.category} · {m.total}× genutzt
                      </span>
                    </div>
                    <div className="flex flex-col items-end text-[11px] gap-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {m.success}× geklappt
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                        {m.fail}× nicht
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                        {m.rate}% Erfolgsrate
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Top-Problem-Moves */}
          <section className="border border-slate-800 bg-slate-900/70 rounded-xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Problem-Moves ({rangeLabel(range)})
              </h2>
              <span className="text-[11px] text-slate-400">
                Meiste Fehlschläge
              </span>
            </div>

            {problemMoves.length === 0 ? (
              <p className="text-sm text-slate-200">
                In diesem Zeitraum wurden noch keine Fehlschläge getrackt.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {problemMoves.map((m) => (
                  <li
                    key={m.slug}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-[11px] text-slate-400">
                        {m.category} · {m.fail}× „nicht geklappt“ von {m.total} Versuchen
                      </span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                      {m.rate}% Erfolgsrate
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Fokus-Empfehlung mit Link zum Move */}
          <section className="border border-slate-800 bg-slate-900/70 rounded-xl p-4 space-y-2 shadow-lg">
            <h2 className="text-sm font-semibold text-slate-100">
              Fokus-Empfehlung ({rangeLabel(range)})
            </h2>
            {focusMoveName && focusSlug ? (
              <div className="text-sm text-slate-200 space-y-2">
                <p>Aktueller Haupt‑Problem‑Move in diesem Zeitraum:</p>
                <Link
                  href={`/moves/${focusSlug}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-100 text-sm"
                >
                  <span className="font-semibold">{focusMoveName}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900/70 border border-rose-400/40">
                    {focusCount}× „nicht geklappt“
                  </span>
                  <span className="text-[11px] opacity-80">
                    Details &amp; Tutorial →
                  </span>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-200">
                Noch keine Daten für eine Fokus-Empfehlung in diesem Zeitraum.
              </p>
            )}
          </section>

          {/* Problem-Kategorie */}
          <section className="border border-slate-800 bg-slate-900/70 rounded-xl p-4 space-y-2 shadow-lg mb-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Problem-Kategorie ({rangeLabel(range)})
            </h2>
            {problemCategory ? (
              <p className="text-sm text-slate-200">
                Die Kategorie mit den meisten Fehlschlägen ist{" "}
                <span className="font-semibold">
                  {problemCategory.category}
                </span>{" "}
                mit {problemCategory.fail}× „nicht geklappt“. Nutze das für
                deinen Drill‑Fokus.
              </p>
            ) : (
              <p className="text-sm text-slate-200">
                Keine auffällige Problem‑Kategorie in diesem Zeitraum.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
