# Cara Menjalankan Undangan

## 1. Lokal

```bash
cd wedding-invitation-main
npm install
cp .env.example .env
# isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
npm run dev
```

- Undangan: http://localhost:5173
- Admin: http://localhost:5173/admin (password: `admin123`)

## 2. Supabase

SQL Editor → paste **seluruh** `supabase/schema.sql` → Run  
(termasuk kolom baru `cover_photos` + `hero_photos`)

Storage → bucket `wedding-photos` → Public ON

## 3. Fitur foto (baru)

| Bagian | Bisa banyak? | Slide otomatis? |
|--------|--------------|-----------------|
| **Cover** | Ya (admin: + Tambah foto cover) | Ya (~4 detik) |
| **Hero** | Ya (admin: + Tambah foto hero) | Ya (~4.5 detik) |
| **Galeri** | Ya, tanpa batas | Strip auto + lightbox |

Di admin tab **Umum**:
- Foto cover → tambah beberapa
- Foto hero → tambah beberapa
- Foto mempelai wanita & pria (satu-satu)

Tab **Galeri**: tekan **+ Tambah foto** sebanyak yang mau.

Lalu **SIMPAN KE SUPABASE**.

## 4. Vercel

Env (visibility **Config**):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Redeploy setelah ubah env.

## 5. Yang sudah diperbaiki

- Teks lebih besar
- Couple: foto wanita & pria terpisah
- Cover & Hero: multi-foto + slideshow
- Galeri unlimited
- Gift: tombol → modal
- Schema aman di-run ulang

## 6. Perubahan terbaru (perbaikan)

- Semua foto default dihapus — undangan hanya menampilkan foto dari database/admin.
- Indikator garis slide (dots) di cover & hero dihilangkan.
- Opsi "Masih Ragu" di form RSVP dihapus (hanya Hadir / Tidak Hadir).
- Favicon default & jejak branding AI dihilangkan.
- Komponen admin baru: `src/components/admin/RsvpReport.tsx`
  - Tab khusus Konfirmasi Kehadiran
  - Ringkasan jumlah Hadir / Tidak Hadir
  - Daftar nama tamu jelas
  - Tombol **Unduh / Cetak PDF**

### Cara pasang RsvpReport di admin

Di halaman admin (tab Ucapan/RSVP atau tab baru), impor dan render:

```tsx
import RsvpReport from "@/components/admin/RsvpReport";

// di dalam JSX admin:
<RsvpReport />
```

Jika file route admin Anda ada di repo (mis. `src/routes/admin.tsx`), letakkan komponen di sana sebagai section terpisah.

## Komponen Baru (Animasi)

### Flow Button
```tsx
import { FlowButton } from "@/components/ui/flow-button";
<FlowButton text="Buka Undangan" onClick={onOpen} />
```

### Text Particle (nama mempelai di cover)
```tsx
import { TextParticle } from "@/components/ui/text-particle";
<TextParticle text="Bride & Groom" particleColor="#f5f0e8" fontSize={100} />
```
Cover sudah memakai TextParticle + FlowButton.

### Cinematic Footer (scroll reveal bottom)
```tsx
import { CinematicFooter } from "@/components/ui/motion-footer";
// Di layout setelah konten utama (z-10), footer fixed z-0
<main className="relative z-10 ...">...</main>
<CinematicFooter />
```
ThankYou section sudah disiapkan dengan "Scroll down to reveal".

### Scroll Expansion Hero
```tsx
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
<ScrollExpandMedia
  mediaType="image"
  mediaSrc="..."
  bgImageSrc="..."
  title="Our Story"
  date="Wedding"
  scrollToExpand="Scroll to Expand"
>
  <p>Konten setelah expand</p>
</ScrollExpandMedia>
```

Dependensi: lucide-react sudah ada. Tidak perlu install tambahan untuk komponen di atas.

## 7. Animasi skrol

| Bagian | Efek |
|---|---|
| Hero | Foto zoom + bergeser, nama naik dan memudar saat digulir keluar |
| Expand (Scroll Expansion Hero) | Foto membesar jadi layar penuh, nama bergeser berlawanan arah |
| Kutipan | Kata demi kata muncul dari buram, menimpa Hero (overlap) |
| Mempelai | Foto terbuka seperti tirai dari kiri/kanan, nama muncul huruf demi huruf |
| Kisah cinta | Garis waktu tergambar mengikuti skrol, kartu bergantian dari kiri/kanan |
| Acara | Kartu miring 3D |
| Hitung mundur | Latar parallax, angka muncul berurutan |
| Galeri | Kotak foto muncul berurutan, lalu lightbox |
| Penutup | Teks terungkap, lalu Cinematic Footer terungkap di belakang konten |
| Global | Garis emas progres skrol di atas layar |

