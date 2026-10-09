"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { InvitationSettings, Wish, EventItem, LoveStoryItem, BankAccount } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";
import { Trash2, Save, Plus, ExternalLink, Upload, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";


function GalleryUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "gallery");
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-password": sessionStorage.getItem("admin_password") || "" },
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.url) onUploaded(data.url);
      else alert(data.error || "Upload gagal");
    } catch (err) {
      alert(String(err));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="aspect-square border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-navy hover:text-navy transition disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <>
            <Upload size={24} />
            <span className="text-xs">Upload</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [settings, setSettings] = useState<InvitationSettings | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [tab, setTab] = useState<"content" | "events" | "story" | "gift" | "gallery" | "wishes">("content");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const getPass = () => sessionStorage.getItem("admin_password") || "";

  useEffect(() => {
    if (!sessionStorage.getItem("admin_password")) {
      router.push("/admin/login");
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [sRes, wRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/wishes"),
      ]);
      if (sRes.ok) setSettings(await sRes.json());
      else setSettings({ ...DEFAULT_SETTINGS, id: "default", updated_at: new Date().toISOString() });
      if (wRes.ok) setWishes(await wRes.json());
    } catch {
      setSettings({ ...DEFAULT_SETTINGS, id: "default", updated_at: new Date().toISOString() });
    }
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": getPass(),
        },
        body: JSON.stringify(settings),
      });
      if (res.status === 401) {
        setMsg("Password salah / session expired");
        router.push("/admin/login");
        return;
      }
      if (res.ok) {
        setMsg("Berhasil disimpan!");
        const data = await res.json();
        setSettings(data);
      } else {
        const err = await res.json();
        setMsg("Gagal: " + (err.error || "unknown"));
      }
    } catch (e) {
      setMsg("Error: " + String(e));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const deleteWish = async (id: string) => {
    if (!confirm("Hapus ucapan ini?")) return;
    try {
      const res = await fetch(`/api/wishes?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": getPass() },
      });
      if (res.ok) setWishes((prev) => prev.filter((w) => w.id !== id));
      else alert("Gagal menghapus");
    } catch {
      alert("Error");
    }
  };

  const update = <K extends keyof InvitationSettings>(key: K, value: InvitationSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
        Loading...
      </div>
    );
  }

  const tabs = [
    { id: "content" as const, label: "Mempelai & Umum" },
    { id: "events" as const, label: "Acara" },
    { id: "story" as const, label: "Love Story" },
    { id: "gift" as const, label: "Wedding Gift" },
    { id: "gallery" as const, label: "Gallery" },
    { id: "wishes" as const, label: `Ucapan (${wishes.length})` },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-navy text-cream px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-semibold text-lg">Admin Undangan</h1>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="text-sm flex items-center gap-1 hover:underline"
          >
            <ExternalLink size={14} /> Lihat Undangan
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="bg-cream text-navy px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 hover:bg-white disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </header>

      {msg && (
        <div className="bg-green-100 text-green-800 text-center text-sm py-2">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="flex max-w-4xl mx-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                tab === t.id
                  ? "border-navy text-navy font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20">
        {/* ===== CONTENT TAB ===== */}
        {tab === "content" && (
          <div className="admin-card space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Mempelai</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Nama Panggilan Pria</label>
                <input className="admin-input" value={settings.groom_name} onChange={(e) => update("groom_name", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Nama Lengkap Pria</label>
                <input className="admin-input" value={settings.groom_full_name} onChange={(e) => update("groom_full_name", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Orang Tua Pria</label>
                <input className="admin-input" value={settings.groom_parents} onChange={(e) => update("groom_parents", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Instagram Pria</label>
                <input className="admin-input" value={settings.groom_instagram || ""} onChange={(e) => update("groom_instagram", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Nama Panggilan Wanita</label>
                <input className="admin-input" value={settings.bride_name} onChange={(e) => update("bride_name", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Nama Lengkap Wanita</label>
                <input className="admin-input" value={settings.bride_full_name} onChange={(e) => update("bride_full_name", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Orang Tua Wanita</label>
                <input className="admin-input" value={settings.bride_parents} onChange={(e) => update("bride_parents", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Instagram Wanita</label>
                <input className="admin-input" value={settings.bride_instagram || ""} onChange={(e) => update("bride_instagram", e.target.value)} />
              </div>
            </div>

            <hr className="my-4" />
            <h2 className="text-lg font-semibold text-gray-800">Umum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Tanggal Pernikahan</label>
                <input type="date" className="admin-input" value={settings.wedding_date?.slice(0, 10) || ""} onChange={(e) => update("wedding_date", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Hashtag</label>
                <input className="admin-input" value={settings.hashtag || ""} onChange={(e) => update("hashtag", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Judul Cover</label>
                <input className="admin-input" value={settings.cover_title || ""} onChange={(e) => update("cover_title", e.target.value)} />
              </div>
              <ImageUpload
                label="Logo Undangan"
                value={settings.logo_url}
                onChange={(url) => update("logo_url", url)}
                folder="logo"
              />
              <ImageUpload
                label="Foto Cover (latar depan undangan)"
                value={settings.cover_photo_url}
                onChange={(url) => update("cover_photo_url", url)}
                folder="cover"
              />
              <div className="md:col-span-2">
                <label className="admin-label">URL Video Background (setelah buka undangan)</label>
                <input className="admin-input" value={settings.video_url || ""} onChange={(e) => update("video_url", e.target.value)} placeholder="https://...video.mp4 (host di Supabase Storage / Cloudinary)" />
                <p className="text-xs text-gray-400 mt-1">Upload video ke Storage, lalu tempel public URL. Disarankan mp4 pendek &lt; 10MB, muted loop.</p>
              </div>
              <div>
                <label className="admin-label">URL Musik Background (mp3)</label>
                <input className="admin-input" value={settings.music_url || ""} onChange={(e) => update("music_url", e.target.value)} placeholder="https://...lagu.mp3" />
              </div>
              <ImageUpload
                label="Foto Pria"
                value={settings.groom_photo_url}
                onChange={(url) => update("groom_photo_url", url)}
                folder="groom"
              />
              <ImageUpload
                label="Foto Wanita"
                value={settings.bride_photo_url}
                onChange={(url) => update("bride_photo_url", url)}
                folder="bride"
              />
            </div>
            <div>
              <label className="admin-label">Sapaan / Greeting</label>
              <textarea className="admin-input" rows={3} value={settings.greeting || ""} onChange={(e) => update("greeting", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Kutipan / Quote</label>
              <textarea className="admin-input" rows={3} value={settings.opening_quote || ""} onChange={(e) => update("opening_quote", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Sumber Kutipan</label>
              <input className="admin-input" value={settings.opening_quote_source || ""} onChange={(e) => update("opening_quote_source", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Teks Penutup</label>
              <textarea className="admin-input" rows={2} value={settings.closing_text || ""} onChange={(e) => update("closing_text", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Dress Code Title</label>
              <input className="admin-input" value={settings.dress_code_title || ""} onChange={(e) => update("dress_code_title", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Dress Code Warna (pisah koma)</label>
              <input
                className="admin-input"
                value={(settings.dress_code_colors || []).join(", ")}
                onChange={(e) =>
                  update(
                    "dress_code_colors",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>
            <div>
              <label className="admin-label">Catatan Dress Code</label>
              <textarea className="admin-input" rows={2} value={settings.dress_code_note || ""} onChange={(e) => update("dress_code_note", e.target.value)} />
            </div>
          </div>
        )}

        {/* ===== EVENTS TAB ===== */}
        {tab === "events" && (
          <div className="space-y-4">
            {(settings.events || []).map((ev, i) => (
              <div key={ev.id || i} className="admin-card">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">Acara #{i + 1}</h3>
                  <button
                    onClick={() => {
                      const next = [...settings.events];
                      next.splice(i, 1);
                      update("events", next);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(["title", "day", "date", "time", "venue", "address", "map_url"] as const).map((field) => (
                    <div key={field} className={field === "address" || field === "map_url" ? "md:col-span-2" : ""}>
                      <label className="admin-label capitalize">{field.replace("_", " ")}</label>
                      <input
                        className="admin-input"
                        value={ev[field] || ""}
                        onChange={(e) => {
                          const next = [...settings.events];
                          next[i] = { ...next[i], [field]: e.target.value };
                          update("events", next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newEv: EventItem = {
                  id: crypto.randomUUID(),
                  title: "Acara Baru",
                  day: "",
                  date: "",
                  time: "",
                  venue: "",
                  address: "",
                  map_url: "",
                };
                update("events", [...(settings.events || []), newEv]);
              }}
              className="flex items-center gap-2 text-navy text-sm font-medium hover:underline"
            >
              <Plus size={16} /> Tambah Acara
            </button>
          </div>
        )}

        {/* ===== LOVE STORY ===== */}
        {tab === "story" && (
          <div className="space-y-4">
            {(settings.love_story || []).map((item, i) => (
              <div key={item.id || i} className="admin-card">
                <div className="flex justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Cerita #{i + 1}</h3>
                  <button
                    onClick={() => {
                      const next = [...settings.love_story];
                      next.splice(i, 1);
                      update("love_story", next);
                    }}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="admin-label">Judul</label>
                    <input className="admin-input" value={item.title} onChange={(e) => {
                      const next = [...settings.love_story];
                      next[i] = { ...next[i], title: e.target.value };
                      update("love_story", next);
                    }} />
                  </div>
                  <div>
                    <label className="admin-label">Tanggal</label>
                    <input className="admin-input" value={item.date} onChange={(e) => {
                      const next = [...settings.love_story];
                      next[i] = { ...next[i], date: e.target.value };
                      update("love_story", next);
                    }} />
                  </div>
                  <div>
                    <label className="admin-label">Deskripsi</label>
                    <textarea className="admin-input" rows={3} value={item.description} onChange={(e) => {
                      const next = [...settings.love_story];
                      next[i] = { ...next[i], description: e.target.value };
                      update("love_story", next);
                    }} />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const item: LoveStoryItem = {
                  id: crypto.randomUUID(),
                  title: "Momen Baru",
                  date: "",
                  description: "",
                };
                update("love_story", [...(settings.love_story || []), item]);
              }}
              className="flex items-center gap-2 text-navy text-sm font-medium"
            >
              <Plus size={16} /> Tambah Cerita
            </button>
          </div>
        )}

        {/* ===== GIFT ===== */}
        {tab === "gift" && (
          <div className="admin-card space-y-4">
            <div>
              <label className="admin-label">Intro Gift</label>
              <textarea className="admin-input" rows={2} value={settings.gift_intro || ""} onChange={(e) => update("gift_intro", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">Alamat Kirim Kado</label>
              <input className="admin-input" value={settings.gift_address || ""} onChange={(e) => update("gift_address", e.target.value)} />
            </div>
            <h3 className="font-semibold text-gray-800 mt-4">Rekening Bank</h3>
            {(settings.bank_accounts || []).map((acc, i) => (
              <div key={i} className="border rounded p-3 space-y-2 relative">
                <button
                  onClick={() => {
                    const next = [...settings.bank_accounts];
                    next.splice(i, 1);
                    update("bank_accounts", next);
                  }}
                  className="absolute top-2 right-2 text-red-500"
                >
                  <Trash2 size={14} />
                </button>
                <input className="admin-input" placeholder="Bank" value={acc.bank} onChange={(e) => {
                  const next = [...settings.bank_accounts];
                  next[i] = { ...next[i], bank: e.target.value };
                  update("bank_accounts", next);
                }} />
                <input className="admin-input" placeholder="No. Rekening" value={acc.number} onChange={(e) => {
                  const next = [...settings.bank_accounts];
                  next[i] = { ...next[i], number: e.target.value };
                  update("bank_accounts", next);
                }} />
                <input className="admin-input" placeholder="Atas Nama" value={acc.name} onChange={(e) => {
                  const next = [...settings.bank_accounts];
                  next[i] = { ...next[i], name: e.target.value };
                  update("bank_accounts", next);
                }} />
              </div>
            ))}
            <button
              onClick={() => {
                const acc: BankAccount = { bank: "", number: "", name: "" };
                update("bank_accounts", [...(settings.bank_accounts || []), acc]);
              }}
              className="flex items-center gap-2 text-navy text-sm font-medium"
            >
              <Plus size={16} /> Tambah Rekening
            </button>
          </div>
        )}

        {/* ===== GALLERY ===== */}
        {tab === "gallery" && (
          <div className="admin-card space-y-4">
            <p className="text-sm text-gray-500">
              Klik tombol Upload untuk menambah foto ke galeri (maks 5MB per foto).
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(settings.gallery || []).map((url, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      const next = [...settings.gallery];
                      next.splice(i, 1);
                      update("gallery", next);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded p-0.5"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <GalleryUploadButton
                onUploaded={(url) => update("gallery", [...(settings.gallery || []), url])}
              />
            </div>
          </div>
        )}

        {/* ===== WISHES ===== */}
        {tab === "wishes" && (
          <div className="space-y-3">
            {wishes.length === 0 && (
              <p className="text-center text-gray-500 py-10">Belum ada ucapan</p>
            )}
            {wishes.map((w) => (
              <div key={w.id} className="admin-card flex justify-between items-start gap-4">
                <div>
                  <p className="font-semibold text-gray-800">{w.guest_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{w.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {w.attendance} · {new Date(w.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => deleteWish(w.id)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
