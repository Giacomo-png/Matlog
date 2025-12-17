"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
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

      {/* Dunkler Overlay für Lesbarkeit */}
      <div className="absolute inset-0 bg-slate-950/70 -z-0" />

      {/* Inhalt */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 text-slate-50">
        <div className="w-full max-w-xl space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              BJJ Journal
            </h1>
            <p className="text-sm text-slate-200">
              Tracke deine Trainings, Moves und Fortschritte.
            </p>
          </header>

          <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
            <h2 className="text-lg font-semibold text-slate-100">
              Was möchtest du machen?
            </h2>

            <div className="grid gap-3">
              <Link
                href="/new-training"
                className="flex items-center justify-between bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg text-sm font-medium transition"
              >
                <span>Neues Training hinzufügen</span>
                <span className="text-xs opacity-80">+ Eintrag</span>
              </Link>

              <Link
                href="/moves"
                className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg text-sm font-medium transition"
              >
                <span>Move-Liste öffnen</span>
                <span className="text-xs text-slate-400">Lexikon</span>
              </Link>

              <Link
                href="/trainings"
                className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg text-sm font-medium transition"
              >
                <span>Alle Trainings ansehen</span>
                <span className="text-xs text-slate-400">Historie</span>
              </Link>

              <Link
                href="/stats"
                className="flex items-center justify-between bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-lg text-sm font-medium transition"
              >
                <span>Auswertung anzeigen</span>
                <span className="text-xs text-slate-400">Analytics</span>
              </Link>

              {/* Neuer Bereich: Coach / Academy / Community */}
              <Link
                href="/coach"
                className="flex items-center justify-between bg-emerald-700 hover:bg-emerald-600 px-4 py-3 rounded-lg text-sm font-semibold transition"
              >
                <span>Coach / Academy / Community</span>
                <span className="text-xs text-emerald-100">Beta</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
