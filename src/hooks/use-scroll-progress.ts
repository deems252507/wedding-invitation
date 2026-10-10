import { useEffect, useRef } from "react";

/**
 * Menulis progres scroll (0..1) ke CSS variable `--p` pada elemen.
 * Tanpa re-render React: hanya style.setProperty di dalam requestAnimationFrame.
 *
 * mode:
 *  - "leave"   : 0 saat atas elemen menyentuh atas layar, 1 saat elemen sepenuhnya lewat
 *  - "through" : 0 saat elemen mulai masuk dari bawah, 1 saat elemen selesai keluar di atas
 *  - "sticky"  : progres sepanjang elemen tinggi yang berisi konten sticky
 *
 * Jika pengguna memilih prefers-reduced-motion, nilai akhir yang nyaman dipakai tanpa animasi.
 */
export type ScrollProgressMode = "leave" | "through" | "sticky";

export function useScrollProgress<T extends HTMLElement>(mode: ScrollProgressMode = "through") {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", mode === "sticky" ? "1" : mode === "leave" ? "0" : "0.5");
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh || r.top > vh * 2) return; // jauh di luar layar
      let p: number;
      if (mode === "leave") p = -r.top / Math.max(1, r.height);
      else if (mode === "sticky") p = -r.top / Math.max(1, r.height - vh);
      else p = (vh - r.top) / (vh + r.height);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode]);

  return ref;
}