Semua efek mati otomatis jika perangkat memakai `prefers-reduced-motion`.
Foto Expand diambil dari foto hero ke-2, lalu galeri, lalu foto hero utama (atur di admin).

## 5. Update terbaru (perbaikan tampilan & kehadiran)

**WAJIB sekali:** Supabase → SQL Editor → paste isi `supabase/ADD-RSVPS.sql` → Run.
Ini membuat tabel `rsvps` supaya konfirmasi kehadiran tersimpan terpisah dari ucapan & doa.

- Undangan hanya menampilkan **Prayers & Wishes**. Di form itu tamu juga memilih hadir / berhalangan
  (dan jumlah orang). Pilihan kehadiran **tidak** muncul di daftar ucapan.
- Admin → tab **Kehadiran**: total tamu yang akan datang (jumlah orang), daftar hadir, daftar berhalangan, cetak PDF.
- Admin → tab **Ucapan & Doa**: hanya ucapan.
- Data konfirmasi lama (yang dulu masuk ke tabel `wishes`) otomatis ikut terbaca di tab Kehadiran
  dan tidak lagi tampil di daftar ucapan.

## 8. Update tampilan profesional (terbaru)

**WAJIB sekali:** Supabase → SQL Editor → paste isi `supabase/ADD-MOMENTS.sql` → Run.
Ini menambah kolom foto zoom + momen. (Sebelum dijalankan, data lain tetap tersimpan, tetapi foto zoom & momen belum.)

| Perubahan | Keterangan |
|---|---|
| Navbar melayang | Beranda · Mempelai · Acara · Galeri · Ucapan · Kado. Muncul setelah mulai scroll, item aktif mengikuti halaman. Tombol musik pindah ke kanan atas. |
| Momen (baru) | Layar penuh yang menempel saat scroll; foto/video berganti otomatis. Admin → tab **Momen** (bisa foto atau video, atur urutan ↑ ↓). Kosong = bagian tidak tampil. |
| Foto zoom | Admin → **Umum → Foto zoom**. Terpisah dari hero/galeri sehingga gambarnya tidak kembar. Teks tidak lagi menimpa wajah. |
| Galeri 3D | Kisi foto miring yang terbentang rata saat digulir. Semua kartu seragam 3:4. Ketuk foto → lightbox dengan zoom (cubit, roda mouse, tombol +/−, ketuk dua kali) dan geser. |
| Upload galeri massal | Admin → Galeri → **Pilih banyak foto sekaligus**. |
| Ucapan & Doa | Formulir dalam kartu 2 langkah, daftar "Ucapan dari Tamu (jumlah)", dan **popup terima kasih** setelah kirim. Jika gagal kirim, pesan error tampil (tidak lagi pura-pura sukses). |
| Penutup | Tulisan "Thank You", "Scroll down to reveal", teks "Admin", dan teks berjalan dihapus. Footer hanya: Putri / & / Putra, tanggal, © tahun · nama. Admin tetap bisa dibuka lewat `/admin`. |

Catatan video Momen: gunakan MP4 (H.264) ≤ 20 MB; paket gratis Supabase membatasi 50 MB per file.

## 9. Update tampilan (kado, mempelai, acara)

Tidak ada SQL baru. Kolom Instagram sudah ada di tabel.

- **Kado:** tombol "Lihat Daftar Kado" membuka popup "Kado" berisi daftar bank (logo/nama). Klik satu bank untuk membuka nomor rekening, a/n, dan tombol Salin. QR kado muncul sebagai item "QR Code".
- **Mempelai:** tiap mempelai satu layar penuh (foto bergeser halus saat digulir; label, nama huruf demi huruf, nama lengkap, orang tua, lalu tombol Instagram masuk perlahan). Isi akun Instagram di admin → Umum → Nama pasangan (kosong = tombol tidak tampil).
- **Akad / Resepsi:** judul acara, kotak tanggal (bulan | hari + tanggal | tahun), jam, tempat, alamat, tombol **Simpan Tanggal** (Google Calendar) dan **Navigasi Peta**. Tulis tanggal di admin seperti "Senin, 4 Mei 2026"; zona WITA/WIT/WIB dibaca dari kolom Waktu (mis. "10.00 WITA - Selesai").
- Semua animasi masuk dibuat lebih lambat dan halus. Butiran emas dihapus.
