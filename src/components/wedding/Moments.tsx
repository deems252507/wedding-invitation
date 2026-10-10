"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useWeddingData } from "@/lib/WeddingContext";
import { GoldDust } from "./Ornament";

/**
 * Momen: layar penuh yang "menempel" saat digulir. Foto/video (diunggah dari admin)
 * berganti mengikuti scroll, dengan zoom halus dan teks yang muncul bergantian.
 */
export function Moments() {
  const d = useWeddingData();
  const items = d.moments || [];
  const n = items.length;
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || n === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh || r.top > vh * 2) return;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - vh)));
      el.style.setProperty("--p", p.toFixed(4));
      setActive(Math.min(n - 1, Math.floor(p * n)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    if (!reduce) window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  // Hanya video yang sedang tampil yang diputar (hemat baterai & kuota).
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) void v.play().catch(() => {});
      else v.pause();
    });
  }, [active]);

  if (n === 0) return null;
  const cur = items[active];

  return (
    <section
      id="momen"
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: `${n * 90 + 110}svh`, "--p": 0 } as CSSProperties}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {items.map((m, i) => (
          <div
            key={`${m.url}-${i}`}
            className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== active}
          >
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform:
                  i === active
                    ? "scale(calc(1.18 - var(--p) * 0.1)) translateY(calc(var(--p) * -2svh))"
                    : "scale(1.18)",
                transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {m.type === "video" ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={m.url}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={m.url}
                  alt={m.title || ""}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover object-[50%_25%]"
                />
              )}
            </div>
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent via-30% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <GoldDust />

        <div className="absolute inset-x-0 top-0 z-[2] flex items-center justify-between px-6 pt-[max(2.25rem,env(safe-area-inset-top))]">
          <p className="eyebrow tracking-[0.42em] !text-[#ecd48f]">OUR JOURNEY</p>
          <p className="font-kicker text-[0.7rem] tracking-[0.3em] text-cream/80 tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[2] px-7 pb-[max(7.5rem,calc(env(safe-area-inset-bottom)+6.5rem))] text-center">
          <div key={active}>
            {cur?.title ? (
              <h3 className="animate-text-scale font-script text-[2.6rem] leading-tight text-gold-light">
                {cur.title}
              </h3>
            ) : null}
            {cur?.caption ? (
              <p className="animate-text-mask stagger-2 mx-auto mt-2 max-w-xs font-display text-[1.1rem] italic leading-relaxed text-cream/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                {cur.caption}
              </p>
            ) : null}
          </div>
          <div className="mx-auto mt-6 h-px w-24 overflow-hidden bg-cream/20">
            <div
              className="h-full origin-left bg-[#ecd48f]"
              style={{ transform: "scaleX(var(--p))" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
