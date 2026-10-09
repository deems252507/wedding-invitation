"use client";

import type { InvitationSettings } from "@/lib/types";
import SectionReveal from "./SectionReveal";
import { MapPin } from "lucide-react";

interface Props {
  settings: InvitationSettings;
}

export default function EventsSection({ settings }: Props) {
  const events = settings.events || [];

  return (
    <SectionReveal className="section-band">
      <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-center text-cream mb-10">
        Save The Date
      </h2>

      <div className="max-w-lg mx-auto space-y-10">
        {events.map((event, i) => (
          <div
            key={event.id || i}
            className="event-card text-center"
          >
            <h3 className="font-cormorant text-lg font-semibold tracking-wider uppercase text-cream mb-3">
              {event.title}
            </h3>
            <p className="font-caudex text-sm text-cream/80">{event.day}</p>
            <p className="font-cormorant text-2xl text-cream my-1">{event.date}</p>
            <p className="font-poppins text-xs tracking-wider text-cream/70 mb-4">
              Pukul : {event.time}
            </p>
            <div className="ornament-line" />
            <p className="font-cormorant text-sm text-cream/90 mt-3">{event.venue}</p>
            <p className="font-poppins text-xs text-cream/60 mt-1 max-w-xs mx-auto">
              {event.address}
            </p>
            {event.map_url && (
              <a
                href={event.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-rose hover:underline"
              >
                <MapPin size={14} />
                Google Map
              </a>
            )}
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
