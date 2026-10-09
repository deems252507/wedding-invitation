"use client";

import { useState } from "react";
import type { InvitationSettings } from "@/lib/types";
import SectionReveal from "./SectionReveal";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  settings: InvitationSettings;
}

export default function GallerySection({ settings }: Props) {
  const images = settings.gallery || [];
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <SectionReveal className="section-band">
      <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold text-center mb-2">
        Our Gallery
      </p>
      <div className="gold-divider"><span>✦</span></div>

      {images.length === 0 ? (
        <p className="font-jakarta text-sm text-center text-porcelain/40 mt-6">
          Galeri foto akan segera ditambahkan
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 max-w-3xl mx-auto mt-8">
          {images.map((url, i) => (
            <motion.button
              key={i}
              type="button"
              className="aspect-[3/4] overflow-hidden rounded-2xl bg-midnight-surface cursor-pointer border border-gold/10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.35 }}
              onClick={() => setLightbox(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>
            <motion.img
              src={images[lightbox]}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SectionReveal>
  );
}
