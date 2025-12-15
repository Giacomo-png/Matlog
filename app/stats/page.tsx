"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MOVES } from "../moves/moves";

type TrainingMoveResult = {
  slug: string;
  success: boolean;
};

type Training = {
  id: string;
  date: string;      // z.B. "2025-12-15"
  workedWell: string;
  workedBad: string;
  createdAt: number; // Date.now()
  moves?: TrainingMoveResult[];
};

const STORAGE_KEY = "bjj_journal_trainings_v1";

export default function StatsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);

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

  // einfache Auswertungen
  const total = trainings.length;

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  const oneMonthAgo = new Date(now);
  oneMonthAgo.setMonth(now.getMonth() - 1);

  const trainingsLastWeek = trainings.filter((t) => {
    const d = new Date(t.date);
    return d >= oneWeekAgo;
  }).length;

  const trainingsLastMonth = trainings.filter((t) => {
    const d = new Date(t.date);
    return d >= oneMonthAgo;
  }).length;

  // Häufigkeit der Moves in allen Trainings berechnen (unabhängig vom Ergebnis)
  const moveCounts: Record<string, number> = {};

  for (const t of trainings) {
    for (const m of t.moves ?? []) {
      moveCounts[m.slug] = (moveCounts[m.slug] || 0) + 1;
    }
  }

  const movesWithCounts = Object.entries(moveCounts)
    .map(([slug, count]) => {
      const move = MOVES.find((m) => m.slug === slug);
      return {
        slug,
        name: move?.name ?? slug,
        count,
        category: move?.category ?? "Unknown",
      };
    })
    .sort((a, b) => b.count - a.count);

  // Fehler pro Move zählen (success === false)
  const badMoveCounts: Record<string, number> = {};

  for (const t of trainings) {
    for (const m of t.moves ?? []) {
      if (!m.success) {
        badMoveCounts[m.slug] = (badMoveCounts[m.slug] || 0) + 1;
      }
    }
  }

  let focusSlug: string | null = null;
  let focusCount = 0;

  for (const [slug, count] of Object.entries(badMoveCounts)) {
    if (count > focusCount) {
      focusCount = count;
      focusSlug = slug;
    }
  }

  const focusMoveName =
    focusSlug ? MOVES.find((m) => m.slug === focusSlug)?.name ?? focusSlug : null;

  return (
    <main className="p-6 space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Auswertung</h1>

      <Link href="/" className="text-blue-600 underline">
        ← Zurück zur Startseite
      </Link>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Überblick</h2>
        <p>Gesamtzahl Trainings: {total}</p>
        <p>Trainings letzte 7 Tage: {trainingsLastWeek}</p>
        <p>Trainings letzten 30 Tage: {trainingsLastMonth}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Meist genutzte Moves</h2>

        {movesWithCounts.length === 0 ? (
          <p>Noch keine Moves in Trainings ausgewählt.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {movesWithCounts.slice(0, 5).map((m) => (
              <li key={m.slug}>
                {m.name} ({m.category}) – {m.count}× in Trainings
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Fokus-Empfehlung</h2>
        {focusMoveName ? (
          <p>
            Aktueller Problem-Move, an dem du am häufigsten gescheitert bist:{" "}
            {focusMoveName} ({focusCount}× „nicht geklappt“).
          </p>
        ) : (
          <p>Noch keine Daten für eine Fokus-Empfehlung.</p>
        )}
      </section>
    </main>
  );
}
