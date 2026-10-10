import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  ADMIN_PASSWORD,
  EMPTY_WEDDING_DATA,
  fileToDataUrl,
  isAdminAuthenticated,
  loadWeddingData,
  saveWeddingData,
  setAdminAuthenticated,
  type BankAccount,
  type EventItem,
  type GalleryItem,
  type MomentItem,
  type StoryItem,
  type WeddingData,
} from "@/lib/wedding-data";
import {
  getWeddingDataFromSupabase,
  normalizeDate,
  updateSettingsFromWeddingData,
  uploadWeddingPhoto,
} from "@/lib/supabase/data";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import RsvpReport from "@/components/admin/RsvpReport";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — Undangan Pernikahan" }],
  }),
  component: AdminPage,
});

function Field({
  label,
  value,
  onChange,
  multiline,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="font-sans text-[0.65rem] tracking-wide text-ink/60">{label}</span>
      {multiline ? (
        <textarea
          className="field min-h-[80px] w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          className="field w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function PhotoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      if (isSupabaseConfigured()) {
        const res = await uploadWeddingPhoto(file, "photos");
        if (res.url) {
          onChange(res.url);
          return;
        }
        // fallback local if storage fails
        console.warn(res.error);
      }
      if (file.size > 1_500_000) {
        alert("Upload ke Supabase gagal / belum setup. Foto max 1.5MB untuk simpan lokal.");
        return;
      }
      const url = await fileToDataUrl(file);
      onChange(url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <span className="font-sans text-[0.65rem] tracking-wide text-ink/60">{label}</span>
      <div className="flex items-start gap-3">
        {value ? (
          <img src={value} alt="" className="h-20 w-16 rounded-lg object-cover border border-ink/10" />
        ) : (
          <div className="flex h-20 w-16 items-center justify-center rounded-lg border border-dashed border-ink/20 text-[0.6rem] text-ink/40">
            kosong
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="url"
            className="field w-full text-xs"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL foto (https://...)"
          />
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            className="block w-full text-xs text-ink/70"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          {uploading ? (
            <p className="text-[0.6rem] text-ink/50">Mengupload ke Supabase Storage…</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const isVideoUrl = (u: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u);

/** Unggah foto ATAU video (video wajib lewat Supabase Storage; maks ~50 MB di paket gratis). */
function MediaField({
  value,
  type,
  onChange,
}: {
  value: string;
  type: "image" | "video";
  onChange: (url: string, type: "image" | "video") => void;
}) {
  const [uploading, setUploading] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const kind: "image" | "video" = file.type.startsWith("video/") ? "video" : "image";
    setUploading(true);
    try {
      if (isSupabaseConfigured()) {
        const res = await uploadWeddingPhoto(file, "moments");
        if (res.url) {
          onChange(res.url, kind);
          return;
        }
        alert(`Upload gagal: ${res.error || "periksa bucket wedding-photos (Public) di Supabase."}`);
        return;
      }
      if (kind === "video") {
        alert("Video harus diunggah lewat Supabase Storage. Isi .env Supabase dulu.");
        return;
      }
      if (file.size > 1_500_000) {
        alert("Supabase belum disetel. Foto maksimal 1.5MB untuk simpan lokal.");
        return;
      }
      onChange(await fileToDataUrl(file), "image");
    } finally {
      setUploading(false);
    }
  };

  const video = type === "video" || isVideoUrl(value);

  return (
    <div className="space-y-2">
      <span className="font-sans text-[0.65rem] tracking-wide text-ink/60">Foto atau video</span>
      <div className="flex items-start gap-3">
        {value ? (
          video ? (
            <video src={value} muted playsInline preload="metadata" className="h-24 w-16 rounded-lg border border-ink/10 object-cover" />
          ) : (
            <img src={value} alt="" className="h-24 w-16 rounded-lg border border-ink/10 object-cover" />
          )
        ) : (
          <div className="flex h-24 w-16 items-center justify-center rounded-lg border border-dashed border-ink/20 text-[0.6rem] text-ink/40">
            kosong
          </div>
        )}
        <div className="flex-1 space-y-2">
          <input
            type="url"
            className="field w-full text-xs"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) =>
              onChange(e.target.value, isVideoUrl(e.target.value) ? "video" : "image")
            }
            placeholder="URL foto / video (https://...)"
          />
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            disabled={uploading}
            className="block w-full text-xs text-ink/70"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          {uploading ? <p className="text-[0.6rem] text-ink/50">Mengupload… (video bisa agak lama)</p> : null}
        </div>
      </div>
    </div>
  );
}

/** Pilih banyak foto sekaligus → semua langsung masuk galeri. */
function BulkUpload({ onDone }: { onDone: (urls: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");

  const run = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    const urls: string[] = [];
    let failed = 0;
    try {
      const list = Array.from(files);
      for (let i = 0; i < list.length; i++) {
        setProgress(`Mengunggah ${i + 1} dari ${list.length}…`);
        const f = list[i];
        if (isSupabaseConfigured()) {
          const res = await uploadWeddingPhoto(f, "gallery");
          if (res.url) urls.push(res.url);
          else failed++;
        } else if (f.size <= 1_500_000) {
          urls.push(await fileToDataUrl(f));
        } else {
          failed++;
        }
      }
      if (urls.length) onDone(urls);
      if (failed) alert(`${failed} foto gagal diunggah (cek Supabase Storage / ukuran file).`);
    } finally {
      setBusy(false);
      setProgress("");
    }
  };

  return (
    <label
      className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-ink/25 px-4 py-5 text-center transition hover:border-ink/50 ${
        busy ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <span className="font-sans text-xs font-medium text-ink/75">
        {busy ? progress : "Pilih banyak foto sekaligus"}
      </span>
      <span className="font-sans text-[0.6rem] text-ink/45">
        Semua foto otomatis dipotong seragam (3:4) di undangan
      </span>
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void run(e.target.files);
          e.target.value = "";
        }}
      />
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-ink/10 bg-cream p-5 shadow-sm">
      <h2 className="mb-4 font-display text-xl italic text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function AdminWishesPanel() {
  const [rows, setRows] = useState<
    { id: string; guest_name: string; message: string; attendance: string; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { getPrayerWishes } = await import("@/lib/supabase/data");
      const data = await getPrayerWishes();
      setRows(
        data.map((w) => ({
          id: w.id,
          guest_name: w.guest_name,
          message: w.message,
          attendance: w.attendance || "hadir",
          created_at: w.created_at,
        })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onDelete = async (id: string) => {
    if (!confirm("Hapus ucapan ini?")) return;
    setBusy(id);
    try {
      const { deleteWish } = await import("@/lib/supabase/data");
      const res = await deleteWish(id);
      if (res.success) setRows((r) => r.filter((x) => x.id !== id));
      else alert(res.error || "Gagal hapus");
    } finally {
      setBusy(null);
    }
  };

  return (
    <SectionCard title="Ucapan & Doa">
      <p className="font-sans text-xs text-ink/55">
        Hanya ucapan & doa dari tamu. Konfirmasi kehadiran ada di tab "Kehadiran".
      </p>
      <button
        type="button"
        className="rounded-full border border-ink/20 px-3 py-1.5 font-sans text-[0.65rem]"
        onClick={() => void load()}
      >
        Refresh
      </button>
      {loading ? (
        <p className="font-sans text-sm text-ink/40">Memuat…</p>
      ) : rows.length === 0 ? (
        <p className="font-sans text-sm text-ink/40">Belum ada data.</p>
      ) : (
        <div className="max-h-[60vh] space-y-3 overflow-y-auto">
          {rows.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-ink/10 bg-sand/40 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base text-ink">{r.guest_name}</p>
                  <p className="mt-0.5 font-sans text-[0.6rem] text-ink/45">
                    {new Date(r.created_at).toLocaleString("id-ID")}
                  </p>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-ink/70">
                    {r.message}
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-xs text-red-600 disabled:opacity-50"
                  disabled={busy === r.id}
                  onClick={() => void onDelete(r.id)}
                >
                  {busy === r.id ? "…" : "Hapus"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<WeddingData>(EMPTY_WEDDING_DATA);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [tab, setTab] = useState<
    "umum" | "acara" | "cerita" | "momen" | "galeri" | "rekening" | "media" | "kehadiran" | "ucapan"
  >("umum");
  const supabaseOn = isSupabaseConfigured();

  useEffect(() => {
    setAuthed(isAdminAuthenticated());
    (async () => {
      if (isSupabaseConfigured()) {
        const remote = await getWeddingDataFromSupabase();
        if (remote) {
          setData(remote);
          return;
        }
      }
      setData(loadWeddingData());
    })();
  }, []);

  const patch = useCallback(<K extends keyof WeddingData>(key: K, value: WeddingData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      setAuthed(true);
    } else {
      alert("Password salah");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus("");
    try {
      // always mirror to localStorage as backup
      saveWeddingData(data);

      if (supabaseOn) {
        const res = await updateSettingsFromWeddingData(data);
        if (!res.success) {
          setStatus(`Gagal Supabase: ${res.error}. Tersimpan lokal saja.`);
          setSaved(false);
          return;
        }
        setStatus("Tersimpan ke Supabase ✓");
      } else {
        setStatus("Tersimpan lokal (isi .env Supabase agar data cloud)");
      }
      setSaved(true);
      window.dispatchEvent(new CustomEvent("wedding-data-updated"));
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm("Reset semua ke default?")) return;
    setData(EMPTY_WEDDING_DATA);
    saveWeddingData(EMPTY_WEDDING_DATA);
    void updateSettingsFromWeddingData(EMPTY_WEDDING_DATA);
    setSaved(true);
  };

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-sand px-6">
        <div className="w-full rounded-2xl border border-ink/10 bg-cream p-8 shadow-lg">
          <h1 className="text-center font-display text-2xl italic text-ink">Admin Undangan</h1>
          <p className="mt-2 text-center font-sans text-xs text-ink/50">
            Masuk untuk mengubah teks, foto, alamat, musik, dll.
          </p>
          <div
            className={`mt-4 rounded-lg px-3 py-2 text-center font-sans text-[0.65rem] ${
              supabaseOn ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
            }`}
          >
            {supabaseOn
              ? "Supabase terhubung — data disimpan ke cloud"
              : "Supabase belum diisi (.env) — simpan lokal saja"}
          </div>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              className="field w-full"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-ink w-full">
              MASUK
            </button>
          </form>
          <p className="mt-4 text-center font-sans text-[0.6rem] text-ink/40">
            Default password: <code>admin123</code> (ubah di src/lib/wedding-data.ts)
          </p>
          <Link to="/" className="mt-4 block text-center font-sans text-xs text-ink/50 hover:text-ink">
            ← Kembali ke undangan
          </Link>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: "umum" as const, label: "Umum" },
    { id: "acara" as const, label: "Acara" },
    { id: "cerita" as const, label: "Cerita" },
    { id: "momen" as const, label: "Momen" },
    { id: "galeri" as const, label: "Galeri" },
    { id: "rekening" as const, label: "Rekening" },
    { id: "media" as const, label: "Media" },
    { id: "kehadiran" as const, label: "Kehadiran" },
    { id: "ucapan" as const, label: "Ucapan & Doa" },
  ];

  return (
    <main className="min-h-dvh bg-sand pb-28">
      <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div>
            <h1 className="font-display text-lg italic text-ink">Admin Undangan</h1>
            <p className="font-sans text-[0.55rem] text-ink/45">
              {supabaseOn ? "Mode: Supabase cloud" : "Mode: localStorage saja"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-full border border-ink/20 px-3 py-1 font-sans text-[0.65rem] text-ink/70 hover:bg-ink hover:text-cream"
            >
              Lihat undangan
            </Link>
            <button
              type="button"
              className="rounded-full border border-ink/20 px-3 py-1 font-sans text-[0.65rem] text-ink/70"
              onClick={() => {
                setAdminAuthenticated(false);
                setAuthed(false);
              }}
            >
              Keluar
            </button>
          </div>
        </div>
        <div className="mx-auto mt-3 flex max-w-2xl gap-1 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 font-sans text-[0.65rem] tracking-wide transition ${
                tab === t.id ? "bg-ink text-cream" : "bg-ink/5 text-ink/60 hover:bg-ink/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        {tab === "umum" && (
          <>
            <SectionCard title="Nama pasangan">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nama panggilan mempelai wanita" value={data.brideName} onChange={(v) => patch("brideName", v)} />
                <Field label="Nama panggilan mempelai pria" value={data.groomName} onChange={(v) => patch("groomName", v)} />
                <Field label="Nama lengkap wanita" value={data.brideFullName} onChange={(v) => patch("brideFullName", v)} />
                <Field label="Nama lengkap pria" value={data.groomFullName} onChange={(v) => patch("groomFullName", v)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Instagram wanita (tanpa @, opsional)" value={data.brideInstagram} onChange={(v) => patch("brideInstagram", v)} placeholder="namaakun" />
                <Field label="Instagram pria (tanpa @, opsional)" value={data.groomInstagram} onChange={(v) => patch("groomInstagram", v)} placeholder="namaakun" />
              </div>
              <Field label="Orang tua wanita" value={data.brideParents} onChange={(v) => patch("brideParents", v)} multiline />
              <Field label="Orang tua pria" value={data.groomParents} onChange={(v) => patch("groomParents", v)} multiline />
            </SectionCard>
            <SectionCard title="Tanggal & teks">
              <Field label="Label tanggal (tampil di cover)" value={data.weddingDateLabel} onChange={(v) => patch("weddingDateLabel", v)} placeholder="Sabtu, 30 Januari 2027" />
              <Field
                label="Tanggal & jam acara (untuk hitung mundur)"
                type="datetime-local"
                value={(() => {
                  const day = normalizeDate(data.weddingDateISO);
                  if (!day) return "";
                  const t = data.weddingDateISO.match(/T(\d{2}:\d{2})/);
                  return `${day}T${t ? t[1] : "10:00"}`;
                })()}
                onChange={(v) => patch("weddingDateISO", v ? `${v}:00+07:00` : "")}
              />
              <Field label="Judul cover" value={data.coverTitle} onChange={(v) => patch("coverTitle", v)} />
              <Field label="Intro pasangan" value={data.coupleIntro} onChange={(v) => patch("coupleIntro", v)} multiline />
              <Field label="Kutipan" value={data.quote} onChange={(v) => patch("quote", v)} multiline />
              <Field label="Sumber kutipan" value={data.quoteSource} onChange={(v) => patch("quoteSource", v)} />
              <Field label="Teks ucapan terima kasih (bagian penutup)" value={data.thankYouText} onChange={(v) => patch("thankYouText", v)} multiline />
              <Field label="Intro gift" value={data.giftIntro} onChange={(v) => patch("giftIntro", v)} multiline />
            </SectionCard>
            <SectionCard title="Foto cover (bisa banyak — slide otomatis)">
              <p className="font-sans text-[0.65rem] text-ink/50">
                Tambah beberapa foto. Cover akan berganti otomatis setiap ~4 detik.
              </p>
              {(data.coverPhotos?.length ? data.coverPhotos : data.coverPhoto ? [data.coverPhoto] : [""]).map((url, i) => (
                <div key={`cover-${i}`} className="space-y-1 rounded-xl border border-ink/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[0.65rem] text-ink/55">Cover {i + 1}</span>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() => {
                        const list = [...(data.coverPhotos?.length ? data.coverPhotos : data.coverPhoto ? [data.coverPhoto] : [])];
                        list.splice(i, 1);
                        patch("coverPhotos", list);
                        patch("coverPhoto", list[0] || "");
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                  <PhotoField
                    label=""
                    value={url}
                    onChange={(v) => {
                      const list = [...(data.coverPhotos?.length ? data.coverPhotos : data.coverPhoto ? [data.coverPhoto] : [""])];
                      list[i] = v;
                      patch("coverPhotos", list);
                      patch("coverPhoto", list[0] || "");
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn-ink w-full"
                onClick={() => {
                  const list = [...(data.coverPhotos?.length ? data.coverPhotos : data.coverPhoto ? [data.coverPhoto] : [])];
                  patch("coverPhotos", [...list, ""]);
                }}
              >
                + Tambah foto cover
              </button>
            </SectionCard>

            <SectionCard title="Foto hero (bisa banyak — slide otomatis setelah buka undangan)">
              <p className="font-sans text-[0.65rem] text-ink/50">
                Foto layar penuh setelah undangan dibuka. Bisa banyak, berganti otomatis.
              </p>
              {(data.heroPhotos?.length ? data.heroPhotos : data.heroPhoto ? [data.heroPhoto] : [""]).map((url, i) => (
                <div key={`hero-${i}`} className="space-y-1 rounded-xl border border-ink/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[0.65rem] text-ink/55">Hero {i + 1}</span>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() => {
                        const list = [...(data.heroPhotos?.length ? data.heroPhotos : data.heroPhoto ? [data.heroPhoto] : [])];
                        list.splice(i, 1);
                        patch("heroPhotos", list);
                        patch("heroPhoto", list[0] || "");
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                  <PhotoField
                    label=""
                    value={url}
                    onChange={(v) => {
                      const list = [...(data.heroPhotos?.length ? data.heroPhotos : data.heroPhoto ? [data.heroPhoto] : [""])];
                      list[i] = v;
                      patch("heroPhotos", list);
                      patch("heroPhoto", list[0] || "");
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                className="btn-ink w-full"
                onClick={() => {
                  const list = [...(data.heroPhotos?.length ? data.heroPhotos : data.heroPhoto ? [data.heroPhoto] : [])];
                  patch("heroPhotos", [...list, ""]);
                }}
              >
                + Tambah foto hero
              </button>
            </SectionCard>

            <SectionCard title="Foto zoom (membesar saat digulir)">
              <p className="font-sans text-[0.65rem] text-ink/50">
                Foto khusus untuk bagian yang membesar menjadi layar penuh. Pilih foto vertikal dengan
                wajah di bagian atas/tengah supaya tidak terpotong. Jika kosong, dipakai foto hero ke-2.
              </p>
              <PhotoField label="Foto zoom" value={data.expandPhoto} onChange={(v) => patch("expandPhoto", v)} />
            </SectionCard>

            <SectionCard title="Foto mempelai">
              <PhotoField label="Foto mempelai wanita" value={data.bridePhoto} onChange={(v) => patch("bridePhoto", v)} />
              <PhotoField label="Foto mempelai pria" value={data.groomPhoto} onChange={(v) => patch("groomPhoto", v)} />
            </SectionCard>
          </>
        )}

        {tab === "acara" && (
          <SectionCard title="Acara (Event)">
            {data.events.map((ev, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-ink/10 bg-sand/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-sans text-xs font-medium text-ink/70">Acara #{i + 1}</p>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => patch("events", data.events.filter((_, j) => j !== i))}
                  >
                    Hapus
                  </button>
                </div>
                {(
                  [
                    ["name", "Nama acara"],
                    ["desc", "Deskripsi"],
                    ["date", "Tanggal"],
                    ["time", "Waktu"],
                    ["place", "Tempat"],
                    ["address", "Alamat"],
                    ["map", "Link Google Maps"],
                  ] as [keyof EventItem, string][]
                ).map(([k, lab]) => (
                  <Field
                    key={k}
                    label={lab}
                    value={ev[k]}
                    multiline={k === "desc"}
                    onChange={(v) => {
                      const next = [...data.events];
                      next[i] = { ...next[i], [k]: v };
                      patch("events", next);
                    }}
                  />
                ))}
              </div>
            ))}
            <button
              type="button"
              className="btn-ink w-full"
              onClick={() =>
                patch("events", [
                  ...data.events,
                  {
                    name: "Acara baru",
                    desc: "",
                    date: "",
                    time: "",
                    place: "",
                    address: "",
                    map: "https://maps.google.com",
                  },
                ])
              }
            >
              + Tambah acara
            </button>
          </SectionCard>
        )}

        {tab === "cerita" && (
          <SectionCard title="Kisah cinta">
            {data.story.map((s, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-ink/10 bg-sand/40 p-4">
                <div className="flex justify-between">
                  <p className="font-sans text-xs text-ink/70">Cerita #{i + 1}</p>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => patch("story", data.story.filter((_, j) => j !== i))}
                  >
                    Hapus
                  </button>
                </div>
                <Field
                  label="Judul"
                  value={s.title}
                  onChange={(v) => {
                    const next = [...data.story];
                    next[i] = { ...next[i], title: v };
                    patch("story", next);
                  }}
                />
                <Field
                  label="Teks"
                  value={s.text}
                  multiline
                  onChange={(v) => {
                    const next = [...data.story];
                    next[i] = { ...next[i], text: v };
                    patch("story", next);
                  }}
                />
                <PhotoField
                  label="Foto"
                  value={s.photo}
                  onChange={(v) => {
                    const next = [...data.story];
                    next[i] = { ...next[i], photo: v };
                    patch("story", next);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn-ink w-full"
              onClick={() =>
                patch("story", [...data.story, { title: "Judul baru", photo: "", text: "" } as StoryItem])
              }
            >
              + Tambah cerita
            </button>
          </SectionCard>
        )}

        {tab === "momen" && (
          <SectionCard title="Momen (foto / video saat scroll)">
            <p className="font-sans text-xs text-ink/55">
              Layar penuh yang berganti otomatis saat tamu menggulir. Tiap momen boleh foto atau video
              (video diputar tanpa suara). Disarankan 3–6 momen, video ≤ 20 MB, rasio vertikal 9:16 atau 3:4.
              Jika daftar kosong, bagian ini tidak tampil.
            </p>
            {data.moments.map((m, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-ink/10 bg-sand/40 p-4">
                <div className="flex justify-between">
                  <p className="font-sans text-xs text-ink/70">Momen #{i + 1}</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={i === 0}
                      className="text-xs text-ink/60 disabled:opacity-30"
                      onClick={() => {
                        const next = [...data.moments];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        patch("moments", next);
                      }}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={i === data.moments.length - 1}
                      className="text-xs text-ink/60 disabled:opacity-30"
                      onClick={() => {
                        const next = [...data.moments];
                        [next[i + 1], next[i]] = [next[i], next[i + 1]];
                        patch("moments", next);
                      }}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() => patch("moments", data.moments.filter((_, j) => j !== i))}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <MediaField
                  value={m.url}
                  type={m.type}
                  onChange={(url, type) => {
                    const next = [...data.moments];
                    next[i] = { ...next[i], url, type };
                    patch("moments", next);
                  }}
                />
                <Field
                  label="Judul singkat (opsional)"
                  value={m.title}
                  placeholder="Pertama Bertemu"
                  onChange={(v) => {
                    const next = [...data.moments];
                    next[i] = { ...next[i], title: v };
                    patch("moments", next);
                  }}
                />
                <Field
                  label="Keterangan (opsional)"
                  value={m.caption}
                  multiline
                  onChange={(v) => {
                    const next = [...data.moments];
                    next[i] = { ...next[i], caption: v };
                    patch("moments", next);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn-ink w-full"
              onClick={() =>
                patch("moments", [
                  ...data.moments,
                  { type: "image", url: "", title: "", caption: "" } as MomentItem,
                ])
              }
            >
              + Tambah momen
            </button>
          </SectionCard>
        )}

        {tab === "galeri" && (
          <SectionCard title="Galeri foto">
            <p className="font-sans text-xs text-ink/50">
              Upload ke Supabase Storage (bucket wedding-photos) atau tempel URL. Di undangan, foto tampil
              dalam kisi 3D yang terbentang saat digulir; ketuk foto untuk memperbesar (bisa dicubit / zoom).
            </p>
            <BulkUpload
              onDone={(urls) =>
                patch("gallery", [
                  ...data.gallery.filter((g) => g.image),
                  ...urls.map((u) => ({ title: "", image: u }) as GalleryItem),
                ])
              }
            />
            {data.gallery.map((g, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-ink/10 bg-sand/40 p-4">
                <div className="flex justify-between">
                  <p className="font-sans text-xs text-ink/70">Foto #{i + 1}</p>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => patch("gallery", data.gallery.filter((_, j) => j !== i))}
                  >
                    Hapus
                  </button>
                </div>
                <Field
                  label="Judul (opsional)"
                  value={g.title}
                  onChange={(v) => {
                    const next = [...data.gallery];
                    next[i] = { ...next[i], title: v };
                    patch("gallery", next);
                  }}
                />
                <PhotoField
                  label="Gambar"
                  value={g.image}
                  onChange={(v) => {
                    const next = [...data.gallery];
                    next[i] = { ...next[i], image: v };
                    patch("gallery", next);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn-ink w-full"
              onClick={() => patch("gallery", [...data.gallery, { title: "", image: "" } as GalleryItem])}
            >
              + Tambah foto
            </button>
          </SectionCard>
        )}

        {tab === "rekening" && (
          <SectionCard title="Rekening / gift">
            <PhotoField
              label="Foto / QR kado (opsional)"
              value={data.giftPhoto || ""}
              onChange={(v) => patch("giftPhoto", v)}
            />
            {data.accounts.map((a, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-ink/10 bg-sand/40 p-4">
                <div className="flex justify-between">
                  <p className="font-sans text-xs text-ink/70">Rekening #{i + 1}</p>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => patch("accounts", data.accounts.filter((_, j) => j !== i))}
                  >
                    Hapus
                  </button>
                </div>
                {(
                  [
                    ["bank", "Bank"],
                    ["number", "Nomor rekening"],
                    ["owner", "Atas nama"],
                  ] as [keyof BankAccount, string][]
                ).map(([k, lab]) => (
                  <Field
                    key={k}
                    label={lab}
                    value={String(a[k] ?? "")}
                    onChange={(v) => {
                      const next = [...data.accounts];
                      next[i] = { ...next[i], [k]: v };
                      patch("accounts", next);
                    }}
                  />
                ))}
                <PhotoField
                  label="Logo bank (opsional)"
                  value={a.logo || ""}
                  onChange={(v) => {
                    const next = [...data.accounts];
                    next[i] = { ...next[i], logo: v };
                    patch("accounts", next);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              className="btn-ink w-full"
              onClick={() =>
                patch("accounts", [...data.accounts, { bank: "", number: "", owner: "", logo: "" }])
              }
            >
              + Tambah rekening
            </button>
          </SectionCard>
        )}

        {tab === "media" && (
          <SectionCard title="Musik & video">
            <Field
              label="URL musik (mp3)"
              value={data.musicUrl}
              onChange={(v) => patch("musicUrl", v)}
              placeholder="https://.../lagu.mp3"
            />
            <Field
              label="URL video (YouTube embed / mp4)"
              value={data.videoUrl}
              onChange={(v) => patch("videoUrl", v)}
              placeholder="https://www.youtube.com/embed/xxxxx"
            />
          </SectionCard>
        )}

        {tab === "kehadiran" && <RsvpReport />}
        {tab === "ucapan" && <AdminWishesPanel />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          {status ? <p className="mb-2 text-center font-sans text-[0.65rem] text-ink/60">{status}</p> : null}
          <div className="flex items-center gap-3">
            <button type="button" className="btn-ink flex-1" onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Menyimpan…" : saved ? "✓ Tersimpan" : "SIMPAN KE SUPABASE"}
            </button>
            <button
              type="button"
              className="rounded-full border border-ink/20 px-4 py-2 font-sans text-[0.65rem] text-ink/60"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
