"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Wish } from "@/lib/types";
import { deleteWish, getWishes } from "@/lib/supabase/data";

/**
 * Panel khusus Konfirmasi Kehadiran di admin.
 * - Ringkasan: total, hadir, tidak hadir
 * - Daftar nama jelas
 * - Export / cetak PDF via print dialog browser
 */
export default function RsvpReport() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "hadir" | "tidak" | "lain">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getWishes();
      setWishes(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data RSVP");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const { hadir, tidak, lain, total } = useMemo(() => {
    const isHadir = (w: Wish) => String(w.attendance || "").toLowerCase().includes("hadir") && !String(w.attendance || "").toLowerCase().includes("tidak");
    const isTidak = (w: Wish) => String(w.attendance || "").toLowerCase().includes("tidak");
    const hadirList = wishes.filter(isHadir);
    const tidakList = wishes.filter(isTidak);
    const lainList = wishes.filter((w) => !isHadir(w) && !isTidak(w));
    const byDate = wishes.filter((w) => {
      if (!w.created_at) return !startDate && !endDate;
      const parsed = new Date(w.created_at);
      if (Number.isNaN(parsed.getTime())) return false;
      const day = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
      return (!startDate || day >= startDate) && (!endDate || day <= endDate);
    });
    const byStatus = byDate.filter((w) => statusFilter === "all" || (statusFilter === "hadir" && isHadir(w)) || (statusFilter === "tidak" && isTidak(w)) || (statusFilter === "lain" && !isHadir(w) && !isTidak(w)));
    return {
      hadir: byStatus.filter(isHadir),
      tidak: byStatus.filter(isTidak),
      lain: byStatus.filter((w) => !isHadir(w) && !isTidak(w)),
      total: byStatus.length,
    };
  }, [wishes, statusFilter, startDate, endDate]);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus konfirmasi ini?")) return;
    const res = await deleteWish(id);
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
          `<tr><td>${i + 1}</td><td>${escapeHtml(w.guest_name)}</td><td>${escapeHtml(w.message || "-")}</td><td>${formatDate(w.created_at)}</td></tr>`,
      )
      .join("");
    const rowsTidak = tidak
      .map(
        (w, i) =>
          `<tr><td>${i + 1}</td><td>${escapeHtml(w.guest_name)}</td><td>${escapeHtml(w.message || "-")}</td><td>${formatDate(w.created_at)}</td></tr>`,
      )
      .join("");
    const rowsLain = lain
      .map((w, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(w.guest_name)}</td><td>${escapeHtml(w.attendance || "Status tidak tersedia")}</td><td>${escapeHtml(w.message || "-")}</td><td>${formatDate(w.created_at)}</td></tr>`)
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
    tr, td, th { break-inside: avoid; page-break-inside: avoid; }
    thead { display: table-header-group; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>Laporan Konfirmasi Kehadiran</h1>
  <p class="meta">Periode: ${startDate || "Semua tanggal"}${endDate ? ` s.d. ${endDate}` : ""} · Filter status: ${statusFilter === "all" ? "Semua status" : statusFilter === "hadir" ? "Hadir" : statusFilter === "tidak" ? "Tidak hadir" : "Status lainnya"}<br/>Dicetak: ${new Date().toLocaleString("id-ID")}</p>
  <div class="summary">
    <div class="card"><span>Total</span><strong>${total}</strong></div>
    <div class="card"><span>Hadir</span><strong style="color:#0a7">${hadir.length}</strong></div>
    <div class="card"><span>Tidak Hadir</span><strong style="color:#c33">${tidak.length}</strong></div>
  </div>

  <h2>Daftar Hadir (${hadir.length})</h2>
  ${
    hadir.length
      ? `<table><thead><tr><th>#</th><th>Nama Tamu</th><th>Pesan / Keterangan</th><th>Waktu</th></tr></thead><tbody>${rowsHadir}</tbody></table>`
      : "<p>Belum ada yang konfirmasi hadir.</p>"
  }

  <h2>Daftar Tidak Hadir (${tidak.length})</h2>
  ${
    tidak.length
      ? `<table><thead><tr><th>#</th><th>Nama Tamu</th><th>Pesan / Keterangan</th><th>Waktu</th></tr></thead><tbody>${rowsTidak}</tbody></table>`
      : "<p>Tidak ada konfirmasi tidak hadir.</p>"
  }

  <h2>Status lainnya (${lain.length})</h2>
  ${lain.length ? `<table><thead><tr><th>#</th><th>Nama Tamu</th><th>Status</th><th>Pesan / Keterangan</th><th>Waktu</th></tr></thead><tbody>${rowsLain}</tbody></table>` : "<p>Tidak ada data status lainnya.</p>"}

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">Konfirmasi Kehadiran</h2>
          <p className="text-sm text-black/55">
            Ringkasan & daftar nama tamu yang sudah konfirmasi
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
            Unduh / Cetak PDF
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-3 rounded-xl border border-black/10 bg-white p-4 sm:grid-cols-3">
        <label className="text-sm text-black/65">Status RSVP
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="mt-1 block min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm text-ink">
            <option value="all">Semua status</option>
            <option value="hadir">Hadir</option>
            <option value="tidak">Tidak hadir</option>
            <option value="lain">Status lainnya / tidak dikenali</option>
          </select>
        </label>
        <label className="text-sm text-black/65">Tanggal awal
          <input type="date" value={startDate} max={endDate || undefined} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm text-ink" />
        </label>
        <label className="text-sm text-black/65">Tanggal akhir
          <input type="date" value={endDate} min={startDate || undefined} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm text-ink" />
        </label>
        <div className="sm:col-span-3 flex flex-wrap items-center justify-between gap-2 text-xs text-black/50">
          <span>Filter tanggal memakai waktu pengiriman RSVP yang tersimpan.</span>
          <button type="button" onClick={() => { setStatusFilter("all"); setStartDate(""); setEndDate(""); }} className="rounded-lg border border-black/15 px-3 py-2 text-sm text-ink hover:bg-black/5">Reset filter</button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <p className="text-xs uppercase tracking-wider text-black/45">Total</p>
          <p className="mt-1 text-2xl font-semibold">{total}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs uppercase tracking-wider text-emerald-700/70">Hadir</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-800">{hadir.length}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs uppercase tracking-wider text-red-700/70">Tidak Hadir</p>
          <p className="mt-1 text-2xl font-semibold text-red-800">{tidak.length}</p>
        </div>
      </div>

      <section className="rounded-xl border border-black/10 bg-white overflow-hidden">
        <div className="border-b border-black/10 bg-emerald-50 px-4 py-3">
          <h3 className="font-medium text-emerald-900">
            Hadir — {hadir.length} orang
          </h3>
        </div>
        {hadir.length === 0 ? (
          <p className="px-4 py-6 text-sm text-black/45">Belum ada yang konfirmasi hadir.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {hadir.map((w) => (
              <li key={w.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-ink">{w.guest_name}</p>
                  {w.message ? (
                    <p className="mt-0.5 text-sm text-black/55">{w.message}</p>
                  ) : null}
                  <p className="mt-1 text-[11px] text-black/35">{formatDate(w.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(w.id)}
                  className="shrink-0 text-xs text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-black/10 bg-white overflow-hidden">
        <div className="border-b border-black/10 bg-red-50 px-4 py-3">
          <h3 className="font-medium text-red-900">
            Tidak Hadir — {tidak.length} orang
          </h3>
        </div>
        {tidak.length === 0 ? (
          <p className="px-4 py-6 text-sm text-black/45">Tidak ada konfirmasi tidak hadir.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {tidak.map((w) => (
              <li key={w.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-ink">{w.guest_name}</p>
                  {w.message ? (
                    <p className="mt-0.5 text-sm text-black/55">{w.message}</p>
                  ) : null}
                  <p className="mt-1 text-[11px] text-black/35">{formatDate(w.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(w.id)}
                  className="shrink-0 text-xs text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lain.length > 0 && (
        <section className="rounded-xl border border-black/10 bg-white overflow-hidden">
          <div className="border-b border-black/10 bg-amber-50 px-4 py-3">
            <h3 className="font-medium text-amber-900">
              Lainnya / lama — {lain.length}
            </h3>
          </div>
          <ul className="divide-y divide-black/5">
            {lain.map((w) => (
              <li key={w.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-ink">{w.guest_name}</p>
                  <p className="text-xs text-black/45">Status: {w.attendance || "-"}</p>
                  {w.message ? (
                    <p className="mt-0.5 text-sm text-black/55">{w.message}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => void handleDelete(w.id)}
                  className="shrink-0 text-xs text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
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
