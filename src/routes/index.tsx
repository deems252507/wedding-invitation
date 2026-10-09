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
  Quote,
  Rsvp,
  ThankYou,
  VideoMoment,
  Wishes,
} from "@/components/wedding/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shopia & Nathan — Undangan Pernikahan 30 Januari 2027" },
      {
        name: "description",
        content:
          "Undangan pernikahan Shopia & Nathan, Sabtu 30 Januari 2027 di Yogyakarta. Konfirmasi kehadiran dan kirim doa restu di sini.",
      },
      { property: "og:title", content: "Shopia & Nathan — Undangan Pernikahan" },
      {
        property: "og:description",
        content:
          "Dengan memohon berkat Tuhan, kami mengundang Bapak/Ibu/Saudara/i pada pernikahan kami, 30 Januari 2027 di Yogyakarta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

function Invitation() {
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
          <Hero />
          <Quote />
          <Couple />
          <LoveStory />
          <Events />
          <Countdown />
          <Gallery />
          <VideoMoment />
          <Rsvp />
          <Wishes />
          <Gift />
          <ThankYou />
          <footer className="bg-ink py-6 text-center">
            <p className="font-sans text-[0.55rem] tracking-[0.3em] text-cream/50">
              SHOPIA &amp; NATHAN · 2027
            </p>
          </footer>
        </>
      )}
    </main>
  );
}
