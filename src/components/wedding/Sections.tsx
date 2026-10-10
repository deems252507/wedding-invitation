import { useEffect, useRef, useState } from "react";
import { Reveal, Tilt, useCountdown, useParallax } from "./hooks";
import { useWeddingData } from "@/lib/WeddingContext";
import { RevealImage, RevealText, useInView } from "@/components/ui/image-text-reveal";
import { FlowButton } from "@/components/ui/flow-button";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { GoldDust, Ornament } from "./Ornament";

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

/** Foto mempelai dengan tirai pembuka + bingkai emas tipis yang menyala setelahnya. */
function FramedPhoto({
  src,
  alt,
  from,
}: {
  src: string;
  alt: string;
  from: "left" | "right" | "bottom" | "center";
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  return (
    <div
      ref={ref}
      className={`gold-frame ${inView ? "gold-frame-in" : ""} overflow-hidden rounded-2xl shadow-[0_16px_40px_-16px_rgba(0,0,0,0.25)]`}
    >
      <RevealImage src={src} alt={alt} from={from} imgClassName="aspect-[3/4] w-full object-cover" />
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
      <GoldDust />
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

export function Couple() {
  const d = useWeddingData();
  return (
    <section className="relative overflow-hidden bg-cream px-5 py-16 sm:px-8 sm:py-20">
      <FadeUp className="mx-auto max-w-md text-center">
        <Ornament className="mb-6" />
        <RevealText
          as="p"
          text={d.coupleIntro}
          variant="blur"
          stagger={28}
          className="block font-display text-[1.15rem] leading-[1.75] text-ink/75"
        />
      </FadeUp>

      {/* Mempelai Wanita */}
      <FadeUp delay={100} className="mx-auto mt-12 max-w-[280px] text-center">
        {d.bridePhoto && <FramedPhoto src={d.bridePhoto} alt={d.brideName} from="left" />}
        <RevealText as="p" text={d.brideName} by="char" stagger={70} delay={250} className="mt-6 block font-script text-[2.6rem] leading-tight text-gold-grad" />
        <p className="mt-1.5 font-display text-xl italic text-ink/85">{d.brideFullName}</p>
        <p className="mt-2 font-display text-base leading-relaxed text-ink/60">
          {d.brideParents}
        </p>
      </FadeUp>

      <FadeUp variant="zoom" delay={160} className="py-8 text-center">
        <RevealText as="p" text="&" variant="blur" className="block font-script text-6xl text-gold-grad" />
      </FadeUp>

      {/* Mempelai Pria */}
      <FadeUp delay={200} className="mx-auto max-w-[280px] text-center">
        {d.groomPhoto && <FramedPhoto src={d.groomPhoto} alt={d.groomName} from="right" />}
        <RevealText as="p" text={d.groomName} by="char" stagger={70} delay={250} className="mt-6 block font-script text-[2.6rem] leading-tight text-gold-grad" />
        <p className="mt-1.5 font-display text-xl italic text-ink/85">{d.groomFullName}</p>
        <p className="mt-2 font-display text-base leading-relaxed text-ink/60">
          {d.groomParents}
        </p>
      </FadeUp>
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

export function Events() {
  const d = useWeddingData();
  return (
    <section className="bg-sand/50 px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="WEDDING" title="Event" />
      <div className="mx-auto mt-14 max-w-md space-y-10">
        {d.events.map((e, idx) => (
          <Reveal key={e.name + idx} variant={idx % 2 ? "tilt-right" : "tilt-left"} delay={idx * 120}>
            <Tilt className="relative border border-border bg-card px-7 py-10 text-center tilt-shadow outline outline-1 -outline-offset-8 outline-gold/30" max={7}>
              <RevealText as="h3" text={e.name} variant="blur" stagger={70} className="block font-display text-[1.7rem] font-medium italic leading-tight text-gold-grad" />
              {e.desc && (
                <p className="mt-4 font-sans text-[0.7rem] leading-relaxed tracking-wide text-muted-foreground">
                  {e.desc}
                </p>
              )}
              <p className="mt-6 font-display text-xl text-ink">{e.date}</p>
              <p className="font-kicker text-[0.74rem] tracking-[0.24em] text-gold">{e.time}</p>
              <Ornament className="my-6" />
              <p className="font-display text-xl text-ink">{e.place}</p>
              <p className="mt-2 font-sans text-[0.68rem] leading-relaxed text-muted-foreground">
                {e.address}
              </p>
              {e.map && (
                <a
                  href={e.map}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ink sheen mt-7 inline-flex"
                >
                  LIHAT PETA
                </a>
              )}
            </Tilt>
          </Reveal>
        ))}
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
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState<"" | "hadir" | "tidak">("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");
  const [thanks, setThanks] = useState(false);

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

  return (
    <section className="bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="UCAPAN & DOA" title="Prayers & Wishes" />
      <Reveal className="mx-auto mt-10 max-w-sm">
        <form
          className="space-y-6"
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
              const res = await createWish({
                guest_name: name,
                message: text,
                attendance,
              });
              // Kehadiran disimpan terpisah (tabel rsvps) agar tidak tercampur dengan ucapan.
              const rsvp = await createRsvp({ guest_name: name, attendance, guests });
              if (!rsvp.success) console.warn("RSVP belum tersimpan:", rsvp.error);

              setWishes((w) => [
                {
                  id: res.success && res.data ? res.data.id : undefined,
                  name,
                  text,
                  time: "Baru saja",
                  fresh: true,
                },
                ...w,
              ]);
              form.reset();
              setAttendance("");
              setGuests(1);
              setThanks(true);
              window.setTimeout(() => setThanks(false), 6000);
            } catch {
              setError("Gagal mengirim. Periksa koneksi lalu coba lagi.");
            } finally {
              setLoading(false);
            }
          }}
        >
          <input name="name" required className="field" placeholder="Nama Tamu" autoComplete="name" />
          <textarea name="text" required rows={3} className="field" placeholder="Ucapan & Doa" />

          <div className="space-y-3">
            <p className="text-center font-display text-base italic text-ink/70">
              Apakah Anda dapat hadir?
            </p>
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

          {error ? <p className="text-center font-sans text-xs text-red-600">{error}</p> : null}
          {thanks ? (
            <p className="wish-new text-center font-display text-base italic text-gold">
              Terima kasih, ucapan Anda telah kami terima.
            </p>
          ) : null}
          <button type="submit" className="btn-ink w-full" disabled={loading}>
            {loading ? "Mengirim…" : "KIRIM UCAPAN"}
          </button>
        </form>

        <div className="mt-10 max-h-80 space-y-5 overflow-y-auto pr-2">
          {wishes.length === 0 ? (
            <p className="text-center font-display text-base italic text-ink/45">
              Belum ada ucapan. Jadilah yang pertama!
            </p>
          ) : (
            wishes.map((w, i) => (
              <div
                key={w.id || i}
                className={`border-b border-border pb-4 ${w.fresh ? "wish-new" : ""}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-xl font-medium text-ink">{w.name}</p>
                  <span className="shrink-0 font-kicker text-[0.55rem] tracking-[0.18em] text-gold">
                    {w.time.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 font-display text-base leading-relaxed text-ink/70">{w.text}</p>
              </div>
            ))
          )}
        </div>
      </Reveal>
    </section>
  );
}

export function Gift() {
  const d = useWeddingData();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <section className="bg-sand/50 px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="TANDA KASIH" title="Wedding Gift" />
      <Reveal className="mx-auto mt-8 max-w-sm space-y-5 text-center">
        <RevealText
          as="p"
          text={d.giftIntro}
          variant="blur"
          stagger={28}
          className="block font-display text-[1.1rem] leading-[1.75] text-ink/70"
        />
        <div className="flex justify-center">
          <FlowButton text="Kirim Kado" onClick={() => setOpen(true)} />
        </div>
      </Reveal>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-cream p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl italic text-ink">Kado Cashless</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-2 py-1 text-ink/50 hover:bg-ink/5 hover:text-ink"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>
            <p className="mb-5 font-sans text-sm text-ink/60">
              Anda dapat memberikan kado cashless. Pilih metode pembayaran di bawah.
            </p>
            {d.giftPhoto ? (
              <div className="mb-5 flex justify-center">
                <div className="overflow-hidden rounded-2xl border border-border bg-white p-3">
                  <img
                    src={d.giftPhoto}
                    alt="QR / Gift"
                    className="h-36 w-36 object-contain"
                  />
                </div>
              </div>
            ) : null}
            <div className="space-y-3">
              {d.accounts.map((a) => (
                <div
                  key={a.bank + a.number}
                  className="rounded-xl border border-border bg-card px-4 py-4 text-center"
                >
                  {a.logo ? (
                    <div className="mb-2 flex justify-center">
                      <img src={a.logo} alt={a.bank} className="h-8 object-contain" />
                    </div>
                  ) : null}
                  <p className="eyebrow">{a.bank}</p>
                  <p className="mt-1 font-display text-lg tracking-wide text-ink">{a.number}</p>
                  <p className="font-sans text-sm text-muted-foreground">a/n {a.owner}</p>
                  <button
                    type="button"
                    className="btn-ink mt-3"
                    onClick={() => {
                      navigator.clipboard?.writeText(a.number);
                      setCopied(a.bank);
                      setTimeout(() => setCopied(null), 2000);
                    }}
                  >
                    {copied === a.bank ? "TERSALIN ✓" : "SALIN"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
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
        <p className="mb-4 font-sans text-xs tracking-[0.35em] text-cream/60 uppercase">
          Scroll down to reveal
        </p>
        <div className="mx-auto mb-8 h-24 w-px bg-gradient-to-b from-cream/50 to-transparent" />
        <RevealText as="p" text="Thank You" by="char" stagger={60} className="block font-script text-6xl text-gold-light" />
        <RevealText
          as="p"
          text={d.thankYouText}
          variant="blur"
          stagger={26}
          className="mt-6 block font-display text-[1.1rem] leading-[1.75] text-cream/85"
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


/** Gallery: auto-slide strip + grid + lightbox */
export function Gallery() {
  const d = useWeddingData();
  const images = d.gallery || [];
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const pauseRef = useRef(false);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft")
        setLightbox((i) =>
          i === null ? null : (i - 1 + images.length) % images.length,
        );
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  // Auto-slide horizontal strip
  useEffect(() => {
    const el = stripRef.current;
    if (!el || images.length < 2) return;
    const id = window.setInterval(() => {
      if (pauseRef.current || lightbox !== null) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = el.scrollLeft + el.clientWidth * 0.45;
      if (next >= max - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollTo({ left: next, behavior: "smooth" });
      }
    }, 3200);
    return () => window.clearInterval(id);
  }, [images.length, lightbox]);

  if (images.length === 0) {
    return (
      <section className="bg-cream px-5 py-16 sm:px-8">
        <SectionTitle kicker="GALLERY" title="Our Moments" />
        <p className="mt-8 text-center font-sans text-sm text-ink/40">
          Galeri foto akan segera ditambahkan
        </p>
      </section>
    );
  }

  const go = (dir: number) => {
    setLightbox((i) => {
      if (i === null) return null;
      return (i + dir + images.length) % images.length;
    });
  };

  return (
    <section className="bg-cream px-5 py-16 sm:px-8 sm:py-20">
      <SectionTitle kicker="GALLERY" title="Our Moments" />
      <FadeUp className="mx-auto mt-3 max-w-xs text-center">
        <p className="font-display text-base italic text-ink/60">
          Geser otomatis · klik untuk memperbesar
        </p>
      </FadeUp>

      <div className="mx-auto mt-8 max-w-[480px]">
        <div
          ref={stripRef}
          className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
          onMouseEnter={() => {
            pauseRef.current = true;
          }}
          onMouseLeave={() => {
            pauseRef.current = false;
          }}
          onTouchStart={() => {
            pauseRef.current = true;
          }}
          onTouchEnd={() => {
            window.setTimeout(() => {
              pauseRef.current = false;
            }, 2500);
          }}
        >
          {images.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(i)}
              className="snap-center shrink-0 w-[42%] aspect-[3/4] overflow-hidden rounded-2xl border border-ink/10 bg-sand/30 focus:outline-none focus:ring-2 focus:ring-ink/30"
            >
              <img
                src={item.image}
                alt={item.title || `Gallery ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-[480px] grid-cols-2 gap-2.5 sm:grid-cols-3">
        {images.map((item, i) => (
          <Reveal key={`g-${i}`} variant={i % 2 ? "flip" : "depth"} delay={(i % 3) * 110}>
          <button
            type="button"
            onClick={() => setLightbox(i)}
            className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-ink/10 bg-sand/30 focus:outline-none focus:ring-2 focus:ring-ink/30"
          >
            <img
              src={item.image}
              alt={item.title || `Gallery ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              loading="lazy"
            />
          </button>
          </Reveal>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/92 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full bg-cream/10 p-2 text-cream hover:bg-cream/20"
            onClick={() => setLightbox(null)}
            aria-label="Tutup"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cream/10 p-3 text-cream hover:bg-cream/20 sm:left-4"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Sebelumnya"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-cream/10 p-3 text-cream hover:bg-cream/20 sm:right-4"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Berikutnya"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className="relative mx-4 flex max-h-[88vh] max-w-[min(96vw,640px)] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightbox].image}
              alt={images[lightbox].title || ""}
              className="max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
            {images[lightbox].title ? (
              <p className="mt-3 font-display text-lg italic text-cream/90">
                {images[lightbox].title}
              </p>
            ) : null}
            <p className="mt-1 font-sans text-[0.65rem] tracking-widest text-cream/50">
              {lightbox + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

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
      <button
        type="button"
        onClick={toggle}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream shadow-lg transition hover:scale-105"
        aria-label={playing ? "Pause musik" : "Play musik"}
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
    </>
  );
}
