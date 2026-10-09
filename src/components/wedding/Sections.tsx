import { useState } from "react";
import { Reveal, Tilt, useCountdown, useParallax } from "./hooks";
import { WorksWheel, type WorksWheelItem } from "@/components/ui/works-wheel";
import { ParallaxScrolling } from "@/components/ui/parallax-scrolling";
import heroImg from "@/assets/hero.jpg";
import brideImg from "@/assets/bride.jpg";
import groomImg from "@/assets/groom.jpg";
import coverImg from "@/assets/cover.jpg";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";
import story3 from "@/assets/story-3.jpg";
import gal1 from "@/assets/gal-1.jpg";
import gal2 from "@/assets/gal-2.jpg";
import gal3 from "@/assets/gal-3.jpg";
import gal4 from "@/assets/gal-4.jpg";

const WEDDING_DATE = new Date("2027-01-30T10:00:00+07:00");

function SectionTitle({ kicker, title }: { kicker?: string; title: string }) {
  return (
    <Reveal variant="up" className="text-center">
      {kicker ? (
        <p className="eyebrow tracking-[0.42em]">{kicker}</p>
      ) : null}
      <h2 className="mt-3 font-display text-4xl italic tracking-tight text-ink">
        {title}
      </h2>
    </Reveal>
  );
}

/** Soft fade-up block – text + image move together */
function FadeUp({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal variant="up" className={className} delay={delay}>
      {children}
    </Reveal>
  );
}

export function Hero() {
  return (
    <ParallaxScrolling
      kicker="THE WEDDING OF"
      title="Shopia & Nathan"
      layers={[
        { layer: "1", src: heroImg, alt: "Background" },
        { layer: "2", src: coverImg, alt: "Mid layer" },
        { layer: "3", title: "Shopia & Nathan" },
        { layer: "4", src: story2, alt: "Foreground" },
      ]}
      smoothScroll
    >
      <p className="font-sans text-[0.62rem] tracking-[0.42em] text-ink/70">
        SAVE THE DATE · 30 . 01 . 2027
      </p>
    </ParallaxScrolling>
  );
}

export function Quote() {
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 sm:py-20">
      <FadeUp className="mx-auto max-w-md text-center">
        <p className="font-display text-3xl leading-none text-ink/20">&ldquo;</p>
        <p className="mt-2 font-display text-xl leading-relaxed italic text-ink">
          Dan mereka keduanya akan menjadi satu daging, jadi mereka tidak lagi
          menjadi dua orang, melainkan satu. Oleh karena itu apa yang telah
          dipersatukan Tuhan, janganlah manusia memisahkan.
        </p>
        <p className="mt-6 eyebrow">MARKUS 10 : 8-9</p>
      </FadeUp>
    </section>
  );
}

export function Couple() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Full-bleed soft background photo */}
      <div className="relative mx-auto max-w-[480px]">
        <FadeUp>
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <img
              src={heroImg}
              alt="Shopia & Nathan"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-10 text-center">
              <p className="font-sans text-[0.55rem] tracking-[0.3em] text-ink/60">
                Kami memohon doa &amp; restunya atas pernikahan kami
              </p>
              <h3 className="mt-3 font-script text-4xl text-ink">Shopia</h3>
              <p className="font-display text-lg italic text-ink/70">&amp;</p>
              <h3 className="font-script text-4xl text-ink">Nathan</h3>
              <p className="mt-2 font-sans text-[0.6rem] leading-relaxed text-ink/55">
                Putri ke-1 Bpk. Budi &amp; Ibu Tri · Putra ke-2 Bpk. Hanung &amp; Ibu Wayan
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Floating portrait card – like demo */}
        <FadeUp delay={120} className="relative z-10 -mt-16 px-8">
          <div className="mx-auto overflow-hidden rounded-2xl bg-cream shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
            <img
              src={brideImg}
              alt="Shopia"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </div>
        </FadeUp>

        <FadeUp delay={180} className="px-6 py-10 text-center">
          <p className="font-display text-2xl italic text-ink">Sophia Putri Rahayu</p>
          <p className="mt-2 font-sans text-xs leading-relaxed text-ink/60">
            Putri pertama dari Bapak Budi Prasetyo dan Ibu Tri Utami
          </p>
          <p className="mt-6 font-display text-2xl italic text-ink">Nathan Hermawan Wijaya</p>
          <p className="mt-2 font-sans text-xs leading-relaxed text-ink/60">
            Putra kedua dari Bapak Hanung Wijaya dan Ibu Wayan Sari
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

