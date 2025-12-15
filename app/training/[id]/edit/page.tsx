"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Training = {
  id: string;
  date: string; // YYYY-MM-DD
  workedWell: string;
  workedBad: string;
  moveSlugs?: string[]; // falls du es schon nutzt
  createdAt: number;
};

const STORAGE_KEY = "bjj_journal_trainings_v1";

function loadTrainings(): Training[] {
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

export default function EditTrainingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = useMemo(() => params?.id, [params]);

  const [loaded, setLoaded] = useState(false);
  const [training, setTraining] = useState<Training | null>(null);

  const [date, setDate] = useState("");
  const [workedWell, setWorkedWell] = useState("");
  const [workedBad, setWorkedBad] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const all = loadTrainings();
    const found = all.find((t) => t.id === id) ?? null;

    setTraining(found);
    if (found) {
      setDate(found.date);
      setWorkedWell(found.workedWell ?? "");
      setWorkedBad(found.workedBad ?? "");
    }

    setLoaded(true);
  }, [id]);

  function onSave() {
    setError(null);
    if (!training || !id) return;

    if (!date) return setError("Bitte ein Datum auswählen.");
    if (!workedWell.trim() && !workedBad.trim())
      return setError("Schreib mindestens bei einer Box etwas rein.");

    const all = loadTrainings();

    const updated = all.map((t) => {
      if (t.id !== id) return t;

      return {
        ...t,
        date,
        workedWell: workedWell.trim(),
        workedBad: workedBad.trim(),
      };
    });

    saveTrainings(updated);

    router.push(`/training/${id}`);
    router.refresh();
  }

  if (!loaded) {
    return (
      <main className="p-6 space-y-4 max-w-xl">
        <Link href="/" className="underline">← Zurück</Link>
        <p>Lade…</p>
      </main>
    );
  }

  if (!training) {
    return (
      <main className="p-6 space-y-4 max-w-xl">
        <Link href="/" className="underline">← Zurück</Link>
        <p>Training nicht gefunden.</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4 max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Training bearbeiten</h1>
        <Link href={`/training/${id}`} className="underline">
          ← Zurück
        </Link>
      </div>

      <label className="block">
        <span className="block mb-1 font-medium">Datum</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </label>

      <label className="block">
        <span className="block mb-1 font-medium">Was hat geklappt?</span>
        <textarea
          value={workedWell}
          onChange={(e) => setWorkedWell(e.target.value)}
          className="border rounded px-3 py-2 w-full min-h-[110px]"
        />
      </label>

      <label className="block">
        <span className="block mb-1 font-medium">Was hat nicht geklappt?</span>
        <textarea
          value={workedBad}
          onChange={(e) => setWorkedBad(e.target.value)}
          className="border rounded px-3 py-2 w-full min-h-[110px]"
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex gap-3">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Speichern
        </button>

        <button
          onClick={() => router.push(`/training/${id}`)}
          className="border px-4 py-2 rounded"
        >
          Abbrechen
        </button>
      </div>
    </main>
  );
}
