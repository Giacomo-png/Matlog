"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Training = {
  id: string;
  date: string;
  workedWell: string;
  workedBad: string;
  createdAt: number;
};

const STORAGE_KEY = "bjj_journal_trainings_v1";

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);

  useEffect(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setTrainings([]);
      return;
    }
    const parsed = JSON.parse(raw) as Training[];
    const safeArray = Array.isArray(parsed) ? parsed : [];

    // nach dem eingegebenen Datum sortieren, neuestes Datum oben
    safeArray.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setTrainings(safeArray);
  } catch {
    setTrainings([]);
  }
}, []);



  return (
    <main className="p-6 space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Alle Trainings</h1>

      <Link href="/" className="text-blue-600 underline">
        ← Zurück zur Startseite
      </Link>

      <div className="space-y-4">
        {trainings.length === 0 ? (
          <p>Noch keine Trainings vorhanden.</p>
        ) : (
          <div className="space-y-3">
            {trainings.map((t) => (
              <Link
                key={t.id}
                href={`/training/${t.id}`}
                className="block border rounded p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="font-semibold">{t.date}</div>
                <div className="text-sm opacity-80 line-clamp-2">
                  {t.workedWell || t.workedBad || "—"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
