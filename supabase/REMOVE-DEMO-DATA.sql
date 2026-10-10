-- ============================================================
-- Hapus data demo dari tabel invitation_settings
-- Aman dijalankan ulang. Hanya mengosongkan nilai yang SAMA PERSIS
-- dengan bawaan demo lama; data asli yang sudah Anda isi tidak disentuh.
-- ============================================================

-- 1. Hentikan pengisian otomatis dengan data demo untuk baris baru
ALTER TABLE invitation_settings
  ALTER COLUMN groom_name DROP NOT NULL,
  ALTER COLUMN groom_full_name DROP NOT NULL,
  ALTER COLUMN groom_parents DROP NOT NULL,
  ALTER COLUMN bride_name DROP NOT NULL,
  ALTER COLUMN bride_full_name DROP NOT NULL,
  ALTER COLUMN bride_parents DROP NOT NULL;

ALTER TABLE invitation_settings
  ALTER COLUMN groom_name DROP DEFAULT,
  ALTER COLUMN groom_full_name DROP DEFAULT,
  ALTER COLUMN groom_parents DROP DEFAULT,
  ALTER COLUMN groom_instagram DROP DEFAULT,
  ALTER COLUMN bride_name DROP DEFAULT,
  ALTER COLUMN bride_full_name DROP DEFAULT,
  ALTER COLUMN bride_parents DROP DEFAULT,
  ALTER COLUMN bride_instagram DROP DEFAULT,
  ALTER COLUMN hashtag DROP DEFAULT,
  ALTER COLUMN cover_title DROP DEFAULT,
  ALTER COLUMN wedding_date DROP DEFAULT,
  ALTER COLUMN opening_quote DROP DEFAULT,
  ALTER COLUMN opening_quote_source DROP DEFAULT,
  ALTER COLUMN greeting DROP DEFAULT,
  ALTER COLUMN events SET DEFAULT '[]'::jsonb,
  ALTER COLUMN dress_code_title DROP DEFAULT,
  ALTER COLUMN dress_code_colors SET DEFAULT '[]'::jsonb,
  ALTER COLUMN dress_code_note DROP DEFAULT,
  ALTER COLUMN love_story SET DEFAULT '[]'::jsonb,
  ALTER COLUMN gift_intro DROP DEFAULT,
  ALTER COLUMN bank_accounts SET DEFAULT '[]'::jsonb,
  ALTER COLUMN gift_address DROP DEFAULT,
  ALTER COLUMN closing_text DROP DEFAULT;

-- 2. Kosongkan nilai demo yang masih tersimpan di baris yang ada
UPDATE invitation_settings SET
  groom_name = NULLIF(groom_name, 'Putra'),
  groom_full_name = NULLIF(groom_full_name, 'Putra Setiawan'),
  groom_parents = NULLIF(groom_parents, 'Bpk Fulan & Ibu Fulanah'),
  groom_instagram = NULLIF(groom_instagram, 'putraa123'),
  bride_name = NULLIF(bride_name, 'Putri'),
  bride_full_name = NULLIF(bride_full_name, 'Putri Pratiwi'),
  bride_parents = NULLIF(bride_parents, 'Bpk Fulan & Ibu Fulanah'),
  bride_instagram = NULLIF(bride_instagram, 'putriii123'),
  hashtag = NULLIF(hashtag, '#AllWEneedisLOve'),
  gift_address = NULLIF(gift_address, 'Putraa - +62 8500000000 - btn dutamas blok D/6'),
  opening_quote_source = NULLIF(opening_quote_source, '(Qs. Ar. Rum : 21)'),
  dress_code_title = NULLIF(dress_code_title, 'Colorful Pastel');

-- Daftar acara demo lama (Pamboang, 4 Mei 2026)
UPDATE invitation_settings SET events = '[]'::jsonb
WHERE events::text LIKE '%Lalampanua%' OR events::text LIKE '%Koramil 1401-02%';

-- Cerita cinta demo lama (Lorem Ipsum / placeholder)
UPDATE invitation_settings SET love_story = '[]'::jsonb
WHERE love_story::text LIKE '%Lorem Ipsum%' OR love_story::text LIKE '%Cerita pertemuan pertama kalian%';

-- Rekening demo lama
UPDATE invitation_settings SET bank_accounts = '[]'::jsonb
WHERE bank_accounts::text LIKE '%Kondanganmu ID%'
   OR bank_accounts::text LIKE '%1234567890%'
   OR bank_accounts::text LIKE '%5124125213%';

-- Catatan: kutipan pembuka, salam, kalimat penutup, dan dress code bawaan lama
-- bersifat umum dan tidak dihapus otomatis. Periksa di tab Umum pada /admin.
