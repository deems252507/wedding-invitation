"use client";

import type { InvitationSettings } from "@/lib/types";
import SectionReveal from "./SectionReveal";

interface Props {
  settings: InvitationSettings;
}

export default function CoupleSection({ settings }: Props) {
  return (
    <SectionReveal className="section-band text-center">
      <p className="font-cormorant text-sm tracking-[2px] uppercase text-cream/70 mb-2">
        Groom & Bride
      </p>
      <p className="font-cormorant text-[15px] leading-relaxed text-cream/90 max-w-lg mx-auto mb-10">
        {settings.greeting}
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
        {/* Groom */}
        <div className="flex flex-col items-center">
          {settings.groom_photo_url ? (
            <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-cream/30 mb-4 shadow-invitation">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.groom_photo_url}
                alt={settings.groom_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full bg-cream/10 border-2 border-cream/30 mb-4 flex items-center justify-center">
              <span className="font-pinyon text-4xl text-cream/50">
                {settings.groom_name.charAt(0)}
              </span>
            </div>
          )}
          <h3 className="font-pinyon text-4xl text-cream mb-1">{settings.groom_name}</h3>
          <p className="font-cormorant text-lg text-cream/90">{settings.groom_full_name}</p>
          <p className="font-poppins text-xs text-cream/60 mt-2">Putra dari</p>
          <p className="font-caudex text-sm text-cream/80">{settings.groom_parents}</p>
          {settings.groom_instagram && (
            <a
              href={`https://instagram.com/${settings.groom_instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-rose text-sm hover:underline"
            >
              @{settings.groom_instagram}
            </a>
          )}
        </div>

        <div className="font-pinyon text-3xl text-cream/50">&</div>

        {/* Bride */}
        <div className="flex flex-col items-center">
          {settings.bride_photo_url ? (
            <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-cream/30 mb-4 shadow-invitation">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.bride_photo_url}
                alt={settings.bride_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full bg-cream/10 border-2 border-cream/30 mb-4 flex items-center justify-center">
              <span className="font-pinyon text-4xl text-cream/50">
                {settings.bride_name.charAt(0)}
              </span>
            </div>
          )}
          <h3 className="font-pinyon text-4xl text-cream mb-1">{settings.bride_name}</h3>
          <p className="font-cormorant text-lg text-cream/90">{settings.bride_full_name}</p>
          <p className="font-poppins text-xs text-cream/60 mt-2">Putri dari</p>
          <p className="font-caudex text-sm text-cream/80">{settings.bride_parents}</p>
          {settings.bride_instagram && (
            <a
              href={`https://instagram.com/${settings.bride_instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-rose text-sm hover:underline"
            >
              @{settings.bride_instagram}
            </a>
          )}
        </div>
      </div>
    </SectionReveal>
  );
}
