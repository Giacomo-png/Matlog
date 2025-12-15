"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MOVES } from "../moves/moves";

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

export default function NewTrainingPage() {
  const router = useRouter();

  // heute im Format YYYY-MM-DD
  const today = useMemo(
    () => new Date().toISOString().slice(0, 10),
    []
  );

  const sortedMoves = useMemo(() => {
    return MOVES.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const [date, setDate] = useState(today);
  const [workedWell, setWorkedWell] = useState("");
  const [workedBad, setWorkedBad] = useState("");
  const [moves, setMoves] = useState<TrainingMoveResult[]>([]);
  const [error, setError] = useState<string | null>(null);

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

    if (!date) return setError("Bitte ein Datum auswählen.");
    if (!workedWell.trim() && !workedBad.trim())
      return setError("Schreib mindestens bei einer Box etwas rein.");

    const newTraining: Training = {
      id: crypto.randomUUID(),
      date,
      workedWell: workedWell.trim(),
      workedBad: workedBad.trim(),
      moves,
      createdAt: Date.now(),
    };

    const existing = loadTrainings();
    const updated = [newTraining, ...existing].sort(
      (a, b) => b.createdAt - a.createdAt
    );
    saveTrainings(updated);

    router.push("/");
    router.refresh();
  }

  return (
    <main className="p-6 space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Neues Training</h1>

      <label className="block">
        <span className="block mb-1 font-medium">Datum</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
          className="border rounded px-3 py-2 w-full"
        />
      </label>

      <div className="space-y-2">
        <div className="font-medium">Moves (optional)</div>
        <div className="border rounded p-3 max-h-56 overflow-auto space-y-2">
          {sortedMoves.map((m) => {
            const current = moves.find((x) => x.slug === m.slug);
            const value =
              current?.success === true
                ? "ok"
                : current?.success === false
                ? "bad"
                : "none";

            return (
              <div key={m.slug} className="flex flex-col gap-1 border-b pb-2">
                <div className="flex justify-between items-center">
                  <span>
                    {m.name}{" "}
                    <span className="text-sm opacity-70">({m.category})</span>
                  </span>
                </div>
                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setMoveResult(m.slug, true)}
                    className={
                      "px-2 py-1 rounded border " +
                      (value === "ok" ? "bg-green-200" : "")
                    }
                  >
                    geklappt
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoveResult(m.slug, false)}
                    className={
                      "px-2 py-1 rounded border " +
                      (value === "bad" ? "bg-red-200" : "")
                    }
                  >
                    nicht geklappt
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoveResult(m.slug, null)}
                    className="px-2 py-1 rounded border text-xs"
                  >
                    zurücksetzen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-sm opacity-70">
          Ausgewählt: {moves.length}
        </div>
      </div>

      <label className="block">
        <span className="block mb-1 font-medium">Was hat geklappt?</span>
        <textarea
          value={workedWell}
          onChange={(e) => setWorkedWell(e.target.value)}
          className="border rounded px-3 py-2 w-full min-h-[110px]"
          placeholder="z.B. Guard Retention war stabil, Triangle Setup funktioniert…"
        />
      </label>

      <label className="block">
        <span className="block mb-1 font-medium">Was hat nicht geklappt?</span>
        <textarea
          value={workedBad}
          onChange={(e) => setWorkedBad(e.target.value)}
          className="border rounded px-3 py-2 w-full min-h-[110px]"
          placeholder="z.B. beim Pass zu viel Raum gelassen, Armbar Finish fehlt…"
        />
      </label>

      {error ? (
        <p className="text-sm" style={{ color: "red" }}>
          {error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Speichern
        </button>

        <button
          onClick={() => router.push("/")}
          className="border px-4 py-2 rounded"
        >
          Abbrechen
        </button>
      </div>
    </main>
  );
}
