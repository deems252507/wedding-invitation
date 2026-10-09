"use client";

import type { InvitationSettings } from "@/lib/types";
import SectionReveal from "./SectionReveal";

interface Props {
  settings: InvitationSettings;
}

export default function GallerySection({ settings }: Props) {
  const images = settings.gallery || [];

  if (images.length === 0) {
    return (
      <SectionReveal className="section-band text-center">
        <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-cream mb-6">
          Our Gallery
        </h2>
        <p className="font-cormorant text-sm text-cream/50">
          Galeri foto akan segera ditambahkan
        </p>
      </SectionReveal>
    );
  }

  return (
    <SectionReveal className="section-band">
      <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-center text-cream mb-8">
        Our Gallery
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-3xl mx-auto">
        {images.map((url, i) => (
          <div
            key={i}
            className="aspect-square overflow-hidden rounded-sm bg-cream/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
