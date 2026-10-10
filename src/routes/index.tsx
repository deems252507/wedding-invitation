import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cover } from "@/components/wedding/Cover";
import {
  Couple,
  Countdown,
  Events,
  Gallery,
  Gift,
  Hero,
  LoveStory,
  MusicControl,
  Quote,
  Rsvp,
  ThankYou,
  CinematicFooter,
  VideoMoment,
  Wishes,
} from "@/components/wedding/Sections";
import { WeddingProvider } from "@/lib/WeddingContext";
import { useWeddingData } from "@/lib/WeddingContext";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Undangan Pernikahan" },
      {
        name: "description",
        content: "Undangan pernikahan digital. Konfirmasi kehadiran dan kirim doa restu di sini.",
      },
      { property: "og:title", content: "Undangan Pernikahan" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitationPage,
});

function InvitationPage() {
  return (
    <WeddingProvider>
      <Invitation />
    </WeddingProvider>
  );
}

function Invitation() {
  const d = useWeddingData();
  const [opened, setOpened] = useState(false);
  const [guest, setGuest] = useState("Tamu Undangan");

  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (to) setGuest(to);
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  useEffect(() => {
    document.title = `${d.brideName} & ${d.groomName} — Undangan Pernikahan`;
  }, [d.brideName, d.groomName]);

  return (
    <main className="mx-auto max-w-[480px] bg-cream shadow-2xl">
      {!opened ? (
        <Cover
          guest={guest}
          onOpen={() => {
            setOpened(true);
            window.scrollTo({ top: 0 });
          }}
        />
      ) : (
        <>
          {d.heroPhoto || d.videoUrl ? (
            <ScrollExpandMedia
              mediaType={d.videoUrl ? "video" : "image"}
              mediaSrc={d.videoUrl || d.heroPhoto}
              posterSrc={d.heroPhoto || undefined}
              title={`${d.brideName} & ${d.groomName}`}
              date={d.weddingDateLabel}
              scrollToExpand="GULIR UNTUK MELIHAT CERITA KAMI"
            />
          ) : (
            <Hero />
          )}
          {(d.quote || d.quoteSource) && <Quote />}
          <Couple />
          {d.story.length > 0 && <LoveStory />}
          {d.events.length > 0 && <Events />}
          {d.weddingDateISO && <Countdown />}
          {d.gallery.length > 0 && <Gallery />}
          {d.videoUrl && <VideoMoment />}
          <Rsvp />
          <Wishes />
          {d.accounts.length > 0 && <Gift />}
          <ThankYou />
          <CinematicFooter />
          <MusicControl />
          <footer className="relative z-10 bg-ink py-6 text-center">
            <p className="font-sans text-[0.55rem] tracking-[0.3em] text-cream/50">
              {d.brideName.toUpperCase()} &amp; {d.groomName.toUpperCase()} ·{" "}
              {d.weddingDateLabel}
            </p>
            <a
              href="/admin"
              className="mt-2 inline-block font-sans text-[0.5rem] tracking-widest text-cream/30 hover:text-cream/60"
            >
              Admin
            </a>
          </footer>
        </>
      )}
    </main>
  );
}
