import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Reveal, Smooth, useCountdown, useParallax } from "./hooks";
import { CalendarPlus, ChevronDown, Navigation } from "lucide-react";
import { useWeddingData } from "@/lib/WeddingContext";
import { RevealImage, RevealText, useInView } from "@/components/ui/image-text-reveal";
import { FlowButton } from "@/components/ui/flow-button";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { Ornament } from "./Ornament";

function SectionTitle({ kicker, title }: { kicker?: string; title: string; from?: "left" | "right" }) {
  return (
    <div className="text-center">
      {kicker ? (
        <Reveal variant="up">
          <p className="eyebrow">{kicker}</p>
        </Reveal>
      ) : null}
      <RevealText
        as="h2"
        text={title}
        by="char"
        stagger={42}
        className="mt-3 block font-display text-[2.5rem] font-medium italic leading-tight tracking-tight text-gold-grad"
      />
      <Ornament className="mt-4" />
    </div>
  );
}

function FadeUp({
  children,
  className = "",
  delay = 0,
  variant = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "zoom" | "mask";
}) {
  return (
    <Reveal variant={variant} className={className} delay={delay}>
      {children}
    </Reveal>
  );
}

export function Hero() {
  const d = useWeddingData();
  const slides = (
    d.heroPhotos?.length
      ? d.heroPhotos
      : [d.heroPhoto, ...(d.gallery || []).map((g) => g.image)]
  )
    .filter(Boolean)
    .filter((src, i, arr) => arr.indexOf(src) === i);

  const [idx, setIdx] = useState(0);

  const heroRef = useScrollProgress<HTMLElement>("leave");

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section
      id="beranda"
      ref={heroRef}
      className="relative h-[100svh] min-h-[520px] w-full overflow-hidden bg-ink"
      style={{ "--p": 0 } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: "scale(calc(1 + var(--p) * 0.14)) translateY(calc(var(--p) * 6vh))" }}
      >
        {slides.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={i === 0 ? `${d.brideName} dan ${d.groomName}` : ""}
            className={`absolute inset-0 h-full w-full object-cover object-[50%_20%] transition-opacity duration-[1200ms] ease-in-out ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      {/* Scrim bawah yang kuat: nama & tanggal selalu terbaca dan tidak menimpa wajah */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent via-35% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink via-ink/75 to-transparent" />
      <div
        className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-[max(4.5rem,calc(env(safe-area-inset-bottom)+3rem))] text-center"
        style={{
          transform: "translateY(calc(var(--p) * -14vh))",
          opacity: "calc(1 - var(--p) * 1.5)",
        }}
      >
        <p className="animate-text-mask font-kicker text-[0.72rem] tracking-[0.5em] text-cream/90">
          THE WEDDING OF
        </p>
        <h2
          className="animate-text-scale stagger-2 mt-3 w-full font-script leading-[1.1]"
          style={{ fontSize: "clamp(2.6rem, 14vw, 4.3rem)" }}
        >
          <span className="block text-gold-light">{d.brideName}</span>
          {d.brideName && d.groomName ? (
            <span className="my-0.5 block font-display text-[0.42em] italic text-cream/80">&amp;</span>
          ) : null}
          <span className="block text-gold-light">{d.groomName}</span>
        </h2>
        <div className="animate-text-mask stagger-3 mt-5 flex flex-col items-center gap-1.5">
          <p className="font-kicker text-[0.66rem] tracking-[0.45em] text-cream/70">SAVE THE DATE</p>
          <p className="font-display text-[1.3rem] italic text-cream">{d.weddingDateLabel}</p>
        </div>
      </div>
    </section>
  );
}

export function Quote() {
  const d = useWeddingData();
  return (
    <section className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-cream px-5 py-16 shadow-[0_-24px_40px_-24px_rgba(0,0,0,0.4)] sm:px-8 sm:py-20">
      <FadeUp className="mx-auto max-w-md text-center">
        <p className="font-display text-5xl leading-none text-gold/50">&ldquo;</p>
        <RevealText
          as="p"
          text={d.quote}
          variant="blur"
          stagger={45}
          className="mt-2 block font-display text-xl leading-relaxed italic text-ink sm:text-2xl"
        />
        <p className="mt-6 eyebrow">{d.quoteSource}</p>
      </FadeUp>
    </section>
  );
}

function igHandle(raw?: string) {
  return (raw || "")
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?].*$/, "");
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" />
    </svg>
  );
}

/** Satu mempelai = satu layar penuh: foto bergeser halus saat digulir, teks masuk perlahan satu per satu. */
function PersonPanel({
  photo,
  role,
  name,
  fullName,
  parents,
  instagram,
}: {
  photo: string;
  role: string;
  name: string;
  fullName: string;
  parents: string;
  instagram: string;
}) {
  const ref = useScrollProgress<HTMLDivElement>("through");
  const ig = igHandle(instagram);
  return (
    <div
      ref={ref}
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink"
      style={{ "--p": 0 } as React.CSSProperties}
    >
      {photo ? (
        <img
          src={photo}
          alt={name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[50%_22%] will-change-transform"
          style={{ transform: "translateY(calc((var(--p) - 0.5) * -8svh)) scale(1.14)" }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent via-30% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-ink via-ink/85 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-[max(7.5rem,calc(env(safe-area-inset-bottom)+6.5rem))] text-center">
        <Smooth>
          <p className="font-kicker text-[0.64rem] tracking-[0.5em] text-[#ecd48f]">{role}</p>
        </Smooth>
        <RevealText
          as="h3"
          text={name}
          by="char"
          stagger={90}
          delay={250}
          className="mt-3 block font-script text-[3.6rem] leading-[1.05] text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.5)]"
        />
        <Smooth delay={700}>
          <p className="mt-2 font-display text-[1.35rem] italic text-cream/90">{fullName}</p>
        </Smooth>
        {parents ? (
          <Smooth delay={950}>
            <p className="mx-auto mt-3 max-w-[18rem] font-sans text-[0.78rem] leading-relaxed text-cream/65">
              {parents}
            </p>
          </Smooth>
        ) : null}
        {ig ? (
          <Smooth delay={1200} variant="zoom">
            <a
              href={`https://instagram.com/${ig}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-cream/70 px-4 py-1.5 font-sans text-[0.75rem] text-cream transition hover:bg-cream hover:text-ink"
            >
              <InstagramIcon />
              {ig}
            </a>
          </Smooth>
        ) : null}
      </div>
    </div>
  );
}

