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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cover-overlay overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: "blur(8px)",
        transition: { duration: 1, ease: "easeInOut" },
      }}
    >
      {/* Decorative rings */}
      <motion.div
        className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full border border-cream/10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute w-[340px] h-[340px] md:w-[480px] md:h-[480px] rounded-full border border-cream/5"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.1 }}
      />

      <div className="relative text-center px-6 max-w-md z-10">
        {settings.logo_url && (
          <motion.img
            src={settings.logo_url}
            alt="Logo"
            className="w-16 h-16 mx-auto mb-4 object-contain opacity-80"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.1 }}
          />
        )}

        <motion.p
          className="font-cormorant text-xs md:text-sm tracking-[4px] uppercase text-cream/70 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          {settings.cover_title || "THE WEDDING OF"}
        </motion.p>

        <motion.h1
          className="font-pinyon text-5xl md:text-[58px] leading-[0.9] text-cream text-glow mb-1"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          {settings.groom_name}
        </motion.h1>

        <motion.p
          className="font-cormorant text-base text-cream/50 my-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          &
        </motion.p>

        <motion.h1
          className="font-pinyon text-5xl md:text-[58px] leading-[0.9] text-cream text-glow mb-4"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          {settings.bride_name}
        </motion.h1>

        <motion.p
          className="font-cormorant text-sm tracking-[3px] text-cream/60 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
        >
          {settings.wedding_date
            ? new Date(settings.wedding_date)
                .toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })
                .replace(/\//g, " . ")
            : "04 . 05 . 26"}
        </motion.p>

        <motion.div
          className="ornament-diamond"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          <span>✦</span>
        </motion.div>

        <motion.p
          className="font-cormorant text-sm text-cream/50 mt-4 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
        >
          Kepada Yth, Bapak/Ibu/Saudara/i:
        </motion.p>

        <motion.p
          className="font-cormorant text-xl font-semibold text-cream mb-10"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
        >
          {guestName || "Tamu Undangan"}
        </motion.p>

        <motion.button
          onClick={onOpen}
          className="btn-ornamental"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
        >
          Buka Undangan
        </motion.button>
      </div>
    </motion.div>
  );
}
