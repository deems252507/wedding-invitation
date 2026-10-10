"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { useWeddingData } from "@/lib/WeddingContext";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { RevealText } from "@/components/ui/image-text-reveal";
import { Ornament } from "./Ornament";

type Img = { title: string; image: string };

const MAX_SCALE = 4;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ------------------------------------------------------------------ */
/* Lightbox: zoom (cubit / roda mouse / tombol / ketuk dua kali) + geser */
/* ------------------------------------------------------------------ */
function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: Img[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const touch = useRef<{
    sx: number;
    sy: number;
    px: number;
    py: number;
    pinchD: number;
    pinchS: number;
    pinched: boolean;
  } | null>(null);
  const drag = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const n = images.length;

  const go = (dir: number) => onIndex((index + dir + n) % n);

  const setZoom = (s: number) => {
    const next = clamp(s, 1, MAX_SCALE);
    setScale(next);
    if (next === 1) setPos({ x: 0, y: 0 });
  };

  useEffect(() => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % n);
      if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
      if (e.key === "+" || e.key === "=") setZoom(scale + 0.5);
      if (e.key === "-") setZoom(scale - 0.5);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, n, scale]);

  const dist = (t: React.TouchList) =>
    Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

  const onTouchStart = (e: React.TouchEvent) => {
    setBusy(true);
    if (e.touches.length === 2) {
      touch.current = {
        sx: 0,
        sy: 0,
        px: pos.x,
        py: pos.y,
        pinchD: dist(e.touches),
        pinchS: scale,
        pinched: true,
      };
    } else if (e.touches.length === 1) {
      touch.current = {
        sx: e.touches[0].clientX,
        sy: e.touches[0].clientY,
        px: pos.x,
        py: pos.y,
        pinchD: 0,
        pinchS: scale,
        pinched: touch.current?.pinched ?? false,
      };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const t = touch.current;
    if (!t) return;
    if (e.touches.length === 2 && t.pinchD > 0) {
      setZoom((t.pinchS * dist(e.touches)) / t.pinchD);
    } else if (e.touches.length === 1 && scale > 1) {
      setPos({
        x: t.px + (e.touches[0].clientX - t.sx),
        y: t.py + (e.touches[0].clientY - t.sy),
      });
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const t = touch.current;
    if (e.touches.length === 0) {
      setBusy(false);
      if (t && !t.pinched && scale === 1) {
        const dx = (e.changedTouches[0]?.clientX ?? 0) - t.sx;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }
      touch.current = null;
    }
  };

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur transition hover:bg-cream/20";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex touch-none items-center justify-center bg-ink/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau foto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onWheel={(e) => setZoom(scale - e.deltaY * 0.003)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <p className="font-kicker text-[0.7rem] tracking-[0.3em] text-cream/70 tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" className={btn} onClick={() => setZoom(scale - 0.75)} aria-label="Perkecil">
            <ZoomOut className="h-5 w-5" strokeWidth={1.6} />
          </button>
          <button type="button" className={btn} onClick={() => setZoom(scale + 0.75)} aria-label="Perbesar">
            <ZoomIn className="h-5 w-5" strokeWidth={1.6} />
          </button>
          <button type="button" className={btn} onClick={onClose} aria-label="Tutup">
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            className={`${btn} absolute left-2 top-1/2 z-10 -translate-y-1/2 sm:left-4`}
            onClick={() => go(-1)}
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.6} />
          </button>
          <button
            type="button"
            className={`${btn} absolute right-2 top-1/2 z-10 -translate-y-1/2 sm:right-4`}
            onClick={() => go(1)}
            aria-label="Berikutnya"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.6} />
          </button>
        </>
      )}

      <div
        className="flex max-h-[84vh] max-w-[min(94vw,640px)] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={images[index].image}
          src={images[index].image}
          alt={images[index].title || ""}
          draggable={false}
          onDoubleClick={() => setZoom(scale > 1 ? 1 : 2.5)}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse" || scale === 1) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            drag.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y };
            setBusy(true);
          }}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            setPos({ x: d.px + e.clientX - d.sx, y: d.py + e.clientY - d.sy });
          }}
          onPointerUp={() => {
            drag.current = null;
            setBusy(false);
          }}
          className={`max-h-[78vh] w-auto max-w-full select-none rounded-xl object-contain shadow-2xl ${
            busy ? "" : "transition-transform duration-200 ease-out"
          } ${scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
        />
        {images[index].title ? (
          <p
            className="mt-4 font-display text-lg italic text-cream/90 transition-opacity"
            style={{ opacity: scale > 1 ? 0 : 1 }}
          >
            {images[index].title}
          </p>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* Galeri 3D: kisi foto miring "terbentang" menjadi rata saat digulir   */
/* ------------------------------------------------------------------ */
export function Gallery() {
  const d = useWeddingData();
  const images = useMemo<Img[]>(() => (d.gallery || []).filter((g) => g.image), [d.gallery]);
  const sectionRef = useScrollProgress<HTMLElement>("sticky");
  const [open, setOpen] = useState<number | null>(null);
  const n = images.length;

  // 3 kolom; foto sedikit diulang agar kolom selalu penuh. Semua kartu berukuran SAMA (3:4).
  const columns = useMemo(() => {
    if (n === 0) return [] as { src: Img; idx: number }[][];
    const rows = Math.max(5, Math.ceil(n / 3));
    return [0, 1, 2].map((k) =>
      Array.from({ length: rows }, (_, j) => {
        const idx = (k + j * 3) % n;
        return { src: images[idx], idx };
      }),
    );
  }, [images, n]);

  if (n === 0) {
    return (
      <section id="galeri" className="bg-cream px-5 py-16 sm:px-8">
        <div className="text-center">
          <p className="eyebrow">GALLERY</p>
          <RevealText
            as="h2"
            text="Our Moments"
            by="char"
            stagger={42}
            className="mt-3 block font-display text-[2.5rem] font-medium italic leading-tight tracking-tight text-gold-grad"
          />
          <Ornament className="mt-4" />
        </div>
        <p className="mt-8 text-center font-sans text-sm text-ink/40">
          Galeri foto akan segera ditambahkan
        </p>
      </section>
    );
  }

  const colY = ["-35%", "0%", "-12%"]; // titik akhir: kolom bergerak berbeda arah (parallax)
  const colFrom = ["0%", "-35%", "-5%"];

  return (
    <section
      id="galeri"
      ref={sectionRef}
      className="relative w-full bg-ink"
      style={{ height: "330svh", "--p": 0 } as CSSProperties}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Kisi 3D */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "950px" }}
        >
          <div
            className="flex w-[138%] shrink-0 items-center justify-center gap-3 will-change-transform [backface-visibility:hidden]"
            style={
              {
                "--q": "min(1, calc(var(--p) * 1.2))",
                transformStyle: "preserve-3d",
                transform:
                  "rotateX(calc(26deg - var(--q) * 22deg)) rotateY(calc(-38deg + var(--q) * 32deg)) rotateZ(calc(14deg - var(--q) * 12deg)) translateZ(calc(-720px + var(--q) * 720px))",
              } as CSSProperties
            }
          >
            {columns.map((col, k) => (
              <div
                key={k}
                className="flex w-[30%] flex-col gap-3 will-change-transform"
                style={{
                  transform: `translateY(calc(${colFrom[k]} + var(--q) * (${colY[k]} - ${colFrom[k]})))`,
                }}
              >
                {col.map(({ src, idx }, j) => (
                  <button
                    key={`${k}-${j}`}
                    type="button"
                    onClick={() => setOpen(idx)}
                    aria-label={src.title ? `Perbesar foto: ${src.title}` : `Perbesar foto ${idx + 1}`}
                    className="group relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecd48f]"
                  >
                    <img
                      src={src.image}
                      alt={src.title || `Foto ${idx + 1}`}
                      loading={j < 2 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                    />
                    <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-[#ecd48f]/0 transition group-hover:ring-[#ecd48f]/50" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Peredam tepi supaya kisi menyatu dengan latar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[24%] bg-gradient-to-b from-ink via-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[24%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-[2] shadow-[inset_60px_0_60px_-30px_rgba(0,0,0,0.85),inset_-60px_0_60px_-30px_rgba(0,0,0,0.85)]" />

        {/* Judul di tengah, memudar saat kisi terbentang */}
        <div
          className="pointer-events-none absolute inset-0 z-[3] flex flex-col items-center justify-center px-6 text-center"
          style={{
            opacity: "calc(1 - var(--p) * 4)",
            transform: "translateY(calc(var(--p) * -10svh)) scale(calc(1 - var(--p) * 0.4))",
          }}
        >
          <p className="eyebrow !text-[#ecd48f]">GALLERY</p>
          <h2 className="mt-3 font-script text-[3.4rem] leading-tight text-gold-light">Our Moments</h2>
          <p className="mt-3 font-sans text-[0.62rem] tracking-[0.3em] text-cream/70 uppercase">
            Gulir untuk membuka
          </p>
        </div>

        {/* Petunjuk muncul setelah terbentang */}
        <p
          className="pointer-events-none absolute inset-x-0 bottom-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] z-[3] text-center font-sans text-[0.62rem] tracking-[0.3em] text-cream/75 uppercase"
          style={{ opacity: "clamp(0, calc(var(--p) * 4 - 2.4), 1)" }}
        >
          Ketuk foto untuk memperbesar
        </p>
      </div>

      {open !== null && (
        <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
