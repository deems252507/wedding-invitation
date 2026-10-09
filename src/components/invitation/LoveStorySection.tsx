"use client";

import type { InvitationSettings } from "@/lib/types";
import SectionReveal from "./SectionReveal";

interface Props {
  settings: InvitationSettings;
}

export default function LoveStorySection({ settings }: Props) {
  const stories = settings.love_story || [];

  return (
    <SectionReveal className="section-band">
      <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold text-center mb-2">
        Love Story
      </p>
      <div className="gold-divider"><span>✦</span></div>

      <div className="max-w-md mx-auto relative mt-10">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-gold/20 md:left-1/2" />
        {stories.map((item, i) => (
          <div
            key={item.id || i}
            className={`relative pl-12 md:pl-0 mb-10 ${
              i % 2 === 0 ? "md:pr-[52%] md:text-right md:pr-10" : "md:pl-[52%] md:pl-10"
            }`}
          >
            <div className="absolute left-2.5 w-3 h-3 rounded-full bg-gold border-2 border-midnight-base md:left-1/2 md:-translate-x-1.5" />
            <h3 className="font-playfair text-xl text-porcelain">{item.title}</h3>
            <p className="font-jakarta text-[11px] tracking-wider text-gold/70 mt-1">
              {item.date}
            </p>
            <p className="font-jakarta text-sm leading-relaxed text-porcelain/60 mt-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
