"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MOVES } from "../../moves/moves";

type TrainingMoveResult = {
  slug: string;
  success: boolean; // true = geklappt, false = nicht geklappt
};

type Training = {
  id: string;
  date: string;
  workedWell: string;
  workedBad: string;
  moves: TrainingMoveResult[];
  createdAt: number;
};

const STORAGE_KEY = "bjj_journal_trainings_v1";

function loadTrainings(): Training[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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

export default function TrainingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [training, setTraining] = useState<Training | null>(null);
  const [loaded, setLoaded] = useState(false);

  const movesBySlug = useMemo(() => {
    const map = new Map<string, (typeof MOVES)[number]>();
    for (const m of MOVES) map.set(m.slug, m);
    return map;
  }, []);

  useEffect(() => {
    if (!id) return;

    const all = loadTrainings();
    const found = all.find((t) => t.id === id) ?? null;

    const normalized = found
      ? {
          ...found,
          moves: Array.isArray((found as any).moves)
            ? (found as any).moves
            : [],
        }
      : null;

    setTraining(normalized);
    setLoaded(true);
  }, [id]);

  function onDelete() {
    if (!id) return;
    const ok = window.confirm("Training wirklich löschen?");
    if (!ok) return;

    const all = loadTrainings();
    const updated = all.filter((t) => t.id !== id);
    saveTrainings(updated);

    router.push("/");
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
              href="/trainings"
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
              href="/trainings"
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

  const moveCount = training.moves?.length ?? 0;
  const successCount = training.moves?.filter((m) => m.success).length ?? 0;
  const failCount = moveCount - successCount;

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
            <Link
              href="/trainings"
              className="text-sm text-blue-400 underline hover:text-blue-300"
            >
              ← Zurück
            </Link>

            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/training/${id}/edit`)}
                className="border border-slate-700 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                Bearbeiten
              </button>

              <button
                onClick={onDelete}
                className="border border-rose-500 px-3 py-2 rounded-lg text-sm text-rose-300 hover:bg-rose-500/10"
              >
                Löschen
              </button>
            </div>
          </header>

          {/* Titel */}
          <section className="border border-slate-800 bg-slate-900/75 rounded-xl p-4 sm:p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                  Training
                </p>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Training vom {training.date}
                </h1>
                <p className="text-[11px] text-slate-400">
                  Erstellt am{" "}
                  {new Date(training.createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end text-[11px] gap-1">
                {moveCount > 0 ? (
                  <>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {successCount} geklappt
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                      {failCount} nicht
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                      {moveCount} Moves
                    </span>
                  </>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Keine Moves
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Moves mit Status */}
          <section className="border border-slate-800 bg-slate-900/75 rounded-xl p-4 space-y-3 shadow-lg">
            <h2 className="text-sm font-semibold text-slate-100">
              Moves dieser Session
            </h2>
            {!training.moves || training.moves.length === 0 ? (
              <p className="text-sm text-slate-300">
                Keine Moves gespeichert.
              </p>
            ) : (
              <div className="flex flex-col gap-2 text-sm">
                {training.moves.map((entry, idx) => {
                  const m = movesBySlug.get(entry.slug);
                  const name = m?.name ?? entry.slug;
                  return (
                    <Link
                      key={`${entry.slug}-${idx}`}
                      href={`/moves/${entry.slug}`}
                      className="inline-flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 hover:bg-slate-900 hover:border-purple-500/80 transition-colors"
                    >
                      <span className="text-slate-100">{name}</span>
                      <span
                        className={
                          "text-[11px] px-2 py-0.5 rounded-full border " +
                          (entry.success
                            ? "bg-emerald-500/90 border-emerald-400 text-slate-950"
                            : "bg-rose-500/90 border-rose-400 text-slate-950")
                        }
                      >
                        {entry.success ? "geklappt" : "nicht geklappt"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Notizen */}
          {(training.workedWell || training.workedBad) && (
            <section className="grid gap-4 md:grid-cols-2">
              {training.workedWell ? (
                <div className="border border-slate-800 bg-slate-900/75 rounded-xl p-4 shadow-lg">
                  <div className="text-xs font-semibold tracking-[0.18em] uppercase text-emerald-400 mb-1">
                    Geklappt
                  </div>
                  <p className="text-sm text-slate-100 whitespace-pre-wrap">
                    {training.workedWell}
                  </p>
                </div>
              ) : null}

              {training.workedBad ? (
                <div className="border border-slate-800 bg-slate-900/75 rounded-xl p-4 shadow-lg">
                  <div className="text-xs font-semibold tracking-[0.18em] uppercase text-rose-400 mb-1">
                    Nicht geklappt
                  </div>
                  <p className="text-sm text-slate-100 whitespace-pre-wrap">
                    {training.workedBad}
                  </p>
                </div>
              ) : null}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
