"use client";

export default function Particles() {
  const items = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${(i * 7 + 3) % 100}%`,
    delay: `${(i * 0.7) % 7}s`,
    duration: `${10 + (i % 6)}s`,
    size: 3 + (i % 4),
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
