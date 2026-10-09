"use client";

import { useState } from "react";
import type { InvitationSettings } from "@/lib/types";
import SectionReveal from "./SectionReveal";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Check, X, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  settings: InvitationSettings;
}

export default function GiftSection({ settings }: Props) {
  const [open, setOpen] = useState(false);
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
      <div className="ornament-diamond"><span>✦</span></div>
      <p className="font-cormorant text-[15px] leading-relaxed text-cream/80 max-w-md mx-auto mb-8">
        {settings.gift_intro}
      </p>

      <button onClick={() => setOpen(true)} className="btn-ornamental gap-2">
        <Gift size={16} />
        Klik Disini
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="gift-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-navy border border-cream/20 rounded-lg p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-cream/50 hover:text-cream"
              >
                <X size={20} />
              </button>

              <h3 className="font-cormorant text-lg tracking-wider uppercase text-cream mb-4 text-center">
                Wedding Gift
              </h3>

              <div className="space-y-4">
                {accounts.map((acc, i) => (
                  <div
                    key={i}
                    className="border border-cream/15 rounded p-4 bg-white/[0.03]"
                  >
                    <p className="font-cormorant text-sm text-cream/70">{acc.bank}</p>
                    <p className="font-caudex text-lg text-cream tracking-wider my-1">
                      {acc.number}
                    </p>
                    {acc.name && (
                      <p className="font-poppins text-xs text-cream/50">{acc.name}</p>
                    )}
                    <button
                      onClick={() => handleCopy(acc.number, `bank-${i}`)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose hover:underline"
                    >
                      {copied === `bank-${i}` ? (
                        <><Check size={12} /> Tersalin</>
                      ) : (
                        <><Copy size={12} /> SALIN</>
                      )}
                    </button>
                  </div>
                ))}

                {settings.gift_address && (
                  <div className="border border-cream/15 rounded p-4 bg-white/[0.03]">
                    <p className="font-poppins text-xs text-cream/50 mb-1">Kirim Kado</p>
                    <p className="font-cormorant text-sm text-cream">{settings.gift_address}</p>
                    <button
                      onClick={() => handleCopy(settings.gift_address!, "addr")}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose hover:underline"
                    >
                      {copied === "addr" ? (
                        <><Check size={12} /> Tersalin</>
                      ) : (
                        <><Copy size={12} /> Salin Alamat</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionReveal>
  );
}
