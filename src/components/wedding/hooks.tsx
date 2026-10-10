import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) el.classList.add("is-visible");
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

type RevealVariant = "up" | "depth" | "tilt-left" | "tilt-right" | "flip" | "left" | "right";

export function Reveal({
  children,
  className = "",
  wrapperClassName = "",
  variant = "depth",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  variant?: RevealVariant;
  delay?: number;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div className={`scene ${wrapperClassName}`}>
      <div
        ref={ref}
        className={`reveal reveal-${variant} ${className}`}
        style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

/** Scroll-linked parallax: returns a ref for the element to drift in Z/Y. */
export function useParallax<T extends HTMLElement>(strength = 0.18) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const shift = -progress * strength * 100;
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(1.16)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);
  return ref;
}

/** Pointer-driven 3D tilt for cards and photos. */
export function useTilt<T extends HTMLElement>(max = 9) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(14px)`;
    };
    const reset = () => {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, [max]);
  return ref;
}

export function Tilt({
  children,
  className = "",
  max = 9,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useTilt<HTMLDivElement>(max);
  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  );
}

export function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const raw = target.getTime() - now;
  const diff = Number.isFinite(raw) ? Math.max(0, raw) : 0;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
