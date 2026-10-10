import { createClient, isSupabaseConfigured } from "./client";
import type { InvitationSettings, Rsvp, Wish } from "@/lib/types";
import { EMPTY_SETTINGS } from "@/lib/types";
import type {
  WeddingData,
  EventItem,
  StoryItem,
  GalleryItem,
  BankAccount,
  MomentItem,
} from "@/lib/wedding-data";


/** Ubah teks tanggal apa pun (mis. "2026-011-1") menjadi "YYYY-MM-DD" yang valid, atau null. */
export function normalizeDate(raw: string | null | undefined): string | null {
  const m = String(raw || "").match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Map DB row → UI WeddingData */
export function settingsToWeddingData(s: InvitationSettings): WeddingData {
  const events: EventItem[] = (s.events || []).map((e) => ({
    name: e.title || "",
    desc: (e as { desc?: string }).desc || "",
    date: e.date || "",
    time: e.time || "",
    place: e.venue || "",
    address: e.address || "",
    map: e.map_url || "",
  }));

  const story: StoryItem[] = (s.love_story || []).map((item) => ({
    title: item.title || "",
    text: item.description || "",
    photo: (item as { photo?: string }).photo || "",
  }));

  // gallery can be string[] or {title,image}[]
  const rawGal = s.gallery || [];
  const gallery: GalleryItem[] = rawGal.map((g: unknown, i: number) => {
    if (typeof g === "string") return { title: `Foto ${i + 1}`, image: g };
    const obj = g as { title?: string; image?: string; url?: string };
    return { title: obj.title || `Foto ${i + 1}`, image: obj.image || obj.url || "" };
  });

  const moments: MomentItem[] = (s.moments || [])
    .map((m) => {
      const url = m.url || "";
      const isVideo = m.type === "video" || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
      return {
        type: (isVideo ? "video" : "image") as MomentItem["type"],
        url,
        title: m.title || "",
        caption: m.caption || "",
      };
    })
    .filter((m) => m.url);

  const accounts: BankAccount[] = (s.bank_accounts || []).map((a) => ({
    bank: a.bank || "",
    number: a.number || "",
    owner: a.name || "",
    logo: (a as { image_url?: string | null }).image_url || "",
  }));

  const dateISO = s.wedding_date
    ? s.wedding_date.includes("T")
      ? s.wedding_date
      : `${s.wedding_date}T10:00:00+07:00`
    : "";

  return {
    groomName: s.groom_name || "",
    brideName: s.bride_name || "",
    groomFullName: s.groom_full_name || "",
    brideFullName: s.bride_full_name || "",
    groomParents: s.groom_parents || "",
    brideParents: s.bride_parents || "",
    weddingDateLabel:
      (s as { wedding_date_label?: string }).wedding_date_label ||
      (s.wedding_date
        ? new Date(s.wedding_date).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : ""),
    weddingDateISO: dateISO,
    coverTitle: s.cover_title || "",
    quote: s.opening_quote || "",
    quoteSource: s.opening_quote_source || "",
    coupleIntro: s.greeting || "",
    thankYouText: s.closing_text || "",
    giftIntro: s.gift_intro || "",
    giftPhoto: s.gift_qr_url || "",
    coverPhoto: s.cover_photo_url || "",
    coverPhotos: (() => {
      const raw = (s as { cover_photos?: unknown }).cover_photos;
      if (Array.isArray(raw) && raw.length) {
        return raw.map((x) => (typeof x === "string" ? x : "")).filter(Boolean);
      }
      const one = s.cover_photo_url;
      return one ? [one] : [];
    })(),
    heroPhoto:
      (s as { hero_photo_url?: string | null }).hero_photo_url ||
      s.cover_photo_url ||
      "",
    heroPhotos: (() => {
      const raw = (s as { hero_photos?: unknown }).hero_photos;
      if (Array.isArray(raw) && raw.length) {
        return raw.map((x) => (typeof x === "string" ? x : "")).filter(Boolean);
      }
      const one = (s as { hero_photo_url?: string | null }).hero_photo_url || s.cover_photo_url;
      return one ? [one] : [];
    })(),
    expandPhoto: s.expand_photo_url || "",
    bridePhoto: s.bride_photo_url || "",
    groomPhoto: s.groom_photo_url || "",
    musicUrl: s.music_url || "",
    videoUrl: s.video_url || "",
    story: story,
    events: events,
    accounts: accounts,
    gallery: gallery,
    moments: moments,
  };
}

/** Map UI WeddingData → DB partial payload */
export function weddingDataToPayload(d: WeddingData): Record<string, unknown> {
  return {
    groom_name: d.groomName,
    bride_name: d.brideName,
    groom_full_name: d.groomFullName,
    bride_full_name: d.brideFullName,
    groom_parents: d.groomParents,
    bride_parents: d.brideParents,
    cover_title: d.coverTitle,
    wedding_date: normalizeDate(d.weddingDateISO),
    wedding_date_label: d.weddingDateLabel,
    opening_quote: d.quote,
    opening_quote_source: d.quoteSource,
    greeting: d.coupleIntro,
    closing_text: d.thankYouText,
    gift_intro: d.giftIntro,
    gift_qr_url: d.giftPhoto || null,
    cover_photo_url: (d.coverPhotos && d.coverPhotos[0]) || d.coverPhoto,
    cover_photos: (d.coverPhotos && d.coverPhotos.length ? d.coverPhotos : [d.coverPhoto]).filter(Boolean),
    hero_photo_url: (d.heroPhotos && d.heroPhotos[0]) || d.heroPhoto,
    hero_photos: (d.heroPhotos && d.heroPhotos.length ? d.heroPhotos : [d.heroPhoto]).filter(Boolean),
    expand_photo_url: d.expandPhoto || null,
    bride_photo_url: d.bridePhoto,
    groom_photo_url: d.groomPhoto,
    music_url: d.musicUrl || null,
    video_url: d.videoUrl || null,
    events: d.events.map((e, i) => ({
      id: `event-${i}`,
      title: e.name,
      day: "",
      date: e.date,
      time: e.time,
      venue: e.place,
      address: e.address,
      map_url: e.map,
      desc: e.desc,
    })),
    love_story: d.story.map((s, i) => ({
      id: String(i + 1),
      title: s.title,
      date: "",
      description: s.text,
      photo: s.photo,
    })),
    gallery: d.gallery.map((g) => ({ title: g.title, image: g.image })),
    moments: (d.moments || [])
      .filter((m) => m.url)
      .map((m) => ({ type: m.type, url: m.url, title: m.title, caption: m.caption })),
    bank_accounts: d.accounts.map((a) => ({
      bank: a.bank,
      number: a.number,
      name: a.owner,
      image_url: a.logo || null,
    })),
    updated_at: new Date().toISOString(),
  };
}

export async function getSettings(): Promise<InvitationSettings> {
  if (!isSupabaseConfigured()) {
    return { ...EMPTY_SETTINGS, id: "default", updated_at: new Date().toISOString() };
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("invitation_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return { ...EMPTY_SETTINGS, id: "default", updated_at: new Date().toISOString() };
    }
    return data as InvitationSettings;
  } catch {
    return { ...EMPTY_SETTINGS, id: "default", updated_at: new Date().toISOString() };
  }
}

export async function getWeddingDataFromSupabase(): Promise<WeddingData | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const settings = await getSettings();
    if (settings.id === "default") return null;
    return settingsToWeddingData(settings);
  } catch {
    return null;
  }
}

