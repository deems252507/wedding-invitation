"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Gift, Heart, Home, Images, MessageCircle } from "lucide-react";
import { useWeddingData } from "@/lib/WeddingContext";

type NavItem = { id: string; label: string; Icon: typeof Home };

/**
 * Navbar melayang di bawah layar: pindah antar bagian tanpa harus scroll panjang.
 * Muncul setelah pengunjung mulai menggulir; item aktif mengikuti posisi halaman.
 */
export function Navbar() {
  const d = useWeddingData();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState("beranda");

  const items = useMemo<NavItem[]>(() => {
    const list: NavItem[] = [{ id: "beranda", label: "Beranda", Icon: Home }];
    if (d.brideName || d.groomName) list.push({ id: "mempelai", label: "Mempelai", Icon: Heart });
    if (d.events.length > 0) list.push({ id: "acara", label: "Acara", Icon: CalendarDays });
    if (d.gallery.length > 0) list.push({ id: "galeri", label: "Galeri", Icon: Images });
    list.push({ id: "ucapan", label: "Ucapan", Icon: MessageCircle });
    if (d.accounts.length > 0 || d.giftPhoto) list.push({ id: "kado", label: "Kado", Icon: Gift });
    return list;
  }, [d.brideName, d.groomName, d.events.length, d.gallery.length, d.accounts.length, d.giftPhoto]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setVisible(window.scrollY > window.innerHeight * 0.35);
      const probe = window.innerHeight * 0.4;
      let current = items[0]?.id ?? "beranda";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= probe) current = it.id;
      }
      setActive(current);
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
  }, [items]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: id === "beranda" ? 0 : top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <nav
      aria-label="Navigasi undangan"
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
    >
      <ul className="pointer-events-auto flex w-full max-w-[420px] items-center justify-between gap-0.5 rounded-full border border-white/10 bg-ink/85 p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md">
        {items.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <li key={id} className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => go(id)}
                aria-label={label}
                aria-current={on ? "true" : undefined}
                className={`flex w-full flex-col items-center gap-0.5 rounded-full px-1 py-1.5 transition-all duration-300 ${
                  on ? "bg-[#b8933f]/25 text-[#ecd48f]" : "text-cream/60 hover:text-cream"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
                <span className="font-sans text-[0.5rem] tracking-[0.12em] uppercase">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
