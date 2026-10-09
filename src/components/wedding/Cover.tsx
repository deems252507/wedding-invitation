import { useEffect, useState } from "react";
import { useWeddingData } from "@/lib/WeddingContext";

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

      <div className="absolute inset-0 flex flex-col items-center justify-between px-6 py-12 text-center text-cream">
        <div className="pt-6">
          <p className="animate-text-mask font-sans text-xs tracking-[0.38em] text-cream/90">
            {d.coverTitle || "The Wedding of"}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h1 className="animate-text-left font-script text-[3.4rem] leading-none tracking-wide text-cream drop-shadow-md sm:text-6xl">
            {d.brideName}
          </h1>
          <p className="animate-text-mask stagger-2 font-display text-2xl italic text-cream/90">
            &amp;
          </p>
          <h1 className="animate-text-right stagger-2 font-script text-[3.4rem] leading-none tracking-wide text-cream drop-shadow-md sm:text-6xl">
            {d.groomName}
          </h1>
          <p className="animate-text-mask stagger-3 mt-4 font-sans text-sm tracking-[0.18em] text-cream/85">
            {d.weddingDateLabel}
          </p>

          <button
            type="button"
            onClick={onOpen}
            className="animate-text-scale stagger-4 mt-8 inline-flex items-center gap-2 rounded-full border border-cream/50 bg-ink/40 px-6 py-2.5 font-sans text-xs tracking-[0.2em] text-cream backdrop-blur-sm transition hover:bg-cream hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M4 12h16M12 4l8 8-8 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Buka Undangan
          </button>

          {slides.length > 1 && (
            <div className="mt-6 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Cover ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-6 bg-cream" : "w-1.5 bg-cream/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="animate-text-mask stagger-5 pb-2">
          <p className="font-sans text-[0.65rem] tracking-[0.28em] text-cream/70">Kepada</p>
          <p className="mt-1 font-display text-xl text-cream">{guest}</p>
        </div>
      </div>
    </div>
  );
}
