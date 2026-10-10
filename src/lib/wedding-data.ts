/**
 * Central wedding invitation data + localStorage admin persistence.
 * Admin saves here; invitation reads with fallback to defaults.
 * Foto default dihapus — semua foto diambil dari database / admin upload.
 */

export const ADMIN_PASSWORD = "admin123"; // ganti di admin panel atau di sini
export const STORAGE_KEY = "wedding-invitation-data-v1";
export const AUTH_KEY = "wedding-admin-auth";

export interface StoryItem {
  title: string;
  photo: string;
  text: string;
}

export interface EventItem {
  name: string;
  desc: string;
  date: string;
  time: string;
  place: string;
  address: string;
  map: string;
}

export interface BankAccount {
  bank: string;
  number: string;
  owner: string;
  /** URL logo bank (opsional) */
  logo?: string;
}

export interface GalleryItem {
  title: string;
  image: string;
}

export interface WeddingData {
  groomName: string;
  brideName: string;
  groomFullName: string;
  brideFullName: string;
  groomParents: string;
  brideParents: string;
  weddingDateLabel: string; // e.g. "Sabtu, 30 Januari 2027"
  weddingDateISO: string; // for countdown
  coverTitle: string;
  quote: string;
  quoteSource: string;
  coupleIntro: string;
  thankYouText: string;
  giftIntro: string;
  /** Foto / QR kado (opsional) */
  giftPhoto: string;
  coverPhoto: string;
  /** Multiple cover slides (auto). If empty, uses coverPhoto. */
  coverPhotos: string[];
  heroPhoto: string;
  /** Multiple hero slides (auto). If empty, uses heroPhoto + gallery. */
  heroPhotos: string[];
  bridePhoto: string;
  groomPhoto: string;
  musicUrl: string;
  videoUrl: string;
  story: StoryItem[];
  events: EventItem[];
  accounts: BankAccount[];
  gallery: GalleryItem[];
}

export const DEFAULT_DATA: WeddingData = {
  // Identitas mempelai diketahui dari pemilik proyek; detail acara tetap kosong
  // sampai diisi melalui admin agar data contoh tidak tampil sebagai informasi nyata.
  groomName: "Rizky",
  brideName: "Rizka",
  groomFullName: "Rizky Dwi Maulana",
  brideFullName: "Rizka Tri Oktavianti",
  groomParents: "",
  brideParents: "",
  weddingDateLabel: "",
  weddingDateISO: "",
  coverTitle: "The Wedding of",
  quote: "",
  quoteSource: "",
  coupleIntro: "Dengan penuh rasa syukur, kami mengundang Anda untuk berbagi kebahagiaan bersama kami.",
  thankYouText: "Terima kasih atas doa dan perhatian yang diberikan kepada kami.",
  giftIntro: "",
  giftPhoto: "",
  coverPhoto: "",
  coverPhotos: [],
  heroPhoto: "",
  heroPhotos: [],
  bridePhoto: "",
  groomPhoto: "",
  musicUrl: "",
  videoUrl: "",
  story: [],
  events: [],
  accounts: [],
  gallery: [],
};

export function loadWeddingData(): WeddingData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Partial<WeddingData>;
    return { ...DEFAULT_DATA, ...parsed };
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveWeddingData(data: WeddingData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // notify other tabs / live preview
  window.dispatchEvent(new CustomEvent("wedding-data-updated"));
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

export function setAdminAuthenticated(ok: boolean): void {
  if (typeof window === "undefined") return;
  if (ok) sessionStorage.setItem(AUTH_KEY, "1");
  else sessionStorage.removeItem(AUTH_KEY);
}

/** Convert File to data URL for localStorage photo upload */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
