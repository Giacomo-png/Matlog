"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MOVES } from "../../moves/moves";

type Training = {
  id: string;
  date: string;
  workedWell: string;
  workedBad: string;
  moveSlugs: string[]; // ✅ NEU
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trainings));
}

export default function TrainingDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

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

    // ✅ Fallback für alte Trainings, die noch kein moveSlugs haben
    const normalized = found
      ? { ...found, moveSlugs: Array.isArray(found.moveSlugs) ? found.moveSlugs : [] }
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
      <main className="p-6 space-y-4 max-w-xl">
        <Link href="/" className="underline">
          ← Zurück
        </Link>
        <p>Lade…</p>
      </main>
    );
  }

  if (!training) {
    return (
      <main className="p-6 space-y-4 max-w-xl">
        <Link href="/" className="underline">
          ← Zurück
        </Link>
        <p>Training nicht gefunden.</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <Link href="/" className="underline">
          ← Zurück
        </Link>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/training/${id}/edit`)}
            className="border px-3 py-2 rounded"
          >
            Bearbeiten
          </button>

          <button
            onClick={onDelete}
            className="border px-3 py-2 rounded text-red-600"
          >
            Löschen
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold">Training vom {training.date}</h1>

      {/* ✅ MOVES */}
      <div className="border rounded p-3 space-y-2">
        <div className="font-semibold">Moves</div>
        {training.moveSlugs.length === 0 ? (
          <p className="text-sm opacity-80">Keine Moves gespeichert.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {training.moveSlugs.map((slug) => {
              const m = movesBySlug.get(slug);
              return (
                <Link
                  key={slug}
                  href={`/moves/${slug}`}
                  className="border rounded px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {m?.name ?? slug}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {training.workedWell ? (
        <div className="border rounded p-3">
          <div className="font-semibold mb-1">Geklappt</div>
          <p className="whitespace-pre-wrap">{training.workedWell}</p>
        </div>
      ) : null}

      {training.workedBad ? (
        <div className="border rounded p-3">
          <div className="font-semibold mb-1">Nicht geklappt</div>
          <p className="whitespace-pre-wrap">{training.workedBad}</p>
        </div>
      ) : null}
    </main>
  );
}
