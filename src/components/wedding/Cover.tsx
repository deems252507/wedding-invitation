"use client";

import { useEffect, useState } from "react";
import { useWeddingData } from "@/lib/WeddingContext";
import { TextParticle } from "@/components/ui/text-particle";
import { FlowButton } from "@/components/ui/flow-button";

export function Cover({ guest, onOpen }: { guest: string; onOpen: () => void }) {
  const d = useWeddingData();
  const slides = (
    d.coverPhotos?.length
      ? d.coverPhotos
      : d.coverPhoto
        ? [d.coverPhoto]
        : []
  ).filter(Boolean);

  const [idx, setIdx] = useState(0);
  const coupleText = `${d.brideName || "Bride"} & ${d.groomName || "Groom"}`;

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-ink">
      {slides.length ? (
        slides.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            width={1024}
            height={1536}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
              i === idx ? "opacity-100 animate-kenburns" : "opacity-0"
            }`}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/35 to-ink/85" />

      {/* Particle text layer (names) – interactive on hover/sweep */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-25" aria-hidden="true">
        <TextParticle
          text={coupleText}
          particleDensity={3.5}
          particleSize={1.8}
          particleColor="#f5f0e8"
          fontSize={typeof window !== "undefined" && window.innerWidth < 640 ? 56 : 100}
        />
      </div>

      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-between px-6 py-12 text-center text-cream pointer-events-none">
        <div className="pt-6 pointer-events-none">
          <p className="animate-text-mask font-sans text-xs tracking-[0.38em] text-cream/90">
            {d.coverTitle || "The Wedding of"}
          </p>
        </div>

        <div className="flex w-full max-w-xl flex-col items-center gap-1 pointer-events-none">
          <h1 className="animate-text-left font-script text-5xl leading-tight text-cream drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl">
            {d.groomName}
          </h1>
          <p className="animate-text-mask stagger-2 font-display text-2xl italic text-gold-light">&amp;</p>
          <h2 className="animate-text-right font-script text-5xl leading-tight text-cream drop-shadow-[0_3px_18px_rgba(0,0,0,0.55)] sm:text-6xl md:text-7xl">
            {d.brideName}
          </h2>
          <p className="animate-text-mask stagger-3 mt-4 font-sans text-sm tracking-[0.18em] text-cream/90 drop-shadow">
            {d.weddingDateLabel}
          </p>

          <div className="pointer-events-auto mt-8">
            <FlowButton
              text="Buka Undangan"
              onClick={onOpen}
              className="min-h-12 !border-cream/60 !text-cream hover:!text-ink [&_span]:!bg-cream"
            />
          </div>
        </div>

        <div className="animate-text-mask stagger-5 pb-2 pointer-events-none">
          <p className="font-sans text-[0.65rem] tracking-[0.28em] text-cream/70">KEPADA YTH.</p>
          <p className="mt-1 font-display text-xl text-cream">{guest}</p>
        </div>
      </div>
    </div>
  );
}
