"use client";

import { motion } from "framer-motion";
import type { InvitationSettings } from "@/lib/types";

interface CoverProps {
  settings: InvitationSettings;
  guestName?: string;
  onOpen: () => void;
}

export default function Cover({ settings, guestName, onOpen }: CoverProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
      }}
    >
      {settings.cover_photo_url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.cover_photo_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight-deep/75 via-midnight-deep/65 to-midnight-deep/85" />
        </>
      ) : (
        <div className="absolute inset-0 cover-bg" />
      )}

      <div className="relative z-10 w-full max-w-md mx-auto px-5">
        <motion.div
          className="card-dark text-center backdrop-blur-md bg-midnight-surface/70"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {settings.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt="Logo"
              className="w-14 h-14 mx-auto mb-4 object-contain opacity-90"
            />
          )}

          <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold/80 mb-3">
            {settings.cover_title || "THE WEDDING OF"}
          </p>

          <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-porcelain leading-tight">
            {settings.groom_name}{" "}
            <span className="text-gold font-normal italic text-2xl md:text-3xl">&</span>{" "}
            {settings.bride_name}
          </h1>

          {settings.hashtag && (
            <p className="font-jakarta text-xs tracking-[0.2em] uppercase text-gold mt-3">
              {settings.hashtag}
            </p>
          )}

          <p className="font-jakarta text-xs tracking-widest text-porcelain/50 mt-4">
            {settings.wedding_date
              ? new Date(settings.wedding_date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </p>

          <div className="mt-6 rounded-2xl bg-midnight-base/60 border border-gold/15 p-4">
            <p className="font-jakarta text-[10px] tracking-[0.15em] uppercase text-porcelain/50">
              Kepada Yth, Bapak/Ibu/Saudara/i:
            </p>
            <p className="font-playfair text-lg text-gold-light font-medium mt-1">
              {guestName || "Tamu Kehormatan"}
            </p>
            <p className="font-jakarta text-[10px] text-porcelain/40 italic mt-0.5">
              Di Tempat
            </p>
          </div>

          <button onClick={onOpen} className="btn-gold w-full mt-6">
            Buka Undangan
          </button>

          <p className="mt-4 font-jakarta text-[10px] tracking-widest uppercase text-porcelain/35">
            Gulir untuk rangkaian acara
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
