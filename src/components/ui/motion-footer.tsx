"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { useWeddingData } from "@/lib/WeddingContext";

/**
 * Footer sinematik: tetap diam di belakang konten (fixed, z-0) dan terungkap
 * saat bagian terakhir halaman terangkat. Pasangkan dengan pembungkus konten
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
      className="fixed bottom-0 left-1/2 z-0 flex h-[70dvh] w-full max-w-[480px] -translate-x-1/2 flex-col items-center justify-end overflow-hidden bg-ink pb-10 pt-20 text-cream"
      style={{ "--r": 0 } as CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: "calc(0.15 + var(--r) * 0.35)",
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(212,175,55,0.3) 0%, transparent 60%)",
        }}
      />

      {names && (
        <div className="absolute top-10 w-full overflow-hidden opacity-30" aria-hidden>
          <div className="animate-marquee whitespace-nowrap font-display text-sm tracking-[0.4em] uppercase">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="mx-8">
                {names}
                {d.weddingDateLabel ? ` · ${d.weddingDateLabel}` : ""} ·
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className="relative z-10 mb-8 px-4 text-center"
        style={{
          opacity: "var(--r)",
          transform: "translateY(calc((1 - var(--r)) * 14%))",
        }}
      >
        <p className="mb-4 font-sans text-xs tracking-[0.35em] text-cream/60 uppercase">Thank You</p>
        {d.brideName && (
          <h2 className="font-script text-5xl leading-none text-cream sm:text-6xl">{d.brideName}</h2>
        )}
        {d.brideName && d.groomName && (
          <p className="my-2 font-display text-2xl italic text-cream/80">&amp;</p>
        )}
        {d.groomName && (
          <h2 className="font-script text-5xl leading-none text-cream sm:text-6xl">{d.groomName}</h2>
        )}
        {d.weddingDateLabel && (
          <p className="mt-6 font-sans text-xs tracking-[0.28em] text-cream/65 uppercase">
            {d.weddingDateLabel}
          </p>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-2" style={{ opacity: "var(--r)" }}>
        {names && (
          <p className="font-sans text-[10px] tracking-[0.25em] text-cream/40 uppercase">
            © {new Date().getFullYear()} · {names}
          </p>
        )}
        <a
          href="/admin"
          className="font-sans text-[0.5rem] tracking-widest text-cream/30 hover:text-cream/60"
        >
          Admin
        </a>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-block; animation: marquee 28s linear infinite; }
      `}</style>
    </footer>
  );
}
