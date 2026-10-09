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
      <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-center text-cream mb-10">
        Love Story
      </h2>

      <div className="max-w-md mx-auto relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-cream/20 md:left-1/2 md:-translate-x-px" />

        {stories.map((item, i) => (
          <div
            key={item.id || i}
            className={`relative pl-12 md:pl-0 mb-10 ${
              i % 2 === 0 ? "md:pr-[50%] md:text-right md:pr-10" : "md:pl-[50%] md:pl-10"
            }`}
          >
            <div
              className={`absolute left-2.5 w-3 h-3 rounded-full bg-rose border-2 border-cream md:left-1/2 md:-translate-x-1.5 ${
                i % 2 === 0 ? "" : ""
              }`}
            />
            <h3 className="font-pinyon text-2xl text-cream">{item.title}</h3>
            <p className="font-poppins text-xs tracking-wider text-cream/60 mt-1">
              {item.date}
            </p>
            <p className="font-cormorant text-[15px] leading-relaxed text-cream/80 mt-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
