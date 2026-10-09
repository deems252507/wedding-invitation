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
      <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold text-center mb-2">
        Rangkaian Acara
      </p>
      <div className="gold-divider"><span>✦</span></div>

      <div className="max-w-md mx-auto space-y-5 mt-8">
        {events.map((event, i) => (
          <div key={event.id || i} className="card-dark text-center">
            <span className="inline-block px-4 py-1 rounded-full border border-gold/40 text-gold font-jakarta text-[10px] tracking-[0.15em] uppercase mb-3">
              {event.title}
            </span>
            <p className="font-jakarta text-xs text-porcelain/50">{event.day}</p>
            <p className="font-playfair text-xl text-porcelain mt-1">{event.date}</p>
            <p className="font-jakarta text-xs tracking-wider text-gold/80 mt-1">
              Pukul {event.time}
            </p>
            <div className="w-10 h-px bg-gold/30 mx-auto my-4" />
            <p className="font-jakarta text-sm text-porcelain/90">{event.venue}</p>
            <p className="font-jakarta text-xs text-porcelain/45 mt-1 max-w-xs mx-auto">
              {event.address}
            </p>
            {event.map_url && (
              <a
                href={event.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-full border border-gold/30 text-gold text-xs font-jakarta hover:bg-gold/10 transition"
              >
                <MapPin size={12} />
                Lihat Lokasi
              </a>
            )}
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
