-- ============================================================
-- Foto zoom + Momen (foto/video saat scroll) — jalankan SEKALI
-- Supabase > SQL Editor > paste > Run
-- ============================================================
ALTER TABLE invitation_settings
  ADD COLUMN IF NOT EXISTS expand_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS moments JSONB DEFAULT '[]'::jsonb;
