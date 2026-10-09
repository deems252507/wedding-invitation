"use client";

export default function Particles() {
  const items = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${(i * 8 + 5) % 100}%`,
    delay: `${(i * 0.8) % 6}s`,
    duration: `${8 + (i % 5)}s`,
    size: 4 + (i % 4),
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
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
