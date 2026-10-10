import { Fragment, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Reveal, Smooth, useCountdown, useParallax } from "./hooks";
import {
  CalendarCheck,
  CalendarPlus,
  CalendarX,
  Gift as GiftIcon,
  Heart,
  MessageCircle,
  Navigation,
} from "lucide-react";
import {
  CopiedIcon,
  HeartIcon,
  PlayPauseIcon,
  SendIcon,
  SuccessIcon,
} from "@/components/ui/animated-state-icons";
import { useWeddingData } from "@/lib/WeddingContext";
import { RevealImage, RevealText, useInView } from "@/components/ui/image-text-reveal";
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
        className="mt-3 block font-display text-[2.5rem] font-medium italic leading-tight tracking-tight text-[#a8822f]"
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

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LATIN_RE = /[A-Za-z]/;

/**
 * Memecah teks kutipan menjadi blok terpisah: tiap baris baru = blok baru, dan di dalam satu
 * baris, teks Arab dan teks Latin otomatis dipisah (walau tersambung tanpa baris baru).
 */
function splitQuote(raw: string) {
  const blocks: { arabic: boolean; text: string }[] = [];
  for (const line of raw.split(/\r?\n+/)) {
    let cur: { arabic: boolean; words: string[] } | null = null;
    for (const w of line.split(/\s+/).filter(Boolean)) {
      const kind = ARABIC_RE.test(w) ? "ar" : LATIN_RE.test(w) ? "la" : null;
      const arabic = kind === "ar";
      if (!cur || (kind !== null && arabic !== cur.arabic)) {
        if (cur) blocks.push({ arabic: cur.arabic, text: cur.words.join(" ") });
        cur = { arabic: kind === "ar", words: [] };
      }
      cur.words.push(w);
    }
    if (cur) blocks.push({ arabic: cur.arabic, text: cur.words.join(" ") });
  }
  return blocks;
}

