"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MOVES } from "../../../moves/moves";

type TrainingMoveResult = {
  slug: string;
  success: boolean; // true = geklappt, false = nicht geklappt
};

type Training = {
  id: string;
  date: string; // YYYY-MM-DD
  workedWell: string;
  workedBad: string;
  moves: TrainingMoveResult[];
  createdAt: number;
};

const STORAGE_KEY = "bjj_journal_trainings_v1";

function loadTrainings(): Training[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Training[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTrainings(trainings: Training[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trainings));
}

export default function EditTrainingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [allTrainings, setAllTrainings] = useState<Training[]>([]);
  const [training, setTraining] = useState<Training | null>(null);

  const [date, setDate] = useState("");
  const [workedWell, setWorkedWell] = useState("");
  const [workedBad, setWorkedBad] = useState("");
  const [moves, setMoves] = useState<TrainingMoveResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );

  const sortedMoves = useMemo(
    () => MOVES.slice().sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const [moveQuery, setMoveQuery] = useState("");

  const filteredMoves = useMemo(() => {
    const q = moveQuery.trim().toLowerCase();
    if (!q) return sortedMoves;
    return sortedMoves.filter((m) => {
      return (
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.slug.toLowerCase().includes(q)
      );
    });
  }, [sortedMoves, moveQuery]);

  const { selectedCount, successCount, failCount } = useMemo(() => {
    const selected = moves.length;
    const success = moves.filter((m) => m.success).length;
    const fail = selected - success;
    return { selectedCount: selected, successCount: success, failCount: fail };
  }, [moves]);

  useEffect(() => {
    if (!id) return;

    const all = loadTrainings();
    const found = all.find((t) => t.id === id) ?? null;

    setAllTrainings(all);
    if (found) {
      setTraining(found);
      setDate(found.date);
      setWorkedWell(found.workedWell ?? "");
      setWorkedBad(found.workedBad ?? "");
      setMoves(Array.isArray((found as any).moves) ? (found as any).moves : []);
    }

    setLoaded(true);
  }, [id]);

  function setMoveResult(slug: string, success: boolean | null) {
    setMoves((prev) => {
      if (success === null) {
        return prev.filter((m) => m.slug !== slug);
      }
      const existing = prev.find((m) => m.slug === slug);
      if (existing) {
        return prev.map((m) =>
          m.slug === slug ? { ...m, success } : m
        );
      }
      return [...prev, { slug, success }];
    });
  }

  function onSave() {
    setError(null);
    if (!training || !id) return;

    if (!date) return setError("Bitte ein Datum auswählen.");
    if (!workedWell.trim() && !workedBad.trim())
      return setError("Schreib mindestens bei einer Box etwas rein.");

    const updated = allTrainings.map((t) => {
      if (t.id !== id) return t;

      return {
        ...t,
        date,
        workedWell: workedWell.trim(),
        workedBad: workedBad.trim(),
        moves,
      };
    });

    saveTrainings(updated);
    setAllTrainings(updated);

    router.push(`/training/${id}`);
    router.refresh();
  }

  if (!loaded) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="/bjjback.png"
            alt="BJJ Hintergrund"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-slate-950/70 -z-0" />

        <div className="relative z-10 min-h-screen px-4 py-6 text-slate-50 flex justify-center">
          <div className="w-full max-w-md space-y-4">
            <Link
              href="/"
              className="text-sm text-blue-400 underline hover:text-blue-300"
            >
              ← Zurück
            </Link>
            <p className="text-sm text-slate-200">Lade…</p>
          </div>
        </div>
      </main>
    );
  }

  if (!training) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="/bjjback.png"
            alt="BJJ Hintergrund"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-slate-950/70 -z-0" />

        <div className="relative z-10 min-h-screen px-4 py-6 text-slate-50 flex justify-center">
          <div className="w-full max-w-md space-y-4">
            <Link
              href="/"
              className="text-sm text-blue-400 underline hover:text-blue-300"
            >
              ← Zurück
            </Link>
            <p className="text-sm text-slate-200">Training nicht gefunden.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Hintergrundbild */}
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
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Training bearbeiten</h1>
              <p className="text-xs text-slate-300">
                Passe Datum, Notizen & Moves dieser Session an.
              </p>
            </div>
            <Link
              href={`/training/${id}`}
              className="text-sm text-blue-400 underline hover:text-blue-300"
            >
              ← Zurück
            </Link>
          </header>

          {/* Card */}
          <section className="border border-slate-800 bg-slate-900/70 rounded-xl p-4 sm:p-5 space-y-5 shadow-lg">
            {/* Datum */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">
                Datum
              </label>
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400"
              />
            </div>

            {/* Moves bearbeiten mit Suche */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-400">
                  Moves (bearbeiten)
                </h2>
                <p className="text-[11px] text-slate-400">
                  Ausgewählt: {selectedCount} · geklappt: {successCount} · nicht geklappt: {failCount}
                </p>
              </div>

              <input
                type="text"
                value={moveQuery}
                onChange={(e) => setMoveQuery(e.target.value)}
                placeholder="Move suchen… (Name, Kategorie, Slug)"
                className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400"
              />

              <div className="border border-slate-800 rounded-lg bg-slate-950/40 max-h-56 overflow-auto space-y-2 px-3 py-3">
                {filteredMoves.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    Keine Moves gefunden. Suchbegriff anpassen.
                  </p>
                ) : (
                  filteredMoves.map((m) => {
                    const current = moves.find((x) => x.slug === m.slug);
                    const value =
                      current?.success === true
                        ? "ok"
                        : current?.success === false
                          ? "bad"
                          : "none";

                    return (
                      <div
                        key={m.slug}
                        className="flex flex-col gap-1 border border-slate-800 rounded-lg bg-slate-900/60 px-3 py-2.5 hover:border-purple-500/80 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {m.name}{" "}
                            <span className="text-[11px] uppercase tracking-wide text-slate-400">
                              ({m.category})
                            </span>
                          </span>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setMoveResult(m.slug, true)}
                            className={
                              "px-2.5 py-1 rounded-full border transition-colors " +
                              (value === "ok"
                                ? "bg-emerald-500/90 border-emerald-400 text-slate-950"
                                : "border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/15")
                            }
                          >
                            geklappt
                          </button>
                          <button
                            type="button"
                            onClick={() => setMoveResult(m.slug, false)}
                            className={
                              "px-2.5 py-1 rounded-full border transition-colors " +
                              (value === "bad"
                                ? "bg-rose-500/90 border-rose-400 text-slate-950"
                                : "border-rose-500/60 text-rose-300 hover:bg-rose-500/15")
                            }
                          >
                            nicht geklappt
                          </button>
                          <button
                            type="button"
                            onClick={() => setMoveResult(m.slug, null)}
                            className="px-2.5 py-1 rounded-full border border-slate-600 text-[11px] text-slate-300 hover:bg-slate-800"
                          >
                            zurücksetzen
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Notizen */}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-emerald-400">
                  Was hat geklappt?
                </span>
                <textarea
                  value={workedWell}
                  onChange={(e) => setWorkedWell(e.target.value)}
                  className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 min-h-[110px] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-400"
                />
              </label>

              <label className="space-y-2">
                <span className="block text-xs font-semibold tracking-[0.18em] uppercase text-rose-400">
                  Was hat nicht geklappt?
                </span>
                <textarea
                  value={workedBad}
                  onChange={(e) => setWorkedBad(e.target.value)}
                  className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 min-h-[110px] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/60 focus:border-rose-400"
                />
              </label>
            </div>

            {error ? (
              <p className="text-sm text-rose-400">{error}</p>
            ) : null}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="text-[11px] text-slate-500">
                Session vom{" "}
                <span className="font-medium text-slate-200">{date}</span> ·{" "}
                {selectedCount} Moves ausgewählt
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => router.push(`/training/${id}`)}
                  className="border border-slate-700 px-4 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                >
                  Abbrechen
                </button>
                <button
                  onClick={onSave}
                  className="bg-purple-500/90 hover:bg-purple-400 text-slate-950 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-lg shadow-purple-500/40"
                >
                  Speichern
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
