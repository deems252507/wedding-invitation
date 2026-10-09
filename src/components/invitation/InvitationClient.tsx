"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { InvitationSettings } from "@/lib/types";
import Cover from "./Cover";
import Countdown from "./Countdown";
import CoupleSection from "./CoupleSection";
import EventsSection from "./EventsSection";
import DressCodeSection from "./DressCodeSection";
import LoveStorySection from "./LoveStorySection";
import GallerySection from "./GallerySection";
import GiftSection from "./GiftSection";
import WishesSection from "./WishesSection";
import SectionReveal from "./SectionReveal";
import MusicPlayer from "./MusicPlayer";
import Particles from "./Particles";

interface Props {
  settings: InvitationSettings;
  guestName?: string;
}

export default function InvitationClient({ settings, guestName }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {!opened && (
          <Cover
            key="cover"
            settings={settings}
            guestName={guestName}
            onOpen={() => setOpened(true)}
          />
        )}
      </AnimatePresence>

      {opened && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-screen bg-midnight-deep text-porcelain relative"
        >
          <Particles />
          <MusicPlayer url={settings.music_url} autoPlay />

          <SectionReveal className="section-band text-center pt-16 pb-6">
            {settings.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.logo_url}
                alt="Logo"
                className="w-12 h-12 mx-auto mb-4 object-contain opacity-80"
              />
            )}
            <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold/80 mb-3">
              The Wedding of
            </p>
            <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-porcelain leading-tight">
              {settings.groom_name}{" "}
              <span className="text-gold italic font-normal text-2xl">&</span>{" "}
              {settings.bride_name}
            </h1>
            <div className="gold-divider"><span>✦</span></div>
            <p className="font-jakarta text-xs tracking-widest text-porcelain/50">
              {settings.wedding_date
                ? new Date(settings.wedding_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </p>
            {settings.hashtag && (
              <p className="font-jakarta text-xs tracking-[0.2em] text-gold mt-2">
                {settings.hashtag}
              </p>
            )}
          </SectionReveal>

          {(settings.opening_quote || settings.opening_quote_source) && (
            <SectionReveal className="section-band">
              <div className="card-dark max-w-lg mx-auto text-center">
                <p className="font-jakarta text-[10px] tracking-[0.2em] uppercase text-gold mb-4">
                  With Love
                </p>
                <p className="font-playfair text-sm italic leading-relaxed text-porcelain/80">
                  &ldquo;{settings.opening_quote}&rdquo;
                </p>
                {settings.opening_quote_source && (
                  <p className="font-jakarta text-[10px] tracking-wider text-porcelain/40 mt-4">
                    {settings.opening_quote_source}
                  </p>
                )}
              </div>
            </SectionReveal>
          )}

          <CoupleSection settings={settings} />

          <SectionReveal className="section-band text-center">
            <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold mb-2">
              Save The Date
            </p>
            <div className="gold-divider"><span>✦</span></div>
            <Countdown targetDate={settings.wedding_date} />
          </SectionReveal>

          <EventsSection settings={settings} />
          <DressCodeSection settings={settings} />
          <LoveStorySection settings={settings} />
          <GallerySection settings={settings} />
          <GiftSection settings={settings} />
          <WishesSection />

          <SectionReveal className="section-band text-center pb-24">
            <div className="gold-divider"><span>✦</span></div>
            <p className="font-jakarta text-sm leading-relaxed text-porcelain/65 max-w-md mx-auto mb-6">
              {settings.closing_text}
            </p>
            <p className="font-playfair text-2xl text-porcelain">
              {settings.groom_name}{" "}
              <span className="text-gold italic">&</span>{" "}
              {settings.bride_name}
            </p>
            {settings.hashtag && (
              <p className="font-jakarta text-xs tracking-[0.2em] text-gold mt-2">
                {settings.hashtag}
              </p>
            )}
            <p className="font-jakarta text-[10px] text-porcelain/25 mt-12">
              Made with ♥
            </p>
          </SectionReveal>
        </motion.main>
      )}
    </>
  );
}
