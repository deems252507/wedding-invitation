"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Rsvp } from "@/lib/types";
import { deleteRsvp, getRsvps } from "@/lib/supabase/data";

/**
 * Panel khusus Konfirmasi Kehadiran (terpisah dari Ucapan & Doa).
 * - Total tamu yang akan datang (jumlah orang, bukan hanya jumlah konfirmasi)
 * - Daftar yang hadir & yang berhalangan
 * - Cetak / simpan PDF
 */
export default function RsvpReport() {
  const [rows, setRows] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tableMissing, setTableMissing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getRsvps();
      setRows(res.rows);
      setTableMissing(res.tableMissing);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data kehadiran");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const { hadir, tidak, totalTamu } = useMemo(() => {
    const hadirList = rows.filter((r) => r.attendance !== "tidak");
    const tidakList = rows.filter((r) => r.attendance === "tidak");
    return {
      hadir: hadirList,
      tidak: tidakList,
      totalTamu: hadirList.reduce((sum, r) => sum + (Number(r.guests) || 1), 0),
    };
  }, [rows]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus konfirmasi ini?")) return;
    const res = await deleteRsvp(id);
    if (res.success) void load();
    else alert(res.error || "Gagal menghapus");
  };

  const handlePrintPdf = () => {
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) {
      alert("Izinkan pop-up untuk mencetak PDF");
      return;
    }
    const rowsHadir = hadir
      .map(
        (w, i) =>
          `<tr><td>${i + 1}</td><td>${escapeHtml(w.guest_name)}</td><td>${w.guests} orang</td><td>${formatDate(w.created_at)}</td></tr>`,
      )
      .join("");
    const rowsTidak = tidak
      .map(
        (w, i) =>
          `<tr><td>${i + 1}</td><td>${escapeHtml(w.guest_name)}</td><td>${formatDate(w.created_at)}</td></tr>`,
      )
      .join("");

    win.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>Laporan Konfirmasi Kehadiran</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
    h1 { font-size: 1.4rem; margin: 0 0 4px; }
    h2 { font-size: 1.1rem; margin: 28px 0 8px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    .meta { color: #555; font-size: 0.9rem; margin-bottom: 20px; }
    .summary { display: flex; gap: 16px; margin: 16px 0 24px; flex-wrap: wrap; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 12px 18px; min-width: 120px; }
    .card strong { display: block; font-size: 1.5rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
    th { background: #f3f3f3; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>Laporan Konfirmasi Kehadiran</h1>
  <p class="meta">Dicetak: ${new Date().toLocaleString("id-ID")}</p>
  <div class="summary">
    <div class="card"><span>Total tamu yang datang</span><strong style="color:#0a7">${totalTamu}</strong></div>
    <div class="card"><span>Konfirmasi hadir</span><strong>${hadir.length}</strong></div>
    <div class="card"><span>Berhalangan</span><strong style="color:#c33">${tidak.length}</strong></div>
  </div>

  <h2>Akan Hadir (${hadir.length} konfirmasi · ${totalTamu} orang)</h2>
  ${
    hadir.length
      ? `<table><thead><tr><th>#</th><th>Nama Tamu</th><th>Jumlah</th><th>Waktu</th></tr></thead><tbody>${rowsHadir}</tbody></table>`
      : "<p>Belum ada yang konfirmasi hadir.</p>"
  }

  <h2>Berhalangan Hadir (${tidak.length})</h2>
  ${
    tidak.length
      ? `<table><thead><tr><th>#</th><th>Nama Tamu</th><th>Waktu</th></tr></thead><tbody>${rowsTidak}</tbody></table>`
      : "<p>Tidak ada konfirmasi berhalangan hadir.</p>"
  }

  <p class="no-print" style="margin-top:24px">
    <button onclick="window.print()">Cetak / Simpan PDF</button>
  </p>
  <script>setTimeout(() => window.print(), 300);</script>
</body>
</html>`);
    win.document.close();
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-black/10 bg-white p-6 text-sm text-black/60">
        Memuat data konfirmasi kehadiran…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
        <button type="button" onClick={() => void load()} className="ml-3 underline">
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tableMissing ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Tabel <code>rsvps</code> belum ada di Supabase. Buka SQL Editor lalu jalankan isi file{" "}
          <code>supabase/ADD-RSVPS.sql</code>, kemudian klik Refresh.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl italic text-ink">Konfirmasi Kehadiran</h2>
          <p className="text-sm text-black/55">Terpisah dari ucapan & doa</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-black/15 px-3 py-2 text-sm hover:bg-black/5"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={handlePrintPdf}
            className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-cream hover:opacity-90"
          >
            Cetak PDF
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="text-xs uppercase tracking-wider text-emerald-700/70">
          Total tamu yang akan datang
        </p>
        <p className="mt-1 text-5xl font-semibold text-emerald-800">{totalTamu}</p>
        <p className="mt-1 text-sm text-emerald-800/70">orang</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-black/10 bg-white p-3 text-center">
          <p className="text-[0.65rem] uppercase tracking-wider text-black/45">Respons</p>
          <p className="mt-1 text-2xl font-semibold">{rows.length}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-3 text-center">
          <p className="text-[0.65rem] uppercase tracking-wider text-black/45">Hadir</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">{hadir.length}</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-3 text-center">
          <p className="text-[0.65rem] uppercase tracking-wider text-black/45">Berhalangan</p>
          <p className="mt-1 text-2xl font-semibold text-red-700">{tidak.length}</p>
        </div>
      </div>

      <RsvpList
        title={`Akan hadir — ${hadir.length} konfirmasi · ${totalTamu} orang`}
        tone="emerald"
        empty="Belum ada yang konfirmasi hadir."
        items={hadir}
        showGuests
        onDelete={handleDelete}
      />
      <RsvpList
        title={`Berhalangan hadir — ${tidak.length}`}
        tone="red"
        empty="Tidak ada konfirmasi berhalangan hadir."
        items={tidak}
        onDelete={handleDelete}
      />
    </div>
  );
}

function RsvpList({
  title,
  tone,
  empty,
  items,
  showGuests,
  onDelete,
}: {
  title: string;
  tone: "emerald" | "red";
  empty: string;
  items: Rsvp[];
  showGuests?: boolean;
  onDelete: (id: string) => void;
}) {
  const head = tone === "emerald" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900";
  return (
    <section className="overflow-hidden rounded-xl border border-black/10 bg-white">
      <div className={`border-b border-black/10 px-4 py-3 ${head}`}>
        <h3 className="font-medium">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="px-4 py-6 text-sm text-black/45">{empty}</p>
      ) : (
        <ul className="max-h-[50vh] divide-y divide-black/5 overflow-y-auto">
          {items.map((w) => (
            <li key={w.id} className="flex items-start justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-medium text-ink">{w.guest_name}</p>
                <p className="mt-0.5 text-xs text-black/40">
                  {showGuests ? `${w.guests} orang · ` : ""}
                  {formatDate(w.created_at)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(w.id)}
                className="shrink-0 text-xs text-red-600 hover:underline"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