export function Quote() {
  const d = useWeddingData();
  const blocks = splitQuote(d.quote || "");
  return (
    <section className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-cream px-5 py-16 shadow-[0_-24px_40px_-24px_rgba(0,0,0,0.4)] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-md text-center">
        <FadeUp>
          <p className="font-display text-5xl leading-none text-gold/50">&ldquo;</p>
        </FadeUp>
        <div className="mt-3 space-y-6">
          {blocks.map((b, i) => (
            <FadeUp key={i} delay={Math.min(i, 3) * 120}>
              {b.arabic ? (
                <p
                  dir="rtl"
                  lang="ar"
                  className="font-arab text-[1.65rem] leading-[2.4] text-ink sm:text-[1.8rem]"
                >
                  {b.text}
                </p>
              ) : (
                <p className="font-display text-[1.1rem] italic leading-[1.85] text-ink/80 sm:text-[1.2rem]">
                  {b.text}
                </p>
              )}
            </FadeUp>
          ))}
        </div>
        <FadeUp delay={200}>
          <Ornament className="mt-8" />
          <p className="mt-5 eyebrow">{d.quoteSource}</p>
        </FadeUp>
      </div>
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

/**
 * Kartu satu mempelai: foto dalam bingkai lengkung emas.
 * Urutan: foto muncul BURAM -> menajam jadi foto asli -> setelah itu nama, orang tua,
 * dan Instagram muncul perlahan di bawah foto (teks di atas latar krem: selalu jelas terbaca).
 */
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
  const [viewRef, inView] = useInView<HTMLDivElement>(0.4);
  const [sharp, setSharp] = useState(false);
  const ig = igHandle(instagram);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setSharp(true), reduce ? 0 : 1300);
    return () => window.clearTimeout(t);
  }, [inView]);

  // Teks selalu menempati ruangnya (tidak membuat halaman bergeser), hanya muncul bertahap.
  const rise = (delay: number) =>
    ({
      transitionDelay: sharp ? `${delay}ms` : "0ms",
    }) as React.CSSProperties;
  const riseCls = `transition-all duration-700 ease-out ${
    sharp ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
  }`;

  return (
    <div ref={viewRef} className="mx-auto w-full max-w-[19rem] text-center">
      <div className="rounded-t-[999px] rounded-b-[2rem] border border-[#b8933f]/50 bg-card p-2.5 shadow-[0_34px_60px_-34px_rgba(0,0,0,0.55)]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-ink/10">
          {photo ? (
            <img
              src={photo}
              alt={name}
              loading="lazy"
              className="person-photo absolute inset-0 h-full w-full scale-[1.08] object-cover object-[50%_20%]"
              style={{ filter: inView ? "blur(0px)" : "blur(24px)" }}
            />
          ) : null}
        </div>
      </div>

      <div className="mt-7">
        <p className={`font-kicker text-[0.64rem] tracking-[0.45em] text-[#8a6a1f] ${riseCls}`} style={rise(0)}>
          {role}
        </p>
        <h3
          className={`mt-2 font-script text-[3.4rem] leading-[1.05] text-[#a8822f] ${riseCls}`}
          style={rise(120)}
        >
          {name}
        </h3>
        {fullName ? (
          <p className={`mt-1 font-display text-[1.3rem] italic text-ink ${riseCls}`} style={rise(240)}>
            {fullName}
          </p>
        ) : null}
        {parents ? (
          <p
            className={`mx-auto mt-3 max-w-[17rem] whitespace-pre-line font-sans text-[0.78rem] leading-relaxed text-ink/60 ${riseCls}`}
            style={rise(360)}
          >
            {parents}
          </p>
        ) : null}
        {ig ? (
          <div className={riseCls} style={rise(480)}>
            <a
              href={`https://instagram.com/${ig}`}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#b8933f]/70 px-4 py-1.5 font-sans text-[0.75rem] text-[#8a6a1f] transition hover:bg-[#b8933f] hover:text-white"
            >
              <InstagramIcon />
              {ig}
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Couple() {
  const d = useWeddingData();
  return (
    <section id="mempelai" className="relative bg-cream px-5 pb-20 pt-6 sm:px-8">
      <SectionTitle kicker="THE HAPPY COUPLE" title="Mempelai" />
      {d.coupleIntro ? (
        <Smooth delay={150} className="mx-auto mt-6 max-w-sm text-center">
          <p className="block whitespace-pre-line font-display text-[1.1rem] leading-[1.8] text-ink/70">
            {d.coupleIntro}
          </p>
        </Smooth>
      ) : null}

      <div className="mt-12 flex flex-col items-center">
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

        {d.brideName && d.groomName ? (
          <Smooth variant="zoom" className="my-10 flex items-center gap-4">
            <span aria-hidden className="h-px w-16 bg-gradient-to-r from-transparent to-[#b8933f]/60" />
            <span className="font-script text-[3rem] leading-none text-[#b8933f]">&amp;</span>
            <span aria-hidden className="h-px w-16 bg-gradient-to-l from-transparent to-[#b8933f]/60" />
          </Smooth>
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
      </div>
    </section>
  );
}

/** Penanda hati di antara kartu: terisi & memantul saat muncul di layar. */
function HeartMark({ big = false }: { big?: boolean }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.6);
  return (
    <span
      ref={ref}
      aria-hidden
      className={`relative z-10 flex items-center justify-center rounded-full border border-[#b8933f]/60 bg-cream shadow-sm ${
        big ? "h-12 w-12" : "h-9 w-9"
      }`}
    >
      <HeartIcon size={big ? 30 : 22} color="#b8933f" filledColor="#b8933f" state={inView} />
    </span>
  );
}

function DottedLine({ tall = false }: { tall?: boolean }) {
  return (
    <span
      aria-hidden
      className={`block w-0 border-l-[3px] border-dotted border-[#b8933f]/70 ${tall ? "h-12" : "h-9"}`}
    />
  );
}

export function LoveStory() {
  const d = useWeddingData();
  return (
    <section id="kisah" className="relative overflow-hidden bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="OUR STORY" title="Kisah Cinta" />
      <div className="relative mx-auto mt-12 flex max-w-sm flex-col items-center">
        <Smooth variant="zoom">
          <HeartMark big />
        </Smooth>
        {d.story.map((s, i) => (
          <Fragment key={s.title + i}>
            {/* Setiap bagian punya pengamat scroll sendiri: muncul satu per satu saat digulir */}
            <Smooth>
              <DottedLine tall={i === 0} />
            </Smooth>
            {i > 0 ? (
              <>
                <Smooth variant="zoom">
                  <HeartMark />
                </Smooth>
                <Smooth>
                  <DottedLine />
                </Smooth>
              </>
            ) : null}
            <Smooth variant="zoom" delay={150} className="w-full">
              <article className="rounded-[1.75rem] border border-[#b8933f]/45 bg-card/95 p-3 shadow-[0_26px_50px_-30px_rgba(0,0,0,0.5)]">
                {s.photo ? (
                  <img
                    src={s.photo}
                    alt={s.title}
                    loading="lazy"
                    className="block h-auto w-full rounded-[1.25rem]"
                  />
                ) : null}
                <div className="px-3 pb-3 pt-4 text-center">
                  <h3 className="font-display text-[1.4rem] font-semibold leading-tight text-ink">{s.title}</h3>
                  <Ornament className="my-3" />
                  <p className="whitespace-pre-line font-sans text-[0.82rem] leading-relaxed text-ink/70">{s.text}</p>
                </div>
              </article>
            </Smooth>
          </Fragment>
        ))}
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

/** Centang sukses: mulai sebagai lingkaran berputar, lalu berubah jadi centang. */
function ThanksCheck() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 350);
    return () => window.clearTimeout(t);
  }, []);
  return <SuccessIcon size={40} color="#b8933f" state={done} />;
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

  const input =
    "w-full rounded-xl border border-border bg-white/70 px-4 py-3 font-sans text-[0.85rem] text-ink outline-none transition placeholder:text-ink/40 focus:border-[#b8933f] focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,147,63,0.15)]";
  const choice =
    "flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-white/60 px-3 py-4 text-center font-sans text-[0.78rem] text-ink/65 transition peer-checked:border-[#b8933f] peer-checked:bg-[#b8933f]/10 peer-checked:text-ink peer-checked:shadow-md peer-focus-visible:ring-2 peer-focus-visible:ring-[#b8933f]";

  return (
    <section id="ucapan" className="bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="UCAPAN & DOA" title="Prayers & Wishes" />
      <Smooth className="mx-auto mt-6 max-w-sm text-center">
        <p className="font-display text-[1.1rem] italic leading-relaxed text-ink/65">
          Tuliskan ucapan dan doa restu untuk kedua mempelai, lalu konfirmasi kehadiran Anda.
        </p>
      </Smooth>

      {/* ---- Formulir ---- */}
      <Smooth variant="left" delay={150} className="mx-auto mt-9 max-w-sm">
        <div className="rounded-[2rem] border border-[#b8933f]/30 bg-card p-2 shadow-[0_28px_60px_-34px_rgba(0,0,0,0.45)]">
          <form
            className="space-y-7 rounded-[1.5rem] border border-[#b8933f]/20 px-5 py-8"
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
                const rsvp = await createRsvp({ guest_name: name, attendance, guests });
                if (!rsvp.success) console.warn("RSVP belum tersimpan:", rsvp.error);
                setWishes((w) => [{ id: res.data?.id, name, text, time: "Baru saja", fresh: true }, ...w]);
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
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-[#ecd48f]">
                <MessageCircle className="h-5 w-5" strokeWidth={1.6} aria-hidden />
              </span>
              <p className="font-display text-[1.4rem] italic text-ink">Kirim Ucapan</p>
            </div>

            <div className="space-y-3">
              <p className="font-kicker text-[0.6rem] tracking-[0.3em] text-[#8a6a1f]">1 · TULIS UCAPAN</p>
              <input name="name" required className={input} placeholder="Nama Anda" autoComplete="name" />
              <textarea
                name="text"
                required
                rows={4}
                className={`${input} resize-none`}
                placeholder="Ucapan & doa untuk kedua mempelai"
              />
            </div>

            <div className="space-y-3">
              <p className="font-kicker text-[0.6rem] tracking-[0.3em] text-[#8a6a1f]">2 · KONFIRMASI KEHADIRAN</p>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Konfirmasi kehadiran">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    value="hadir"
                    className="peer sr-only"
                    checked={attendance === "hadir"}
                    onChange={() => setAttendance("hadir")}
                  />
                  <span className={choice}>
                    <CalendarCheck className="h-5 w-5 text-[#8a6a1f]" strokeWidth={1.6} aria-hidden />
                    Ya, saya hadir
                  </span>
                </label>
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    value="tidak"
                    className="peer sr-only"
                    checked={attendance === "tidak"}
                    onChange={() => setAttendance("tidak")}
                  />
                  <span className={choice}>
                    <CalendarX className="h-5 w-5 text-[#8a6a1f]" strokeWidth={1.6} aria-hidden />
                    Maaf, berhalangan
                  </span>
                </label>
              </div>
              {attendance === "hadir" ? (
                <div className="wish-new">
                  <select
                    name="guests"
                    className={input}
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
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-4 font-sans text-[0.68rem] tracking-[0.3em] text-cream transition duration-500 hover:bg-[#8a6a1f] disabled:opacity-60"
            >
              <SendIcon size={20} state={loading} />
              {loading ? "MENGIRIM…" : "KIRIM UCAPAN"}
            </button>
          </form>
        </div>
      </Smooth>

      {/* ---- Daftar ucapan ---- */}
      <Smooth variant="right" delay={150} className="mx-auto mt-14 max-w-sm">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-display text-2xl italic text-ink">Ucapan dari Tamu</p>
          <span className="rounded-full border border-[#b8933f]/50 px-3 py-1 font-kicker text-[0.6rem] tracking-[0.2em] text-[#8a6a1f]">
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
                    <span className="shrink-0 font-kicker text-[0.52rem] tracking-[0.16em] text-[#8a6a1f]">
                      {w.time.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 break-words font-display text-base leading-relaxed text-ink/70">{w.text}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </Smooth>

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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#b8933f]/50 bg-[#b8933f]/10">
                <ThanksCheck />
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

/** "1234567890" -> "1234 5678 90" (hanya untuk tampilan; yang disalin tetap angka asli). */
function groupNumber(n: string) {
  const raw = n.replace(/\s+/g, "");
  return /^\d{6,}$/.test(raw) ? raw.replace(/(\d{4})(?=\d)/g, "$1 ") : n;
}

function CardChip() {
  return (
    <svg width="38" height="28" viewBox="0 0 38 28" fill="none" aria-hidden>
      <rect x="1" y="1" width="36" height="26" rx="5" fill="url(#chipg)" stroke="#8a6a1f" strokeOpacity="0.6" />
      <path d="M1 10h12M1 18h12M25 10h12M25 18h12M13 1v26M25 1v26" stroke="#8a6a1f" strokeOpacity="0.45" />
      <defs>
        <linearGradient id="chipg" x1="0" y1="0" x2="38" y2="28">
          <stop stopColor="#f3dd9c" />
          <stop offset="1" stopColor="#c9a24a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Gift() {
  const d = useWeddingData();
  const [copied, setCopied] = useState<string | null>(null);

  const accounts = d.accounts.filter((a) => a.bank || a.number);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      /* clipboard tidak diizinkan: abaikan, tetap tampilkan status */
    }
    setCopied(key);
    window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 2200);
  };

  return (
    <section id="kado" className="relative overflow-hidden bg-sand/50 px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="TANDA KASIH" title="Wedding Gift" />

      <Smooth delay={100} className="mx-auto mt-6 max-w-sm text-center">
        <p className="whitespace-pre-line font-display text-[1.12rem] leading-[1.8] text-ink/70">
          {d.giftIntro ||
            "Doa restu Anda adalah hadiah terindah bagi kami. Namun jika Anda ingin memberi tanda kasih, dengan senang hati kami menerimanya."}
        </p>
      </Smooth>

      <div className="mx-auto mt-10 flex max-w-sm flex-col gap-6">
        {accounts.map((a, i) => {
          const key = `acc-${i}`;
          const isCopied = copied === key;
          return (
            <Smooth key={key} variant="zoom" delay={120}>
              <article className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#1d1912] via-[#2a2417] to-[#15120c] p-6 text-cream shadow-[0_30px_60px_-28px_rgba(0,0,0,0.75)] ring-1 ring-[#b8933f]/40">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#b8933f]/15 blur-2xl"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full border border-[#ecd48f]/10"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {a.logo ? (
                      <span className="inline-flex rounded-md bg-white/95 px-2.5 py-1.5">
                        <img src={a.logo} alt={a.bank || "Bank"} className="h-6 max-w-[6.5rem] object-contain" />
                      </span>
                    ) : (
                      <p className="truncate font-kicker text-[0.95rem] tracking-[0.18em] text-[#ecd48f]">
                        {a.bank || "Rekening"}
                      </p>
                    )}
                  </div>
                  <CardChip />
                </div>

                <p className="relative mt-7 font-kicker text-[0.55rem] tracking-[0.35em] text-cream/55">
                  NOMOR REKENING
                </p>
                <p className="relative mt-1.5 break-all font-display text-[1.6rem] font-medium leading-tight tracking-[0.06em] text-white tabular-nums">
                  {groupNumber(a.number)}
                </p>

                <div className="relative mt-6 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-kicker text-[0.55rem] tracking-[0.35em] text-cream/55">ATAS NAMA</p>
                    <p className="mt-1 truncate font-display text-[1.1rem] text-cream">{a.owner}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(key, a.number.replace(/\s+/g, ""))}
                    aria-label={`Salin nomor rekening ${a.bank}`}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border py-1.5 pl-2.5 pr-4 font-sans text-[0.68rem] tracking-[0.18em] transition duration-300 ${
                      isCopied
                        ? "border-[#ecd48f] bg-[#ecd48f] text-ink"
                        : "border-[#ecd48f]/60 text-[#ecd48f] hover:bg-[#ecd48f]/10"
                    }`}
                  >
                    <CopiedIcon size={22} state={isCopied} />
                    {isCopied ? "TERSALIN" : "SALIN"}
                  </button>
                </div>
              </article>
            </Smooth>
          );
        })}

        {d.giftPhoto ? (
          <Smooth variant="zoom" delay={120}>
            <article className="rounded-[1.4rem] border border-[#b8933f]/35 bg-card p-6 text-center shadow-[0_26px_50px_-30px_rgba(0,0,0,0.45)]">
              <p className="font-kicker text-[0.6rem] tracking-[0.35em] text-[#8a6a1f]">KADO DIGITAL</p>
              <p className="mt-2 font-display text-[1.3rem] italic text-ink">Scan QR Code</p>
              <div className="mx-auto mt-4 w-52 rounded-2xl border border-border bg-white p-3 shadow-inner">
                <img src={d.giftPhoto} alt="QR Code kado" className="w-full object-contain" />
              </div>
              <a
                href={d.giftPhoto}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#b8933f]/60 px-5 py-2 font-sans text-[0.68rem] tracking-[0.2em] text-[#8a6a1f] transition hover:bg-[#b8933f]/10"
              >
                <GiftIcon className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
                BUKA GAMBAR QR
              </a>
            </article>
          </Smooth>
        ) : null}
      </div>

      <Smooth delay={150} className="mx-auto mt-10 max-w-xs text-center">
        <Ornament className="mb-4" />
        <p className="font-display text-[1rem] italic leading-relaxed text-ink/55">
          Terima kasih atas doa dan kebaikan hati Anda.
        </p>
      </Smooth>
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
      <div className="relative mx-auto max-w-sm overflow-hidden text-center">
        <Ornament className="mb-8" />
        <Smooth variant="left">
          <p className="font-display text-[1.15rem] leading-[1.8] text-cream/90">{d.thankYouText}</p>
        </Smooth>
        <Smooth variant="right" delay={300}>
          <p className="mt-9 font-kicker text-[0.62rem] tracking-[0.4em] text-cream/65">KAMI YANG BERBAHAGIA</p>
        </Smooth>
        {d.brideName ? (
          <Smooth variant="left" delay={500}>
            <p className="mt-4 font-script text-[3.2rem] leading-none text-[#ecd48f]">{d.brideName}</p>
          </Smooth>
        ) : null}
        {d.brideName && d.groomName ? (
          <Smooth variant="zoom" delay={800}>
            <p className="my-2 font-display text-2xl italic text-cream/80">&amp;</p>
          </Smooth>
        ) : null}
        {d.groomName ? (
          <Smooth variant="right" delay={1000}>
            <p className="font-script text-[3.2rem] leading-none text-[#ecd48f]">{d.groomName}</p>
          </Smooth>
        ) : null}
        <Smooth delay={1300}>
          <p className="mt-8 font-kicker text-[0.62rem] tracking-[0.4em] text-cream/65">BESERTA KELUARGA</p>
        </Smooth>
      </div>
    </section>
  );
}

/** Cinematic scroll-reveal footer – place after main content */
export { CinematicFooter } from "@/components/ui/motion-footer";


export { Gallery } from "./Gallery";
export { Moments } from "./Moments";

/** Mengubah link YouTube biasa (watch, youtu.be, shorts, live) menjadi link embed. */
function youtubeEmbed(url: string) {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&playsinline=1&modestbranding=1` : "";
}

export function VideoMoment() {
  const d = useWeddingData();
  const VIDEO_URL = (d.videoUrl || "").trim();
  if (!VIDEO_URL) return null;
  const isYt = /youtube\.com|youtu\.be/.test(VIDEO_URL);
  const embed = isYt ? youtubeEmbed(VIDEO_URL) : "";
  return (
    <section className="bg-sand/40 px-5 py-14 sm:px-8">
      <SectionTitle kicker="MEMORIES" title="Video" />
      <FadeUp className="mx-auto mt-8 max-w-sm overflow-hidden rounded-2xl shadow-lg">
        {isYt && !embed ? (
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noreferrer"
            className="flex aspect-video w-full items-center justify-center bg-ink font-sans text-sm text-cream"
          >
            Tonton video di YouTube
          </a>
        ) : isYt ? (
          <div className="aspect-video w-full">
            <iframe
              src={embed}
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
        <PlayPauseIcon size={26} state={playing} />
      </button>
      </div>
    </>
  );
}
