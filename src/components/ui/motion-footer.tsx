"use client";

import { useEffect, useRef } from "react";
import { useWeddingData } from "@/lib/WeddingContext";

export function CinematicFooter() {
  const d = useWeddingData();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      footer.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) footer.classList.add("is-visible");
    }, { threshold: 0.12 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const names = `${d.brideName || "Bride"} & ${d.groomName || "Groom"}`;

  return (
    <footer
      ref={footerRef}
      className="relative z-10 flex min-h-[70vh] flex-col items-center justify-end overflow-hidden bg-ink pb-12 pt-24 text-cream opacity-0 translate-y-8 transition-[opacity,transform] duration-1000 ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 [&.is-visible]:translate-y-0 [&.is-visible]:opacity-100"
      style={
        {
          ["--reveal" as string]: 0,
        } as React.CSSProperties
      }
    >
      {/* Aurora glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(212,175,55,0.25) 0%, transparent 60%)",
        }}
      />
      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Marquee */}
      <div className="absolute top-10 w-full overflow-hidden opacity-30">
        <div className="animate-marquee whitespace-nowrap font-display text-sm tracking-[0.4em] uppercase">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-8">
              {names} · Save the Date · {d.weddingDateLabel || ""} ·
            </span>
          ))}
        </div>
      </div>

      {/* Giant masked typography */}
      <div className="relative z-10 mb-8 px-4 text-center">
        <p className="mb-3 font-sans text-xs tracking-[0.35em] text-cream/60 uppercase">
          Thank You
        </p>
        <h2 className="font-script text-5xl leading-none text-cream sm:text-6xl md:text-7xl">
          {d.brideName}
        </h2>
        <p className="my-2 font-display text-2xl italic text-cream/80">&</p>
        <h2 className="font-script text-5xl leading-none text-cream sm:text-6xl md:text-7xl">
          {d.groomName}
        </h2>
        <p className="mt-6 max-w-md mx-auto font-sans text-sm leading-relaxed text-cream/70">
          Terima kasih atas doa dan kehadiran Anda. Semoga Tuhan memberkati kita
          semua.
        </p>
      </div>

      <p className="relative z-10 font-sans text-[10px] tracking-[0.25em] text-cream/40 uppercase">
        © {new Date().getFullYear()} · Wedding Invitation
      </p>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </footer>
  );
}
