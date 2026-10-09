-- ============================================================
-- Wedding Invitation - Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Settings (single row for the whole invitation content)
CREATE TABLE IF NOT EXISTS invitation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Couple
  groom_name TEXT NOT NULL DEFAULT 'Putra',
  groom_full_name TEXT NOT NULL DEFAULT 'Putra Setiawan',
  groom_parents TEXT NOT NULL DEFAULT 'Bpk Fulan & Ibu Fulanah',
  groom_instagram TEXT DEFAULT 'putraa123',
  bride_name TEXT NOT NULL DEFAULT 'Putri',
  bride_full_name TEXT NOT NULL DEFAULT 'Putri Pratiwi',
  bride_parents TEXT NOT NULL DEFAULT 'Bpk Fulan & Ibu Fulanah',
  bride_instagram TEXT DEFAULT 'putriii123',
  hashtag TEXT DEFAULT '#AllWEneedisLOve',
  -- Cover
  cover_title TEXT DEFAULT 'THE WEDDING OF',
  wedding_date DATE DEFAULT '2026-05-04',
  opening_quote TEXT DEFAULT 'Dan diantara tanda-tanda kekuasaanNya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikanNya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
  opening_quote_source TEXT DEFAULT '(Qs. Ar. Rum : 21)',
  greeting TEXT DEFAULT 'Assalamualaikum Wr. Wb. Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:',
  -- Photos (public URLs from Supabase Storage)
  logo_url TEXT,
  cover_photo_url TEXT,
  groom_photo_url TEXT,
  bride_photo_url TEXT,
  -- Events (JSON array)
  events JSONB DEFAULT '[
    {"id":"akad","title":"Akad Nikah","day":"Sabtu","date":"4 Mei 2026","time":"10.00 WITA - Selesai","venue":"Kediaman Mempelai Perempuan","address":"Lingk. Taduang Kel. Lalampanua, Kec. Pamboang","map_url":"https://maps.app.goo.gl/z6C3HM54GN7bTLtD8"},
    {"id":"resepsi","title":"Resepsi","day":"Sabtu","date":"4 Mei 2026","time":"12.30 - Selesai","venue":"Kediaman Mempelai Perempuan","address":"Lingk. Taduang Kel. Lalampanua, Kec. Pamboang","map_url":"https://maps.app.goo.gl/z6C3HM54GN7bTLtD8"},
    {"id":"ngunduh","title":"Ngunduh Mantu","day":"Sabtu","date":"4 Mei 2026","time":"19.00 WITA","venue":"Kediaman Mempelai Laki Laki","address":"Belakang Kantor Koramil 1401-02 Pamboang","map_url":"https://maps.app.goo.gl/8zuaWJzY8vCa1Lfa8"}
  ]'::jsonb,
  -- Dress Code
  dress_code_title TEXT DEFAULT 'Colorful Pastel',
  dress_code_colors JSONB DEFAULT '["Lilac","Baby Blue","Mint Green","Blush Pink"]'::jsonb,
  dress_code_note TEXT DEFAULT 'Tanpa mengurangi rasa hormat, harap gunakan salah satu warna dari Dress Code di atas. Kombinasi warna diperbolehkan selama masih dalam tone yang senada. Mohon hindari dress code putih, hitam penuh & merah mencolok',
  -- Love Story (JSON array)
  love_story JSONB DEFAULT '[
    {"id":"1","title":"Pertemuan Pertama","date":"12 April 2019","description":"Lorem Ipsum is simply dummy text of the printing and typesetting industry."},
    {"id":"2","title":"Lamaran","date":"12 April 2023","description":"Lorem Ipsum is simply dummy text of the printing and typesetting industry."},
    {"id":"3","title":"Menikah","date":"04 Mei 2026","description":"Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
  ]'::jsonb,
  -- Gallery (array of image URLs)
  gallery JSONB DEFAULT '[]'::jsonb,
  -- Wedding Gift
  gift_intro TEXT DEFAULT 'Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.',
  bank_accounts JSONB DEFAULT '[
    {"bank":"Kondanganmu ID","number":"081219108932","name":""},
    {"bank":"Kondanganmu ID","number":"123456","name":""}
  ]'::jsonb,
  gift_address TEXT DEFAULT 'Putraa - +62 8500000000 - btn dutamas blok D/6',
  gift_qr_url TEXT,
  -- Closing
  closing_text TEXT DEFAULT 'Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan doa restu kepada kami',
  -- Music
  music_url TEXT,
  video_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure only one settings row
CREATE UNIQUE INDEX IF NOT EXISTS invitation_settings_singleton ON invitation_settings ((true));

-- Insert default row if empty
INSERT INTO invitation_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM invitation_settings);

-- Wishes / Ucapan & Doa
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  attendance TEXT DEFAULT 'hadir', -- hadir | tidak | ragu
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE invitation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Public can read settings
CREATE POLICY "Public read settings"
  ON invitation_settings FOR SELECT
  USING (true);

-- Public can insert wishes
CREATE POLICY "Public insert wishes"
  ON wishes FOR INSERT
  WITH CHECK (true);

-- Public can read wishes
CREATE POLICY "Public read wishes"
  ON wishes FOR SELECT
  USING (true);

-- Admin (service role / authenticated) can update settings & delete wishes
-- For simplicity we use service role key on server-side API routes.
-- If you want client-side admin auth later, add Supabase Auth + policies.

-- Storage bucket for photos (run in dashboard or via API)
-- Bucket name: wedding-photos (public)
-- Policies: public read, authenticated upload

-- ============================================================
-- STORAGE: Run these AFTER creating bucket "wedding-photos"
-- in Dashboard > Storage > New bucket (Public: ON)
-- ============================================================

-- Allow public read
-- CREATE POLICY "Public read wedding photos"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'wedding-photos');

-- Allow service role upload (handled via service key on server)
-- No extra policy needed if using service_role key
