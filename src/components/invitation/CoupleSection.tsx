"use client";

import type { InvitationSettings } from "@/lib/types";
import SectionReveal from "./SectionReveal";

interface Props {
  settings: InvitationSettings;
}

function PersonCard({
  name,
  fullName,
  parents,
  instagram,
  photoUrl,
  label,
}: {
  name: string;
  fullName: string;
  parents: string;
  instagram: string | null;
  photoUrl: string | null;
  label: string;
}) {
  return (
    <div className="card-porcelain flex flex-col items-center text-center max-w-xs w-full mx-auto">
      <div className="relative mb-4">
        {photoUrl ? (
          <div className="w-36 h-36 rounded-full overflow-hidden border-[3px] border-gold shadow-gold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-36 h-36 rounded-full bg-gold/10 border-[3px] border-gold/40 flex items-center justify-center">
            <span className="font-playfair text-4xl text-gold/60">{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <p className="font-jakarta text-[10px] tracking-[0.2em] uppercase text-gold mb-1">
        {label}
      </p>
      <h3 className="font-playfair text-2xl font-semibold text-[#1A1D23]">{name}</h3>
      <p className="font-jakarta text-sm text-[#596173] mt-1">{fullName}</p>
      <div className="w-8 h-px bg-gold/40 my-3" />
      <p className="font-jakarta text-[11px] text-[#596173]">
        Putra/i dari
        <br />
        <span className="font-medium text-[#1A1D23]">{parents}</span>
      </p>
      {instagram && (
        <a
          href={`https://instagram.com/${instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 font-jakarta text-xs text-gold hover:underline"
        >
          @{instagram}
        </a>
      )}
    </div>
  );
}

export default function CoupleSection({ settings }: Props) {
  return (
    <SectionReveal className="section-band">
      <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold text-center mb-2">
        Mempelai Pria & Wanita
      </p>
      <div className="gold-divider"><span>✦</span></div>
      <p className="font-jakarta text-sm leading-relaxed text-porcelain/70 text-center max-w-lg mx-auto mb-10">
        {settings.greeting}
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
        <PersonCard
          name={settings.groom_name}
          fullName={settings.groom_full_name}
          parents={settings.groom_parents}
          instagram={settings.groom_instagram}
          photoUrl={settings.groom_photo_url}
          label="The Groom"
        />
        <span className="font-playfair text-2xl text-gold italic hidden md:block">&</span>
        <PersonCard
          name={settings.bride_name}
          fullName={settings.bride_full_name}
          parents={settings.bride_parents}
          instagram={settings.bride_instagram}
          photoUrl={settings.bride_photo_url}
          label="The Bride"
        />
      </div>
    </SectionReveal>
  );
}
