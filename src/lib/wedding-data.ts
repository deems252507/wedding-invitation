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
  groomName: "Nathan",
  brideName: "Shopia",
  groomFullName: "Nathan Hermawan Wijaya",
  brideFullName: "Sophia Putri Rahayu",
  groomParents: "Putra kedua dari Bapak Hanung Wijaya dan Ibu Wayan Sari",
  brideParents: "Putri pertama dari Bapak Budi Prasetyo dan Ibu Tri Utami",
  weddingDateLabel: "Sabtu, 30 Januari 2027",
  weddingDateISO: "2027-01-30T10:00:00+07:00",
  coverTitle: "The Wedding of",
  quote:
    "Dan mereka keduanya akan menjadi satu daging, jadi mereka tidak lagi menjadi dua orang, melainkan satu. Oleh karena itu apa yang telah dipersatukan Tuhan, janganlah manusia memisahkan.",
  quoteSource: "MARKUS 10 : 8-9",
  coupleIntro: "Kami memohon doa & restunya atas pernikahan kami",
  thankYouText:
    "Menjadi sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam hari bahagia kami. Terima kasih atas segala ucapan, doa, dan perhatian yang diberikan.",
  giftIntro:
    "Kehadiran Bapak/Ibu/Saudara/i merupakan hadiah terindah. Namun apabila hendak memberikan tanda kasih, dapat melalui rekening berikut:",
  giftPhoto: "",
  coverPhoto: "",
  coverPhotos: [],
  heroPhoto: "",
  heroPhotos: [],
  bridePhoto: "",
  groomPhoto: "",
  musicUrl: "",
  videoUrl: "",
  story: [
    {
      title: "Pertemuan Pertama",
      photo: "",
      text: "Kisah ini berawal ketika jumpa pandangan pertama di kampus Merayakan.",
    },
    {
      title: "Lamaran",
      photo: "",
      text: "Tak disangka, cerita ini semakin erat untuk mengikat janji suci. Sehingga proses lamaran ini pun berlangsung hangat.",
    },
    {
      title: "Menuju Hari Bahagia",
      photo: "",
      text: "Dengan restu orang tua dan doa keluarga, kami melangkah bersama menuju hari pernikahan.",
    },
  ],
  events: [
    {
      name: "Akad Nikah",
      desc: "Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir.",
      date: "Sabtu, 30 Januari 2027",
      time: "09.00 WIB",
      place: "Masjid Gedhe Kauman",
      address: "Jl. Kauman, Yogyakarta",
      map: "https://maps.google.com",
    },
    {
      name: "Resepsi",
      desc: "Mari berbagi kebahagiaan dalam resepsi pernikahan kami.",
      date: "Sabtu, 30 Januari 2027",
      time: "11.00 – 14.00 WIB",
      place: "Gedung Societet Militair",
      address: "Jl. Pangurakan No.1, Yogyakarta",
      map: "https://maps.google.com",
    },
  ],
  accounts: [
    { bank: "BCA", number: "1234567890", owner: "Sophia Putri Rahayu" },
    { bank: "MANDIRI", number: "5124125213", owner: "Nathan Hermawan Wijaya" },
  ],
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
