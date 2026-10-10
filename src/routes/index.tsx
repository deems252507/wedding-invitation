import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cover } from "@/components/wedding/Cover";
import { Expand } from "@/components/wedding/Expand";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { ScrollProgressBar } from "@/components/ui/scroll-progress";
import { Navbar } from "@/components/wedding/Navbar";
import {
  Couple,
  Countdown,
  Events,
  Gallery,
  Gift,
  Hero,
  LoveStory,
  Moments,
  MusicControl,
  Quote,
  ThankYou,
  VideoMoment,
  Wishes,
} from "@/components/wedding/Sections";
import { WeddingProvider } from "@/lib/WeddingContext";
import { useWeddingData } from "@/lib/WeddingContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Undangan Pernikahan" },
      {
        name: "description",
        content: "Undangan pernikahan digital. Kirim ucapan dan doa restu di sini.",
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
    const names = [d.brideName, d.groomName].filter(Boolean).join(" & ");
    document.title = names ? `${names} — Undangan Pernikahan` : "Undangan Pernikahan";
  }, [d.brideName, d.groomName]);

  return (
    <main className="relative mx-auto max-w-[480px] overflow-x-clip">
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
          <ScrollProgressBar />
          {/* Konten berada di z-10 dan menutupi footer sinematik yang diam di belakang */}
          <div className="relative z-10 mb-[70dvh] bg-cream shadow-2xl">
            <Hero />
            <Expand />
            {d.quote && <Quote />}
            {(d.brideName || d.groomName) && <Couple />}
            {d.moments.length > 0 && <Moments />}
            {d.story.length > 0 && <LoveStory />}
            {d.events.length > 0 && <Events />}
            {d.weddingDateISO && <Countdown />}
            {d.gallery.length > 0 && <Gallery />}
            {d.videoUrl && <VideoMoment />}
            <Wishes />
            {(d.accounts.length > 0 || d.giftPhoto) && <Gift />}
            {d.thankYouText && <ThankYou />}
          </div>
          <MusicControl />
          <Navbar />
          <CinematicFooter />
        </>
      )}
    </main>
  );
}
