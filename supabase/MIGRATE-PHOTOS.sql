-- Jalankan sekali di Supabase SQL Editor (jika project sudah jalan)
ALTER TABLE invitation_settings
  ADD COLUMN IF NOT EXISTS cover_photos JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hero_photos JSONB DEFAULT '[]'::jsonb;
