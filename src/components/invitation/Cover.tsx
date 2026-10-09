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
        scale: 1.05,
        filter: "blur(12px)",
        transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      {/* Background photo */}
      {settings.cover_photo_url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={settings.cover_photo_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight-deep/80 via-midnight-deep/70 to-midnight-deep/90" />
        </>
      ) : (
        <div className="absolute inset-0 cover-bg" />
      )}

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] h-[320px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto px-5">
        <motion.div
          className="card-dark text-center backdrop-blur-md bg-midnight-surface/70"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {settings.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logo_url}
              alt="Logo"
              className="w-14 h-14 mx-auto mb-4 object-contain opacity-90"
            />
          )}

          <motion.p
            className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold/80 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {settings.cover_title || "THE WEDDING OF"}
          </motion.p>

          <motion.h1
            className="font-playfair text-4xl md:text-5xl font-semibold text-porcelain leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            {settings.groom_name}{" "}
            <span className="text-gold font-normal italic text-2xl md:text-3xl">&</span>{" "}
            {settings.bride_name}
          </motion.h1>

          {settings.hashtag && (
            <motion.p
              className="font-jakarta text-xs tracking-[0.2em] uppercase text-gold mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {settings.hashtag}
            </motion.p>
          )}

          <motion.p
            className="font-jakarta text-xs tracking-widest text-porcelain/50 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            {settings.wedding_date
              ? new Date(settings.wedding_date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </motion.p>

          <motion.div
            className="mt-6 rounded-2xl bg-midnight-base/60 border border-gold/15 p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <p className="font-jakarta text-[10px] tracking-[0.15em] uppercase text-porcelain/50">
              Kepada Yth, Bapak/Ibu/Saudara/i:
            </p>
            <p className="font-playfair text-lg text-gold-light font-medium mt-1">
              {guestName || "Tamu Kehormatan"}
            </p>
            <p className="font-jakarta text-[10px] text-porcelain/40 italic mt-0.5">
              Di Tempat
            </p>
          </motion.div>

          <motion.button
            onClick={onOpen}
            className="btn-gold w-full mt-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Buka Undangan
          </motion.button>

          <motion.p
            className="mt-4 font-jakarta text-[10px] tracking-widest uppercase text-porcelain/35 animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            ↓ Gulir untuk rangkaian acara
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
