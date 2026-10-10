"use client";

import { useEffect, useState } from "react";
import { MailOpen } from "lucide-react";
import { useWeddingData } from "@/lib/WeddingContext";

/**
 * Cover undangan.
 * - Foto penuh layar (100svh) dengan fokus ke bagian atas supaya wajah tidak tertutup.
 * - Semua teks ada di bawah (bukan di tengah foto) sehingga tidak bertabrakan dengan wajah.
 * - Tombol "Buka Undangan" adalah tombol padat berwarna emas: terbaca di semua ukuran layar,
 *   tanpa bergantung pada hover.
 */
export function Cover({ guest, onOpen }: { guest: string; onOpen: () => void }) {
  const d = useWeddingData();
  const slides = (
    d.coverPhotos?.length ? d.coverPhotos : d.coverPhoto ? [d.coverPhoto] : []
  ).filter(Boolean);

  const [idx, setIdx] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || reduce) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length, reduce]);

  return (
    <div className="relative h-[100svh] min-h-[520px] w-full overflow-hidden bg-ink">
      {slides.length ? (
        slides.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover object-[50%_18%] transition-opacity duration-[1200ms] ease-in-out ${
              i === idx ? "opacity-100 animate-kenburns" : "opacity-0"
            }`}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-ink" />
      )}

      {/* Scrim: gelap di atas (judul) dan kuat di bawah (nama, tombol) — wajah tetap bersih */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent via-35% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-ink via-ink/80 to-transparent" />

      <div className="cover-stack absolute inset-0 z-[2] flex flex-col items-center justify-between px-6 pt-[max(2.5rem,env(safe-area-inset-top))] text-center text-cream">
        <p className="animate-text-mask font-kicker text-[0.72rem] tracking-[0.5em] text-cream/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
          THE WEDDING OF
        </p>

        <div className="flex w-full flex-col items-center">
          <h1
            className="cover-names animate-text-scale stagger-2 w-full font-script leading-[1.1]"
            style={{ fontSize: "clamp(2.8rem, 15vw, 4.6rem)" }}
          >
            <span className="block text-gold-light">{d.brideName}</span>
            {d.brideName && d.groomName ? (
              <span className="my-0.5 block font-display text-[0.45em] italic text-cream/80">
                &amp;
              </span>
            ) : null}
            <span className="block text-gold-light">{d.groomName}</span>
          </h1>

          {d.weddingDateLabel ? (
            <p className="animate-text-mask stagger-3 mt-5 font-kicker text-[0.8rem] tracking-[0.3em] text-cream/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
              {d.weddingDateLabel}
            </p>
          ) : null}

          <div className="animate-text-mask stagger-4 mt-7 flex flex-col items-center gap-1">
            <p className="font-sans text-[0.7rem] tracking-[0.3em] text-cream/70">Kepada Yth.</p>
            <p className="max-w-[80vw] break-words font-display text-[1.35rem] leading-tight text-cream">
              {guest}
            </p>
          </div>

          <div className="animate-text-mask stagger-5 mt-7">
            <button type="button" onClick={onOpen} className="cover-btn" aria-label="Buka Undangan">
              <MailOpen className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
              <span>Buka Undangan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
