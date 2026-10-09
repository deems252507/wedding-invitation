"use client";

/** Very subtle floating dots – low opacity, slow */
export default function Particles() {
  const items = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: `${12 + i * 15}%`,
    delay: `${i * 1.5}s`,
    duration: `${14 + i * 2}s`,
    size: 2 + (i % 2),
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-40">
      {items.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}
