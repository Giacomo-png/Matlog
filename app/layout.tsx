import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BJJ Journal",
  description: "Tracke deine BJJ-Trainings und Techniken.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="relative min-h-screen overflow-hidden text-slate-50">
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

          {/* Dunkler Overlay */}
          <div className="absolute inset-0 bg-slate-950/70 -z-0" />

          {/* Seiteninhalt */}
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
