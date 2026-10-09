import { createClient, isSupabaseConfigured } from "./client";
import type { InvitationSettings, Wish } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/types";
import type { WeddingData, EventItem, StoryItem, GalleryItem, BankAccount } from "@/lib/wedding-data";
import { DEFAULT_DATA } from "@/lib/wedding-data";

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

  const accounts: BankAccount[] = (s.bank_accounts || []).map((a) => ({
    bank: a.bank || "",
    number: a.number || "",
    owner: a.name || "",
  }));

  const dateISO = s.wedding_date
    ? s.wedding_date.includes("T")
      ? s.wedding_date
      : `${s.wedding_date}T10:00:00+07:00`
    : DEFAULT_DATA.weddingDateISO;

  return {
    groomName: s.groom_name || DEFAULT_DATA.groomName,
    brideName: s.bride_name || DEFAULT_DATA.brideName,
    groomFullName: s.groom_full_name || DEFAULT_DATA.groomFullName,
    brideFullName: s.bride_full_name || DEFAULT_DATA.brideFullName,
    groomParents: s.groom_parents || DEFAULT_DATA.groomParents,
    brideParents: s.bride_parents || DEFAULT_DATA.brideParents,
    weddingDateLabel:
      (s as { wedding_date_label?: string }).wedding_date_label ||
      (s.wedding_date
        ? new Date(s.wedding_date).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : DEFAULT_DATA.weddingDateLabel),
    weddingDateISO: dateISO,
    coverTitle: s.cover_title || DEFAULT_DATA.coverTitle,
    quote: s.opening_quote || DEFAULT_DATA.quote,
    quoteSource: s.opening_quote_source || DEFAULT_DATA.quoteSource,
    coupleIntro: s.greeting || DEFAULT_DATA.coupleIntro,
    thankYouText: s.closing_text || DEFAULT_DATA.thankYouText,
    giftIntro: s.gift_intro || DEFAULT_DATA.giftIntro,
    coverPhoto: s.cover_photo_url || DEFAULT_DATA.coverPhoto,
    heroPhoto:
      (s as { hero_photo_url?: string | null }).hero_photo_url ||
      s.cover_photo_url ||
      DEFAULT_DATA.heroPhoto,
    bridePhoto: s.bride_photo_url || DEFAULT_DATA.bridePhoto,
    groomPhoto: s.groom_photo_url || DEFAULT_DATA.groomPhoto,
    musicUrl: s.music_url || "",
    videoUrl: s.video_url || "",
    story: story.length ? story : DEFAULT_DATA.story,
    events: events.length ? events : DEFAULT_DATA.events,
    accounts: accounts.length ? accounts : DEFAULT_DATA.accounts,
    gallery: gallery.length ? gallery : DEFAULT_DATA.gallery,
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
    wedding_date: d.weddingDateISO.slice(0, 10),
    wedding_date_label: d.weddingDateLabel,
    opening_quote: d.quote,
    opening_quote_source: d.quoteSource,
    greeting: d.coupleIntro,
    closing_text: d.thankYouText,
    gift_intro: d.giftIntro,
    cover_photo_url: d.coverPhoto,
    hero_photo_url: d.heroPhoto,
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
    bank_accounts: d.accounts.map((a) => ({
      bank: a.bank,
      number: a.number,
      name: a.owner,
      image_url: null,
    })),
    updated_at: new Date().toISOString(),
  };
}

export async function getSettings(): Promise<InvitationSettings> {
  if (!isSupabaseConfigured()) {
    return { ...DEFAULT_SETTINGS, id: "default", updated_at: new Date().toISOString() };
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("invitation_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return { ...DEFAULT_SETTINGS, id: "default", updated_at: new Date().toISOString() };
    }
    return data as InvitationSettings;
  } catch {
    return { ...DEFAULT_SETTINGS, id: "default", updated_at: new Date().toISOString() };
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

    if (!existing) {
      const { error } = await supabase.from("invitation_settings").insert(payload);
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    const { error } = await supabase
      .from("invitation_settings")
      .update(payload)
      .eq("id", existing.id);

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
