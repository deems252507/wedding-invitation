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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center cover-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center px-6 max-w-md">
        <motion.p
          className="font-cormorant text-sm tracking-[3px] uppercase text-cream/80 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {settings.cover_title || "THE WEDDING OF"}
        </motion.p>

        <motion.h1
          className="font-pinyon text-5xl md:text-[55px] leading-none text-cream mb-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {settings.groom_name} & {settings.bride_name}
        </motion.h1>

        <motion.p
          className="font-cormorant text-lg tracking-widest text-cream/70 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {settings.wedding_date
            ? new Date(settings.wedding_date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              }).replace(/\//g, " . ")
            : "04 . 05 . 26"}
        </motion.p>

        <div className="ornament-line" />

        <motion.p
          className="font-cormorant text-sm text-cream/60 mt-6 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Kepada Yth, Bapak/Ibu/Saudara/i:
        </motion.p>

        <motion.p
          className="font-cormorant text-xl font-semibold text-cream mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {guestName || "Tamu Undangan"}
        </motion.p>

        <motion.button
          onClick={onOpen}
          className="btn-ornamental"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Buka Undangan
        </motion.button>
      </div>
    </motion.div>
  );
}
