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
      if (res.ok) {
        const data = await res.json();
        setWishes(data);
      }
    } catch {
      /* offline / no db yet */
    }
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
      <h2 className="font-cormorant text-xl tracking-[2px] uppercase text-center text-cream mb-2">
        Ucapan & Doa
      </h2>
      <p className="font-cormorant text-sm text-center text-cream/70 mb-8">
        Sampaikan doa dan ucapan terbaik Anda
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-4 mb-10"
      >
        <input
          type="text"
          placeholder="Nama Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2.5 bg-cream/10 border border-cream/20 rounded text-cream placeholder:text-cream/40 font-cormorant text-base focus:outline-none focus:border-cream/50"
          required
        />
        <textarea
          placeholder="Tulis ucapan & doa..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-2.5 bg-cream/10 border border-cream/20 rounded text-cream placeholder:text-cream/40 font-cormorant text-base focus:outline-none focus:border-cream/50 resize-none"
          required
        />
        <select
          value={attendance}
          onChange={(e) => setAttendance(e.target.value)}
          className="w-full px-4 py-2.5 bg-cream/10 border border-cream/20 rounded text-cream font-cormorant text-base focus:outline-none focus:border-cream/50"
        >
          <option value="hadir" className="text-navy">
            InsyaAllah Hadir
          </option>
          <option value="tidak" className="text-navy">
            Maaf, Tidak Bisa Hadir
          </option>
          <option value="ragu" className="text-navy">
            Masih Ragu
          </option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="btn-ornamental w-full disabled:opacity-50"
        >
          {loading ? "Mengirim..." : submitted ? "Terkirim ✓" : "Kirim Ucapan"}
        </button>
      </form>

      <div className="max-w-md mx-auto space-y-3 max-h-80 overflow-y-auto">
        {wishes.length === 0 && (
          <p className="text-center font-cormorant text-sm text-cream/40">
            Belum ada ucapan. Jadilah yang pertama!
          </p>
        )}
        {wishes.map((w) => (
          <div
            key={w.id}
            className="border border-cream/10 rounded p-3 bg-navy/30"
          >
            <div className="flex justify-between items-start">
              <p className="font-cormorant font-semibold text-cream text-sm">
                {w.guest_name}
              </p>
              <span className="font-poppins text-[9px] tracking-wider uppercase text-cream/40">
                {w.attendance}
              </span>
            </div>
            <p className="font-cormorant text-sm text-cream/80 mt-1">
              {w.message}
            </p>
          </div>
        ))}
      </div>
    </SectionReveal>
  );
}
