"use client";

import { useState } from "react";
import type { InvitationSettings } from "@/lib/types";
import SectionReveal from "./SectionReveal";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

interface Props {
  settings: InvitationSettings;
}

export default function GiftSection({ settings }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const accounts = settings.bank_accounts || [];

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <SectionReveal className="section-band text-center">
      <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-cream mb-4">
        Wedding Gift
      </h2>
      <p className="font-cormorant text-[15px] leading-relaxed text-cream/80 max-w-md mx-auto mb-8">
        {settings.gift_intro}
      </p>

      <div className="max-w-sm mx-auto space-y-4">
        {accounts.map((acc, i) => (
          <div
            key={i}
            className="border border-cream/20 rounded-sm p-4 bg-navy/40"
          >
            <p className="font-cormorant text-sm text-cream/70">{acc.bank}</p>
            <p className="font-caudex text-lg text-cream tracking-wider my-1">
              {acc.number}
            </p>
            {acc.name && (
              <p className="font-poppins text-xs text-cream/60">{acc.name}</p>
            )}
            <button
              onClick={() => handleCopy(acc.number, `bank-${i}`)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose hover:underline"
            >
              {copied === `bank-${i}` ? (
                <>
                  <Check size={12} /> Tersalin
                </>
              ) : (
                <>
                  <Copy size={12} /> SALIN
                </>
              )}
            </button>
          </div>
        ))}

        {settings.gift_address && (
          <div className="border border-cream/20 rounded-sm p-4 bg-navy/40 mt-4">
            <p className="font-poppins text-xs text-cream/60 mb-1">Kirim Kado</p>
            <p className="font-cormorant text-sm text-cream">{settings.gift_address}</p>
            <button
              onClick={() => handleCopy(settings.gift_address!, "addr")}
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose hover:underline"
            >
              {copied === "addr" ? (
                <>
                  <Check size={12} /> Tersalin
                </>
              ) : (
                <>
                  <Copy size={12} /> Salin Alamat
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </SectionReveal>
  );
}
