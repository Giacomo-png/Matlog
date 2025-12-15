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
  videoUrl?: string; // später für BJJ Fanatics / YouTube etc.
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
      <main className="p-6 space-y-4 max-w-xl">
        <Link href="/moves" className="underline">
          ← Zurück zur Move-Liste
        </Link>
        <p>Move nicht gefunden.</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6 max-w-xl">
      <div className="flex items-center justify-between">
        <Link href="/moves" className="underline">
          ← Zurück
        </Link>
        <span className="text-sm opacity-80">{move.category}</span>
      </div>

      <h1 className="text-2xl font-bold">{move.name}</h1>

      {/* Beschreibung */}
      <div className="border rounded p-3 space-y-2">
        <div className="font-semibold">Beschreibung</div>
        {move.description ? (
          <p className="whitespace-pre-wrap">{move.description}</p>
        ) : (
          <p className="opacity-80">Noch keine Beschreibung hinterlegt.</p>
        )}
      </div>

      {/* Video Bereich (Platzhalter + optionaler Link) */}
      <div className="border rounded p-3 space-y-2">
        <div className="font-semibold">Video</div>

        {move.videoUrl ? (
          <a
            href={move.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Tutorial öffnen
          </a>
        ) : (
          <p className="opacity-80">
            Noch kein Video-Link hinterlegt. (Kommt als nächstes)
          </p>
        )}
      </div>
    </main>
  );
}
