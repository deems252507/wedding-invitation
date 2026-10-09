# Undangan Pernikahan Digital — Moonlight Symphony

Full-stack digital wedding invitation inspired by [inv.kondanganmu.id/art-21](https://inv.kondanganmu.id/art-21/).

**Stack:** Next.js 14 · Tailwind CSS · Framer Motion · Supabase · Vercel

## Fitur

### Halaman Undangan (Public)
- Cover dengan nama tamu (`?to=Nama+Tamu`) + tombol **Buka Undangan**
- Animasi fade / scale (Framer Motion)
- Countdown timer
- Section: Mempelai, Acara (Akad / Resepsi / dll), Dress Code, Love Story, Gallery, Wedding Gift, Ucapan & Doa
- Desain navy + cream, font Pinyon Script + Cormorant Garamond (sesuai design system)

### Admin Panel (`/admin/login`)
- Edit semua teks: nama mempelai, orang tua, Instagram, quote, greeting, dll
- Kelola acara (tambah / hapus / edit)
- Love Story timeline
- Wedding Gift (rekening + alamat)
- Gallery (URL gambar)
- **Ucapan & Doa**: lihat semua + **hapus**

---

## Setup Cepat (Gratis)

### 1. Supabase

1. Buat project di [supabase.com](https://supabase.com) (gratis)
2. Buka **SQL Editor** → paste isi file `supabase/schema.sql` → Run
3. (Opsional) Buat Storage bucket `wedding-photos` → Public
4. Ambil credentials:
   - **Project Settings → API**
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (jangan expose ke client!)

### 2. Local Development

```bash
cd wedding-invitation
cp .env.example .env.local
# Isi nilai Supabase + ADMIN_PASSWORD di .env.local

npm install
npm run dev
```

Buka:
- Undangan: http://localhost:3000/?to=Nama+Tamu
- Admin: http://localhost:3000/admin/login

### 3. Deploy ke Vercel (Gratis)

1. Push repo ke GitHub
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan Environment Variables (sama seperti `.env.local`)
4. Deploy

Setelah deploy, undangan bisa diakses di:
`https://your-app.vercel.app/?to=Budi+Santoso`

---

## Struktur Folder

```
src/
  app/
    page.tsx              → Halaman undangan
    admin/login/          → Login admin
    admin/dashboard/      → Panel edit semua konten
    api/settings/         → GET/PUT settings
    api/wishes/           → GET/POST/DELETE ucapan
  components/invitation/  → Cover, Countdown, Sections...
  lib/
    types.ts
    supabase/             → client, server, data helpers
supabase/
  schema.sql              → Jalankan di Supabase SQL Editor
```

## Catatan

- Tanpa Supabase (env kosong), undangan tetap tampil dengan data default.
- Password admin dicek via header `x-admin-password` di API (simple, cocok untuk single-user).
- Untuk upload foto: upload ke Supabase Storage / Imgur / Cloudinary, lalu paste URL di admin.
- Link undangan per tamu: `/?to=Nama+Tamu`

## Design System

Warna utama: Navy `#0D0E3A` + Cream `#E4EAF6` + Rose accent `#CC3366`  
Font: Pinyon Script (nama), Cormorant Garamond (body), Poppins (utility)