export function Couple() {
  const d = useWeddingData();
  return (
    <section id="mempelai" className="relative bg-cream">
      <div className="px-5 py-20 sm:px-8 sm:py-24">
        <Smooth className="mx-auto max-w-md text-center">
          <Ornament className="mb-6" />
          <RevealText
            as="p"
            text={d.coupleIntro}
            variant="blur"
            stagger={34}
            className="block font-display text-[1.15rem] leading-[1.75] text-ink/75"
          />
        </Smooth>
      </div>
      {d.brideName ? (
        <PersonPanel
          photo={d.bridePhoto}
          role="MEMPELAI WANITA"
          name={d.brideName}
          fullName={d.brideFullName}
          parents={d.brideParents}
          instagram={d.brideInstagram}
        />
      ) : null}
      {d.groomName ? (
        <PersonPanel
          photo={d.groomPhoto}
          role="MEMPELAI PRIA"
          name={d.groomName}
          fullName={d.groomFullName}
          parents={d.groomParents}
          instagram={d.groomInstagram}
        />
      ) : null}
    </section>
  );
}

export function LoveStory() {
  const d = useWeddingData();
  const timelineRef = useScrollProgress<HTMLDivElement>("through");
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 sm:py-20">
      <SectionTitle title="Kisah Cinta" />
      <div ref={timelineRef} className="relative mx-auto mt-12 max-w-sm" style={{ "--p": 0 } as React.CSSProperties}>
        <div className="absolute top-2 bottom-2 left-[11px] w-px bg-ink/10" aria-hidden />
        <div
          className="absolute top-2 bottom-2 left-[11px] w-px origin-top bg-ink/60"
          style={{ transform: "scaleY(min(1, calc(var(--p) * 1.8)))" }}
          aria-hidden
        />
        <div className="space-y-10">
          {d.story.map((s, i) => (
            <Reveal key={s.title + i} variant={i % 2 ? "right" : "left"} delay={i * 60}>
              <div className="relative flex gap-5 pl-1">
                <div className="relative z-10 mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream">
                  <span className="text-ink/70">♥</span>
                </div>
                <div className="min-w-0 flex-1">
                  {s.photo && (
                    <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_-18px_rgba(0,0,0,0.2)]">
                      <RevealImage src={s.photo} alt={s.title} from="center" imgClassName="aspect-[16/10] w-full object-cover" />
                    </div>
                  )}
                  <p className="mt-4 font-display text-xl italic text-ink">{s.title}</p>
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink/65">
                    {s.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTH_KEYS: Record<string, number> = {
  jan: 0, januari: 0, january: 0, feb: 1, februari: 1, february: 1, mar: 2, maret: 2, march: 2,
  apr: 3, april: 3, mei: 4, may: 4, jun: 5, juni: 5, june: 5, jul: 6, juli: 6, july: 6,
  agu: 7, ags: 7, agustus: 7, aug: 7, august: 7, sep: 8, sept: 8, september: 8,
  okt: 9, oktober: 9, oct: 9, october: 9, nov: 10, november: 10, des: 11, desember: 11, dec: 11, december: 11,
};
const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/** Membaca tanggal bebas ("Senin, 4 Mei 2026" atau "2026-05-04"); null jika tidak terbaca. */
function parseEventDate(raw: string) {
  let y: number, m: number, day: number;
  const iso = raw.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  const txt = raw.match(/(\d{1,2})\s+([A-Za-z]+)\.?,?\s+(\d{4})/);
  if (iso) {
    y = +iso[1];
    m = +iso[2] - 1;
    day = +iso[3];
  } else if (txt && MONTH_KEYS[txt[2].toLowerCase()] !== undefined) {
    day = +txt[1];
    m = MONTH_KEYS[txt[2].toLowerCase()];
    y = +txt[3];
  } else return null;
  const dt = new Date(Date.UTC(y, m, day));
  if (dt.getUTCMonth() !== m || dt.getUTCDate() !== day) return null;
  return { y, m, day, month: MONTHS[m], weekday: DAYS[dt.getUTCDay()] };
}

/** Link "Simpan Tanggal" ke Google Calendar (zona WITA/WIT/WIB dibaca dari teks waktu). */
function calendarLink(e: { name: string; date: string; time: string; place: string; address: string }) {
  const p = parseEventDate(e.date);
  if (!p) return "";
  const times = [...e.time.matchAll(/(\d{1,2})[.:](\d{2})/g)];
  const sh = times[0] ? +times[0][1] : 10;
  const sm = times[0] ? +times[0][2] : 0;
  const tz = /WITA/i.test(e.time) ? 8 : /\bWIT\b/i.test(e.time) ? 9 : 7;
  const start = Date.UTC(p.y, p.m, p.day, sh - tz, sm);
  const end = times[1] ? Date.UTC(p.y, p.m, p.day, +times[1][1] - tz, +times[1][2]) : start + 2 * 3600_000;
  const f = (t: number) => new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.name,
    dates: `${f(start)}/${f(Math.max(end, start + 1800_000))}`,
    location: [e.place, e.address].filter(Boolean).join(", "),
    details: "Undangan pernikahan",
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

export function Events() {
  const d = useWeddingData();
  const bg = d.heroPhotos[1] || d.heroPhoto || d.coverPhoto || "";
  const parallax = useParallax<HTMLImageElement>(0.12);
  const pill =
    "inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 font-sans text-[0.72rem] text-ink transition hover:bg-white hover:shadow-lg";
  return (
    <section id="acara" className="relative overflow-hidden bg-ink px-6 py-24 text-cream sm:py-28">
      {bg && (
        <img
          ref={parallax}
          src={bg}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-45 will-change-transform"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/70 to-ink" />

      <div className="relative mx-auto max-w-sm text-center">
        <Smooth>
          <h2 className="font-display text-[2.5rem] font-medium italic leading-tight">Event</h2>
        </Smooth>
        <Smooth delay={250}>
          <p className="mt-3 font-sans text-[0.82rem] leading-relaxed text-cream/75">
            Dengan penuh sukacita, kami mengundang Anda pada hari bahagia kami:
          </p>
        </Smooth>

        {d.events.map((e, idx) => {
          const p = parseEventDate(e.date);
          const cal = calendarLink(e);
          return (
            <div
              key={e.name + idx}
              className={idx === 0 ? "mt-14" : "mt-14 border-t border-dotted border-cream/30 pt-14"}
            >
              <Smooth>
                <h3 className="font-display text-[2.2rem] font-medium leading-tight">{e.name}</h3>
              </Smooth>
              {e.desc ? (
                <Smooth delay={150}>
                  <p className="mx-auto mt-3 max-w-xs font-sans text-[0.75rem] leading-relaxed text-cream/65">
                    {e.desc}
                  </p>
                </Smooth>
              ) : null}

              <Smooth delay={300} variant="zoom">
                {p ? (
                  <div className="mt-7 flex items-center justify-center gap-5">
                    <span className="w-14 text-right font-sans text-[0.85rem] text-cream/85">{p.month}</span>
                    <div className="border-x border-cream/70 px-7 py-1">
                      <p className="font-sans text-[0.78rem] text-cream/85">{p.weekday}</p>
                      <p className="font-display text-[2.8rem] font-semibold leading-none">{p.day}</p>
                    </div>
                    <span className="w-14 text-left font-sans text-[0.85rem] text-cream/85">{p.y}</span>
                  </div>
                ) : (
                  <p className="mt-7 font-display text-2xl">{e.date}</p>
                )}
              </Smooth>

              {e.time ? (
                <Smooth delay={500}>
                  <p className="mt-4 font-kicker text-[0.74rem] tracking-[0.24em] text-[#ecd48f]">{e.time}</p>
                </Smooth>
              ) : null}

              <Smooth delay={650}>
                <p className="mt-6 font-display text-[1.35rem] font-medium">{e.place}</p>
                <p className="mx-auto mt-1.5 max-w-[17rem] font-sans text-[0.74rem] leading-relaxed text-cream/70">
                  {e.address}
                </p>
              </Smooth>

              <Smooth delay={850}>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                  {cal ? (
                    <a href={cal} target="_blank" rel="noreferrer" className={pill}>
                      <CalendarPlus className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                      Simpan Tanggal
                    </a>
                  ) : null}
                  {e.map ? (
                    <a href={e.map} target="_blank" rel="noreferrer" className={pill}>
                      <Navigation className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
                      Navigasi Peta
                    </a>
                  ) : null}
                </div>
              </Smooth>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function Countdown() {
  const d = useWeddingData();
  const target = new Date(d.weddingDateISO || Number.NaN);
  const t = useCountdown(target);
  const parallax = useParallax<HTMLImageElement>(0.16);
  const [gridRef, shown] = useInView<HTMLDivElement>(0.3);
  const items = [
    { v: t.days, l: "Hari" },
    { v: t.hours, l: "Jam" },
    { v: t.minutes, l: "Menit" },
    { v: t.seconds, l: "Detik" },
  ];
  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-24">
      {d.heroPhoto && (
        <img
          ref={parallax}
          src={d.heroPhoto}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
      )}
      <div className="absolute inset-0 bg-ink/65" />
      <div className="relative mx-auto max-w-sm text-center">
        <p className="eyebrow tracking-[0.42em] text-cream/80">COUNTDOWN</p>
        <RevealText as="h2" text="Menuju Hari Bahagia" variant="blur" stagger={90} className="mt-3 block font-display text-3xl italic text-cream" />
        <div ref={gridRef} className={`mt-10 grid grid-cols-4 gap-3 ${shown ? "pop-in" : ""}`}>
          {items.map((it, i) => (
            <div
              key={it.l}
              className="pop-tile rounded-xl bg-cream/10 px-2 py-4 backdrop-blur-sm"
              style={{ transitionDelay: `${i * 130}ms` }}
            >
              <p className="font-display text-[2rem] font-medium text-gold-light tabular-nums">
                {String(it.v).padStart(2, "0")}
              </p>
              <p className="mt-1 font-sans text-[0.55rem] tracking-[0.2em] text-cream/70">
                {it.l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type WishRow = { id?: string; name: string; text: string; time: string; fresh?: boolean };

function formatWishTime(iso?: string) {
  if (!iso) return "Baru saja";
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  if (diff < 60_000) return "Baru saja";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} menit lalu`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} jam lalu`;
  return `${Math.floor(diff / 86_400_000)} hari lalu`;
}

export function Wishes() {
  const d = useWeddingData();
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState<"" | "hadir" | "tidak">("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [thanks, setThanks] = useState<{ name: string; attendance: "hadir" | "tidak" } | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        // Hanya ucapan & doa asli; konfirmasi kehadiran lama tidak ditampilkan.
        const { getPrayerWishes } = await import("@/lib/supabase/data");
        const rows = await getPrayerWishes();
        setWishes(
          rows.map((w) => ({
            id: w.id,
            name: w.guest_name,
            text: w.message,
            time: formatWishTime(w.created_at),
          })),
        );
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // Notifikasi terima kasih: tutup otomatis, bisa ditutup dengan Esc.
  useEffect(() => {
    if (!thanks) return;
    const t = window.setTimeout(() => setThanks(null), 8000);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setThanks(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [thanks]);

  const couple = [d.brideName, d.groomName].filter(Boolean).join(" & ");

  return (
    <section id="ucapan" className="bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="UCAPAN & DOA" title="Prayers & Wishes" />
      <Reveal className="mx-auto mt-6 max-w-sm text-center">
        <p className="font-display text-[1.1rem] italic leading-relaxed text-ink/65">
          Tuliskan ucapan dan doa restu untuk kedua mempelai, lalu konfirmasi kehadiran Anda.
        </p>
      </Reveal>

      {/* ---- Formulir ---- */}
      <Reveal className="mx-auto mt-8 max-w-sm" variant="up">
        <form
          className="space-y-7 rounded-3xl border border-border bg-card px-6 py-8 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.35)]"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            const name = String(data.get("name") ?? "").trim();
            const text = String(data.get("text") ?? "").trim();
            if (!name || !text) return;
            if (!attendance) {
              setError("Mohon pilih konfirmasi kehadiran Anda.");
              return;
            }
            setError("");
            setLoading(true);
            try {
              const { createWish, createRsvp } = await import("@/lib/supabase/data");
              const res = await createWish({ guest_name: name, message: text, attendance });
              if (!res.success) {
                setError("Ucapan belum terkirim. Periksa koneksi lalu coba lagi.");
                return;
              }
              // Kehadiran disimpan terpisah (tabel rsvps) agar tidak tercampur dengan ucapan.
              const rsvp = await createRsvp({ guest_name: name, attendance, guests });
              if (!rsvp.success) console.warn("RSVP belum tersimpan:", rsvp.error);

              setWishes((w) => [
                { id: res.data?.id, name, text, time: "Baru saja", fresh: true },
                ...w,
              ]);
              form.reset();
              setThanks({ name, attendance });
              setAttendance("");
              setGuests(1);
            } catch {
              setError("Gagal mengirim. Periksa koneksi lalu coba lagi.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="space-y-4">
            <p className="font-kicker text-[0.6rem] tracking-[0.32em] text-gold">1 · TULIS UCAPAN</p>
            <input name="name" required className="field" placeholder="Nama Anda" autoComplete="name" />
            <textarea name="text" required rows={3} className="field resize-none" placeholder="Ucapan & doa untuk kedua mempelai" />
          </div>

          <div className="space-y-4">
            <p className="font-kicker text-[0.6rem] tracking-[0.32em] text-gold">2 · KONFIRMASI KEHADIRAN</p>
            <div className="seg" role="radiogroup" aria-label="Konfirmasi kehadiran">
              <label>
                <input
                  type="radio"
                  name="attendance"
                  value="hadir"
                  checked={attendance === "hadir"}
                  onChange={() => setAttendance("hadir")}
                />
                <span>Ya, saya hadir</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="attendance"
                  value="tidak"
                  checked={attendance === "tidak"}
                  onChange={() => setAttendance("tidak")}
                />
                <span>Maaf, berhalangan</span>
              </label>
            </div>
            {attendance === "hadir" ? (
              <div className="wish-new">
                <select
                  name="guests"
                  className="field"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  aria-label="Jumlah tamu yang hadir"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} orang
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          {error ? (
            <p role="alert" className="text-center font-sans text-xs text-red-600">
              {error}
            </p>
          ) : null}
          <button type="submit" className="btn-ink sheen w-full" disabled={loading}>
            {loading ? "Mengirim…" : "KIRIM UCAPAN"}
          </button>
        </form>
      </Reveal>

      {/* ---- Daftar ucapan ---- */}
      <div className="mx-auto mt-14 max-w-sm">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-display text-2xl italic text-ink">Ucapan dari Tamu</p>
          <span className="rounded-full border border-gold/40 px-3 py-1 font-kicker text-[0.6rem] tracking-[0.2em] text-gold">
            {wishes.length} UCAPAN
          </span>
        </div>
        <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1" data-lenis-prevent>
          {wishes.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border py-8 text-center font-display text-base italic text-ink/45">
              Belum ada ucapan. Jadilah yang pertama!
            </p>
          ) : (
            wishes.map((w, i) => (
              <article
                key={w.id || i}
                className={`flex gap-3 rounded-2xl border border-border bg-card p-4 ${w.fresh ? "wish-new" : ""}`}
              >
                <div
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg text-[#ecd48f]"
                >
                  {(w.name.trim()[0] || "?").toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-display text-lg font-medium text-ink">{w.name}</p>
                    <span className="shrink-0 font-kicker text-[0.52rem] tracking-[0.16em] text-gold">
                      {w.time.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 break-words font-display text-base leading-relaxed text-ink/70">
                    {w.text}
                  </p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* ---- Notifikasi terima kasih ---- */}
      {thanks &&
        createPortal(
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/60 p-6 backdrop-blur-sm animate-in fade-in duration-300"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="thanks-title"
            onClick={() => setThanks(null)}
          >
            <div
              className="relative w-full max-w-xs overflow-hidden rounded-3xl bg-cream px-7 pb-8 pt-9 text-center shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#b8933f] via-[#ecd48f] to-[#b8933f]" />
              <div className="thanks-check mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#b8933f]/50 bg-[#b8933f]/10">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#b8933f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7.5" className="thanks-check-path" />
                </svg>
              </div>
              <h3 id="thanks-title" className="mt-5 font-display text-[1.7rem] italic leading-tight text-ink">
                Terima kasih, {thanks.name}!
              </h3>
              <p className="mt-3 font-sans text-[0.82rem] leading-relaxed text-ink/65">
                {thanks.attendance === "hadir"
                  ? "Ucapan dan konfirmasi kehadiran Anda telah kami terima. Sampai jumpa di hari bahagia kami."
                  : "Ucapan dan doa Anda telah kami terima. Kami sangat menghargai perhatian Anda."}
              </p>
              {couple ? (
                <p className="mt-5 font-script text-[1.9rem] leading-tight text-gold-grad">{couple}</p>
              ) : null}
              <button type="button" className="btn-ink mt-6 w-full" onClick={() => setThanks(null)}>
                TUTUP
              </button>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

export function Gift() {
  const d = useWeddingData();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const rows = [
    ...d.accounts.map((a, i) => ({ key: `acc-${i}`, account: a })),
    ...(d.giftPhoto ? [{ key: "qr", account: null }] : []),
  ];

  return (
    <section id="kado" className="bg-sand/50 px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="TANDA KASIH" title="Wedding Gift" />
      <Smooth className="mx-auto mt-8 max-w-sm space-y-6 text-center">
        <RevealText
          as="p"
          text={d.giftIntro}
          variant="blur"
          stagger={28}
          className="block font-display text-[1.1rem] leading-[1.75] text-ink/70"
        />
        <div className="flex justify-center">
          <FlowButton text="Lihat Daftar Kado" onClick={() => setOpen(true)} />
        </div>
      </Smooth>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px] animate-in fade-in duration-500"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Kado"
          >
            <div
              className="w-full max-w-sm overflow-hidden rounded-xl bg-cream shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-6 duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h3 className="font-display text-xl font-medium text-ink">Kado</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup"
                  className="text-red-500/80 transition hover:text-red-600"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                    <circle cx="12" cy="12" r="9.5" />
                    <path d="M9 9l6 6M15 9l-6 6" />
                  </svg>
                </button>
              </div>

              <div className="max-h-[62vh] overflow-y-auto px-5 py-5" data-lenis-prevent>
                <h4 className="font-display text-lg font-semibold text-ink">Kado Cashless</h4>
                <p className="mt-1 font-sans text-[0.72rem] leading-relaxed text-ink/60">
                  Anda dapat memberikan kado cashless. Pilih metode pembayaran di bawah.
                </p>

                <ul className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
                  {rows.map(({ key, account: a }) => {
                    const on = expanded === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => setExpanded(on ? null : key)}
                          aria-expanded={on}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            {a?.logo ? (
                              <img src={a.logo} alt={a.bank} className="h-6 max-w-[7rem] object-contain" />
                            ) : (
                              <span className="truncate font-display text-[1.05rem] font-medium text-ink">
                                {a ? a.bank || "Rekening" : "QR Code"}
                              </span>
                            )}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-ink/50 transition-transform duration-500 ${on ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </button>
                        <div
                          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                            on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="px-4 pb-5 pt-1 text-center">
                              {a ? (
                                <>
                                  {a.logo ? <p className="eyebrow">{a.bank}</p> : null}
                                  <p className="mt-1 font-display text-[1.4rem] tracking-wide text-ink">{a.number}</p>
                                  <p className="font-sans text-[0.8rem] text-ink/60">a/n {a.owner}</p>
                                  <button
                                    type="button"
                                    className="btn-ink mt-3"
                                    onClick={() => {
                                      navigator.clipboard?.writeText(a.number);
                                      setCopied(key);
                                      setTimeout(() => setCopied(null), 2000);
                                    }}
                                  >
                                    {copied === key ? "TERSALIN ✓" : "SALIN"}
                                  </button>
                                </>
                              ) : (
                                <div className="mx-auto w-44 overflow-hidden rounded-xl border border-border bg-white p-3">
                                  <img src={d.giftPhoto} alt="QR Code" className="w-full object-contain" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex justify-end border-t border-border px-5 py-3">
                <button type="button" className="btn-ink !px-5 !py-2" onClick={() => setOpen(false)}>
                  TUTUP
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

export function ThankYou() {
  const d = useWeddingData();
  return (
    <section className="relative z-10 overflow-hidden rounded-b-3xl border-b border-white/10 bg-ink px-5 py-24 shadow-2xl sm:px-8 sm:py-28">
      {d.heroPhoto && (
        <img
          src={d.heroPhoto}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink" />
      <div className="relative mx-auto max-w-sm text-center">
        <Ornament className="mb-8" />
        <RevealText
          as="p"
          text={d.thankYouText}
          variant="blur"
          stagger={26}
          className="block font-display text-[1.1rem] leading-[1.75] text-cream/85"
        />
        <p className="mt-8 font-sans text-[0.6rem] tracking-[0.32em] text-cream/60">
          KAMI YANG BERBAHAGIA
        </p>
        <RevealText
          as="p"
          text={[d.brideName, d.groomName].filter(Boolean).join(" & ")}
          variant="blur"
          stagger={110}
          className="mt-3 block font-display text-[2rem] font-medium text-gold-light"
        />
        <p className="mt-2 font-sans text-[0.6rem] tracking-[0.28em] text-cream/60">
          BESERTA KELUARGA
        </p>
      </div>
    </section>
  );
}

/** Cinematic scroll-reveal footer – place after main content */
export { CinematicFooter } from "@/components/ui/motion-footer";


export { Gallery } from "./Gallery";
export { Moments } from "./Moments";

export function VideoMoment() {
  const d = useWeddingData();
  const VIDEO_URL = d.videoUrl || "";
  if (!VIDEO_URL) return null;
  const isYt = VIDEO_URL.includes("youtube") || VIDEO_URL.includes("youtu.be");
  return (
    <section className="bg-sand/40 px-5 py-14 sm:px-8">
      <SectionTitle kicker="MEMORIES" title="Video" />
      <FadeUp className="mx-auto mt-8 max-w-sm overflow-hidden rounded-2xl shadow-lg">
        {isYt ? (
          <div className="aspect-video w-full">
            <iframe
              src={VIDEO_URL}
              title="Video prewedding"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video
            src={VIDEO_URL}
            poster={d.heroPhoto || undefined}
            preload="metadata"
            controls
            playsInline
            className="aspect-video w-full object-cover"
          />
        )}
      </FadeUp>
    </section>
  );
}

export function MusicControl() {
  const d = useWeddingData();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!d.musicUrl || !audioRef.current) return;
    audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
  }, [d.musicUrl]);

  if (!d.musicUrl) return null;

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={d.musicUrl} loop preload="auto" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 mx-auto flex max-w-[480px] justify-end px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <button
        type="button"
        onClick={toggle}
        className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-ink/80 text-cream shadow-lg backdrop-blur-md transition hover:scale-105"
        aria-label={playing ? "Jeda musik" : "Putar musik"}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      </div>
    </>
  );
}
