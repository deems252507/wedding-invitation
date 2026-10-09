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

export const DEFAULT_SETTINGS: Omit<InvitationSettings, "id" | "updated_at"> = {
  groom_name: "Putra",
  groom_full_name: "Putra Setiawan",
  groom_parents: "Bpk Fulan & Ibu Fulanah",
  groom_instagram: "putraa123",
  bride_name: "Putri",
  bride_full_name: "Putri Pratiwi",
  bride_parents: "Bpk Fulan & Ibu Fulanah",
  bride_instagram: "putriii123",
  hashtag: "#AllWEneedisLOve",
  cover_title: "THE WEDDING OF",
  wedding_date: "2026-05-04",
  opening_quote:
    "Dan diantara tanda-tanda kekuasaanNya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikanNya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.",
  opening_quote_source: "(Qs. Ar. Rum : 21)",
  greeting:
    "Assalamualaikum Wr. Wb. Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:",
  logo_url: null,
  cover_photo_url: null,
  groom_photo_url: null,
  bride_photo_url: null,
  events: [
    {
      id: "akad",
      title: "Akad Nikah",
      day: "Sabtu",
      date: "4 Mei 2026",
      time: "10.00 WITA - Selesai",
      venue: "Kediaman Mempelai Perempuan",
      address: "Lingk. Taduang Kel. Lalampanua, Kec. Pamboang",
      map_url: "https://maps.app.goo.gl/z6C3HM54GN7bTLtD8",
    },
    {
      id: "resepsi",
      title: "Resepsi",
      day: "Sabtu",
      date: "4 Mei 2026",
      time: "12.30 - Selesai",
      venue: "Kediaman Mempelai Perempuan",
      address: "Lingk. Taduang Kel. Lalampanua, Kec. Pamboang",
      map_url: "https://maps.app.goo.gl/z6C3HM54GN7bTLtD8",
    },
  ],
  dress_code_title: "Colorful Pastel",
  dress_code_colors: ["Lilac", "Baby Blue", "Mint Green", "Blush Pink"],
  dress_code_note:
    "Tanpa mengurangi rasa hormat, harap gunakan salah satu warna dari Dress Code di atas. Kombinasi warna diperbolehkan selama masih dalam tone yang senada. Mohon hindari dress code putih, hitam penuh & merah mencolok",
  love_story: [
    {
      id: "1",
      title: "Pertemuan Pertama",
      date: "12 April 2019",
      description: "Cerita pertemuan pertama kalian...",
    },
    {
      id: "2",
      title: "Lamaran",
      date: "12 April 2023",
      description: "Cerita momen lamaran...",
    },
    {
      id: "3",
      title: "Menikah",
      date: "04 Mei 2026",
      description: "Hari bahagia kami...",
    },
  ],
  gallery: [],
  gift_intro:
    "Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.",
  bank_accounts: [
    { bank: "BCA", number: "1234567890", name: "Putra Setiawan", image_url: null },
    { bank: "Mandiri", number: "0987654321", name: "Putri Pratiwi", image_url: null },
  ],
  gift_address: "Alamat pengiriman kado...",
  gift_qr_url: null,
  closing_text:
    "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan doa restu kepada kami",
  music_url: null,
  video_url: null,
};
