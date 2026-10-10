"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

/** Memicu sekali saat elemen masuk layar. */
export function useInView<T extends Element>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView] as const;
}

interface RevealTextProps {
  text: string;
  /** Tag HTML yang dirender (h2, p, span, ...). */
  as?: ElementType;
  /** "word" = per kata, "char" = per huruf. */
  by?: "word" | "char";
  /** "rise" = naik dari balik topeng, "blur" = muncul dari buram. */
  variant?: "rise" | "blur";
  className?: string;
  /** Jeda awal (ms). */
  delay?: number;
  /** Jeda antar unit (ms). */
  stagger?: number;
}

/**
 * Image Text Reveal: teks terungkap bertahap saat masuk layar.
 * Teks asli tetap tersedia untuk pembaca layar lewat aria-label.
 */
export function RevealText({
  text,
  as: Tag = "span",
  by = "word",
  variant = "rise",
  className = "",
  delay = 0,
  stagger = 60,
}: RevealTextProps) {
  const [ref, inView] = useInView<HTMLElement>();
  const words = text.split(" ").filter(Boolean);
  let n = 0;

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={`rt rt-${variant} ${inView ? "rt-in" : ""} ${className}`}
    >
      {words.map((word, wi) => {
        const units = by === "char" ? Array.from(word) : [word];
        return (
          <span key={`${word}-${wi}`} aria-hidden="true" className="inline-block whitespace-nowrap">
            {units.map((u, ui) => {
              const i = n++;
              return (
                <span key={ui} className="rt-mask">
                  <span className="rt-inner" style={{ transitionDelay: `${delay + i * stagger}ms` }}>
                    {u}
                  </span>
                </span>
              );
            })}
            {wi < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}

interface RevealImageProps {
  src: string;
  alt: string;
  /** Arah tirai pembuka. */
  from?: "left" | "right" | "bottom" | "center";
  className?: string;
  imgClassName?: string;
  delay?: number;
}

/** Foto terbuka seperti tirai (clip-path) sambil zoom-out halus. */
export function RevealImage({
  src,
  alt,
  from = "bottom",
  className = "",
  imgClassName = "",
  delay = 0,
}: RevealImageProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  return (
    <div
      ref={ref}
      className={`ri ri-${from} ${inView ? "ri-in" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      <img src={src} alt={alt} loading="lazy" className={`ri-img ${imgClassName}`} />
    </div>
  );
}