export async function updateSettingsFromWeddingData(
  d: WeddingData,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase belum dikonfigurasi (.env)" };
  }
  try {
    const supabase = createClient();
    const payload = weddingDataToPayload(d);

    const { data: existing, error: fetchErr } = await supabase
      .from("invitation_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (fetchErr) return { success: false, error: fetchErr.message };

    const write = (body: Record<string, unknown>) =>
      existing
        ? supabase.from("invitation_settings").update(body).eq("id", existing.id)
        : supabase.from("invitation_settings").insert(body);

    let { error } = await write(payload);

    // Kolom baru (expand_photo_url, moments) belum dibuat? Simpan sisanya dulu supaya data tidak hilang.
    if (error && /expand_photo_url|moments|schema cache|column/i.test(error.message)) {
      const { expand_photo_url: _a, moments: _b, ...legacyPayload } = payload;
      void _a;
      void _b;
      const retry = await write(legacyPayload);
      if (!retry.error) {
        return {
          success: false,
          error:
            "Data lama tersimpan, tetapi foto zoom & momen BELUM — jalankan supabase/ADD-MOMENTS.sql di Supabase SQL Editor lalu simpan lagi.",
        };
      }
      error = retry.error;
    }

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

/** Upload image to Supabase Storage bucket `wedding-photos` */
export async function uploadWeddingPhoto(
  file: File,
  folder = "gallery",
): Promise<{ url?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase belum dikonfigurasi" };
  }
  try {
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("wedding-photos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

    if (error) return { error: error.message };

    const { data } = supabase.storage.from("wedding-photos").getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function getWishes(): Promise<Wish[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data as Wish[]) || [];
  } catch {
    return [];
  }
}

/** Data lama: dulu konfirmasi kehadiran disimpan di tabel wishes dengan pesan "Konfirmasi kehadiran · N orang". */
export function isLegacyRsvp(w: Pick<Wish, "message">): boolean {
  return /^konfirmasi kehadiran/i.test((w.message || "").trim());
}

/** Hanya ucapan & doa asli (tanpa baris RSVP lama). */
export async function getPrayerWishes(): Promise<Wish[]> {
  const all = await getWishes();
  return all.filter((w) => !isLegacyRsvp(w));
}

function legacyToRsvp(w: Wish): Rsvp {
  const m = (w.message || "").match(/(\d+)\s*\+?\s*orang/i);
  return {
    id: `legacy-${w.id}`,
    guest_name: w.guest_name,
    attendance: String(w.attendance || "").toLowerCase().includes("tidak") ? "tidak" : "hadir",
    guests: m ? Math.max(1, parseInt(m[1], 10)) : 1,
    created_at: w.created_at,
    legacy: true,
  };
}

/** Semua konfirmasi kehadiran: tabel rsvps + data lama dari wishes. */
export async function getRsvps(): Promise<{ rows: Rsvp[]; tableMissing: boolean }> {
  if (!isSupabaseConfigured()) return { rows: [], tableMissing: false };
  let rows: Rsvp[] = [];
  let tableMissing = false;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) tableMissing = true;
    else rows = ((data as Rsvp[]) || []).map((r) => ({ ...r, guests: Number(r.guests) || 1 }));
  } catch {
    tableMissing = true;
  }
  const legacy = (await getWishes()).filter(isLegacyRsvp).map(legacyToRsvp);
  return {
    rows: [...rows, ...legacy].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    ),
    tableMissing,
  };
}

export async function createRsvp(r: {
  guest_name: string;
  attendance: "hadir" | "tidak";
  guests: number;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase belum dikonfigurasi" };
  try {
    const supabase = createClient();
    const { error } = await supabase.from("rsvps").insert({
      guest_name: r.guest_name,
      attendance: r.attendance,
      guests: r.attendance === "hadir" ? Math.max(1, r.guests) : 0,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function deleteRsvp(id: string): Promise<{ success: boolean; error?: string }> {
  if (id.startsWith("legacy-")) return deleteWish(id.slice(7));
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase belum dikonfigurasi" };
  try {
    const supabase = createClient();
    const { error } = await supabase.from("rsvps").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function createWish(wish: {
  guest_name: string;
  message: string;
  attendance?: string;
}): Promise<{ success: boolean; error?: string; data?: Wish }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase belum dikonfigurasi" };
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wishes")
      .insert({
        guest_name: wish.guest_name,
        message: wish.message,
        attendance: wish.attendance || "hadir",
      })
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Wish };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function deleteWish(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase belum dikonfigurasi" };
  try {
    const supabase = createClient();
    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
