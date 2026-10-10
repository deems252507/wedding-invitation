"use client";

import { useInView } from "@/components/ui/image-text-reveal";

/** Garis emas dengan berlian kecil di tengah; garisnya "menggambar" diri saat masuk layar. */
export function Ornament({ className = "" }: { className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.6);
  return (
    <div
      ref={ref}
      aria-hidden
      className={`orn ${inView ? "orn-in" : ""} ${className}`}
    >
      <span className="orn-dot" />
    </div>
  );
}

/** Partikel debu emas yang naik pelan (murni CSS, ringan). */
const DUST = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37 + 8) % 96}%`,
  dur: `${10 + ((i * 7) % 9)}s`,
  del: `${-((i * 1.9) % 12)}s`,
  dx: `${((i % 2 ? 1 : -1) * (10 + ((i * 5) % 26)))}px`,
  size: 2 + (i % 3),
}));

export function GoldDust() {
  return (
    <div className="gold-dust" aria-hidden>
      {DUST.map((d, i) => (
        <i
          key={i}
          style={
            {
              left: d.left,
              width: d.size,
              height: d.size,
              "--dur": d.dur,
              "--del": d.del,
              "--dx": d.dx,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
