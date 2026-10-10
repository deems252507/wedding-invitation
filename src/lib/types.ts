export interface EventItem {
  id: string;
  title: string;
  day: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  map_url: string;
}

export interface LoveStoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface BankAccount {
  bank: string;
  number: string;
  name: string;
  image_url?: string | null;
}

export interface InvitationSettings {
  id: string;
  groom_name: string;
  groom_full_name: string;
  groom_parents: string;
  groom_instagram: string | null;
  bride_name: string;
  bride_full_name: string;
  bride_parents: string;
  bride_instagram: string | null;
  hashtag: string | null;
  cover_title: string | null;
  wedding_date: string;
  opening_quote: string | null;
  opening_quote_source: string | null;
  greeting: string | null;
  logo_url: string | null;
  cover_photo_url: string | null;
  hero_photo_url?: string | null;
  wedding_date_label?: string | null;
  groom_photo_url: string | null;
  bride_photo_url: string | null;
  events: EventItem[];
  dress_code_title: string | null;
  dress_code_colors: string[];
  dress_code_note: string | null;
  love_story: LoveStoryItem[];
  gallery: (string | { title?: string; image?: string; url?: string })[];
  gift_intro: string | null;
  bank_accounts: BankAccount[];
  gift_address: string | null;
  gift_qr_url: string | null;
  closing_text: string | null;
  music_url: string | null;
  video_url: string | null;
  updated_at: string;
}

export interface Wish {
  id: string;
  guest_name: string;
  message: string;
  attendance: string;
  created_at: string;
}

/** Keadaan kosong: tidak ada data demo. */
export const EMPTY_SETTINGS: Omit<InvitationSettings, "id" | "updated_at"> = {
  groom_name: "",
  groom_full_name: "",
  groom_parents: "",
  groom_instagram: null,
  bride_name: "",
  bride_full_name: "",
  bride_parents: "",
  bride_instagram: null,
  hashtag: null,
  cover_title: null,
  wedding_date: "",
  opening_quote: null,
  opening_quote_source: null,
  greeting: null,
  logo_url: null,
  cover_photo_url: null,
  groom_photo_url: null,
  bride_photo_url: null,
  events: [],
  dress_code_title: null,
  dress_code_colors: [],
  dress_code_note: null,
  love_story: [],
  gallery: [],
  gift_intro: null,
  bank_accounts: [],
  gift_address: null,
  gift_qr_url: null,
  closing_text: null,
  music_url: null,
  video_url: null,
};
