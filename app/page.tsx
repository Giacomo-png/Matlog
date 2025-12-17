"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Training = {
  id: string;
  date: string;
  workedWell: string;
  workedBad: string;
  createdAt: number;
};

const STORAGE_KEY = "bjj_journal_trainings_v1";

// gleiche Streak-Logik, leicht gestrafft
function computeStreak(trainings: { date: string }[]): {
  current: number;
  longest: number;
} {
  if (trainings.length === 0) return { current: 0, longest: 0 };

  const dates = trainings
    .map((t) => t.date)
    .filter(Boolean);

  const uniqueDates = Array.from(new Set(dates)).sort((a, b) =>
    a < b ? 1 : -1
  );

  const toDay = (iso: string) =>
    Math.floor(new Date(iso).getTime() / 86400000);

  let longest = 1;
  let currentRun = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = toDay(uniqueDates[i - 1]);
    const curr = toDay(uniqueDates[i]);
    if (prev - curr === 1) {
      currentRun += 1;
      if (currentRun > longest) longest = currentRun;
    } else {
      currentRun = 1;
    }
  }

  const todayDay = Math.floor(Date.now() / 86400000);
  let current = 0;
  let dayCursor = todayDay;
  const daySet = new Set(uniqueDates.map(toDay));

  while (daySet.has(dayCursor)) {
    current += 1;
    dayCursor -= 1;
  }

  return { current, longest };
}

export default function Home() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      if (!raw) return;
      const parsed = JSON.parse(raw) as Training[];
      if (!Array.isArray(parsed)) return;
      const { current, longest } = computeStreak(parsed);
      setCurrentStreak(current);
      setLongestStreak(longest);
    } catch {
      // ignore
    }
  }, []);

  const hasStreak = useMemo(
    () => currentStreak > 0 || longestStreak > 0,
    [currentStreak, longestStreak]
  );

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

      {/* Fast schwarzer Overlay */}
      <div className="absolute inset-0 bg-neutral-950/85 -z-0" />

      {/* Inhalt */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 text-slate-50">
        <div className="w-full max-w-xl space-y-8">
          {/* Matlog Kopfbereich – Schwarz/Weiß/Rot wie Schwarzgurt */}
          <header className="text-center space-y-3">
            <div className="inline-flex items-center rounded-full border border-red-700/80 bg-black px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
              <span className="h-2 w-3 rounded-[2px] bg-red-700 mr-2" />
              BJJ • Training Log
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-white">Mat</span>
              <span className="text-red-600">log</span>
            </h1>
            <p className="text-sm text-slate-300">
              Schlankes BJJ‑Logbuch in Schwarz, Weiß und Rot – wie der
              Schwarzgurt um deine Hüfte.
            </p>
          </header>

          {/* Haupt‑Card */}
          <section className="bg-black/90 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Wohin auf der Matte?
              </h2>
              {hasStreak && (
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-red-800 bg-neutral-900 text-slate-200">
                  Streak: {currentStreak} Tag
                  {currentStreak === 1 ? "" : "e"}
                </span>
              )}
            </div>

            {/* Aktionen */}
            <div className="grid gap-3">
              <Link
                href="/new-training"
                className="flex items-center justify-between rounded-xl bg-red-700 hover:bg-red-600 text-slate-50 px-4 py-3 text-sm font-semibold transition-colors"
              >
                <span>Neues Training hinzufügen</span>
                <span className="text-xs text-red-100/90">＋</span>
              </Link>

              <Link
                href="/moves"
                className="flex items-center justify-between rounded-xl bg-neutral-900 hover:bg-neutral-800 px-4 py-3 text-sm font-medium transition-colors"
              >
                <span>Move‑Liste öffnen</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-neutral-700 text-slate-300">
                  Lexikon
                </span>
              </Link>

              <Link
                href="/trainings"
                className="flex items-center justify-between rounded-xl bg-neutral-900 hover:bg-neutral-800 px-4 py-3 text-sm font-medium transition-colors"
              >
                <span>Alle Trainings ansehen</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-neutral-700 text-slate-300">
                  Historie
                </span>
              </Link>

              <Link
                href="/stats"
                className="flex items-center justify-between rounded-xl bg-neutral-900 hover:bg-neutral-800 px-4 py-3 text-sm font-medium transition-colors"
              >
                <span>Auswertung anzeigen</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-neutral-700 text-slate-300">
                  Stats
                </span>
              </Link>
            </div>

            {/* Streak‑Card minimal */}
            {hasStreak && (
              <div className="mt-2 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">
                    Training‑Streak
                  </div>
                  <div className="flex items-baseline gap-4 mt-1">
                    <div>
                      <div className="text-lg font-semibold text-slate-50">
                        {currentStreak}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Aktuelle Tage am Stück
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-50">
                        {longestStreak}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Längste Streak
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/stats"
                  className="text-[11px] px-3 py-1.5 rounded-full border border-red-700 text-red-200 hover:bg-neutral-900 transition-colors"
                >
                  Mehr Stats →
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
