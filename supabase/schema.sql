-- ============================================================
-- Wedding Invitation - Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Settings (single row for the whole invitation content)
CREATE TABLE IF NOT EXISTS invitation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Couple
  groom_name TEXT,
  groom_full_name TEXT,
  groom_parents TEXT,
  groom_instagram TEXT,
  bride_name TEXT,
  bride_full_name TEXT,
  bride_parents TEXT,
  bride_instagram TEXT,
  hashtag TEXT,
  -- Cover
  cover_title TEXT,
  wedding_date DATE,
  opening_quote TEXT,
  opening_quote_source TEXT,
  greeting TEXT,
  -- Photos (public URLs from Supabase Storage)
  logo_url TEXT,
  cover_photo_url TEXT,
  groom_photo_url TEXT,
  bride_photo_url TEXT,
  -- Events (JSON array)
  events JSONB DEFAULT '[]'::jsonb,
  -- Dress Code
  dress_code_title TEXT,
  dress_code_colors JSONB DEFAULT '[]'::jsonb,
  dress_code_note TEXT,
  -- Love Story (JSON array)
  love_story JSONB DEFAULT '[]'::jsonb,
  -- Gallery (array of image URLs)
  gallery JSONB DEFAULT '[]'::jsonb,
  -- Wedding Gift
  gift_intro TEXT,
  bank_accounts JSONB DEFAULT '[]'::jsonb,
  gift_address TEXT,
  gift_qr_url TEXT,
  -- Closing
  closing_text TEXT,
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
  attendance TEXT DEFAULT 'hadir', -- hadir | tidak
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE invitation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Public can read settings
DROP POLICY IF EXISTS "Public read settings" ON invitation_settings;
CREATE POLICY "Public read settings"
  ON invitation_settings FOR SELECT
  USING (true);

-- Public can insert wishes
DROP POLICY IF EXISTS "Public insert wishes" ON wishes;
CREATE POLICY "Public insert wishes"
  ON wishes FOR INSERT
  WITH CHECK (true);

-- Public can read wishes
DROP POLICY IF EXISTS "Public read wishes" ON wishes;
CREATE POLICY "Public read wishes"
  ON wishes FOR SELECT
  USING (true);

-- Public can delete wishes (admin panel client-side; protect with app password)
DROP POLICY IF EXISTS "Public delete wishes" ON wishes;
CREATE POLICY "Public delete wishes"
  ON wishes FOR DELETE
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


-- ============================================================
-- MIGRATION (jalankan jika tabel sudah ada sebelumnya)
-- ============================================================
ALTER TABLE invitation_settings
  ADD COLUMN IF NOT EXISTS hero_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS wedding_date_label TEXT,
  ADD COLUMN IF NOT EXISTS cover_photos JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hero_photos JSONB DEFAULT '[]'::jsonb;

-- Izinkan update dari client (admin password dilindungi di aplikasi)
-- HAPUS policy lama dulu jika error "already exists"
DROP POLICY IF EXISTS "Public update settings" ON invitation_settings;
CREATE POLICY "Public update settings"
  ON invitation_settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert settings" ON invitation_settings;
CREATE POLICY "Public insert settings"
  ON invitation_settings FOR INSERT
  WITH CHECK (true);

-- Storage policies (bucket wedding-photos harus Public)
DROP POLICY IF EXISTS "Public read wedding photos" ON storage.objects;
CREATE POLICY "Public read wedding photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Public upload wedding photos" ON storage.objects;
CREATE POLICY "Public upload wedding photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'wedding-photos');

DROP POLICY IF EXISTS "Public update wedding photos" ON storage.objects;
CREATE POLICY "Public update wedding photos"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'wedding-photos');
