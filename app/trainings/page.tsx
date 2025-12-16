"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";

type TrainingMoveResult = {
  slug: string;
  success: boolean;
};

type Training = {
  id: string;
  date: string;
  workedWell: string;
  workedBad: string;
  moves?: TrainingMoveResult[];
  createdAt: number;
};

const STORAGE_KEY = "bjj_journal_trainings_v1";

function loadTrainings(): Training[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Training[];
    const safeArray = Array.isArray(parsed) ? parsed : [];
    // nach createdAt (neueste zuerst), Fallback auf date
    safeArray.sort(
      (a, b) =>
        (b.createdAt ?? new Date(b.date).getTime()) -
        (a.createdAt ?? new Date(a.date).getTime())
    );
    return safeArray;
  } catch {
    return [];
  }
}

// Swipe-Wrapper (ohne roten Hintergrund)
function SwipeToDelete({
  children,
  onDelete,
}: {
  children: React.ReactNode;
  onDelete: () => void;
}) {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (startX.current === null) return;
    const diff = e.touches[0].clientX - startX.current;
    if (diff < 0) {
      setTranslateX(diff);
    }
  }

  function handleTouchEnd() {
    if (translateX < -96) {
      const ok = window.confirm("Training wirklich löschen?");
      if (ok) onDelete();
    }
    setTranslateX(0);
    startX.current = null;
  }

  return (
    <div className="relative overflow-hidden">
      {/* optional dezenter Hinweis rechts, kaum sichtbar */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-4 text-[10px] text-slate-500">
        {/* Text nur leicht grau, ohne Hintergrundfarbe */}
        Zum Löschen nach links wischen
      </div>

      <div
        className="relative touch-pan-y"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: startX.current ? "none" : "transform 0.15s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
    setTrainings(loadTrainings());
  }, []);

  const total = trainings.length;

  const byYearMonth = useMemo(() => {
    const map = new Map<string, { label: string; items: Training[] }>();

    for (const t of trainings) {
      const d = new Date(t.date);
      if (isNaN(d.getTime())) continue;

      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const label = d.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
      });

      if (!map.has(ym)) {
        map.set(ym, { label, items: [] });
      }
      map.get(ym)!.items.push(t);
    }

    // neueste Monate zuerst
    return Array.from(map.entries()).sort((a, b) =>
      a[0] < b[0] ? 1 : -1
    );
  }, [trainings]);

  function shortPreview(t: Training) {
    const text = t.workedWell || t.workedBad || "";
    if (!text) return "Kein Text notiert.";
    if (text.length <= 80) return text;
    return text.slice(0, 80) + "…";
  }

  function deleteTraining(id: string) {
    const raw = localStorage.getItem(STORAGE_KEY) ?? "[]";
    let all: Training[] = [];
    try {
      const parsed = JSON.parse(raw);
      all = Array.isArray(parsed) ? parsed : [];
    } catch {
      all = [];
    }
    const updated = all.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setTrainings(updated);
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* wenn der Hintergrund schon im RootLayout ist, kannst du diesen Block entfernen */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/bjjback.png"
          alt="BJJ Hintergrund"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-slate-950/70 -z-0" />

      <div className="relative z-10 min-h-screen px-4 py-6 text-slate-50 flex justify-center">
        <div className="w-full max-w-2xl space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Alle Trainings</h1>
              <p className="text-xs text-slate-300">
                {total} Trainings insgesamt
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-blue-400 underline hover:text-blue-300"
            >
              ← Zurück
            </Link>
          </header>

          {trainings.length === 0 ? (
            <div className="border border-slate-800 bg-slate-900/70 rounded-xl p-4 text-sm text-slate-200 shadow-lg">
              Noch keine Trainings vorhanden. Leg dein erstes Training auf der
              Startseite an.
            </div>
          ) : (
            <div className="space-y-6 mb-4">
              {byYearMonth.map(([key, group]) => (
                <section key={key} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-slate-700" />
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      {group.label}
                    </span>
                    <div className="h-px flex-1 bg-slate-700" />
                  </div>

                  <div className="space-y-3">
                    {group.items.map((t) => {
                      const moveCount = t.moves?.length ?? 0;
                      const successCount =
                        t.moves?.filter((m) => m.success).length ?? 0;
                      const failCount = moveCount - successCount;

                      const handleDelete = () => deleteTraining(t.id);

                      return (
                        <SwipeToDelete key={t.id} onDelete={handleDelete}>
                          <Link
                            href={`/training/${t.id}`}
                            className="block rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 transition shadow-sm hover:shadow-md"
                          >
                            <div className="p-3 sm:p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-slate-400">
                                  {new Date(t.date).toLocaleDateString(
                                    "de-DE",
                                    {
                                      weekday: "short",
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "2-digit",
                                    }
                                  )}
                                </div>
                                {moveCount > 0 ? (
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                                      {successCount} ✓
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
                                      {failCount} ✕
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                                      {moveCount} Moves
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                    Keine Moves
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-slate-100">
                                {shortPreview(t)}
                              </p>

                              <div className="flex justify-between items-center text-[11px] text-slate-500">
                                <span>
                                  Erstellt am{" "}
                                  {new Date(t.createdAt).toLocaleDateString(
                                    "de-DE",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "2-digit",
                                    }
                                  )}
                                </span>
                                <span className="uppercase tracking-wide">
                                  Details ansehen →
                                </span>
                              </div>
                            </div>
                          </Link>
                        </SwipeToDelete>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
