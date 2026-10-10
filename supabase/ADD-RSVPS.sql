-- ============================================================
-- Konfirmasi Kehadiran (RSVP) — tabel TERPISAH dari ucapan & doa
-- Jalankan di Supabase > SQL Editor
-- ============================================================
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  attendance TEXT NOT NULL DEFAULT 'hadir', -- hadir | tidak
  guests INTEGER NOT NULL DEFAULT 1,        -- jumlah orang yang datang
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert rsvps" ON rsvps;
CREATE POLICY "Public insert rsvps" ON rsvps FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read rsvps" ON rsvps;
CREATE POLICY "Public read rsvps" ON rsvps FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public delete rsvps" ON rsvps;
CREATE POLICY "Public delete rsvps" ON rsvps FOR DELETE USING (true);
