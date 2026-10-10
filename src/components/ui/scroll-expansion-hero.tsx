"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  /** Poster untuk video, juga dipakai sebagai cadangan jika video gagal dimuat. */
  posterSrc?: string;
  title?: string;
  /** Kata kedua; jika diisi, kedua judul bergeser berlawanan arah saat digulir. */
  titleEnd?: string;
  date?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

/**
 * Scroll Expansion Hero: media membesar dari kartu menjadi layar penuh saat digulir.
 * Progres ditulis ke CSS variable --p (tanpa re-render React). Tidak mengunci scroll.
 */
export default function ScrollExpandMedia({
  mediaType = "image",
  mediaSrc,
  posterSrc = "",
  title = "",
  titleEnd = "",
  date = "",
  scrollToExpand = "Gulir untuk melihat",
  children,
}: ScrollExpandMediaProps) {
  const sectionRef = useScrollProgress<HTMLElement>("sticky");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // Video: muted, hanya berputar saat terlihat, dan tidak autoplay bila gerak dikurangi.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (mediaType !== "video" || !video || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [mediaType, sectionRef]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  };

  const useVideo = mediaType === "video" && !videoFailed;
  const still = posterSrc || (mediaType === "image" ? mediaSrc : "");

  return (
    <section
      ref={sectionRef}
      className="relative h-[240dvh] w-full bg-ink"
      style={{ "--p": 0 } as CSSProperties}
    >
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
        {/* Media yang membesar */}
        <div
          className="relative overflow-hidden shadow-2xl will-change-[width,height]"
          style={{
            width: "calc(68% + var(--p) * 32%)",
            height: "calc(54dvh + var(--p) * 46dvh)",
            borderRadius: "calc((1 - var(--p)) * 28px)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ transform: "scale(calc(1.18 - var(--p) * 0.18))" }}
          >
            {useVideo ? (
              <video
                ref={videoRef}
                src={mediaSrc}
                poster={posterSrc || undefined}
                muted
                loop
                playsInline
                preload="metadata"
                onError={() => setVideoFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <img src={still} alt={title} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/35" />

          {useVideo && (
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Jeda video" : "Putar video"}
              className="absolute right-3 bottom-3 z-[3] flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
          )}
        </div>

        {/* Teks: kedua judul bergeser berlawanan arah lalu memudar */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center text-white"
          style={{ opacity: "calc(1 - var(--p) * 1.7)" }}
        >
          {date && (
            <p className="mb-3 font-sans text-xs tracking-[0.35em] text-white/85 uppercase">{date}</p>
          )}
          {title && (
            <h2
              className="font-script text-5xl leading-none drop-shadow-lg sm:text-6xl"
              style={{ transform: "translateX(calc(var(--p) * -55vw))" }}
            >
              {title}
            </h2>
          )}
          {titleEnd && (
            <h2
              className="mt-1 font-script text-5xl leading-none drop-shadow-lg sm:text-6xl"
              style={{ transform: "translateX(calc(var(--p) * 55vw))" }}
            >
              {titleEnd}
            </h2>
          )}
        </div>

        {scrollToExpand && (
          <p
            className="pointer-events-none absolute bottom-8 z-[2] animate-pulse font-sans text-[0.65rem] tracking-[0.3em] text-white/80 uppercase"
            style={{ opacity: "calc(1 - var(--p) * 8)" }}
          >
            {scrollToExpand}
          </p>
        )}
      </div>

      {children ? (
        <div className="relative z-10 bg-cream px-5 py-16 text-ink sm:px-8">{children}</div>
      ) : null}
    </section>
  );
}
