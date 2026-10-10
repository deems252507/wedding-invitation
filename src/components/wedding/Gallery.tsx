"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { useWeddingData } from "@/lib/WeddingContext";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";

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
/* Galeri 3D (WebGL): foto melayang maju dari buram -> tajam. Foto bisa */
/* diketuk/diklik untuk dibuka di lightbox (zoom + geser).              */
/* ------------------------------------------------------------------ */
export function Gallery() {
  const d = useWeddingData();
  const images = useMemo<Img[]>(() => (d.gallery || []).filter((g) => g.image), [d.gallery]);
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(
    () => images.map((g) => ({ src: g.image, alt: g.title })),
    [images],
  );

  if (images.length === 0) {
    return (
      <section id="galeri" className="bg-cream px-5 py-16 sm:px-8">
        <div className="text-center">
          <p className="eyebrow">GALLERY</p>
          <h2 className="mt-3 font-display text-[2.5rem] font-medium italic leading-tight tracking-tight text-[#a8822f]">
            Our Moments
          </h2>
        </div>
        <p className="mt-8 text-center font-sans text-sm text-ink/40">
          Galeri foto akan segera ditambahkan
        </p>
      </section>
    );
  }

  return (
    <section
      id="galeri"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink"
    >
      <InfiniteGallery
        images={items}
        onSelect={setOpen}
        visibleCount={Math.min(10, Math.max(6, images.length))}
        className="absolute inset-0"
      />

      {/* Peredam tepi supaya foto menyatu dengan latar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[22%] bg-gradient-to-b from-ink via-ink/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[22%] bg-gradient-to-t from-ink via-ink/60 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] flex flex-col items-center px-6 pt-[max(3.5rem,env(safe-area-inset-top))] text-center">
        <p className="eyebrow !text-[#ecd48f]">GALLERY</p>
        <h2 className="mt-2 font-script text-[3.2rem] leading-tight text-gold-light">Our Moments</h2>
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] z-[3] text-center font-sans text-[0.62rem] uppercase tracking-[0.3em] text-cream/75">
        Ketuk foto untuk memperbesar
      </p>

      {open !== null && (
        <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
