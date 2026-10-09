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
- Badge Lovable disembunyikan
- Schema aman di-run ulang
