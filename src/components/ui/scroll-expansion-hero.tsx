"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

export default function ScrollExpandMedia({
  mediaType = "image",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title = "",
  date = "",
  scrollToExpand = "Scroll to Expand",
  textBlend = false,
  children,
}: ScrollExpandMediaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress 0 when section top hits viewport top, 1 when scrolled through ~1.2 viewports
      const start = -rect.top;
      const range = viewH * 1.2;
      const p = Math.min(1, Math.max(0, start / range));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scale from ~0.7 to 1, border-radius from large to 0
  const scale = 0.7 + progress * 0.3;
  const radius = Math.max(0, 32 - progress * 32);
  const opacityText = 1 - progress * 1.2;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[220vh] w-full bg-ink"
    >
      {bgImageSrc && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: `url(${bgImageSrc})`,
            opacity: 0.25 + progress * 0.15,
          }}
        />
      )}

      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div
          ref={mediaRef}
          className="relative overflow-hidden shadow-2xl transition-none"
          style={{
            width: `${70 + progress * 30}vw`,
            maxWidth: "100vw",
            height: `${50 + progress * 50}vh`,
            borderRadius: `${radius}px`,
            transform: `scale(${scale})`,
          }}
        >
          {mediaType === "video" ? (
            <video
              src={mediaSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={mediaSrc}
              alt={title}
              className="h-full w-full object-cover"
            />
          )}

          {/* Overlay text that blends / fades */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-black/30 px-6 text-center transition-opacity ${
              textBlend ? "mix-blend-difference" : ""
            }`}
            style={{ opacity: Math.max(0, opacityText) }}
          >
            {date && (
              <p className="mb-2 font-sans text-xs tracking-[0.35em] text-white/80 uppercase">
                {date}
              </p>
            )}
            {title && (
              <h2 className="font-script text-4xl text-white drop-shadow-lg sm:text-5xl md:text-6xl">
                {title}
              </h2>
            )}
            {scrollToExpand && progress < 0.4 && (
              <p className="mt-6 animate-pulse font-sans text-xs tracking-[0.2em] text-white/70">
                {scrollToExpand}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content that appears after expand */}
      <div className="relative z-10 bg-cream px-5 py-16 text-ink sm:px-8">
        {children}
      </div>
    </section>
  );
}
