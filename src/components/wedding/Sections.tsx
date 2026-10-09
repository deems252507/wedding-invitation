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
    <Reveal variant="flip" className="text-center">
      {kicker ? (
        <p className="eyebrow animate-rise tracking-[0.42em]">{kicker}</p>
      ) : null}
      <h2 className="mt-3 font-display text-4xl italic tracking-tight text-ink animate-rise-slow">
        {title}
      </h2>
    </Reveal>
  );
}

export function Hero() {
  return (
    <ParallaxScrolling
      kicker="THE WEDDING OF"
      title="Shopia & Nathan"
      layers={[
        { layer: "1", src: heroImg, alt: "Shopia & Nathan – background" },
        { layer: "2", src: coverImg, alt: "Cover mid layer" },
        { layer: "3", title: "Shopia & Nathan" },
        { layer: "4", src: story2, alt: "Foreground detail" },
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
    <section className="bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="mx-auto max-w-md text-center">
        <p className="font-display text-xl leading-relaxed italic text-ink">
          &ldquo;Dan mereka keduanya akan menjadi satu daging, jadi mereka tidak lagi menjadi dua
          orang, melainkan satu. Oleh karena itu apa yang telah dipersatukan Tuhan, janganlah
          manusia memisahkan.&rdquo;
        </p>
        <p className="mt-6 eyebrow">MARKUS 10 : 8-9</p>
      </Reveal>
    </section>
  );
}

function Person({
  role,
  name,
  photo,
  full,
  parents,
  ig,
  variant = "tilt-left",
}: {
  role: string;
  name: string;
  photo: string;
  full: string;
  parents: string;
  ig: string;
  variant?: "tilt-left" | "tilt-right";
}) {
  return (
    <Reveal variant={variant} className="text-center">
      <Tilt className="relative mx-auto w-[74%] max-w-xs" max={11}>
        <img
          src={photo}
          alt={full}
          loading="lazy"
          width={768}
          height={1024}
          className="tilt-shadow aspect-[3/4] w-full object-cover"
        />
        <p className="lift-z absolute -bottom-6 left-1/2 -translate-x-1/2 font-script text-4xl text-ink">
          {name}
        </p>
      </Tilt>
      <p className="mt-12 eyebrow">{role}</p>
      <h3 className="mt-3 font-display text-2xl text-ink">{full}</h3>
      <p className="mt-3 font-sans text-xs leading-relaxed tracking-wide text-muted-foreground">
        {parents}
      </p>
      <p className="mt-4 font-sans text-[0.62rem] tracking-[0.28em] text-stone">@{ig}</p>
    </Reveal>
  );

}

export function Couple() {
  return (
    <section className="bg-sand/50 px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="mx-auto max-w-md text-center">
        <p className="font-display text-base leading-relaxed text-ink/80">
          Dengan memohon anugerah dan berkat Tuhan, kami memohon kehadiran Bapak/Ibu/Saudara/i pada
          acara pernikahan kami:
        </p>
      </Reveal>
      <div className="mt-20 space-y-24">
        <Person
          role="THE BRIDE"
          name="Shopia"
          photo={brideImg}
          full="Sophia Putri Rahayu"
          parents="Putri pertama dari Bapak Budi Prasetyo dan Ibu Tri Utami"
          ig="shopiaputri"
        />
        <Person
          role="THE GROOM"
          name="Nathan"
          photo={groomImg}
          full="Nathan Hermawan Wijaya"
          parents="Putra kedua dari Bapak Hanung Wijaya dan Ibu Wayan Sari Hermawan"
          ig="nathanwijaya"
          variant="tilt-right"
        />
      </div>
    </section>
  );
}

const STORY = [
  {
    year: "2020",
    title: "First Meet",
    photo: story1,
    text: "Kami bertemu di sebuah acara kampus. Meski hanya singkat, kami merasa saling tertarik dan ingin mengenal satu sama lain lebih jauh.",
  },
  {
    year: "2022",
    title: "The Journey",
    photo: story2,
    text: "Kami mulai berkencan dan membangun hubungan yang erat, saling mendukung dan tumbuh bersama melalui berbagai tantangan.",
  },
  {
    year: "2024",
    title: "The Proposal",
    photo: story3,
    text: "Kami memutuskan untuk mengikat janji suci dalam pernikahan, melangkah ke jenjang hidup baru dengan cinta dan dukungan satu sama lain.",
  },
];

export function LoveStory() {
  return (
    <section className="bg-cream px-5 py-20 sm:px-8 sm:py-24">
      <SectionTitle kicker="OUR JOURNEY" title="Love Story" />
      <div className="mx-auto mt-14 max-w-md space-y-14">
        {STORY.map((s, i) => (
          <Reveal key={s.year} variant={i % 2 ? "tilt-right" : "tilt-left"} delay={i * 100}>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center">
              <Tilt className="relative" max={10}>
                <img
                  src={s.photo}
                  alt={`${s.title} — Shopia dan Nathan ${s.year}`}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="tilt-shadow aspect-[4/3] w-full object-cover sm:aspect-[3/4]"
                />
                <span className="lift-z absolute -top-3 -left-2 bg-cream px-3 py-1 font-display text-lg text-ink">
                  {s.year}
                </span>
              </Tilt>
              <div className="min-w-0">
                <p className="eyebrow">CHAPTER 0{i + 1}</p>
                <p className="mt-2 font-display text-2xl italic text-ink">{s.title}</p>
                <p className="mt-3 font-sans text-xs leading-relaxed tracking-wide text-muted-foreground">
                  {s.text}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const EVENTS = [
  {
    name: "Holy Matrimony",
    desc: "Pemberkatan akan dilaksanakan secara terbatas dan hanya dihadiri oleh keluarga serta kerabat dekat pada:",
    date: "Sabtu, 30 Januari 2027",
    time: "10.00 WIB - Selesai",
    place: "Gereja Katolik Santo Antonius Padua Kotabaru",
    address: "Jl. Abu Bakar Ali No.1, Kotabaru, Kec. Gondokusuman, Yogyakarta",
    map: "https://maps.google.com/?q=Gereja+Katolik+Santo+Antonius+Padua+Kotabaru+Yogyakarta",
  },
  {
    name: "Wedding Reception",
    desc: "Kami mohon kehadiran Bapak/Ibu/Saudara/i pada acara resepsi pernikahan yang akan diselenggarakan pada:",
    date: "Sabtu, 30 Januari 2027",
    time: "16.00 - 18.00 WIB",
    place: "Villa Bluesteps",
    address: "Jl. Boulevard No. 7, Jl. Karangjati RT. 07, Gedongan, Bangunjiwo, Yogyakarta",
    map: "https://maps.google.com/?q=Villa+Bluesteps+Bangunjiwo+Yogyakarta",
  },
];

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
    <section className="bg-cream relative overflow-hidden">
      <div className="px-5 pt-16 sm:px-8 sm:pt-20">
        <SectionTitle kicker="MOMENTS" title="Our Gallery" />
        <Reveal className="mx-auto mt-3 max-w-xs text-center">
          <p className="font-display text-base italic text-ink/70 animate-rise">
            Geser atau scroll untuk menjelajahi momen kami
          </p>
        </Reveal>
      </div>
      {/* Flexible height: works on all phone sizes without cropping photos */}
      <div className="relative mx-auto h-[min(72vh,34rem)] min-h-[26rem] w-full max-w-[480px]">
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
