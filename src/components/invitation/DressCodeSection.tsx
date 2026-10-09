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
      <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-cream mb-2">
        DRESS CODE
      </h2>
      <p className="font-pinyon text-3xl text-cream mb-6">
        {settings.dress_code_title}
      </p>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {colors.map((c) => (
          <span
            key={c}
            className="px-4 py-1.5 border border-cream/30 rounded-full font-poppins text-xs tracking-wider text-cream"
          >
            {c}
          </span>
        ))}
      </div>

      <p className="font-cormorant text-[15px] leading-relaxed text-cream/80 max-w-md mx-auto">
        {settings.dress_code_note}
      </p>
    </SectionReveal>
  );
}
