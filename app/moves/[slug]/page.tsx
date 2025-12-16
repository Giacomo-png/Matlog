"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { MOVES } from "../moves";

type Move = {
  name: string;
  slug: string;
  category: string;
  description?: string;
  videoUrl?: string;
};

export default function MoveDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const move = useMemo<Move | null>(() => {
    if (!slug) return null;
    return (MOVES as Move[]).find((m) => m.slug === slug) ?? null;
  }, [slug]);

  if (!move) {
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
          <div className="w-full max-w-md space-y-4">
            <header className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Move nicht gefunden</h1>
              <Link
                href="/moves"
                className="text-sm text-blue-400 underline hover:text-blue-300"
              >
                ← Zurück
              </Link>
            </header>

            <section className="border border-slate-800 bg-slate-900/80 rounded-xl p-4 shadow-lg text-sm text-slate-200">
              Dieser Move existiert nicht in deiner aktuellen Matlog‑Move‑Liste.
            </section>
          </div>
        </div>
      </main>
    );
  }

  const hasVideo = Boolean(move.videoUrl);

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
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Move Detail
              </p>
              <h1 className="text-2xl font-bold">{move.name}</h1>
              <p className="text-xs text-slate-300">
                Kategorie:{" "}
                <span className="font-medium text-slate-100">
                  {move.category}
                </span>
              </p>
            </div>
            <Link
              href="/moves"
              className="text-sm text-blue-400 underline hover:text-blue-300"
            >
              ← Zurück
            </Link>
          </header>

          {/* Haupt‑Card */}
          <section className="border border-slate-800 bg-slate-900/75 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg">
            {/* Kategorie‑Badge + Slug */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-slate-300 uppercase tracking-wide">
                {move.category}
              </span>
              <span className="px-2 py-1 rounded-full bg-slate-950/60 border border-slate-700 text-slate-400">
                {move.slug}
              </span>
            </div>

            {/* Beschreibung */}
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-slate-100">
                Beschreibung
              </h2>
              {move.description ? (
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {move.description}
                </p>
              ) : (
                <p className="text-sm text-slate-400">
                  Noch keine Beschreibung hinterlegt.
                </p>
              )}
            </div>

            {/* Video Bereich */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-slate-100">
                Video
              </h2>

              {hasVideo ? (
                <a
                  href={move.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-500/60 bg-red-500/15 hover:bg-red-500/25 text-sm text-red-100 transition-colors"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold">
                    ▶
                  </span>
                  <span>Tutorial öffnen</span>
                  <span className="text-[11px] opacity-80">
                    YouTube in neuem Tab
                  </span>
                </a>
              ) : (
                <p className="text-sm text-slate-400">
                  Noch kein Video‑Link hinterlegt. (Kommt als nächstes)
                </p>
              )}
            </div>
          </section>

          {/* Kleiner Trainings‑Hint */}
          <section className="border border-slate-800 bg-slate-900/75 rounded-xl p-4 space-y-2 shadow-lg text-sm mb-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Tipp für dein Training
            </h2>
            <p className="text-slate-200">
              Nutze diesen Move in deinen Sessions und tracke in Matlog, ob er
              geklappt hat. So taucht er in deinen Move‑Stats & der
              Fokus‑Empfehlung auf.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
