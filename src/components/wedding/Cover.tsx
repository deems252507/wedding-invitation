"use client";

import { useEffect, useState } from "react";
import { ArrowDown, Heart, MailOpen } from "lucide-react";
import { useWeddingData } from "@/lib/WeddingContext";
import { FlowButton } from "@/components/ui/flow-button";

export function Cover({ guest, onOpen }: { guest: string; onOpen: () => void }) {
  const d = useWeddingData();
  const slides = (d.coverPhotos?.length ? d.coverPhotos : d.coverPhoto ? [d.coverPhoto] : []).filter(Boolean);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const groom = d.groomName?.trim() || "Rizky Dwi Maulana";
  const bride = d.brideName?.trim() || "Rizka Tri Oktavianti";
  const guestLabel = guest?.trim() || "Tamu Undangan";

  return (
    <main className="wedding-cover relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-[#211b1a] px-5 py-8 text-center text-[#fff9ef] sm:px-8 sm:py-10">
      {/* The admin-selected cover media remains the source of truth. */}
      {slides.length > 0 ? (
        slides.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            aria-hidden="true"
            fetchPriority={i === 0 ? "high" : "auto"}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 z-0 h-full w-full object-cover object-center transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none ${i === idx ? "opacity-100" : "opacity-0"}`}
          />
        ))
      ) : (
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,#70544a_0%,#352724_46%,#171313_100%)]" />
      )}

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(20,15,14,0.52)_0%,rgba(20,15,14,0.25)_38%,rgba(20,15,14,0.72)_100%)]" />
      <div className="absolute inset-3 z-[2] border border-[#e8d5ad]/50 sm:inset-5 md:inset-7" aria-hidden="true" />
      <div className="absolute inset-5 z-[2] border border-white/15 sm:inset-7 md:inset-9" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center py-8 sm:py-10">
        <div className="mb-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[#f2dfbc] sm:mb-9 sm:text-xs sm:tracking-[0.42em]">
          <span className="h-px w-7 bg-[#d8b77c]/80 sm:w-10" />
          <span>{d.coverTitle || "The Wedding Of"}</span>
          <span className="h-px w-7 bg-[#d8b77c]/80 sm:w-10" />
        </div>

        <div className="cover-title-reveal w-full">
          <p className="mb-2 font-display text-base italic tracking-wide text-white/85 sm:text-lg">Together with our families</p>
          <h1 className="mx-auto flex max-w-full flex-col items-center font-display font-light leading-[0.92] tracking-[-0.035em] drop-shadow-[0_3px_18px_rgba(0,0,0,0.35)]">
            <span className="max-w-full break-words text-[clamp(2.65rem,11vw,5.2rem)]">{groom}</span>
            <span className="my-2 flex items-center gap-3 font-display text-3xl italic text-[#e8c98e] sm:my-3 sm:text-4xl">
              <span className="h-px w-8 bg-[#e8c98e]/70 sm:w-12" />&<span className="h-px w-8 bg-[#e8c98e]/70 sm:w-12" />
            </span>
            <span className="max-w-full break-words text-[clamp(2.65rem,11vw,5.2rem)]">{bride}</span>
          </h1>
        </div>

        {d.weddingDateLabel ? (
          <p className="mt-6 text-xs tracking-[0.2em] text-white/90 sm:mt-8 sm:text-sm sm:tracking-[0.3em]">
            {d.weddingDateLabel}
          </p>
        ) : null}

        <div className="mt-8 w-full max-w-[19rem] rounded-sm border border-white/25 bg-[#211b1a]/35 px-5 py-4 shadow-[0_12px_50px_rgba(0,0,0,0.12)] backdrop-blur-[3px] sm:mt-10 sm:px-7 sm:py-5">
          <div className="mb-2 flex items-center justify-center gap-2 text-[#f0d9ae]">
            <Heart size={12} strokeWidth={1.5} />
            <p className="text-[9px] uppercase tracking-[0.26em] sm:text-[10px] sm:tracking-[0.32em]">Kepada Yth.</p>
            <Heart size={12} strokeWidth={1.5} />
          </div>
          <p className="break-words font-display text-2xl leading-tight text-white sm:text-3xl">{guestLabel}</p>
          <p className="mt-1 text-[10px] tracking-[0.18em] text-white/65">Di tempat</p>
        </div>

        <div className="mt-7 sm:mt-8">
          <FlowButton
            text="Buka Undangan"
            onClick={onOpen}
            className="!min-h-12 !min-w-[205px] !justify-center !border-[#e8c98e] !bg-[#e8c98e] !px-8 !py-3 !text-[#2a211b] hover:!text-[#2a211b] [&_svg]:!stroke-[#2a211b] [&_span:last-child]:!bg-[#f7e7c8]"
          />
        </div>

        <p className="mt-7 flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-white/70 sm:mt-8 sm:text-[10px] sm:tracking-[0.3em]">
          <MailOpen size={13} strokeWidth={1.5} />
          Sebuah undangan dengan penuh cinta
        </p>
        <div className="mt-5 flex flex-col items-center gap-1 text-white/55" aria-hidden="true">
          <ArrowDown size={15} strokeWidth={1.3} />
          <span className="text-[8px] uppercase tracking-[0.28em]">Open invitation</span>
        </div>
      </div>

      <style>{`
        .cover-title-reveal { animation: cover-rise 900ms cubic-bezier(.2,.75,.25,1) both; }
        @keyframes cover-rise { from { opacity: 0; transform: translateY(16px); filter: blur(5px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @media (prefers-reduced-motion: reduce) { .cover-title-reveal { animation: none; } }
      `}</style>
    </main>
  );
}
