# Setup Supabase untuk Undangan

## 1. Buat project di [supabase.com](https://supabase.com)

Sudah ada? Catat Project URL & anon key dari **Project Settings → API**.

## 2. Jalankan SQL (WAJIB agar data tersimpan)

Dashboard → **SQL Editor** → New query → paste **seluruh** isi file `supabase/schema.sql` → **Run**.

Ini membuat:
- tabel `invitation_settings` (isi undangan)
- tabel `wishes` (RSVP + ucapan)
- policy baca/tulis/hapus
- policy storage

Jika tabel sudah ada, jalankan saja bagian **MIGRATION** di akhir file (ADD COLUMN + policies).

## 3. Storage bucket

Dashboard → **Storage** → New bucket:
- Name: `wedding-photos`
- **Public bucket: ON**

Lalu di SQL Editor, pastikan policy storage di `schema.sql` sudah di-run.

## 4. Environment variables

### Lokal
```bash
cp .env.example .env
```

Isi:
```
VITE_SUPABASE_URL=https://XXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Vercel (penting!)
Project → **Settings → Environment Variables** → tambah:

| Name | Value |
|------|--------|
| `VITE_SUPABASE_URL` | Project URL dari Supabase |
| `VITE_SUPABASE_ANON_KEY` | anon public key |

Centang **Production**, **Preview**, **Development**.  
Lalu **Redeploy** (Deployments → ⋯ → Redeploy).

Tanpa env di Vercel, admin akan tetap menampilkan:
> Supabase belum diisi (.env) — simpan lokal saja

## 5. Cek
1. Buka `/admin` → harus hijau: **Supabase terhubung**
2. Ubah teks → **SIMPAN KE SUPABASE**
3. Dashboard Supabase → Table Editor → `invitation_settings` harus terisi
4. Tab **Ucapan/RSVP** di admin untuk lihat & hapus konfirmasi + doa

## Catatan keamanan
Policy UPDATE/DELETE dibuka publik agar admin client-side sederhana (dilindungi password di app).  
Untuk produksi ketat, ganti dengan Supabase Auth + policy `auth.role() = 'authenticated'`.
