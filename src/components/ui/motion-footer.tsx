"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useWeddingData } from "@/lib/WeddingContext";

/**
 * Footer sinematik: tetap diam di belakang konten (fixed, z-0) dan terungkap
 * saat bagian terakhir halaman terangkat. Hanya nama, tanggal, dan hak cipta. Pasangkan dengan pembungkus konten
 * `relative z-10 mb-[70dvh]` supaya tidak menutupi RSVP, ucapan, atau peta.
 */
export function CinematicFooter() {
  const d = useWeddingData();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      footer.style.setProperty("--r", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const remaining =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
      const r = 1 - remaining / Math.max(1, footer.offsetHeight);
      footer.style.setProperty("--r", Math.min(1, Math.max(0, r)).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const names = [d.brideName, d.groomName].filter(Boolean).join(" & ");

  return (
    <footer
      ref={footerRef}
      className="fixed bottom-0 left-1/2 z-0 flex h-[70dvh] w-full max-w-[480px] -translate-x-1/2 flex-col items-center justify-center overflow-hidden bg-ink px-6 pb-16 text-cream"
      style={{ "--r": 0 } as CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: "calc(0.15 + var(--r) * 0.45)",
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(212,175,55,0.3) 0%, transparent 60%)",
        }}
      />

      <div
        className="relative z-10 text-center"
        style={{
          opacity: "var(--r)",
          transform: "translateY(calc((1 - var(--r)) * 14%))",
        }}
      >
        {d.brideName && (
          <h2 className="font-script text-6xl leading-none text-cream sm:text-7xl">{d.brideName}</h2>
        )}
        {d.brideName && d.groomName && (
          <p className="my-3 font-display text-2xl italic text-[#ecd48f]/90">&amp;</p>
        )}
        {d.groomName && (
          <h2 className="font-script text-6xl leading-none text-cream sm:text-7xl">{d.groomName}</h2>
        )}
        {d.weddingDateLabel && (
          <p className="mt-8 font-kicker text-[0.72rem] tracking-[0.32em] text-[#ecd48f]/90 uppercase">
            {d.weddingDateLabel}
          </p>
        )}
      </div>

      {names && (
        <p
          className="absolute bottom-[max(6rem,calc(env(safe-area-inset-bottom)+5.5rem))] z-10 font-sans text-[10px] tracking-[0.25em] text-cream/45 uppercase"
          style={{ opacity: "var(--r)" }}
        >
          © {new Date().getFullYear()} · {names}
        </p>
      )}
    </footer>
  );
}
