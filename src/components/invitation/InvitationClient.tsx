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

interface Props {
  settings: InvitationSettings;
  guestName?: string;
}

export default function InvitationClient({ settings, guestName }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!opened && (
          <Cover
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
          transition={{ duration: 0.8 }}
          className="min-h-screen bg-navy text-cream"
        >
          {/* Hero */}
          <SectionReveal className="section-band text-center pt-16 pb-12">
            <p className="font-cormorant text-sm tracking-[3px] uppercase text-cream/70 mb-3">
              The Wedding of
            </p>
            <h1 className="font-pinyon text-5xl md:text-[55px] leading-tight text-cream">
              {settings.groom_name}
            </h1>
            <p className="font-cormorant text-lg text-cream/60 my-1">and</p>
            <h1 className="font-pinyon text-5xl md:text-[55px] leading-tight text-cream mb-4">
              {settings.bride_name}
            </h1>
            <p className="font-cormorant text-base tracking-widest text-cream/70">
              {settings.wedding_date
                ? new Date(settings.wedding_date)
                    .toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                    .replace(/\//g, " . ")
                : ""}
            </p>
            {settings.hashtag && (
              <p className="font-poppins text-xs tracking-wider text-rose mt-3">
                {settings.hashtag}
              </p>
            )}
          </SectionReveal>

          {/* Quote */}
          {(settings.opening_quote || settings.opening_quote_source) && (
            <SectionReveal className="section-band text-center max-w-lg mx-auto">
              <p className="font-cormorant text-sm italic leading-relaxed text-cream/80">
                &ldquo;{settings.opening_quote}&rdquo;
              </p>
              {settings.opening_quote_source && (
                <p className="font-poppins text-[10px] tracking-wider text-cream/50 mt-3">
                  {settings.opening_quote_source}
                </p>
              )}
            </SectionReveal>
          )}

          <CoupleSection settings={settings} />

          {/* Countdown */}
          <SectionReveal className="section-band text-center">
            <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-cream mb-6">
              Save The Date
            </h2>
            <Countdown targetDate={settings.wedding_date} />
          </SectionReveal>

          <EventsSection settings={settings} />
          <DressCodeSection settings={settings} />
          <LoveStorySection settings={settings} />
          <GallerySection settings={settings} />
          <GiftSection settings={settings} />
          <WishesSection />

          {/* Closing */}
          <SectionReveal className="section-band text-center pb-20">
            <p className="font-cormorant text-[15px] leading-relaxed text-cream/80 max-w-md mx-auto mb-6">
              {settings.closing_text}
            </p>
            <p className="font-pinyon text-3xl text-cream">
              {settings.groom_name} & {settings.bride_name}
            </p>
            {settings.hashtag && (
              <p className="font-poppins text-xs tracking-wider text-rose mt-2">
                {settings.hashtag}
              </p>
            )}
            <p className="font-poppins text-[10px] text-cream/30 mt-12">
              Made with ♥
            </p>
          </SectionReveal>
        </motion.main>
      )}
    </>
  );
}