const STORY = [
  {
    title: "Pertemuan Pertama",
    photo: story1,
    text: "Kisah ini berawal ketika jumpa pandangan pertama di kampus Merayakan.",
  },
  {
    title: "Lamaran",
    photo: story2,
    text: "Tak disangka, cerita ini semakin erat untuk mengikat janji suci. Sehingga proses lamaran ini pun berlangsung hangat.",
  },
  {
    title: "Menuju Hari Bahagia",
    photo: story3,
    text: "Dengan restu orang tua dan doa keluarga, kami melangkah bersama menuju hari pernikahan.",
  },
];

export function LoveStory() {
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 sm:py-20">
      <SectionTitle title="Kisah Cinta" />
      <div className="relative mx-auto mt-12 max-w-sm">
        {/* Vertical timeline line */}
        <div className="absolute top-2 bottom-2 left-[11px] w-px bg-ink/15" aria-hidden />
        <div className="space-y-10">
          {STORY.map((s, i) => (
            <FadeUp key={s.title} delay={i * 90}>
              <div className="relative flex gap-5 pl-1">
                <div className="relative z-10 mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream">
                  <span className="text-ink/70">♥</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_-18px_rgba(0,0,0,0.2)]">
                    <img
                      src={s.photo}
                      alt={s.title}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover"
                    />
                  </div>
                  <p className="mt-4 font-display text-xl italic text-ink">{s.title}</p>
                  <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink/65">
                    {s.text}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Events() {
  return (
    <section className="bg-sand/50 px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="WEDDING" title="Event" />
      <div className="mx-auto mt-14 max-w-md space-y-10">
        {EVENTS.map((e, idx) => (
          <Reveal key={e.name} variant={idx % 2 ? "tilt-right" : "tilt-left"} delay={idx * 120}>
            <Tilt className="border border-border bg-card px-7 py-10 text-center tilt-shadow" max={7}>
              <h3 className="font-display text-2xl italic text-ink">{e.name}</h3>
              <p className="mt-4 font-sans text-[0.7rem] leading-relaxed tracking-wide text-muted-foreground">
                {e.desc}
              </p>
              <p className="mt-6 font-display text-lg text-ink">{e.date}</p>
              <p className="font-sans text-[0.68rem] tracking-[0.22em] text-stone">{e.time}</p>
              <div className="mx-auto my-6 h-px w-10 bg-border" />
              <p className="font-display text-lg text-ink">{e.place}</p>
              <p className="mt-2 font-sans text-[0.68rem] leading-relaxed text-muted-foreground">
                {e.address}
              </p>
              <a
                href={e.map}
                target="_blank"
                rel="noreferrer"
                className="btn-ink sheen mt-7 inline-flex"
              >
                LIHAT PETA
              </a>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Countdown() {
  const t = useCountdown(WEDDING_DATE);
  const parallax = useParallax<HTMLImageElement>(0.16);
  const items = [
    { v: t.days, l: "Hari" },
    { v: t.hours, l: "Jam" },
    { v: t.minutes, l: "Menit" },
    { v: t.seconds, l: "Detik" },
  ];
  return (
    <section className="scene relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28">
      <img
        ref={parallax}
        src={coverImg}
        alt=""
        aria-hidden
        loading="lazy"
        width={1024}
        height={1536}
        className="absolute inset-0 h-full w-full scale-110 object-cover"
      />
      <div className="absolute inset-0 bg-ink/65" />
      <div className="relative text-center">
        <p className="font-sans text-[0.6rem] tracking-[0.42em] text-cream/75">COUNTING DAYS</p>
        <div className="mx-auto mt-8 grid max-w-sm grid-cols-4 gap-3">
          {items.map((i, idx) => (
            <Reveal key={i.l} variant="flip" delay={idx * 110}>
              <div className="border border-cream/30 py-4 backdrop-blur-[2px]">
                <p className="font-display text-3xl text-cream">{i.v}</p>
                <p className="font-sans text-[0.55rem] tracking-[0.22em] text-cream/70">
                  {i.l.toUpperCase()}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}


export function Rsvp() {
  const [sent, setSent] = useState(false);
  return (
    <section className="bg-sand/50 px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="KONFIRMASI KEHADIRAN" title="RSVP" />
      <Reveal className="mx-auto mt-10 max-w-sm">
        {sent ? (
          <p className="text-center font-display text-lg italic text-ink">
            Terima kasih sudah mengisi informasi kehadiran.
          </p>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <p className="text-center font-sans text-[0.7rem] leading-relaxed text-muted-foreground">
              Kehadiran Bapak/Ibu/Saudara/i akan menjadi kehormatan besar bagi kami dan keluarga.
            </p>
            <input required className="field" placeholder="Nama Tamu" />
            <select required className="field" defaultValue="">
              <option value="" disabled>
                Konfirmasi Kehadiran
              </option>
              <option>Saya akan hadir</option>
              <option>Maaf, saya belum bisa hadir</option>
            </select>
            <select className="field" defaultValue="1">
              <option value="1">1 Orang</option>
              <option value="2">2 Orang</option>
            </select>
            <button type="submit" className="btn-ink w-full">
              KONFIRMASI KEHADIRAN
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}

type Wish = { name: string; text: string; time: string };

export function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([
    { name: "Dewi", text: "Selamat menempuh hidup baru, bahagia selalu!", time: "2 jam lalu" },
    { name: "Arya", text: "Semoga menjadi keluarga yang sakinah dan penuh cinta.", time: "1 hari lalu" },
  ]);
  return (
    <section className="bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="UCAPAN & DOA" title="Prayers & Wishes" />
      <Reveal className="mx-auto mt-10 max-w-sm">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const data = new FormData(form);
            setWishes((w) => [
              {
                name: String(data.get("name") ?? ""),
                text: String(data.get("text") ?? ""),
                time: "Baru saja",
              },
              ...w,
            ]);
            form.reset();
          }}
        >
          <input name="name" required className="field" placeholder="Nama Tamu" />
          <textarea name="text" required rows={3} className="field" placeholder="Ucapan & Doa" />
          <button type="submit" className="btn-ink w-full">
            BERI UCAPAN
          </button>
        </form>

        <div className="mt-10 max-h-72 space-y-5 overflow-y-auto pr-2">
          {wishes.map((w, i) => (
            <div key={i} className="border-b border-border pb-4">
              <div className="flex items-baseline justify-between">
                <p className="font-display text-lg text-ink">{w.name}</p>
                <span className="font-sans text-[0.55rem] tracking-[0.2em] text-stone">
                  {w.time.toUpperCase()}
                </span>
              </div>
              <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground">
                {w.text}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

const ACCOUNTS = [
  { bank: "BCA", number: "8772168386124", owner: "Sophia Putri Rahayu" },
  { bank: "MANDIRI", number: "5124125213", owner: "Nathan Hermawan Wijaya" },
];

export function Gift() {
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <section className="bg-sand/50 px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="TANDA KASIH" title="Wedding Gift" />
      <Reveal className="mx-auto mt-8 max-w-sm space-y-5">
        <p className="text-center font-sans text-[0.7rem] leading-relaxed text-muted-foreground">
          Kehadiran Bapak/Ibu/Saudara/i merupakan hadiah terindah. Namun apabila hendak memberikan
          tanda kasih, dapat melalui rekening berikut:
        </p>
        {ACCOUNTS.map((a) => (
          <div key={a.bank} className="border border-border bg-card px-6 py-6 text-center">
            <p className="eyebrow">{a.bank}</p>
            <p className="mt-2 font-display text-xl tracking-[0.1em] text-ink">{a.number}</p>
            <p className="font-sans text-[0.68rem] text-muted-foreground">a/n {a.owner}</p>
            <button
              className="btn-ink mt-4"
              onClick={() => {
                navigator.clipboard?.writeText(a.number);
                setCopied(a.bank);
              }}
            >
              {copied === a.bank ? "TERSALIN" : "SALIN"}
            </button>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

export function ThankYou() {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-28">
      <img
        src={heroImg}
        alt=""
        aria-hidden
        loading="lazy"
        width={1536}
        height={1024}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/70" />
      <div className="relative mx-auto max-w-sm text-center">
        <p className="font-script text-5xl text-cream">Thank You</p>
        <p className="mt-6 font-sans text-[0.7rem] leading-relaxed tracking-wide text-cream/75">
          Menjadi sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam hari
          bahagia kami. Terima kasih atas segala ucapan, doa, dan perhatian yang diberikan.
        </p>
        <p className="mt-8 font-sans text-[0.6rem] tracking-[0.32em] text-cream/60">
          KAMI YANG BERBAHAGIA
        </p>
        <p className="mt-3 font-display text-3xl text-cream">Shopia &amp; Nathan</p>
        <p className="mt-2 font-sans text-[0.6rem] tracking-[0.28em] text-cream/60">
          BESERTA KELUARGA
        </p>
      </div>
    </section>
  );
}


const GALLERY_ITEMS: WorksWheelItem[] = [
  { title: "First Glance", image: gal1 },
  { title: "Golden Hour", image: gal2 },
  { title: "Together", image: heroImg },
  { title: "Quiet Moments", image: gal3 },
  { title: "In Bloom", image: gal4 },
  { title: "Shopia", image: brideImg },
  { title: "The Promise", image: coverImg },
  { title: "Nathan", image: groomImg },
  { title: "Love Story", image: story2 },
];

export function Gallery() {
  return (
    <section className="bg-cream relative overflow-hidden pb-6">
      <div className="px-5 pt-14 sm:px-8 sm:pt-16">
        <SectionTitle kicker="MOMENTS" title="Galeri" />
        <FadeUp className="mx-auto mt-3 max-w-xs text-center">
          <p className="font-display text-base italic text-ink/60">
            Geser untuk melihat momen kami
          </p>
        </FadeUp>
      </div>
      <div className="relative mx-auto h-[min(68vh,32rem)] min-h-[24rem] w-full max-w-[480px]">
        <WorksWheel
          items={GALLERY_ITEMS}
          label="Our Moments"
          action="Lihat"
          className="bg-cream text-ink"
        />
      </div>
    </section>
  );
}

/** Simple video section – just set VIDEO_URL */
const VIDEO_URL = ""; // isi URL video (YouTube embed / mp4) di sini

export function VideoMoment() {
  if (!VIDEO_URL) {
    return (
      <section className="bg-sand/40 px-5 py-14 sm:px-8">
        <SectionTitle kicker="MEMORIES" title="Video" />
        <FadeUp className="mx-auto mt-8 max-w-sm">
          <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-ink/20 bg-cream/80">
            <p className="px-6 text-center font-sans text-sm text-ink/50">
              Upload video: isi konstanta <code className="text-ink/70">VIDEO_URL</code> di Sections.tsx
              <br />
              <span className="text-xs">(link YouTube embed atau file .mp4 di /public)</span>
            </p>
          </div>
        </FadeUp>
      </section>
    );
  }
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
            controls
            playsInline
            className="aspect-video w-full object-cover"
          />
        )}
      </FadeUp>
    </section>
  );
}
