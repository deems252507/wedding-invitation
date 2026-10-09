"use client";

import type { InvitationSettings } from "@/lib/types";
import SectionReveal from "./SectionReveal";

interface Props {
  settings: InvitationSettings;
}

export default function DressCodeSection({ settings }: Props) {
  const colors = settings.dress_code_colors || [];

  return (
    <SectionReveal className="section-band text-center">
      <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold mb-2">
        Dress Code Tamu
      </p>
      <div className="gold-divider"><span>✦</span></div>
      <h3 className="font-playfair text-2xl text-porcelain mt-2 mb-6">
        {settings.dress_code_title}
      </h3>
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {colors.map((c) => (
          <span
            key={c}
            className="px-4 py-1.5 rounded-full border border-gold/30 font-jakarta text-xs tracking-wider text-porcelain/80"
          >
            {c}
          </span>
        ))}
      </div>
      <p className="font-jakarta text-sm leading-relaxed text-porcelain/60 max-w-md mx-auto">
        {settings.dress_code_note}
      </p>
    </SectionReveal>
  );
}
