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
      <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold mb-2">
        Wedding Gift
      </p>
      <div className="gold-divider"><span>✦</span></div>
      <p className="font-jakarta text-sm leading-relaxed text-porcelain/65 max-w-md mx-auto mb-8">
        {settings.gift_intro}
      </p>

      <button onClick={() => setOpen(true)} className="btn-gold gap-2">
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
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="card-dark max-w-sm w-full max-h-[85vh] overflow-y-auto relative backdrop-blur-md"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-porcelain/40 hover:text-porcelain transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="font-jakarta text-xs tracking-[0.2em] uppercase text-gold mb-5 text-center">
                Wedding Gift
              </h3>

              {/* QR / gift photo */}
              {settings.gift_qr_url && (
                <div className="mb-5 flex justify-center">
                  <div className="rounded-2xl overflow-hidden border border-gold/20 p-2 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.gift_qr_url}
                      alt="QR / Gift"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {accounts.map((acc, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gold/15 bg-midnight-base/50 p-4"
                  >
                    {acc.image_url && (
                      <div className="mb-3 flex justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={acc.image_url}
                          alt={acc.bank}
                          className="h-10 object-contain"
                        />
                      </div>
                    )}
                    <p className="font-jakarta text-xs text-porcelain/50">{acc.bank}</p>
                    <p className="font-playfair text-lg text-porcelain tracking-wide my-1">
                      {acc.number}
                    </p>
                    {acc.name && (
                      <p className="font-jakarta text-xs text-porcelain/45">{acc.name}</p>
                    )}
                    <button
                      onClick={() => handleCopy(acc.number, `bank-${i}`)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold hover:underline transition-opacity"
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
                  <div className="rounded-2xl border border-gold/15 bg-midnight-base/50 p-4">
                    <p className="font-jakarta text-xs text-porcelain/50 mb-1">Kirim Kado</p>
                    <p className="font-jakarta text-sm text-porcelain">{settings.gift_address}</p>
                    <button
                      onClick={() => handleCopy(settings.gift_address!, "addr")}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-gold hover:underline"
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
