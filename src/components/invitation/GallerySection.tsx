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

  if (images.length === 0) {
    return (
      <SectionReveal className="section-band text-center">
        <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-cream mb-2">
          Our Gallery
        </h2>
        <div className="ornament-diamond"><span>✦</span></div>
        <p className="font-cormorant text-sm text-cream/40 mt-4">
          Galeri foto akan segera ditambahkan
        </p>
      </SectionReveal>
    );
  }

  return (
    <SectionReveal className="section-band">
      <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-center text-cream mb-2">
        Our Gallery
      </h2>
      <div className="ornament-diamond"><span>✦</span></div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-3xl mx-auto mt-6">
        {images.map((url, i) => (
          <motion.button
            key={i}
            type="button"
            className="aspect-square overflow-hidden rounded-sm bg-cream/5 cursor-pointer"
            whileHover={{ scale: 1.02 }}
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

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              className="max-w-full max-h-[85vh] object-contain rounded"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SectionReveal>
  );
}
