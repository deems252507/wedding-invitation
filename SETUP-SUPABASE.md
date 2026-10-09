# Setup Supabase untuk Undangan

## 1. Buat project di [supabase.com](https://supabase.com)

## 2. Jalankan SQL
Dashboard → **SQL Editor** → New query → paste isi file `supabase/schema.sql` (semua) → Run.

## 3. Storage
Dashboard → **Storage** → New bucket:
- Name: `wedding-photos`
- **Public bucket: ON**

Lalu jalankan bagian policy storage di akhir `schema.sql` (atau biarkan jika sudah di-run).

## 4. Env
Salin `.env.example` jadi `.env`:

```bash
cp .env.example .env
```

Isi dari **Project Settings → API**:
- `VITE_SUPABASE_URL` = Project URL
- `VITE_SUPABASE_ANON_KEY` = anon public key

## 5. Jalankan app
```bash
npm install
npm run dev
```

Buka `/admin` (password default: `admin123`).

Simpan perubahan → data masuk tabel `invitation_settings`.
Upload foto → bucket `wedding-photos`.

## Catatan keamanan
Policy UPDATE settings dibuka publik agar admin client-side sederhana.
Untuk produksi, ganti dengan Supabase Auth + policy `auth.role() = 'authenticated'`.
