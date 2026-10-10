"use client";

import { useState, useEffect } from "react";
import type { Wish } from "@/lib/types";
import SectionReveal from "./SectionReveal";

export default function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState("hadir");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchWishes = async () => {
    try {
      const res = await fetch("/api/wishes");
      if (res.ok) setWishes(await res.json());
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_name: name, message, attendance }),
      });
      if (res.ok) {
        setSubmitted(true);
        setName("");
        setMessage("");
        fetchWishes();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch {
      alert("Gagal mengirim. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionReveal className="section-band">
      <p className="font-jakarta text-[11px] tracking-[0.25em] uppercase text-gold text-center mb-2">
        Buku Tamu & RSVP
      </p>
      <div className="gold-divider"><span>✦</span></div>
      <p className="font-jakarta text-sm text-center text-porcelain/55 mb-8">
        Sampaikan doa dan ucapan terbaik Anda
      </p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 mb-10">
        <input
          type="text"
          placeholder="Nama Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-midnight-surface border border-gold/15 text-porcelain placeholder:text-porcelain/30 font-jakarta text-sm focus:outline-none focus:border-gold/40"
          required
        />
        <textarea
          placeholder="Tulis ucapan & doa..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl bg-midnight-surface border border-gold/15 text-porcelain placeholder:text-porcelain/30 font-jakarta text-sm focus:outline-none focus:border-gold/40 resize-none"
          required
        />
        <select
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-midnight-surface border border-gold/15 text-porcelain font-jakarta text-sm focus:outline-none focus:border-gold/40"
        >
          <option value="hadir" className="text-black">InsyaAllah Hadir</option>
          <option value="tidak" className="text-black">Maaf, Tidak Bisa Hadir</option>
        </select>
        <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50">
          {loading ? "Mengirim..." : submitted ? "Terkirim ✓" : "Kirim Ucapan"}
        </button>
      </form>

      <div className="max-w-md mx-auto space-y-3 max-h-80 overflow-y-auto">
        {wishes.length === 0 && (
          <p className="text-center font-jakarta text-sm text-porcelain/30">
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        )}
        {wishes.map((w) => (
          <div
            key={w.id}
            className="rounded-2xl border border-gold/10 bg-midnight-surface/60 p-4"
          >
            <div className="flex justify-between items-start">
              <p className="font-jakarta font-semibold text-sm text-porcelain">
                {w.guest_name}
              </p>
              <span className="font-jakarta text-[9px] tracking-wider uppercase text-gold/60">
                {w.attendance}
              </span>
            </div>
            <p className="font-jakarta text-sm text-porcelain/65 mt-1">{w.message}</p>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
